// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
"use strict";
var CreateRoomUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/CreateRoomUI.json";
    },

    initUI: function () {
        this.initDefault(1);
        this.people_chx_list = [];

        this.createroom_panel = this.rootUINode.getChildByName("createroom_panel");
        var game_mode_panel0 = this.createroom_panel.getChildByName("game_mode_panel0");
        var game_mode_panel1 = this.createroom_panel.getChildByName("game_mode_panel1");
        var game_mode_panel2 = this.createroom_panel.getChildByName("game_mode_panel2");
        this.game_mode_panel_list = [game_mode_panel0, game_mode_panel1, game_mode_panel2];

        var game_mode_btn_0 = this.createroom_panel.getChildByName("game_mode_btn_0");
        var game_mode_btn_1 = this.createroom_panel.getChildByName("game_mode_btn_1");
        var game_mode_btn_2 = this.createroom_panel.getChildByName("game_mode_btn_2");
        // game_mode_btn_2.setVisible(false);
        this.game_mode_list = [game_mode_btn_0, game_mode_btn_1, game_mode_btn_2];

        var key_chx1 = game_mode_panel2.getChildByName("key_chx1");
        var key_chx2 = game_mode_panel2.getChildByName("key_chx2");
        var key_chx3 = game_mode_panel2.getChildByName("key_chx3");
        this.key_chx_list = [key_chx1, key_chx2, key_chx3];

        var deal_label2 = game_mode_panel2.getChildByName("deal_label2");
        var deal_label3 = game_mode_panel2.getChildByName("deal_label3");
        this.deal_label_list = [deal_label2, deal_label3];

        this.initCreateRoomPanel();
        this.initPanel();
    },

    initDefault: function (type, isReset) {
        isReset = isReset === undefined ? false : isReset;
        var info = cc.sys.localStorage.getItem("UI_CREATE_INFO");
        cc.log("initDefault ", info);
        cc.log("initDefault ", typeof(info));
        if (info && !isReset) {
            var room_op = JSON.parse(info);
            if (type === 1) {
                this.gameMode = room_op.game_mode;       // 游戏模式 0:经典  1:15张  2:癞子
            }
            this.gameRound = room_op.game_round;     // 房间局数 10局  20局
            this.playerNum = room_op.player_num;      // 玩家人数  3人 2人  4人
            this.gameFunction = room_op.game_function;   // 功能选择 0:显示牌 1:不显示牌
            this.gameStart = room_op.game_start;      // 0: 首局先出黑桃3  1：首局无要求
            this.gameHei3 = room_op.game_hei3;       // 0：每局黑桃三先出   1：第二局庄家先出
            this.gameDeal = room_op.game_deal;       // 分牌选择 0:单张分   1:155分    2:444分
            this.gameForce = room_op.game_force;      // 玩法选择 0:必须管 1:可不要
            this.gameCardnum = room_op.game_cardnum;    // 牌数选择 0:16张 1:15张 2:一副牌
            this.gamePlays = room_op.game_plays; // 最后选择 红桃10扎鸟，四带二，四带三   炸弹不可拆
            this.gameEnd = room_op.game_end;    // 最后选择 三张可少带出完，三张可少带接完，飞机可少带出完   飞机可少带接完
            this.anticheating = room_op.anticheating;   // 防作弊选择 0:关 1:开
        } else {
            if (type === 1) {
                this.gameMode = 0;       // 游戏模式 0:经典  1:15张  2:癞子
            }
            this.gameRound = 10;     // 房间局数 10局  20局
            this.playerNum = 3;      // 玩家人数  3人 2人  4人
            this.gameFunction = 0;   // 功能选择 0:显示牌 1:不显示牌
            this.gameStart = 0;      // 0: 首局先出黑桃3  1：首局无要求
            this.gameHei3 = 1;       // 0：每局黑桃三先出   1：第二局庄家先出
            this.gameDeal = 0;       // 分牌选择 0:单张分   1:155分    2:444分
            this.gameForce = 0;      // 玩法选择 0:必须管 1:可不要
            this.gameCardnum = 0;    // 牌数选择 0:16张 1:15张 2:一副牌
            this.gamePlays = [0, 1, 0, 0]; // 最后选择 红桃10扎鸟，四带二，四带三   炸弹不可拆
            this.gameEnd = [1, 0, 1, 0];    // 最后选择 三张可少带出完，三张可少带接完，飞机可少带出完   飞机可少带接完
            this.anticheating = 1;   // 防作弊选择 0:关 1:开
        }
    },

    initPanel: function () {
        var self = this;
        var game_mode_panel = this.createroom_panel.getChildByName("game_mode_panel" + self.gameMode);

        var round_chx1 = game_mode_panel.getChildByName("round_chx1");
        var round_chx2 = game_mode_panel.getChildByName("round_chx2");
        this.round_chx_list = [round_chx1, round_chx2];

        if (self.gameMode !== 2) {
            var people_chx1 = game_mode_panel.getChildByName("people_chx1");
            var people_chx2 = game_mode_panel.getChildByName("people_chx2");
            this.people_chx_list = [people_chx1, people_chx2];
        } else {
            var people_chx1 = game_mode_panel.getChildByName("people_chx1");
            var people_chx2 = game_mode_panel.getChildByName("people_chx2");
            var people_chx3 = game_mode_panel.getChildByName("people_chx3");
            this.people_chx_list = [people_chx1, people_chx2, people_chx3];
        }
        cc.log("people_chx_list ", this.people_chx_list);

        var function_chx1 = game_mode_panel.getChildByName("function_chx1");
        var function_chx2 = game_mode_panel.getChildByName("function_chx2");
        this.function_chx_list = [function_chx1, function_chx2];

        var start_chx1 = game_mode_panel.getChildByName("start_chx1");
        var start_chx2 = game_mode_panel.getChildByName("start_chx2");
        this.start_chx_list = [start_chx1, start_chx2];

        var discard_chx1 = game_mode_panel.getChildByName("discard_chx1");
        var discard_chx2 = game_mode_panel.getChildByName("discard_chx2");
        this.discard_chx_list = [discard_chx1, discard_chx2];

        var deal_chx1 = game_mode_panel.getChildByName("deal_chx1");
        var deal_chx2 = game_mode_panel.getChildByName("deal_chx2");
        var deal_chx3 = game_mode_panel.getChildByName("deal_chx3");
        this.deal_chx_list = [deal_chx1, deal_chx2, deal_chx3];

        var force_chx1 = game_mode_panel.getChildByName("force_chx1");
        var force_chx2 = game_mode_panel.getChildByName("force_chx2");
        this.force_chx_list = [force_chx1, force_chx2];

        var plays_chx0 = game_mode_panel.getChildByName("plays_chx0");
        var plays_chx1 = game_mode_panel.getChildByName("plays_chx1");
        var plays_chx2 = game_mode_panel.getChildByName("plays_chx2");
        var plays_chx3 = game_mode_panel.getChildByName("plays_chx3");
        this.plays_chx_list = [plays_chx0, plays_chx1, plays_chx2, plays_chx3];

        var plane_chx1 = game_mode_panel.getChildByName("plane_chx1");
        var plane_chx2 = game_mode_panel.getChildByName("plane_chx2");
        var plane_chx3 = game_mode_panel.getChildByName("plane_chx3");
        var plane_chx4 = game_mode_panel.getChildByName("plane_chx4");
        this.plane_chx_list = [plane_chx1, plane_chx2, plane_chx3, plane_chx4];

        this.provent_slider = game_mode_panel.getChildByName("provent_slider");
        this.discard_label = game_mode_panel.getChildByName("discard_label2");
        this.updateCreateRoom();
        this.updateSelect();
    },

    initCreateRoomPanel: function () {
        var self = this;
        //关闭按钮
        var return_btn = ccui.helper.seekWidgetByName(this.createroom_panel, "return_btn");

        function return_btn_event(sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        }

        return_btn.addTouchEventListener(return_btn_event);

        //游戏模式
        function game_mode_btn_event(sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                for (var i = 0; i < self.game_mode_list.length; i++) {
                    if (sender !== self.game_mode_list[i]) {
                        self.game_mode_list[i].setBright(true);
                        self.game_mode_list[i].setTouchEnabled(true);
                        self.game_mode_panel_list[i].setVisible(false);
                    } else {
                        self.gameMode = i;
                        sender.setBright(false);
                        sender.setTouchEnabled(false);
                        self.game_mode_panel_list[i].setVisible(true);
                        self.initDefault(0, true);
                        self.initPanel();
                        cc.log("gameMode:", self.gameMode);
                    }
                }
            }
        }

        for (var i = 0; i < self.game_mode_list.length; i++) {
            var game_mode_btn = self.game_mode_list[i];
            game_mode_btn.addTouchEventListener(game_mode_btn_event);
        }
        self.game_mode_list[self.gameMode].setBright(false);
        self.game_mode_list[self.gameMode].setTouchEnabled(false);
        self.game_mode_panel_list[self.gameMode].setVisible(true);
    },

    updatePeopleNum: function (idx) {
        switch (idx) {
            case 0:
                return 3;
                break;
            case 1:
                return 2;
                break;
            case 2:
                return 4;
                break;
            default:
                break;
        }
    },

    updateSelect: function () {
        var self = this;
        //局数选择
        function round_chx_event(sender, eventType) {
            if (eventType === ccui.CheckBox.EVENT_SELECTED || eventType === ccui.CheckBox.EVENT_UNSELECTED) {
                for (var i = 0; i < self.round_chx_list.length; i++) {
                    if (sender !== self.round_chx_list[i]) {
                        self.round_chx_list[i].setSelected(false);
                        self.round_chx_list[i].setTouchEnabled(true);
                    } else {
                        self.gameRound = (i + 1) * 10;
                        sender.setSelected(true);
                        sender.setTouchEnabled(false);
                        cc.log("gameRound:" + self.gameRound);
                    }
                }
            }
        }

        for (var i = 0; i < self.round_chx_list.length; i++) {
            var round_chx = self.round_chx_list[i];
            if (i === (self.gameRound - 10) / 10) {
                round_chx.setSelected(true);
                round_chx.setTouchEnabled(false);
            } else {
                round_chx.setSelected(false);
                round_chx.setTouchEnabled(true);
            }
            round_chx.addTouchEventListener(round_chx_event);
        }

        //功能选择
        function function_chx_event(sender, eventType) {
            if (eventType === ccui.CheckBox.EVENT_SELECTED || eventType === ccui.CheckBox.EVENT_UNSELECTED) {
                for (var i = 0; i < self.function_chx_list.length; i++) {
                    if (sender !== self.function_chx_list[i]) {
                        self.function_chx_list[i].setSelected(false);
                        self.function_chx_list[i].setTouchEnabled(true);
                    } else {
                        self.gameFunction = i;
                        sender.setSelected(true);
                        sender.setTouchEnabled(false);
                        cc.log("gameFunction:" + self.gameFunction);
                    }
                }
            }
        }

        for (var i = 0; i < self.function_chx_list.length; i++) {
            var function_chx = self.function_chx_list[i];
            if (i === self.gameFunction) {
                function_chx.setSelected(true);
                function_chx.setTouchEnabled(false);
            } else {
                function_chx.setSelected(false);
                function_chx.setTouchEnabled(true);
            }
            function_chx.addTouchEventListener(function_chx_event);
        }

        //黑3先出选择
        function start_chx_event(sender, eventType) {
            if (eventType === ccui.CheckBox.EVENT_SELECTED || eventType === ccui.CheckBox.EVENT_UNSELECTED) {
                for (var i = 0; i < self.start_chx_list.length; i++) {
                    if (sender !== self.start_chx_list[i]) {
                        self.start_chx_list[i].setSelected(false);
                        self.start_chx_list[i].setTouchEnabled(true);
                    } else {
                        self.gameStart = i;
                        sender.setSelected(true);
                        sender.setTouchEnabled(false);
                        cc.log("gameStart:" + self.gameStart);
                    }
                }
            }
        }

        for (var i = 0; i < self.start_chx_list.length; i++) {
            var start_chx = self.start_chx_list[i];
            if (i === self.gameStart) {
                start_chx.setSelected(true);
                start_chx.setTouchEnabled(false);
                start_chx.setBright(true);
            } else {
                start_chx.setSelected(false);
                start_chx.setTouchEnabled(true);
                start_chx.setBright(true);
            }
            start_chx.addTouchEventListener(start_chx_event);
        }

        //先出牌选择
        function discard_chx_event(sender, eventType) {
            if (eventType === ccui.CheckBox.EVENT_SELECTED || eventType === ccui.CheckBox.EVENT_UNSELECTED) {
                for (var i = 0; i < self.discard_chx_list.length; i++) {
                    if (sender !== self.discard_chx_list[i]) {
                        self.discard_chx_list[i].setSelected(false);
                        self.discard_chx_list[i].setTouchEnabled(true);
                    } else {
                        self.gameHei3 = i;
                        sender.setSelected(true);
                        sender.setTouchEnabled(false);
                        cc.log("gameHei3:" + self.gameHei3);
                    }
                }
            }
        }

        for (var i = 0; i < self.discard_chx_list.length; i++) {
            var discard_chx = self.discard_chx_list[i];
            if (i === self.gameHei3) {
                discard_chx.setSelected(true);
                discard_chx.setTouchEnabled(false);
                discard_chx.setBright(true);
            } else {
                discard_chx.setSelected(false);
                discard_chx.setTouchEnabled(true);
                discard_chx.setBright(true);
            }
            discard_chx.addTouchEventListener(discard_chx_event);
        }

        //人数选择
        var people_list = [3, 2, 4];

        function people_chx_event(sender, eventType) {
            if (eventType === ccui.CheckBox.EVENT_SELECTED || eventType === ccui.CheckBox.EVENT_UNSELECTED) {
                for (var i = 0; i < self.people_chx_list.length; i++) {
                    if (i !== 2) {
                        if (sender !== self.people_chx_list[i]) {
                            self.people_chx_list[i].setSelected(false);
                            self.people_chx_list[i].setTouchEnabled(true);
                        } else {
                            self.playerNum = people_list[i];
                            self.updateStartHei3(i);
                            sender.setSelected(true);
                            sender.setTouchEnabled(false);
                            cc.log("playerNum:" + self.playerNum);
                        }
                    }
                }
            }
        }

        for (var i = 0; i < self.people_chx_list.length; i++) {
            var people_chx = self.people_chx_list[i];
            var playerNum = self.updatePeopleNum(i);
            if (playerNum === self.playerNum) {
                people_chx.setSelected(true);
                people_chx.setTouchEnabled(false);
                self.initStartHei3(i);
            } else {
                if (i !== 2) {
                    people_chx.setSelected(false);
                    people_chx.setTouchEnabled(true);
                    people_chx.setBright(true);
                } else {
                    people_chx.setSelected(false);
                    people_chx.setTouchEnabled(false);
                    people_chx.setBright(false);
                }
            }
            people_chx.addTouchEventListener(people_chx_event);
        }

        //分牌选择
        function deal_chx_event(sender, eventType) {
            if (eventType === ccui.CheckBox.EVENT_SELECTED || eventType === ccui.CheckBox.EVENT_UNSELECTED) {
                for (var i = 0; i < self.deal_chx_list.length; i++) {
                    if (sender !== self.deal_chx_list[i]) {
                        self.deal_chx_list[i].setSelected(false);
                        self.deal_chx_list[i].setTouchEnabled(true);
                    } else {
                        self.gameDeal = i;
                        sender.setSelected(true);
                        sender.setTouchEnabled(false);
                        cc.log("gameDeal:" + self.gameDeal);
                    }
                }
            }
        }

        for (var i = 0; i < self.deal_chx_list.length; i++) {
            var deal_chx = self.deal_chx_list[i];
            if (i === self.gameDeal) {
                deal_chx.setSelected(true);
                deal_chx.setTouchEnabled(false);
            } else {
                deal_chx.setSelected(false);
                deal_chx.setTouchEnabled(true);
            }
            deal_chx.addTouchEventListener(deal_chx_event);
        }

        //玩法选择(必须管、可不要)
        function force_chx_event(sender, eventType) {
            if (eventType === ccui.CheckBox.EVENT_SELECTED || eventType === ccui.CheckBox.EVENT_UNSELECTED) {
                for (var i = 0; i < self.force_chx_list.length; i++) {
                    if (sender !== self.force_chx_list[i]) {
                        self.force_chx_list[i].setSelected(false);
                        self.force_chx_list[i].setTouchEnabled(true);
                    } else {
                        self.gameForce = i;
                        sender.setSelected(true);
                        sender.setTouchEnabled(false);
                        cc.log("gameForce:" + self.gameForce);
                    }
                }
            }
        }

        for (var i = 0; i < self.force_chx_list.length; i++) {
            var force_chx = self.force_chx_list[i];
            if (i === self.gameForce) {
                force_chx.setSelected(true);
                force_chx.setTouchEnabled(false);
            } else {
                force_chx.setSelected(false);
                force_chx.setTouchEnabled(true);
            }
            force_chx.addTouchEventListener(force_chx_event);
        }

        //玩法选择(红桃10扎鸟、四带二、四带三、炸弹不可拆)
        function plays_chx_event(sender, eventType) {
            switch (eventType) {
                case ccui.CheckBox.EVENT_SELECTED:
                    for (var i = 0; i < self.plays_chx_list.length; i++) {
                        if (sender === self.plays_chx_list[i]) {
                            self.gamePlays[i] = 1;
                        }
                    }
                    break;
                case ccui.CheckBox.EVENT_UNSELECTED:
                    for (var i = 0; i < self.plays_chx_list.length; i++) {
                        if (sender === self.plays_chx_list[i]) {
                            self.gamePlays[i] = 0;
                        }
                    }
                    break;
                default:
                    break;
            }
            cc.log("gamePlays:" + self.gamePlays);
        }

        for (var i = 0; i < self.plays_chx_list.length; i++) {
            var plays_chx = self.plays_chx_list[i];
            if (1 === self.gamePlays[i]) {
                plays_chx.setSelected(true);
            } else {
                plays_chx.setSelected(false);
            }
            plays_chx.addEventListener(plays_chx_event);
        }
        // 特殊处理4带2、4带3
        if (self.gameMode === 2) {
            self.gamePlays[1] = 0;
            self.gamePlays[2] = 0;
        }

        //最后选择
        function plane_chx_event(sender, eventType) {
            switch (eventType) {
                case ccui.CheckBox.EVENT_SELECTED:
                    for (var i = 0; i < self.plane_chx_list.length; i++) {
                        if (sender === self.plane_chx_list[i]) {
                            self.gameEnd[i] = 1;
                        }
                    }
                    break;
                case ccui.CheckBox.EVENT_UNSELECTED:
                    for (var i = 0; i < self.plane_chx_list.length; i++) {
                        if (sender === self.plane_chx_list[i]) {
                            self.gameEnd[i] = 0;
                        }
                    }
                    break;
                default:
                    break;
            }
            cc.log("gameEnd:" + self.gameEnd);
        }

        for (var i = 0; i < self.plane_chx_list.length; i++) {
            var plane_chx = self.plane_chx_list[i];
            if (1 === self.gameEnd[i]) {
                plane_chx.setSelected(true);
            } else {
                plane_chx.setSelected(false);
            }
            plane_chx.addEventListener(plane_chx_event);
        }

        //牌数选择
        var deal_list = [["单张分", "1555分", "444分"], ["单张分", "555分", "2355分"], ["单张分", "355分", "445分"]];

        function key_chx_event(sender, eventType) {
            if (eventType === ccui.CheckBox.EVENT_SELECTED || eventType === ccui.CheckBox.EVENT_UNSELECTED) {
                for (var i = 0; i < self.key_chx_list.length; i++) {
                    if (sender !== self.key_chx_list[i]) {
                        self.key_chx_list[i].setSelected(false);
                        self.key_chx_list[i].setTouchEnabled(true);
                    } else {
                        self.gameCardnum = i;
                        self.deal_label_list[0].setString(deal_list[i][1]);
                        self.deal_label_list[1].setString(deal_list[i][2]);
                        sender.setSelected(true);
                        sender.setTouchEnabled(false);
                        self.updateKeySelect(i);
                        cc.log("gameCardnum:" + self.gameCardnum);
                    }
                }
            }
        }

        for (var i = 0; i < self.key_chx_list.length; i++) {
            var key_chx = self.key_chx_list[i];
            if (i === self.gameCardnum) {
                key_chx.setSelected(true);
                key_chx.setTouchEnabled(false);
                self.deal_label_list[0].setString(deal_list[i][1]);
                self.deal_label_list[1].setString(deal_list[i][2]);
                if (i === 2) {
                    self.updateKeySelect(i);
                }
            } else {
                key_chx.setSelected(false);
                key_chx.setTouchEnabled(true);
            }
            key_chx.addTouchEventListener(key_chx_event);
        }

        //防作弊选择
        function anticheating_event(sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                if (sender === self.provent_slider) {
                    if (self.anticheating === 1) {
                        self.anticheating = 0;
                        sender.setPercent(20);
                    } else {
                        self.anticheating = 1;
                        sender.setPercent(80);
                    }
                    cc.log("anticheating:" + self.anticheating);
                }
            }
        }

        if (self.anticheating === 0) {
            self.provent_slider.setPercent(20);
        } else {
            self.provent_slider.setPercent(80);
        }
        self.provent_slider.addTouchEventListener(anticheating_event);

        // 切换之间的初始化
        self.deal_label_list[0].setString(deal_list[0][1]);
        self.deal_label_list[1].setString(deal_list[0][2]);
        self.discard_label.setString("庄家先出");
    },

    updateKeySelect: function (idx) {
        var self = this;
        if (idx === 0 || idx === 1) {
            for (var i = 0; i < self.people_chx_list.length; i++) {
                var people_chx = self.people_chx_list[i];
                if (i === 2) {
                    people_chx.setSelected(false);
                    people_chx.setTouchEnabled(false);
                    people_chx.setBright(false);
                } else {
                    if (i === 0) {
                        people_chx.setSelected(true);
                        people_chx.setTouchEnabled(false);
                        people_chx.setBright(true);
                        self.playerNum = 3;
                    } else {
                        people_chx.setSelected(false);
                        people_chx.setTouchEnabled(true);
                        people_chx.setBright(true);
                        self.playerNum = 2;
                    }
                }
            }
            self.updateStartHei3(0);
        } else if (idx === 2) {
            for (var i = 0; i < self.people_chx_list.length; i++) {
                var people_chx = self.people_chx_list[i];
                if (i !== 2) {
                    people_chx.setSelected(false);
                    people_chx.setTouchEnabled(false);
                    people_chx.setBright(false);
                } else {
                    people_chx.setSelected(true);
                    people_chx.setTouchEnabled(false);
                    people_chx.setBright(true);
                }
            }
            self.playerNum = 4;
            self.updateStartHei3(0);
        }
    },

    updateStartHei3: function (idx) {
        var self = this;
        if (idx === 1) {
            for (var i = 0; i < self.start_chx_list.length; i++) {
                var discard_chx = self.discard_chx_list[i];
                var start_chx = self.start_chx_list[i];
                if (i === 1) {
                    discard_chx.setSelected(true);
                    discard_chx.setTouchEnabled(false);
                    discard_chx.setBright(true);
                    start_chx.setSelected(true);
                    start_chx.setTouchEnabled(false);
                    start_chx.setBright(true);
                    self.discard_label.setString("随机出牌");
                } else {
                    discard_chx.setSelected(false);
                    discard_chx.setTouchEnabled(false);
                    discard_chx.setBright(false);
                    start_chx.setSelected(false);
                    start_chx.setTouchEnabled(false);
                    start_chx.setBright(false);
                }
            }
            self.gameStart = 1;
            self.gameHei3 = 1;
        } else {
            for (var i = 0; i < self.start_chx_list.length; i++) {
                var discard_chx = self.discard_chx_list[i];
                var start_chx = self.start_chx_list[i];
                if (i === 0) {
                    discard_chx.setSelected(true);
                    discard_chx.setTouchEnabled(false);
                    discard_chx.setBright(true);
                    start_chx.setSelected(true);
                    start_chx.setTouchEnabled(false);
                    start_chx.setBright(true);
                } else {
                    discard_chx.setSelected(false);
                    discard_chx.setTouchEnabled(true);
                    discard_chx.setBright(true);
                    start_chx.setSelected(false);
                    start_chx.setTouchEnabled(true);
                    start_chx.setBright(true);
                    if (self.playerNum === 2) {
                        self.discard_label.setString("随机出牌");
                    } else {
                        self.discard_label.setString("庄家先出");
                    }
                }
            }
            self.gameStart = 0;
            self.gameHei3 = 0;
        }
    },

    initStartHei3: function (idx) {
        var self = this;
        if (idx === 1) {
            for (var i = 0; i < self.start_chx_list.length; i++) {
                var discard_chx = self.discard_chx_list[i];
                var start_chx = self.start_chx_list[i];
                if (i === 1) {
                    discard_chx.setSelected(true);
                    discard_chx.setTouchEnabled(false);
                    discard_chx.setBright(true);
                    start_chx.setSelected(true);
                    start_chx.setTouchEnabled(false);
                    start_chx.setBright(true);
                    self.discard_label.setString("随机出牌");
                } else {
                    discard_chx.setSelected(false);
                    discard_chx.setTouchEnabled(false);
                    discard_chx.setBright(false);
                    start_chx.setSelected(false);
                    start_chx.setTouchEnabled(false);
                    start_chx.setBright(false);
                }
            }
            self.gameStart = 1;
            self.gameHei3 = 1;
        }
    },

    updateCreateRoom: function () {
        var self = this;
        var create_btn = self.game_mode_panel_list[self.gameMode].getChildByName("create_btn");

        function create_btn_event(sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                cutil.lock_ui();
                // self.gameMode = 0;     // 游戏模式 0:经典  1:15张  2:癞子
                // self.gameRound = 10;  // 房间局数
                // self.playerNum = 3;  // 玩家人数  3人 2人  4人
                // self.gameStart = 0;      // 0: 首局先出黑桃3  1：首局无要求
                // self.gameHei3 = 1;       // 0：每局黑桃三先出   1：第二局庄家先出
                // self.gameDeal = 0;       // 分牌选择 0:单张分   1:155分    2:444分
                // self.gameFunction = 0; // 功能选择 0:显示牌 1:不显示牌
                // self.gameForce = 1;    // 玩法选择 0:必须管 1:可不要
                // self.gameCardnum = 0;    // 牌数选择 0:16张 1:15张 2:一副牌
                // self.gamePlays = [0,1,0,0];    // 玩法选择 红桃10扎鸟，四带二，四带三
                // self.gameEnd = [1,0,1,0];    // 最后选择 三张可少带出完等等
                // self.anticheating = 0;    // 防作弊选择 0:关 1:开
                cc.log("创建房间参数:", self.gameMode, self.gameRound, self.playerNum, self.gameFunction, self.gameStart, self.gameHei3,
                    self.gameDeal, self.gameForce, self.gameCardnum, self.gamePlays, self.gameEnd, self.anticheating);
                // 两人局，有时会出现黑桃三先出的逻辑，但是极难重现，
                // 现在暂时使用如下方法进行修改
                if (self.playerNum === 2) {
                    self.gameStart = 1;
                    self.gameHei3 = 1;
                }
                var room_op = {
                    game_mode: self.gameMode,
                    game_round: self.gameRound,
                    player_num: self.playerNum,
                    game_function: self.gameFunction,
                    game_start: self.gameStart,
                    game_hei3: self.gameHei3,
                    game_deal: self.gameDeal,
                    game_force: self.gameForce,
                    game_cardnum: self.gameCardnum,
                    game_plays: self.gamePlays,
                    game_end: self.gameEnd,
                    anticheating: self.anticheating,
                    is_competition: 0,
                    is_agent: 0
                };
                cc.sys.localStorage.setItem("UI_CREATE_INFO", JSON.stringify(room_op));
                // h1global.entityManager.player().reqCreateRoom(self.gameMode, self.gameRound, self.playerNum, self.gameFunction, self.gameStart, self.gameHei3,
                //     self.gameDeal, self.gameForce,self.gameCardnum, self.gamePlays, self.gameEnd, self.anticheating, 0);
                h1global.entityManager.player().reqCreateRoom(room_op);
                self.hide();
            }
        }

        create_btn.addTouchEventListener(create_btn_event);
    }
});