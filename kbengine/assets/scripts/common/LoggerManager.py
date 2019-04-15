# -*- coding: utf-8 -*-
import sys
from KBEDebug import *
from SimpleHttpClient import SimpleHttpClient

class LoggerManager(object):
	#设备信息字段
	#DeviceFieldSet = ('unique_tag', 'ip', 'ipv6', 'device_model', 'os_name', 'root_mark', \
	#						'os_ver', 'mac_addr', 'udid', 'nation', 'app_channel', \
	#						'app_ver', 'isp', 'network', 'device_height', 'device_width')
	DeviceFieldSet = ('ip', 'device_model', 'os_name', 'os_ver', 'device_uuid', 'app_ver', 'network', 'device_height', 'device_width')
	
	#服务器信息字段
	ServerFieldSet = ('server',)
	
	#账号信息字段
	UserFieldSet = ('account_id', 'avatar_name', 'avatar_uuid', 'entity_id', 'avatar_user_id')

	#日志字段
	OptionFields = {
		'CreateAccount':['avatar_uuid','ip', 'account_id', 'device_model', 'server', 'avatar_user_id',
						 ],
		'Login':['avatar_uuid', 'ip', 'account_id', 'device_model', 'server',  'avatar_user_id',
				 ],
		'LogOut':['avatar_uuid', 'ip', 'account_id', 'device_model', 'server',  'avatar_user_id',
				 ],
		'LogOutInfo':['avatar_uuid', 'ip', 'account_id', 'device_model', 'server',  'avatar_user_id',
				 'logout_type'],

		'BuyItem':['avatar_uuid', 'ip', 'entity_id', 'account_id',  'avatar_user_id',
				   'pre_diamond', 'last_diamond', 'cost', 'itemId'],

		'HuntCouponReward':['avatar_uuid', 'ip', 'entity_id', 'account_id',  'avatar_user_id',
					 'last_coupon', 'used_coupon', 'item_uuid', 'itemId'],
		'ExchangeCouponReward':['avatar_uuid', 'ip', 'entity_id', 'account_id',  'avatar_user_id',
						 'last_coupon', 'used_coupon', 'itemId'],

		'ExchangeRewardByAddress':['avatar_uuid', 'ip', 'entity_id', 'account_id', 'server',  'avatar_user_id',
				  'itemId', 'itemName', 'name', 'tel', 'addr', 'email', 'payTel'],

		'WinGift':['avatar_uuid', 'ip', 'entity_id', 'account_id',  'avatar_user_id',
					 	  'room_type', 'gift_type'],

		'AddMail' : ['avatar_uuid', 'ip', 'entity_id', 'account_id',  'avatar_user_id',
					 'mail_info'],

		'PayedItem':['avatar_uuid', 'ip', 'entity_id', 'account_id', 'server',  'avatar_user_id',
			   'payedItemId'],

		'RobotAddWealth':['avatar_uuid', 'ip', 'entity_id', 'account_id', 'server',  'avatar_user_id',
				  'add_wealth'],

		'SoltMachine':['avatar_uuid', 'ip', 'entity_id', 'account_id', 'server',  'avatar_user_id',
				  'basechip', 'reward'],

		'GetPayedAction':['uuid', 'itemId'],
		'LosePlayerInPaying':['uuid', 'itemId'],

		'GameRoomInfo':['avatar_wealth', 'player_num', 'watch_num', 'waiting_num', 'bot_num', 'act_type', 'avatar_uuid', 'room_type', 'room_id'],
	}

	def __init__(self):
		self.device_info = {}
		self.server_info = {}
		self.user_info = {}
		self.httpClient = SimpleHttpClient()
		
	def set_user_info(self, user_info):
		self.user_info = user_info
		
	def set_device_info(self, device_info):
		self.device_info = device_info

	def set_server_info(self, server_info):
		self.server_info = server_info

	def calLog(self, operation, info):
		json_dict = {}
		if operation not in LoggerManager.OptionFields:
			return json_dict
		#log_time = time.strftime("%Y-%m-%d %H:%M:%S")
		fields = LoggerManager.OptionFields[operation]
		for f in fields:
			if f not in info:
				#公共字段
				if f in LoggerManager.ServerFieldSet and f in self.server_info:
					json_dict[f] = self.server_info[f]
					continue
				elif f in LoggerManager.UserFieldSet and f in self.user_info:
					json_dict[f] = self.user_info[f]
					continue
				elif f in LoggerManager.DeviceFieldSet and f in self.device_info:
					json_dict[f] = self.device_info[f]
					continue

		json_dict.update(info)
		INFO_MSG('SALOG[%s]:%s' % (operation, str(json_dict)))
		return json_dict

	def log(self, operation, info):
		json_dict = self.calLog(operation, info)

	def httplog(self, operation, info):
		json_dict = self.calLog(operation, info)
		self.httpClient.sendTcpHttpLog(operation, json_dict)

