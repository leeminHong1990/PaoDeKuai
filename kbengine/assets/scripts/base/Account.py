# -*- coding: utf-8 -*-
import KBEngine
import random
import time
import const
from KBEDebug import *
from LoggerManager import LoggerManager
import switch
import json
from BaseEntity import BaseEntity

class Account(KBEngine.Proxy, BaseEntity):
	"""
	账号实体
	客户端登陆到服务端后，服务端将自动创建这个实体，通过这个实体与客户端进行交互
	"""
	def __init__(self):
		KBEngine.Proxy.__init__(self)
		BaseEntity.__init__(self)
		self.activeCharacter = None
		self._destroyTimer = None
		self.need_delay = False
		self.relogin = time.time()

		self.logger = LoggerManager()
		self.logger.set_user_info({"entity_id" : self.id, "account_id": self.__ACCOUNT_NAME__})
		DEBUG_MSG("Account[%s] create" % (self.id))

	'''注销'''
	def logout(self):
		DEBUG_MSG("logout")
		self.client and self.client.closeClient()
		self.destroySelf()
		self.logger.log("LogOutInfo", {"logout_type" : "注销"})
		
	def onEntitiesEnabled(self):
		"""
		KBEngine method.
		该entity被正式激活为可使用， 此时entity已经建立了client对应实体， 可以在此创建它的
		cell部分。
		"""
		# DEBUG_MSG("Account{0}::onEntitiesEnabled:entities enable hasAvatar = {1}, accountName = {2}".format(self.id, self.activeCharacter, self.__ACCOUNT_NAME__))
		KBEngine.globalData["GameWorld"].canLogin(self, self.__ACCOUNT_NAME__)

	def canLogin(self, isForbid, isDelay):
		if isForbid == 0:
			# Todo==NeverDo 请求客户端设备信息
			if self.need_delay:
				self.add_timer(isDelay, self._autoLogin)
			else:
				self._autoLogin()
		else:
			self.client and self.client.operationFail(const.LOGIN_OPERATION, isForbid)
			self.onClientDeath()
		return

	def onLogOnAttempt(self, ip, port, password):
		"""
		KBEngine method.
		客户端登陆失败时会回调到这里
		"""
		DEBUG_MSG("Account[%i]::onLogOnAttempt: ip=%s, port=%i, selfclient=%s" % (self.id, ip, port, self.client))
		"""
		if self.activeCharacter != None:
			return KBEngine.LOG_ON_REJECT

		if ip == self.lastClientIpAddr and password == self.password:
			return KBEngine.LOG_ON_ACCEPT
		else:
			return KBEngine.LOG_ON_REJECT
		"""
		
		# 如果一个在线的账号被一个客户端登陆并且onLogOnAttempt返回允许
		# 那么会踢掉之前的客户端连接
		# 那么此时self.activeCharacter可能不为None
		# 常规的流程是销毁这个角色等新客户端上来重新选择角色进入 但是我们是直接登录，所以不删除，如果不为空，直接使用

		# 根据在线的Avatar是否有客户端连接来判断是断线重连还是顶号, 顶号的话需要踢掉之前的连接, Login需要延迟1s
		if self.activeCharacter:
			has_client = getattr(self.activeCharacter, "client", None) != None
			self.need_delay = has_client
			if has_client:
				self.activeCharacter.giveClientTo(self)
			self.relogin = time.time()
			self.activeCharacter.destroySelfFromAccount()
			if has_client:
				self.activeCharacter = None

		return KBEngine.LOG_ON_ACCEPT

	def destroyCharacter(self):
		if self.activeCharacter:
			if self.client:
				self.giveClientTo(self.activeCharacter)
			self.relogin = time.time()
			if self.activeCharacter.destroySelf():
				self.activeCharacter = None

	def destroyByServer(self):
		pass
		# self.destroyCharacter()

	def destroySelf(self):
		self.destroyCharacter()
		KBEngine.globalData["GameWorld"].accountLogout(self.__ACCOUNT_NAME__)
		self.destroy()

	def onClientDeath(self):
		"""
		KBEngine method.
		客户端对应实体已经销毁
		"""
		DEBUG_MSG("Account[%i].onClientDeath:" % self.id)
		KBEngine.globalData["GameWorld"].accountLogout(self.__ACCOUNT_NAME__)
		self.destroySelf()

	def _autoLogin(self):
		# DEBUG_MSG("######### _autoLogin 1")
		for character in self.characters:
			if character["characterType"] == 0:
				self.selectAvatarGame(character['dbid'])
				return
		# DEBUG_MSG("######### _autoLogin 2")
		if switch.DEBUG_BASE:
			KBEngine.globalData['GameWorld'].genGlobalBornData(self)
		elif 'bot_' == self.__ACCOUNT_NAME__[:4]:
			KBEngine.globalData['GameWorld'].genGlobalBornData(self)
		else:
			self.reqCreateAvatar(json.loads(self.getClientDatas()[1].decode("utf-8")))

	def reqCreateAvatar(self, bornDataDict):
		""" 根据前端类别给出出生点
		UNKNOWN_CLIENT_COMPONENT_TYPE	= 0,
		CLIENT_TYPE_MOBILE				= 1,	// 手机类
		CLIENT_TYPE_PC					= 2,	// pc， 一般都是exe客户端
		CLIENT_TYPE_BROWSER				= 3,	// web应用， html5，flash
		CLIENT_TYPE_BOTS				= 4,	// bots
		CLIENT_TYPE_MINI				= 5,	// 微型客户端
		"""
		props = {
			"name"				: self.__ACCOUNT_NAME__,
			"uuid"				: KBEngine.genUUID64(),
			"sex"				: random.randint(0,1),
			"lastLoginTime"		: time.time(),
			"accountName" 		: self.__ACCOUNT_NAME__,
		}
		for key in bornDataDict:
			props[key] = bornDataDict[key]

		DEBUG_MSG('Account(%i)::reqCreateAvatar: %i' % (self.id, 0))
		avatar = KBEngine.createBaseLocally("Avatar", props)
		if avatar:
			avatar.writeToDB(self._onCharacterSaved)

	def _onCharacterSaved(self, success, avatar):
		"""
		新建角色写入数据库回调
		"""
		DEBUG_MSG('Account::_onCharacterSaved:(%i) create avatar state: %i, %i' % (self.id, success, avatar.databaseID))
		
		# 如果此时账号已经销毁， 角色已经无法被记录则我们清除这个角色
		if self.isDestroyed:
			if avatar:
				avatar.destroy(True)				
			return

		if success:
			self.logger.log("CreateAccount", {})
			
			characterInfo = {"dbid" : avatar.databaseID, "uuid" : avatar.uuid, "name" : avatar.name, "characterType" : 0}
			self.characters.append(characterInfo)
			self.writeToDB()
			dbid = avatar.databaseID

			KBEngine.globalData['GameWorld'].addCacheDict(avatar.userId, {
				'userId'				:avatar.userId,
				'dbid'					:dbid,
				'uuid'					:avatar.uuid,
				'accountName'			:avatar.accountName,
				'name'					:avatar.name,
				'sex'					:avatar.sex,
				'head_icon'				:avatar.head_icon,
			})
			
			avatar.destroy()
			self.selectAvatarGame(dbid)

	def selectAvatarGame(self, dbid):
		DEBUG_MSG("Account[%i].selectAvatarGame:%i. self.activeCharacter=%s" % (self.id, dbid, self.activeCharacter))
		# 注意:使用giveClientTo的entity必须是当前baseapp上的entity
		if self.activeCharacter is None:
			player = KBEngine.createBaseFromDBID("Avatar", dbid, self.__onAvatarCreated)
		else:
			self.giveClientTo(self.activeCharacter)
			self.activeCharacter.accountEntity = self

	def __onAvatarCreated(self, baseRef, dbid, wasActive):
		"""
		选择角色进入游戏时被调用
		"""
		# DEBUG_MSG("######### __onAvatarCreated 1")
		if baseRef is None:
			ERROR_MSG("Account::__onAvatarCreated:(%i): the character you wservercostd to created is not exist!" % (self.id))
			return

		avatar = KBEngine.entities.get(baseRef.id)
		if avatar is None:
			ERROR_MSG("Account::__onAvatarCreated:(%i): when character was created, it died as well!" % (self.id))
			return

		if wasActive:
			WARNING_MSG("Account::__onAvatarCreated:(%i): this character is in world now!" % (self.id))
			if getattr(avatar, 'client') is not None:
				return

		if self.isDestroyed:
			ERROR_MSG("Account::__onAvatarCreated:(%i): i dead, will the destroy of PlayerAvatar!" % (self.id))
			avatar.destroy()
			return

		# DEBUG_MSG("######### __onAvatarCreated 2")
		avatar.accountEntity = self
		self.activeCharacter = avatar
		self.giveClientTo(avatar)
