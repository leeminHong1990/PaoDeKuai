"use strict";
/*-----------------------------------------------------------------------------------------
 interface
 -----------------------------------------------------------------------------------------*/
var impGroup = impGameRules.extend({
    __init__: function () {
        this._super();
        KBEngine.DEBUG_MSG("Create impGroup");
    },

    // 拉取公会信息
    reqGroupInfoList: function () {
        this.baseCall("reqGroupInfoList")
    },

    pushGroupInfoList: function (groupInfoList) {
        cc.log("pushGroupInfoList", groupInfoList);
        if (h1global.curUIMgr.unionhall_ui && h1global.curUIMgr.unionhall_ui.is_show) {
            if (groupInfoList && groupInfoList.length > 0) {
                // 测试先这样写，带服务器返回参数修改
                if (groupInfoList[0]["permission"] === 0) {
                    h1global.curUIMgr.unionhall_ui.update_unionInfo_list(groupInfoList);
                } else {
                    h1global.curUIMgr.unionhall_ui.init_memberunion_list(groupInfoList);
                }
            } else {
                h1global.curUIMgr.unionhall_ui.init_unionInfo_list();
            }
        }
    },
    // 创建公会 （字符串长度<=6）
    reqCreateGroup: function (group_name) {
        this.baseCall("reqCreateGroup", group_name)
    },

    pushNewGroup: function (groupInfo) {
        cc.log("pushNewGroup", groupInfo);
        if (h1global.curUIMgr.unionhall_ui && h1global.curUIMgr.unionhall_ui.is_show) {
            h1global.curUIMgr.unionhall_ui.recCreateGroup(groupInfo);
        }
    },

    //修改公告
    modifyGroupBillboard: function (group_id, billboard) {
        this.baseCall("modifyGroupBillboard", group_id, billboard)
    },

    pushGroupBillboard: function (group_id, billboard) {
        cc.log("pushGroupBillboard", group_id, billboard);
        if (h1global.curUIMgr.unionhall_ui && h1global.curUIMgr.unionhall_ui.is_show) {
            h1global.curUIMgr.unionhall_ui.recBillboard(group_id, billboard);
        }
    },

    //玩家在游戏中主动加入公会
    reqJoinGroup: function (group_id) {
        this.baseCall("reqJoinGroup", group_id)
    },

    pushJoinGroup: function (groupInfo) {
        cc.log("pushJoinGroup", groupInfo)
    },

    // 会长游戏中邀请玩家加入公会
    reqInviteJoinGroup: function (group_id, invite_userId) {
        this.baseCall("reqInviteJoinGroup", group_id, invite_userId)
    },

    pushInviteJoinGroup: function (group_id, mem_detail_list) {
        cc.log("pushInviteJoinGroup", group_id, mem_detail_list);
        if (h1global.curUIMgr.unionhall_ui && h1global.curUIMgr.unionhall_ui.is_show) {
            h1global.curUIMgr.unionhall_ui.recInviteJoinGroup(group_id, mem_detail_list);
        }
    },

    // 玩家退出公会
    reqExitGroup: function (group_id) { // 玩家主动退出
        this.baseCall("reqExitGroup", group_id)
    },

    pushExitGroup: function (group_id) {
        cc.log("pushExitGroup", group_id);
        if (h1global.curUIMgr.unionhall_ui && h1global.curUIMgr.unionhall_ui.is_show) {
            h1global.curUIMgr.unionhall_ui.recExitGroup(group_id);
        }
    },

    // 会长在线删除公会
    reqDestroyGroup: function (group_id) {
        this.baseCall("reqDestroyGroup", group_id)
    },

    pushDestroyGroup: function (group_id) {
        cc.log("pushDestroyGroup", group_id)
    },

    // 会长删除玩家
    reqDelMember: function (group_id, mem_userId) { // 会长删除玩家
        this.baseCall("reqDelMember", group_id, mem_userId)
    },

    pushDelMember: function (group_id, mem_userId) {
        cc.log("pushDelMember", group_id, mem_userId);
        if (h1global.curUIMgr.unionhall_ui && h1global.curUIMgr.unionhall_ui.is_show) {
            h1global.curUIMgr.unionhall_ui.recDelMember(group_id, mem_userId);
        }
    },

    // 会长标识玩家（字符串长度<=6）
    reqMarkMember: function (group_id, mem_userId, remark) {
        this.baseCall("reqMarkMember", group_id, mem_userId, remark)
    },

    pushMarkMember: function (group_id, mem_userId, remark) {
        cc.log("pushMarkMember", group_id, mem_userId, remark);
        if (h1global.curUIMgr.unionhall_ui && h1global.curUIMgr.unionhall_ui.is_show) {
            h1global.curUIMgr.unionhall_ui.recMarkMember(group_id, mem_userId, remark);
        }
    },

    // 创建赛事活动
    reqCreateTeam: function (group_id, room_op, team_name) {
        this.baseCall("reqCreateTeam", group_id, room_op, team_name)
    },

    pushCreateTeam: function (group_id, team) {
        cc.log("pushCreateTeam", group_id, team);
        if (h1global.curUIMgr.unionhall_ui && h1global.curUIMgr.unionhall_ui.is_show) {
            h1global.curUIMgr.unionhall_ui.update_match_team(team);
            h1global.curUIMgr.unionhall_ui.update_union_room_info(team);
        }
    },

    //删除赛事活动
    reqDestroyTeam: function (group_id, team_uuid) {
        cc.log("reqDestroyTeam ", group_id, team_uuid);
        this.baseCall("reqDestroyTeam", group_id, team_uuid)
    },

    pushDestroyTeam: function (group_id, team_list) {
        cc.log("pushDestroyTeam", group_id, team_list);
        if (h1global.curUIMgr.unionhall_ui && h1global.curUIMgr.unionhall_ui.is_show) {
            h1global.curUIMgr.unionhall_ui.update_match_team(team_list);
            h1global.curUIMgr.unionhall_ui.update_union_room_info(team_list);
        }
    },

    //添加公会成员到team列表(仅限会长)
    reqJoinTeam: function (group_id, team_uuid, mem_userId) {
        this.baseCall("reqJoinTeam", group_id, team_uuid, mem_userId)
    },

    pushJoinTeam: function (group_id, team_uuid, mem_userId) {
        cc.log("pushJoinTeam", group_id, team_uuid, mem_userId);
        if (h1global.curUIMgr.unionmemberallselect_ui && h1global.curUIMgr.unionmemberallselect_ui.is_show) {
            h1global.curUIMgr.unionmemberallselect_ui.update_team_select_member(team_uuid, mem_userId);
        }

        if (h1global.curUIMgr.unionmatchmember_ui && h1global.curUIMgr.unionmatchmember_ui.is_show) {
            h1global.curUIMgr.unionmatchmember_ui.update_team_join_member(team_uuid, mem_userId);
        }
    },

    // 删除team列表中的公会成员(仅限会长)
    reqDelTeamMem: function (group_id, team_uuid, mem_userId) {
        this.baseCall("reqDelTeamMem", group_id, team_uuid, mem_userId)
    },

    pushDelTeamMem: function (group_id, team_uuid, mem_userId) {
        cc.log("pushDelTeamMem", group_id, team_uuid, mem_userId);
        if (h1global.curUIMgr.unionmatchmember_ui && h1global.curUIMgr.unionmatchmember_ui.is_show) {
            h1global.curUIMgr.unionmatchmember_ui.update_team_del_member(team_uuid, mem_userId);
        }
    },

    // 创建/自动匹配 赛事活动房间
    reqGenTeamRoom: function (group_id, team_uuid, match_mode) {
        this.baseCall("reqGenTeamRoom", group_id, team_uuid, match_mode)
    },

    pushGenTeamRoom: function (group_id, team_uuid, roomInfo) {
        cc.log("pushCreateTeamRoom", group_id, team_uuid, roomInfo)
    },

    // 会长设置赛事活动 状态
    reqChangeTeamState: function (group_id, team_uuid, state) {
        this.baseCall("reqChangeTeamState", group_id, team_uuid, state);
        if (h1global.curUIMgr.unionhall_ui && h1global.curUIMgr.unionhall_ui.is_show) {
            h1global.curUIMgr.unionhall_ui.update_team_state(group_id, team_uuid, state);
        }
    },

    pushChangeTeamState: function (group_id, team_uuid, state) {
        cc.log("pushChangeTeamState", group_id, team_uuid, state)

    },

    // 拉取 team 房间
    reqTeamRoomList: function (group_id, team_uuid) {
        this.baseCall("reqTeamRoomList", group_id, team_uuid)
    },

    pushTeamRoomList: function (group_id, team_uuid, room_list) {
        cc.log("pushTeamRoomList", group_id, team_uuid, room_list);
        h1global.curUIMgr.unionroominfo_ui.get_room_list(group_id, team_uuid, room_list);
    },

    reqTeamHistoryRoomList: function (group_id, team_uuid) {
        this.baseCall("reqTeamHistoryRoomList", group_id, team_uuid)
    },


    pushTeamHistoryRoomList: function (group_id, team_uuid, room_list) {
        cc.log("pushTeamHistoryRoomList", group_id, team_uuid, room_list);
        h1global.curUIMgr.unionroominfo_ui.get_all_room_list(group_id, team_uuid, room_list);
    },

    // 拉取所有房间
    reqGroupRoomList: function (group_id) {
        this.baseCall("reqGroupRoomList", group_id)
    },

    pushGroupRoomList: function (group_id, room_list) {
        cc.log("pushGroupRoomList", group_id, room_list)
    },

    // 会长解散 未开始游戏的 room
    reqDismissGroupRoom: function (group_id, room_id) {
        this.baseCall("reqDismissGroupRoom", group_id, room_id)
    },

    pushDismissGroupRoom: function (group_id, room_id) {
        cc.log("pushDismissGroupRoom", group_id, room_id)
    },

    reqUpdateGroupName: function (group_id, group_name) {
        this.baseCall("reqUpdateGroupName", group_id, group_name);
    },

    //拉取公会排行榜
    reqGroupRankList: function (group_id, acc, per) {
        cc.log("reqGroupRankList group_id", group_id, acc, per);
        this.baseCall("reqGroupRankList", group_id, acc, per);
    },

    pushGroupRankList: function (rankInfo, acc, per) {
        cc.log("pushGroupRankList: ", rankInfo, acc, per);
        h1global.curUIMgr.unionrank_ui.show_info(rankInfo, acc, per)
    },

    //修改工会排行榜普通成员入口
    updateGroupNormalAcc: function (group_id, normal_acc) {
        cc.log("updateGroupNormalAcc group_id", group_id, normal_acc);
        this.baseCall("reqUpdateGroupNormalAcc", group_id, normal_acc);
    }
});