"use strict";
/*-----------------------------------------------------------------------------------------
 interface
 -----------------------------------------------------------------------------------------*/
var impGameOperation = impCommunicate.extend({
    __init__: function () {
        this._super();
        this.isPlayingStartAnimation = 0;
        this.diceList = [[0, 0], [0, 0], [0, 0], [0, 0]];
        KBEngine.DEBUG_MSG("Create impRoomOperation");
    },

    startGame: function (dealerIdx, discardIdx, keyCard, cards) {
        cc.log("startGame");
        cc.log(dealerIdx, discardIdx, keyCard, cards);

        if (!this.curGameRoom) {
            return;
        }
        cc.log(this.serverSeatNum);
        //重置
        this.curGameRoom.startGame();
        this.curGameRoom.playerPokerList[this.serverSeatNum] = cards;
        cc.audioEngine.playEffect("res/sound/voice/Nomal/start.mp3");

        this.curGameRoom.waitIdx = discardIdx;
        this.curGameRoom.controllerIdx = discardIdx;
        this.curGameRoom.dealerIdx = dealerIdx;
        this.curGameRoom.keyCard = keyCard;

        if (h1global.curUIMgr.gameroomprepare_ui) {
            h1global.curUIMgr.gameroomprepare_ui.hide();
        }
        // this.isPlayingStartAnimation = 1
        if (h1global.curUIMgr.gameroom_ui) {
            h1global.curUIMgr.gameroom_ui.show();
        }
        if (h1global.curUIMgr.gameroominfo_ui) {
            h1global.curUIMgr.gameroominfo_ui.update_round();
            h1global.curUIMgr.gameroominfo_ui.update_return_out_btn();
            h1global.curUIMgr.gameroominfo_ui.update_key_card_panel();
        }
        if (h1global.curUIMgr.gameconfig_ui && h1global.curUIMgr.gameconfig_ui.is_show) {
            h1global.curUIMgr.gameconfig_ui.update_state();
        }
        // // 关闭结算界面
        if (h1global.curUIMgr.settlement_ui) {
            h1global.curUIMgr.settlement_ui.hide();
        }
        if (h1global.curUIMgr.result_ui) {
            h1global.curUIMgr.result_ui.hide();
        }

        if (h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show) {
            h1global.curUIMgr.gameroom_ui.update_hand_card_panel();
            h1global.curUIMgr.gameroom_ui.update_opration_panel();
            // h1global.curUIMgr.gameroom_ui.update_below_cards_panel(cards, 1);
            h1global.curUIMgr.gameroom_ui.update_identity_image(dealerIdx);
            cc.log("dealerIdx :" + dealerIdx + "  cards: " + this.curGameRoom.playerPokerList[dealerIdx].length);
            // h1global.curUIMgr.gameroom_ui.update_player_card_num(this.server2CurSitNum(dealerIdx), this.curGameRoom.playerPokerList[dealerIdx].length);
            h1global.curUIMgr.gameroom_ui.show_yellow_frame(discardIdx);
            h1global.curUIMgr.gameroom_ui.show_if_onlycard(this.server2CurSitNum(dealerIdx), this.curGameRoom.playerPokerList[dealerIdx].length);
            h1global.curUIMgr.gameroom_ui.show_cover();
            h1global.curUIMgr.gameroom_ui.update_gameForce();
            // h1global.curUIMgr.gameroom_ui.update_not_afford();
            this.getTipsCards(0);
        }
    },

    readyForNextRound: function (serverSeatNum) {
        if (!this.curGameRoom) {
            return;
        }
        this.curGameRoom.updatePlayerState(serverSeatNum, 1);
        if (h1global.curUIMgr.gameroomprepare_ui && h1global.curUIMgr.gameroomprepare_ui.is_show) {
            h1global.curUIMgr.gameroomprepare_ui.update_player_state(serverSeatNum, 1);
        }
    },

    cancelReady: function (serverSeatNum) {
        if (!this.curGameRoom) {
            return;
        }
        this.curGameRoom.updatePlayerState(serverSeatNum, 0);
        if (h1global.curUIMgr.gameroomprepare_ui && h1global.curUIMgr.gameroomprepare_ui.is_show) {
            h1global.curUIMgr.gameroomprepare_ui.update_player_state(serverSeatNum, 0);
        }
    },

    postMultiOperation: function (idx_list, aid_list, tile_list) {
        // 用于特殊处理多个人同时胡牌的情况
        if (h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show) {
            for (var i = 0; i < idx_list.length; i++) {
                h1global.curUIMgr.gameroom_ui.playOperationEffect(const_val.OP_KONG_WIN, idx_list[i]);
            }
        }
        // if(this.curGameRoom.playerInfoList[serverSeatNum]["sex"] === 1){
        // 	cc.audioEngine.playEffect("res/sound/voice/male/sound_man_win.wav");
        // } else {
        cc.audioEngine.playEffect("res/sound/voice/female/sound_woman_win.mp3");
        // }
    },

    postOperation: function (serverSeatNum, aid, cards, isAuto) {
        cc.log("postOperation: ", serverSeatNum, aid, cards, isAuto);
        if (!this.curGameRoom) {
            return;
        }
        if (aid === const_val.OP_PASS) {
            if (h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show) {
                if (serverSeatNum === this.serverSeatNum) {
                    h1global.curUIMgr.gameroom_ui.update_hand_card_panel()
                }
                if (isAuto === 1) {
                    h1global.curUIMgr.gameroom_ui.hide_operation_panel();
                }
                var soundIdx = cutil.randomContainBorder(1, 4);
                if (this.curGameRoom.playerInfoList[serverSeatNum]["sex"] === 1) {
                    cc.audioEngine.playEffect("res/sound/voice/CardType/Male/buyao" + soundIdx.toString() + ".mp3");
                } else {
                    cc.audioEngine.playEffect("res/sound/voice/CardType/Female/buyao" + soundIdx.toString() + ".mp3");
                }
            } else if (h1global.curUIMgr.gameroomback_ui && h1global.curUIMgr.gameroomback_ui.is_show) {
                h1global.curUIMgr.gameroomback_ui.update_back_no_discards(serverSeatNum)
            }
        } else if (aid === const_val.OP_DISCARD) {
            if (isAuto === 1) {
                var cardsType = cutil.getNormalCardsType(cutil.rightShiftCards(cards));
                this.curGameRoom.deskPokerList[serverSeatNum] = cards;
                this.curGameRoom.discardList[serverSeatNum] = this.curGameRoom.discardList[serverSeatNum].concat(cards);
                cc.log("===================   ", serverSeatNum, this.serverSeatNum);
                if (serverSeatNum === this.serverSeatNum) {
                    var gameMode = this.curGameRoom.gameMode;
                    if (gameMode === 2) {
                        var origin_cards = [];
                        for (var i = 0; i < cards.length; i++) {
                            if (const_val.INSTEAD.indexOf(cards[i]) >= 0) {
                                origin_cards.push(this.curGameRoom.keyCard)
                            } else {
                                origin_cards.push(cards[i])
                            }
                        }
                        for (var i = 0; i < origin_cards.length; i++) {
                            var index = this.curGameRoom.playerPokerList[this.serverSeatNum].indexOf(origin_cards[i]);
                            this.curGameRoom.playerPokerList[this.serverSeatNum].splice(index, 1)
                        }
                    } else {
                        for (var i = 0; i < cards.length; i++) {
                            var index = this.curGameRoom.playerPokerList[this.serverSeatNum].indexOf(cards[i]);
                            this.curGameRoom.playerPokerList[this.serverSeatNum].splice(index, 1)
                        }
                    }
                    if (h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show) {
                        h1global.curUIMgr.gameroom_ui.hide_operation_panel();
                        // h1global.curUIMgr.gameroom_ui.prepareCards = [];
                        // h1global.curUIMgr.gameroom_ui.update_hand_card_panel();
                    }
                    cc.log("玩家" + String(serverSeatNum) + "出牌:" + String(cards) + "剩余:" + String(this.curGameRoom.playerPokerList[serverSeatNum]))
                } else {
                    this.curGameRoom.playerPokerList[serverSeatNum].splice(0, cards.length)
                }
                if (h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show) {
                    h1global.curUIMgr.gameroom_ui.update_player_card_num(this.server2CurSitNum(serverSeatNum), this.curGameRoom.playerPokerList[serverSeatNum].length);
                    h1global.curUIMgr.gameroom_ui.update_discard_card_panel(this.server2CurSitNum(serverSeatNum), cards);
                    h1global.curUIMgr.gameroom_ui.playCardsEffect(this.curGameRoom.playerInfoList[serverSeatNum]["sex"], cards, cardsType);
                    h1global.curUIMgr.gameroom_ui.playLeftsCardsEffect(this.curGameRoom.playerInfoList[serverSeatNum]["sex"], this.curGameRoom.playerPokerList[serverSeatNum].length);
                    h1global.curUIMgr.gameroom_ui.show_if_onlycard(this.server2CurSitNum(serverSeatNum), this.curGameRoom.playerPokerList[serverSeatNum].length);
                }
                this.curGameRoom.controllerIdx = serverSeatNum;
                this.curGameRoom.controller_discard_list = cards;
            } else {
                if (cutil.getCanPlay(cutil.rightShiftCards(cards), this.curGameRoom.playerPokerList[serverSeatNum], this.curGameRoom.gamePlays)) {
                    var cardsType = cutil.getNormalCardsType(cutil.rightShiftCards(cards));
                    this.curGameRoom.deskPokerList[serverSeatNum] = cards;
                    this.curGameRoom.discardList[serverSeatNum] = this.curGameRoom.discardList[serverSeatNum].concat(cards);
                    cc.log("=========   ", this.serverSeatNum);
                    if (serverSeatNum === this.serverSeatNum) {
                        var gameMode = this.curGameRoom.gameMode;
                        if (gameMode === 2) {
                            var origin_cards = [];
                            for (var i = 0; i < cards.length; i++) {
                                if (const_val.INSTEAD.indexOf(cards[i]) >= 0) {
                                    origin_cards.push(this.curGameRoom.keyCard)
                                } else {
                                    origin_cards.push(cards[i])
                                }
                            }
                            for (var i = 0; i < origin_cards.length; i++) {
                                var index = this.curGameRoom.playerPokerList[this.serverSeatNum].indexOf(origin_cards[i]);
                                this.curGameRoom.playerPokerList[this.serverSeatNum].splice(index, 1)
                            }
                        } else {
                            for (var i = 0; i < cards.length; i++) {
                                var index = this.curGameRoom.playerPokerList[this.serverSeatNum].indexOf(cards[i]);
                                this.curGameRoom.playerPokerList[this.serverSeatNum].splice(index, 1)
                            }
                        }
                        if (h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show) {
                            h1global.curUIMgr.gameroom_ui.prepareCards = [];
                            h1global.curUIMgr.gameroom_ui.update_hand_card_panel();
                        }
                        cc.log("玩家" + String(serverSeatNum) + "出牌:" + String(cards) + "剩余:" + String(this.curGameRoom.playerPokerList[serverSeatNum]))
                    } else {
                        this.curGameRoom.playerPokerList[serverSeatNum].splice(0, cards.length)
                    }
                    if (h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show) {
                        h1global.curUIMgr.gameroom_ui.update_player_card_num(this.server2CurSitNum(serverSeatNum), this.curGameRoom.playerPokerList[serverSeatNum].length);
                        h1global.curUIMgr.gameroom_ui.update_discard_card_panel(this.server2CurSitNum(serverSeatNum), this.chansferShowCards(cards, cardsType));
                        h1global.curUIMgr.gameroom_ui.playCardsEffect(this.curGameRoom.playerInfoList[serverSeatNum]["sex"], cards, cardsType);
                        h1global.curUIMgr.gameroom_ui.playLeftsCardsEffect(this.curGameRoom.playerInfoList[serverSeatNum]["sex"], this.curGameRoom.playerPokerList[serverSeatNum].length);
                        h1global.curUIMgr.gameroom_ui.show_if_onlycard(this.server2CurSitNum(serverSeatNum), this.curGameRoom.playerPokerList[serverSeatNum].length);
                    } else if (h1global.curUIMgr.gameroomback_ui && h1global.curUIMgr.gameroomback_ui.is_show) {
                        h1global.curUIMgr.gameroomback_ui.update_back_discard_card_panel(serverSeatNum, this.server2CurSitNum(serverSeatNum), this.chansferShowCards(cards, cardsType));
                        h1global.curUIMgr.gameroomback_ui.update_back_hand_card_panel(serverSeatNum, cards);
                    }
                    this.curGameRoom.controllerIdx = serverSeatNum;
                    this.curGameRoom.controller_discard_list = cards
                } else {
                    // 炸弹不可拆
                    cc.log("炸弹不可拆");
                }
            }
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

    selfPostOperation: function (aid, cards) {
        // 由于自己打的牌自己不需要经服务器广播给自己，因而只要在doOperation时，自己postOperation给自己
        // 而doOperation和postOperation的参数不同，这里讲doOperation的参数改为postOperation的参数
        var cards_list = [];
        cards_list = cards_list.concat(cards);
        if (aid === const_val.OP_PASS) {

        } else if (aid === const_val.OP_DISCARD) {

        }
        // 用于转换doOperation到postOperation的参数
        this.postOperation(this.serverSeatNum, aid, cards_list, 0);
    },

    doOperation: function (aid, cards_list) {
        cc.log("doOperation: ", aid, cards_list);
        if (!this.curGameRoom) {

        }
    },

    doOperationFailed: function (err) {
        cc.log("doOperationFailed: " + err.toString());
        switch (err) {
            case 1:
                cc.log("doOperationFailed 非当前控牌玩家");
                break;
            case 2:
                cc.log("doOperationFailed 操作非法");
                break;
            case 3:
                cc.log("doOperationFailed 操作超时");
                break;
            case 4:
                cc.log("doOperationFailed 首张牌必须出黑3");
                break;
            case const_val.GROUP_PMSN_LIMIT:
                h1global.curUIMgr.uniontip_ui.show_name(const_val.GROUP_PMSN_LIMIT);
                break;
            case const_val.GROUP_NOT_EXIT:
                h1global.curUIMgr.uniontip_ui.show_name(const_val.GROUP_NOT_EXIT);
                break;
            case const_val.PLAYER_NOT_EXIT:
                h1global.curUIMgr.uniontip_ui.show_name(const_val.PLAYER_NOT_EXIT);
                break;
            case const_val.MEM_UP_LIMIT:
                h1global.curUIMgr.uniontip_ui.show_name(const_val.MEM_UP_LIMIT);
                break;
            case const_val.MEM_IN_GROUP:
                h1global.curUIMgr.uniontip_ui.show_name(const_val.MEM_IN_GROUP);
                break;
            case const_val.MEM_NOT_IN_GROUP:
                h1global.curUIMgr.uniontip_ui.show_name(const_val.MEM_NOT_IN_GROUP);
                break;
            case const_val.TEAM_MEM_UP_LIMIT:
                h1global.curUIMgr.uniontip_ui.show_name(const_val.TEAM_MEM_UP_LIMIT);
                break;
            case const_val.TEAM_PMSN_LIMIT:
                h1global.curUIMgr.uniontip_ui.show_name(const_val.TEAM_PMSN_LIMIT);
                break;
            case const_val.TEAM_STATE_ERROR:
                h1global.curUIMgr.uniontip_ui.show_name(const_val.TEAM_STATE_ERROR);
                break;
            case const_val.TEAM_NOT_EXIST:
                h1global.curUIMgr.uniontip_ui.show_name(const_val.TEAM_NOT_EXIST);
                break;
            case const_val.TEAM_STATE_INVALID:
                h1global.curUIMgr.uniontip_ui.show_name(const_val.TEAM_STATE_INVALID);
                break;
            case const_val.TEAM_ROOM_ARGS_ERROR:
                h1global.curUIMgr.uniontip_ui.show_name(const_val.TEAM_ROOM_ARGS_ERROR);
                break;
            case const_val.TEAM_MEM_EXIT:
                h1global.curUIMgr.uniontip_ui.show_name(const_val.TEAM_MEM_EXIT);
                break;
            case const_val.TEAM_MEM_NOT_EXIT:
                h1global.curUIMgr.uniontip_ui.show_name(const_val.TEAM_MEM_NOT_EXIT);
                break;
            case const_val.ROOM_GROUP_NOT_EXIT:
                h1global.curUIMgr.uniontip_ui.show_name(const_val.ROOM_GROUP_NOT_EXIT);
                break;
            case const_val.ROOM_GROUP_IS_PLAYING:
                h1global.curUIMgr.uniontip_ui.show_name(const_val.ROOM_GROUP_IS_PLAYING);
                break;
            case const_val.ROOM_GROUP_PMSN_LIMIT:
                h1global.curUIMgr.uniontip_ui.show_name(const_val.ROOM_GROUP_PMSN_LIMIT);
                break;
            case const_val.TEAM_NOT_OWNER:
                h1global.curUIMgr.uniontip_ui.show_name(const_val.TEAM_NOT_OWNER);
                break;
            default:
                break;
        }
    },

    confirmOperation: function (aid, cards_list, instead_list) {
        cc.log("confirmOperation", aid, cards_list, instead_list);

        if (!this.curGameRoom) {
            return;
        }
        // for (var i = 0; i < cards_list.length; i++) {
        //     var index = this.curGameRoom.playerPokerList[this.serverSeatNum].indexOf(cards_list[i]);
        //     this.curGameRoom.playerPokerList[this.serverSeatNum].splice(index, 1)
        // }
        // 自己的操作直接本地执行，不需要广播给自己
        var is_auto = 0; //判断是否是自己本人或电脑操作
        this.curGameRoom.waitIdx = -1;
        h1global.curUIMgr.gameroom_ui.hide_operation_panel();
        //this.selfPostOperation(aid, instead_list);
        this.baseCall("confirmOperation", aid, cards_list, is_auto);
    },

    waitForOperation: function (waitIdx, aid, cards) {
        cc.log("waitForOperation", waitIdx, aid, cards);
        if (!this.curGameRoom) {
            return;
        }
        this.curGameRoom.waitIdx = waitIdx;
        this.curGameRoom.deskPokerList[waitIdx] = [];
        if (h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show) {
            //显示黄框
            h1global.curUIMgr.gameroom_ui.show_yellow_frame(waitIdx);
        }
        this.curGameRoom.waitIdx = waitIdx;
        this.curGameRoom.deskPokerList[waitIdx] = [];
        if (aid === const_val.OP_DISCARD) {
            if (h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show) {
                if (waitIdx === this.serverSeatNum) {
                    h1global.curUIMgr.gameroom_ui.update_opration_panel();
                    h1global.curUIMgr.gameroom_ui.update_gameForce();
                    h1global.curUIMgr.gameroom_ui.canAutoPlayCard();

                    //h1global.curUIMgr.gameroom_ui.update_pre_discard();
                    this.getTipsCards(1);
                    h1global.curUIMgr.gameroom_ui.show_cover();
                }
                h1global.curUIMgr.gameroom_ui.update_no_discards(const_val.PDK_DEFALUT);
                h1global.curUIMgr.gameroom_ui.update_discard_card_panel(this.server2CurSitNum(waitIdx), [])
            }
        } else if (aid === const_val.OP_PASS) {
            if (h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show) {
                if (waitIdx === this.serverSeatNum) {
                    h1global.curUIMgr.gameroom_ui.hide_operation_panel();
                    h1global.curUIMgr.gameroom_ui.update_anticheating();
                    h1global.curUIMgr.gameroom_ui.update_not_afford();
                    this.getTipsCards(1);
                    h1global.curUIMgr.gameroom_ui.show_cover();
                }
                h1global.curUIMgr.gameroom_ui.update_discard_card_panel(this.server2CurSitNum(waitIdx), [])
            }
        }
    },

    passDiscards: function (idx) {
        cc.log("passDiscards");
        if (!this.curGameRoom) {
            return;
        }
        if (h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show) {
            h1global.curUIMgr.gameroom_ui.update_no_discards(idx);
        }
    },

    roundResult: function (roundRoomInfo) {
        if (!this.curGameRoom) {
            return;
        }
        var self = this;
        if (h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show){
            h1global.curUIMgr.gameroom_ui.showLastCards(roundRoomInfo["win_idx"], roundRoomInfo["card_list"],function () {
                self.curGameRoom.endGame();
                self.resultShow(roundRoomInfo);
            });
        }
    },

    closeOtherLayer: function () {
        if (h1global.curUIMgr.gameplayerinfo_ui && h1global.curUIMgr.gameplayerinfo_ui.is_show) {
            h1global.curUIMgr.gameplayerinfo_ui.hide();
        } else if (h1global.curUIMgr.config_ui && h1global.curUIMgr.config_ui.is_show) {
            h1global.curUIMgr.config_ui.hide();
        } else if (h1global.curUIMgr.help_ui && h1global.curUIMgr.help_ui.is_show) {
            h1global.curUIMgr.help_ui.hide();
        } else if (h1global.curUIMgr.communicate_ui && h1global.curUIMgr.communicate_ui.is_show) {
            h1global.curUIMgr.communicate_ui.hide();
        } else if (h1global.curUIMgr.audiorecord_ui && h1global.curUIMgr.audiorecord_ui.is_show) {
            h1global.curUIMgr.audiorecord_ui.hide();
        }
    },

    resultShow: function (roundRoomInfo) {
        cc.log("resultShow ##############",this.curGameRoom.isPlayingGame);
        var playerInfoList = roundRoomInfo["player_info_list"];
        for (var i = 0; i < playerInfoList.length; i++) {
            this.curGameRoom.player_advance_info_list[i]["score"] = playerInfoList[i]["score"];
            this.curGameRoom.player_advance_info_list[i]["total_score"] = playerInfoList[i]["total_score"]
        }
        if (h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show) {
            if (h1global.curUIMgr.settlement_ui) {
                this.closeOtherLayer();
                h1global.curUIMgr.settlement_ui.show_by_info(roundRoomInfo);
            }
        }
    },

    finalResult: function (finalPlayerInfoList, roundRoomInfo, weeklyScoreList) {
        cc.log("finalResult", finalPlayerInfoList, roundRoomInfo);
        if (!this.curGameRoom) {
            return;
        }
        if (h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show) {
            h1global.curUIMgr.gameroom_ui.showLastCards(roundRoomInfo["win_idx"], roundRoomInfo["card_list"],function () {
                if (h1global.curUIMgr.settlement_ui) {
                    if (h1global.curUIMgr.applyclose_ui.is_show) {
                        h1global.curUIMgr.applyclose_ui.hide();
                    }
                    h1global.curUIMgr.settlement_ui.show_by_info(roundRoomInfo, function () {
                        if (h1global.curUIMgr.result_ui) {
                            h1global.curUIMgr.result_ui.show_by_info(finalPlayerInfoList, roundRoomInfo, weeklyScoreList);
                        }
                    });
                }
            });
        }
    },

    subTotalResult: function (finalPlayerInfoList, roomInfo, weekInfo) {
        cc.log("subTotalResult", finalPlayerInfoList, roomInfo);
        if (!this.curGameRoom) {
            return;
        }
        if (h1global.curUIMgr.applyclose_ui && h1global.curUIMgr.applyclose_ui.is_show) {
            h1global.curUIMgr.applyclose_ui.hide();
        }
        if (h1global.curUIMgr.result_ui) {
            h1global.curUIMgr.result_ui.show_by_info(finalPlayerInfoList, roomInfo, weekInfo);
        }
    },

    roundEndCallback: function () {
        if (!this.curGameRoom) {
            return;
        }
        this.baseCall("roundEndCallback");
    },

    notifyPlayerOnlineStatus: function (serverSeatNum, status) {
        if (!this.curGameRoom) {
            return;
        }
        this.curGameRoom.updatePlayerOnlineState(serverSeatNum, status);
        if (h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show) {
            h1global.curUIMgr.gameroom_ui.update_player_online_state(this.server2CurSitNum(serverSeatNum), status);
        }
    },

    reqRankingInfos: function () {
        this.baseCall("reqRankingInfos");
    },

    pushRankingInfos: function (info) {
        h1global.curUIMgr.leaderboard_ui.show_info(info);
    },

    reqIsAfford: function (waitIdx) {
        this.baseCall("reqIsAfford", waitIdx);
    },

    autoReady: function () {
        if (!this.curGameRoom) {
            return;
        }
        this.curGameRoom.updatePlayerState(this.serverSeatNum, 1);
        h1global.curUIMgr.gameroomprepare_ui.show();
        h1global.curUIMgr.gameroom_ui.hide();
        h1global.curUIMgr.settlement_ui.hide();
    }

});
