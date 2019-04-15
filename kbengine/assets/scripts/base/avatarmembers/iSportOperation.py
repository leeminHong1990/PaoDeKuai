# -*- coding:utf-8 -*-
from KBEDebug import *
from BaseEntity import BaseEntity
import x42
import const
import time
import h1global
import table_sports
import Functor


class iSportOperation():
    def __init__(self):
        if len(self.free_sport_list) != len(table_sports.data):
            self.free_sport_list = []
            for i in range(len(table_sports.data)):
                self.free_sport_list.append(table_sports.data[i + 1]['free'])
        DEBUG_MSG("init free sport list = {}".format(self.free_sport_list))
        self.setTimerByWeek()
        return

    def setTimerByWeek(self):
        for x in h1global.rc.sportDict[const.SPORT_WEEKLY]:
            self.base_info = h1global.rc.sportDict[const.SPORT_WEEKLY][x]
            # 活动开始重置周赛排行榜
            s_t = time.localtime()
            for t_p in self.base_info["time"]:
                # 赛事开始
                h, m, s = t_p[0].split(":")
                d_t = ((int(h) * 3600 + int(m) * 60 + int(s)) - (
                    s_t.tm_hour * 3600 + s_t.tm_min * 60 + s_t.tm_sec) + 86400) % 86400
                self.add_repeat_timer(d_t, 24 * 3600, Functor.Functor(self.refreshRank, self.base_info["time"][t_p]))

    def initSportOperation(self):
        ttime = time.time()
        if getattr(self, 'client', None):
            self.client.pushSportTimesList(self.free_sport_list)
        if not h1global.isSameDay2(ttime, self.lastWeekSportResetTime):
            self.lastWeekSportResetTime = ttime
            self.weekSportScore = []
            self.gameLeft = 0

    def refreshRank(self, days_list):
        DEBUG_MSG("refreshRank： {}".format(days_list))
        ttime = time.time()
        s_t = time.localtime()
        if s_t.tm_wday in days_list:
            self.lastWeekSportResetTime = ttime
            self.weekSportScore     = []
            self.gameLeft = 0

    def joinSport(self, sportId):
        if sportId not in table_sports.data:
            if getattr(self, 'client', None):
                self.client.showTip("赛事ID不正确")
            return
        if h1global.getRoomSportType(sportId) == const.SPORT_DAILY:
            x42.SportDailyStub.join(self, sportId)
        elif h1global.getRoomSportType(sportId) == const.SPORT_WEEKLY:
            x42.SportWeeklyStub.join(self, sportId)
        if getattr(self, 'client', None):
            self.client.pushSportTimesList(self.free_sport_list)
        return

    def getWeeklySportRank(self, sportId):
        if h1global.getRoomSportType(sportId) != const.SPORT_WEEKLY:
            if getattr(self, 'client', None):
                self.client.showTip("赛事ID不正确")
            return
        x42.SportWeeklyStub.getWeeklySportRank(self, sportId)

    def refreshSport(self):
        DEBUG_MSG("refresh sport=====>: {}".format(time.localtime()))
        for i in range(len(table_sports.data)):
            info = table_sports.data[i + 1]
            if info['type'] == const.SPORT_DAILY:
                self.free_sport_list[i] = info['free']
            elif info['type'] == const.SPORT_WEEKLY and time.localtime().tm_wday == 0:
                self.free_sport_list[i] = info['free']
        if getattr(self, 'client', None):
            self.client.pushSportTimesList(self.free_sport_list)
        return

    def updateDailyRank(self, rank_info):
        DEBUG_MSG("updateDailyRank=====>: {}".format(rank_info))
        self.rank.append(rank_info)
        if getattr(self, 'client', None):
            self.client.pushAvatarInfo(self.getAvatarInfo())
