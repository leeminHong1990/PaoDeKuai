# -*- coding: utf-8 -*-
ACCOUNT_LOGIN_SECRET = ''

CLIENT_VERSION = ''

PUBLISH_VERSION = 0

DEBUG_BASE = 1

PHP_SERVER_URL = 'http://10.0.0.4:9981/api/'
PHP_SERVER_SECRET = "zDYnetiVvFgWCRMIBGwsAKaqPOUjfNXS"

#计算消耗
def calc_cost(game_round):
	diamond_cost = 0
	if game_round == 10:
		diamond_cost = 1
	if game_round == 20:
		diamond_cost = 2
	return (0, diamond_cost)