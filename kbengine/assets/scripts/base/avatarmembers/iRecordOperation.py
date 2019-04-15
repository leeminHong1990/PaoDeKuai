# -*- coding: utf-8 -*-

import KBEngine
import const
from KBEDebug import *


class iRecordOperation(object):
	def __init__(self):
		pass

	def initRecord(self):
		pass

	def queryRecord(self, record_id):
		DEBUG_MSG("iRecordOperation queryRecord {0}".format(record_id))
		KBEngine.globalData['GameWorld'].query_record(self, record_id)

	def queryUserRecord(self, user_id, count):
		DEBUG_MSG("iRecordOperation queryRecord {0} {1}".format(user_id, count))
		KBEngine.globalData['GameWorld'].query_user_record(self, user_id, count)

	def query_user_record_result(self, records):
		DEBUG_MSG('query_user_record_result', records)
		if getattr(self, 'client', None):
			self.client.queryUserRecordResult(records)

	def query_record_result(self, record):
		DEBUG_MSG('query_record_result', record)
		DEBUG_MSG('query_record_result', type(record))
		if getattr(self, 'client', None):
			if record is None:
				self.client.queryRecordFailed(const.QUERY_RECORD_NO_EXIST)
			else:
				self.client.queryRecordResult(record)
