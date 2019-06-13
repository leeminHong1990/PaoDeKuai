# -*- coding:utf-8 -*-

data = {
	1: {
		'id'	: 1,
		'type'	: 1,
		'op'	: {
			'game_mode'		: 0,
			'game_round'	: 10,
			'player_num'	: 3,
			'game_function'	: 1,
			'game_start'	: 0,
			'game_hei3'		: 1,
			'game_deal'		: 0,
			'game_force'	: 0,
			'game_cardnum'	: 0,
			'game_plays'	: [0, 1, 0, 0],
			'game_end'		: [1, 0, 1, 0],
			'anticheating'	: 1,
			'is_competition': 1,
			'is_agent'		: 0,
		},
		'maxLose'	: 100,
		'time'		: {
			('10:00:00', '22:00:00'): [0,1,2,3,4,6]
		},
		'free'		: 3,
		'cost'		: (1, 0), # (房卡，钻石)
		'rewardRank': 10,
		'reward':[3,2,1]
	},
	2: {
		'id'	: 2,
		'type'	: 2,
		'op'	: {
			'game_mode'		: 0,
			'game_round'	: 10,
			'player_num'	: 3,
			'game_function'	: 1,
			'game_start'	: 0,
			'game_hei3'		: 1,
			'game_deal'		: 0,
			'game_force'	: 0,
			'game_cardnum'	: 0,
			'game_plays'	: [0, 1, 0, 0],
			'game_end'		: [1, 0, 1, 0],
			'anticheating'	: 1,
			'is_competition': 1,
			'is_agent'		: 0,
		},
		'maxLose'	: 100,
		'time'		: {
			('01:00:00', '23:00:00'): [5]
		},
		'free'		: 0,
		'cost'		: (1, 0), # (房卡，钻石)
		'rewardRank': 10,
		'reward': [108, 78, 58, 10, 10, 10, 10, 10, 10,10]
	}
}