# -*- coding:utf-8 -*-
import KBEngine
from KBEDebug import *
from interfaces.GameObject import GameObject
from BaseEntity import BaseEntity
import h1global
import const
import copy
import utility
import datetime
import time
import math
import random


class Group(GameObject, BaseEntity):
    def __init__(self):
        GameObject.__init__(self)
        BaseEntity.__init__(self)

        if len(self.mem_list) <= 0:
            self.mem_list.append(self.owner_info)

        for team in self.team_list:
            team["room_list"] = []

        self.loginCheckDailyRank()
        self.hourlyRankTimer = None
        self.setTimerByDay()
        return

    def hasGroupMem(self, userId):
        return any(mem["userId"] == userId for mem in self.mem_list)

    def hasTeam(self, team_uuid):
        return any(team["team_uuid"] == team_uuid for team in self.team_list)

    def hasTeamMem(self, team_uuid, userId):
        for team in self.team_list:
            if team["team_uuid"] == team_uuid:
                return any(team_mem == userId for team_mem in team["member_userId_list"])
        return False

    def hasTeamRoom(self, team_uuid, userId):
        for team in self.team_list:
            if team["team_uuid"] == team_uuid:
                return any(room["room_id"] == userId for room in team["room_list"])
        return False

    def canChangeTeamState(self, team_uuid, team_state):
        for team in self.team_list:
            if team["team_uuid"] == team_uuid:
                if team["team_state"] == team_state:
                    return False
                return True
        return False

    def teamValid(self, team_uuid):
        for team in self.team_list:
            if team["team_uuid"] == team_uuid:
                if team["team_state"] == const.TEAM_VALID:
                    return True
                return False
        return False

    def getTeamRoomOp(self, team_uuid):
        for team in self.team_list:
            if team["team_uuid"] == team_uuid:
                return team["room_op"]
        return None

    def getMatchTeamRoomList(self, team_uuid):
        for team in self.team_list:
            if team["team_uuid"] == team_uuid:
                return team["room_list"]
        return []

    # 公会排行榜每日0点刷新
    def setTimerByDay(self):
        offset = 0
        ctime_s = list(time.localtime())
        if ctime_s[4] != 0 or ctime_s[5] != 0:
            offset = (60 * 60 * (23 - ctime_s[3])) + (60 * (59 - ctime_s[4])) + (59 - ctime_s[5])
        if self.hourlyRankTimer is not None:
            self.cancel_timer(self.hourlyRankTimer)
            self.hourlyRankTimer = None
        self.hourlyRankTimer = self.add_repeat_timer(math.ceil(offset) + random.randint(0, 20), 24 * 60 * 60,
                                                     self.refreshGroupRank)

    # 销毁 公会entity 并且删除数据库里与这个实体有关的条目
    def delGroup(self):
        self.destroy(True)

    # 公会管理 成员管理
    # 玩家在游戏中主动加入公会
    def reqJoinGroup(self, req_avatar, req_info):
        # DEBUG_MSG("reqJoinGroup====>111")
        DEBUG_MSG(req_info)
        DEBUG_MSG(self.mem_list)
        if len(self.mem_list) >= const.MAX_MEMBER_NUM:
            req_avatar.doOperationFailed(const.MEM_UP_LIMIT)
            return
        if self.hasGroupMem(req_info["userId"]):
            req_avatar.doOperationFailed(const.MEM_IN_GROUP)
            return
        # DEBUG_MSG("reqJoinGroup====>222")
        self.addMember(req_info)
        info = {
            "group_id": self.group_id,
            "group_name": self.group_name,
            "owner_info": self.owner_info,
            "bill_board": self.bill_board,
            "mem_detail_list": [],  # 普通玩家不提供相关信息
            "team_list": copy.deepcopy(self.team_list),  # 普通玩家不提供相关信息
        }
        for i in range(len(info["team_list"]) - 1, -1, -1):
            team = info["team_list"][i]
            if req_info["userId"] not in team["member_userId_list"]:
                del info["team_list"][i]
            else:
                team["member_userId_list"] = []
                team["room_list"] = []
        req_avatar.addGroup(self.group_id, const.PERMISSION_NORMAL)
        h1global.notifyMailboxMethod(req_avatar, ["client", "pushJoinGroup"], info)

    # 会长游戏中邀请玩家加入公会
    def reqInviteJoinGroup(self, req_avatar, req_userId, invite_userId):
        DEBUG_MSG("reqInviteJoinGroup >>> group {0}, {1}".format(req_userId, invite_userId))
        if len(self.mem_list) >= const.MAX_MEMBER_NUM:
            if req_avatar:
                req_avatar.doOperationFailed(const.MEM_UP_LIMIT)
            return
        if req_userId != self.owner_info["userId"]:
            if req_avatar:
                req_avatar.doOperationFailed(const.GROUP_PMSN_LIMIT)
            return
        if self.hasGroupMem(invite_userId):
            if req_avatar:
                req_avatar.doOperationFailed(const.MEM_IN_GROUP)
            return
        dbid = KBEngine.globalData["GameWorld"].getPlayerDbidByUserId(invite_userId)
        if dbid is None:  # 数据库中没有这个玩家信息
            if req_avatar:
                req_avatar.doOperationFailed(const.PLAYER_NOT_EXIT)
            return
        if KBEngine.globalData["GameWorld"].isOnline(invite_userId):  # 玩家在线
            invite_avatar = KBEngine.globalData["GameWorld"].getOnlineAvatar(invite_userId)
            mem_info = {
                "userId": invite_userId,
                "uuid": invite_avatar.uuid,
                "join_time": time.time(),
                "remark": "",
            }
            self.addMember(mem_info)
            invite_avatar.addGroup(self.group_id, const.PERMISSION_NORMAL)
            if req_avatar:
                KBEngine.globalData["GameWorld"].pushInviteJoinGroup(req_avatar, self.group_id, [mem_info])
        else:  # 玩家不在线
            dbid = KBEngine.globalData["GameWorld"].getPlayerDbidByUserId(invite_userId)
            DEBUG_MSG("reqInviteJoinGroup offline {}".format(dbid))
            if dbid is None:  # 数据库中没有这个玩家信息
                return
            group_id = self.group_id
            permission = const.PERMISSION_NORMAL

            def queryDatabaseCallBack(result, num, insert_id, error):
                userId, uuid = int(result[0][0]), int(result[0][1])
                mem_info = {
                    "userId": userId,
                    "uuid": uuid,
                    "join_time": time.time(),
                    "remark": "",
                }
                DEBUG_MSG(result[0][0], result[0][1])
                self.addMember(mem_info)
                DEBUG_MSG("queryDatabaseCallBack")
                if req_avatar:
                    KBEngine.globalData["GameWorld"].pushInviteJoinGroup(req_avatar, group_id, [mem_info])
                cmd = "INSERT INTO {0}.tbl_Avatar_group_list (parentID, sm_group_id, sm_permission) VALUES({1}, {2}, {3});".format(
                    const.DB_NAME, dbid, group_id, permission)
                DEBUG_MSG(cmd)
                h1global.executeMysql(cmd, None, "reqInviteJoinGroup insert")

            sql = "SELECT sm_userId, sm_uuid FROM {0}.tbl_Avatar WHERE id = {1};".format(const.DB_NAME, dbid)
            h1global.executeMysql(sql, queryDatabaseCallBack, "reqInviteJoinGroup query")

    # 会长游戏中邀请玩家加入公会
    def reqShareJoinGroup(self, invite_userId):
        DEBUG_MSG("reqShareJoinGroup >>> group {0}".format(invite_userId))
        req_avatar = KBEngine.globalData["GameWorld"].avatars.get(self.owner_info["userId"], None)
        self.reqInviteJoinGroup(req_avatar, self.owner_info["userId"], invite_userId)

    def reqExitGroup(self, req_avatar, req_userId):  # 玩家主动退出
        if req_userId == self.owner_info["userId"]:
            req_avatar.doOperationFailed(const.GROUP_PMSN_LIMIT)
            return
        self.delMember(req_userId)
        req_avatar.delGroup(self.group_id)
        h1global.notifyMailboxMethod(req_avatar, ["client", "pushExitGroup"], self.group_id)

    def reqDestroyGroup(self, req_avatar, req_userId, cbk_func):
        # DEBUG_MSG("reqDestroyGroup===>:")
        if req_userId != self.owner_info["userId"]:
            req_avatar.doOperationFailed(const.GROUP_PMSN_LIMIT)
            return
        # DEBUG_MSG("reqDestroyGroup===>1111")
        # 销毁所有avatar公会信息
        temp_mem_list = self.mem_list
        self.mem_list = []
        self.team_list = []
        # 优先清除 在线玩家
        dbid_list = []
        for mem in temp_mem_list:
            if KBEngine.globalData["GameWorld"].isOnline(mem["userId"]):
                p_avatar = KBEngine.globalData["GameWorld"].getOnlineAvatar(mem["userId"])
                p_avatar.delGroup(self.group_id)
            else:
                dbid = KBEngine.globalData["GameWorld"].getPlayerDbidByUserId(mem["userId"])
                if dbid is not None:
                    dbid_list.append(dbid)
        # 删除数据库中所有 avatar group_id = self.group_id
        for dbid in dbid_list:
            sql = "DELETE FROM {0}.tbl_Avatar_group_list WHERE id={1} and sm_group_id={2};".format(const.DB_NAME, dbid,
                                                                                                   self.group_id)
            h1global.executeMysql(sql, None, "reqDestroyGroup delAvatarGroup")
        cbk_func and cbk_func()

    def modifyGroupBillboard(self, req_avatar, req_userId, bill_board):
        if req_userId != self.owner_info["userId"]:
            req_avatar.doOperationFailed(const.GROUP_PMSN_LIMIT)
            return
        self.bill_board = bill_board
        h1global.notifyMailboxMethod(req_avatar, ["client", "pushGroupBillboard"], self.group_id, bill_board)

    def reqMarkMember(self, req_avatar, req_userId, mem_userId, remark):
        if req_userId != self.owner_info["userId"]:
            req_avatar.doOperationFailed(const.GROUP_PMSN_LIMIT)
            return
        if not self.hasGroupMem(mem_userId):
            req_avatar.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        for mem in self.mem_list:
            if mem["userId"] == mem_userId:
                mem["remark"] = remark
                break
        h1global.notifyMailboxMethod(req_avatar, ["client", "pushMarkMember"], self.group_id, mem_userId, remark)

    def reqDelMember(self, req_avatar, req_userId, group_list, mem_userId):  # 会长删除玩家
        if req_userId != self.owner_info["userId"] or mem_userId == self.owner_info["userId"]:
            req_avatar.doOperationFailed(const.GROUP_PMSN_LIMIT)
            return
        if not self.hasGroupMem(mem_userId):
            req_avatar.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        if KBEngine.globalData["GameWorld"].isOnline(mem_userId):  # 玩家在线
            del_avatar = KBEngine.globalData["GameWorld"].getOnlineAvatar(mem_userId)
            del_avatar.delGroup(self.group_id)
            self.delMember(mem_userId)
        # self.delGroupTeamMember(self.group_id, group_list, mem_userId)
        else:  # 玩家不在线
            dbid = KBEngine.globalData["GameWorld"].getPlayerDbidByUserId(mem_userId)
            if dbid is None:  # 数据库中没有这个玩家信息
                return
            sql = "DELETE FROM {0}.tbl_Avatar_group_list WHERE parentID={1} and sm_group_id={2};".format(const.DB_NAME,
                                                                                                         dbid,
                                                                                                         self.group_id)
            h1global.executeMysql(sql, None, "reqDelMember del")
            self.delMember(mem_userId)
        # self.delGroupTeamMember(self.group_id, group_list, mem_userId)
        h1global.notifyMailboxMethod(req_avatar, ["client", "pushDelMember"], self.group_id, mem_userId)

    def addMember(self, req_info):
        self.mem_list.append(req_info)

    def delMember(self, mem_userId):
        for i in range(len(self.mem_list) - 1, -1, -1):
            if self.mem_list[i]["userId"] == mem_userId:
                del self.mem_list[i]
                break

    def delGroupTeamMember(self, group_id, group_list, mem_userId):
        for group in group_list:
            if group["group_id"] == group_id:
                team_list = group["team_list"]
                for team in team_list:
                    memUserList = team["member_userId_list"]
                    for member in memUserList:
                        if team["userId"] == mem_userId:
                            self.reqDelTeamMem(group_id, team["team_uuid"], mem_userId)

    # team管理
    def reqCreateTeam(self, req_avatar, req_userId, room_op, team_name):
        if req_userId != self.owner_info["userId"]:
            req_avatar.doOperationFailed(const.GROUP_PMSN_LIMIT)
            return
        if len(self.team_list) >= const.MAX_TEAM_NUM:
            req_avatar.doOperationFailed(const.TEAM_MEM_UP_LIMIT)
            return
        team = {
            "team_uuid": KBEngine.genUUID64(),
            "team_state": const.TEAM_VALID,
            "team_name": team_name,
            "room_op": room_op,
            "create_time": time.time(),
            "member_userId_list": [self.owner_info["userId"]],  # 群主默认加入该team
            "room_list": [],
            "room_history_list": []
        }
        self.addTeam(team)
        h1global.notifyMailboxMethod(req_avatar, ["client", "pushCreateTeam"], self.group_id, self.team_list)

    def reqDestroyTeam(self, req_avatar, req_userId, team_uuid):
        if req_userId != self.owner_info["userId"]:
            req_avatar.doOperationFailed(const.GROUP_PMSN_LIMIT)
            return
        if not self.hasTeam(team_uuid):
            req_avatar.doOperationFailed(const.TEAM_NOT_EXIST)
            return
        self.delTeam(team_uuid)
        h1global.notifyMailboxMethod(req_avatar, ["client", "pushDestroyTeam"], self.group_id, self.team_list)

    # 只有会长可以调用
    def reqJoinTeam(self, req_avatar, req_userId, team_uuid, mem_userId):
        if req_userId != self.owner_info["userId"]:
            req_avatar.doOperationFailed(const.GROUP_PMSN_LIMIT)
            return
        if not self.hasTeam(team_uuid):
            req_avatar.doOperationFailed(const.TEAM_NOT_EXIST)
            return
        if not self.hasGroupMem(mem_userId):
            req_avatar.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        if self.hasTeamMem(team_uuid, mem_userId):
            req_avatar.doOperationFailed(const.TEAM_MEM_EXIT)
            return
        self.addTeamMem(team_uuid, mem_userId)
        h1global.notifyMailboxMethod(req_avatar, ["client", "pushJoinTeam"], self.group_id, team_uuid, mem_userId)

    def reqDelTeamMem(self, req_avatar, req_userId, team_uuid, mem_userId):
        DEBUG_MSG("reqDelTeamMem {0}, {1}, {2}".format(team_uuid, mem_userId, self.team_list))
        if req_userId != self.owner_info["userId"]:
            req_avatar.doOperationFailed(const.GROUP_PMSN_LIMIT)
            return
        if not self.hasTeam(team_uuid):
            req_avatar.doOperationFailed(const.TEAM_NOT_EXIST)
            return
        if not self.hasGroupMem(mem_userId):
            req_avatar.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        if not self.hasTeamMem(team_uuid, mem_userId):
            req_avatar.doOperationFailed(const.TEAM_MEM_NOT_EXIT)
            return
        if self.owner_info["userId"] == mem_userId:
            req_avatar.doOperationFailed(const.TEAM_NOT_OWNER)
            return
        self.delTeamMem(team_uuid, mem_userId)
        h1global.notifyMailboxMethod(req_avatar, ["client", "pushDelTeamMem"], self.group_id, team_uuid, mem_userId)

    def reqChangeTeamState(self, req_avatar, req_userId, team_uuid, team_state):
        if req_userId != self.owner_info["userId"]:
            req_avatar.doOperationFailed(const.GROUP_PMSN_LIMIT)
            return
        if not self.hasTeam(team_uuid):
            req_avatar.doOperationFailed(const.TEAM_NOT_EXIST)
            return
        if not self.canChangeTeamState(team_uuid, team_state):
            req_avatar.doOperationFailed(const.TEAM_STATE_ERROR)
            return
        if team_state != const.TEAM_INVALID and team_state != const.TEAM_VALID:
            return
        for team in self.team_list:
            if team["team_uuid"] == team_uuid:
                team["team_state"] = team_state
                break
        h1global.notifyMailboxMethod(req_avatar, ["client", "pushChangeTeamState"], self.group_id, team_uuid,
                                     team_state)

    def addTeam(self, team):
        self.team_list.append(team)

    def delTeam(self, team_uuid):
        for team in reversed(self.team_list):
            if team["team_uuid"] == team_uuid:
                self.team_list.remove(team)
                break

    # team 成员管理
    def addTeamMem(self, team_uuid, mem_userId):
        for team in self.team_list:
            if team["team_uuid"] == team_uuid:
                team["member_userId_list"].append(mem_userId)
                break

    def delTeamMem(self, team_uuid, mem_userId):
        for team in self.team_list:
            if team["team_uuid"] == team_uuid:
                team["member_userId_list"].remove(mem_userId)

    # team房间管理
    def reqGenTeamRoom(self, req_avatar, req_userId, team_uuid, match_mode):  # 创建 赛事房间
        if not self.hasGroupMem(req_userId):
            req_avatar.doOperationFailed(const.MEM_NOT_IN_GROUP)
            return
        if not self.hasTeam(team_uuid):
            req_avatar.doOperationFailed(const.TEAM_NOT_EXIST)
            return
        if not self.hasTeamMem(team_uuid, req_userId):
            req_avatar.doOperationFailed(const.TEAM_PMSN_LIMIT)
            return
        if not self.teamValid(team_uuid):
            req_avatar.doOperationFailed(const.TEAM_STATE_INVALID)
            return
        if match_mode != const.ROOM_GROUP_PUBLIC and match_mode != const.ROOM_GROUP_PRIVATE:
            return
        # 创建房间 match_mode
        room_op = self.getTeamRoomOp(team_uuid)
        if room_op is None:
            return
        # DEBUG_MSG("reqGenTeamRoom==> {}".format(room_op))
        # DEBUG_MSG("reqGenTeamRoom==> match_mode {0}, team_uuid {1}".format(match_mode, team_uuid))
        if match_mode == const.ROOM_GROUP_PUBLIC:  # 公会公开房间 自动匹配
            # 优先自动匹配
            room_list = self.getMatchTeamRoomList(team_uuid)
            room_id = KBEngine.globalData["GameWorld"].getAutoMatchRoomId(room_list)
            if room_id is not None:
                req_avatar.enterRoom(room_id)
            else:
                belong_info = {
                    'match_mode': const.ROOM_GROUP_PUBLIC,
                    'group_id': self.group_id,
                    'team_uuid': team_uuid,
                    'sportId': 0
                }
                req_avatar.reqCreateDetailRoom(room_op, belong_info)
        else:
            belong_info = {
                'match_mode': const.ROOM_GROUP_PRIVATE,
                'group_id': self.group_id,
                'team_uuid': team_uuid,
                'sportId': 0
            }
            req_avatar.reqCreateDetailRoom(room_op, belong_info)

    def notifyGroupCreateRoom(self, team_uuid, match_mode, room_id):  # 创建房间成功回调
        # DEBUG_MSG("notifyGroupCreateRoom {0} {1} {2}".format(team_uuid, match_mode, room_id))
        if not self.hasTeam(team_uuid):
            return
        room = {
            "match_mode": match_mode,
            "room_id": room_id,
        }
        self.unionAddRoom(team_uuid, room)

    def notifyGroupDestroyRoom(self, team_uuid, room_id, room_info={}):  # 玩家退出房间必须调用，如果此时team 被删掉了就不用处理了
        if not self.hasTeam(team_uuid):
            return
        if not self.hasTeamRoom(team_uuid, room_id):
            return
        if len(room_info) > 0:
            self.historyRoom(team_uuid, room_info)
        self.unionDelRoom(team_uuid, room_id)

    def unionAddRoom(self, team_uuid, room):
        # DEBUG_MSG("unionAddRoom {0} {1}".format(team_uuid, room))
        for team in self.team_list:
            if team["team_uuid"] == team_uuid:
                team["room_list"].append(room)
                break
                # DEBUG_MSG("unionAddRoom  team_list {0}".format(self.team_list))

    def historyRoom(self, team_uuid, room):
        # DEBUG_MSG("unionAddRoom {0} {1}".format(team_uuid, room))
        for team in self.team_list:
            if team["team_uuid"] == team_uuid:
                team["room_history_list"].append(room)
                DEBUG_MSG("historyRoom {0} {1} {2}".format(room["room_state"], room["player_num"], room["player_list"]))
                break
        length = len(team["room_history_list"])
        if length > const.MAX_HISTORY_ROOMINFO:
            new_h = []
            for s in team["room_history_list"]:
                new_h.append(s)
            team["room_history_list"] = new_h[-const.MAX_HISTORY_ROOMINFO:]
        self.writeToDB()

    def unionDelRoom(self, team_uuid, room_id):
        for team in self.team_list:
            if team["team_uuid"] == team_uuid:
                for room in team["room_list"]:
                    if room["room_id"] == room_id:
                        team["room_list"].remove(room)
                        break

    def reqTeamRoomList(self, req_avatar, req_userId, team_uuid):
        if req_userId != self.owner_info["userId"]:
            req_avatar.doOperationFailed(const.GROUP_PMSN_LIMIT)
            return
        if not self.hasTeam(team_uuid):
            req_avatar.doOperationFailed(const.TEAM_NOT_EXIST)
            return
        room_id_list = []
        for team in self.team_list:
            if team["team_uuid"] == team_uuid:
                for room in team["room_list"]:
                    room_id_list.append(room["room_id"])
                break
        KBEngine.globalData["GameWorld"].groupReqTeamRoomList(req_avatar, self.group_id, team_uuid, room_id_list)

    def reqTeamHistoryRoomList(self, req_avatar, req_userId, team_uuid):
        if req_userId != self.owner_info["userId"]:
            req_avatar.doOperationFailed(const.GROUP_PMSN_LIMIT)
            return
        if not self.hasTeam(team_uuid):
            req_avatar.doOperationFailed(const.TEAM_NOT_EXIST)
            return

        time_str = datetime.datetime.now().strftime('%H:%M:%S')
        line = time_str.split(":")
        seconds = int(line[0]) * 3600 + int(line[1]) * 60 + int(line[2])
        yesterdayTime = int(time.time()) - (seconds + 24 * 3600)
        for team in self.team_list:
            if team["team_uuid"] == team_uuid:
                room_id_list = team["room_history_list"]
                for i in range(len(room_id_list))[::-1]:
                    if int(room_id_list[i]["create_time"]) < yesterdayTime:
                        del room_id_list[i]
                h1global.notifyMailboxMethod(req_avatar, ["client", "pushTeamHistoryRoomList"], self.group_id,
                                             team_uuid, room_id_list)

    def reqGroupRoomList(self, req_avatar, req_userId):
        if req_userId != self.owner_info["userId"]:
            req_avatar.doOperationFailed(const.GROUP_PMSN_LIMIT)
            return
        room_id_list = []
        for team in self.team_list:
            for team_room in team["room_list"]:
                room_id_list.append(team_room["room_id"])
        KBEngine.globalData["GameWorld"].groupReqGroupRoomList(req_avatar, self.group_id, room_id_list)

    def reqDismissGroupRoom(self, req_avatar, req_userId, room_id):
        if req_userId != self.owner_info["userId"]:
            req_avatar.doOperationFailed(const.GROUP_PMSN_LIMIT)
            return
        KBEngine.globalData["GameWorld"].dismissGroupRoom(req_avatar, self.group_id, room_id)

    def refreshGroupRank(self):
        if len(self.group_rank_list) != 0:
            del self.group_rank_list[0]
            self.group_rank_list.append([])
        else:
            self.group_rank_list = [[], [], []]
        self.lastGroupRankTime = time.time()

    def loginCheckDailyRank(self):
        ttime = time.time()
        DEBUG_MSG("loginCheckDailyRank time:{} lastTime: {}".format(int(ttime), int(self.lastGroupRankTime)))
        isSameDay = h1global.isSameDay2(ttime, self.lastGroupRankTime)
        if not isSameDay:
            self.refreshGroupRank()

    def groupRankList(self, info, winId):
        rankInfo = dict()
        rankInfo['group_id'] = self.group_id
        rankInfo['create_time'] = time.time()
        rankInfo['join_times'] = 1
        rankInfo['remark'] = ""
        rankInfo.update(info)
        if winId == info["userId"]:
            for rank in self.group_rank_list[len(self.group_rank_list) - 1]:
                DEBUG_MSG("11111111111111 {}, {}".format(winId, rank["userId"]))
                if rank["userId"] == winId:
                    rank["winner_times"] += 1
                    break
            else:
                DEBUG_MSG("222222222222222")
                rankInfo['winner_times'] = 1

        for rank in self.group_rank_list[len(self.group_rank_list) - 1]:
            if rank["userId"] == info["userId"]:
                rank["integral"] += info["integral"]
                rank["join_times"] += 1
                break
        else:
            self.group_rank_list[len(self.group_rank_list) - 1].append(rankInfo)

        DEBUG_MSG("groupRankList111 =  {}".format(self.group_rank_list))

    # 拉取公会排行榜
    def reqGroupRankInfo(self, req_avatar, userId, acc, per):
        DEBUG_MSG("reqGroupRankInfo: {}".format(self.normal_access))
        if self.normal_access != 1 and self.owner_info["userId"] != req_avatar.userId:
            req_avatar.showTip("会长已关闭此功能！")
            return
        rankList = self.group_rank_list
        for i in range(len(rankList)):
            for rank in rankList[i]:
                for mem in self.mem_list:
                    if rank["userId"] == mem["userId"]:
                        rank["remark"] = mem["remark"]
        DEBUG_MSG("reqGroupRankInfo111 =  {}".format(rankList))
        h1global.notifyMailboxMethod(req_avatar, ["client", "pushGroupRankList"], rankList, acc, per)
