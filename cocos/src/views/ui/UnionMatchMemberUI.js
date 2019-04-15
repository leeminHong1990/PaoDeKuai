// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var UnionMatchMemberUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/UnionMatchMemberUI.json";
    },
    initUI: function () {
        this.match_member_panel = this.rootUINode.getChildByName("match_member_panel");
        var self = this;

        this.member_panel = [];           //成员管理
        this.match_member_panel.getChildByName("return_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });

        this.match_member_panel.getChildByName("select_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                cc.log("matchInfo ", self.matchInfo);
                cc.log("teamInfo ", self.teamInfo);
                h1global.curUIMgr.unionmemberallselect_ui.show_match_member_select_ui(self.matchInfo, self.teamInfo);
            }
        });

        cc.log("init_match_member_panel ", this.matchInfo, this.teamInfo);
        var memDetailList = this.matchInfo[0]["mem_detail_list"];
        var userIdList = this.teamInfo["member_userId_list"];
        var memberList = [];
        for (var i = 0; i < userIdList.length; i++) {
            for (var j = 0; j < memDetailList.length; j++) {
                if (memDetailList[j]["userId"] === userIdList[i]) {
                    memberList.push(memDetailList[j]);
                }
            }
        }
        this.init_match_member_panel(memberList);
    },

    update_item_func: function (curItem, curInfo, idx) {
        // cc.log("update_item_func ", curItem, curInfo);
        var name_label = curItem.getChildByName("name_label");
        name_label.setString(curInfo["name"]);

        var id_label = curItem.getChildByName("id_label");
        id_label.setString(curInfo["userId"]);
        var time_label = curItem.getChildByName("time_label");
        var join_time = Math.floor(curInfo["join_time"] * 1000);
        var dateStr = cutil.time2Date(join_time);
        time_label.setString(dateStr);

        var remove_btn = curItem.getChildByName("remove_btn");
        remove_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                var group_id = curInfo["group_id"];
                var uuid = curInfo["team_uuid"];
                var name = curInfo["name"];
                var userId = curInfo["userId"];
                var info = {};
                info.id = const_val.TIP_REMOVE_MATCHMEMBER;
                info.group_id = group_id;
                info.uuid = uuid;
                info.name = name;
                info.userId = userId;
                h1global.curUIMgr.uniontip_ui.show_name(info);
            }
        })
    },

    update_team_del_member: function (team_uuid, mem_userId) {
        var member_userId_list =  this.teamInfo["member_userId_list"];
        for (var i = member_userId_list.length - 1 ;i >= 0; i--){
            if (member_userId_list[i] === mem_userId){
                this.teamInfo["member_userId_list"].splice(i, 1);
            }
        }
        // cc.log("member_userId_list ",this.teamInfo["member_userId_list"]);
        // cc.log("init_match_member_panel ", this.matchInfo, this.teamInfo);
        var memDetailList = this.matchInfo[0]["mem_detail_list"];
        var userIdList = this.teamInfo["member_userId_list"];
        var memberList = [];
        for (var i = 0; i < userIdList.length; i++) {
            for (var j = 0; j < memDetailList.length; j++) {
                if (memDetailList[j]["userId"] === userIdList[i]) {
                    memberList.push(memDetailList[j]);
                }
            }
        }
        this.init_match_member_panel(memberList);
    },

    init_match_member_panel: function (memberList) {
        var self = this;
        var list = memberList.concat([]);
        for (var i = 0; i < list.length; i++) {
            list[i]["group_id"] = this.matchInfo[0]["group_id"];
            list[i]["team_uuid"] = this.teamInfo["team_uuid"];
        }
        var member_listview = self.match_member_panel.getChildByName("member_listview");
        var listView = UICommonWidget.create_list_view(member_listview, list, self.update_item_func);

        if (!listView) {
            return
        }
        // 列表子项数目
        var membernum_label = self.match_member_panel.getChildByName("membernum_label");
        membernum_label.setString(list.length);
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
        })
    },

    update_team_join_member: function (team_uuid, mem_userId) {
        this.teamInfo["member_userId_list"].push(mem_userId);
        var memDetailList = this.matchInfo[0]["mem_detail_list"];
        var userIdList = this.teamInfo["member_userId_list"];
        cc.log("userIdList ",userIdList);
        var memberList = [];
        for (var i = 0; i < userIdList.length; i++) {
            for (var j = 0; j < memDetailList.length; j++) {
                if (memDetailList[j]["userId"] === userIdList[i]) {
                    memberList.push(memDetailList[j]);
                }
            }
        }
        this.init_match_member_panel(memberList);
    },

    show_match_member_ui: function (matchInfo, teamInfo) {
        this.matchInfo = matchInfo;
        this.teamInfo = teamInfo;
        this.show(function () {
        });
    }
});