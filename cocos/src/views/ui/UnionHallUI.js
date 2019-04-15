// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var UnionHallUI;
UnionHallUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/UnionHallUI.json";
    },

    initUI: function () {
        cutil.lock_ui();
        this.union_panel = this.rootUINode.getChildByName("union_panel");
        var self = this;
        this.isEnabled = false;
        this.title_btn_list = [];
        this.unionhall_panel = [];              //公会大厅
        this.match_panel = [];                  //赛事管理
        this.member_panel = [];                 //成员管理
        this.union_info_list = [];              //公会信息列表
        this.union_id = 0;                      // 第几个公会
        this.match_name = "";
        this.group_id = 0;                      // 公会id
        this.player = h1global.entityManager.player();
        // 进入公会，发送拉取信息请求
        this.reqGroupInfoList(0);
        //
        this.unionname_btn_list = [];
        let return_btn = this.union_panel.getChildByName("return_btn");
        return_btn.setLocalZOrder(const_val.MAX_LAYER_NUM);
        return_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                cutil.unlock_ui();
                self.hide();
            }
        });

        function title_btn_event(sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                if (!self.isEnabled) {
                    return
                }
                for (var i = 0; i < self.title_btn_list.length; i++) {
                    if (sender !== self.title_btn_list[i]) {
                        self.title_btn_list[i].setTouchEnabled(true);
                        self.title_btn_list[i].setBright(true);
                    } else {
                        self.title_btn_list[i].setTouchEnabled(false);
                        self.title_btn_list[i].setBright(false);
                        self.show_panel(i);
                    }
                }
            }
        }

        for (var i = 0; i < 3; i++) {
            var title_btn = self.union_panel.getChildByName("title_btn_" + (i + 1).toString());
            self.title_btn_list.push(title_btn);
            title_btn.addTouchEventListener(title_btn_event);
        }

        this.title_btn_list[0].setTouchEnabled(false);
        this.title_btn_list[0].setBright(false);

        this.match_panel = this.union_panel.getChildByName("match_panel");
        this.member_panel = this.union_panel.getChildByName("member_panel");
        this.unionhall_panel = this.union_panel.getChildByName("unionhall_panel");

        //输入框
        this.page_num_tf = new MyEditBox("1", "黑体", 35, "res/ui/UnionPopUI/bg_short_img.png");
        this.page_num_tf.setAnchorPoint(0, 0.5);
        this.page_num_tf.setPos(590, 535);
        this.page_num_tf.setName("goto_tf");
        this.member_panel.addChild(this.page_num_tf);
        this.page_num_tf.setMaxLength(2);
        this.page_num_tf.setTextColor(cc.color(135, 85, 27, 255));
    },

    // 发送获取信息请求
    reqGroupInfoList: function (idx) {
        if (idx < 0) {
            return
        }
        this.panel_num = idx;
        this.player.reqGroupInfoList();
    },

    show_panel: function (idx) {
        if (idx < 0) {
            return
        }
        switch (idx) {
            case 0:
                this.match_panel.setVisible(false);
                this.member_panel.setVisible(false);
                this.unionhall_panel.setVisible(true);
                var bg_img = this.union_panel.getChildByName("bg_img");
                bg_img.loadTexture(res.union_bg_2);
                break;
            case 1:
                this.match_panel.setVisible(true);
                this.member_panel.setVisible(false);
                this.unionhall_panel.setVisible(false);
                var bg_img = this.union_panel.getChildByName("bg_img");
                bg_img.loadTexture(res.union_bg_1);
                break;
            case 2:
                this.match_panel.setVisible(false);
                this.member_panel.setVisible(true);
                this.unionhall_panel.setVisible(false);
                var bg_img = this.union_panel.getChildByName("bg_img");
                bg_img.loadTexture(res.union_bg_1);
                break;
            default:
                break;
        }
    },

    init_unionInfo_list: function () {
        cutil.unlock_ui();

        if (true) {
            this.title_btn_list[0].setTouchEnabled(false);
            this.title_btn_list[0].setBright(false);
            this.union_panel.getChildByName("title_img").setVisible(false);
            for (var i = 0; i < this.title_btn_list.length; i++) {
                this.title_btn_list[i].setVisible(true);
            }
            var bg_img = this.union_panel.getChildByName("bg_img");
            bg_img.loadTexture(res.union_bg_1);

            //创建公会
            var createunion_btn = this.union_panel.getChildByName("createunion_btn");
            createunion_btn.setVisible(true);
            this.isEnabled = false;
            createunion_btn.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    h1global.curUIMgr.unioncreate_ui.show_name(const_val.CREATE_UNION);
                }
            })
            var hall_member_2 = new cc.Sprite("res/ui/UnionHallUI/content_img.png");
            hall_member_2.x = this.union_panel.getContentSize().width * 0.50;
            hall_member_2.y = this.union_panel.getContentSize().height * 0.50;
            hall_member_2.setName("content_img");
            this.union_panel.addChild(hall_member_2);
        } else {
            // 直接使用寻找代理的逻辑
            this.update_union_type(1);
            var hall_member_1 = new cc.Sprite(res.union_bg_1);
            hall_member_1.x = this.union_panel.getContentSize().width * 0.50;
            hall_member_1.y = this.union_panel.getContentSize().height * 0.50;
            this.union_panel.addChild(hall_member_1);
            var hall_member_2 = new cc.Sprite("res/ui/UnionHallUI/content_img.png");
            hall_member_2.x = this.union_panel.getContentSize().width * 0.50;
            hall_member_2.y = this.union_panel.getContentSize().height * 0.50;
            this.union_panel.addChild(hall_member_2);
        }
    },

    // 无权限创建公会的人员的UI
    init_memberunion_list: function (unionInfoList) {
        cutil.unlock_ui();
        // 初始化UI
        this.union_info_list = unionInfoList;
        this.update_union_type(1);
        // 个人
        this.init_title_panel_0(unionInfoList);
    },

    update_union_type: function (union_type) {
        if (union_type === 0) {
            //管理员
            for (var i = 0; i < this.title_btn_list.length; i++) {
                this.title_btn_list[i].setVisible(true);
            }
            this.union_panel.getChildByName("title_img").setVisible(false);
            var bg_img = this.union_panel.getChildByName("bg_img");
            bg_img.loadTexture(res.union_bg_2);
        } else {
            // 成员
            for (var i = 0; i < this.title_btn_list.length; i++) {
                this.title_btn_list[i].setVisible(false);
            }
            this.union_panel.getChildByName("title_img").setVisible(true);
            var bg_img = this.union_panel.getChildByName("bg_img");
            bg_img.loadTexture(res.union_bg_3);
        }
    },

    sendInviteJoinGroup: function (memberid) {

        cc.log("reqInviteJoinGroup" + this.union_info_list[this.union_id]["group_id"] + " " + memberid);
        if (memberid < 0) {
            return
        }
        this.player.reqInviteJoinGroup(this.union_info_list[this.union_id]["group_id"], memberid);
    },

    update_member_num: function (group_id, mem_detail_list, idx) {
        if (group_id < 0 || this.union_info_list[this.union_id]["group_id"] !== group_id) {
            return
        }
        this.init_title_panel_2(mem_detail_list, idx);
    },

    recInviteJoinGroup: function (group_id, mem_detail_list) {
        if (group_id < 0 || this.union_info_list[this.union_id]["group_id"] !== group_id) {
            return
        }
        this.union_info_list[this.union_id]["mem_detail_list"].push(mem_detail_list[0]);
        this.update_member_num(group_id, this.union_info_list[this.union_id]["mem_detail_list"]);
    },

    recExitGroup: function (group_id) {
        if (group_id < 0 || this.union_info_list[this.union_id]["group_id"] !== group_id) {
            return
        }
        this.hide();
    },

    recCreateGroup: function (groupInfo) {
        if (!groupInfo) {
            return
        }
        this.player.reqGroupInfoList();
    },

    sendmodifyGroupBillboard: function (billboard) {
        if (billboard === "") {
            return
        }
        //广播
        this.player.modifyGroupBillboard(this.union_info_list[this.union_id]["group_id"], billboard);
    },

    sendmodifyGroupName: function (groupname) {
        if (groupname === "") {
            return
        }
        //广播
        this.player.reqUpdateGroupName(this.union_info_list[this.union_id]["group_id"], groupname);
    },

    recBillboard: function (group_id, billboard) {
        if (group_id < 0 || this.union_info_list[this.union_id]["group_id"] !== group_id) {
            return
        }
        var broadcast_label = this.unionhall_panel.getChildByName("unioninfo_panel").getChildByName("broadcast_label");
        var broadcast_bg = this.unionhall_panel.getChildByName("unioninfo_panel").getChildByName("broadcast_txt_bg");

        broadcast_label.ignoreContentAdaptWithSize(true);
        broadcast_label.setString(billboard);
        broadcast_label.setPositionX(420);
        broadcast_label.stopAllActions();
        if (broadcast_label.getContentSize().width <= broadcast_bg.getContentSize().width) {
            broadcast_label.runAction(cc.sequence(cc.delayTime(3.0), cc.hide(), cc.delayTime(1.0), cc.show()).repeatForever());
        } else {
            var offset = broadcast_bg.getContentSize().width - broadcast_label.getContentSize().width;
            broadcast_label.runAction(cc.sequence(
                cc.moveTo(-offset * 0.01, cc.p(offset, broadcast_label.getPositionY())),
                cc.hide(),
                cc.delayTime(1.0),
                cc.show()
            ));
        }
    },

    sendMarkMember: function (mem_userId, remark) {
        if (mem_userId < 0) {
            return
        }
        //广播
        this.player.reqMarkMember(this.union_info_list[this.union_id]["group_id"], parseInt(mem_userId), remark);
    },

    recMarkMember: function (group_id, mem_userId, remark) {
        if (group_id < 0 || this.union_info_list[this.union_id]["group_id"] !== group_id) {
            return
        }
        var mem_detail_list = this.union_info_list[this.union_id]["mem_detail_list"];
        for (var i = 0; i < mem_detail_list.length; i++) {
            if (mem_detail_list[i]["userId"] === mem_userId) {
                mem_detail_list[i]["remark"] = remark;
                this.update_member_num(group_id, mem_detail_list, i);
                break;
            }
        }
    },

    sendDelMember: function (id) {
        if (id < 0) {
            return
        }
        //广播
        this.player.reqDelMember(this.union_info_list[this.union_id]["group_id"], parseInt(id));
    },

    recDelMember: function (group_id, mem_userId) {
        if (group_id < 0 || this.union_info_list[this.union_id]["group_id"] !== group_id) {
            return
        }
        var mem_detail_list = this.union_info_list[this.union_id]["mem_detail_list"];
        for (var i = 0; i < mem_detail_list.length; i++) {
            if (mem_detail_list[i]["userId"] === mem_userId) {
                mem_detail_list.splice(i, 1);
                this.update_member_num(group_id, mem_detail_list, i);
                break;
            }
        }

    },

    update_unionInfo_list: function (unionInfoList) {
        if (!unionInfoList) {
            return;
        }
        cc.log("unionInfoList: ", unionInfoList);
        cutil.unlock_ui();

        var createunion_btn = this.union_panel.getChildByName("createunion_btn");
        if (createunion_btn) {
            createunion_btn.setVisible(false);
            this.isEnabled = true;
        }
        var content_img = this.union_panel.getChildByName("content_img");
        if (content_img) {
            content_img.setVisible(false);
        }
        this.union_panel.getChildByName("title_img").setVisible(false);

        this.union_info_list = unionInfoList;
        this.init_title_panel_2(unionInfoList[0]["mem_detail_list"]);
        this.init_title_panel_1(unionInfoList);
        this.init_title_panel_0(unionInfoList);
        //eval("this.init_title_panel_" + this.panel_num.toString() + "()");
    },

    init_union_info: function (item) {
        if (!item) {
            return
        }
        var self = this;
        var unioninfo_panel = this.unionhall_panel.getChildByName("unioninfo_panel");
        unioninfo_panel.getChildByName("unionname_label").setString(item["group_name"]);
        var bill_board = item["bill_board"];
        if (bill_board !== "") {
            unioninfo_panel.getChildByName("broadcast_label").setString(item["bill_board"]);
        }
        this.update_union_type(item["permission"]);
        var modify_name_btn = unioninfo_panel.getChildByName("modify_name_btn");
        var exitunion_btn = unioninfo_panel.getChildByName("exitunion_btn");
        var editbroadcast_btn = unioninfo_panel.getChildByName("editbroadcast_btn");
        if (item["permission"] === 0) {
            editbroadcast_btn.setVisible(true);
            editbroadcast_btn.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    h1global.curUIMgr.unioninput_ui.show_name(const_val.TIP_NOTICE);
                }
            });

            modify_name_btn.setVisible(true);
            modify_name_btn.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    h1global.curUIMgr.unioncreate_ui.show_name(const_val.TIP_MODIFY);
                }
            });
            exitunion_btn.setVisible(false);
        } else {
            modify_name_btn.setVisible(false);
            exitunion_btn.setVisible(true);
            editbroadcast_btn.setVisible(false);
            exitunion_btn.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    var info = {};
                    info.id = const_val.TIP_EXITUNION;
                    info.group_id = self.union_info_list[self.union_id]["group_id"];
                    info.group_name = self.union_info_list[self.union_id]["group_name"];
                    h1global.curUIMgr.uniontip_ui.show_name(info);
                }
            });
        }

        var help_btn = unioninfo_panel.getChildByName("help_btn");
        help_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                var group_id = self.union_info_list[self.union_id]["group_id"];
                self.player.reqGroupRankList(group_id, item["normal_access"], item["permission"]);
            }
        });
        if ((item["normal_access"] === 1 && item["permission"] === 1) || item["permission"] === 0) {
            help_btn.setVisible(true)
        } else {
            help_btn.setVisible(false)
        }
        this.update_union_info_scroll(item);
    },

    update_union_scroll: function (recordList) {
        var self = this;
        if (recordList) {
            recordList = recordList.concat([]);
        }
        var union_list_scroll = this.unionhall_panel.getChildByName("union_list_scroll");

        function update_item_func(curItem, curInfo, idx) {
            var unionname_label = curItem.getChildByName("unionname_label");
            unionname_label.setString(curInfo["group_name"]);

            var unionname_btn = curItem.getChildByName("unionname_btn");
            if (idx === 0) {
                unionname_btn.setTouchEnabled(false);
                unionname_btn.setBright(false);
            }
        }

        UICommonWidget.update_scroll_items(union_list_scroll, recordList, update_item_func);
        var items = union_list_scroll.getChildren();

        for (var i = 0; i < items.length; i++) {
            var unionname_btn = items[i].getChildByName("unionname_btn");
            this.unionname_btn_list.push(unionname_btn);
            unionname_btn.addTouchEventListener(function () {
                return function (sender, eventType) {
                    if (eventType === ccui.Widget.TOUCH_ENDED) {
                        for (var j = 0; j < self.unionname_btn_list.length; j++) {
                            if (sender !== self.unionname_btn_list[j]) {
                                self.unionname_btn_list[j].setTouchEnabled(true);
                                self.unionname_btn_list[j].setBright(true);
                            } else {
                                self.unionname_btn_list[j].setTouchEnabled(false);
                                self.unionname_btn_list[j].setBright(false);
                                self.init_union_info(recordList[j]);
                                self.union_id = j;
                            }
                        }
                    }
                };
            }(i));
        }
        this.init_union_info(recordList[0]);
    },

    update_union_room_info: function (recordList) {
        if (!recordList) {
            return
        }
        var self = this;
        var unioninfo_panel = this.unionhall_panel.getChildByName("unioninfo_panel");
        var matchinfo_scroll = unioninfo_panel.getChildByName("matchinfo_scroll");
        if (recordList && recordList.length > 0) {
            recordList = recordList.concat([]);
        }

        function update_item_func(curItem, curInfo) {
            var matchname_label = curItem.getChildByName("matchname_label");
            matchname_label.setString(curInfo["team_name"]);

            function update_room_func(roomItem, roomInfo) {
                var match_info_label = roomItem.getChildByName("match_info_label");
                match_info_label.setString(roomInfo);
            }

            var roomInfoList = self.update_room_info(curInfo);
            // cc.log("roomInfoList ", roomInfoList);
            var match_info_scroll = curItem.getChildByName("match_info_scroll");
            UICommonWidget.update_scroll_items(match_info_scroll, roomInfoList, update_room_func);
        }

        UICommonWidget.update_scroll_items(matchinfo_scroll, recordList, update_item_func);
    },

    update_union_info_scroll: function (recordList) {
        if (!recordList) {
            return
        }
        var self = this;
        var unioninfo_panel = this.unionhall_panel.getChildByName("unioninfo_panel");
        var matchinfo_scroll = unioninfo_panel.getChildByName("matchinfo_scroll");
        self.update_union_room_info(recordList["team_list"]);
        var items = matchinfo_scroll.getChildren();
        for (var ii = 0; ii < items.length; ii++) {
            let i = ii;
            // 自动匹配
            var automatching_btn = items[i].getChildByName("automatching_btn");
            automatching_btn.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    self.player.reqGenTeamRoom(recordList["group_id"], recordList["team_list"][i]["team_uuid"], 2);
                }
            });

            // 创建房间
            var createroom_btn = items[i].getChildByName("createroom_btn");
            createroom_btn.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    self.player.reqGenTeamRoom(recordList["group_id"], recordList["team_list"][i]["team_uuid"], 3);
                }
            });
        }
    },

    //加载公会大厅
    init_title_panel_0: function (unionInfoList) {
        cc.log("unionInfoList: ", unionInfoList);
        this.title_btn_list[0].setTouchEnabled(false);
        this.title_btn_list[0].setBright(false);

        this.match_panel.setVisible(false);
        this.member_panel.setVisible(false);
        this.unionhall_panel.setVisible(true);
        if (unionInfoList[0]["permission"] === 0) {
            var bg_img = this.union_panel.getChildByName("bg_img");
            bg_img.loadTexture(res.union_bg_2);
        }

        this.unionname_btn_list.splice(0);
        this.union_id = 0;
        this.update_union_scroll(unionInfoList);

        for (var i = 0; i < this.unionname_btn_list.length; i++) {
            if (i === 0) {
                this.unionname_btn_list[i].setTouchEnabled(false);
                this.unionname_btn_list[i].setBright(false);
            } else {
                this.unionname_btn_list[i].setTouchEnabled(true);
                this.unionname_btn_list[i].setBright(true);
            }
        }
    },

    update_room_info: function (curInfo) {
        var roomInfoList = [];
        var room_op = curInfo["room_op"];
        if (room_op.game_mode === 0) {
            roomInfoList.push("经典模式");
        } else if (room_op.game_mode === 1) {
            roomInfoList.push("15张模式");
        } else {
            roomInfoList.push("癞子模式");
        }

        if (room_op.game_round === 10) {
            roomInfoList.push("10局")
        } else {
            roomInfoList.push("20局")
        }

        if (room_op.player_num === 3) {
            roomInfoList.push("3人")
        } else if (room_op.player_num === 2) {
            roomInfoList.push("2人")
        } else {
            roomInfoList.push("4人")
        }

        if (room_op.player_num === 2) {
            roomInfoList.push("随机出牌");
            roomInfoList.push("首局无要求");
        } else {
            if (room_op.game_start === 1) {
                roomInfoList.push("首局无要求");
            } else {
                roomInfoList.push("首局先出黑桃3");
            }
            if (room_op.game_hei3 === 1) {
                roomInfoList.push("庄家先出");
            } else {
                roomInfoList.push("黑三先出");
            }
        }

        if (room_op.game_function === 1) {
            roomInfoList.push("不显示牌");
        } else {
            roomInfoList.push("显示牌");
        }

        var deal_list = [["单张分", "1555分", "444分"], ["单张分", "555分", "2355分"], ["单张分", "355分", "445分"]];
        if (room_op.game_deal === 0) {
            roomInfoList.push(deal_list[room_op.game_mode === 2 ? room_op.game_cardnum : room_op.game_mode][0]);
        } else if (room_op.game_deal === 1) {
            roomInfoList.push(deal_list[room_op.game_mode === 2 ? room_op.game_cardnum : room_op.game_mode][1]);
        } else {
            roomInfoList.push(deal_list[room_op.game_mode === 2 ? room_op.game_cardnum : room_op.game_mode][2]);
        }

        if (room_op.game_force === 1) {
            roomInfoList.push("可不要");
        } else {
            roomInfoList.push("必须管");
        }
        for (var item in room_op.game_plays) {
            if (room_op.game_plays[item] === 1) {
                switch (parseInt(item)) {
                    case 0:
                        roomInfoList.push("红桃10扎鸟");
                        break;
                    case 1:
                        roomInfoList.push("四带二");
                        break;
                    case 2:
                        roomInfoList.push("四带三");
                        break;
                    case 3:
                        roomInfoList.push("炸弹不可拆");
                        break;
                }
            }
        }
        for (var item in room_op.game_end) {
            if (room_op.game_end[item] === 1) {
                switch (parseInt(item)) {
                    case 0:
                        roomInfoList.push("三张可少带出完");
                        break;
                    case 1:
                        roomInfoList.push("三张可少带接完");
                        break;
                    case 2:
                        roomInfoList.push("飞机可少带出完");
                        break;
                    case 3:
                        roomInfoList.push("飞机可少带接完");
                        break;
                }
            }
        }

        return roomInfoList;
    },

    setpanel_within_state: function (panel, state) {
        if (!panel) {
            return
        }
        var items = panel.getChildren();
        for (var i = 0; i < items.length; i++) {
            items[i].setVisible(state);
        }
    },

    //scroll赛事系统回调
    update_match_team: function (team) {
        this.union_info_list[0]["team_list"] = team;
        this.update_match_scroll(this.union_info_list);
    },

    update_match_scroll: function (recordList) {
        if (!recordList) {
            return;
        }
        var teamListBack = null;
        var team_list = recordList[0]["team_list"];
        var teamListBack = team_list.concat([]);
        teamListBack.push(0);
        cc.log("teamListBack ", teamListBack);
        var self = this;
        var match_scroll = self.match_panel.getChildByName("match_scroll");

        function update_item_func(curItem, curInfo, idx) {
            if (curInfo === 0) {
                curItem.setBackGroundImage("res/ui/UnionMatchManagementUI/newevents_img.png", ccui.Widget.LOCAL_TEXTURE);
                self.setpanel_within_state(curItem, false);
                curItem.setTouchEnabled(true);
                curItem.addTouchEventListener(function (sender, eventType) {
                    if (eventType === ccui.Widget.TOUCH_ENDED) {
                        h1global.curUIMgr.unioncreate_ui.show_name(const_val.CREATE_MATCH);
                    }
                })
            } else {
                curItem.setBackGroundImage("res/ui/UnionMatchManagementUI/events_bg.png", ccui.Widget.LOCAL_TEXTURE);
                self.setpanel_within_state(curItem, true);
                curItem.setTouchEnabled(false);
                var match_name_label = curItem.getChildByName("match_name_label");
                match_name_label.setString(curInfo["team_name"]);

                var stop_btn = curItem.getChildByName("stop_btn");
                var start_btn = curItem.getChildByName("start_btn");
                if (curInfo["team_state"] === 1) {
                    stop_btn.setVisible(true);
                    start_btn.setVisible(false);
                } else {
                    stop_btn.setVisible(false);
                    start_btn.setVisible(true);
                }

                //noinspection JSAnnotator
                function update_room_func(roomItem, roomInfo) {
                    var match_info_label = roomItem.getChildByName("match_info_label");
                    match_info_label.setString(roomInfo);
                }

                var roomInfoList = self.update_room_info(curInfo);
                // cc.log("roomInfoList ", roomInfoList);
                var match_info_scroll = curItem.getChildByName("match_info_scroll");
                UICommonWidget.update_scroll_items(match_info_scroll, roomInfoList, update_room_func);
                // 成员
                var member_btn = curItem.getChildByName("member_btn");
                member_btn.addTouchEventListener(function (sender, eventType) {
                    if (eventType === ccui.Widget.TOUCH_ENDED) {
                        h1global.curUIMgr.unionmatchmember_ui.show_match_member_ui(recordList, curInfo);
                    }
                });

                // 房间
                var room_btn = curItem.getChildByName("room_btn");
                room_btn.addTouchEventListener(function (sender, eventType) {
                    if (eventType === ccui.Widget.TOUCH_ENDED) {
                        h1global.curUIMgr.unionroominfo_ui.show();
                        self.player.reqTeamRoomList(self.group_id, curInfo["team_uuid"]);
                    }
                });

                // 删除赛事
                var delete_btn = curItem.getChildByName("delete_btn");
                delete_btn.addTouchEventListener(function (sender, eventType) {
                    if (eventType === ccui.Widget.TOUCH_ENDED) {
                        cc.log("delete_btn ", self.group_id, curInfo["team_uuid"]);
                        var info = {};
                        info.id = const_val.TIP_DELETE_MATCH;
                        info.group_id = self.group_id;
                        info.uuid = curInfo["team_uuid"];
                        info.name = curInfo["team_name"];
                        h1global.curUIMgr.uniontip_ui.show_name(info);
                    }
                });

                // 停用赛事
                stop_btn.addTouchEventListener(function (sender, eventType) {
                    if (eventType === ccui.Widget.TOUCH_ENDED) {
                        var info = {};
                        info.id = const_val.TIP_STOP_MATCH;
                        info.group_id = self.group_id;
                        info.uuid = curInfo["team_uuid"];
                        info.name = curInfo["team_name"];
                        info.team_state = 0;
                        h1global.curUIMgr.uniontip_ui.show_name(info);
                    }
                });

                //启用赛事
                start_btn.addTouchEventListener(function (sender, eventType) {
                    if (eventType === ccui.Widget.TOUCH_ENDED) {
                        var info = {};
                        info.id = const_val.TIP_STOP_MATCH;
                        info.group_id = self.group_id;
                        info.uuid = curInfo["team_uuid"];
                        info.name = curInfo["team_name"];
                        info.team_state = 1;
                        h1global.curUIMgr.uniontip_ui.show_name(info);
                    }
                })
            }
        }

        UICommonWidget.update_scroll_items(match_scroll, teamListBack, update_item_func);
    },

    create_team_name: function (name) {
        this.match_name = name;
        cc.log("name ", this.match_name);
    },

    //创建赛事房间s
    create_team_room: function (room_op) {
        var group_id = this.group_id;
        this.player.reqCreateTeam(group_id, room_op, this.match_name);
    },

    //加载赛事系统
    init_title_panel_1: function (matchInfoList) {
        cc.log("matchInfoList ", matchInfoList);
        this.unionhall_panel.setVisible(false);
        this.match_panel.setVisible(true);
        this.member_panel.setVisible(false);
        this.group_id = matchInfoList[0]["group_id"];


        var bg_txt_img = this.match_panel.getChildByName("bg_txt_img");
        var match_title_label = bg_txt_img.getChildByName("match_title_label");
        match_title_label.setString(matchInfoList[0]["group_name"]);

        this.update_match_scroll(matchInfoList);
    },


    //scroll成员管理回调
    update_item_func: function (curItem, curInfo) {
        if (!curInfo) {
            return
        }

        var name_label = curItem.getChildByName("name_label");
        name_label.setString(curInfo["name"]);

        var id_label = curItem.getChildByName("id_label");
        id_label.setString("ID:" + curInfo["userId"]);
        var time_label = curItem.getChildByName("time_label");
        var newDate = new Date();
        newDate.setTime(parseInt(curInfo["join_time"]) * 1000);
        time_label.setString(newDate.toJSON().substr(5, 5));

        var remarks_label = curItem.getChildByName("remarks_label");
        remarks_label.setString(curInfo["remark"]);

        var delete_btn = curItem.getChildByName("delete_btn");
        delete_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                var info = {};
                info.userid = parseInt(curInfo["userId"]);
                info.id = const_val.TIP_DELETE_MEMBER;
                info.name = curInfo["name"];
                h1global.curUIMgr.uniontip_ui.show_name(info);
            }
        });

        // 添加备注
        var remarks_btn = curItem.getChildByName("remarks_btn");
        remarks_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                var info = {};
                info.userid = parseInt(curInfo["userId"]);
                info.id = const_val.TIP_REMARK;
                info.name = curInfo["name"];
                h1global.curUIMgr.unioninput_ui.show_name(info);
            }
        });

    },

    //加载成员管理
    init_title_panel_2: function (memberInfoList, idx) {
        cc.log("memberInfoList ", memberInfoList, idx);
        if (memberInfoList) {
            memberInfoList = memberInfoList.concat([]).reverse();
        }
        var self = this;
        this.unionhall_panel.setVisible(false);
        this.match_panel.setVisible(false);
        this.member_panel.setVisible(true);
        var member_info_scroll = this.member_panel.getChildByName("member_info_scroll");

        var listView = UICommonWidget.create_list_view(member_info_scroll, memberInfoList, this.update_item_func);
        if (!listView) {
            return
        }

        // 列表子项数目
        var num_label = this.member_panel.getChildByName("num_label");
        num_label.setString(memberInfoList.length + "/500");
        // 列表页数便签
        var num_page_label = this.member_panel.getChildByName("num_page_label");
        num_page_label.setString("1/" + listView["pageSum"]);

        // 下一页
        var nextpage_btn = this.member_panel.getChildByName("nextpage_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                var page_id = num_page_label.getString().substring(0, num_page_label.getString().indexOf("/"));
                var nextpage = parseInt(page_id) + 1;
                if (UICommonWidget.change_to_listpage(member_info_scroll, listView, nextpage, self.update_item_func)) {
                    num_page_label.setString(nextpage + "/" + listView["pageSum"]);
                }
            }
        });

        //上一页
        var previouspage_btn = this.member_panel.getChildByName("previouspage_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                var page_id = num_page_label.getString().substring(0, num_page_label.getString().indexOf("/"));
                var previouspage = parseInt(page_id) - 1;
                if (UICommonWidget.change_to_listpage(member_info_scroll, listView, previouspage, self.update_item_func)) {
                    num_page_label.setString(previouspage + "/" + listView["pageSum"]);
                }
            }
        });


        //上一页
        var goto_btn = this.member_panel.getChildByName("goto_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                var page = parseInt(self.page_num_tf.getString());
                if (!isNaN(page)) {
                    if (UICommonWidget.change_to_listpage(member_info_scroll, listView, page, self.update_item_func)) {
                        num_page_label.setString(page + "/" + listView["pageSum"]);
                    }
                }
            }
        });
        // 添加新成员
        var addnew_btn = this.member_panel.getChildByName("addnew_btn");
        addnew_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.unionaddnewmember_ui.show();
            }
        });
        // 发送邀请函
        var invitation_btn = this.member_panel.getChildByName("invitation_btn");
        var share_title = "跑得快";
        var share_desc = "我在跑得快游戏里创建了[" + this.union_info_list[0]["group_name"] + "]公会，期待你和我们一起，点击加入！";
        var share_url = switches.PHP_SERVER_URL + "/wechat/join_group_pdk?groupId=" + this.union_info_list[0]["group_id"].toString() + "&timestamp=" + (new Date().getTime()).toString();
        invitation_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                if ((cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative)) {
                    jsb.reflection.callStaticMethod(switches.package_name + "/AppActivity", "callWechatShareUrl", "(ZLjava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", true, share_url, share_title, share_desc);
                } else if ((cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative)) {
                    jsb.reflection.callStaticMethod("WechatOcBridge", "callWechatShareUrlToSession:fromUrl:withTitle:andDescription:", true, share_url, share_title, share_desc);
                } else {
                    wx.onMenuShareAppMessage({
                        title: share_title, // 分享标题
                        desc: share_desc, // 分享描述
                        link: share_url, // 分享链接
                        imgUrl: '', // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            cc.log("ShareAppMessage Success!");
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            cc.log("ShareAppMessage Cancel!");
                        },
                        fail: function () {
                            cc.log("ShareAppMessage Fail")
                        },
                    });
                    h1global.globalUIMgr.info_ui.show_by_info("请点击微信右上角菜单进行分享");
                }
            }
        });

        if (idx) {
            var nextpage = Math.floor(idx / parseInt(listView["num_page"])) + 1;
            if (UICommonWidget.change_to_listpage(member_info_scroll, listView, nextpage, this.update_item_func)) {
                num_page_label.setString(nextpage + "/" + listView["pageSum"]);
            }
        }
    },

    //更新赛事停用启用
    update_team_state: function (group_id, team_uuid, state) {
        var union_info = this.union_info_list;
        for (var i = 0; i < union_info.length; i++) {
            if (union_info[i]["group_id"] === group_id) {
                var team_list = union_info[i]["team_list"];
                for (var j = 0; j < team_list.length; j++) {
                    if (team_list[j]["team_uuid"] === team_uuid) {
                        team_list[j]["team_state"] = state;
                    }
                }
            }
        }
        this.init_title_panel_1(union_info);
    }
});