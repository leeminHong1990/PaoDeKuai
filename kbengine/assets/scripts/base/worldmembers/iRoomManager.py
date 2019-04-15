# -*- coding: utf-8 -*-
import KBEngine
import Functor
import const
from KBEDebug import *
import time
import h1global
import x42

MAX_ROOM_NUM = 3000


class iRoomManager(object):
    """
    服务端游戏对象的基础接口类
    """

    def __init__(self):
        self.rooms = {}

    def addRoom(self, room):
        self.rooms[room.roomID] = room
        if h1global.getRoomSportType(room.sportId) == const.SPORT_DAILY:
            x42.SportDailyStub.addRoom(room)
        elif h1global.getRoomSportType(room.sportId) == const.SPORT_WEEKLY:
            x42.SportWeeklyStub.addRoom(room)
        room.group_id > 0 and self.notifyGroupCreateRoom(room.group_id, room.team_uuid, room.match_mode, room.roomID)

    def delRoom(self, room):
        if room.group_id > 0:
            roomInfo = room.groupReqRoomInfo()
            if roomInfo is not None:
                self.notifyGroupDestroyRoom(room.group_id, room.team_uuid, room.roomID, roomInfo)
            else:
                self.notifyGroupDestroyRoom(room.group_id, room.team_uuid, room.roomID)
        if room.roomID in self.rooms:
            if h1global.getRoomSportType(room.sportId) == const.SPORT_DAILY:
                x42.SportDailyStub.dismissRoom(room)
            elif h1global.getRoomSportType(room.sportId) == const.SPORT_WEEKLY:
                x42.SportWeeklyStub.dismissRoom(room)
            self.rooms[room.roomID].destroySelf()
            del self.rooms[room.roomID]

    def enterRoom(self, roomID, avatar):
        if roomID in self.rooms:
            # 公会房间判断
            room = self.rooms[roomID]
            if room.sportId > 0:
                if avatar.sportId == room.sportId:
                    room.reqEnterRoom(avatar)
                else:
                    avatar.enterRoomFailed(const.ENTER_FAILED_ROOM_SPORT_LIMIT)
            else:
                if room.group_id == 0 or room.team_uuid == 0:  # 非公会房间
                    room.reqEnterRoom(avatar)
                elif room.group_id in avatar.groupDict and self.groupDict[room.group_id].hasTeamMem(room.team_uuid,
                                                                                                    avatar.userId):
                    room.reqEnterRoom(avatar)
                else:
                    avatar.enterRoomFailed(const.ENTER_FAILED_ROOM_LIMIT)
        else:
            avatar.enterRoomFailed(const.ENTER_FAILED_ROOM_NO_EXIST)

    def quitRoom(self, roomID, avatar):
        if roomID in self.rooms:
            room = self.rooms[roomID]
            room.reqLeaveRoom(avatar)

            if room.isEmpty:
                self.delRoom(room)

    def swapTileToTop(self, roomID, tile):
        if roomID in self.rooms:
            room = self.rooms[roomID]
            room.swapTileToTop(tile)
