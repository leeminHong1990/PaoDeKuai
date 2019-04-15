# -*- coding: utf-8 -*-

import KBEngine
from KBEDebug import *
import utility
import const
import random
import copy


class iRoomTips(object):
    def __init__(self):
        self.tipsList = []

    def getTipsCards(self, idx):
        DEBUG_MSG("getTipsCards controller_idx: {0}, idx: {1}".format(self.controller_idx, idx))
        DEBUG_MSG("getTipsCards controller_discard: {0}".format(self.controller_discard_list))
        tips = []
        if self.controller_idx == idx:  # 玩家自由出牌
            self.controller_discard_list = []
            tips = self.getSerialPairTips(idx, 2, 2, True)  # 连对
            tips.extend(self.getSingleSerialTips(idx, 5, 2))  # 顺子
            tips.extend(self.getTripleBring(idx, 5, []))  # 三带二
            tips.extend(self.getFourBring(idx, [], 2))  # 四带二
            tips.extend(self.getFourBring(idx, [], 3))  # 四带三
            tips.extend(self.getTipsPlane(idx, []))  # 飞机
            # tips.extend(self.getTripleTips(idx, 2))  # 三张
            tips.extend(self.getDoubleTips(idx, 0, True))  # 对子
            tips.extend(self.getSingleTips(idx, 0, True))  # 单张
            tips.extend(self.getBombTips(idx, []))  # 炸弹
            tips.extend(self.getTripleTipsSingle(idx, 2))  # 三张
        else:  # 压过上家
            discardCards = self.controller_discard_list
            controllerCards = utility.rightShiftCards(discardCards)
            controllerCardsType = utility.getNormalCardsType(controllerCards, [], 0, self.game_plays, self.game_end, 0,
                                                             0)
            controllerCards = sorted(controllerCards)
            DEBUG_MSG("last cards {0}, last cardsType {1}".format(controllerCards, controllerCardsType))
            if controllerCardsType == const.TYPE_SINGLE:  # 单张
                tips = self.getSingleTips(idx, controllerCards[0], False)
                tips.extend(self.getBombTips(idx, []))
            elif controllerCardsType == const.TYPE_PAIR:  # 对子
                tips = self.getDoubleTips(idx, controllerCards[0], False)
                tips.extend(self.getBombTips(idx, []))
            elif controllerCardsType == const.TYPE_SERIAL_PAIR:  # 连对
                tips = self.getSerialPairTips(idx, int(len(controllerCards) / 2), controllerCards[0], False)
                tips.extend(self.getBombTips(idx, []))
            elif controllerCardsType == const.TYPE_TRIPLE:  # 三张
                tips = self.getTripleTips(idx, controllerCards[0])
                tips.extend(self.getBombTips(idx, []))
            elif controllerCardsType == const.TYPE_SERIAL_SINGLE:  # 顺子
                tips = self.getSingleSerialTips(idx, len(controllerCards), controllerCards[0])
                tips.extend(self.getBombTips(idx, []))
            elif controllerCardsType == const.TYPE_TRIPLE_TWO:  # 三带二
                tips = self.getTripleBring(idx, len(controllerCards), controllerCards)
                tips.extend(self.getBombTips(idx, []))
            elif controllerCardsType == const.TYPE_FOUR_TWO:  # 四带二
                tips = self.getFourBring(idx, controllerCards, 2)
                tips.extend(self.getBombTips(idx, []))
            elif controllerCardsType == const.TYPE_FOUR_THREE:  # 四带三
                tips = self.getFourBring(idx, controllerCards, 3)
                tips.extend(self.getBombTips(idx, []))
            elif controllerCardsType == const.TYPE_PLANE_ONE:  # 飞机
                tips = self.getTipsPlane(idx, controllerCards)
                tips.extend(self.getBombTips(idx, []))
            elif controllerCardsType == const.TYPE_BOMB:  # 炸弹
                tips = self.getBombTips(idx, discardCards)

        self.tipsList = tips[:]
        DEBUG_MSG("tipsList {}".format(self.tipsList))
        return self.tipsList

    def getHandCards(self, idx):
        handCards = []
        for i, p in enumerate(self.players_list):
            if p and i == idx:
                handCards = p.cards[:]

        handCards = sorted(handCards)
        cards, keyCards = utility.classifyCards(handCards, self.key_card)
        keyCardNum = len(keyCards)
        if keyCardNum > 0:
            keyCard = keyCards[0]
        else:
            keyCard = 0
        return cards, keyCardNum, keyCard

    def getSingleTips(self, idx, minCard, isOnlySingle):
        # 单张提示
        tipsList = []
        allTipsList = []
        cards = []
        for i, p in enumerate(self.players_list):
            if p and i == idx:
                cards = copy.deepcopy(p.cards)

        shiftCards = utility.rightShiftCards(cards)
        shiftCards2NumDict = utility.getCard2NumDict(shiftCards)

        # 单张优先
        for i in range(len(shiftCards)):
            if (not minCard or shiftCards[i] > minCard) and shiftCards2NumDict[shiftCards[i]] == 1:
                tipsList.append([cards[i]])
                allTipsList.append(cards[i] >> 3)

        # 对子
        if not isOnlySingle:
            for i in range(len(shiftCards)):
                if (not minCard or shiftCards[i] > minCard) and shiftCards2NumDict[shiftCards[i]] == 2 and (
                            shiftCards[i] not in allTipsList):
                    tipsList.append([cards[i]])
                    allTipsList.append(cards[i] >> 3)

        # 三张
        if not isOnlySingle:
            for i in range(len(shiftCards)):
                if (not minCard or shiftCards[i] > minCard) and shiftCards2NumDict[shiftCards[i]] == 3 and (
                            shiftCards[i] not in allTipsList):
                    tipsList.append([cards[i]])
                    allTipsList.append(cards[i] >> 3)

        DEBUG_MSG("dan zhang tipsList: {0}".format(tipsList))
        return tipsList

    def getDoubleTips(self, idx, minCard, isOnlyPair):
        # 对子提示
        tipsList = []
        cards, keyCardNum, keyCard = self.getHandCards(idx)
        # DEBUG_MSG("getDoubleTips cards: {}".format(cards))
        if len(cards) + keyCardNum < 2:
            return tipsList
        shiftCards = utility.rightShiftCards(cards)
        shiftCards2NumDict = utility.getCard2NumDict(shiftCards)

        # 仅一对优先
        for i in range(len(shiftCards) - 1):
            if shiftCards[i] == shiftCards[i + 1] and (not minCard or shiftCards[i] > minCard) and shiftCards2NumDict[
                shiftCards[i]] == 2:
                tipsList.append([cards[i], cards[i + 1]])

        # 三张
        if not isOnlyPair:
            for i in range(len(shiftCards) - 1):
                if shiftCards[i] == shiftCards[i + 1] and (not minCard or shiftCards[i] > minCard) and \
                                shiftCards2NumDict[
                                    shiftCards[i]] == 3:
                    tipsList.append([cards[i], cards[i + 1]])
        DEBUG_MSG("dui zi tipsList: {}".format(tipsList))

        # 带癞子的情况
        keyTipList = []
        if self.game_mode == 2 and keyCardNum > 0:
            oneKeyList = []
            for card in shiftCards2NumDict:
                if shiftCards2NumDict[card] == 1 and card > minCard:
                    oneKeyList.append(card)
            if len(oneKeyList) > 0:
                for i in range(len(oneKeyList)):
                    keySuggestList = []
                    keySuggestList.append(keyCard)
                    for j in range(len(shiftCards)):
                        if oneKeyList[i] == shiftCards[j]:
                            keySuggestList.append(cards[j])
                    keyTipList.append(keySuggestList)
            if keyCardNum >= 2 and (keyCard >> 3) > minCard:
                keyTempList = []
                keyTempList.append(keyCard)
                keyTempList.append(keyCard)
                keyTipList.append(keyTempList)
            tipsList.extend(keyTipList)
        return tipsList

    def getSerialPairTips(self, idx, pairNum, minCard, isSelfDiscard):
        tipsList = []
        cards, keyCardNum, keyCard = self.getHandCards(idx)

        if 28 in cards and self.game_hei3 == 1 and minCard == 2:
            tipsList.append([28])
            del cards[cards.index(28)]
        # DEBUG_MSG("getSerialPairTips cards: {}".format(cards))
        if len(cards) < pairNum * 2:
            return tipsList
        shiftCards = utility.rightShiftCards(cards)
        shiftCards2NumDict = utility.getCard2NumDict(shiftCards)

        # DEBUG_MSG("getSerialPairTips shiftCards: {}".format(shiftCards))
        # DEBUG_MSG("getSerialPairTips shiftCards2NumDict: {}".format(shiftCards2NumDict))
        cardsBack = []
        bomb_open = self.game_plays[3]  # 炸弹是否可以拆
        if bomb_open == 1:
            for i, card in enumerate(shiftCards):
                if shiftCards2NumDict[card] < 4:
                    cardsBack.append(cards[i])
        else:
            cardsBack = cards[:]
        cards2ListDict = utility.getListDict(cardsBack)
        # DEBUG_MSG("getSerialPairTips cards2ListDict: {}".format(cards2ListDict))
        # playerCardNum = 0
        if self.game_cardnum == 15:
            playerCardNum = 13
        else:
            playerCardNum = 14
        playerCardNum = playerCardNum - pairNum + 1
        # DEBUG_MSG("minCard ：{} {}".format(minCard,playerCardNum))
        for i in range((minCard + 1), playerCardNum + 1):
            pairCardNum = 0
            if isSelfDiscard:
                for j in range(playerCardNum):
                    if (i + j) in cards2ListDict and len(cards2ListDict[i + j]) >= 2:
                        pairCardNum += 1
                    else:
                        break
            else:
                for j in range(pairNum):
                    if (i + j) in cards2ListDict and len(cards2ListDict[i + j]) >= 2:
                        pairCardNum += 1
                    else:
                        break
            # DEBUG_MSG("getSerialPairTips pairCardNum: {}".format(pairCardNum))
            if pairCardNum >= pairNum:
                suggestList = []
                for j in range(pairCardNum):
                    suggestList.append(cards2ListDict[i + j][0])
                    suggestList.append(cards2ListDict[i + j][1])
                suggestList = sorted(suggestList)
                tipsList.append(suggestList)

        # 带癞子的情况
        if self.game_mode == 2 and keyCardNum > 0:
            for i in range(minCard + 1, playerCardNum - pairNum + 2):
                userKeyCardNum = keyCardNum
                pairCardNum = 0
                suggestList = []
                for j in range(pairNum):
                    if (i + j) not in cards2ListDict.keys():
                        userKeyCardNum -= 2
                        pairCardNum += 1
                        suggestList.append(keyCard)
                        suggestList.append(keyCard)
                    elif len(cards2ListDict[i + j]) >= 2:
                        pairCardNum += 1
                        suggestList.append(cards2ListDict[i + j][0])
                        suggestList.append(cards2ListDict[i + j][1])
                    elif len(cards2ListDict[i + j]) < 2:
                        userKeyCardNum -= 1
                        pairCardNum += 1
                        suggestList.append(cards2ListDict[i + j][0])
                        suggestList.append(keyCard)
                    if userKeyCardNum < 0:
                        pairCardNum -= 1
                        break

                if pairCardNum == pairNum and userKeyCardNum != keyCardNum:
                    suggestList = sorted(suggestList)
                    tipsList.append(suggestList)
        DEBUG_MSG("lian dui tipsList:{}".format(tipsList))
        return tipsList

    def getTripleTips(self, idx, minCard):
        # 三张提示
        tipsList = []
        cards, keyCardNum, keyCard = self.getHandCards(idx)
        # DEBUG_MSG("getTripleTips cards: {}".format(cards))
        if len(cards) < 3:
            return tipsList
        shiftCards = utility.rightShiftCards(cards)
        shiftCards2NumDict = utility.getCard2NumDict(shiftCards)

        # 炸弹是否可以拆
        threeKeyList = []
        bomb_open = self.game_plays[3]
        for card in shiftCards2NumDict:
            if bomb_open == 0 and shiftCards2NumDict[card] == 4:
                threeKeyList.append(card)
            if shiftCards2NumDict[card] == 3:
                threeKeyList.append(card)
        threeKeyList = sorted(threeKeyList)
        for i in range(len(threeKeyList)):
            serialNum = 0
            suggestList = []
            for j in range(len(shiftCards)):
                if serialNum == 3:
                    break
                if threeKeyList[i] == shiftCards[j]:
                    suggestList.append(cards[j])
                    serialNum += 1
            tipsList.append(suggestList)

        # 带癞子的情况
        keyTipList = []
        if self.game_mode == 2 and keyCardNum > 0:
            oneKeyList = []
            twoKeyList = []
            for card in shiftCards2NumDict:
                if card > minCard:
                    if shiftCards2NumDict[card] == 1:
                        oneKeyList.append(card)
                    if shiftCards2NumDict[card] == 2:
                        twoKeyList.append(card)
            if keyCardNum >= 2 and len(oneKeyList) > 0:
                for i in range(len(oneKeyList)):
                    keySuggestList = [keyCard, keyCard]
                    for j in range(len(shiftCards)):
                        if oneKeyList[i] == shiftCards[j]:
                            keySuggestList.append(cards[j])
                    keyTipList.append(keySuggestList)
            if keyCardNum >= 1 and len(twoKeyList) > 0:
                for i in range(len(twoKeyList)):
                    keySuggestList = [keyCard]
                    for j in range(len(shiftCards)):
                        if twoKeyList[i] == shiftCards[j]:
                            keySuggestList.append(cards[j])
                            keySuggestList.append(cards[j + 1])
                            break
                    keyTipList.append(keySuggestList)
            if keyCardNum >= 3:
                keyTempList = [keyCard, keyCard, keyCard]
                keyTipList.append(keyTempList)
            tipsList.extend(keyTipList)
        DEBUG_MSG("san zhang tipsList: {}".format(tipsList))
        return tipsList

    def getTripleTipsSingle(self, idx, minCard):
        tipsList = []
        cards, keyCardNum, keyCard = self.getHandCards(idx)
        # DEBUG_MSG("getTripleTips cards: {}".format(cards))
        if len(cards) != 3:
            return tipsList
        shiftCards = utility.rightShiftCards(cards)
        shiftCards2NumDict = utility.getCard2NumDict(shiftCards)
        if len(shiftCards2NumDict) == 1:
            tipsList.append([cards[0]])
        return tipsList

    def getSingleSerialTips(self, idx, serialNum, minCard):
        # 顺子提示
        tipsList = []
        cards, keyCardNum, keyCard = self.getHandCards(idx)
        # DEBUG_MSG("getSingleSerialTips cards: {}".format(cards))
        if len(cards) < serialNum:
            return tipsList
        shiftCards = utility.rightShiftCards(cards)
        shiftCards2NumDict = utility.getCard2NumDict(shiftCards)

        # DEBUG_MSG("getSingleSerialTips shiftCards:{}".format(shiftCards))
        # 炸弹是否可以拆
        cardsBack = []
        bomb_open = self.game_plays[3]  # 炸弹是否可以拆
        if bomb_open == 1:
            for i, card in enumerate(shiftCards):
                if shiftCards2NumDict[card] < 4:
                    cardsBack.append(cards[i])
        else:
            cardsBack = cards[:]
        cards2ListDict = utility.getListDict(cardsBack)

        # DEBUG_MSG("getSingleSerialTips cards2ListDict:{}".format(cards2ListDict))
        # 组成顺子
        for i in range((minCard + 1), (14 - serialNum + 1) + 1):
            singleSerialNum = 0
            for j in range(serialNum):
                if (i + j) in cards2ListDict and len(cards2ListDict[i + j]) >= 1:
                    singleSerialNum += 1
                else:
                    break
            if singleSerialNum >= serialNum:
                suggestList = []
                for j in range(serialNum):
                    suggestList.append(cards2ListDict[i + j][0])
                tipsList.append(suggestList)

        # 带癞子的情况
        if self.game_mode == 2 and keyCardNum > 0:
            for i in range(minCard + 1, 14 - serialNum + 2):
                useKeyCardNum = keyCardNum
                singleSerialNum = 0
                suggestList = []
                for j in range(serialNum):
                    if (i + j) not in cards2ListDict.keys():
                        useKeyCardNum -= 1
                        singleSerialNum += 1
                        suggestList.append(keyCard)
                    elif len(cards2ListDict[i + j]) >= 1:
                        singleSerialNum += 1
                        suggestList.append(cards2ListDict[i + j][0])
                    elif len(cards2ListDict[i + j]) < 1:
                        useKeyCardNum -= 1
                        singleSerialNum += 1
                        suggestList.append(keyCard)

                    if useKeyCardNum < 0:
                        singleSerialNum -= 1
                        break
                if singleSerialNum == serialNum and useKeyCardNum != keyCardNum:
                    suggestList = sorted(suggestList)
                    tipsList.append(suggestList)
        DEBUG_MSG("shun zi tipsList:{}".format(tipsList))
        return tipsList

    def getTripleBring(self, idx, cardsNum, controllerCards):
        tipsList = []
        minCard = 2
        # 判断上家三带二的坐子(三)
        if len(controllerCards) != 0:
            controllerDict = utility.getCard2NumDict(controllerCards)
            controllerKeyList = sorted(controllerDict.keys())
            for i in range(len(controllerKeyList)):
                if controllerDict[controllerKeyList[i]] >= 3:
                    minCard = controllerKeyList[i]
        cards, keyCardNum, keyCard = self.getHandCards(idx)
        # DEBUG_MSG("getTripleBring cards: {}".format(cards))
        shiftCards = utility.rightShiftCards(cards)
        shiftCards2NumDict = utility.getCard2NumDict(shiftCards)

        # 分离出list中的单张，对子，三张和炸弹
        oneKeyList = []
        twoKeyList = []
        threeKeyList = []
        fourKeyList = []
        bomb_open = self.game_plays[3]
        for card in shiftCards2NumDict:
            if minCard < card:
                if bomb_open == 0:
                    if shiftCards2NumDict[card] >= 3:
                        threeKeyList.append(card)
                else:
                    if shiftCards2NumDict[card] == 3:
                        threeKeyList.append(card)
                if shiftCards2NumDict[card] == 1:
                    oneKeyList.append(card)
                if shiftCards2NumDict[card] == 2:
                    twoKeyList.append(card)
            if shiftCards2NumDict[card] == 4:
                fourKeyList.append(card)

        # 写出各种三带二的情况
        for i in range(len(threeKeyList)):
            cardsTemp = []
            shiftCardsTemp = []
            for j in range(len(shiftCards)):
                if threeKeyList[i] != shiftCards[j]:
                    cardsTemp.append(cards[j])
                    shiftCardsTemp.append(shiftCards[j])
            cardsBack = []
            shiftCardsBack = []
            if bomb_open == 1 and len(fourKeyList) > 0:
                for j in range(len(fourKeyList)):
                    for k in range(len(shiftCardsTemp)):
                        if fourKeyList[j] != shiftCardsTemp[k]:
                            cardsBack.append(cardsTemp[k])
                            shiftCardsBack.append(shiftCardsTemp[k])
            else:
                cardsBack = cardsTemp
                shiftCardsBack = shiftCardsTemp
            suggestList = []
            threeNum = 0
            for j in range(len(shiftCards)):
                if threeKeyList[i] == shiftCards[j]:
                    suggestList.append(cards[j])
                    threeNum += 1
                    if threeNum == 3:
                        break
            bringList = []
            for j in range(len(shiftCardsBack) - 1):
                tempList = []
                tempList.append(cardsBack[j])
                tempList.append(cardsBack[j + 1])
                bringList.append(tempList)
            for j in range(len(bringList)):
                suggestListBack = suggestList[:]
                suggestListBack.extend(bringList[j])
                tipsList.append((suggestListBack))

        # 带癞子的情况
        if self.game_mode == 2 and keyCardNum > 0:
            if len(oneKeyList) > 0 and keyCardNum >= 2:
                for i in range(len(oneKeyList)):
                    shiftCardsTemp = []
                    cardsTemp = []
                    for j in range(len(shiftCards)):
                        if oneKeyList[i] != shiftCards[j]:
                            cardsTemp.append(cards[j])
                            shiftCardsTemp.append(shiftCards[j])
                    shiftCardsBack = []
                    cardsBack = []
                    if bomb_open == 1 and len(fourKeyList) > 0:
                        for j in range(len(fourKeyList)):
                            for k in range(len(shiftCardsTemp)):
                                if fourKeyList[j] != shiftCardsTemp[k]:
                                    shiftCardsBack.append(shiftCardsTemp[k])
                                    cardsBack.append(cardsTemp[k])
                    else:
                        cardsBack = cardsTemp[:]
                        shiftCardsBack = shiftCardsTemp[:]

                    suggestList = []
                    for j in range(len(shiftCards)):
                        if oneKeyList[i] == shiftCards[j]:
                            suggestList.append(cards[j])
                            suggestList.append(keyCard)
                            suggestList.append(keyCard)
                    bringList = []
                    for j in range(len(shiftCardsBack) - 1):
                        tempList = []
                        tempList.append(cardsBack[j])
                        tempList.append(cardsBack[j + 1])
                        bringList.append(tempList)

                    for j in range(len(bringList)):
                        suggestListBack = suggestList[:]
                        suggestListBack.extend(bringList[j])
                        tipsList.append(suggestListBack)

            if len(twoKeyList) > 0 and keyCardNum >= 1:
                for i in range(len(twoKeyList)):
                    shiftCardsTemp = []
                    cardsTemp = []
                    for j in range(len(shiftCards)):
                        if twoKeyList[i] != shiftCards[j]:
                            cardsTemp.append(cards[j])
                            shiftCardsTemp.append(shiftCards[j])
                    shiftCardsBack = []
                    cardsBack = []
                    if bomb_open == 1 and len(fourKeyList) > 0:
                        for j in range(len(fourKeyList)):
                            for k in range(len(shiftCardsTemp)):
                                if fourKeyList[j] != shiftCardsTemp[k]:
                                    shiftCardsBack.append(shiftCardsTemp[k])
                                    cardsBack.append(cardsTemp[k])
                    else:
                        cardsBack = cardsTemp[:]
                        shiftCardsBack = shiftCardsTemp[:]

                    suggestList = []
                    for j in range(len(shiftCards)):
                        if twoKeyList[i] == shiftCards[j]:
                            suggestList.append(cards[j])
                    suggestList.append(keyCard)

                    bringList = []
                    for j in range(len(shiftCardsBack) - 1):
                        tempList = []
                        tempList.append(cardsBack[j])
                        tempList.append(cardsBack[j + 1])
                        bringList.append(tempList)

                    for j in range(len(bringList)):
                        suggestListBack = suggestList[:]
                        suggestListBack.extend(bringList[j])
                        tipsList.append(suggestListBack)
        DEBUG_MSG("san dai er tipsList:{}".format(tipsList))
        return tipsList

    def getTipsPlane(self, idx, controllerCards):
        minCard = 0
        planeCardNum = 0
        # 判断飞机的最小牌
        if len(controllerCards) != 0:
            tripleCardsList = []
            controllerDict = utility.getCard2NumDict(controllerCards)
            controllerKeyList = list(controllerDict.keys())
            planeCardNum = int(len(controllerCards) / 5)
            for i in range(len(controllerKeyList)):
                if controllerDict[controllerKeyList[i]] >= 3:
                    tripleCardsList.append(controllerKeyList[i])
            tripleCardsList = sorted(tripleCardsList)
            for i in range(len(tripleCardsList) - 1):
                if (tripleCardsList[i] + 1) == tripleCardsList[i + 1]:
                    minCard = tripleCardsList[i + 1]
                    break

        tipsList = []
        cards, keyCardNum, keyCard = self.getHandCards(idx)
        # DEBUG_MSG("getTipsPlane cards: {}".format(cards))
        if len(cards) < len(controllerCards):
            return tipsList
        shiftCards = utility.rightShiftCards(cards)
        shiftCards2NumDict = utility.getCard2NumDict(shiftCards)

        # 手牌三张和四张
        threeKeyList = []
        fourKeyList = []
        tripleList = []
        bomb_open = self.game_plays[3]
        for card in shiftCards2NumDict:
            if minCard < card:
                if bomb_open == 0:
                    if shiftCards2NumDict[card] >= 3:
                        threeKeyList.append(card)
                else:
                    if shiftCards2NumDict[card] == 3:
                        threeKeyList.append(card)
                if shiftCards2NumDict[card] == 4:
                    fourKeyList.append(card)
        threeKeyList = sorted(threeKeyList)

        for i in range(len(threeKeyList) - planeCardNum + 1):
            tempList = []
            for j in range(1, planeCardNum):
                if threeKeyList[i] + j == threeKeyList[i + j]:
                    if j == 1:
                        tempList.append(threeKeyList[i])
                        tempList.append(threeKeyList[i + j])
                    else:
                        tempList.append(threeKeyList[i + j])
            if len(tempList) == planeCardNum and len(tempList) > 0:
                tripleList.append(tempList)

        for i in range(len(tripleList)):
            suggestList = []
            cardsBack = []
            shiftCardsBack = []
            if len(fourKeyList) != 0 and bomb_open == 1:
                for j in range(len(fourKeyList)):
                    for k in range(len(shiftCards) - 1):
                        if fourKeyList[j] != shiftCards[k]:
                            cardsBack.append(cards[k])
                            shiftCardsBack.append(shiftCards[k])
            else:
                cardsBack = cards[:]
                shiftCardsBack = shiftCards[:]

            for j in range(len(tripleList[i])):
                tripleNum = 0
                for k in range(len(shiftCardsBack) - 1)[::-1]:
                    if tripleList[i][j] == shiftCardsBack[k]:
                        suggestList.append(cardsBack[k])
                        del shiftCardsBack[k]
                        del cardsBack[k]
                        tripleNum += 1
                        if tripleNum == 3:
                            break

            for j in range(len(shiftCardsBack) - planeCardNum * 2 + 1):
                bringCardNum = 0
                suggestListBack = suggestList[:]
                for k in range(j, len(shiftCardsBack)):
                    suggestListBack.append(cardsBack[k])
                    bringCardNum += 1
                    if bringCardNum == 2 * planeCardNum:
                        break
                tipsList.append(suggestListBack)

        # 带癞子的情况
        if self.game_mode == 2 and keyCardNum > 0:
            cardsListBack = []
            if len(fourKeyList) != 0 and bomb_open == 1:
                for j in range(len(fourKeyList)):
                    for k in range(len(shiftCards) - 1):
                        if fourKeyList[j] != shiftCards[k]:
                            cardsListBack.append(cards[k])
            else:
                cardsListBack = cards[:]
            card2ListDict = utility.getListDict(cardsListBack)
            playerCardNum = 0
            if self.game_cardnum == 15:
                playerCardNum = 13
            else:
                playerCardNum = 14

            for i in range(minCard + 1, playerCardNum):
                useKeyCardNum = keyCardNum
                pairCardNum = 0
                suggestList = []
                tripleList = []
                cardsList = cardsListBack[:]
                for j in range(planeCardNum):
                    if (i + j) not in card2ListDict.keys():
                        useKeyCardNum -= 3
                        pairCardNum += 1
                        suggestList.append(keyCard)
                        suggestList.append(keyCard)
                        suggestList.append(keyCard)
                    elif len(card2ListDict[i + j]) >= 3:
                        pairCardNum += 1
                        suggestList.append(card2ListDict[i + j][0])
                        suggestList.append(card2ListDict[i + j][1])
                        suggestList.append(card2ListDict[i + j][2])

                        tripleList.append(card2ListDict[i + j][0])
                        tripleList.append(card2ListDict[i + j][1])
                        tripleList.append(card2ListDict[i + j][2])
                    elif len(card2ListDict[i + j]) == 2:
                        useKeyCardNum -= 1
                        pairCardNum += 1
                        suggestList.append(card2ListDict[i + j][0])
                        suggestList.append(card2ListDict[i + j][1])
                        suggestList.append(keyCard)

                        tripleList.append(card2ListDict[i + j][0])
                        tripleList.append(card2ListDict[i + j][1])
                    elif len(card2ListDict[i + j]) == 1:
                        useKeyCardNum -= 2
                        pairCardNum += 1
                        suggestList.append(card2ListDict[i + j][0])
                        suggestList.append(keyCard)
                        suggestList.append(keyCard)

                        tripleList.append(card2ListDict[i + j][0])

                    if useKeyCardNum < 0:
                        pairCardNum -= 1
                        break

                if pairCardNum == planeCardNum and useKeyCardNum != keyCardNum:
                    for j in range(useKeyCardNum):
                        cardsList.append(keyCard)
                    cardsTempList = []
                    for j in range(len(cardsList)):
                        if cardsList[j] not in tripleList:
                            cardsTempList.append(cardsList[j])

                    for j in range(len(cardsTempList) - planeCardNum * 2):
                        suggestListBack = suggestList[:]
                        for k in range(planeCardNum * 2):
                            suggestListBack.append(cardsTempList[j + k])
                        suggestListBack = sorted(suggestListBack)
                        tipsList.append(suggestListBack)
        DEBUG_MSG("fei ji tipsList:{}".format(tipsList))
        return tipsList

    def getFourBring(self, idx, controllerCards, bringNum):
        minCard = 0
        if len(controllerCards) != 0:
            controllerDict = utility.getCard2NumDict(controllerCards)
            for card in controllerDict:
                if controllerDict[card] == 4:
                    minCard = card

        tipsList = []
        cards, keyCardNum, keyCard = self.getHandCards(idx)
        # DEBUG_MSG("getFourBring cards: {}".format(cards))
        if len(cards) < len(controllerCards):
            return tipsList
        shiftCards = utility.rightShiftCards(cards)
        shiftCards2NumDict = utility.getCard2NumDict(shiftCards)

        fourCardList = []
        for card in shiftCards2NumDict:
            if shiftCards2NumDict[card] == 4 and card > minCard:
                fourCardList.append(card)
        if len(fourCardList) > 0:
            cardsBack = []
            shiftCardsBack = []
            for i in range(len(fourCardList)):
                for j in range(len(shiftCards) - 1):
                    if fourCardList[i] != shiftCards[j]:
                        shiftCardsBack.append(shiftCards[j])
                        cardsBack.append(cards[j])
            cardsBackDict = utility.getCard2NumDict(shiftCardsBack)
            fourBringCardList = []
            for i in range(1, 4):
                for card in cardsBackDict:
                    if cardsBackDict[card] == i:
                        for j in range(len(shiftCards)):
                            if card == shiftCards[j]:
                                fourBringCardList.append(cards[j])
            if len(fourBringCardList) > 0:
                for i in range(len(fourBringCardList) - (bringNum - 1)):
                    suggestList = []
                    suggestList.append(fourBringCardList[i])
                    suggestList.append(fourBringCardList[i + 1])
                    if bringNum == 3:
                        suggestList.append(fourBringCardList[i + 2])
                    for j in range(len(fourCardList)):
                        tempList = []
                        for k in range(len(shiftCards)):
                            if fourCardList[j] == shiftCards[k]:
                                tempList.append(cards[k])
                        tempList.extend(suggestList)
                        tipsList.append(tempList)

        # 带癞子的情况 四带二，四带三
        if self.game_mode == 2 and keyCardNum > 0:
            card2ListDict = utility.getListDict(cards)
            for i in range(minCard + 1, 15):
                tempList = []
                cardsListBack = []
                if i not in card2ListDict.keys():
                    continue
                elif (len(card2ListDict[i]) == 1 and keyCardNum >= 3) or (
                                len(card2ListDict[i]) == 2 and keyCardNum >= 2) or (
                                len(card2ListDict[i]) == 3 and keyCardNum >= 1):
                    tempList.extend(card2ListDict[i])
                    for j in range(4 - len(card2ListDict[i])):
                        tempList.append(keyCard)

                for j in range(4 - len(card2ListDict[i])):
                    cardsListBack.append(keyCard)
                for k in range(len(cards)):
                    if cards[k] not in tempList:
                        cardsListBack.append(cards[k])
                for j in range(len(cardsListBack) - bringNum + 1):
                    suggestList = []
                    suggestList.extend(tempList)
                    suggestList.append(cardsListBack[j])
                    suggestList.append(cardsListBack[j + 1])
                    if bringNum == 3:
                        suggestList.append(cardsListBack[j + 2])
                    if len(suggestList) == 6 or len(suggestList) == 7:
                        tipsList.append(suggestList)
        DEBUG_MSG("si dai er huo san :{}".format(tipsList))
        return tipsList

    def getBombTips(self, idx, controllerCards):
        # 炸弹提示
        tipsList = []
        discardKeyNum = 0
        if len(controllerCards) == 0:
            bombCard = 0
            discardKeyNum = 99
        else:
            for i in range(len(controllerCards)):
                if controllerCards[i] in const.INSTEAD:
                    discardKeyNum += 1
            bombCard = controllerCards[0] >> 3
        if discardKeyNum == 4:  # 纯癞子炸弹最大
            return tipsList

        bombKeyList = []
        cards, keyCardNum, keyCard = self.getHandCards(idx)
        DEBUG_MSG("getBombTips cards: {}".format(cards))
        shiftCards = utility.rightShiftCards(cards)
        shiftCards2NumDict = utility.getCard2NumDict(shiftCards)

        if self.game_mode == 2 and keyCardNum > 0 and (discardKeyNum > 0 or discardKeyNum == 99):
            oneKeyList = []
            twoKeyList = []
            threeKeyList = []
            for card in shiftCards2NumDict:
                if card > bombCard:
                    if shiftCards2NumDict[card] == 1:
                        oneKeyList.append(card)
                    if shiftCards2NumDict[card] == 2:
                        twoKeyList.append(card)
                    if shiftCards2NumDict[card] == 3:
                        threeKeyList.append(card)
            oneKeyList = sorted(oneKeyList)
            twoKeyList = sorted(twoKeyList)
            threeKeyList = sorted(threeKeyList)
            if keyCardNum >= 1 and len(threeKeyList) > 0:
                for i in range(len(threeKeyList)):
                    keySuggestList = [keyCard]
                    for j in range(len(shiftCards)):
                        if threeKeyList[i] == shiftCards[j]:
                            keySuggestList.append(cards[j])
                            keySuggestList.append(cards[j + 1])
                            keySuggestList.append(cards[j + 2])
                            break
                    tipsList.append(keySuggestList)

            if keyCardNum >= 2 and len(twoKeyList) > 0:
                for i in range(len(twoKeyList)):
                    keySuggestList = [keyCard, keyCard]
                    for j in range(len(shiftCards)):
                        if twoKeyList[i] == shiftCards[j]:
                            keySuggestList.append(cards[j])
                            keySuggestList.append(cards[j + 1])
                            break
                    tipsList.append(keySuggestList)

            if keyCardNum >= 3 and len(oneKeyList) > 0:
                for i in range(len(oneKeyList)):
                    keySuggestList = [keyCard, keyCard, keyCard]
                    for j in range(len(shiftCards)):
                        if oneKeyList[i] == shiftCards[j]:
                            keySuggestList.append(cards[j])
                    tipsList.append(keySuggestList)

        shiftCardsKeyList = list(shiftCards2NumDict.keys())
        for i in range(len(shiftCardsKeyList)):
            if (bombCard < shiftCardsKeyList[i] or discardKeyNum > 0) and shiftCards2NumDict[shiftCardsKeyList[i]] == 4:
                bombKeyList.append(shiftCardsKeyList[i])
        for i in range(len(bombKeyList)):
            suggestList = []
            for j in range(len(shiftCards)):
                if bombKeyList[i] == shiftCards[j]:
                    suggestList.append(cards[j])
            tipsList.append(suggestList)

        if keyCardNum == 4:
            keyList = [keyCard, keyCard, keyCard, keyCard]
            tipsList.append(keyList)
        DEBUG_MSG("zha dan tipsList: {}".format(tipsList))
        return tipsList
