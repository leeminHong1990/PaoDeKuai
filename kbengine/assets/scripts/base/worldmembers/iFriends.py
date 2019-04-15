# -*- coding: utf-8 -*-
import KBEngine
import Functor
import const
from KBEDebug import *
import time

class iFriends:
	"""
	服务端游戏对象的基础接口类
	"""
	def __init__(self):
		return

	def sendPidToFriend(self, fromuuid, pid, dbid, typeId):
		if pid == 0:
			self.handleFirendByDBID(fromuuid, dbid, typeId)
		else:
			self.handleFirendByPID(fromuuid, pid, typeId)

	def handleFirendByDBID(self, fromuuid, dbid, typeId):
		DEBUG_MSG("Space[%i].handleFirendByDBID %i success." % (self.id, dbid))
		if typeId == 0:
			sqlSentence = "INSERT INTO "+const.DB_NAME+".tbl_Avatar_attentionYouPlayerList (parentID, sm_value) VALUES(%i, %i);"
		elif typeId == 1:
			sqlSentence = "DELETE FROM "+const.DB_NAME+".tbl_Avatar_attentionYouPlayerList WHERE parentID=%i and sm_value=%i;"
		elif typeId == 2:
			sqlSentence = "DELETE FROM "+const.DB_NAME+".tbl_Avatar_attentionPlayerList WHERE  parentID=%i and sm_value=%i;"

		# INSERT sm_name,sm_wealth FROM const.DB_NAME.tbl_Avatar;
		def insertDatabaseCallBack(result, num, insert_id, error):
			if error is not None:
				ERROR_MSG("Space[%i].handleFirendByDBID %i insertDatabaseCallBack Fail." % (self.id, dbid))
				return
			DEBUG_MSG("Space[%i] insertDatabaseCallBack %i -- %i %s success." % (self.id, dbid, num, str(result)))

		DEBUG_MSG("Space[%i].%s." % (self.id, str(sqlSentence % (dbid, fromuuid))))
		KBEngine.executeRawDatabaseCommand(sqlSentence % (dbid, fromuuid), insertDatabaseCallBack)
		return

	def handleFirendByPID(self, fromuuid, pid, typeId):
		if pid not in self.avatars:
			return
		if typeId == 0:
			self.avatars[pid].beAttesioned(fromuuid)
		elif typeId == 1:
			self.avatars[pid].disBeAttesioned(fromuuid)
		elif typeId == 2:
			self.avatars[pid].disAttesioned(fromuuid)

	'''好友相关'''
	def playerAttentionPlayer(self, fromuuid, uuid):
		self.getPidByFriend(fromuuid, uuid, 0)

	def playerDisAttentionPlayer(self, fromuuid, uuid):
		self.getPidByFriend(fromuuid, uuid, 1)

	def playerDisBeAttentionPlayer(self, fromuuid, uuid):
		self.getPidByFriend(fromuuid, uuid, 2)

	'''好友送礼物相关'''
	def sendFriendGift(self, uuid, gift):
		self.getPidByFriendGift(uuid, gift)

	def sendFriendGiftByUID(self, uid, gift):
		self.getPidByFriendGiftUID(uid, gift)

	def sendFriendGiftByPID(self, pid, gift):
		DEBUG_MSG("Space[%i].sendFriendGiftByPID %i." % (self.id, pid))
		if pid in self.avatars:
			self.avatars[pid].addFriendGift(gift)
		return

	def sendFriendGiftByDBID(self, dbid, gift):
		DEBUG_MSG("Space[%i].sendFriendGiftByDBID %i success." % (self.id, dbid))

		# INSERT sm_name,sm_wealth FROM const.DB_NAME.tbl_Avatar;
		def insertDatabaseCallBack(result, num, insert_id,  error):
			if error is not None:
				ERROR_MSG("Space[%i].sendFriendGiftByDBID %i insertDatabaseCallBack Fail." % (self.id, dbid))
				return
			DEBUG_MSG("Space[%i] insertDatabaseCallBack %i -- %i %s success." % (self.id, dbid, num, str(result)))

			# def queryDatabaseCallBack(result, num, error):
			# 	if error is not None:
			# 		ERROR_MSG("Space[%i].sendFriendGiftByDBID %i queryDatabaseCallBack Fail." % (self.id, dbid))
			# 		return

			# 	if len(result) != 1:
			# 		ERROR_MSG("Space[%i].sendFriendGiftByDBID %i queryDatabaseCallBack result:%s is error." % (self.id, dbid, str(result)))
			# 		return

			# 	for item in gift["attachment"]:
			# 		KBEngine.executeRawDatabaseCommand("INSERT INTO "+const.DB_NAME+".tbl_Avatar_giftList_attachment (parentID, sm_itemId, sm_count) VALUES(%i, %i, %i);" 
			# 			% (int(result[0][0]), item["itemId"], item["count"]), None)
			
			# KBEngine.executeRawDatabaseCommand("SELECT `id` FROM "+const.DB_NAME+".tbl_Avatar_giftList WHERE sm_mid = %i;" % gift["mid"], queryDatabaseCallBack)

		KBEngine.executeRawDatabaseCommand("INSERT INTO "+const.DB_NAME+".tbl_Avatar_canGetFriendGiftList (parentID, sm_gid, sm_time) VALUES(%i, %f, %f);" 
			% (dbid, gift["gid"], gift["time"]), insertDatabaseCallBack)

		return

	def sendPidToFriendGift(self, pid, dbid, gift):
		if pid == 0:
			self.sendFriendGiftByDBID(dbid, gift)
		else:
			self.sendFriendGiftByPID(pid, gift)