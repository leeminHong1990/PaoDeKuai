import KBEngine
from KBEDebug import *
import const
import time
import math
import utility


class iGroup:
    """只存储 group_id 和 permission 信息 其余信息打开UI到group上拉取"""

    def __init__(self):
        self.groupDict = {}
        for group in self.group_list:
            self.groupDict[group["group_id"]] = group

    def initGroup(self):
        return

    def reqGroupInfoList(self):
        KBEngine.globalData["GameWorld"].reqGroupInfoList(self, self.group_list)

    # 创建公会 正式
    def reqCreateGroup(self, group_name):
        if sum([1 for g in self.group_list if g["permission"] == const.PERMISSION_OWNER]) > 0:
            return

        def callback(content):
            if content[0] != '{':
                DEBUG_MSG(content)
                self.client.showTip("请先成为代理才能创建公会！")
                return
            creatorInfo = {
                "userId": self.userId,
                "uuid": self.uuid,
                "join_time": time.time(),
                "remark": ""
            }
            KBEngine.globalData["GameWorld"].createNewGroup(self, creatorInfo, group_name)

        utility.get_agent_info(self.userId, callback)

    # 创建公会 测试
    def reqCreateGroup1(self, group_name):
        creatorInfo = {
            "userId": self.userId,
            "uuid": self.uuid,
            "join_time": time.time(),
            "remark": ""
        }
        KBEngine.globalData["GameWorld"].createNewGroup(self, creatorInfo, group_name)

    def createGroupCbk(self, groupInfo):  # 成功回调
        self.addGroup(groupInfo["group_id"], const.PERMISSION_OWNER)
        self.client.pushNewGroup(groupInfo)

    def modifyGroupBillboard(self, group_id, bill_board):
        if group_id not in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        DEBUG_MSG("modifyGroupBillboard")
        KBEngine.globalData["GameWorld"].callGroupFunc(self, group_id, ["modifyGroupBillboard"], self.userId,
                                                       bill_board)

    def addGroup(self, group_id, permission):
        self.groupDict[group_id] = {"group_id": group_id, "permission": permission}
        self.group_list.append(self.groupDict[group_id])
        DEBUG_MSG("addGroup===succ {}".format(self.group_list))

    # 玩家在线被移除公会 (公会解散 或者 被会长删除 主动退出)
    def delGroup(self, group_id):
        if group_id not in self.groupDict:
            return
        del self.groupDict[group_id]
        for i in range(len(self.group_list) - 1, -1, -1):
            if self.group_list[i]["group_id"] == group_id:
                del self.group_list[i]
                break

    # member管理 Exposed
    def reqJoinGroup(self, group_id):
        if group_id in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        req_info = {
            "userId": self.userId,
            "uuid": self.uuid,
            "join_time": time.time(),
            "remark": "",
        }
        DEBUG_MSG("reqJoinGroup")
        KBEngine.globalData["GameWorld"].callGroupFunc(self, group_id, ["reqJoinGroup"], req_info)

    def reqInviteJoinGroup(self, group_id, invite_userId):
        if group_id not in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        DEBUG_MSG("reqInviteJoinGroup")
        KBEngine.globalData["GameWorld"].callGroupFunc(self, group_id, ["reqInviteJoinGroup"], self.userId,
                                                       invite_userId)

    def reqExitGroup(self, group_id):  # 玩家主动退出
        DEBUG_MSG("reqExitGroup====>")
        if group_id not in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        DEBUG_MSG("reqExitGroup")
        KBEngine.globalData["GameWorld"].callGroupFunc(self, group_id, ["reqExitGroup"], self.userId)

    def reqDestroyGroup(self, group_id):
        if group_id not in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        DEBUG_MSG("reqDestroyGroup")
        KBEngine.globalData["GameWorld"].reqDestroyGroup(self, self.userId, group_id)

    def reqDelMember(self, group_id, mem_userId):
        if group_id not in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        DEBUG_MSG("reqDelMember")
        KBEngine.globalData["GameWorld"].callGroupFunc(self, group_id, ["reqDelMember"], self.userId, self.group_list,
                                                       mem_userId)

    def reqMarkMember(self, group_id, mem_userId, remark):
        if group_id not in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        DEBUG_MSG("reqMarkMember")
        KBEngine.globalData["GameWorld"].callGroupFunc(self, group_id, ["reqMarkMember"], self.userId, mem_userId,
                                                       remark)

    # team管理 Exposed
    def reqCreateTeam(self, group_id, room_op, team_name):
        if group_id not in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        # 核对 开房信息 是否一致(这里简单核对一下数量)
        if len(room_op) != const.ROOM_OP_ARGS_LEN:
            self.doOperationFailed(const.TEAM_ROOM_ARGS_ERROR)
            return
        DEBUG_MSG("reqCreateTeam")
        KBEngine.globalData["GameWorld"].callGroupFunc(self, group_id, ["reqCreateTeam"], self.userId, room_op,
                                                       team_name)

    def reqDestroyTeam(self, group_id, team_uuid):
        if group_id not in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        DEBUG_MSG("reqDestroyTeam")
        KBEngine.globalData["GameWorld"].callGroupFunc(self, group_id, ["reqDestroyTeam"], self.userId, team_uuid)

    def reqJoinTeam(self, group_id, team_uuid, mem_userId):
        if group_id not in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        DEBUG_MSG("reqJoinTeam")
        KBEngine.globalData["GameWorld"].callGroupFunc(self, group_id, ["reqJoinTeam"], self.userId, team_uuid,
                                                       mem_userId)

    def reqDelTeamMem(self, group_id, team_uuid, mem_userId):
        if group_id not in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        DEBUG_MSG("reqDelTeamMem")
        KBEngine.globalData["GameWorld"].callGroupFunc(self, group_id, ["reqDelTeamMem"], self.userId, team_uuid,
                                                       mem_userId)

    # teamRoom管理 Exposed
    def reqGenTeamRoom(self, group_id, team_uuid, match_mode):
        if group_id not in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        DEBUG_MSG("reqGenTeamRoom")
        KBEngine.globalData["GameWorld"].callGroupFunc(self, group_id, ["reqGenTeamRoom"], self.userId, team_uuid,
                                                       match_mode)

    def reqChangeTeamState(self, group_id, team_uuid, state):
        if group_id not in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        DEBUG_MSG("reqChangeTeamState")
        KBEngine.globalData["GameWorld"].callGroupFunc(self, group_id, ["reqChangeTeamState"], self.userId, team_uuid,
                                                       state)

    # 查看team房间
    def reqTeamRoomList(self, group_id, team_uuid):
        if group_id not in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        DEBUG_MSG("reqTeamRoomList")
        KBEngine.globalData["GameWorld"].callGroupFunc(self, group_id, ["reqTeamRoomList"], self.userId, team_uuid)

    def reqTeamHistoryRoomList(self, group_id, team_uuid):
        if group_id not in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        DEBUG_MSG("reqTeamHistoryRoomList")
        KBEngine.globalData["GameWorld"].callGroupFunc(self, group_id, ["reqTeamHistoryRoomList"], self.userId,
                                                       team_uuid)

    # 查看group房间
    def reqGroupRoomList(self, group_id):
        if group_id not in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        DEBUG_MSG("reqGroupRoomList")
        KBEngine.globalData["GameWorld"].callGroupFunc(self, group_id, ["reqGroupRoomList"], self.userId)

    # 会长解散 未开始游戏的 room
    def reqDismissGroupRoom(self, group_id, room_id):
        if group_id not in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        DEBUG_MSG("reqDismissGroupRoom")
        KBEngine.globalData["GameWorld"].callGroupFunc(self, group_id, ["reqDismissGroupRoom"], self.userId, room_id)

    # 修改公会名称
    def reqUpdateGroupName(self, group_id, group_name):
        if group_id not in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        KBEngine.globalData["GameWorld"].updateGroupName(self, group_id, group_name, self.userId, self.group_list)

    # 公会排行榜
    def reqGroupRankList(self, group_id, acc, per):
        if group_id not in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        KBEngine.globalData["GameWorld"].callGroupFunc(self, group_id, ["reqGroupRankInfo"], self.userId, acc, per)

    # 修改公会排行榜的普通入口
    def reqUpdateGroupNormalAcc(self, group_id, normal_acc):
        if group_id not in self.groupDict:
            self.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        KBEngine.globalData["GameWorld"].updateGroupNormalAcc(self, group_id, normal_acc, self.userId, self.group_list)
