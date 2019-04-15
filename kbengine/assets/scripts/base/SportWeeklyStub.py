# -*- coding:utf-8 -*-

import KBEngine
from KBEDebug import *
from BaseEntity import BaseEntity
from executor import Executor
import h1global
import x42
import const
import time

class SportWeeklyStub(BaseEntity):

	def __init__(self):
		BaseEntity.__init__(self)
		self.sportWeeklyDict = {}
		self.executor = Executor()
		self.loadWeeklyStubs()
		x42.SportWeeklyStub = self

	# step 1
	def loadWeeklyStubs(self):
		weekly_list = list(self.sportWeeklyList)
		if len(weekly_list) == 0:
			self.loadFinish()
			return

		self.executor.set('s_load', 0)
		self.executor.set('s_load_over', 0)

		self.executor.add_condition(lambda: self.executor.get('s_load_over') >= 1, [self.loadFinish, []])
		self.executor.add_condition(lambda: self.executor.get('s_load') >= len(weekly_list), [self.executor.inc1, ["s_load_over"]])

		for id in weekly_list:
			def createSportWeekly(baseRef, databaseID, wasActive):
				self.executor.inc1("s_load")
				if baseRef:
					self.sportWeeklyDict[baseRef.sportId] = baseRef
				else:
					if databaseID in self.sportWeeklyList:
						self.sportWeeklyList.remove(databaseID)
			KBEngine.createBaseFromDBID("SportWeekly", id, createSportWeekly)

	# step 2
	def loadFinish(self):
		# 根据表的变化而变化
		table_weekly_sports = h1global.rc.sportDict[const.SPORT_WEEKLY]
		for sportId in self.sportWeeklyDict:
			if sportId not in table_weekly_sports:
				self.sportWeeklyDict.pop(sportId)
				self.sportWeeklyDict[sportId].destroyself(True)

		newSportIdList = []
		for id in table_weekly_sports:
			if id not in self.sportWeeklyDict:
				newSportIdList.append(id)
		self.createSportWeekly(newSportIdList)

	# step 3
	def createSportWeekly(self, newSportIdList):
		if len(newSportIdList) == 0:
			self.createFinish()
			return
		self.executor.set('s_create', 0)
		self.executor.set('s_create_over', 0)

		self.executor.add_condition(lambda: self.executor.get('s_create_over') >= 1, [self.createFinish, []])
		self.executor.add_condition(lambda: self.executor.get('s_create') >= len(newSportIdList), [self.executor.inc1, ["s_create_over"]])

		for id in newSportIdList:
			sport = KBEngine.createBaseLocally("SportWeekly", {'sportId':id})
			self.sportWeeklyDict[id] = sport
			if sport:
				sport.writeToDB(self._onSportWeeklySaved)

	def _onSportWeeklySaved(self, isSaved, baseRef):
		self.executor.inc1('s_create')
		return

	# step 4 over
	def createFinish(self):
		DEBUG_MSG("create sportWeekly Finish")
		return

	def join(self, avt_mb, sportId):
		if sportId in self.sportWeeklyDict:
			sport_info = h1global.rc.sportDict[const.SPORT_WEEKLY][sportId]
			t = time.localtime()
			for k in sport_info["time"]:
				week_days = sport_info["time"][k]

				s_t = time.strptime('{}-{}-{} {}'.format(t.tm_year, t.tm_mon, t.tm_mday, k[0]), '%Y-%m-%d %H:%M:%S')
				e_t = time.strptime('{}-{}-{} {}'.format(t.tm_year, t.tm_mon, t.tm_mday, k[1]), '%Y-%m-%d %H:%M:%S')
				if t.tm_wday in week_days and time.mktime(s_t) < time.time() < time.mktime(e_t):
					self.sportWeeklyDict[sportId].join(avt_mb)
					break
			else:
				avt_mb.client.showTip("不在周赛事开启时间段内")
		else:
			avt_mb.client.showTip("找不到该赛事")


	def getWeeklySportRank(self, avt_mb, sportId):
		if sportId in self.sportWeeklyDict:
			self.sportWeeklyDict[sportId].getWeeklySportRank(avt_mb)
		else:
			ERROR_MSG("getWeeklySportRank error weekly sport:{}".format(sportId))

	def record(self, sportId, rc_list):
		if sportId in self.sportWeeklyDict:
			self.sportWeeklyDict[sportId].record(rc_list)
		else:
			ERROR_MSG("record not found weekly sport:{}".format(sportId))


	def addRoom(self, room):
		if room.sportId in self.sportWeeklyDict:
			self.sportWeeklyDict[room.sportId].addRoom(room)
		else:
			ERROR_MSG("addRoom not found weekly sport:{}".format(room.sportId))

	def dismissRoom(self, room):
		if room.sportId in self.sportWeeklyDict:
			self.sportWeeklyDict[room.sportId].dismissRoom(room)
		else:
			ERROR_MSG("deleteRoom not found weekly sport:{}".format(room.sportId))