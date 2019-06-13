# -*- coding:utf-8 -*-

from collections import OrderedDict

class SPORT_WEEKLY_RECORD_INFO_DICT_PICKLER(object):

	def __init__(self):
		pass

	# 此接口被C++底层调用
	# 引擎将数据交给脚本层管理，脚本层可以将这个字典重定义为任意类型
	# createObjFromDict被调用后，返回的数据将直接赋值到脚本中的变量
	def createObjFromDict(self, dct):
		values = dct['values']
		orderDict = OrderedDict()
		for info in values:
			orderDict[info["userId"]] = dict(info)
		orderDict = OrderedDict(sorted(orderDict.items(), key=lambda t: t[1]["score"]))
		return orderDict

	# 此接口被C++底层调用
	# 底层需要从脚本层中获取数据，脚本层此时应该将数据结构还原为固定字典
	def getDictFromObj(self, obj):
		data = []
		for k in obj:
			data.append(obj[k])
		return {'values': data}

	def isSameType(self, obj):
		return isinstance(obj, OrderedDict)

inst = SPORT_WEEKLY_RECORD_INFO_DICT_PICKLER()