# -*- coding: utf-8 -*-
import KBEngine
import Functor
import const
from KBEDebug import *
import time

class iMail:
	"""
	服务端游戏对象的基础接口类
	"""
	def __init__(self):
		return

	def initMails(self):
		return

	def onTimer(self, tid, userArg):
		return

	'''全服邮件'''
	def spaceBoardcastMail(self, avatarMailbox, mail):
		self.mailList.append(mail)
		if len(self.mailList) > 300:
			self.mailList.pop(0)

		self.runFuncOnAllPlayers(1, ["addMail"], mail)
		avatarMailbox.client.operationSuccess(const.GM_OPERATION_SUCCESS, 4)


	def getSysMails(self, avatarMailbox, lasttime):
		mailLen = len(self.mailList)
		curtime = time.time()
		DEBUG_MSG("Space[%i] getSysMails avatar(%i) time(%f) mailLen(%i)." % (self.id, avatarMailbox.id, lasttime, mailLen))
		for i in range(mailLen):
			DEBUG_MSG("Space[%i] getSysMails avatar(%i) time(%f - %f) %i." % (self.id, avatarMailbox.id, lasttime, self.mailList[mailLen - i - 1]["time"], mailLen - i - 1))
			mailtime = self.mailList[mailLen - i - 1]["time"]
			if mailtime > lasttime and curtime - mailtime < 10 * const.ONEDAY_TIME:
				avatarMailbox.addMail(self.mailList[mailLen - i - 1])
		return

	def sendMail(self, uuid, mail):
		self.getPidByMail(uuid, mail)

	def sendMailByUID(self, uid, mail):
		self.getPidByMailUID(uid, mail)

	def sendMailByPID(self, pid, mail):
		DEBUG_MSG("Space[%i].sendMailByPID %i." % (self.id, pid))
		if pid in self.avatars:
			self.avatars[pid].addMail(mail)
		return

	def sendMailByDBID(self, dbid, mail):
		DEBUG_MSG("Space[%i].sendMailByDBID %i success." % (self.id, dbid))


		# INSERT sm_name,sm_wealth FROM const.DB_NAME.tbl_Avatar;
		def insertDatabaseCallBack(result, num, insert_id,  error):
			if error is not None:
				ERROR_MSG("Space[%i].sendMailByDBID %i insertDatabaseCallBack Fail." % (self.id, dbid))
				return
			DEBUG_MSG("Space[%i] insertDatabaseCallBack %i -- %i %s success." % (self.id, dbid, num, str(result)))

			def queryDatabaseCallBack(result, num, insert_id, error):
				if error is not None:
					ERROR_MSG("Space[%i].sendMailByDBID %i queryDatabaseCallBack Fail." % (self.id, dbid))
					return

				if len(result) != 1:
					ERROR_MSG("Space[%i].sendMailByDBID %i queryDatabaseCallBack result:%s is error." % (self.id, dbid, str(result)))
					return

				for item in mail["attachment"]:
					KBEngine.executeRawDatabaseCommand("INSERT INTO "+const.DB_NAME+".tbl_Avatar_mailList_attachment (parentID, sm_itemId, sm_count) VALUES(%i, %i, %i);" 
						% (int(result[0][0]), item["itemId"], item["count"]), None)
			
			KBEngine.executeRawDatabaseCommand("SELECT `id` FROM "+const.DB_NAME+".tbl_Avatar_mailList WHERE sm_mid = %i;" % mail["mid"], queryDatabaseCallBack)

		KBEngine.executeRawDatabaseCommand("INSERT INTO "+const.DB_NAME+".tbl_Avatar_mailList (parentID, sm_mid, sm_type, sm_time, sm_title, sm_info, sm_from) VALUES(%i, %i, %i, %f, \"%s\", \"%s\", \"%s\");" 
			% (dbid, mail["mid"], mail["type"], mail["time"], mail["content"]["title"], mail["content"]["info"], mail["from"]), insertDatabaseCallBack)

		return

	def sendPidToMail(self, pid, dbid, mail):
		if pid == 0:
			self.sendMailByDBID(dbid, mail)
		else:
			self.sendMailByPID(pid, mail)

	def boardcastRankInfo(self, rid, uuid, value):
		KBEngine.globalData["GameWorld"].getNameByRankBoardCast(self, uuid, rid, value)

	def boardcastRankInfoCallBack(self, name, rid, value):
		boardinfo = {"bid" : 110 + rid, "values" : [name, str(value)]}
		self.spaceBoardcastInfo(boardinfo)

	def boardcastVIPWords(self, name, sentence):
		boardinfo = {"bid" : 201, "values" : [name, sentence]}
		self.spaceBoardcastInfo(boardinfo)

	def boardcastSlotWords(self, name, num):
		boardinfo = {"bid" : 301, "values" : [name, str(num)]}
		self.spaceBoardcastInfo(boardinfo)

	def boardcastGiftWords(self, name, itemId):
		boardinfo = {"bid" : 401, "values" : [name, str(itemId)]}
		self.spaceBoardcastInfo(boardinfo)

	def boardcastGMWords(self, name, sentence):
		boardinfo = {"bid" : 501, "values" : [name, sentence]}
		self.spaceBoardcastInfo(boardinfo)

	def boardcastTaskWords(self, name):
		boardinfo = {"bid" : 601, "values" : [name]}
		self.spaceBoardcastInfo(boardinfo)

	'''全服广播'''
	def spaceBoardcastInfo(self, info):
		self.runFuncOnAllPlayers(2, ["client", "boardcastInfo"], info)