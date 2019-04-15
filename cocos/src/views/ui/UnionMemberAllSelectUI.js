// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")

//测试 使用全局
var UnionMemberAllSelectUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/UnionMemberAllSelectUI.json";
    },

    initUI: function () {
        this.match_member_panel = this.rootUINode.getChildByName("match_member_panel");
        var self = this;
        this.isAllSelect = false; //是否全选
        this.member_panel = [];  //成员管理
        this.team_member_list = [];
        this.match_member_panel.getChildByName("cancel_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });

        cc.log("init_match_member_panel", this.matchSelectInfo, this.teamSelectInfo);
        var total_list = this.matchSelectInfo[0]["mem_detail_list"];
        var total_list_back = total_list.concat([]);
        var user_member_list = this.teamSelectInfo["member_userId_list"];
        for (var i = 0; i < user_member_list.length; i++) {
            for (var j = total_list_back.length - 1; j >= 0; j--) {
                if (user_member_list[i] === total_list_back[j]["userId"]) {
                    total_list_back.splice(j, 1);
                }
            }
        }
        cc.log("total_list_back ", total_list_back);
        for (var i = 0; i < total_list_back.length; i++) {
            total_list_back[i]["isSelect"] = false;
        }
        this.init_match_member_select_panel(total_list_back);
    },

    update_item_func: function (curItem, curInfo) {
        var name_label = curItem.getChildByName("name_label");
        name_label.setString(curInfo["name"]);

        var id_label = curItem.getChildByName("id_label");
        id_label.setString(curInfo["userId"]);
        var select_bg = curItem.getChildByName("select_bg");
        var ok_img = curItem.getChildByName("ok_img");
        if (curInfo["isSelect"]) {
            ok_img.setVisible(true);
        } else {
            ok_img.setVisible(false);
        }
        select_bg.setTouchEnabled(true);
        select_bg.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                if (ok_img.isVisible()) {
                    ok_img.setVisible(false);
                    curInfo["isSelect"] = false;
                } else {
                    ok_img.setVisible(true);
                    curInfo["isSelect"] = true;
                }
            }
        })
    },

    init_match_member_select_panel: function (total_list_back) {
        var self = this;
        var player = h1global.entityManager.player();
        if (total_list_back.length > 0) {
            this.team_member_list = total_list_back.concat([]);
            var member_listview = self.match_member_panel.getChildByName("member_listview");
            var listView = UICommonWidget.create_list_view(member_listview, total_list_back, self.update_item_func);
            if (!listView) {
                return
            }
            // 列表页数便签
            var num_page_label = self.match_member_panel.getChildByName("num_page_label");
            num_page_label.setString("1/" + listView["pageSum"]);

            // 下一页
            var nextpage_btn = self.match_member_panel.getChildByName("nextpage_btn").addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    var page_id = num_page_label.getString().substring(0, num_page_label.getString().indexOf("/"));
                    var nextpage = parseInt(page_id) + 1;
                    if (UICommonWidget.change_to_listpage(member_listview, listView, nextpage, self.update_item_func)) {
                        num_page_label.setString(nextpage + "/" + listView["pageSum"]);
                    }
                }
            });

            //上一页
            var previouspage_btn = self.match_member_panel.getChildByName("previouspage_btn").addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    var page_id = num_page_label.getString().substring(0, num_page_label.getString().indexOf("/"));
                    var previouspage = parseInt(page_id) - 1;
                    if (UICommonWidget.change_to_listpage(member_listview, listView, previouspage, self.update_item_func)) {
                        num_page_label.setString(previouspage + "/" + listView["pageSum"]);
                    }
                }
            });

            //全选或全不选
            this.match_member_panel.getChildByName("select_btn").addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    if (self.isAllSelect) {
                        self.isAllSelect = false;
                        for (var i = 0; i < total_list_back.length; i++) {
                            total_list_back[i]["isSelect"] = false;
                        }
                    } else {
                        self.isAllSelect = true;
                        for (var i = 0; i < total_list_back.length; i++) {
                            total_list_back[i]["isSelect"] = true;
                        }
                    }
                    self.init_match_member_select_panel(total_list_back)
                }
            });
        } else {
            h1global.curUIMgr.uniontip_ui.show_name(const_val.TEAM_NO_MEMBER);
            this.hide();
        }

        var confirm_btn = self.match_member_panel.getChildByName("confirm_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                var group_id = self.matchSelectInfo[0]["group_id"];
                var team_uuid = self.teamSelectInfo["team_uuid"];
                var selectNum = 0;
                for (var i = 0; i < total_list_back.length; i++) {
                    if (total_list_back[i]["isSelect"]) {
                        selectNum += 1;
                    }
                }
                if (selectNum > 0) {
                    for (var i = 0; i < total_list_back.length; i++) {
                        if (total_list_back[i]["isSelect"]) {
                            var mem_userId = total_list_back[i]["userId"];
                            player.reqJoinTeam(group_id, team_uuid, mem_userId);
                        }
                    }
                } else {
                    h1global.curUIMgr.uniontip_ui.show_name(const_val.TEAM_ADD_MEMBER);
                }
            }
        });
    },

    update_team_select_member: function (team_uuid, mem_userId) {
        var memberList = this.team_member_list;
        for (var i = memberList.length - 1; i >= 0; i--) {
            if (memberList[i]["userId"] === mem_userId) {
                memberList.splice(i, 1);
            }
        }
        this.init_match_member_select_panel(memberList);
    },

    show_match_member_select_ui: function (matchInfo, teamInfo) {
        this.matchSelectInfo = matchInfo;
        this.teamSelectInfo = teamInfo;
        this.show(function () {
        });
    }
});