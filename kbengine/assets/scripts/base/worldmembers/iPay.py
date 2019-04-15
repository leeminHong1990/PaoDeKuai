# -*- coding: utf-8 -*-
import KBEngine
import Functor
import const
from KBEDebug import *
import time

class iPay(object):
	"""
	GameWorld的组件
	房卡充值
	"""

	def __init__(self):
		pass

	def userPaySuccess(self, cmd):
		proxy, user_id, count = cmd[0], int(cmd[1]), int(cmd[2])

		DEBUG_MSG("PlayerChargeCard cmd {0}->{1}->{2}.".format(proxy, user_id, count))

		for k in self.avatars:
			p = self.avatars[k]
			if p.userId == user_id:
				DEBUG_MSG("PlayerChargeCard Succeed {0}->{1}->{2} Online.".format(proxy, user_id, count))
				p.addCards(count)
				p.writeToDB()
				break
		else:
			DEBUG_MSG("TO DATABASE {0}->{1}->{2} Online.".format(proxy, user_id, count))

			# 玩家下线, 直接写入数据库
			def updateDatabaseCallBack(result, num, insert_id,  error):
				if error is not None:
					ERROR_MSG("PlayerChargeCard Failed {0}->{1}->{2}.".format(proxy, user_id, count))
					return
				DEBUG_MSG("PlayerChargeCard Succeed {0}->{1}->{2} num={3} result={4}.".format(proxy, user_id, count, num, str(result)))

			cmd = "UPDATE {0}.tbl_Avatar SET sm_cards = sm_cards + {1} WHERE sm_userID = {2}".format(const.DB_NAME, count, user_id)
			KBEngine.executeRawDatabaseCommand(cmd, updateDatabaseCallBack)
