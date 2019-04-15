# -*- coding: utf-8 -*-
import KBEngine
import const
from KBEDebug import *
import random
import math
import time

class iRanking:

	def __init__(self):
		pass
	# 	self.ranking = None
	# 	self.initRanking()
		
	# def initRanking(self):
	# 	KBEngine.createBaseAnywhere("Ranking", None, self.RankingCallback)

	# def RankingCallback(self, ranking, err = None):
	# 	self.ranking = ranking

	# def updateRankingInfo(self,rankingInfo):
	# 	KBEngine.globalData["GameWorld"].updateRankingInfo(rankingInfo)
	# 	
	def reqRankingInfos(self):
		KBEngine.globalData["GameWorld"].reqRankingInfos(self)

	def rebckRankingInfos(self,rankingInfos):
		DEBUG_MSG("reqRankingInfos World2 {}".format(rankingInfos))
		if self.client is not None:
			rankingInfos = [x for x in rankingInfos if x["integral"] > 0]
			self.client.pushRankingInfos(list(rankingInfos)[:10])
