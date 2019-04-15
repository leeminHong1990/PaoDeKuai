# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
from Swallower import NonexistentSwallower


class BaseEntity(KBEngine.Base):

	def __init__(self):
		KBEngine.Base.__init__(self)
		self._timers = {}

	def add_timer(self, delay, callback):
		"""
		增加一次性定时器
		:param delay: 触发周期, 单位秒
		:param callback: 触发时需要执行的函数
		:return: 定时器ID, 可用于取消该定时器
		"""
		if delay <= 0:
			callback()
			return None

		tid = self.addTimer(delay, 0, 0)
		self._timers[tid] = (0, callback)
		DEBUG_MSG("id:{} add_timer tid:{} delay:{} callback:{}".format(self.id, tid, delay, callback))
		DEBUG_MSG("id:{} _timer:{}".format(self.id, self._timers))
		return tid

	def add_repeat_timer(self, offset, period, callback):
		"""
		增加周期性定时器
		:param offset: 指定定时器第一次触发延时, 单位秒
		:param period: 触发周期, 单位秒
		:param callback: 触发时需要执行的函数
		:return: 定时器ID, 可用于取消该定时器
		"""


		tid = self.addTimer(offset, period, 0)
		self._timers[tid] = (period, callback)
		DEBUG_MSG("id:{} add_repeat_timer tid:{} offset:{} period:{},callback:{}".format(self.id, tid, offset, period, callback))
		DEBUG_MSG("id:{} _timer:{}".format(self.id, self._timers))
		return tid

	def cancel_timer(self, tid):
		"""
		取消一个定时器
		:param tid: 定时器ID
		:return:
		"""
		if tid in self._timers:
			self.delTimer(tid)
			del self._timers[tid]
			DEBUG_MSG("id:{} cancel_timer tid:{} _timers {}".format(self.id, tid, self._timers))

	def onTimer(self, tid, userArg):
		"""
		定时器引擎回调
		:param tid: 定时器ID
		:param userArg: 用户参数
		:return:
		"""
		delay, callback = self._timers[tid]
		if delay <= 0:
			# 移除一次性定时器
			DEBUG_MSG("id:{} onTimer cancel_timer tid:{}".format(self.id, tid))
			self.cancel_timer(tid)
		callback()

	def clear_timers(self):
		for tid in list(self._timers.keys()):
			self.cancel_timer(tid)

		self._timers = {}
		self.add_timer = self.add_repeat_timer = self.onTimer = NonexistentSwallower()

	def destroySelf(self, deleteFromDB = False):
		self.clear_timers()
		not self.isDestroyed and self.destroy(deleteFromDB)
