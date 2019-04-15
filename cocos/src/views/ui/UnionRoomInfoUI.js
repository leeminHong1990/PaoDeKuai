// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var UnionRoomInfoUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/UnionRoomInfoUI.json";
    },

    initUI: function () {
        this.roominfo_panel = this.rootUINode.getChildByName("roominfo_panel");
        var self = this;
        this.player = h1global.entityManager.player();
        this.roominfo_panel.getChildByName("return_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });

        this.roominfo_panel.getChildByName("roomlist_panel").getChildByName("refresh_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.player.reqTeamRoomList(self.group_id, self.team_uuid);
            }
        });

        var title_btn_1 = this.roominfo_panel.getChildByName("title_btn_1");
        title_btn_1.setTouchEnabled(false);
        title_btn_1.setBright(false);
        var title_btn_2 = this.roominfo_panel.getChildByName("title_btn_2");

        title_btn_1.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                title_btn_1.setTouchEnabled(false);
                title_btn_1.setBright(false);
                title_btn_2.setTouchEnabled(true);
                title_btn_2.setBright(true);
                self.init_room_list_panel();
            }
        });

        this.timeList = [];
        this.roomTimeList = [];
        title_btn_2.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                title_btn_1.setTouchEnabled(true);
                title_btn_1.setBright(true);
                title_btn_2.setTouchEnabled(false);
                title_btn_2.setBright(false);

                self.player.reqTeamHistoryRoomList(self.group_id, self.team_uuid);
            }
        });
    },

    get_all_room_list: function (group_id, team_uuid, roomList) {
        cc.log("roomList ", roomList);
        this.allroomList = [];
        this.allroomList = roomList;
        this.allroomList = this.roomList.concat(this.allroomList);
        var self = this;
        var isFirstRoom = false;

        this.timeList = [];
        this.roomTimeList = [];
        if (!isFirstRoom) {
            isFirstRoom = true;
            var list = self.allroomList;
            for (var i = 0; i < list.length; i++) {
                var time_date = cutil.time2Date(Math.floor(list[i]["create_time"] * 1000));
                if (self.timeList.indexOf(time_date) < 0) {
                    self.timeList.push(time_date);
                    self.roomTimeList.push([]);
                    self.roomTimeList[self.roomTimeList.length - 1].push(list[i])
                } else {
                    self.roomTimeList[self.timeList.indexOf(time_date)].push(list[i]);
                }
            }
        }
        self.init_create_room_panel(self.roomTimeList[self.roomTimeList.length-1],self.roomTimeList.length-1);
    },

    get_room_list: function (group_id, team_uuid, roomList) {
        cc.log("roomList ", roomList);
        this.roomList = roomList;
        this.group_id = group_id;
        this.team_uuid = team_uuid;
        var self = this;
        this.show(function () {
            // if (roomList.length === 0) {
            //     this.hide();
            //     h1global.curUIMgr.uniontip_ui.show_name(const_val.TEAM_NO_ROOM);
            // } else {
            //     this.init_room_list_panel();
            // }
            self.init_room_list_panel();
        })
    },

    init_room_list_panel: function () {
        var self = this;
        cc.log("init_room_list_panel ", this.roomList);
        var room_list_panel = self.roominfo_panel.getChildByName("roomlist_panel");
        room_list_panel.setVisible(true);
        var create_room_panel = self.roominfo_panel.getChildByName("createroom_panel");
        create_room_panel.setVisible(false);
        var list = this.roomList;
        if (list) {
            list = list.concat([]).reverse();
        }
        var room_list_scroll = room_list_panel.getChildByName("roomlist_scroll");
        UICommonWidget.update_scroll_items(room_list_scroll, list, self.update_item_func);

        var room_num_label = room_list_panel.getChildByName("room_num_label");
        room_num_label.setString(list.length);
    },

    init_create_room_panel: function (list, time_index) {
        var self = this;
        if (list) {
            list = list.concat([]).reverse();
        }
        var create_room_panel = self.roominfo_panel.getChildByName("createroom_panel");
        create_room_panel.setVisible(true);

        var room_list_panel = self.roominfo_panel.getChildByName("roomlist_panel");
        room_list_panel.setVisible(false);

        cc.log("roomTimeList ", list);
        var create_listView = create_room_panel.getChildByName("create_listview");
        var listView = UICommonWidget.create_list_view(create_listView, list, self.update_item_func);
        if (!listView) {
            return
        }
        var operation_panel = create_room_panel.getChildByName("operation_panel");
        var time_label = operation_panel.getChildByName("time_label");
        time_label.setString(this.timeList[time_index] || "------");
        // 列表页数便签
        var num_page_label = operation_panel.getChildByName("num_page_label");
        num_page_label.setString(listView["pageSum"] === 0 ? "0/0":"1/" + listView["pageSum"]);

        // 下一页
        operation_panel.getChildByName("nextpage_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                var page_id = num_page_label.getString().substring(0, num_page_label.getString().indexOf("/"));
                var next_page = parseInt(page_id) + 1;
                if (UICommonWidget.change_to_listpage(create_listView, listView, next_page, self.update_item_func)) {
                    num_page_label.setString(next_page + "/" + listView["pageSum"]);
                }
            }
        });

        //上一页
        operation_panel.getChildByName("previouspage_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                var page_id = num_page_label.getString().substring(0, num_page_label.getString().indexOf("/"));
                var previous_page = parseInt(page_id) - 1;
                if (UICommonWidget.change_to_listpage(create_listView, listView, previous_page, self.update_item_func)) {
                    num_page_label.setString(previous_page + "/" + listView["pageSum"]);
                }
            }
        });

        //首页
        var first_btn = operation_panel.getChildByName("first_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                var first_page = 1;
                if (UICommonWidget.change_to_listpage(create_listView, listView, first_page, self.update_item_func)) {
                    num_page_label.setString(first_page + "/" + listView["pageSum"]);
                }
            }
        });

        //尾页
        var last_btn = operation_panel.getChildByName("last_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                var last_page = parseInt(listView["pageSum"]);
                if (UICommonWidget.change_to_listpage(create_listView, listView, last_page, self.update_item_func)) {
                    num_page_label.setString(last_page + "/" + listView["pageSum"]);
                }
            }
        });

        //时间过滤
        var last_btn = operation_panel.getChildByName("dropdown_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                var time_list_scroll = create_room_panel.getChildByName("timelist_scroll");
                if (time_list_scroll.isVisible()){
                    time_list_scroll.setVisible(false);
                }else {
                    time_list_scroll.setVisible(true);
                    var time_list = self.timeList;
                    function update_func(curItem, curInfo) {
                        var date_label = curItem.getChildByName("time_label");
                        date_label.setString(curInfo);
                    }

                    UICommonWidget.update_scroll_items(time_list_scroll, time_list, update_func);
                    var items = time_list_scroll.getChildren();
                    for (var i = 0; i < items.length; i++) {
                        var time_label = items[i].getChildByName("time_label");
                        time_label.setTouchEnabled(true);
                        cc.log("update_func ", i);
                        time_label.addTouchEventListener(function (sender, eventType) {
                            if (eventType === ccui.Widget.TOUCH_ENDED) {
                                var label = operation_panel.getChildByName("time_label");
                                label.setString(sender.getString());
                                time_list_scroll.setVisible(false);
                                cc.log("roomTimeList ", self.roomTimeList[self.timeList.indexOf(sender.getString())]);
                                self.init_create_room_panel(self.roomTimeList[self.timeList.indexOf(sender.getString())],self.timeList.indexOf(sender.getString()));
                            }
                        });
                    }
                }
            }
        });
    },

    update_item_func: function (curItem, curInfo, idx) {
        var id_label = curItem.getChildByName("id_label");
        id_label.setString((idx + 1) + "");

        var roomtype_label = curItem.getChildByName("roomtype_label");
        if (curInfo["match_mode"] === 3) {
            roomtype_label.setString("个人包间");
        } else if (curInfo["match_mode"] === 2) {
            roomtype_label.setString("自动匹配");
        }

        var roomid_label = curItem.getChildByName("roomid_label");
        roomid_label.setString(curInfo["roomID"]);

        for (var i = 0; i < 4; i++) {
            var player_label = curItem.getChildByName("player_label_" + (i + 1).toString());
            var score_label = curItem.getChildByName("score_label_" + (i + 1).toString());
            if (score_label){
                if (curInfo["score_list"][i] !== undefined) {
                    var score = curInfo["score_list"][i]["total_score"];
                    if (score > 0){
                        score_label.setTextColor(cc.color(72,205,51));
                    }else if(score < 0){
                        score_label.setTextColor(cc.color(250,67,11));
                    }else{
                        score_label.setTextColor(cc.color(135,86,44));
                    }
                    score_label.setString(score);
                } else {
                    if (curInfo["player_list"][i] !== undefined){
                        score_label.setString("0");
                    }else {
                        score_label.setString("");
                    }
                    score_label.setTextColor(cc.color(135,86,44));
                }
            }

            if (curInfo["player_list"][i] !== undefined) {
                player_label.setString(curInfo["player_list"][i]["nickname"]);
            } else {
                player_label.setString("");
            }
        }

        var time_label = curItem.getChildByName("time_label");
        var createTime = Math.floor(curInfo["create_time"]);
        var end_time   = Math.floor(curInfo["end_time"]);
        var timeStamp = Math.floor(Date.parse(new Date()) / 1000);
        var time_diff = 600 - (timeStamp - createTime);
        if (curInfo["room_state"] === 0){
            if (time_diff <= 600 && time_diff >= 0 && !score_label) {
                time_label.setString(cutil.convert_second_to_ms(time_diff));
            }else {
                time_label.setString("正在游戏");
            }
        }else if (curInfo["room_state"] === 1){
            time_label.setString("正在游戏");
        }else if (curInfo["room_state"] === 2){
            if (end_time === 0){
                time_label.setString(cutil.convert_time_to_hm(createTime));
            }else {
                time_label.setString(cutil.convert_time_to_hm(end_time));
            }
        }

        var player_num_label = curItem.getChildByName("player_num_label");
        player_num_label.setString(curInfo["player_list"].length + "/" + curInfo["player_num"]);
    }

});