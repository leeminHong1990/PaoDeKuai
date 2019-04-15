# -*- coding: utf-8 -*-
import KBEngine
import const
from KBEDebug import *
import random
import math
import time

class iCache:

	def __init__(self):
		self.cacheDict = {}
		# 用于查找玩家 pid, 存在说明玩家在线
		self.userId2Pid 		= {}
		self.uuid2Pid 			= {}
		self.accountName2Pid 	= {}
		# 用于查找玩家userId
		self.uuid2UserId 		= {}
		self.accountName2UserId = {}

		def queryDatabaseCallBack(result, num, insert_id, error):
			if error is None:
				if result is not None:
					DEBUG_MSG("result is not None, len(result)={0}, num={1}".format(len(result), num))
					for item in result:
						DEBUG_MSG("sm_userId[{0}],sm_name[{1}],dbid[{2}] ".format(int(item[0]), str(item[4], "utf-8"), int(item[1])))
						self.cacheDict[int(item[0])] = {
							'userId'				:int(item[0]),
							'dbid'					:int(item[1]), 
							'uuid'					:int(item[2]), 
							'accountName'			:str(item[3], "utf-8"),
							'name'					:str(item[4], "utf-8"), 
							'sex'					:int(item[5]),
							'head_icon'				:str(item[6]),
						}
						self.uuid2UserId[int(item[2])] 			= int(item[0])
						self.accountName2UserId[str(item[3])] 	= int(item[0])
				else:
					ERROR_MSG("queryDatabaseCallBack result is None. result=%s, num=%s, error=%s" % (result, num, error))
			else:
				ERROR_MSG("queryDatabaseCallBack error=%s" % (error))
		KBEngine.executeRawDatabaseCommand("SELECT `sm_userId`, `id`, `sm_uuid`, `sm_accountName`, `sm_name`, `sm_sex`, `sm_head_icon` FROM "+const.DB_NAME+".tbl_Avatar;", queryDatabaseCallBack)
		return

	# 新创建玩家 
	def addCacheDict(self, userId, dic):
		DEBUG_MSG("addCacheDict --> userId[{0}], dict[{1}]".format(userId, dic))
		if userId not in self.cacheDict:
			self.cacheDict[userId] = dic
			#增加 查找玩家 userId
			self.uuid2UserId[dic["uuid"]] 				= userId
			self.accountName2UserId[dic["accountName"]] = userId

	# 玩家信息变化
	def updateCacheDict(self, userId, dic):
		DEBUG_MSG("updateCacheDict --> userId[{0}], dict[{1}]".format(userId, dic))
		if userId in self.cacheDict:
			for key in dic:
				self.cacheDict[userId][key] = dic[key]

	# 玩家上线
	def addPlayer2Pid(self, userId, uuid, accountName, pid):
		DEBUG_MSG("addPlayer2Pid --> userId {0}, uuid {1}, accountName {2}, pid {3}".format(userId, uuid, accountName, pid))
		self.userId2Pid[userId] = pid
		self.uuid2Pid[uuid] = pid
		self.accountName2Pid[accountName] = pid

	def isOnline(self, userId):
		return  userId in self.avatars

	def getOnlineAvatar(self, userId):
		return self.avatars.get(userId, None)
		# pid = self.userId2Pid[userId]
		# return self.avatars[pid]

	# 玩家下线
	def delPlayer2Pid(self, userId, uuid, accountName, pid):
		DEBUG_MSG("delPlayer2Pid --> userId {0}, uuid {1}, accountName {2}, pid {3}".format(userId, uuid, accountName, pid))
		if userId in self.userId2Pid:
			del self.userId2Pid[userId]
		if uuid in self.uuid2Pid:
			del self.uuid2Pid[uuid]
		if accountName in self.accountName2Pid:
			del self.accountName2Pid[accountName]

	#通过 userId uuid accountName获取玩家的dbid
	def getPlayerDbidByUserId(self, userId):
		if userId not in self.cacheDict:
			return None
		return self.cacheDict[userId]["dbid"]

	def getPlayerDbidByUUID(self, uuid):
		if uuid not in self.uuid2UserId:
			return None
		userId = self.uuid2UserId[uuid]
		return self.getPlayerDbidByUserId(userId)

	def getPlayerDbidByAccountName(self, accountName):
		if accountName not in self.accountName2UserId:
			return None
		userId = self.accountName2UserId[accountName]
		return self.getPlayerDbidByUserId(userId)