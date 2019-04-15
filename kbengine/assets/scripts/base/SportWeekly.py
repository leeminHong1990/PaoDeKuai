# -*- coding:utf-8 -*-

import KBEngine
from KBEDebug import *
from BaseEntity import BaseEntity
from collections import OrderedDict
import x42
import time
import const
import Functor
import h1global
import json
import switch
import utility
import copy

REWARD_DELAY_TIME = 1.5 * 60 * 60  # 比赛结束后一个半小时 发放奖励


class SportWeekly(BaseEntity):
    def __init__(self):
        BaseEntity.__init__(self)
        self.wait_pool = OrderedDict()
        self.isOpen = 0
        self.base_info = h1global.rc.sportDict[const.SPORT_WEEKLY][self.sportId]
        # 活动开始重置排行榜
        s_t = time.localtime()
        for t_p in self.base_info["time"]:
            # 赛事开始

            h, m, s = t_p[0].split(":")
            d_t = ((int(h) * 3600 + int(m) * 60 + int(s)) - (
                s_t.tm_hour * 3600 + s_t.tm_min * 60 + s_t.tm_sec) + 86400) % 86400
            self.add_repeat_timer(d_t, 24 * 3600, Functor.Functor(self.refreshRank, self.base_info["time"][t_p]))
            b_t = (int(h) * 3600 + int(m) * 60 + int(s)) - (s_t.tm_hour * 3600 + s_t.tm_min * 60 + s_t.tm_sec)
            # 赛事结束
            h, m, s = t_p[1].split(":")
            d_t = ((int(h) * 3600 + int(m) * 60 + int(s)) - (
                s_t.tm_hour * 3600 + s_t.tm_min * 60 + s_t.tm_sec) + 86400) % 86400
            self.add_repeat_timer(d_t, 24 * 3600, Functor.Functor(self.weekOver, self.base_info["time"][t_p]))
            # 发放奖励
            h, m, s = t_p[1].split(":")
            d_t = ((int(h) * 3600 + int(m) * 60 + int(s)) - (
                s_t.tm_hour * 3600 + s_t.tm_min * 60 + s_t.tm_sec) + 86400) % 86400
            d_t += REWARD_DELAY_TIME
            l_t = (int(h) * 3600 + int(m) * 60 + int(s)) - (s_t.tm_hour * 3600 + s_t.tm_min * 60 + s_t.tm_sec)
            self.add_repeat_timer(d_t, 24 * 3600, Functor.Functor(self.giveReward, self.base_info["time"][t_p]))
            DEBUG_MSG("refreshRank:{0},{1}".format(b_t,l_t))
            if b_t < 0 and l_t > 0:
                self.refreshRank(self.base_info["time"][t_p])

    def refreshRank(self, days_list):
        DEBUG_MSG("refreshRank： {}".format(days_list))
        s_t = time.localtime()
        if s_t.tm_wday in days_list:
            self.rank = OrderedDict()
            self.isOpen = 1

    def giveReward(self, days_list):
        DEBUG_MSG("giveReward： {}".format(days_list))
        s_t = time.localtime()
        if s_t.tm_wday in days_list:
            rc_list = list(self.rank.values())
            DEBUG_MSG("rank:{}".format(rc_list[:20]))

            # 后台系统发放奖励
            if switch.DEBUG_BASE == 0:
                reward_list = self.base_info['reward']
                reward_player = [p['accountName'] for p in rc_list[:len(reward_list)]]
                card_reward = reward_list[:len(reward_player)]

                def update_cb(content):
                    try:
                        data = json.loads(content)
                        if data['errcode'] != 0:
                            ERROR_MSG("update_reward_get content={}".format(content))
                    except:
                        import traceback
                        ERROR_MSG("update_reward_get Error: {}".format(traceback.format_exc()))

                utility.update_reward_get(reward_player, card_reward, [0] * len(reward_player), update_cb, reason="SportWeekly{} reward".format(self.sportId))

    def weekOver(self, days_list):
        s_t = time.localtime()
        if s_t.tm_wday in days_list:
            self.isOpen = 0
            i = 0
            for key, values in self.rank.items():
                reward = 0
                reward_list = self.base_info['reward']
                if i < len(reward_list):
                    reward = reward_list[i]
                values['reward'] = reward
                i = i + 1

    def addRoom(self, room):
        self.wait_pool[room.roomID] = room

    def dismissRoom(self, room):
        if room.roomID in self.wait_pool:
            self.wait_pool.pop(room.roomID)

    def join(self, avt_mb):
        if avt_mb.gameLeft > 0:
            self.joinSuccess(avt_mb)
        elif avt_mb.free_sport_list[self.sportId - 1] > 0:
            avt_mb.free_sport_list[self.sportId - 1] -= 1
            avt_mb.gameLeft = const.WEEK_SPORT_GAME_NUM
            self.joinSuccess(avt_mb)
        elif avt_mb.isBot:
            avt_mb.gameLeft = const.WEEK_SPORT_GAME_NUM
            self.joinSuccess(avt_mb)
        else:
            if switch.DEBUG_BASE:
                avt_mb.gameLeft = const.WEEK_SPORT_GAME_NUM
                self.joinSuccess(avt_mb)
                # callback('{"card":99, "diamond":999}')
            else:
                self.pay(avt_mb)

    def pay(self, avt_mb):
        card_cost, diamond_cost = self.base_info['cost']

        def callback(uid, content):
            avt = x42.GW.avatars.get(uid)
            if content[0] != '{':
                DEBUG_MSG(content)
                if avt:
                    avt.showTip("摩卡不足")
                return
            if avt and avt.isDestroyed == False:
                avt.gameLeft = const.WEEK_SPORT_GAME_NUM
                self.joinSuccess(avt)
            else:
                sql = "UPDATE tbl_Avatar set sm_left_games = {} where sm_userId = {}".format(const.WEEK_SPORT_GAME_NUM,
                                                                                             uid)

                def update_cb(result, num, insert_id, error):
                    if error:
                        ERROR_MSG("update gameLeft for player-{} failed!".format(uid))

                KBEngine.executeRawDatabaseCommand(sql, update_cb)

        utility.update_card_diamond(avt_mb.accountName, -card_cost, -diamond_cost,
                                    Functor.Functor(callback, avt_mb.userId), "PaoDeKuai sport:{}".format(self.sportId))

    def joinSuccess(self, avt_mb):
        for x in self.wait_pool:
            room = self.wait_pool[x]
            avt_mb.sportId = self.sportId
            avt_mb.enterRoom(x)
            if room.isFull:
                self.wait_pool.pop(x)
            break
        else:
            avt_mb.reqCreateSportRoom(self.base_info['op'], self.sportId)
        return

    def getWeeklySportRank(self, avt_mb):
        if avt_mb and avt_mb.client is not None:
            DEBUG_MSG("getWeeklySportRank {0},{1}".format(self.isOpen,
                                                          list(self.rank.values())[:self.base_info['rewardRank']]))
            rank_list = copy.deepcopy(list(self.rank.values())[:self.base_info['rewardRank']])
            avt_mb.client.gotWeeklySportRank(self.isOpen, rank_list)

    def record(self, rc_list):
        DEBUG_MSG("record SportWeekly rc_list {}".format(rc_list))
        for x in rc_list:
            avt = x42.GW.getOnlineAvatar(x['userId'])
            if avt and avt.gameLeft == 0:
                avt.weekSportScore = []
                if x['userId'] in self.rank:
                    if x["score"] > self.rank[x['userId']]["score"]:
                        self.rank[x['userId']]["score"] = x["score"]
                else:
                    x.pop('accountName', None)
                    self.rank[x['userId']] = x

        self.rank = OrderedDict(sorted(self.rank.items(), key=lambda t: t[1]["score"], reverse=True))
        DEBUG_MSG("record SportWeekly {}".format(self.rank))
        return
