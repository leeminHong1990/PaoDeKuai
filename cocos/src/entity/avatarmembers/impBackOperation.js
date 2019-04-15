"use strict";
/*-----------------------------------------------------------------------------------------
 interface
 -----------------------------------------------------------------------------------------*/
let impBackOperation = impSportOperation.extend({
    __init__: function () {
        this._super();
    },

    createGamePlayBack: function (roomInfo, serverSitNum) {
        cc.log("createGamePlayBack ", roomInfo, serverSitNum);
        let initRoomInfo = roomInfo['init_info'];
        this.curGameRoom = new GameRoomEntity(initRoomInfo['playerNum']);
        this.curGameRoom.updateRoomData(initRoomInfo);
        this.serverSeatNum = serverSitNum;
        this.curGameRoom.playerStateList = roomInfo["player_state_list"];
        this.curGameRoom.curRound = this.curGameRoom.curRound - 1;
        let dealerIdx = initRoomInfo['dealerIdx'];
        this.curGameRoom.curPlayerSitNum = dealerIdx;
        let init_cards = roomInfo['init_cards'] ? cutil.deepCopy(roomInfo['init_cards']) : undefined;
        this.curGameRoom.handCardsList = [];
        for (let i = 0; i < init_cards.length; i++) {
            this.curGameRoom.handCardsList[i] = init_cards[i];
            if (i === dealerIdx) {
                this.curGameRoom.handCardsList[i].pop();
            }
        }
        this.curGameRoom.round_result = roomInfo['round_result'];
        //
        this.curGameRoom.init_info = roomInfo['init_info'];
        this.curGameRoom.op_record_list = roomInfo['op_record_list'];
        this.curGameRoom.start_time = roomInfo['start_time'];
        this.curGameRoom.roomID = this.curGameRoom.init_info['roomID'];
        this.curGameRoom.keyCard = roomInfo['key_card'];
    },

    convertJsonValues: function (data) {
        cc.log("convertJsonValues ", typeof(data));
        var init_info = data["init_info"];
        for (let i = 0; i < init_info["player_base_info_list"].length; i++) {
            let userId = init_info["player_base_info_list"][i].userId;
            init_info["player_base_info_list"][i].userId = new KBEngine.UINT64(userId, 0);
            let uuid = init_info["player_base_info_list"][i].uuid;
            init_info["player_base_info_list"][i].uuid = new KBEngine.UINT64(uuid, 0);
        }
    },

    //客户端回看申请
    reqPlayback: function (recordId) {
        cc.log("reqPlayback ", recordId);
        let data = cc.sys.localStorage.getItem('record_' + recordId);
        if (data && cc.isString(data) && data.length > 0) {
            try {
                let info = eval("(" + data + ")");
                if (parseInt(info['recordId']) === recordId) {
                    this.convertJsonValues(info);
                    this.playBackGame(info);
                    return;
                }
            } catch (exception) {
                cc.log(exception);
            }
        }
        this.baseCall('queryRecord', recordId);
        cutil.lock_ui();
    },

    //服务端查看回看记录结果
    queryRecordResult: function (json_str) {
        try {
            let info = eval("(" + json_str + ")");
            cc.log("queryRecordResult", info);
            cc.sys.localStorage.setItem('record_' + info['recordId'], json_str);
            cutil.unlock_ui();
            this.convertJsonValues(info);
            this.playBackGame(info);
        } catch (exception) {
            cc.log(exception);
        }
    },

    queryRecordFailed: function (code) {
        cc.log('queryRecordFailed ', code);
        cutil.unlock_ui();
        h1global.globalUIMgr.info_ui.show_by_info("回放码错误！");
    },

    playBackGame: function (roomInfo) {
        cc.log("playBackGame ", roomInfo);
        this.originRoomInfo = roomInfo;
        var isRoomBack = true;
        // 获取本地信息
        var info_dict = eval('(' + cc.sys.localStorage.getItem("INFO_JSON") + ')');
        for (let i = 0; i < roomInfo["player_id_list"].length; i++) {
            cc.log(roomInfo["player_id_list"][i][0] + "   " + info_dict["user_id"]);
            if (roomInfo["player_id_list"][i][0] === parseInt(info_dict["user_id"])) {
                this.createGamePlayBack(roomInfo, roomInfo["player_id_list"][i][1]);
                h1global.curUIMgr.gameroomback_ui.show(function () {
                    h1global.curUIMgr.gameroomback_ui.startPlayBack();
                    isRoomBack = false;
                });
                break;
            }
        }

        if (isRoomBack){
            this.createGamePlayBack(roomInfo, 0);
            h1global.curUIMgr.gameroomback_ui.show(function () {
                h1global.curUIMgr.gameroomback_ui.startPlayBack();
            });
        }

    },

    replayGame: function (callback) {
        if (!this.originRoomInfo) {
            cc.error("replay game: room info undefined");
            return;
        }
        cc.log("replay game");
        this.createGamePlayBack(this.originRoomInfo, 0);
    },

    waitForOperationFromNext: function (serverSitNum, aid, tileList) {
        cc.log("waitForOperationFromNext ", serverSitNum, aid, tileList);
        if (!this.curGameRoom) return;
        this.curGameRoom.waitAidList = [aid];
        if (h1global.curUIMgr.roomLayoutMgr) {
            h1global.curUIMgr.roomLayoutMgr.notifyObserver(const_val.GAME_ROOM_UI_NAME, "update_playback_operation_panel",
                serverSitNum, this.getWaitOpDict([aid], tileList), aid, const_val.SHOW_CONFIRM_OP);
        }
    },

    //由于服务端不能判断摸到牌时的操作，所以摸牌时显示操作面板使用本地判断
    nextOp: function () {
        let command = this.curGameRoom.lastCommand;
        if (command) return command.aid;
        return undefined;
    },

    server2CurSitNum: function (serverSeatNum) {
        if (this.curGameRoom) {
            if (this.curGameRoom.playerNum === 2) {
                if (serverSeatNum < 2) {
                    if ((serverSeatNum + this.curGameRoom.playerInfoList.length - this.serverSeatNum) % this.curGameRoom.playerInfoList.length === 1) {
                        return 1
                    }
                    return (serverSeatNum + this.curGameRoom.playerInfoList.length - this.serverSeatNum) % this.curGameRoom.playerInfoList.length;
                }
                return -1
            }
            if (this.curGameRoom.playerNum === 3 && (serverSeatNum + this.curGameRoom.playerInfoList.length - this.serverSeatNum) % this.curGameRoom.playerInfoList.length === 2) {
                return 3
            }
            return (serverSeatNum + this.curGameRoom.playerInfoList.length - this.serverSeatNum) % this.curGameRoom.playerInfoList.length;
        } else {
            return -1;
        }
    },

    chansferShowCards: function (cards, cardsType) {
        if (cardsType === 11) {
            cards.sort(function (a, b) {
                return a - b
            });
            var shiftCards = cutil.rightShiftCards(cards);
            if (shiftCards.indexOf(const_val.CARD2) >= 0) {
                var index = 0;
                for (var i = 0; i < shiftCards.length - 1; i++) {
                    if (const_val.CIRCLE.indexOf(shiftCards[i]) + 1 !== const_val.CIRCLE.indexOf(shiftCards[i + 1]) && const_val.CIRCLE.indexOf(shiftCards[i]) !== const_val.CIRCLE.indexOf(shiftCards[i + 1])) {
                        index = i + 1
                    }
                }
                if (index > 0) {
                    var newList = cards.slice(index, cards.length);
                    newList = newList.concat(cards.slice(0, index));
                    return newList
                }
            }
        }
        return cards
    },

});
