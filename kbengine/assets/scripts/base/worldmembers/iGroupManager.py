import KBEngine
from KBEDebug import *
import h1global
import Functor
import const
import copy


class iGroupManager:
    def __init__(self):
        self.groupVisitReady = False
        self.hasRegisteredGroupNum = 0
        self.hasCreatedGroupNum = 0
        # {uuid:{"group":group, "owner": owner, "member":[{"uuid":uuid, "name":name, "remark":remark}],  "team":[{"room_op": [],"member":[],"room_record":[]}]}
        self.groupDict = {}

    def initGroupManager(self):
        def queryDatabaseCbk(result, num, insert_id, error):
            if error is None:
                if result is not None:
                    self.hasRegisteredGroupNum = len(result)
                    for item in result:
                        KBEngine.createBaseAnywhereFromDBID("Group", int(item[0]),
                                                            Functor.Functor(self.onGroupCreatedFromDBIDCbk,
                                                                            int(item[1])))
                    if self.hasRegisteredGroupNum == 0:
                        self.groupVisitReady = True
                else:
                    self.groupVisitReady = True
                    ERROR_MSG(
                        "group mgr queryDatabaseCbk result is None. result=%s, num=%s, error=%s" % (result, num, error))
            else:
                ERROR_MSG("group mgr queryDatabaseCbk error=%s" % (error))

        KBEngine.executeRawDatabaseCommand("SELECT `id`,`sm_group_id` FROM " + const.DB_NAME + ".tbl_Group;",
                                           queryDatabaseCbk)

    def onGroupCreatedFromDBIDCbk(self, group_id, group, dbid, wasActive):
        self.groupDict[group_id] = group
        self.hasCreatedGroupNum += 1
        if self.hasRegisteredGroupNum == self.hasCreatedGroupNum:
            self.groupVisitReady = True

    def reqGroupInfoList(self, req_avatar, avatar_group_list):
        if not self.groupVisitReady:
            return
        InfoList = []
        for groupInfo in avatar_group_list:
            if groupInfo["group_id"] in self.groupDict:
                group = self.groupDict[groupInfo["group_id"]]
                info = {
                    "group_id": group.group_id,
                    "group_name": group.group_name,
                    "permission": groupInfo["permission"],  # 0: 会长 1：普通会员
                    "owner_info": group.owner_info,
                    "bill_board": group.bill_board,
                    "mem_detail_list": self.reqCacheGroupMemInfo(group.mem_list) if groupInfo[
                                                                                        "permission"] == const.PERMISSION_OWNER else [],
                    # 普通玩家不提供相关信息
                    "team_list": copy.deepcopy(group.team_list),  # 普通玩家不提供相关信息
                    "normal_access": group.normal_access
                }

                for i in range(len(info["team_list"]) - 1, -1, -1):
                    team = info["team_list"][i]
                    if req_avatar.userId not in team["member_userId_list"]:
                        del info["team_list"][i]
                    else:
                        if groupInfo["permission"] != const.PERMISSION_OWNER:
                            team["room_list"] = []
                            team["member_userId_list"] = []
                InfoList.append(info)
        h1global.notifyMailboxMethod(req_avatar, ["client", "pushGroupInfoList"], InfoList)

    def reqCacheGroupMemInfo(self, mem_list):
        mem_detail_list = []
        for mem in mem_list:
            if mem["userId"] in self.cacheDict:
                playerInfo = self.cacheDict[mem["userId"]]
                mem_detail_list.append({
                    "userId": mem["userId"],
                    "uuid": mem["uuid"],
                    "join_time": mem["join_time"],
                    "remark": mem["remark"],
                    "name": playerInfo["name"],
                    "sex": playerInfo["sex"],
                    "head_icon": playerInfo["head_icon"],
                })
        return mem_detail_list

    """ 
    req_info = GROUP_MEMBER_INFO
    """

    def createNewGroup(self, req_avatar, req_info, group_name):
        if not self.groupVisitReady:
            return
        # 公会重名检查 ..
        group_id = self.genGroupId()
        KBEngine.createBaseAnywhere("Group", {"owner_info": req_info, "group_id": group_id, "group_name": group_name},
                                    Functor.Functor(self.createNewGroupCbk, req_avatar, req_info["userId"], group_id,
                                                    group_name))

    def genGroupId(self):
        self.createGroupCount += 1
        return self.createGroupCount + 1134701

    def createNewGroupCbk(self, req_avatar, req_userId, group_id, group_name, group):
        group.writeToDB()
        self.groupDict[group_id] = group
        info = {
            "group_id": group.group_id,
            "group_name": group.group_name,
            "permission": const.PERMISSION_OWNER,
            "owner_info": group.owner_info,
            "bill_board": group.bill_board,
            "mem_detail_list": self.reqCacheGroupMemInfo(group.mem_list),
            "team_list": group.team_list,
            "normal_access": group.normal_access
        }
        DEBUG_MSG("{}".format(info))
        h1global.notifyMailboxMethod(req_avatar, ["createGroupCbk"], info)

    # avatar call group function
    def callGroupFunc(self, req_avatar, group_id, funcs, *args):
        if not self.groupVisitReady:
            return
        if group_id not in self.groupDict:
            req_avatar.doOperationFailed(const.GROUP_NOT_EXIT)
            return
        h1global.notifyMailboxMethod(self.groupDict[group_id], funcs, req_avatar, *args)
        return

    # 会长邀请成功回调
    def pushInviteJoinGroup(self, req_avatar, group_id, mem_list):
        mem_detail_list = self.reqCacheGroupMemInfo(mem_list)
        h1global.notifyMailboxMethod(req_avatar, ["client", "pushInviteJoinGroup"], group_id, mem_detail_list)

    # 会长在线删除公会
    def reqDestroyGroup(self, req_avatar, req_userId, group_id):
        if not self.groupVisitReady:
            return
        if group_id not in self.groupDict:
            req_avatar.doOperationFailed(const.GROUP_NOT_EXIT)
            return
        owner_info = self.groupDict[group_id].owner_info
        if req_userId != owner_info["userId"]:
            req_avatar.doOperationFailed(const.GROUP_PMSN_LIMIT)
            return

        def destroyCbk():
            self.groupDict[group_id].delGroup()
            del self.groupDict[group_id]
            req_avatar.client.pushDestroyGroup(group_id)

        h1global.notifyMailboxMethod(self.groupDict[group_id], ["reqDestroyGroup"], req_avatar, req_userId, destroyCbk)

    def dismissGroupRoom(self, req_avatar, group_id, room_id):
        if room_id not in self.rooms:
            req_avatar.doOperationFailed(const.ROOM_GROUP_NOT_EXIT)
            return
        self.rooms[room_id].groupOwnerQuitRoom(req_avatar, group_id)

    def getAutoMatchRoomId(self, room_id_list):
        for roomInfo in room_id_list:
            room_id = roomInfo["room_id"]
            if room_id in self.rooms and self.rooms[room_id].match_mode == const.ROOM_GROUP_PUBLIC and not self.rooms[
                room_id].isFull:
                return room_id
        return None

    def notifyGroupCreateRoom(self, group_id, team_uuid, match_mode, room_id):
        if not self.groupVisitReady:
            return
        if group_id not in self.groupDict:
            return
        h1global.notifyMailboxMethod(self.groupDict[group_id], ["notifyGroupCreateRoom"], team_uuid, match_mode,
                                     room_id)

    def notifyGroupDestroyRoom(self, group_id, team_uuid, room_id, room_info={}):
        if not self.groupVisitReady:
            return
        if group_id not in self.groupDict:
            return
        h1global.notifyMailboxMethod(self.groupDict[group_id], ["notifyGroupDestroyRoom"], team_uuid, room_id,
                                     room_info)

    # 房间信息
    def groupReqTeamRoomList(self, req_avatar, group_id, team_uuid, room_id_list):  # team 房间
        room_list = []
        DEBUG_MSG("groupReqTeamRoomList {0}, {1}".format(group_id, room_id_list))
        for i in range(len(room_id_list)):
            roomId = room_id_list[i]
            if roomId in self.rooms:
                DEBUG_MSG("--------")
                DEBUG_MSG(roomId)
                room = self.rooms[roomId].groupReqRoomInfo(const.TEAM_ROOM_INFO)
                if room is not None:
                    room_list.append(room)
        h1global.notifyMailboxMethod(req_avatar, ["client", "pushTeamRoomList"], group_id, team_uuid, room_list)

    def groupReqGroupRoomList(self, req_avatar, group_id, room_id_list):  # group 房间
        room_list = []
        DEBUG_MSG("groupReqGroupRoomList {0}, {1}".format(group_id, room_id_list))
        for i in range(len(room_id_list)):
            roomId = room_id_list[i]
            if roomId in self.rooms:
                room = self.rooms[roomId].groupReqRoomInfo()
                if room is not None:
                    room_list.append(room)
        h1global.notifyMailboxMethod(req_avatar, ["client", "pushGroupRoomList"], group_id, room_list)

    def updateGroupName(self, req_avatar, group_id, group_name, ava_userId, group_list):
        if group_id not in self.groupDict:
            return
        owner_info = self.groupDict[group_id].owner_info
        if ava_userId != owner_info["userId"]:
            req_avatar.doOperationFailed(const.GROUP_PMSN_LIMIT)
            return
        group = self.groupDict[group_id]
        group.group_name = group_name
        DEBUG_MSG("group_list :{}".format(group_list))
        self.reqGroupInfoList(req_avatar, group_list)

    def updateGroupRankList(self, group_id, info, winId):
        if not self.groupVisitReady:
            return
        if group_id not in self.groupDict:
            return
        h1global.notifyMailboxMethod(self.groupDict[group_id], ["groupRankList"], info, winId)

    def updateGroupNormalAcc(self, req_avatar, group_id, normal_acc, ava_userId, group_list):
        if group_id not in self.groupDict:
            return
        owner_info = self.groupDict[group_id].owner_info
        if ava_userId != owner_info["userId"]:
            req_avatar.doOperationFailed(const.GROUP_PMSN_LIMIT)
            return
        group = self.groupDict[group_id]
        group.normal_access = normal_acc
        self.reqGroupInfoList(req_avatar, group_list)
