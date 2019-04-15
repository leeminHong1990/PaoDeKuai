# -*- coding: utf-8 -*-

import KBEngine
from KBEDebug import *
import utility
import const
import random

class iRoomRules(object):

	def __init__(self):
		# 房间的牌堆
		self.cards = []

	def initCards(self, game_mode):
		if game_mode == 0:
			self.cards = const.CLASSIC_HEI  + const.CLASSIC_HONG  + const.CLASSIC_MEI  + const.CLASSIC_FANG
		elif game_mode == 1:
			self.cards = const.FIFTY_HEI  + const.FIFTY_HONG  + const.FIFTY_MEI  + const.FIFTY_FANG
		elif game_mode == 2:
			if self.game_cardnum == 0:
				self.cards = const.CLASSIC_HEI  + const.CLASSIC_HONG  + const.CLASSIC_MEI  + const.CLASSIC_FANG
			elif self.game_cardnum == 1:
				self.cards = const.FIFTY_HEI  + const.FIFTY_HONG  + const.FIFTY_MEI  + const.FIFTY_FANG
			else:
				self.cards = const.HEI  + const.HONG  + const.MEI  + const.FANG
		self.shuffle_cards()

	def shuffle_cards(self):
		random.shuffle(self.cards)

	def deals(self):
		# self.player_cards_list[0] = [42, 43,65,66,73,74,75,81,82,83,89,97,98,105,106,107]
		# self.player_cards_list[1] = [25,33,34,41,44,49,50,51,57,58,59,67,84,108,114,132]
		# self.player_cards_list[2] = [26,27,28,35,36,52,60,68,76,90,91,92,99,100,115,116]
		self.player_cards_list[0] = [25,105,106,28,33,34,35,36,41,67,43,44,49,50,108,52]
		self.player_cards_list[1] = [57,58,59,60,65,66,98,68,73,74,75,76,51,89,83,91]
		self.player_cards_list[2] = [84,90,92,97,42,99,100,26,27,107,81,114,115,116,132,82]

		for i in range(len(self.players_list)):
			self.players_list[i].cards = self.player_cards_list[i]
			DEBUG_MSG("player cards: {0}".format(self.players_list[i].cards))

	def deal(self):
		""" 发牌 """
		if len(self.cards) == 48:
			deal_list = [[1,1,1,1],[1,5,5,5],[4,4,4,4]]
			self.deal_function(deal_list[self.game_deal])
		elif len(self.cards) == 45:
			deal_list = [[1,1,1,1],[5,5,5],[2,3,5,5]]
			self.deal_function(deal_list[self.game_deal])
		elif len(self.cards) == 52:
			deal_list = [[1,1,1,1],[3,5,5],[4,4,5]]
			self.deal_function(deal_list[self.game_deal])
		elif len(self.cards) == 108:				#两副牌，每人27张牌,共108张牌
			if self.game_deal == 0:
				self.deal_function([1,1,1,1])
			elif self.game_deal == 1:
				for j in range(len(self.player_cards_list)):
					self.player_cards_list[j].extend(self.cards[0:3])
					self.cards = self.cards[3:]
				while len(self.cards) > 0:
					for j in range(len(self.player_cards_list)):
						self.player_cards_list[j].extend(self.cards[0:6])
						self.cards = self.cards[6:]
			elif self.game_deal == 2:
				for j in range(len(self.player_cards_list)):
					self.player_cards_list[j].extend(self.cards[0:6])
					self.cards = self.cards[6:]
				while len(self.cards) > 0:
					for j in range(len(self.player_cards_list)):
						self.player_cards_list[j].extend(self.cards[0:7])
						self.cards = self.cards[7:]
		else:
			for i in range(len(self.cards) / len(self.player_cards_list)):
				for j in range(len(self.player_cards_list)):
					self.player_cards_list[j].append(self.cards[j])
				self.cards = self.cards[self.player_num:]

		for i in range(len(self.players_list)):
			self.players_list[i].cards = self.player_cards_list[i]
			self.players_list[i].tidy()
			# DEBUG_MSG("player cards: {0}".format(self.players_list[i].cards))

	def deal_function(self, deal_list):
		""" 发牌方法 """
		i = 0
		# DEBUG_MSG("deal_list:{}".format(deal_list))
		while len(self.cards) > 0:
			for j in range(len(self.player_cards_list)):
				# DEBUG_MSG("self.cards:{}".format(self.cards))
				# DEBUG_MSG("self.players_list[{0}].cards:{1}".format(j, self.players_list[j].cards))
				deal_num = deal_list[(len(deal_list) + i) % len(deal_list)] #获得本次需要发牌的数量,比如355分,有时候发3张,有时候发5张
				self.player_cards_list[j].extend(self.cards[:deal_num])
				self.cards = self.cards[deal_num:]
				i += 1

	def random_key_card(self):
		cards = []
		threeCards = [25, 26, 27, 28]
		if self.game_cardnum == 0:
			cards = const.CLASSIC_HEI  + const.CLASSIC_HONG  + const.CLASSIC_MEI  + const.CLASSIC_FANG
		elif self.game_cardnum == 1:
			cards = const.FIFTY_HEI  + const.FIFTY_HONG  + const.FIFTY_MEI  + const.FIFTY_FANG
		else:
			cards = const.HEI  + const.HONG  + const.MEI  + const.FANG
		self.key_card = random.choice(cards)
		if self.key_card in threeCards:
			self.random_key_card()

	def can_play_cards(self, playerCards, cards, idx, curRound):
		if len(cards) <= 0:
			return False, cards, 0
		if self.game_hei3 == 0 and curRound != 1 and sum([len(i) for i in self.players_discard_list]) == 0:
			if const.HEI_THREE not in cards:
				return False, cards, 1
		if not utility.getCanPlay(cards, playerCards, self.game_plays,self.key_card):
			return False, cards, 0
		if not self.check_has_card(playerCards, cards):
			DEBUG_MSG("palyer not has all cards.")
			return False, cards, 0
		if self.game_mode == 2:
			normalCards, keyCards = utility.classifyCards(cards, self.key_card)
			normalCardsShift = utility.rightShiftCards(normalCards)
			keyCardsShift = utility.rightShiftCards(keyCards)
			if len(normalCards) == 0 and len(keyCards) == 4:
				return True,cards,0
			typeList =[]
			if self.wait_idx == self.controller_idx:
				typeList = utility.getInsteadCardsType(normalCardsShift, keyCardsShift)
			else:
				controllerType = utility.getNormalCardsType(utility.rightShiftCards(self.controller_discard_list), playerCards, len(playerCards), self.game_plays, self.game_end,0,self.key_card)
				if utility.checkIsKeyCardBomb(normalCardsShift, keyCardsShift):
					controllerType = const.TYPE_BOMB
					typeList.append(controllerType)
				else:
					if not utility.IsCardsTypeSame(normalCardsShift,keyCardsShift,controllerType):
						typeList = utility.getInsteadCardsType(normalCardsShift, keyCardsShift)	
					else:
						typeList.append(controllerType)	
		
			DEBUG_MSG("normalCards:{0}, keyCards:{1}".format(normalCards, keyCards))
			DEBUG_MSG("normalCardsShift:{0}, keyCardsShift:{1}".format(normalCardsShift, keyCardsShift))			
			DEBUG_MSG("getInsteadCardsType:{0}".format(utility.getInsteadCardsType(normalCardsShift, keyCardsShift)))
			for i in range(len(typeList)):
				makeDisCardPoker = utility.makeCard(cards,typeList[i], self.key_card)
				DEBUG_MSG("makeDiscardPoker:{0}".format(makeDisCardPoker))
				if self.can_play_normal_cards(makeDisCardPoker, idx, playerCards):
					return True,makeDisCardPoker, 0
		else:
			if  self.can_play_normal_cards(cards, idx, playerCards):
				return True, cards, 0

		return False, cards, 0

	def check_has_card(self, playerCards, cards):
		cardsDict = utility.getCard2NumDict(cards)
		playerCardsDict = utility.getCard2NumDict(playerCards)
		for card in cardsDict:
			if card not in playerCardsDict or cardsDict[card] > playerCardsDict[card]:
				return False
		return True

	def can_play_normal_cards(self, cards, idx, playerCards):
		DEBUG_MSG("can_nomal_play_cards")
		if self.wait_idx == self.controller_idx:
			discardType = utility.getNormalCardsType(utility.rightShiftCards(cards), playerCards, len(playerCards), self.game_plays, self.game_end,0,self.key_card)
		else:
			discardType = utility.getNormalCardsType(utility.rightShiftCards(cards), playerCards, len(playerCards), self.game_plays, self.game_end,1,self.key_card)
		
		controllerType = utility.getNormalCardsType(utility.rightShiftCards(self.controller_discard_list), playerCards, len(playerCards), self.game_plays, self.game_end,0,self.key_card)
		# if self.controller_idx == idx:
		# 	self.cotroller_type = 100
		# else:
		# 	self.cotroller_type = controllerType

		DEBUG_MSG("discardType: {0} controllerType: {1}".format(discardType , controllerType))
		if discardType == const.TYPE_NO_CARD or discardType == const.TYPE_INVALID:
			DEBUG_MSG("error discard type.")
			return False		
		if discardType == const.TYPE_TRIPLE and len(playerCards) != const.TYPE_PAIR:
			return False
		if discardType == const.TYPE_TRIPLE_ONE and len(playerCards) != const.TYPE_SERIAL_PAIR:
			return False

		#自由出牌
		if self.controller_idx == idx: #其他玩家要不起 ,如果牌打完 controller_idx 转移到了 对家身上
			DEBUG_MSG("free to play.")
			return True

		#牌型 判断是否 压过前一次出的牌
		DEBUG_MSG("controllerType:{0},discardType:{1}.".format(controllerType, discardType))
		if controllerType == discardType:
			if len(self.controller_discard_list) != len(cards):
				if controllerType == const.TYPE_PLANE_ONE and self.game_end[3] == 1 and len(utility.rightShiftCards(cards)) == len(playerCards):
					return utility.cmpSameTypeCards(self.controller_discard_list, cards, discardType)
				return False
			return utility.cmpSameTypeCards(self.controller_discard_list, cards, discardType)
		elif self.game_end[1] == 1 and len(utility.rightShiftCards(cards)) == len(playerCards) and controllerType == const.TYPE_TRIPLE_TWO and (discardType == const.TYPE_TRIPLE_ONE or discardType == const.TYPE_TRIPLE):
			return utility.cmpSameTypeCards(self.controller_discard_list, cards, discardType)
		elif self.game_end[3] == 1 and len(utility.rightShiftCards(cards)) == len(playerCards) and controllerType == const.TYPE_PLANE_ONE and discardType == const.TYPE_SERIAL_TRIPLE:
			return utility.cmpSameTypeCards(self.controller_discard_list, cards, discardType)
		elif discardType > controllerType:
			if discardType == const.TYPE_BOMB:
				return True
			else:
				return False
		return False

