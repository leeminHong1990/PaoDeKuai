# -*- coding: utf-8 -*-
import KBEngine
import random
import time
import math
import const
import switch
import h1global
from KBEDebug import *

class iBase:
	"""
	服务端游戏对象的基础接口类
	"""
	def __init__(self):
		return
		
	'''初始化'''
	def initBase(self):
		# ttime = time.time()
		# tlocaltime = time.localtime()
		# DEBUG_MSG("initBase 1 = {0},{1}".format(ttime,self.lastWeekResetTime))
		# if not h1global.isSameDay2(ttime, self.lastWeekResetTime):
		# 	self.refreshLogin(ttime, tlocaltime)
		# 	DEBUG_MSG("initBase 2 = {0},{1}".format(ttime,self.lastWeekResetTime))

		self.client and self.client.pushAvatarInfo(self.getAvatarInfo())
		return

	def queryAllChat(self, mid, rid):
		KBEngine.globalData["GameWorld"].queryAllChat(self, mid, rid)
		return

	def publishMainChat(self, content):
		KBEngine.globalData["GameWorld"].publishMainChat(self.uuid, content)
		return

	def responseMainChat(self, mid, content):
		KBEngine.globalData["GameWorld"].responseMainChat(self.uuid, mid, content)
		return

	def addDiamondByClient(self):
		if switch.PUBLISH_VERSION != 0 or switch.DEBUG_BASE != 1:
			return
		self.addFreeDiamond(1000, const.CLIENT_OPERATION)

	def sendWorldChannelChat(self, content):
		content = content[1:]
		if switch.PUBLISH_VERSION == 0 and switch.DEBUG_BASE == 1:
			if content[0] == "$":
				if len(content) > 14 and content[1:13].lower() == "addmercenary":
					mercenaryId = int(content[14:])
					mercenaryList = []
					mercenaryList.append(mercenaryId)
					self.addMercenaryList(mercenaryList)
				if len(content) > 8 and content[1:7].lower() == "addexp":
					exp = int(content[8:])
					self.addCurTroopExp(exp)
			return 
		return