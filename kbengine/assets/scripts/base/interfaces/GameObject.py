# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *

class GameObject:
	"""
	服务端游戏对象的基础接口类
	"""
	def __init__(self):
		pass

	def onEnterWorld(self):
		"""
		KBEngine method.
		这个entity已经进入世界了
		"""
		pass
		
	def onLeaveWorld(self):
		"""
		KBEngine method.
		这个entity将要离开世界了
		"""
		pass
		
	def getScriptName(self):
		return self.__class__.__name__
			

	def destroySelf(self):
		"""
		virtual method
		"""
		if self.cell is not None:
			# 销毁cell实体
			self.destroyCellEntity()
			return
			
		# 销毁base
		self.destroy()
		
	def onGetCell(self):
		"""
		KBEngine method.
		entity的cell部分实体被创建成功
		"""
		DEBUG_MSG("%s::onGetCell: %i" % (self.getScriptName(), self.id))
		pass
		
	def onLoseCell(self):
		"""
		KBEngine method.
		entity的cell部分实体丢失
		"""
		DEBUG_MSG("%s::onLoseCell: %i" % (self.getScriptName(), self.id))
		self.destroySelf()

	def onRestore(self):
		"""
		KBEngine method.
		entity的cell部分实体被恢复成功
		"""
		DEBUG_MSG("%s::onRestore: %s" % (self.getScriptName(), self.cell))
		