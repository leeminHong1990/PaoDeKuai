# -*- coding:utf-8 -*-
import KBEngine
from KBEDebug import *
import x42
from BaseEntity import BaseEntity
import h1global
import const
import time

DAILY_DISMISS_DELAY_TIME = 60 * 60 # 延时销毁所有 sport

DAILY_TIME = {
	("10:30:00", "23:00:00"): [0, 1, 2, 3, 4, 6],
	("19:00:00", "22:00:00"): [0, 1, 2, 3, 4, 6]
}


class SportDailyStub(BaseEntity):

	def __init__(self):
		BaseEntity.__init__(self)
		self.sportDict = {}
		table_daily_sports = h1global.rc.sportDict[const.SPORT_DAILY]
		for k in table_daily_sports:
			DEBUG_MSG(table_daily_sports[k])
			sportId = table_daily_sports[k]['id']
			self.sportDict[sportId] = KBEngine.createBaseLocally("SportDaily", {'sportId': sportId})

		x42.SportDailyStub = self

	def join(self, avt_mb, sportId):
		if sportId in self.sportDict:
			sport_info = h1global.rc.sportDict[const.SPORT_DAILY][sportId]
			t = time.localtime()
			for k in sport_info['time']:
				week_days = sport_info['time'][k]

				s_t = time.strptime('{}-{}-{} {}'.format(t.tm_year, t.tm_mon, t.tm_mday, k[0]), '%Y-%m-%d %H:%M:%S')
				e_t = time.strptime('{}-{}-{} {}'.format(t.tm_year, t.tm_mon, t.tm_mday, k[1]), '%Y-%m-%d %H:%M:%S')

				if t.tm_wday in week_days and time.mktime(s_t) < time.time() < time.mktime(e_t):
					self.sportDict[sportId].join(avt_mb)
					break
			else:
				avt_mb.client.showTip("不在实时赛开启时间段内")
		else:
			avt_mb.client.showTip("找不到赛事")

	def record(self, sportId, rc_list):
		sport = self.sportDict.get(sportId)
		if sport is None:
			return
		sport.record(rc_list)

	def addRoom(self, room):
		sport = self.sportDict.get(room.sportId)
		if sport is None:
			return
		sport.addRoom(room)

	def dismissRoom(self, room):
		sport = self.sportDict.get(room.sportId)
		if sport is None:
			return
		sport.dismissRoom(room)
