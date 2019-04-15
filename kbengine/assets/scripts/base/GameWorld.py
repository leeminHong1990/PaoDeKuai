# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
import Functor
import const
import math
import random
import time
import h1global
import switch

from urllib.parse import unquote
from LoggerManager import LoggerManager
from interfaces.GameObject import GameObject
from worldmembers.iFriends import iFriends
from worldmembers.iMail import iMail
from worldmembers.iGameManager import iGameManager
from worldmembers.iGroupManager import iGroupManager
from worldmembers.iRoomManager import iRoomManager
from worldmembers.iRoomRecord import iRoomRecord
from worldmembers.iPay import iPay
from worldmembers.iCache import iCache
from worldmembers.iBot import iBot
from BaseEntity import BaseEntity
import x42
import table_name

BROADCAST_NUM = 100

INTERVAL_TIME = 60 * 60

class GameWorld(GameObject,
				iBot,
				iCache,
				iGameManager,
				iGroupManager,
				iRoomManager,
				iRoomRecord,
				iPay,
				BaseEntity,
				):
	"""
	这是一个脚本层封装的空间管理器
	KBEngine的space是一个抽象空间的概念，一个空间可以被脚本层视为游戏场景、游戏房间、甚至是一个宇宙。
	"""
	def __init__(self):
		iBot.__init__(self)
		iGameManager.__init__(self)
		iCache.__init__(self)
		iGroupManager.__init__(self)
		iRoomManager.__init__(self)
		iRoomRecord.__init__(self)
		BaseEntity.__init__(self)

		self.dbid = self.databaseID
		self.avatars = {}

		self.logger = LoggerManager()

		KBEngine.Base.__init__(self)
		GameObject.__init__(self)

		self.broadcastQueue = []
		if self.serverStartTime == 0:
			self.serverStartTime = time.time()
		
		self.world_notice = '#'
		# 不扣房卡的开关, 金钱之源, 慎重开启
		self.free_play = False
		# 开服之后的房卡消耗累积
		self.total_cards = 0
		
		self.rankCount = 0

		x42.GW = self
		self.initGameWorld()
		return

	def initGameWorld(self):
		self.initGroupManager()

		ttime = time.time()
		tlocaltime = time.localtime()
		DEBUG_MSG("initGameWorld 1 = {0},{1}".format(ttime,self.lastWeekResetTime))
		if not h1global.isSameDay2(ttime, self.lastWeekResetTime):
			DEBUG_MSG("initGameWorld 2 = {0},{1}".format(ttime,self.lastWeekResetTime))
			self.refreshOnResetDay()

		self.hourlyTimer = None
		self.setTimerByHour()
		return

	def getServerStartTime(self):
		return self.serverStartTime

		# 定时器 每整点调用一次
	def setTimerByHour(self):
		offset = 0
		ctime = time.time()
		ctime_s = list(time.localtime())
		if ctime_s[4] != 0 or ctime_s[5] != 0:
			ctime_s[4] = 0
			ctime_s[5] = 0
			atime = time.mktime(time.struct_time(ctime_s))
			offset = 60*60 - (ctime - atime)

		if self.hourlyTimer is not None:
			self.cancel_timer(self.hourlyTimer)
			self.hourlyTimer = None
		self.hourlyTimer = self.add_repeat_timer(math.ceil(offset), 60 * 60, self.refreshOnResetDay)
		return
	

	def refreshOnResetDay(self):
		ttime = time.time()
		tlocaltime = time.localtime()
		ctime_s = list(tlocaltime)
		DEBUG_MSG("refreshOnResetDay 0 = {0}".format(ctime_s))
		server_refresh = const.SERVER_REFRESH_TIME
		if ctime_s[6] == server_refresh[0]:
			DEBUG_MSG("refreshOnResetDay 1 = {0},{1}".format(ttime,self.lastWeekResetTime))
			if not h1global.isSameDay2(ttime, self.lastWeekResetTime):
				DEBUG_MSG("refreshOnResetDay 1 = {0},{1}".format(ttime,self.lastWeekResetTime))
				self.lastWeekResetTime = ttime
				self.rankingInfos = []

		if ctime_s[3] == 12:
			self.rankCount = 0
			self.genGlobalRankBotData()

		return

			
	def loginToSpace(self, avatarEntity):
		"""
		defined method.
		某个玩家请求登陆到某个space中
		"""
		self.avatars[avatarEntity.userId] = avatarEntity
	
	def logoutSpace(self, avatarID):
		"""
		defined method.
		某个玩家请求登出这个space
		"""
		if avatarID in self.avatars:
			del self.avatars[avatarID]

	def runFuncOnAllPlayers(self, num, funcs, *args):
		alist = list(self.avatars.keys())
		bn = 0
		en = BROADCAST_NUM if len(alist) > BROADCAST_NUM else len(alist)
		self.broadcastQueue.append(Functor.Functor(self.runFuncOnSubPlayers, bn, en, alist, num, funcs, *args))
		self.add_timer(0, self.broadcastFunc)


	def broadcastFunc(self):
		if self.broadcastQueue:
			func = self.broadcastQueue.pop()
			func()
			if len(self.broadcastQueue) > 0:
				self.add_timer(0.1, self.broadcastFunc)
				return

	def runFuncOnSubPlayers(self, bn, en, alist, num, funcs, *args):
		def getFuncInAvatar(avatar, num, funcs):
			if avatar is None:
				ERROR_MSG("GameWorld[%i].runFuncOnAllPlayers:avatar is None" % (self.id))
				return
			curFunc = avatar
			for count in range(num):
				curFunc = getattr(curFunc, funcs[count])
				if curFunc is None:
					ERROR_MSG("GameWorld[%i].runFuncOnAllPlayers: %s, %s is None" % (self.id, str(funcs), funcs[count]))
					return None
			return curFunc

		for i in range(bn, en):
			if alist[i] not in self.avatars or alist[i] in self.bots:
				continue
			avatarMailbox = self.avatars[alist[i]]
			curFunc = getFuncInAvatar(avatarMailbox, num, funcs)
			if curFunc is not None:
				curFunc(*args)

		if en >= len(alist):
			return

		bn = en
		en = (bn + BROADCAST_NUM) if len(alist) > (bn + BROADCAST_NUM) else len(alist)
		self.broadcastQueue.append(Functor.Functor(self.runFuncOnSubPlayers, bn, en, alist, num, funcs, *args))
		return

	def genGlobalBornData(self, accountMailbox):
		if switch.DEBUG_BASE:
			#  测试环境 玩家userID
			self.userCount = self.userCount + 1
			bornData = {
				"userId": self.userCount + 1134701,
			}
		else:
			#  比赛场机器人userID
			self.botCount += 1
			bornData = {
				"userId" : self.botCount + 2134701,
			}
		accountMailbox.reqCreateAvatar(bornData)

	def callMethodOnAllAvatar(self, method_name, *args):
		for mb in self.avatars.values():
			func = getattr(mb, method_name, None)
			if func and callable(func):
				self.broadcastQueue.append(lambda avt_mb=mb: getattr(avt_mb, method_name)(*args))

		self.add_timer(0.1, self.broadcastFunc)


	def externalDataDispatcher(self, dataStr):
		DEBUG_MSG("externalDataDispatcher data = {}".format(dataStr))

		try:
			dataStr = unquote(dataStr)
			(dataStr, op_code) = dataStr.split("&9op=")
			op = int(op_code)
			if (op == 1):
				(dataStr, free) = dataStr.split("free=")
				free = int(free)
				self.free_play = (free == 1)
				DEBUG_MSG("set free_play = {0}".format(free))
			elif (op == 2):
				(dataStr, content) = dataStr.split("&2content=")
				(dataStr, count) = dataStr.split("1count=")
				count = int(count)
				if content != '#':
					DEBUG_MSG("call recvWorldNotice content = {0}, count = {1}".format(content, count))
					self.callMethodOnAllAvatar("recvWorldNotice", content, count)
			elif (op == 3):
				(dataStr, proxy) = dataStr.split("&3proxy=")
				(dataStr, uid) = dataStr.split("&2uid=")
				uid = int(uid)
				(dataStr, cards) = dataStr.split("1cards=")
				cards = int(cards)
				self.userPaySuccess([proxy, uid, cards])
			else:
				DEBUG_MSG("Error: externalDataDispatcher, no this op={}".format(op_code))
		except:
			DEBUG_MSG("Error: externalDataDispatcher exception {}".format(dataStr))

	def updateRankingInfo(self,rankingInfo):

		flag = 0
		for i, rank in enumerate(self.rankingInfos):
			DEBUG_MSG("userid{0},{1},{2}".format(self.rankingInfos[i]["userid"],rank["userid"],rankingInfo["userid"]))
			if rank["userid"] == rankingInfo["userid"]:
				self.rankingInfos[i]["integral"] = rankingInfo["integral"]
				flag = 1
				break
		if len(self.rankingInfos) == 0 or (flag != 1 and len(self.rankingInfos) < 15) \
		or (flag != 1 and len(self.rankingInfos) >= 15 and self.rankingInfos[-1]["integral"] < rankingInfo["integral"]):
			self.rankingInfos.append(rankingInfo)

		self.rankingInfos=sorted(self.rankingInfos,key=lambda x:x["integral"],reverse = True)

		length = len(self.rankingInfos)
		if length > 15:
			new_h = []
			for s in self.rankingInfos:
				new_h.append(s)
			self.rankingInfos = new_h[0:15]

	def reqRankingInfos(self,avt_mb):
		DEBUG_MSG("reqRankingInfos World {}".format(self.rankingInfos))
		avt_mb.rebckRankingInfos(self.rankingInfos)
		#self.client and self.client.pushRankingInfos(self.rankingInfos)
		
	def reqSignInfo(self,avt_mb):
		avt_mb.pushSignInfo(self.signInfo)

	def initSignInfo(self):
		self.signInfo ={
			'day1': 1,
			'day2': 2,
			'day3': 3,
			'day4': 4,
			'day5': 5,
			'day6': 6,
			'day7': 7
		}

	def getRankMaxAndMinScore(self):
		length = len(self.rankingInfos)
		if length <= 0:
			minScore = 0
			maxScore = 100
		else:
			maxScore = self.rankingInfos[0]["integral"]
			minScore = self.rankingInfos[-1]["integral"]

		return minScore,maxScore

	def genGlobalRankBotData(self):
		minScore,maxScore = self.getRankMaxAndMinScore()
		num = const.RANK_BOT_NUM
		while num > 0:
			#  排行榜机器人userID
			self.rankCount = self.rankCount + 1
			userId = self.rankCount + 8134701

			lastname = table_name.lastnameTbl[random.randint(0, table_name.lastnameNum - 1)]
			firstname = table_name.firstnameTbl[random.randint(0, table_name.firstnameNum - 1)]
			name = lastname + firstname
			iconUrl = "http://mypdk.game918918.com/portraits/" + str(random.randint(1, 50)) + ".png"
			integral = random.randint(minScore,maxScore + 200)
			rankingInfo = {
			    'userid': userId,
			    'uuid': KBEngine.genUUID64(),
			    'head_icon': iconUrl,
			    'name': name,
			    'integral': integral
			}
			DEBUG_MSG("genGlobalRankBotData00000000{}".format(rankingInfo))
			self.updateRankingInfo(rankingInfo)
			num = num - 1





			



