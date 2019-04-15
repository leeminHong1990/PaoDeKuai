"use strict";
var GameRoomUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/GameRoomUI.json";
    },
    initUI: function () {
        var self = this;
        this.prepareCards = [];     //  准备打出的牌
        this.touch_card_num = [];   //  选中的牌
        this.talk_img_num = 0;      //  聊天相关
        h1global.curUIMgr.gameroominfo_ui.show();
        var player = h1global.entityManager.player();
        this.initOprationPanel();
        this.init_anticheating();
        this.update_hand_card_panel();
        this.update_opration_panel();
        for (var i = 0; i < player.curGameRoom.playerNum; i++) {
            var deskSeat = player.server2CurSitNum(i);
            this.update_player_info_panel(deskSeat, player.curGameRoom.playerInfoList[i], i);
            this.update_player_score(deskSeat, player.curGameRoom.player_advance_info_list[i]);
            this.update_discard_card_panel(deskSeat, player.curGameRoom.deskPokerList[i]);
            this.update_player_card_num(deskSeat, player.curGameRoom.playerPokerList[i].length);
            this.update_player_online_state(deskSeat, player.curGameRoom.playerInfoList[i]["online"]);
            this.show_if_onlycard(deskSeat, player.curGameRoom.playerPokerList[i].length);
            this.show_cover();
            this.update_gameForce();
            this.update_dealerIdx(i, deskSeat);
        }

        this.update_identity_image(player.curGameRoom.dealerIdx);
        //等待出牌的玩家的黄框
        cc.log("等待出牌的人： " + player.curGameRoom.waitIdx);
        this.show_yellow_frame(player.curGameRoom.waitIdx);

        if (!cc.audioEngine.isMusicPlaying()) {
            cc.audioEngine.resumeMusic();
        }
        if (player.curGameRoom.waitIdx === player.serverSeatNum) {
            cc.log("getTipsCards");
            // this.update_not_afford();
            this.is_afford(player.curGameRoom.waitIdx);

            var flag = 0;
            for (var i in self.discardList) {
                if (self.discardList[i].length != 0) {
                    flag++;
                }
            }
            if (0 != flag) {
                this.canAutoPlayCard();
            }
            player.getTipsCards(2);
            this.show_cover();
        }

        var opration_panel = this.rootUINode.getChildByName("opration_panel");
        var discard_btn = ccui.helper.seekWidgetByName(opration_panel, "discard_btn");

        function touch_event(sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.resetPrepareCards();
                discard_btn.setTouchEnabled(false);
                discard_btn.setBright(false)
            }
        }

        this.rootUINode.getChildByName("touch_panel").addTouchEventListener(touch_event);

        if (h1global.curUIMgr.gameplayerinfo_ui && h1global.curUIMgr.gameplayerinfo_ui.is_show) {
            h1global.curUIMgr.gameplayerinfo_ui.hide();
        }
    },

    initOprationPanel: function () {
        var self = this;
        var player = h1global.entityManager.player();
        var opration_panel = this.rootUINode.getChildByName("opration_panel");
        ccui.helper.seekWidgetByName(opration_panel, "tips_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                cc.log("tips_btn");
                if (player.tips_indx === -1 && self.prepareCards && self.prepareCards.length > 0) {
                    player.tips_indx = 0;
                }
                if (player.curGameRoom.waitIdx === player.curGameRoom.controllerIdx
                    && self.prepareCards.length === 0) {
                    return;
                }
                var tipsCards = player.getNextTips();
                cc.log("tipsCards :", tipsCards);
                self.setTipsCards(tipsCards);
                self.update_gameForce();
            }
        });

        ccui.helper.seekWidgetByName(opration_panel, "pass_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                cc.log("pass_btn");
                if (player.curGameRoom.controllerIdx === player.serverSeatNum) {
                    return
                }
                player.confirmOperation(const_val.OP_PASS, []);
                self.hide_operation_panel();
            }
        });

        ccui.helper.seekWidgetByName(opration_panel, "discard_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                cc.log("discard_btn   " + self.prepareCards);
                if (self.prepareCards.length > 0) {
                    var resultList = player.canPlayCards(self.prepareCards);
                    cc.log("gameRoom: ", resultList);
                    var isTipSingle = false;
                    var front_player = self.update_single_player(player.serverSeatNum);
                    if (resultList[0] && resultList[2] === 0) {
                        // 报单
                        if (resultList[1].length === 1
                            && player.curGameRoom.playerPokerList[front_player].length === 1) {
                            var playerPokers = player.curGameRoom.playerPokerList[player.serverSeatNum];
                            if (!self.is_max_single(resultList[1][0], playerPokers)) {
                                self.show_no_discards_tips(3);
                                isTipSingle = true;
                            }
                        }
                        if (!isTipSingle) {
                            player.confirmOperation(const_val.OP_DISCARD, self.prepareCards, resultList[1]);
                            // for (var i = 0; i < resultList[1].length; i++) {
                            //     self.alreadyDiscards.push(resultList[1][i])
                            // }
                            self.rootUINode.getChildByName("no_discards_img").setVisible(false);
                            self.rootUINode.getChildByName("opration_panel").setVisible(false);
                            self.prepareCards = [];
                            self.reset_cover_state();
                        }
                    } else if (resultList[2] === 1) {
                        cc.log("必须出含有黑3");
                        self.show_no_discards_tips(2);
                    } else if (resultList[2] === 2) {
                        cc.log("傻逼，炸弹不可拆");
                        self.show_no_discards_tips(1);
                    } else {
                        self.show_no_discards_tips(0);
                    }
                } else {
                    self.show_no_discards_tips(0);
                }
            }
        })
    },

    hide_operation_panel: function () {
        this.rootUINode.getChildByName("opration_panel").setVisible(false);
        this.update_hand_card_panel();
        this.prepareCards = [];
        this.reset_cover_state();
    },

    show_no_discards_tips: function (type) {
        var self = this;
        cc.log("出牌错误类型：", type);
        var no_discards_img = this.rootUINode.getChildByName("no_discards_img");
        var moveBy = cc.moveBy(0.5, cc.p(0, cc.winSize.height * 0.15));
        no_discards_img.setVisible(true);
        if (0 === type) {  //牌型不符合
            no_discards_img.loadTexture("res/ui/GameRoomUI/no_discards_img.png");
        } else if (1 === type) {  //炸弹不可拆
            no_discards_img.loadTexture("res/ui/GameRoomUI/bomb_no_open.png");
        } else if (2 === type) {  // 必须黑3
            no_discards_img.loadTexture("res/ui/GameRoomUI/must_hei3.png");
        } else if (3 === type) {  //报单必须出最大
            no_discards_img.loadTexture("res/ui/GameRoomUI/single_tip_img.png");
        }
        no_discards_img.runAction(cc.Sequence.create(cc.fadeIn(0.5), cc.DelayTime.create(0.5), cc.Spawn.create(moveBy, cc.fadeOut(0.5))));
        no_discards_img.setPosition(cc.winSize.width * 0.5, cc.winSize.height * 0.55);
    },

    show_no_big_tips: function () {
        var self = this;
        var card_no_big_img = self.rootUINode.getChildByName("card_no_big_img");
        var moveBy = cc.moveBy(0.5, cc.p(0, cc.winSize.height * 0.15));
        card_no_big_img.setVisible(true);
        card_no_big_img.loadTexture("res/ui/GameRoomUI/no_big_img.png");
        card_no_big_img.runAction(cc.Sequence.create(cc.fadeIn(0.5), cc.DelayTime.create(0.5), cc.Spawn.create(moveBy, cc.fadeOut(0.5))));
        card_no_big_img.setPosition(cc.winSize.width * 0.5, cc.winSize.height * 0.55);
    },

    show_op_tips: function () {
        var show_tips_img = this.rootUINode.getChildByName("show_tips_img");
        show_tips_img.setVisible(true);
        var moveBy = cc.moveBy(0.5, cc.p(0, cc.winSize.height * 0.15));
        show_tips_img.runAction(cc.Sequence.create(cc.fadeIn(0.5), cc.DelayTime.create(0.5), cc.Spawn.create(moveBy, cc.fadeOut(0.5))));
        show_tips_img.setPosition(cc.winSize.width * 0.5, cc.winSize.height * 0.55);
    },

    insertPrepareCard: function (cards_list) {
        if (this.prepareCards) {
            for (var i = 0; i < cards_list.length; i++) {
                this.prepareCards.push(cards_list[i])
            }
            this.prepareCards.sort(function (a, b) {
                return a - b;
            });
            this.update_opration_panel();
            this.update_gameForce();
        }
    },

    removePrepareCard: function (cards_list) {
        cc.log("removePrepareCard " + cards_list + "  " + this.prepareCards);
        if (this.prepareCards) {
            for (var i = 0; i < cards_list.length; i++) {
                var index = this.prepareCards.indexOf(cards_list[i]);
                cc.log("index " + index);
                if (index >= 0) {
                    this.prepareCards.splice(index, 1)
                }
            }
        }
        cc.log("prepareCards  " + this.prepareCards);
        this.update_opration_panel();
        this.update_gameForce();
    },

    // 将牌转换为 显示 的顺序
    convert2DiscardSeatCards: function (deskSeat, cards) {
        var newList = [];
        var player = h1global.entityManager.player();

        if (deskSeat === 0) {
            var shadow_cards = [];
            shadow_cards = shadow_cards.concat(cards).sort(cutil.cardSortFunc);
            var idx = Math.floor(shadow_cards.length / 2);
            for (var i = 0; i < shadow_cards.length; i++) {
                if (i % 2 === 0) {
                    idx += i
                } else {
                    idx -= i
                }
                newList.push(shadow_cards[idx])
            }

        } else if (deskSeat === 1) {
            newList = newList.concat(cards).sort(cutil.tileSortFunc)
        } else if (deskSeat === 2 && player.curGameRoom.playerNum != 4) {
            newList = newList.concat(cards).sort(cutil.tileSortFunc)
        } else if (deskSeat === 2 && player.curGameRoom.playerNum === 4) {
            var cardlist = [];
            var id,
                cardlist = cardlist.concat(cards).sort(cutil.tileSortFunc);
            if (cardlist.length <= 8) {
                id = Math.floor(cardlist.length / 2);
            } else {
                id = 4;
            }
            for (var i = 0; i < cardlist.length; i++) {
                if (i === 8) {
                    id = 8 + Math.floor((cardlist.length - 8) / 2);
                }
                if (i % 2 === 0) {
                    id += (i % 8)
                } else {
                    id -= (i % 8)
                }
                newList.push(cardlist[id])
            }

        } else if (deskSeat === 3) {
            newList = newList.concat(cards).sort(cutil.tileSortFunc)
        }
        return newList
    },

    convert2HandCards: function (cards) {
        var newList = [];
        var shadow_cards = [];
        shadow_cards = shadow_cards.concat(cards).sort(cutil.tileSortFunc);
        var idx = Math.floor(shadow_cards.length / 2);
        for (var i = 0; i < shadow_cards.length; i++) {
            if (i % 2 === 0) {
                idx += i
            } else {
                idx -= i
            }
            newList.push(shadow_cards[idx])
        }
        return newList
    },

    resetHandCards: function () {
        cc.log("resetHandCards");
        var hand_card_panel = this.rootUINode.getChildByName("hand_card_panel");
        var player = h1global.entityManager.player();
        var card_list = player.curGameRoom.playerPokerList[player.serverSeatNum];
        for (var i = 0; i < 16; i++) {
            var card = ccui.helper.seekWidgetByName(hand_card_panel, "card_" + String(i));
            if (card) {
                card.is_select = false;
                card.setPositionY(0);
                card.setVisible(false)
            }

        }
    },

    reset_discard_panel: function (deskSeat) {
        cc.log("reset_discard_panel  ", deskSeat);
        var player = h1global.entityManager.player();
        var card_list = player.curGameRoom.playerPokerList[player.serverSeatNum];
        var discard_card_panel = this.rootUINode.getChildByName("discard_card_panel_" + String(deskSeat));
        for (var i = 0; i < 16; i++) {
            var card = ccui.helper.seekWidgetByName(discard_card_panel, "card_" + String(i));
            if (card) {
                card.setVisible(false)
            }
        }
    },

    resetPrepareCards: function () {
        cc.log("resetPrepareCards");
        if (this.prepareCards && this.prepareCards.length <= 0) {
            return
        }
        var player = h1global.entityManager.player();
        var card_list = player.curGameRoom.playerPokerList[player.serverSeatNum];
        var hand_card_panel = this.rootUINode.getChildByName("hand_card_panel");
        for (var i = 0; i < 16; i++) {
            var card = ccui.helper.seekWidgetByName(hand_card_panel, "card_" + String(i));
            if (card && card.is_select) {
                card.is_select = false;
                card.setPositionY(0)
            }
        }
        this.prepareCards = [];
    },

    setTipsCards: function (tipsCards) {
        if (!tipsCards) {
            return
        }
        if (tipsCards instanceof Array) {
            tipsCards = tipsCards.concat([]);
            if (tipsCards.length <= 0) {
                this.show_no_big_tips();
                return
            }
        }
        var player = h1global.entityManager.player();
        var card_list = player.curGameRoom.playerPokerList[player.serverSeatNum];
        var hand_card_panel = this.rootUINode.getChildByName("hand_card_panel");


        if (player.tipsList.length !== 1) {
            this.resetPrepareCards();
        }
        cc.log(hand_card_panel);
        for (var i = 0; i < card_list.length; i++) {
            var card = ccui.helper.seekWidgetByName(hand_card_panel, "card_" + String(i));
            cc.log("tipsCards:", tipsCards);
            if (tipsCards.indexOf(card.card_num) >= 0) {
                this.select(card);
                tipsCards.splice(tipsCards.indexOf(card.card_num), 1)
            }
        }
    },

    select: function (card) {
        cc.log("select  ", card);
        if (card) {
            if (card.is_select) {
                card.is_select = false;
                card.setPositionY(0);
                this.removePrepareCard([card.card_num]);
                cc.audioEngine.playEffect("res/sound/effect/choose.mp3");
            } else {
                cc.log("2222222222222");
                card.is_select = true;
                card.setPositionY(35);
                this.insertPrepareCard([card.card_num]);
                cc.audioEngine.playEffect("res/sound/effect/choose.mp3");
            }
        }
    },

    update_hand_card_panel: function () {
        cc.log("==============================================");
        var self = this;
        var player = h1global.entityManager.player();
        var hand_card_panel = this.rootUINode.getChildByName("hand_card_panel");
        var hand_card_panel_width = hand_card_panel.getContentSize().width;
        cc.log("hand_card_panel_width " + hand_card_panel_width);
        this.resetHandCards();
        // 重置所有卡牌状态
        var card_list = player.curGameRoom.playerPokerList[player.serverSeatNum];
        card_list = this.convert2HandCards(card_list);
        // cc.log('update_hand_card_panel')
        var half_card_width = 51.6;
        var card_dis = 45;
        // cc.log("card_list "+card_list);
        function card_touch_event(sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_BEGAN) {
                // cc.log("TOUCH_BEGAN");
                if (self.touch_card_num.length > 0) {
                    var moved_pos = hand_card_panel.convertToNodeSpace(sender.getTouchBeganPosition());
                    if (moved_pos.x <= 1050 && moved_pos.y >= 0
                        && moved_pos.y <= 206
                        && moved_pos.x > hand_card_panel_width / 2 - Math.ceil(card_list.length / 2) * 60 - 45
                        && moved_pos.x < hand_card_panel_width / 2 + Math.floor(card_list.length / 2) * 60 + 45) {
                        var i = Math.floor((moved_pos.x) / 60);
                        cc.log(i);// 11
                        if (i - 7 <= 0) {
                            var card_num = Math.abs(i - 7) * 2;
                            if (self.touch_card_num.indexOf(card_num) === -1) {
                                var card = ccui.helper.seekWidgetByName(hand_card_panel, "card_" + String(card_num));
                                self.select(card)
                            }
                        } else {
                            var card_num = Math.abs(i - 7) * 2 - 1;
                            cc.log(card_num);
                            if (self.touch_card_num.indexOf(card_num) === -1) {
                                if (card_num < card_list.length) {
                                    var card = ccui.helper.seekWidgetByName(hand_card_panel, "card_" + String(card_num));
                                    self.select(card)
                                } else {
                                    if (self.touch_card_num.indexOf(card_list.length - card_list.length % 2 - 1) === -1) {
                                        var card = ccui.helper.seekWidgetByName(hand_card_panel, "card_" + String(card_list.length - card_list.length % 2 - 1));
                                        self.select(card)
                                    }
                                }
                            }
                        }
                    }
                } else {
                    self.select(sender);
                }
                self.update_gameForce();
            } else if (eventType === ccui.Widget.TOUCH_MOVED) {
                // cc.log("TOUCH_MOVED");
                var moved_pos = hand_card_panel.convertToNodeSpace(sender.getTouchMovePosition());
                // cc.log("moved_pos  " + moved_pos.x + "  " + moved_pos.y);
                // cc.log(hand_card_panel_width / 2 - Math.floor(card_list.length / 2) * 45 - 25);
                // cc.log(hand_card_panel_width / 2 + Math.floor(card_list.length / 2) * 45 + 25);
                if (moved_pos.x <= 1050 && moved_pos.y >= 0
                    && moved_pos.y <= 206
                    && moved_pos.x > hand_card_panel_width / 2 - Math.ceil(card_list.length / 2) * 60 - 45
                    && moved_pos.x < hand_card_panel_width / 2 + Math.floor(card_list.length / 2) * 60 + 45) {
                    var i = Math.floor((moved_pos.x) / 60);
                    // cc.log(i);// 11
                    if (i - 7 <= 0) {
                        var card_num = Math.abs(i - 7) * 2;
                        if (self.touch_card_num.indexOf(card_num) === -1) {
                            var card = ccui.helper.seekWidgetByName(hand_card_panel, "card_" + String(card_num));
                            if (card.is_select != sender.is_select) {
                                self.select(card)
                            }
                        }
                    } else {
                        var card_num = Math.abs(i - 7) * 2 - 1;
                        cc.log(card_num);
                        if (self.touch_card_num.indexOf(card_num) === -1) {
                            if (card_num < card_list.length) {
                                var card = ccui.helper.seekWidgetByName(hand_card_panel, "card_" + String(card_num));
                                if (card.is_select != sender.is_select) {
                                    self.select(card)
                                }
                            }
                            else {
                                if (self.touch_card_num.indexOf(card_list.length - card_list.length % 2 - 1) === -1) {
                                    var card = ccui.helper.seekWidgetByName(hand_card_panel, "card_" + String(card_list.length - card_list.length % 2 - 1));
                                    if (card && card.is_select != sender.is_select) {
                                        self.select(card)
                                    }
                                }
                            }
                        }
                    }
                }
                self.update_gameForce();
            }
        }

        cc.log("card_list :", card_list);
        for (var i = 0; i < card_list.length; i++) {
            var card = ccui.helper.seekWidgetByName(hand_card_panel, "card_" + String(i));
            card.card_num = card_list[i];
            card.loadTexture("Card/" + card_list[i].toString() + ".png", ccui.Widget.PLIST_TEXTURE);
            card.setVisible(true);
            card.setSwallowTouches(true);
            card.addTouchEventListener(card_touch_event);
        }
    },

    init_anticheating: function () {
        var player = h1global.entityManager.player();
        if (player.curGameRoom.anticheating === 0) {
            return
        }
        var hand_card_panel = this.rootUINode.getChildByName("hand_card_panel");
        var card_list = player.curGameRoom.playerPokerList[player.serverSeatNum];

        if (player.curGameRoom.playerOperation[player.serverSeatNum] === 1) {
            for (var i = 0; i < card_list.length; i++) {
                var card = ccui.helper.seekWidgetByName(hand_card_panel, "card_" + String(i));
                if (card) {
                    card.getChildByName("card_back").setVisible(false);
                }
            }
        } else {
            for (var i = 0; i < card_list.length; i++) {
                var card = ccui.helper.seekWidgetByName(hand_card_panel, "card_" + String(i));
                if (card) {
                    card.getChildByName("card_back").setVisible(true);
                }
            }
            var back_label = new ccui.Text("请耐心等待上家出牌才能显示牌面......", "黑体", 40);
            hand_card_panel.addChild(back_label);
            back_label.setName("back_label");
            back_label.setTextColor(cc.color(250, 152, 57));
            back_label.setSkewX(10);
            back_label.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            back_label.setPosition(cc.p(hand_card_panel.getContentSize().width / 2, hand_card_panel.getContentSize().height / 2));
        }

    },

    update_anticheating: function () {
        var player = h1global.entityManager.player();
        if (player.curGameRoom.anticheating === 0) {
            return
        }
        var hand_card_panel = this.rootUINode.getChildByName("hand_card_panel");
        var card_list = player.curGameRoom.playerPokerList[player.serverSeatNum];
        for (var i = 0; i < card_list.length; i++) {
            var card = ccui.helper.seekWidgetByName(hand_card_panel, "card_" + String(i));
            if (card) {
                card.getChildByName("card_back").setVisible(false);
            }
            var back_label = ccui.helper.seekWidgetByName(hand_card_panel, "back_label");
            if (back_label) {
                back_label.removeFromParent();
            }
        }
    },

    update_discard_card_panel: function (deskSeat, cards) {
        cc.log("update_discard_card_panel ", deskSeat, cards);
        this.reset_discard_panel(deskSeat);
        var card_list = this.convert2DiscardSeatCards(deskSeat === 4 ? 2 : deskSeat, cards);
        var discard_card_panel = this.rootUINode.getChildByName("discard_card_panel_" + String(deskSeat));
        if (discard_card_panel) {
            for (var i = 0; i < card_list.length; i++) {
                var card = ccui.helper.seekWidgetByName(discard_card_panel, "card_" + String(i));
                card.loadTexture("Card/" + card_list[i].toString() + ".png", ccui.Widget.PLIST_TEXTURE);
                card.setVisible(true)
            }
            discard_card_panel.setVisible(true);
            if (deskSeat === 4) {
                this.rootUINode.getChildByName("discard_card_panel_2").setVisible(false);
            }
        }
    },

    update_dealerIdx: function (serversit, deskSeat) {
        var player = h1global.entityManager.player();
        var player_info_panel = this.rootUINode.getChildByName("player_info_panel_" + deskSeat.toString());
        var owner_img = ccui.helper.seekWidgetByName(player_info_panel, "owner_img");

        if (player.curGameRoom.dealerIdx === serversit) {
            owner_img.setVisible(true);
            player_info_panel.reorderChild(owner_img, 99)
        } else {
            owner_img.setVisible(false);
        }
    },

    update_player_info_panel: function (deskSeat, playerBaseInfo, serveridx) {
        var player = h1global.entityManager.player();
        if (deskSeat < 0 || deskSeat > (player.curGameRoom.playerNum)) {
            return;
        }
        //var idx = player.server2CurSitNum(deskSeat);
        var idx = deskSeat;
        var player_info_panel = this.rootUINode.getChildByName("player_info_panel_" + idx.toString());

        var name_label = ccui.helper.seekWidgetByName(player_info_panel, "name_label");
        var owner_img = ccui.helper.seekWidgetByName(player_info_panel, "owner_img");

        name_label.setString(playerBaseInfo["nickname"]);
        var frame_img = ccui.helper.seekWidgetByName(player_info_panel, "frame_img");
        player_info_panel.reorderChild(frame_img, 1);
        frame_img.setTouchEnabled(true);
        frame_img.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.gameplayerinfo_ui.show_by_info(playerBaseInfo, player.serverSeatNum, serveridx);
            }
            if (eventType == ccui.Widget.TOUCH_BEGAN) {
                h1global.curUIMgr.gameroomtest_ui.runAction(cc.sequence(cc.delayTime(2.0), cc.callFunc(function () {
                    h1global.entityManager.player().getTestData();
                })));
            } else if(eventType === ccui.Widget.TOUCH_ENDED || eventType === ccui.Widget.TOUCH_CANCELED){
                h1global.curUIMgr.gameroomtest_ui.stopAllActions();
            }
        });
        cutil.loadPortraitTexture(playerBaseInfo["head_icon"], function (img) {
            if (h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show && player_info_panel) {
                player_info_panel.getChildByName("portrait_sprite").removeFromParent();
                var portrait_sprite = new cc.Sprite(img);
                portrait_sprite.setName("portrait_sprite");
                portrait_sprite.setScale(86 / portrait_sprite.getContentSize().width);
                if (idx === 0) {
                    portrait_sprite.x = player_info_panel.getContentSize().width * 0.089;
                } else {
                    portrait_sprite.x = player_info_panel.getContentSize().width * 0.493;
                }
                portrait_sprite.y = player_info_panel.getContentSize().height * 0.49;
                player_info_panel.addChild(portrait_sprite);
                player_info_panel.reorderChild(portrait_sprite, -99);
            }
        }, playerBaseInfo["uuid"].toString() + ".png");

        // if (player.curGameRoom.dealerIdx === deskSeat) {
        //     owner_img.setVisible(true);
        //     player_info_panel.reorderChild(owner_img, 99)
        // } else {
        //     owner_img.setVisible(false);
        // }
        player_info_panel.setVisible(true);
    },

    update_player_score: function (deskSeat, playerAdvanceInfo) {
        // rank_img
        cc.log("deskSeat :" + deskSeat);
        var player_info_panel = this.rootUINode.getChildByName("player_info_panel_" + deskSeat.toString());
        var score_label = ccui.helper.seekWidgetByName(player_info_panel, "score_label");
        cc.log("score_label :" + score_label);
        score_label.ignoreContentAdaptWithSize(true);
        score_label.setString(playerAdvanceInfo["total_score"] || 0)
    },

    update_player_card_num: function (deskSeat, cardsNum) {
        cc.log("update_player_card_num  " + deskSeat + "  " + cardsNum);
        var player = h1global.entityManager.player();
        if (player.curGameRoom.gameFunc === 1) {
            return;
        }
        if (deskSeat < 1 || deskSeat > (player.curGameRoom.playerNum) || player.curGameRoom.gameFunc === 1) {
            return;
        }

        var player_card_num_panel = this.rootUINode.getChildByName("player_card_num_panel_" + deskSeat.toString());
        var num_label = ccui.helper.seekWidgetByName(player_card_num_panel, "num_label");
        num_label.setString(cardsNum);
        if (cardsNum > 0) {
            player_card_num_panel.setVisible(true)
        } else {
            player_card_num_panel.setVisible(false)
        }
    },

    update_player_online_state: function (deskSeat, state) {
        var player = h1global.entityManager.player();
        if (deskSeat < 0 || deskSeat > (player.curGameRoom.playerNum)) {
            return;
        }
        var player_info_panel = this.rootUINode.getChildByName("player_info_panel_" + deskSeat.toString());
        var state_online_img = ccui.helper.seekWidgetByName(player_info_panel, "state_online_img");
        var state_offline_img = ccui.helper.seekWidgetByName(player_info_panel, "state_offline_img");
        if (state === 1) {
            state_online_img.setVisible(true);
            state_offline_img.setVisible(false)
        } else if (state === 0) {
            state_online_img.setVisible(false);
            state_offline_img.setVisible(true)
        } else {
            state_online_img.setVisible(true);
            state_offline_img.setVisible(false)
        }
    },

    reset_cover_state: function () {
        var self = this;
        var player = h1global.entityManager.player();
        var card_list = player.curGameRoom.playerPokerList[player.serverSeatNum];
        var hand_card_panel = this.rootUINode.getChildByName("hand_card_panel");
        for (var i = 0; i < card_list.length; i++) {
            var card = ccui.helper.seekWidgetByName(hand_card_panel, "card_" + String(i));
            card.getChildByName("cover_bg_img").setVisible(false);
            if (self.touch_card_num) {
                self.touch_card_num.splice(0, self.touch_card_num.length);
            }
        }
    },

    is_max_single: function (card, cards) {
        var shiftCards = cutil.rightShiftCards(cards); //右移后手牌
        shiftCards.sort(function (a, b) {
            return a - b;
        });
        if ((card >> 3) === shiftCards[shiftCards.length - 1]) {
            return true
        } else {
            return false
        }
    },

    show_cover: function () {
        var self = this;
        var isFind = 0;
        var player = h1global.entityManager.player();
        if (player.curGameRoom.waitIdx === player.serverSeatNum && player.curGameRoom.controllerIdx != player.serverSeatNum
            && !self.getdisType()) {
            var controllerCards = cutil.rightShiftCards(player.curGameRoom.controller_discard_list);
            controllerCards.sort(function (a, b) {
                return a - b;
            });
            var front_player = self.update_single_player(player.serverSeatNum);
            player.getTipsCards(3);
            var tipList = player.tipsList;
            var card_list = player.curGameRoom.playerPokerList[player.serverSeatNum];
            var hand_card_panel = this.rootUINode.getChildByName("hand_card_panel");

            for (var i = 0; i < card_list.length; i++) {
                isFind = 0;
                var card = ccui.helper.seekWidgetByName(hand_card_panel, "card_" + String(i));
                for (var tips = 0; tips < tipList.length; tips++) {
                    if (player.curGameRoom.playerPokerList[front_player].length === 1
                        && tipList[tips].length === 1 && !self.is_max_single(tipList[tips][0], card_list)) {
                        player.tipsList.splice(tips, 1);
                        tips--;
                    } else {
                        for (var tip in tipList[tips]) {
                            var card_num = (card.card_num >> 3);
                            var tip_num = (tipList[tips][tip] >> 3);
                            if (card_num === tip_num) {
                                isFind = 1;
                                break;
                            }
                        }
                        if (isFind === 1) {
                            break;
                        }
                    }
                }
                if (isFind === 0) {
                    if (card.is_select) {
                        this.select(card);
                    }
                    card.getChildByName("cover_bg_img").setVisible(true);
                    self.touch_card_num.push(i);
                }
            }
        }
    },

    update_single_player: function (serverSeatNum) {
        var player = h1global.entityManager.player();
        var play_num = player.curGameRoom.playerNum;

        if (player && player.curGameRoom) {
            return (serverSeatNum + play_num + 1) % player.curGameRoom.playerInfoList.length
        } else {
            return -1;
        }
    },

    show_if_onlycard: function (deskSeat, cardsNum) {
        if (cardsNum != 1) {
            return
        }
        var player_info_panel = this.rootUINode.getChildByName("player_info_panel_" + deskSeat.toString());
        var only_img = player_info_panel.getChildByName("only_img");
        if (only_img) {
            //only_img.setVisible(true);
            UICommonWidget.load_effect_plist("onlyone");
            var effect = cc.Sprite.create();
            effect.setScale(0.5);
            effect.setPosition(only_img.getPositionX(), only_img.getPositionY());
            effect.runAction(cc.sequence(
                UICommonWidget.create_effect_action({"FRAMENUM": 2, "TIME": 0.3, "NAME": "Effects/onlyone_"})
            ).repeatForever());
            player_info_panel.addChild(effect);
        }
    },


    update_opration_panel: function () {
        var self = this;
        var player = h1global.entityManager.player();
        var opration_panel = this.rootUINode.getChildByName("opration_panel");
        // cc.log("update_opration_panel",player.curGameRoom.waitIdx , player.serverSeatNum)

        var tips_btn = ccui.helper.seekWidgetByName(opration_panel, "tips_btn");
        var pass_btn = ccui.helper.seekWidgetByName(opration_panel, "pass_btn");
        var discard_btn = ccui.helper.seekWidgetByName(opration_panel, "discard_btn");
        opration_panel.setLocalZOrder(100);
        if (player.curGameRoom.waitIdx === player.serverSeatNum) {
            opration_panel.setVisible(true);
            self.update_anticheating();

            if (this.prepareCards && this.prepareCards.length <= 0) {
                discard_btn.setTouchEnabled(false);
                discard_btn.setBright(false)
            } else {
                discard_btn.setTouchEnabled(true);
                discard_btn.setBright(true)
            }
            if (player.curGameRoom.waitIdx === player.curGameRoom.controllerIdx) {
                if (player.curGameRoom.playerPokerList[self.update_single_player(player.serverSeatNum)].length === 1) {
                    tips_btn.setTouchEnabled(false);
                }
                pass_btn.setVisible(false);
                self.reset_cover_state();
            } else {
                pass_btn.setVisible(true);
                tips_btn.setTouchEnabled(true);
            }
            // if (player.curGameRoom.gameForce === 0) {
            //     pass_btn.setVisible(false);
            // }
        } else {
            opration_panel.setVisible(false)
        }
    },

    update_no_discards: function (idx) {
        var player = h1global.entityManager.player();
        var deskSeat = player.server2CurSitNum(idx);
        cc.log("update_no_discards  idx:" + idx + "  deskSeat :" + deskSeat);
        for (var i = 0; i < player.curGameRoom.playerNum; i++) {
            if (player.curGameRoom.playerNum === 3 && i === 2) {
                i = 3;
            }
            var player_info_panel = this.rootUINode.getChildByName("player_info_panel_" + i);
            // var bubble_bg_img = player_info_panel.getChildByName("bubble_bg_img")
            // var bubble_img = bubble_bg_img.getChildByName("bubble_img");
            var not_afford_img = player_info_panel.getChildByName("not_afford_img");
            not_afford_img.setLocalZOrder(-100);
            if (i != deskSeat || idx === const_val.PDK_DEFALUT) {
                // bubble_bg_img.setVisible(false);
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
                // bubble_bg_img.setVisible(true);
                // bubble_img.loadTexture("res/ui/GameRoomUI/bubble_discard.png")
            }
        }
    },

    //庄家
    update_identity_image: function (dealerIdx) {
        return;
        var player = h1global.entityManager.player();
        //   this.alreadyDiscards = [];
        if (dealerIdx < 0) {
            for (var i = 0; i < player.curGameRoom.playerNum; i++) {
                var player_info_panel = this.rootUINode.getChildByName("player_info_panel_" + i);
                //var identity_img = player_info_panel.getChildByName("identity_img");
                //identity_img.setVisible(false);
            }
        } else {
            var player = h1global.entityManager.player();
            var deskSeat = player.server2CurSitNum(dealerIdx);
            var player_info_panel = this.rootUINode.getChildByName("player_info_panel_" + deskSeat);
            //var identity_img = player_info_panel.getChildByName("identity_img");
            //identity_img.setVisible(false);
        }
    },

    getMagicPos: function (deskSeat) {
        if (deskSeat < 0 || deskSeat > 3) {
            return null
        }
        var playerInfoPanel = this.rootUINode.getChildByName("player_info_panel_" + deskSeat);
        if (playerInfoPanel) {
            var anchor_point = playerInfoPanel.getAnchorPoint();
            var content_size = playerInfoPanel.getContentSize();
            var cur_pos = playerInfoPanel.getPosition();
            if (deskSeat !== 0) {
                var x = cur_pos.x - content_size.width * (anchor_point.x - 0.5);
                var y = cur_pos.y - content_size.height * (anchor_point.y - 0.5);
            } else {
                var x = cur_pos.x + 45;
                var y = cur_pos.y + 62;
            }
            return cc.p(x, y);
        }
    },

    getMessagePos: function (deskSeat) {
        if (deskSeat < 0 || deskSeat > 3) {
            return null
        }
        var playerInfoPanel = this.rootUINode.getChildByName("player_info_panel_" + deskSeat);
        if (playerInfoPanel) {
            var anchor_point = playerInfoPanel.getAnchorPoint();
            var content_size = playerInfoPanel.getContentSize();
            var cur_pos = playerInfoPanel.getPosition();
            if (deskSeat === 1) {
                var x = cur_pos.x - content_size.width * anchor_point.x - 110;
                var y = cur_pos.y - content_size.height * anchor_point.y + 130;
            } else if (deskSeat === 0) {
                var x = cur_pos.x - content_size.width * anchor_point.x + 130;
                var y = cur_pos.y - content_size.height * anchor_point.y + 180;
            } else if (deskSeat === 2) {
                var x = cur_pos.x - content_size.width * anchor_point.x + 230;
                var y = cur_pos.y - content_size.height * anchor_point.y + 70;
            } else {
                var x = cur_pos.x - content_size.width * anchor_point.x + 230;
                var y = cur_pos.y - content_size.height * anchor_point.y + 100;
            }
            return cc.p(x, y);
        }
    },

    update_magic: function (eid) {
        var magic = {};
        var activeTime = {};
        var anim = {};
        var position = {};
        var info_list = [];
        switch (eid) {
            case 1:
                magic = {"FRAMENUM": 15, "TIME": 1.2, "NAME": "MagicCheersUI/"};
                activeTime = {"Scalebefore": 0.6, "Scaleafter": 1.5};
                position = {"x": 0, "y": 0};
                break;
            case 2:
                magic = {"FRAMENUM": 16, "TIME": 1.6, "NAME": "MagicEgeUI/"};
                activeTime = {"Scalebefore": 0.7, "Scaleafter": 2};
                position = {"x": -25, "y": -10};
                break;
            case 3:
                magic = {"FRAMENUM": 16, "TIME": 1, "NAME": "MagicSlipperUI/"};
                activeTime = {"Scalebefore": 1, "Scaleafter": 1};
                anim = {"Rotate": 360};
                position = {"x": 0, "y": 0};
                break;
            case 4:
                magic = {"FRAMENUM": 25, "TIME": 1.8, "NAME": "MagicKissUI/"};
                activeTime = {"Scalebefore": 0.8, "Scaleafter": 1.5};
                position = {"x": 0, "y": 0};
                break;
            default:
                break;
        }
        info_list.push(magic);
        info_list.push(activeTime);
        info_list.push(anim);
        info_list.push(position);
        return info_list;
    },

    playMagicEmoAnim: function (idxFrom, idxTo, eid) {
        var self = this;
        var action = undefined;
        var player = h1global.entityManager.player();
        if (idxFrom === idxTo) {
            return
        }
        var fromPos = this.getMagicPos(player.server2CurSitNum(idxFrom));
        var toPos = this.getMagicPos(player.server2CurSitNum(idxTo));
        var magic_list = this.update_magic(eid);
        if (!magic_list) {
            return
        }
        var magic = magic_list[0];
        var magic_name = magic["NAME"].substr(0, magic["NAME"].length - 1);
        var magic_img = new ccui.ImageView();
        // 偏移量
        var dev_pos = magic_list[3];
        fromPos.x = fromPos.x + dev_pos["x"];
        fromPos.y = fromPos.y + dev_pos["y"];
        toPos.x = toPos.x + dev_pos["x"];
        toPos.y = toPos.y + dev_pos["y"];
        // 移动动画
        magic_img.loadTexture("res/ui/MagicUI/" + eid.toString() + ".png");
        magic_img.setPosition(fromPos);
        magic_img.setAnchorPoint(0.2, 0.5);
        magic_img.setScale(magic_list[1]["Scalebefore"]);
        magic_img.setLocalZOrder(10000);
        this.rootUINode.addChild(magic_img);

        if (eid === 3) {
            action = cc.spawn(
                cc.moveTo(0.6, toPos),
                cc.rotateBy(0.6, magic_list[2]["Rotate"])
            )
        } else {
            action = cc.moveTo(0.6, toPos)
        }
        magic_img.runAction(cc.sequence(
            action,
            cc.callFunc(function () {
                magic_img.removeFromParent();
                UICommonWidget.load_effect_plist(magic_name);
                var effectdice = cc.Sprite.create();
                effectdice.setScale(magic_list[1]["Scaleafter"]);
                effectdice.setPosition(toPos);
                self.rootUINode.addChild(effectdice);
                effectdice.runAction(cc.sequence(
                    UICommonWidget.create_effect_action(magic_list[0]),
                    cc.callFunc(function () {
                        effectdice.removeFromParent();
                    })
                ));
            })
        ));
        // 音效
        cc.audioEngine.playEffect("res/sound/effect/magic" + eid + ".mp3");
    },

    update_emotion_num: function (eid) {
        var info = [];
        var actioninfo = {};
        var action_num = 1;
        switch (eid) {
            case 1:
                actioninfo = {"FRAMENUM": 4, "TIME": 1, "NAME": "Emot/biaoqing_1_"};
                action_num = 2;
                break;
            case 2:
                actioninfo = {"FRAMENUM": 4, "TIME": 1, "NAME": "Emot/biaoqing_2_"};
                action_num = 2;
                break;
            case 3:
                actioninfo = {"FRAMENUM": 2, "TIME": 0.5, "NAME": "Emot/biaoqing_3_"};
                action_num = 4;
                break;
            case 4:
                actioninfo = {"FRAMENUM": 6, "TIME": 1, "NAME": "Emot/biaoqing_4_"};
                action_num = 1;
                break;
            case 5:
                actioninfo = {"FRAMENUM": 4, "TIME": 1, "NAME": "Emot/biaoqing_5_"};
                action_num = 2;
                break;
            case 6:
                actioninfo = {"FRAMENUM": 3, "TIME": 0.7, "NAME": "Emot/biaoqing_6_"};
                action_num = 3;
                break;
            case 7:
                actioninfo = {"FRAMENUM": 4, "TIME": 1, "NAME": "Emot/biaoqing_7_"};
                action_num = 1;
                break;
            case 8:
                actioninfo = {"FRAMENUM": 4, "TIME": 1, "NAME": "Emot/biaoqing_8_"};
                action_num = 2;
                break;
            case 9:
                actioninfo = {"FRAMENUM": 4, "TIME": 1, "NAME": "Emot/biaoqing_9_"};
                action_num = 2;
                break;
            default:
                break;
        }
        info.push(actioninfo);
        info.push(action_num);
        return info;
    },

    update_emotion_action: function (plist) {
        if (!plist) {
            return
        }
        var info;
        var action = plist[0];
        var action_num = plist[1];
        switch (action_num) {
            case 1:
                info = UICommonWidget.create_effect_action(action);
                break;
            case 2:
                info = cc.sequence(
                    UICommonWidget.create_effect_action(action),
                    UICommonWidget.create_effect_action(action)
                );
                break;
            case 3:
                info = cc.sequence(
                    UICommonWidget.create_effect_action(action),
                    UICommonWidget.create_effect_action(action),
                    UICommonWidget.create_effect_action(action)
                );
                break;
            case 4:
                info = cc.sequence(
                    UICommonWidget.create_effect_action(action),
                    UICommonWidget.create_effect_action(action),
                    UICommonWidget.create_effect_action(action),
                    UICommonWidget.create_effect_action(action)
                );
                break;
            default:
                break;
        }
        return info;
    },

    update_talk_bg_pos: function (talk_img, idx) {
        if (!talk_img || idx < 0) {
            return
        }
        if (idx === 1) {
            talk_img.loadTexture(res.communicate_bg_1);
        } else if (idx === 2 || idx === 3) {
            talk_img.loadTexture(res.communicate_bg_2);
        } else {
            talk_img.loadTexture(res.communicate_bg_0);
        }
    },

    playEmotionAnim: function (serverSeatNum, eid) {
        var deskSeat = h1global.entityManager.player().server2CurSitNum(serverSeatNum);
        var player_info_panel = this.rootUINode.getChildByName("player_info_panel_" + deskSeat);
        var talk_img = ccui.ImageView.create();
        talk_img.setScale(1.0);
        talk_img.setPosition(this.getMessagePos(deskSeat));
        this.update_talk_bg_pos(talk_img, deskSeat);
        this.rootUINode.addChild(talk_img);

        // 牌特效
        UICommonWidget.load_effect_plist("biaoqing");
        var emot_sprite = cc.Sprite.create();
        emot_sprite.setScale(0.4);
        emot_sprite.setPosition(cc.p(talk_img.getContentSize().width * 0.5, talk_img.getContentSize().height * 0.5));
        talk_img.addChild(emot_sprite);

        var plist = this.update_emotion_num(eid);
        var action = this.update_emotion_action(plist);
        if (!plist || !action) {
            return
        }
        emot_sprite.runAction(
            cc.sequence(
                action,
                cc.callFunc(function () {
                    talk_img.removeFromParent();
                })
            )
        );
    },

    playMessageAnim: function (serverSitNum, mid) {
        var deskSeat = h1global.entityManager.player().server2CurSitNum(serverSitNum);
        var player_info_panel = this.rootUINode.getChildByName("player_info_panel_" + deskSeat);
        var talk_img = ccui.ImageView.create();
        talk_img.setScale(1.0);
        talk_img.setPosition(this.getMessagePos(deskSeat));
        this.update_talk_bg_pos(talk_img, deskSeat);
        this.rootUINode.addChild(talk_img);

        var msg_label = cc.LabelTTF.create("", "Arial", 22);
        msg_label.setDimensions(200, 0);
        msg_label.setString(const_val.MESSAGE_LIST[mid]);
        msg_label.setColor(cc.color(0, 0, 0));
        msg_label.setAnchorPoint(cc.p(0.5, 0.5));
        msg_label.setPosition(cc.p(125, 80));
        talk_img.addChild(msg_label);
        msg_label.runAction(cc.Sequence.create(cc.DelayTime.create(2.0), cc.CallFunc.create(function () {
            talk_img.removeFromParent();
        })));
    },

    playVoiceAnim: function (serverSitNum, record_time) {
        var self = this;
        if (cc.audioEngine.isMusicPlaying()) {
            cc.audioEngine.pauseMusic();
        }
        var interval_time = 0.8;
        this.talk_img_num += 1;
        var deskSeat = h1global.entityManager.player().server2CurSitNum(serverSitNum);
        // var player_info_panel = this.rootUINode.getChildByName("player_info_panel" + h1global.entityManager.player().server2CurSitNum(serverSitNum));
        var player_info_panel = undefined;
        if (serverSitNum < 0) {
            player_info_panel = this.rootUINode.getChildByName("agent_info_panel");
        } else {
            player_info_panel = this.rootUINode.getChildByName("player_info_panel_" + deskSeat);
        }
        var talk_img = ccui.ImageView.create();
        // talk_img.setScale(1.0);
        talk_img.setPosition(this.getMessagePos(deskSeat));
        talk_img.loadTexture("res/ui/Default/voice_img.png");
        this.rootUINode.addChild(talk_img);
        // 加载表情图片
        // var voice_img = ccui.ImageView.create();
        // voice_img.setScale(1.0);
        // voice_img.setPosition(cc.p(134, 120));
        // voice_img.loadTexture("res/ui/GameRoomInfoUI/gameroominfo_record_btn.png");
        // talk_img.addChild(voice_img);
        var voice_img1 = ccui.ImageView.create();
        voice_img1.loadTexture("res/ui/Default/voice_img1.png");
        voice_img1.setPosition(cc.p(50, 37));
        talk_img.addChild(voice_img1);
        var voice_img2 = ccui.ImageView.create();
        voice_img2.loadTexture("res/ui/Default/voice_img2.png");
        voice_img2.setPosition(cc.p(60, 37));
        voice_img2.setVisible(false);
        talk_img.addChild(voice_img2);
        voice_img2.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.DelayTime.create(interval_time), cc.CallFunc.create(function () {
            voice_img2.setVisible(true)
        }), cc.DelayTime.create(interval_time * 2), cc.CallFunc.create(function () {
            voice_img2.setVisible(false)
        }))));
        var voice_img3 = ccui.ImageView.create();
        voice_img3.loadTexture("res/ui/Default/voice_img3.png");
        voice_img3.setPosition(cc.p(70, 37));
        voice_img3.setVisible(false);
        talk_img.addChild(voice_img3);
        voice_img3.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.DelayTime.create(interval_time * 2), cc.CallFunc.create(function () {
            voice_img3.setVisible(true)
        }), cc.DelayTime.create(interval_time), cc.CallFunc.create(function () {
            voice_img3.setVisible(false)
        }))));
        talk_img.runAction(cc.Sequence.create(cc.DelayTime.create(record_time), cc.CallFunc.create(function () {
            talk_img.removeFromParent();
            self.talk_img_num -= 1;
            if (self.talk_img_num === 0) {
                if (!cc.audioEngine.isMusicPlaying()) {
                    cc.audioEngine.resumeMusic();
                }
            }
        })));
        // return talk_img;
    },

    show_yellow_frame: function (waitidx) {
        var self = this;
        var player = h1global.entityManager.player();
        cc.log("show_yellow_frame  is  running , waitIdx :" + waitidx);
        if (waitidx < 0) {
            for (var i = 0; i < player.curGameRoom.playerNum; i++) {
                if (player.curGameRoom.playerNum === 3 && i === 2) {
                    i = 3;
                }
                var player_info_panel = self.rootUINode.getChildByName("player_info_panel_" + i);
                var clock_img = player_info_panel.getChildByName("clock_img");
                clock_img.setVisible(false);
            }
        } else {
            for (var i = 0; i < player.curGameRoom.playerNum; i++) {
                if (player.curGameRoom.playerNum === 3 && i === 2) {
                    i = 3;
                }
                var player_info_panel = self.rootUINode.getChildByName("player_info_panel_" + i);
                var clock_img = player_info_panel.getChildByName("clock_img");
                var clock_label = clock_img.getChildByName("clock_label");
                if (i === h1global.entityManager.player().server2CurSitNum(waitidx)) {
                    clock_img.setVisible(true);
                    onhookMgr.setclockLeftTime(const_val.PLAYER_WAIT_TIME);
                } else {
                    clock_img.setVisible(false);
                }
            }
        }
    },

    update_clock_left_time: function (leftTime) {
        if (!this.is_show) {
            return;
        }
        if (leftTime < 0) {
            leftTime = 0;
        }
        var player = h1global.entityManager.player();

        if (player.curGameRoom) {
            var player_info_panel = this.rootUINode.getChildByName("player_info_panel_" + player.server2CurSitNum(player.curGameRoom.waitIdx));
            var clock_img = player_info_panel.getChildByName("clock_img");
            var clock_label = clock_img.getChildByName("clock_label");
            clock_label.setString(Math.floor(leftTime));
            if (h1global.curUIMgr.settlement_ui && h1global.curUIMgr.settlement_ui.is_show) {
                clock_img.setVisible(false);
            }
            if (Math.floor(leftTime) === 3) {
                cc.audioEngine.playEffect(res.sound_clock);
            }
        }
    },

    playCardsEffect: function (sex, cards, cardsType) {
        cc.log("playCardsEffect  " + cards + "  cardsType: " + cardsType);

        var cardNum = cutil.rightShiftCards(cards)[0];
        if (sex === 1) {
            if (cardsType === 2) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Male/" + cardNum.toString() + ".mp3");
            } else if (cardsType === 3) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Male/dui" + cardNum.toString() + ".mp3");
            } else if (cardsType === 4) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Male/liandui.mp3");
                this.update_pairs_animation();
            } else if (cardsType === 5) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Male/sanbudai.mp3");
            } else if (cardsType === 6 || cardsType === 14) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Male/plane1.mp3");
                cc.audioEngine.playEffect("res/sound/voice/CardType/Male/plane2.mp3");
                this.update_plane_animation();
            } else if (cardsType === 7) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Male/shunzi.mp3");
                this.update_straight_animation();
            } else if (cardsType === 99) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Male/zhadan.mp3");
                this.update_bomb_animation();
            } else if (cardsType === 20) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Male/wangzha.mp3");
                this.update_joker_animation();
            } else if (cardsType === 12) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Male/sandai1.mp3");
            } else if (cardsType === 13) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Male/sandai2.mp3");
            }

        } else {
            if (cardsType === 2) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Female/" + cardNum.toString() + ".mp3");
            } else if (cardsType === 3) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Female/dui" + cardNum.toString() + ".mp3");
            } else if (cardsType === 4) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Female/liandui.mp3");
                this.update_pairs_animation();
            } else if (cardsType === 5) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Female/sanbudai.mp3");
            } else if (cardsType === 6 || cardsType === 14) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Female/plane1.mp3");
                cc.audioEngine.playEffect("res/sound/voice/CardType/Female/plane2.mp3");
                this.update_plane_animation();
            } else if (cardsType === 7) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Female/shunzi.mp3");
                this.update_straight_animation();
            } else if (cardsType === 99) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Female/zhadan.mp3");
                this.update_bomb_animation();
            } else if (cardsType === 20) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Female/wangzha.mp3");
                this.update_joker_animation();
            } else if (cardsType === 12) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Female/sandai1.mp3");
            } else if (cardsType === 13) {
                cc.audioEngine.playEffect("res/sound/voice/CardType/Female/sandai2.mp3");
            }
        }
    },

    playLeftsCardsEffect: function (sex, leftsCardsNum) {
        cc.log("playLeftsCardsEffect", sex, leftsCardsNum);
        var player = h1global.entityManager.player();
        if (leftsCardsNum < 2 && leftsCardsNum > 0) {
            this.runAction(cc.Sequence.create(cc.DelayTime.create(0.5), cc.CallFunc.create(function () {
                if (sex === 1) {
                    cc.log("res/sound/voice/ThrowCards/Male/baopai_" + leftsCardsNum.toString() + ".mp3");
                    cc.audioEngine.playEffect("res/sound/voice/CardType/Male/lastcard" + leftsCardsNum.toString() + ".mp3")
                } else {
                    cc.log("res/sound/voice/ThrowCards/Female/baopai_" + leftsCardsNum.toString() + ".mp3");
                    cc.audioEngine.playEffect("res/sound/voice/CardType/Female/lastcard" + leftsCardsNum.toString() + ".mp3")
                }
            })))
        }
    },

    update_bomb_animation: function () {
        cc.log("update_bomb_animation  " + cc.winSize.width + "   " + cc.winSize.height);
        var animation_panel = this.rootUINode.getChildByName("animation_panel");
        UICommonWidget.load_effect_plist("action_bomb0");
        var action_bomb_sprite = cc.Sprite.create();
        action_bomb_sprite.setPosition(100, 230);
        action_bomb_sprite.runAction(cc.RepeatForever.create(
            cc.Sequence.create(
                UICommonWidget.create_effect_action({"FRAMENUM": 25, "TIME": 1.6, "NAME": "spr_action_bomb_"}),
                cc.CallFunc.create(function () {
                    action_bomb_sprite.removeFromParent();
                })
            )
        ));
        cc.audioEngine.playEffect("res/sound/voice/CardType/Female/zhadan_sound.mp3");
        animation_panel.addChild(action_bomb_sprite);
    },

    update_pairs_animation: function () {
        cc.log("update_pairs_animation");
        var animation_panel = this.rootUINode.getChildByName("animation_panel");
        UICommonWidget.load_effect_plist("action_dbLine0");
        var action_dbLine_sprite = cc.Sprite.create();
        action_dbLine_sprite.setPosition(100, 80);
        action_dbLine_sprite.runAction(cc.RepeatForever.create(
            cc.Sequence.create(
                UICommonWidget.create_effect_action({"FRAMENUM": 12, "TIME": 1.3, "NAME": "spr_action_dbLine_"}),
                cc.CallFunc.create(function () {
                    action_dbLine_sprite.removeFromParent();
                })
            )
        ));
        animation_panel.addChild(action_dbLine_sprite);
    },

    update_plane_animation: function () {
        cc.log("update_plane_animation");
        var animation_panel = this.rootUINode.getChildByName("animation_panel");
        UICommonWidget.load_effect_plist("action_plane0");
        var action_plane_sprite = cc.Sprite.create();
        action_plane_sprite.setPosition(300, 50);
        action_plane_sprite.runAction(cc.RepeatForever.create(
            cc.Sequence.create(
                UICommonWidget.create_effect_action({"FRAMENUM": 4, "TIME": 1.1, "NAME": "spr_action_plane_"}),
                cc.CallFunc.create(function () {
                    action_plane_sprite.removeFromParent();
                })
            )
        ));
        action_plane_sprite.runAction(cc.MoveTo.create(1.0, cc.p(-200, 50)));
        animation_panel.addChild(action_plane_sprite);
    },

    update_straight_animation: function () {
        cc.log("update_straight_animation");
        var animation_panel = this.rootUINode.getChildByName("animation_panel");
        UICommonWidget.load_effect_plist("shunzi");
        var CardType0_sprite = cc.Sprite.create();
        CardType0_sprite.setPosition(100, 50);
        CardType0_sprite.runAction(cc.RepeatForever.create(
            cc.Sequence.create(
                UICommonWidget.create_effect_action({"FRAMENUM": 24, "TIME": 1.3, "NAME": "ShunziUI/"}),
                cc.CallFunc.create(function () {
                    CardType0_sprite.removeFromParent();
                })
            )
        ));
        animation_panel.addChild(CardType0_sprite);
    },

    update_joker_animation: function () {
        cc.log("update_joker_animation");
        var animation_panel = this.rootUINode.getChildByName("animation_panel");
        UICommonWidget.load_effect_plist("action_rocket0");
        var action_rocket_sprite = cc.Sprite.create();
        action_rocket_sprite.setPosition(50, -200);
        action_rocket_sprite.runAction(cc.RepeatForever.create(
            cc.Sequence.create(
                UICommonWidget.create_effect_action({"FRAMENUM": 3, "TIME": 0.5, "NAME": "spr_action_rocket_"}),
                cc.CallFunc.create(function () {
                    action_rocket_sprite.removeFromParent();
                })
            )
        ));
        cc.audioEngine.playEffect("res/sound/voice/CardType/Female/plane2.mp3");
        action_rocket_sprite.runAction(cc.MoveTo.create(0.5, cc.p(50, 500)));
        animation_panel.addChild(action_rocket_sprite);
    },

    update_spring_action: function (roomInfo) {
        var player = h1global.entityManager.player();
        var animation_panel = this.rootUINode.getChildByName("animation_panel");
        UICommonWidget.load_effect_plist("action_spring0");
        var action_spring0_sprite = cc.Sprite.create();
        action_spring0_sprite.setPosition(100, 50);
        action_spring0_sprite.runAction(cc.RepeatForever.create(
            cc.Sequence.create(
                UICommonWidget.create_effect_action({"FRAMENUM": 12, "TIME": 1.2, "NAME": "spr_action_spring_"}),
                cc.CallFunc.create(function () {
                    action_spring0_sprite.removeFromParent();
                    player.resultShow(roomInfo);
                })
            )
        ));
        animation_panel.addChild(action_spring0_sprite);
    },

    update_gameForce: function () {
        var self = this;
        var player = h1global.entityManager.player();
        var pass_btn = self.rootUINode.getChildByName("opration_panel").getChildByName("pass_btn");
        if (player.curGameRoom.gameForce === 0) {
            pass_btn.setVisible(false);
        } else {
            // pass_btn.setVisible(true);
            if (player.curGameRoom.waitIdx === player.curGameRoom.controllerIdx) {
                pass_btn.setVisible(false)
            } else {
                pass_btn.setVisible(true)
            }
        }
    },

    update_pre_discard: function () {
        return;
        var self = this;
        var player = h1global.entityManager.player();
        player.getTipsCards(4);
        var tips_list = player.tipsList;
        var front_player = self.update_single_player(player.serverSeatNum);
        // 报单
        if (tips_list && tips_list[0] && player.curGameRoom.playerPokerList[front_player].length != 1
            || (player.curGameRoom.playerPokerList[front_player].length === 1 && player.curGameRoom.waitIdx != player.curGameRoom.controllerIdx)) {
            this.prepareCards = tips_list[0];
            this.setTipsCards(tips_list[0]);
        }
        if (player.curGameRoom.controller_discard_list.length === 0) {
            this.prepareCards = [];
            this.update_hand_card_panel();
            var discard_btn = ccui.helper.seekWidgetByName(self.rootUINode.getChildByName("opration_panel"), "discard_btn");
            discard_btn.setTouchEnabled(false);
            discard_btn.setBright(false);
        }
        this.update_gameForce();
    },

    update_not_afford: function () {
        var self = this;
        var player = h1global.entityManager.player();
        // player.getTipsCards(4);
        // var tips_list = player.tipsList;
        // if (tips_list.length === 0) {
        cc.log("要不起要不起要不起要不起要不起要不起要不起要不起");
        var not_afford_img = self.rootUINode.getChildByName("player_info_panel_0").getChildByName("not_afford_img");
        not_afford_img.setLocalZOrder(-100);
        not_afford_img.runAction(cc.Sequence.create(
            cc.delayTime(0.8),
            cc.CallFunc.create(function () {
                player.confirmOperation(const_val.OP_PASS, []);
                self.rootUINode.getChildByName("opration_panel").setVisible(false);
                self.update_hand_card_panel();
                self.prepareCards = [];
                self.reset_cover_state();
            })
        ))
        //}
    },

    is_afford: function (waitIdx) {
        var player = h1global.entityManager.player();
        player.reqIsAfford(waitIdx);
    },

    getdisType: function () {
        var player = h1global.entityManager.player();
        var playerPokers = player.curGameRoom.playerPokerList[player.serverSeatNum];
        var card_list = cutil.deepCopy(playerPokers);
        var result = player.canPlayCards(card_list);
        if (player && playerPokers) {
            if (cutil.checkHasNormalBomb(playerPokers) && result[0]) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    },

    canAutoPlayCard: function () {
        var self = this;
        var player = h1global.entityManager.player();
        var playerPokers = player.curGameRoom.playerPokerList[player.serverSeatNum];
        var card_list = cutil.deepCopy(playerPokers);
        var result = player.canPlayCards(card_list);
        if (cutil.checkHasNormalBomb(playerPokers)) {
            return false;
        }
        if (result[0]) {
            self.rootUINode.getChildByName("opration_panel").setVisible(false);
            player.confirmOperation(const_val.OP_DISCARD, card_list, card_list);
            self.update_hand_card_panel();
            self.rootUINode.getChildByName("opration_panel").setVisible(false);
            self.prepareCards = [];
            self.reset_cover_state();
        }
    },

    showLastCards: function (win_idx, lastcards_list,callBack) {
        cc.log("最后显示牌！");
        cc.log("lastcards_list:", lastcards_list);
        var self = this;

        self.show_yellow_frame(-1);
        var player = h1global.entityManager.player();
        for (var i = 0; i < lastcards_list.length; i++) {
            var deskSeat = player.server2CurSitNum(i);
            if (deskSeat === 0) {
                self.update_discard_card_panel(deskSeat, []);
                continue;
            } else if (deskSeat === -1) {
                deskSeat = 3;
                self.update_discard_card_panel(deskSeat, lastcards_list[i]);
            } else if (deskSeat === 2) {
                deskSeat = 4;
                self.update_discard_card_panel(deskSeat, lastcards_list[i]);
            } else {
                self.update_discard_card_panel(deskSeat, lastcards_list[i]);
            }
            cc.log("lastcards_list[" + deskSeat + "]:", lastcards_list[i])
        }

        var deskSitNum = player.server2CurSitNum(win_idx) === 2 ? 4 : player.server2CurSitNum(win_idx);
        var winCards = player.curGameRoom.deskPokerList[win_idx];
        var keyCardNum = 0;
        if (winCards.length > 1) {
            for (var i = 0; i < winCards.length; i++) {
                if (const_val.INSTEAD.indexOf(winCards[i]) >= 0) {
                    keyCardNum += 1
                }
            }
            if (keyCardNum > 0) {
                var classifyList = cutil.classifyCards(winCards);
                var normalCards = cutil.rightShiftCards(classifyList[0]);
                var keyCardsList = cutil.rightShiftCards(classifyList[1]);

                winCards = cutil.makeCard(winCards, cutil.getInsteadCardsType(normalCards, keyCardsList)[0])
            }
        }
        cc.log("winCards ", winCards);
        self.update_discard_card_panel(deskSitNum, winCards);
        if (callBack){
            callBack();
        }
    },
});