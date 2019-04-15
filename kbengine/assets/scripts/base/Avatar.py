# -*- coding: utf-8 -*-
import json

import KBEngine
import random
import time
import math
import h1global
import const
from LoggerManager import LoggerManager
from KBEDebug import *
from interfaces.GameObject import GameObject
from avatarmembers.iBase import iBase
from avatarmembers.iGroup import iGroup
from avatarmembers.iRoomOperation import iRoomOperation
from avatarmembers.iRecordOperation import iRecordOperation
from avatarmembers.iAchievement import iAchievement
from avatarmembers.iRanking import iRanking
from avatarmembers.iSportOperation import iSportOperation
import utility
from BaseEntity import BaseEntity


class Avatar(KBEngine.Proxy,
             GameObject,
             iBase,
             BaseEntity,
             iGroup,
             iRoomOperation,
             iRecordOperation,
             iAchievement,
             iRanking,
             iSportOperation):
    """
    角色实体
    """

    def __init__(self):
        KBEngine.Proxy.__init__(self)
        BaseEntity.__init__(self)

        self.logger = LoggerManager()
        self.logger.set_user_info({"entity_id": self.id, "account_id": self.accountName,
                                   "avatar_uuid": self.uuid, "avatar_name": self.name, "avatar_user_id": self.userId})

        GameObject.__init__(self)
        iBase.__init__(self)
        iRoomOperation.__init__(self)
        iRecordOperation.__init__(self)
        iAchievement.__init__(self)
        iGroup.__init__(self)
        iRanking.__init__(self)
        iSportOperation.__init__(self)

        self.accountEntity = None
        self._destroyTimer = 0
        self.is_reconnect = False
        self.ip = '0.0.0.0'
        self.location = ""
        self.lat = ""
        self.lng = ""
        self.isBot = 1 if 'bot_' == self.accountName[:4] else 0
        self.uuid != 0 and KBEngine.globalData["GameWorld"].addPlayer2Pid(self.userId, self.uuid, self.name, self.id)

    def getAvatarInfo(self):

        length = len(self.rank)
        if length > const.DAILY_RECORT_INFO_NUM:
            new_h = []
            for s in self.rank:
                new_h.append(s)
            self.rank = new_h[length - const.DAILY_RECORT_INFO_NUM:length]

        info = {
            "uuid": self.uuid,
            "uid": self.userId,
            "cards": self.cards,
            "ip": self.ip,
            "id_name": self.id_name,
            "id_number": self.id_number,
            "daily_rank": self.rank
        }
        return info

    '''初始化Avatar'''

    def initAvatar(self):
        self.extract_ip()
        iBase.initBase(self)
        iGroup.initGroup(self)
        iAchievement.initAchievement(self)
        iRecordOperation.initRecord(self)
        iSportOperation.initSportOperation(self)

        self.initFinish()
        # KBEngine.globalData['GameWorld'].addOneUser(self, self.userId)
        if self.inRoom:
            # 如果需要断线重连, 则进行处理
            self.client and self.client.beginGame(1)
            self.process_reconnection()
            try:
                self.room.notify_player_online_status(self.userId, 1)
            except:
                pass
            self.is_reconnect = False
        else:
            self.client and self.client.beginGame(0)

        # 全服公告
        world_notice = KBEngine.globalData["GameWorld"].world_notice
        if world_notice and world_notice != '#':
            self.recvWorldNotice(world_notice, 3)

        self.loginCheckDailyTask()
        self.hourlyTimer = None
        self.setTimerByHour()

    def loginCheckDailyTask(self):
        ttime = time.time()
        if not h1global.isSameDay2(ttime, self.lastDayResetTime):
            tlocaltime = time.localtime()
            self.refreshOnResetDay(ttime, tlocaltime)

        if not h1global.isSameWeek(ttime, self.lastWeekResetTime):
            self.lastWeekResetTime = ttime
            self.integral = 0

    # 定时器 每整点调用一次
    def setTimerByHour(self):
        offset = 0
        ctime = time.time()
        ctime_s = list(time.localtime())
        if ctime_s[4] != 0 or ctime_s[5] != 0:
            ctime_s[4] = 0
            ctime_s[5] = 0
            atime = time.mktime(time.struct_time(ctime_s))
            offset = 60 * 60 - (ctime - atime)

        if self.hourlyTimer is not None:
            self.cancel_timer(self.hourlyTimer)
            self.hourlyTimer = None
        self.hourlyTimer = self.add_repeat_timer(math.ceil(offset) + random.randint(0, 20), 60 * 60,
                                                 self.hourly_timer_callback)
        return

    def extract_ip(self):
        """ 抽取ip """
        if getattr(self, 'client', None):
            s = str(self.client)
            s = s.split(',')
            s = s[-1]
            s = s.split(':')
            self.ip = s[1]

    def refreshOnResetDay(self, ttime, tlocaltime):
        '''刷新每日任务'''
        iSportOperation.refreshSport(self)
        self.lastDayResetTime = ttime
        return

    def logout(self):
        '''注销'''
        self.client and self.client.closeClient()
        self.destroySelf()
        self.logger.log("LogOutInfo", {"logout_type": "注销"})

    def initFinish(self):
        # DEBUG_MSG("game_history = {}".format(self.game_history))
        # DEBUG_MSG("game_history = {}".format(type(self.game_history)))
        # for r in self.game_history:
        #     DEBUG_MSG("game_history {0} ========== {1}".format(r, type(r)))
        if self.client:
            self.client.pushGameRecordList([r for r in self.game_history])
            self.client.pushGameLeft(self.gameLeft)

        self.lastLoginTime = time.time()
        DEBUG_MSG("Avatar[%i] initFinish, %f" % (self.id, self.lastLoginTime))
        return

    def updateUserInfo(self, info):
        name = info['nickname']
        self.name = utility.filter_emoji(name)
        info['nickname'] = self.name
        self.head_icon = info['head_icon']
        self.sex = info['sex']
        KBEngine.globalData["GameWorld"].updateCacheDict(self.userId, {'name': self.name, 'head_icon': self.head_icon,
                                                                       'sex': self.sex})
        DEBUG_MSG("Avatar client call updateUserInfo:{}".format(info))

    def updateRealNameInfo(self, info):
        self.id_name = info['id_name']
        self.id_number = info['id_number']
        self.client and self.client.pushAvatarInfo(self.getAvatarInfo())
        DEBUG_MSG("Avatar client call updateRealNameInfo:{}".format(info))

    def hourly_timer_callback(self):
        ttime = time.time()
        tlocaltime = time.localtime()
        ctime_s = list(tlocaltime)
        DEBUG_MSG("hourly_timer_callback 00 = {0}".format(ctime_s))

        # 每日刷新
        if ctime_s[3] == const.SERVER_REFRESH_TIME[0]:
            self.refreshOnResetDay(ttime, tlocaltime)

        # 每周一刷新
        if ctime_s[6] == const.SERVER_REFRESH_TIME[0]:
            if not h1global.isSameDay2(ttime, self.lastWeekResetTime):
                self.lastWeekResetTime = ttime
                self.integral = 0
            return


    def onEnterWorld(self):
        """
        KBEngine method.
        这个entity已经进入世界了
        """
        DEBUG_MSG("Avatar[%i] onEnterWorld. mailbox:%s" % (self.id, self.client))
        return

    def onLeaveWorld(self):
        """
        KBEngine method.
        这个entity将要离开世界了
        """
        DEBUG_MSG("Avatar[%i] onLeaveWorld. mailbox:%s" % (self.id, self.client))
        return

    def onEntitiesEnabled(self):
        """
        KBEngine method.
        该entity被正式激活为可使用， 此时entity已经建立了client对应实体， 可以在此创建它的
        cell部分。
        """
        DEBUG_MSG("Avatar[%i] entities enable. mailbox:%s" % (self.id, self.client))
        KBEngine.globalData["GameWorld"].loginToSpace(self)
        if self.isBot:
            KBEngine.globalData["GameWorld"].addOneRobot(self)
        self.logger.log("Login", {})

        # 将延时的timer关掉
        if self._destroyTimer:
            self.delTimer(self._destroyTimer)

        self.initAvatar()

    def onGetCell(self):
        """
        KBEngine method.
        entity的cell部分实体被创建成功
        """
        DEBUG_MSG('Avatar::onGetCell: %s' % self.cell)

    def destroySelf(self):
        """ 准备销毁自身, 但需要根据是否在房间来做断线重连 """
        self.lastLoginTime = time.time()
        DEBUG_MSG("Avatar[%i] destroySelf, %f" % (self.id, self.lastLoginTime))

        if self.inRoom:
            # 如果已经在房间中并且房间游戏已经开始, 则不销毁avatar, 等待其断线重连
            self.is_reconnect = True
            # 防止有什么trace导致登录不了
            try:
                self.room.notify_player_online_status(self.userId, 0)
            except:
                pass
            return False

        # 如果帐号ENTITY存在 则也通知销毁它
        # DEBUG_MSG("Avatar{0} want to destroy account {1}".format(self.id, self.accountEntity))
        if self.accountEntity is not None:
            self.accountEntity.activeCharacter = None
            self.accountEntity.onClientDeath()
            self.accountEntity = None

        DEBUG_MSG("self.room is None, We will destroy")
        # 销毁world中的avatar
        KBEngine.globalData["GameWorld"].logoutSpace(self.userId)
        if self.isBot == 1:
            KBEngine.globalData["GameWorld"].removeOneRobot(self.userId)

        self.logger.log("LogOut", {})
        self.uuid != 0 and KBEngine.globalData['GameWorld'].delPlayer2Pid(self.userId, self.uuid, self.name, self.id)
        DEBUG_MSG("Avatar[%i].destroyBase")
        self.clear_timers()
        # 销毁base
        if not self.isDestroyed:
            self.destroy()
        return True

    def destroySelfFromAccount(self):
        DEBUG_MSG("Avatar[%i] userId[%d] destroySelfFromAccount, %f" % (self.id, self.userId, self.lastLoginTime))

        if self.inRoom:
            # 如果已经在房间中并且房间游戏已经开始, 则不销毁avatar, 等待其断线重连
            self.is_reconnect = True
            # 防止有什么trace导致登录不了
            try:
                self.room.notify_player_online_status(self.userId, 0)
            except:
                pass
            return False

        if self.accountEntity is not None:
            self.accountEntity.activeCharacter = None
            self.accountEntity = None

        DEBUG_MSG("self.room is None, We will destroy")
        # 销毁world中的avatar
        KBEngine.globalData["GameWorld"].logoutSpace(self.userId)

        self.logger.log("LogOut", {})

        DEBUG_MSG("Avatar[%i].destroyBase")
        self.clear_timers()
        # 销毁base
        if not self.isDestroyed:
            self.destroy()
        return True

    def onClientDeath(self):
        """
        KBEngine method.
        entity丢失了客户端实体
        """
        DEBUG_MSG("Avatar[%i] onClientDeath:" % self.id)
        # 防止正在请求创建cell的同时客户端断开了， 我们延时一段时间来执行销毁cell直到销毁base
        # 这段时间内客户端短连接登录则会激活entity
        # 这里有点问题, 现在直接销毁
        self.destroySelf()
        self.logger.log("LogOutInfo", {"logout_type": "客户端丢失"})

    def onClientGetCell(self):
        """
        KBEngine method.
        客户端已经获得了cell部分实体的相关数据
        """
        DEBUG_MSG("Avatar[%i].onClientGetCell:%s" % (self.id, self.client))

    def onDestroyTimer(self, tid, tno):
        DEBUG_MSG("Avatar::onDestroyTimer: %i, tid:%i, arg:%i" % (self.id, tid, tno))
        self.destroySelf()

    def setNameByClient(self, name):
        self.name = name[1:]
        self.cell.setName(self.name)
        # add to Cache
        KBEngine.globalData['GameWorld'].updateCacheDict(self.userId, {'name': self.name})

    def setGenderByClient(self, sex):
        self.sex = sex
        self.cell.setGender(sex)
        # add to Cache
        KBEngine.globalData['GameWorld'].updateCacheDict(self.userId, {'sex': self.sex})
        return

    def getNameByClient(self, uuid):
        KBEngine.globalData['GameWorld'].sendNameToClient(self, uuid)
        return

    def insertRobotFail(self):
        KBEngine.globalData["GameWorld"].insertRobotFail(self.id)

    def setDeviceInfo(self, deviceInfoStr):
        deviceInfoList = deviceInfoStr.split('_')
        if len(deviceInfoList) == 9:
            deviceInfo = {'ip': deviceInfoList[0], 'device_model': deviceInfoList[1], 'os_name': deviceInfoList[2],
                          'os_ver': deviceInfoList[3], 'udid': deviceInfoList[4], \
                          'app_ver': deviceInfoList[5], 'network': deviceInfoList[6],
                          'device_height': deviceInfoList[7], 'device_width': deviceInfoList[8]}
            self.logger.set_device_info(deviceInfo)

    def setUserId(self, userId):
        self.userId = userId

    def addCards(self, num, reason='proxy_charge'):
        if num < 0:
            return False
        self.cards += num
        record_str = 'player{0}-{1} addCards by {2}'.format(self.userId, self.name, reason)
        INFO_MSG(record_str)
        self.client and self.client.pushRoomCard(self.cards)
        return True

    def useCards(self, num, reason='create_room'):
        if self.cards < num:
            return False
        # 免费时间内, 不扣房卡
        if KBEngine.globalData["GameWorld"].free_play:
            return

        self.cards -= num
        KBEngine.globalData["GameWorld"].total_cards += num
        record_str = 'player{0}-{1} use {2} cards by {3}'.format(self.userId, self.name, num, reason)
        INFO_MSG(record_str)
        self.client and self.client.pushRoomCard(self.cards)
        return True

    def showTip(self, tip):
        DEBUG_MSG("call showTip: {}".format(tip))
        if getattr(self, 'client', None):
            self.client.showTip(tip)

    def showGPS(self):
        if getattr(self, 'client', None):
            self.client.showGPS()

    def recvWorldNotice(self, notice_text, num):
        """ 全服公告 """
        if notice_text and self.client:
            self.client.recvWorldNotice(notice_text, int(num))
        else:
            DEBUG_MSG("recvWorldNotice: {}".format(notice_text))

    def userRankingInfo(self, userid):
        if userid == self.userId:
            rankingInfo = {
                'userid': self.userId,
                'uuid': self.uuid,
                'head_icon': self.head_icon,
                'name': self.name,
                'integral': self.integral
            }
            KBEngine.globalData['GameWorld'].updateRankingInfo(rankingInfo)
            DEBUG_MSG("Avatar client call setIntegral:{}".format(self.integral))

    @property
    def gameLeft(self):
        return self.left_games

    @gameLeft.setter
    def gameLeft(self, value):
        self.left_games = value
        self.client and self.client.pushGameLeft(value)

    def giveUpWeeklySport(self):
        self.gameLeft = 0
        self.weekSportScore = []
