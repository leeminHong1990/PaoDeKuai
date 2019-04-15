# -*- coding: utf-8 -*-
import KBEngine
import Functor
import const
from KBEDebug import *
import time

MAX_PLAYER_NUM = 30000

class iGameManager:
	"""
	服务端游戏对象的基础接口类
	"""
	def __init__(self):
		self.accounts = {}
		return

	def getGMData(self, avatarMailbox):
		curPlayers = self.calCurrentPlayers()
		avatarMailbox.client.pushGMData(len(self.avatars), curPlayers, len(self.bots), len(self.freeBots))
		return


	def kickOffPlayer(self, avatarMailbox, pid):
		if pid not in self.avatars:
			avatarMailbox.client.operationFail(const.GM_OPERATION, 0)
			return
		self.avatars[pid].logout()
		avatarMailbox.client.operationSuccess(const.GM_OPERATION, 0)
		return


	def accountLogout(self, accountname):
		if accountname in self.accounts:
			del self.accounts[accountname]

	def canLogin(self, accountMailbox, accountname):
		isDelay = 0
		if accountname in self.accounts:
			# self.accounts[accountname].destroyByServer()
			isDelay = 1
		self.accounts[accountname] = accountMailbox

		forbid = 0
		if len(self.avatars) >= MAX_PLAYER_NUM:
			forbid = 1
			
		accountMailbox.canLogin(forbid, isDelay)
