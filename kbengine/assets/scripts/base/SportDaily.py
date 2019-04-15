# -*- coding:utf-8 -*-

import KBEngine
from  KBEDebug import *
from BaseEntity import BaseEntity
from collections import OrderedDict
import table_sports
import x42
import time
import h1global
import const
import random
import Functor
import switch
import utility
import json
import table_name
import copy

SPORT_DAILY_ROOMS 		= 3			# 参与排名房间数量
SPORT_DAILY_RANK_TIME	= 60		# 从最后一个记录开始倒计时60秒 内无其他记录则自动补齐机器人记录

# 实时赛
class SportDaily(BaseEntity):

	def __init__(self):
		BaseEntity.__init__(self)
		self.base_info = h1global.rc.sportDict[const.SPORT_DAILY][self.sportId]
		self.tem_list  = []
		self.history_list = []
		self.wait_pool = OrderedDict()
		self.record_list = []
		self.Timer_list = []
		self.rankingId  = 0
		self.botUserId  = 0
		for x in range(const.DAILY_SPORT_PLAYER_ROUND):
			self.record_list.append([])
			self.Timer_list.append(None)
			self.tem_list.append([])

		# 活动开始重置排行榜
		s_t = time.localtime()
		for t_p in self.base_info["time"]:
			# 赛事开始
			h, m, s = t_p[0].split(":")
			d_t = ((int(h) * 3600 + int(m) * 60 + int(s)) - (
				s_t.tm_hour * 3600 + s_t.tm_min * 60 + s_t.tm_sec) + 86400) % 86400
			self.add_repeat_timer(d_t, 24* 3600, Functor.Functor(self.refreshRank, self.base_info["time"][t_p]))
			b_t = (int(h) * 3600 + int(m) * 60 + int(s)) - (s_t.tm_hour * 3600 + s_t.tm_min * 60 + s_t.tm_sec)

			h, m, s = t_p[1].split(":")
			l_t = (int(h) * 3600 + int(m) * 60 + int(s)) - (s_t.tm_hour * 3600 + s_t.tm_min * 60 + s_t.tm_sec)

			if b_t < 0 and l_t > 0:
				self.refreshRank(self.base_info["time"][t_p])

		return

	def refreshRank(self, days_list):
		s_t = time.localtime()
		if s_t.tm_wday in days_list:
			self.tem_list = []
			self.history_list = []
			self.wait_pool = OrderedDict()
			self.record_list = []
			self.Timer_list = []
			self.rankingId = 0
			self.botUserId = 0
			for x in range(const.DAILY_SPORT_PLAYER_ROUND):
				self.record_list.append([])
				self.Timer_list.append(None)
				self.tem_list.append([])


	def refreshHistory(self):
		DEBUG_MSG("refreshHistory")
		for temp in range(len(self.history_list) - 1, -1, -1):
			if self.record(self.history_list[temp],1):
				self.history_list.pop(temp)

	def join(self, avt_mb):
		def callback(content):
			DEBUG_MSG("sport {} cards response: {}".format(self.sportId, content))
			if content[0] != '{':
				DEBUG_MSG(content)
				return
			
			data = json.loads(content)
			card_cost, diamond_cost = self.base_info['cost']
			if card_cost != 0 and data["card"] < card_cost:
				avt_mb.client.showTip("摩卡不足")
			elif diamond_cost != 0 and data["diamond"] < diamond_cost:
				avt_mb.client.showTip("钻石不足")
			elif data["card"] >= card_cost or data["diamond"] >= diamond_cost:
				self.pay(avt_mb)
			return

		if self.canJoinDailySport(avt_mb) == 0:
			avt_mb.client.showTip("请等待其他玩家结束比赛")
			return 

		if avt_mb.free_sport_list[self.sportId-1] > 0:
			avt_mb.free_sport_list[self.sportId - 1] -= 1
			self.joinSuccess(avt_mb)
		elif avt_mb.isBot:
			self.joinSuccess(avt_mb)
		else:
			if switch.DEBUG_BASE:
				self.joinSuccess(avt_mb)
				# callback('{"card":99, "diamond":999}')
			else:
				utility.get_user_info(avt_mb.accountName, callback)

	def pay(self, avt_mb):
		card_cost, diamond_cost = self.base_info['cost']
		def callback(content):
			DEBUG_MSG("pay callback {0},{1}".format(card_cost, diamond_cost))
			if content[0] != '{':
				DEBUG_MSG(content)
				return
			self.joinSuccess(avt_mb)
		DEBUG_MSG("pay {0},{1}".format(card_cost, diamond_cost))
		utility.update_card_diamond(avt_mb.accountName, -card_cost, -diamond_cost, callback, "PaoDeKuai sport:{}".format(self.sportId))

	def joinSuccess(self, avt_mb):
		for x in self.wait_pool:
			avt_mb.sportId = self.sportId
			avt_mb.enterRoom(x)
			room = self.wait_pool[x]
			if room.isFull:
				self.wait_pool.pop(x)
			break
		else:
			avt_mb.reqCreateSportRoom(self.base_info['op'], self.sportId)

		# self.inRanking[avt_mb.userId] = avt_mb.userId
		return

	def addRoom(self, room):
		self.wait_pool[room.roomID] = room

	def dismissRoom(self, room):
		if room.roomID in self.wait_pool:
			self.wait_pool.pop(room.roomID)

	def record(self, rc_list, isHistory = 0):
		DEBUG_MSG("record {}".format(rc_list))
		for x in self.record_list:
			DEBUG_MSG("record_list {}".format(x))

		recordListIndex = self.join_function(rc_list)
		if recordListIndex == -1:
			if isHistory == 0:
				self.history_list.append(rc_list)
			return False
		else:
			DEBUG_MSG("recordListIndex {}".format(recordListIndex))
			self.record_list[recordListIndex].append(rc_list)
			self.tem_list[recordListIndex].append(rc_list)
			for x in range(len(self.record_list)):
				while SPORT_DAILY_ROOMS > 0 and len(self.record_list[x]) >= SPORT_DAILY_ROOMS:
					rank_list = self.record_list[x][:SPORT_DAILY_ROOMS]
					self.record_list[x] = self.record_list[x][SPORT_DAILY_ROOMS:]
					self.tem_list[x] = self.tem_list[x][SPORT_DAILY_ROOMS:]
					self.giveReward(rank_list)
					if isHistory == 0:
						# 将没有存入排行榜的记录加入排行榜
						if len(self.history_list) > 0:
							self.refreshHistory()

			if SPORT_DAILY_ROOMS > 0 and len(self.tem_list[recordListIndex]) < SPORT_DAILY_ROOMS and len(self.tem_list[recordListIndex]) > 0:
				self.updateTemRanklist(self.tem_list[recordListIndex])

			for i in range(const.DAILY_SPORT_PLAYER_ROUND):
				if self.Timer_list[i] != None:
					self.cancel_timer(self.Timer_list[i])
				if len(self.record_list[i]) > 0:
					self.Timer_list[i] = self.add_timer(SPORT_DAILY_RANK_TIME, self.genRandomRecord)
			return True

	def IsExist(self, selfList, newList):
		for x in newList:
			for y in selfList:
				if x['userId'] == y['userId']:
					return True
		return False

	def canJoinDailySport(self, avt_mb):
		tem_list = []
		avatarList =[]
		avatarList.append({'userId':avt_mb.userId})
		for i, element in enumerate(self.record_list):
			for j in element:
				if self.IsExist(j,avatarList):
					tem_list.append(i)
		if len(tem_list) == const.DAILY_SPORT_PLAYER_ROUND:
			return 0
		else:
			return 1

	def join_function(self, rc_list):
		tem_list = []
		for i, element in enumerate(self.record_list):
			for j in element:
				if self.IsExist(j,rc_list):
					tem_list.append(i)
		DEBUG_MSG("join_function {}".format(tem_list))
		return self.getIndex(tem_list)


	def getIndex(self, excludeList):
		tem_list = []
		flag = 0
		for i in range(len(self.record_list)):
			if i in excludeList:
				tem_list.append(-1)
			else:
				tem_list.append(len(self.record_list[i]))
		DEBUG_MSG("getIndex {}".format(tem_list))
		for j in range(len(tem_list)):
			if tem_list[j] == -1:
				flag = flag + 1
		if flag == len(tem_list):
			return -1
		idx = tem_list.index(max(tem_list))
		return idx

	def genRandomRecord(self):
		maxLose = self.base_info['maxLose']
		bot_rc_list = []
		room_player_num = self.base_info['op']['player_num']
		for i in range(room_player_num):
			if i+1 < room_player_num:
				score = random.randint(-maxLose, maxLose)
			else:
				score = -sum([rc['score'] for rc in bot_rc_list])
			lastname = table_name.lastnameTbl[random.randint(0, table_name.lastnameNum - 1)]
			firstname = table_name.firstnameTbl[random.randint(0, table_name.firstnameNum - 1)]
			name = lastname + firstname

			self.botUserId = self.botUserId + 1
			userId = self.botUserId + 6134701
			bot_rc_list.append({'userId': userId, 'nickname':name, 'score': score, 'accountName': name})
		self.record(bot_rc_list)


	def giveReward(self, rank_list):
		all_list = []
		for room_rc in rank_list:
			all_list.extend(room_rc)

		all_list.sort(key=lambda x: x['score'], reverse=True)
		reward_list = self.base_info['reward']

		self.rankingId = self.rankingId + 1
		rankingId = self.rankingId + 113174102

		detail_info = copy.deepcopy(all_list)
		for d in detail_info:
			d.pop('accountName', None)

		# 后台系统发放奖励
		if switch.DEBUG_BASE == 0:
			reward_player = [p['accountName'] for p in all_list[:len(reward_list)]]
			card_reward = reward_list[:len(reward_player)]

			def update_cb(content):
				try:
					data = json.loads(content)
					if data['errcode'] != 0:
						ERROR_MSG("update_reward_get content={}".format(content))
				except:
					import traceback
					ERROR_MSG("update_reward_get Error: {}".format(traceback.format_exc()))

			utility.update_reward_get(reward_player, card_reward, [0] * len(reward_player), update_cb, reason="SportDaily{} reward".format(self.sportId))

		for i,u in enumerate(all_list):
			if u['userId'] <= 0:
				continue
			reward = 0
			if i < len(reward_list):
				reward = reward_list[i]
			rank_info = {
				'userId': u['userId'],
				'rankingId': rankingId,
				'nickname': u['nickname'],
				'time': time.time(),
				'ranking': i+1,
				'reward' : reward,
				'detailed': detail_info
			}
			DEBUG_MSG("rank_info :{}".format(rank_info))
			DEBUG_MSG("userId :{}".format(u['userId']))

			if x42.GW.isOnline(u['userId']):
				if getattr(x42.GW.getOnlineAvatar(u['userId']), 'client', None):
					x42.GW.getOnlineAvatar(u['userId']).client.pushDailySportRank(const.DAILY_RANK_STATE_CLOSE, detail_info)
					x42.GW.getOnlineAvatar(u['userId']).updateDailyRank(rank_info)
			else:
				dbid = x42.GW.getPlayerDbidByUserId(u['userId'])
				DEBUG_MSG("dbid :{}".format(dbid))
				if dbid is None: # 数据库中没有这个玩家信息
					continue

				sql = "INSERT INTO "+const.DB_NAME+".tbl_Avatar_rank (parentID, sm_userId, sm_nickname, sm_rankingId, sm_time, sm_ranking, sm_reward) VALUES(%i, %i, \"%s\", %i, %f, %i, %i);\n" \
				% (dbid, u['userId'], u['nickname'], rankingId, time.time(), i+1, reward)

				def insertDatabaseCallBack(result, num, insert_id, error):
					cmd = ''
					parentID = insert_id
					for x in all_list:
						if x['userId'] <= 0:
							continue
						cmd = 'INSERT INTO {0}.tbl_Avatar_rank_detailed (parentID, sm_userId, sm_nickname, sm_score) VALUES({1}, {2},"{3}",{4});' \
						.format(const.DB_NAME, parentID, x['userId'], x['nickname'], x['score'])
						KBEngine.executeRawDatabaseCommand(cmd, None)

				DEBUG_MSG("sql = {0} ".format(sql))
				KBEngine.executeRawDatabaseCommand(sql, insertDatabaseCallBack)


	def updateTemRanklist(self, rank_list):
		all_list = []
		for room_rc in rank_list:
			all_list.extend(room_rc)

		all_list.sort(key=lambda x: x['score'], reverse=True)
		detail_info = copy.deepcopy(all_list)
		for d in detail_info:
			d.pop('accountName', None)

		for u in all_list:
			if u['userId'] <= 0:
				continue
			if x42.GW.isOnline(u['userId']):
				DEBUG_MSG("u['userId'] :{}".format(u['userId']))
				if getattr(x42.GW.getOnlineAvatar(u['userId']), 'client', None):
					x42.GW.getOnlineAvatar(u['userId']).client.pushDailySportRank(const.DAILY_RANK_STATE_OPEN, detail_info)

