// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var UnionTipUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/UnionTipUI.json";
    },
    initUI: function () {
        this.uniontip_panel = this.rootUINode.getChildByName("uniontip_panel");
        var self = this;
        this.player = h1global.entityManager.player();
        //
        this.uniontip_panel.getChildByName("cancel_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });

        this.uniontip_panel.getChildByName("confirm_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                cc.log("info  ", self.info);
                if (self.info === const_val.CREATE_UNION) {
                    // 发送到服务端，检查名字是否合法重复
                } else if (self.info === const_val.CREATE_MATCH) {
                    // 发送到服务端，检查名字是否合法重复

                } else if (self.info.id === const_val.TIP_DELETE_MEMBER) {
                    if (h1global.curUIMgr.unionhall_ui && h1global.curUIMgr.unionhall_ui.is_show) {
                        h1global.curUIMgr.unionhall_ui.sendDelMember(self.info.userid);
                    }
                } else if (self.info.id === const_val.TIP_DELETE_MATCH) {
                    self.player.reqDestroyTeam(self.info.group_id, self.info.uuid);
                }else if (self.info.id === const_val.TIP_EXITUNION){
                    self.player.reqExitGroup(self.info.group_id);
                }else if (self.info.id === const_val.TIP_REMOVE_MATCHMEMBER){
                    self.player.reqDelTeamMem(self.info.group_id, self.info.uuid, self.info.userId);
                }else if (self.info.id === const_val.TIP_STOP_MATCH){
                    self.player.reqChangeTeamState(self.info.group_id, self.info.uuid, self.info.team_state);
                }
                self.hide();
            }
        });
    },

    show_name: function (info) {
        if (!info) {
            return null
        }
        this.info = info;
        var self = this;
        this.show(function () {
            if (self.info.id === const_val.TIP_REMOVE_MATCHMEMBER) {
                self.uniontip_panel.getChildByName("tip_label").setString("确定删除[" + self.info.name + "]吗？");
            } else if (self.info.id === const_val.TIP_STOP_MATCH) {
                if (self.info.team_state === 1){
                    self.uniontip_panel.getChildByName("tip_label").setString("确定启用[" + self.info.name + "]赛事吗？");
                }else {
                    self.uniontip_panel.getChildByName("tip_label").setString("确定停用[" + self.info.name + "]赛事吗？");
                }
            } else if (self.info.id === const_val.TIP_DELETE_MATCH) {
                self.uniontip_panel.getChildByName("tip_label").setString("确定删除[" + self.info.name + "]赛事吗？");
            } else if (self.info.id === const_val.TIP_DELETE_MEMBER) {
                self.uniontip_panel.getChildByName("tip_label").setString("确定删除[" + self.info.name + "]吗？");
            }else if (self.info.id === const_val.TIP_EXITUNION){
                self.uniontip_panel.getChildByName("tip_label").setString("确定退出["+self.info.group_name+"]吗？");
            }
            if (typeof (info) === "number") {
                switch (info) {
                    case const_val.GROUP_PMSN_LIMIT:
                        self.uniontip_panel.getChildByName("tip_label").setString("公会管理权限不足！");
                        break;
                    case const_val.GROUP_NOT_EXIT:
                        self.uniontip_panel.getChildByName("tip_label").setString("公会不存在！");
                        break;
                    case const_val.PLAYER_NOT_EXIT:
                        self.uniontip_panel.getChildByName("tip_label").setString("该用户不存在！");
                        break;
                    case const_val.MEM_UP_LIMIT:
                        self.uniontip_panel.getChildByName("tip_label").setString("公会人数达到上限！");
                        break;
                    case const_val.MEM_IN_GROUP:
                        self.uniontip_panel.getChildByName("tip_label").setString("玩家已在公会中！");
                        break;
                    case const_val.MEM_NOT_IN_GROUP:
                        self.uniontip_panel.getChildByName("tip_label").setString("玩家不在公会！");
                        break;
                    case const_val.TEAM_MEM_UP_LIMIT:
                        self.uniontip_panel.getChildByName("tip_label").setString("赛事数量达到上限！");
                        break;
                    case const_val.TEAM_PMSN_LIMIT:
                        self.uniontip_panel.getChildByName("tip_label").setString("参与赛事权限不足！");
                        break;
                    case const_val.TEAM_STATE_ERROR:
                        self.uniontip_panel.getChildByName("tip_label").setString("赛事状态不正确！");
                        break;
                    case const_val.TEAM_NOT_EXIST:
                        self.uniontip_panel.getChildByName("tip_label").setString("赛事活动不存在！");
                        break;
                    case const_val.TEAM_STATE_INVALID:
                        self.uniontip_panel.getChildByName("tip_label").setString("赛事已被停用！");
                        break;
                    case const_val.TEAM_ROOM_ARGS_ERROR:
                        self.uniontip_panel.getChildByName("tip_label").setString("赛事房间参数不正确！");
                        break;
                    case const_val.TEAM_MEM_EXIT:
                        self.uniontip_panel.getChildByName("tip_label").setString("赛事成员玩家已存在！");
                        break;
                    case const_val.TEAM_MEM_NOT_EXIT:
                        self.uniontip_panel.getChildByName("tip_label").setString("赛事成员玩家不存在！");
                        break;
                    case const_val.ROOM_GROUP_NOT_EXIT:
                        self.uniontip_panel.getChildByName("tip_label").setString("公会房间不存在！");
                        break;
                    case const_val.ROOM_GROUP_IS_PLAYING:
                        self.uniontip_panel.getChildByName("tip_label").setString("公会房间正在游戏中！");
                        break;
                    case const_val.ROOM_GROUP_PMSN_LIMIT:
                        self.uniontip_panel.getChildByName("tip_label").setString("公会房间管理权限不足！");
                        break;
                    case const_val.TEAM_NO_MEMBER:
                        self.uniontip_panel.getChildByName("tip_label").setString("所有成员已被添加到当前赛事中！");
                        break;
                    case const_val.TEAM_NOT_OWNER:
                        self.uniontip_panel.getChildByName("tip_label").setString("不能删除自己！");
                        break;
                    case const_val.TEAM_ADD_MEMBER:
                        self.uniontip_panel.getChildByName("tip_label").setString("请选择要添加的成员！");
                        break;
                    case const_val.TEAM_NO_ROOM:
                        self.uniontip_panel.getChildByName("tip_label").setString("该赛事无房间！");
                        break;
                    case const_val.NAME_NO_STANDARD:
                        self.uniontip_panel.getChildByName("tip_label").setString("名称不能为空或者全是空格！");
                        break;
                    default:
                        break;
                }
            }
        });
    }
});