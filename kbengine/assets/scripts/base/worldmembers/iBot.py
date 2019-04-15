# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
import h1global
import const

class iBot:
    """
    服务端游戏对象的基础接口类
    """

    def __init__(self):
        self.bots = {}
        self.freeBots = {}
        self.botCount = 0

    def addOneRobot(self, robotMailbox):
        DEBUG_MSG("iBot[%i] addOneRobot %i.............. %i" % (self.id, robotMailbox.id, robotMailbox.userId))
        self.bots[robotMailbox.userId] = robotMailbox
        self.freeBots[robotMailbox.userId] = robotMailbox
        return

    def removeOneRobot(self, userId):
        DEBUG_MSG("iBot[%i] removeOneRobot %i.............." % (self.id, userId))

        if userId in self.bots:
            del self.bots[userId]
        if userId in self.freeBots:
            del self.freeBots[userId]
        return

    def queryBotsEnterRoom(self, roomId, botNum, sportId):
        # 加入房间时，机器人从空闲列表中去除
        DEBUG_MSG("iBot[%i] queryBotsEnterRoom %i.............." % (roomId, botNum))
        room = self.rooms.get(roomId)
        if room:
            botList = []
            for bot in self.freeBots.values():
                botList.append(bot)
                if len(botList) >= botNum:
                    break
            # DEBUG_MSG("11111111111 {}".format(botList))
            for bot in botList:
                bot.sportId = sportId
                if h1global.getRoomSportType(sportId) == const.SPORT_WEEKLY:
                    bot.joinSport(sportId)
                else:
                    bot.enterRoom(roomId)
            for bot in botList:
                del self.freeBots[bot.userId]

    def queryBotsQuitRoom(self, robotMailbox):
        # 退出房间后，机器人加入空闲列表
        if robotMailbox.userId in self.bots:
            if robotMailbox.userId not in self.freeBots:
                self.freeBots[robotMailbox.userId] = robotMailbox
