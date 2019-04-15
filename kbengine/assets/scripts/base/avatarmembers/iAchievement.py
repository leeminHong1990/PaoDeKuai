# -*- coding: utf-8 -*-

import time
import KBEngine
from KBEDebug import *
import const
import math
import utility as util

class iAchievement(object):
	""" 签到成就相关 """

	def __init__(self):
		pass

	def initAchievement(self):
		self.client and self.client.pushSignInNum(self.sign_in_days)

	def signIn(self):
		now = time.time()
		res = util.is_same_day(self.sign_in_ts, now)
		if not res:
			self.sign_in_days += 1
			self.sign_in_ts = now
			# if self.sign_in_days >= const.SIGN_IN_ACHIEVEMENT_DAY:
			# 	self.addCards(const.SIGN_IN_ACHIEVEMENT_NUM, reason="signIn")
			# 	self.sign_in_days = 0
			self.client and self.client.pushSignInNum(self.sign_in_days)
		else:
			self.client and self.client.signInFailed()

	def reqSignInfo(self):
		KBEngine.globalData["GameWorld"].reqSignInfo(self)

	def pushSignInfo(self,SignInfo):
		DEBUG_MSG("reqRankingInfos World2 {}".format(SignInfo))
		self.client and self.client.pushSignInfo(SignInfo)
