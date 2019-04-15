# -*- coding: utf-8 -*-

import KBEngine
import const
from KBEDebug import *


class iRecordOperation(object):
	def queryRecordResult(self, record):
		# DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
		return

	def queryRecordFailed(self, errorCode):
		# DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
		return

	def queryUserRecordResult(self, records):
		# DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
		return
