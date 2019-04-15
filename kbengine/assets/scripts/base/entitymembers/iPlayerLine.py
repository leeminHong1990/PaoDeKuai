# -*- coding: utf-8 -*-

import KBEngine
from KBEDebug import *
import utility
import const
import copy

class iPlayerLine(object):

	def __init__(self):
		return

	def getCardByNum(self, card2NumDict, cardNum):
		num2CardDict = {}
		for card in card2NumDict:
			if card2NumDict[card] not in num2CardDict:
				num2CardDict[card2NumDict[card]] = []
			num2CardDict[card2NumDict[card]].append(card)
		if cardNum in num2CardDict:
			return sorted(num2CardDict[cardNum])
		return []

	def splitBombList(self, card2NumDict, bigJokerNum): #分开连续 和不连续的
		keyList = []
		for card in card2NumDict:
			if card2NumDict[card] >= 4 - bigJokerNum:
				keyList.append(card)

		keyList = sorted(keyList)

		serialList = []
		singleList = []
		if const.CARD2 in keyList:
			tempList = []
			for i in range(len(const.CIRCLE)):
				if const.CIRCLE[i] in keyList:
					tempList.append(const.CIRCLE[i])
				else:
					break
			for i in range(len(const.CIRCLE))[::-1]:
				if const.CIRCLE[i] in copySerial:
					tempList.insert(0, const.CIRCLE[i])
				else:
					break

			if len(tempList) >= 3:
				makeList = []
				for i in range(len(tempList)):
					card = tempList[i]
					makeList.append([card] * card2NumDict[card])
					keyList.remove(card)
				serialList.append(makeList)

		while len(keyList) > 0:
			tempList = [keyList[0]]
			for i in range(len(keyList)-1):
				if keyList[i] + 1 == keyList[i+1]:
					tempList.append(keyList[i+1])
				else:
					break
			if len(tempList) >= 3:
				makeList = []
				for i in range(len(tempList)):
					card = tempList[i]
					makeList.append([card] * card2NumDict[card])
					keyList.remove(card)
				serialList.append(makeList)
			else:
				for j in range(len(tempList)):
					card = tempList[j]
					singleList.append([card] * card2NumDict[card])
					keyList.remove(card)
		return serialList, singleList

	def cal_hand_line(self, cards):
		notBigJokers, smallJokers, bigJokers = self.classifyJokerCards(cards)
		smallJokerNum = len(smallJokers)
		bigJokerNum = len(bigJokers)
		card2NumDict = utility.getCard2NumDict(utility.rightShiftCards(notBigJokers))
		serialList, singleList = self.splitBombList(card2NumDict, bigJokerNum)

		for i in range(bigJokerNum + 1):
			for j in range(len(serialList)):
				serial = serialList[j]
				for k in range(len(serial) - 3 + 1): #len(serial) 个 减去 k 个组成炸弹
					for x in range(k): #左 删除 x, 右 删除 k-x-1
						left = x
						right = k-x-1
						pass

	# def tryMakeCircleSerialLine(self, card2NumDict, cardList, line_list, line):
	# 	if utility.checkIsCircleSerialThan3(cardList):
	# 		line_list[line - 4] += 1
	# 		for card in cardList:
	# 			del card2NumDict[card]
	# 		return True
	# 	return False

	# def cal_hand_line(self, cards):
		
	# 	notBigJokers, smallJokers, bigJokers = self.classifyJokerCards(cards)
	# 	card2NumDict = utility.getCard2NumDict(notBigJokers)

	# 	smallJokerNum = len(smallJokers)
	# 	bigJokerNum = len(bigJokers)

	# 	maxLine = 0
	# 	line_list = [0] * 8
	# 	line = 11
	# 	while line >= 4:
	# 		card8List = self.getCardByNum(card2NumDict, 8)
	# 		card7List = self.getCardByNum(card2NumDict, 7)
	# 		card6List = self.getCardByNum(card2NumDict, 6)
	# 		card5List = self.getCardByNum(card2NumDict, 5)
	# 		card4List = self.getCardByNum(card2NumDict, 4)
	# 		card3List = self.getCardByNum(card2NumDict, 3)
	# 		card2List = self.getCardByNum(card2NumDict, 2)
	# 		if line == 11: #一副牌只有一个
	# 			if len(card8List) == 3:	# 888 - 0 - 3
	# 				if self.tryMakeCircleSerialLine(card2NumDict, [card8List[0], card8List[1], card8List[2]], line_list, line):
	# 					continue
	# 			if bigJokerNum >= 1:
	# 				if len(card8List) >= 2 and len(card7List) >= 1: # 887 - 1 - 3
	# 					if self.tryMakeCircleSerialLine(card2NumDict, [card8List[0], card8List[1], card7List[0]], line_list, line):
	# 						bigJokerNum -= 1
	# 						continue

	# 				if bigJokerNum >= 2 and len(card8List) >= 2 and len(card6List) >= 1: # 886 - 2 - 3
	# 					if self.tryMakeCircleSerialLine(card2NumDict, [card8List[0], card8List[1], card6List[0]], line_list, line):
	# 						bigJokerNum -= 2
	# 						continue
	# 			line -= 1
	# 		elif line == 10: # 先算连炸 再算 分开炸, 从每个线数最大的开始算
	# 			#3个7线
	# 			if len(card7List) >= 3: # 777 - 0 - 6
	# 				if self.tryMakeCircleSerialLine(card2NumDict, [card7List[0], card7List[1], card7List[2]], line_list, line):
	# 					continue
	# 			if bigJokerNum >= 1:
	# 				if len(card7List) >= 2 and len(card6List) >= 1: # 776 - 1 - 6
	# 					isHasLine776 = False
	# 					for j in range(len(card6List)):
	# 						if self.tryMakeCircleSerialLine(card2NumDict, [card7List[0], card7List[1], card6List[j]], line_list, line):
	# 							bigJokerNum -= 1
	# 							isHasLine776 = True
	# 					if isHasLine776:
	# 						continue

	# 				if bigJokerNum >= 2 and len(card7List) >= 1 and len(card6List) >= 2: # 775 - 2 - 6
	# 					if self.tryMakeCircleSerialLine(card2NumDict, [card7List[0], card7List[1], card5List[0]], line_list, line):
	# 						bigJokerNum -= 2
	# 						continue

	# 				if bigJokerNum >= 2 and len(card7List) >= 1 and len(card6List) >= 2: # 766 - 2 - 6
	# 					if self.tryMakeCircleSerialLine(card2NumDict, [card7List[0], card6List[0], card6List[1]], line_list, line):
	# 						bigJokerNum -= 2
	# 						continue

	# 			#4个6线
	# 			if len(card6List) >= 4: #666 - 0 - 3
	# 				if self.tryMakeCircleSerialLine(card2NumDict, [card6List[0], card6List[1], card6List[2], card6List[3]], line_list, line):
	# 					continue

	# 			if bigJokerNum >= 1:
	# 				if len(card6List) >= 3 and len(card5List) >= 1: # 6665 - 1 - 3
	# 					if self.tryMakeCircleSerialLine(card2NumDict, [card6List[0], card6List[1], card6List[2], card5List[0]], line_list, line):
	# 						bigJokerNum -= 1
	# 						continue

	# 				if len(card6List) >= 2 and len(card5List) >= 2: # 6664 - 2 - 3
	# 					if self.tryMakeCircleSerialLine(card2NumDict, [card6List[0], card6List[1], card6List[2], card4List[1]], line_list, line):
	# 						bigJokerNum -= 2
	# 						continue

	# 				if len(card6List) >= 2 and len(card5List) >= 2: # 6655 - 2 - 3
	# 					if self.tryMakeCircleSerialLine(card2NumDict, [card6List[0], card6List[1], card5List[0], card5List[1]], line_list, line):
	# 						bigJokerNum -= 2
	# 						continue
					
	# 			#5个5线
	# 			if len(card5List) >= 5:  #55555 - 0 - 2
	# 				if self.tryMakeCircleSerialLine(card2NumDict, [card5List[0], card5List[1], card5List[2], card5List[3], card5List[4]], line_list, line):
	# 					continue

	# 			if bigJokerNum >= 1:
	# 				if len(card5List) >= 4 and len(card4List) >= 1: # 55554 - 1 - 2
	# 					if self.tryMakeCircleSerialLine(card2NumDict, [card5List[0], card5List[1], card5List[2], card5List[3], card4List[0]], line_list, line):
	# 						bigJokerNum -= 1
	# 						continue
	# 				if bigJokerNum >= 2 and len(card5List) >= 3 and len(card4List) >= 2: # 55544 - 2 - 2
	# 					if self.tryMakeCircleSerialLine(card2NumDict, [card5List[0], card5List[1], card5List[2], card4List[0], card4List[1]], line_list, line):
	# 						bigJokerNum -= 2
	# 						continue
	# 			#6个4线
	# 			if len(card4List) >= 6:  #444444 - 0 - 3
	# 				if self.tryMakeCircleSerialLine(card2NumDict, [card4List[0], card4List[1], card4List[2], card4List[3], card4List[4], card4List[5]], line_list, line):
	# 					continue
	# 			if bigJokerNum >= 1:
	# 				card4List = self.getCardByNum(card2NumDict, 4)
	# 		elif line == 9:
	# 			pass
	# 		elif line == 8:
	# 			pass
	# 		elif line == 7:
	# 			pass
	# 		elif line == 6:
	# 			pass
	# 		elif line == 5:
	# 			pass
	# 		elif line == 4:
	# 			pass


	def classifyJokerCards(self, cards):
		normalCards = []
		smallJokers = []
		bigJokers = []
		for line in range(len(cards)):
			if cards[line] in const.HEI or cards[line] in const.HONG or cards[line] in const.MEI or cards[line] in const.FANG:
				normalCards.append(cards[line])
			elif cards[line] in const.JOKER and const.JOKER.index(cards[line]) == 0:
				smallJokers.append(cards[line])
			elif cards[line] in const.JOKER and const.JOKER.index(cards[line]) == 1:
				bigJokers.append(cards[line])
			else:
				DEBUG_MSG("error-error not has this card:{}".format(cards[line]))
		return normalCards, smallJokers, bigJokers

	

