"use strict";
let GameRoomBackUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/GameRoomBackUI.json";
        this.timeScale = 0;
        this.step_interval = 1;
        this.timeScaleList = [1, 2, 4]
    },

    initUI: function () {
        let self = this;
        let curGameRoom = h1global.entityManager.player().curGameRoom;
        let player = h1global.entityManager.player();

        this.commands = [];
        this.handCards = curGameRoom.handCardsList;
        this.copyHandCards = cutil.deepCopy(this.handCards);
        this.roomId = curGameRoom.roomID;
        this.round_result = curGameRoom.round_result;
        this.op_record_list = curGameRoom.op_record_list;
        this.dealerIdx = curGameRoom.dealerIdx;
        this.start_time = curGameRoom.start_time;
        this.player_num = curGameRoom.playerNum;
        this.play_back_panel = this.rootUINode.getChildByName("play_back_panel");

        for (let i = 0; i < this.player_num; i++) {
            let deskSeat = player.server2CurSitNum(i);
            this.update_back_hand_card_panel(i);
            this.update_back_player_info(deskSeat, player.curGameRoom.playerInfoList[i], this.round_result["player_info_list"][i]);
        }

        // 出牌
        this.update_waitIdx(player.curGameRoom.waitIdx);
        // 房间信息
        this.init_room_back_info();
        this.init_room_back_operation();

        cc.log("op_record_list  ",this.op_record_list);
        this.put_back_opList(this.op_record_list);
    },

    put_back_opList: function (op_list) {
        cc.log("put_back_opList ", op_list);
        for (let i = 0; i < op_list.length; i++) {
            let command = {};
            let obj = op_list[i];
            command.serverSitNum = obj[0];
            command.aid = obj[1];
            command.keytileList = obj[2];
            command.index = i;
            command.tileList = obj[3];
            this.commands.push(command);
        }
        this.commands.reverse();
        this.totalCommand = this.commands.length;
        cc.log("put_back_opList ", this.commands, this.totalCommand);
    },

    startPlayBack: function () {
        cc.log("startPlayBack");
        let self = this;
        this.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(function () {
            self.resumePlayback();
        })))
    },

    resumePlayback: function () {
        cc.log("resumePlayback");
        let self = this;
        self.runAction(cc.repeatForever(cc.sequence(cc.delayTime(this.step_interval), cc.callFunc(function () {
            self.doPlayBackNext()
        }))))
    },

    doPlayBackNext: function () {
        let commands = this.commands;
        cc.log("doPlayBackNext ", commands);
        var player = h1global.entityManager.player();
        if (commands.length > 0) {
            this.update_back_speed();
            let command = commands.pop();
            let player = h1global.entityManager.player();
            if (commands.length > 0) {
                player.curGameRoom.lastCommand = commands[commands.length - 1];
            }
            cc.log("doPlayBackNext ", command);
            if (command.aid === const_val.OP_PASS) {
                this.update_back_no_discards(command.serverSitNum)
            } else if (command.aid === const_val.OP_DISCARD) {
                var cardsType = cutil.getNormalCardsType(cutil.rightShiftCards(command.tileList));
                this.update_back_discard_card_panel(command.serverSitNum,player.server2CurSitNum(command.serverSitNum), player.chansferShowCards(command.tileList, cardsType));
                this.update_back_hand_card_panel(command.serverSitNum,command.keytileList);
            }
        }else{
            cc.log("回看完成-----------");
            this.update_back_speed();
            this.playBackComplete();
        }
    },

    update_back_speed: function () {
        let rateIdx = cc.formatStr('%d/%d', this.totalCommand - this.commands.length, this.totalCommand);
        let speed =  Math.max(1, this.timeScale * 2);
        let schedule_panel = this.play_back_panel.getChildByName("schedule_panel");
        let schedule_label = schedule_panel.getChildByName("schedule_label");
        schedule_label.setString("进度：" + rateIdx+"  快进 x" +speed);
    },

    //暂停回看
    pausePlayBack: function () {
        this.stopPlayback()
    },

    //停止回看
    stopPlayback: function () {
        this.stopAllActions();
    },

    //重置回看
    replay: function () {
        this.resetTimeScale();
        this.stopPlayback();
        this.commands = [];
        this.put_back_opList(this.op_record_list);
        this.update_back_speed();
        this.copyHandCards = cutil.deepCopy(this.handCards);
        for (let i = 0; i < this.player_num; i++) {
            this.update_back_hand_card_panel(i);
        }
        for (let i = 0; i < 4; i++){
            this.back_reset_discard_panel(i)
        }

        let control_panel = this.play_back_panel.getChildByName('control_panel');
        control_panel.getChildByName('latter_btn').setTouchEnabled(true);
        control_panel.getChildByName('latter_btn').setBright(true);
        this.startPlayBack();
    },

    //回看完成
    playBackComplete: function () {
        this.stopPlayback();
        this.commands = [];
        let control_panel = this.play_back_panel.getChildByName('control_panel');
        control_panel.getChildByName('latter_btn').setTouchEnabled(false);
        control_panel.getChildByName('latter_btn').setBright(false);
        control_panel.getChildByName('pause_btn').setVisible(false);
        control_panel.getChildByName('pause_btn').setBright(false);
        control_panel.getChildByName('pause_btn').setTouchEnabled(false);
        control_panel.getChildByName('play_btn').setVisible(true);
        control_panel.getChildByName('play_btn').setBright(false);
        control_panel.getChildByName('play_btn').setTouchEnabled(false);
    },

    //退出回看
    quitPlayBackRoom: function () {
        this.resetTimeScale();
        this.stopPlayback();
        h1global.entityManager.player().curGameRoom = undefined;
        this.hide();
    },

    resetTimeScale: function () {
        this.timeScale = 0;
        this.setActionTimeScale(1);
    },

    setActionTimeScale: function (rate) {
        this.update_back_speed();
        cc.director.getScheduler().setTimeScale(rate);
    },

    nextTimeScale: function () {
        this.timeScale = ++this.timeScale % this.timeScaleList.length;
        this.setActionTimeScale(this.timeScaleList[this.timeScale]);
    },

    //加载回看操作按钮
    init_room_back_operation: function () {
        let self = this;
        let control_panel = this.play_back_panel.getChildByName('control_panel');
        control_panel.getChildByName('pause_btn').setVisible(true);
        control_panel.getChildByName('play_btn').setVisible(false);
        control_panel.getChildByName('reset_btn').addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                control_panel.getChildByName('pause_btn').setVisible(true);
                control_panel.getChildByName('pause_btn').setTouchEnabled(true);
                control_panel.getChildByName('pause_btn').setBright(true);
                control_panel.getChildByName('play_btn').setVisible(false);
                control_panel.getChildByName('latter_btn').setTouchEnabled(true);
                control_panel.getChildByName('latter_btn').setBright(true);
                self.replay();
            }
        });

        control_panel.getChildByName('pause_btn').addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                control_panel.getChildByName('pause_btn').setVisible(false);
                control_panel.getChildByName('play_btn').setVisible(true);
                control_panel.getChildByName('play_btn').setTouchEnabled(true);
                control_panel.getChildByName('play_btn').setBright(true);
                control_panel.getChildByName('latter_btn').setTouchEnabled(false);
                control_panel.getChildByName('latter_btn').setBright(false);
                self.pausePlayBack();
            }
        });

        control_panel.getChildByName('play_btn').addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                control_panel.getChildByName('pause_btn').setVisible(true);
                control_panel.getChildByName('pause_btn').setTouchEnabled(true);
                control_panel.getChildByName('pause_btn').setBright(true);
                control_panel.getChildByName('play_btn').setVisible(false);
                control_panel.getChildByName('latter_btn').setTouchEnabled(true);
                control_panel.getChildByName('latter_btn').setBright(true);
                self.startPlayBack();
            }
        });

        control_panel.getChildByName('latter_btn').addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                cc.log("快进X1");
                self.nextTimeScale();
            }
        });

        control_panel.getChildByName('close_btn').addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.quitPlayBackRoom();
            }
        });
    },

    // 房间信息
    update_room_back_info: function () {
        let room_info_panel_four = this.play_back_panel.getChildByName("room_info_panel_four");
        let room_info_panel_three = this.play_back_panel.getChildByName("room_info_panel_three");
        if (this.player_num !== 4) {
            room_info_panel_four.setVisible(false);
            room_info_panel_three.setVisible(true);

            let time_label = room_info_panel_three.getChildByName("time_label");
            time_label.setString(cutil.convert_time_to_hm(this.start_time));

            let room_num_label = room_info_panel_three.getChildByName("room_num_label");
            room_num_label.setString(this.roomId.toString());
        } else {
            room_info_panel_four.setVisible(true);
            room_info_panel_three.setVisible(false);

            let time_label = room_info_panel_four.getChildByName("time_label");
            time_label.setString(cutil.convert_time_to_hm(this.start_time));

            let room_num_label = room_info_panel_four.getChildByName("room_num_label");
            room_num_label.setString(this.roomId.toString());
        }
    },

    // 初始化房间信息
    init_room_back_info: function () {
        // 房间游戏参数
        var player = h1global.entityManager.player();
        var string = player.curGameRoom.update_room_info();
        let room_info_label = this.play_back_panel.getChildByName("room_info_label");
        room_info_label.setString(string);
        //房间信息
        this.update_room_back_info();
    },

    // 更新手牌
    update_back_hand_card_panel: function (serverSeat,cards) {
        let player = h1global.entityManager.player();
        let deskSeat = player.server2CurSitNum(serverSeat);
        this.resetHandCards(deskSeat);

        if (cards && cards.length > 0){
            let key_cards = cutil.deepCopy(cards);
            this.cal_surplus(serverSeat,key_cards);
        }
        let hand_card_panel = this.play_back_panel.getChildByName("hand_card_panel_" + deskSeat.toString());
        let card_list = this.copyHandCards[serverSeat];
        cc.log("card_list ", card_list);
        card_list = this.convert2HandCards(card_list);
        for (let i = 0; i < card_list.length; i++) {
            let card = ccui.helper.seekWidgetByName(hand_card_panel, "card_" + String(i));
            card.loadTexture("Card/" + card_list[i].toString() + ".png", ccui.Widget.PLIST_TEXTURE);
            card.setVisible(true);
        }
    },

    // 将牌转换为 显示 的顺序
    convert2DiscardSeatCards: function (deskSeat, cards) {
        let newList = [];
        let player = h1global.entityManager.player();

        if (deskSeat === 0) {
            let shadow_cards = [];
            shadow_cards = shadow_cards.concat(cards).sort(cutil.cardSortFunc);
            let idx = Math.floor(shadow_cards.length / 2);
            for (let i = 0; i < shadow_cards.length; i++) {
                if (i % 2 === 0) {
                    idx += i
                } else {
                    idx -= i
                }
                newList.push(shadow_cards[idx])
            }

        } else if (deskSeat === 1) {
            newList = newList.concat(cards).sort(cutil.tileSortFunc)
        } else if (deskSeat === 2 && this.player_num !== 4) {
            newList = newList.concat(cards).sort(cutil.tileSortFunc)
        } else if (deskSeat === 2 && this.player_num === 4) {
            let card_list = [];
            let id = 0;
            card_list = card_list.concat(cards).sort(cutil.tileSortFunc);
            if (card_list.length <= 8) {
                id = Math.floor(card_list.length / 2);
            } else {
                id = 4;
            }
            for (let i = 0; i < card_list.length; i++) {
                if (i === 8) {
                    id = 8 + Math.floor((card_list.length - 8) / 2);
                }
                if (i % 2 === 0) {
                    id += (i % 8)
                } else {
                    id -= (i % 8)
                }
                newList.push(card_list[id])
            }

        } else if (deskSeat === 3) {
            newList = newList.concat(cards).sort(cutil.tileSortFunc)
        }
        return newList
    },

    // 手牌的显示顺序
    convert2HandCards: function (cards) {
        let newList = [];
        let shadow_cards = [];
        shadow_cards = shadow_cards.concat(cards).sort(cutil.tileSortFunc);
        let idx = Math.floor(shadow_cards.length / 2);
        for (let i = 0; i < shadow_cards.length; i++) {
            if (i % 2 === 0) {
                idx += i
            } else {
                idx -= i
            }
            newList.push(shadow_cards[idx])
        }
        return newList
    },

    update_waitIdx: function () {

    },

    // 更新玩家信息
    update_back_player_info: function (deskSeat, playerBaseInfo, playerAdvanceInfo) {
        if (deskSeat < 0 || deskSeat > (this.player_num)) {
            return;
        }
        var player_info_panel = this.play_back_panel.getChildByName("player_info_panel_" + deskSeat.toString());

        var name_label = ccui.helper.seekWidgetByName(player_info_panel, "name_label");

        name_label.setString(playerBaseInfo["nickname"]);
        var frame_img = ccui.helper.seekWidgetByName(player_info_panel, "frame_img");
        player_info_panel.reorderChild(frame_img, 1);
        frame_img.setTouchEnabled(true);
        frame_img.setGlobalZOrder(10000);
        cutil.loadPortraitTexture(playerBaseInfo["head_icon"], function (img) {
            if (h1global.curUIMgr.gameroomback_ui && h1global.curUIMgr.gameroomback_ui.is_show && player_info_panel) {
                player_info_panel.getChildByName("portrait_sprite").removeFromParent();
                var portrait_sprite = new cc.Sprite(img);
                portrait_sprite.setName("portrait_sprite");
                portrait_sprite.setScale(86 / portrait_sprite.getContentSize().width);
                portrait_sprite.x = player_info_panel.getContentSize().width * 0.49;
                portrait_sprite.y = player_info_panel.getContentSize().height * 0.49;
                player_info_panel.addChild(portrait_sprite);
                player_info_panel.reorderChild(portrait_sprite, -99);
            }
        }, playerBaseInfo["uuid"].toString() + ".png");

        player_info_panel.setVisible(true);

        let score_label = ccui.helper.seekWidgetByName(player_info_panel, "score_label");
        cc.log("score_label :" + score_label);
        score_label.ignoreContentAdaptWithSize(true);
        score_label.setString(playerAdvanceInfo["total_score"] || 0)
    },

    // 重置显示的牌
    back_reset_discard_panel: function (deskSeat) {
        let discard_card_panel = this.play_back_panel.getChildByName("discard_card_panel_" + String(deskSeat));
        for (let i = 0; i < const_val.GAME_PLAYER_CARD_NUM ; i++) {
            let card = ccui.helper.seekWidgetByName(discard_card_panel, "card_" + String(i));
            if (card) {
                card.setVisible(false)
            }
        }
    },

    // 更新显示的牌
    update_back_discard_card_panel: function (serverSeat,deskSeat, cards) {
        this.back_reset_discard_panel(deskSeat);
        let card_list = this.convert2DiscardSeatCards(deskSeat === 4 ? 2 : deskSeat, cards);
        let discard_card_panel = this.play_back_panel.getChildByName("discard_card_panel_" + String(deskSeat));
        if (discard_card_panel) {
            for (let i = 0; i < card_list.length; i++) {
                let card = ccui.helper.seekWidgetByName(discard_card_panel, "card_" + String(i));
                card.loadTexture("Card/" + card_list[i].toString() + ".png", ccui.Widget.PLIST_TEXTURE);
                card.setVisible(true)
            }
            discard_card_panel.setVisible(true);
            if (deskSeat === 4) {
                this.play_back_panel.getChildByName("discard_card_panel_2").setVisible(false);
            }
        }

    },

    cal_surplus:function (serverSeat,cards) {
        if (serverSeat < 0 || !cards ||cards.length <= 0){
            return
        }
        for (let i = this.copyHandCards[serverSeat].length - 1; i >= 0; i--) {
            for (let j = cards.length - 1; j >= 0; j--) {
                if (this.copyHandCards[serverSeat][i] === cards[j]){
                    this.copyHandCards[serverSeat].splice(i,1);
                    cards.splice(j,1);
                    break;
                }
            }
        }
    },

    resetHandCards: function (deskSeat) {
        cc.log("resetHandCards");
        let hand_card_panel = this.play_back_panel.getChildByName("hand_card_panel_" + deskSeat.toString());
        for (var i = 0; i < const_val.GAME_PLAYER_CARD_NUM ; i++) {
            var card = ccui.helper.seekWidgetByName(hand_card_panel, "card_" + String(i));
            if (card) {
                card.setVisible(false);
            }
        }
    },

    // 要不起
    update_back_no_discards: function (idx) {
        let player = h1global.entityManager.player();
        let deskSeat = player.server2CurSitNum(idx);
        cc.log("update_no_discards  idx:" + idx + "  deskSeat :" + deskSeat);
        for (let i = 0; i < this.player_num; i++) {
            if (this.player_num === 3 && i === 2) {
                i = 3;
            }
            let player_info_panel = this.play_back_panel.getChildByName("player_info_panel_" + i);
            let not_afford_img = player_info_panel.getChildByName("not_afford_img");
            not_afford_img.setLocalZOrder(-100);
            if (i !== deskSeat || idx === const_val.PDK_DEFALUT) {
                not_afford_img.setVisible(false);
            } else {
                not_afford_img.setVisible(true);
                not_afford_img.runAction(cc.Sequence.create(
                    cc.fadeIn(0.1),
                    cc.fadeOut(1.5),
                    cc.CallFunc.create(function () {
                        not_afford_img.setVisible(false);
                    })
                ));
            }
        }

        this.back_reset_discard_panel(deskSeat);
    },
});