# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *


class iBase:
	def pushAllChat(self, chatInfoList):
		# DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
		return

	def pushWorldChannelChat(self, content):
		# DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
		return

	def updateClientNewEvent(self, event, value):
		# DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
		return

	def pushAvatarInfo(self, avatarInfo):
		# DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
		return