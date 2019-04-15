# -*- coding: utf-8 -*-

import time
import re
import const
import copy
from KBEDebug import *
from datetime import datetime
from KBEDebug import *
import hashlib
import time
import AsyncRequest
import json
import switch
import math


def is_same_day(ts1, ts2):
    d1 = datetime.fromtimestamp(ts1)
    d2 = datetime.fromtimestamp(ts2)

    if (d1.year, d1.month, d1.day) == (d2.year, d2.month, d2.day):
        return True
    return False


def gen_room_id(kbe_pid):
    # if switch.DEBUG_BASE == 1:
    # 	return 999999
    # else:
    # 	return 100168 + kbe_pid
    return 100168 + kbe_pid


def filter_emoji(nickname):
    try:
        # UCS-4
        highpoints = re.compile(u'[\U00010000-\U0010ffff]')
    except re.error:
        # UCS-2
        highpoints = re.compile(u'[\uD800-\uDBFF][\uDC00-\uDFFF]')
    nickname = highpoints.sub(u'', nickname)
    return nickname

def get_md5(data):
    m = hashlib.md5()
    m.update(data.encode())
    return m.hexdigest()

def get_cur_timestamp():
    return int(time.time())

# 发送网络请求
def get_user_info(accountName, callback):
    ts = int(time.mktime(datetime.now().timetuple()))
    tosign = accountName + "_" + str(ts) + "_" + switch.PHP_SERVER_SECRET
    m1 = hashlib.md5()
    m1.update(tosign.encode())
    sign = m1.hexdigest()
    url = switch.PHP_SERVER_URL + 'user_info_server'
    suffix = '?timestamp=' + str(ts) + '&unionid=' + accountName + '&sign=' + sign
    AsyncRequest.Request(url + suffix, lambda x: callback(x))


def get_agent_info(userId, callback):
    ts = int(time.mktime(datetime.now().timetuple()))
    tosign = str(userId) + "_" + str(ts) + "_" + switch.PHP_SERVER_SECRET
    m1 = hashlib.md5()
    m1.update(tosign.encode())
    sign = m1.hexdigest()
    url = switch.PHP_SERVER_URL + 'agent_info_server'
    suffix = '?timestamp=' + str(ts) + '&userId=' + str(userId) + '&sign=' + sign
    AsyncRequest.Request(url + suffix, lambda x: callback(x))


def update_card_diamond(accountName, deltaCard, deltaDiamond, callback, reason=""):
    ts = int(time.mktime(datetime.now().timetuple()))
    tosign = accountName + "_" + str(ts) + "_" + str(deltaCard) + "_" + str(
        deltaDiamond) + "_" + switch.PHP_SERVER_SECRET
    m1 = hashlib.md5()
    m1.update(tosign.encode())
    sign = m1.hexdigest()
    DEBUG_MSG("MD5::" + sign)
    url = switch.PHP_SERVER_URL + 'update_card_diamond'
    data = {
        "timestamp": ts,
        "delta_card": deltaCard,
        "delta_diamond": deltaDiamond,
        "unionid": accountName,
        "sign": sign,
        "reason": reason
    }
    AsyncRequest.Post(url, data, lambda x: callback(x))


def update_reward_get(accountList, cardList, diamondList, callback, reason=""):
    ts = get_cur_timestamp()
    account_json = json.dumps(accountList)
    card_json = json.dumps(cardList)
    diamond_json = json.dumps(diamondList)
    to_sign = account_json + "_" + str(ts) + "_" + card_json + "_" + diamond_json + "_" + switch.PHP_SERVER_SECRET
    DEBUG_MSG("reward to sign::" + to_sign)
    sign = get_md5(to_sign)
    DEBUG_MSG("reward md5::" + sign)
    url = switch.PHP_SERVER_URL + "update_reward_get"
    data = {
        "timestamp": ts,
        "card_list": card_json,
        "diamond_list": diamond_json,
        "unionids": account_json,
        "sign": sign,
        "reason": reason
    }
    AsyncRequest.Post(url, data, lambda x: callback(x))


def getMaxSerialCard():
    return const.HEI[-2]


def getMinSerialCard():
    return const.HEI[0]


def classifyCards(cards, keyCard):
    normalCards = []
    keyCards = []
    for i in range(len(cards)):
        if cards[i] == keyCard:
            keyCards.append(cards[i])
        else:
            normalCards.append(cards[i])
    return normalCards, keyCards


def checkIsCircleSerialThan3(lis):
    serial = sorted(lis)
    if const.CARD2 in serial:
        copySerial = copy.deepcopy(serial)
        for i in range(len(const.CIRCLE)):
            if const.CIRCLE[i] in copySerial:
                copySerial.remove(const.CIRCLE[i])
            else:
                break
        for i in range(len(const.CIRCLE))[::-1]:
            if const.CIRCLE[i] in copySerial:
                copySerial.remove(const.CIRCLE[i])
            else:
                break
        if len(copySerial) <= 0:
            return True
        return False
    else:
        for i in range(len(serial) - 1):
            if serial[i] + 1 != serial[i + 1]:
                return False
        return True


def getCard2NumDict(cards):
    card2NumDict = {}
    for t in cards:
        if t not in card2NumDict:
            card2NumDict[t] = 1
        else:
            card2NumDict[t] += 1
    return card2NumDict


def getListDict(cards):
    card2ListDict = {}
    for t in cards:
        card = t >> 3
        if card in card2ListDict.keys():
            card2ListDict[card].append(t)
        else:
            card2ListDict[card] = [t]
    return card2ListDict


def checkIsSingle(cards):  # 单张
    if len(cards) == 1:
        return True
    return False


def checkIsPair(cards):  # 对子
    if len(cards) == 2 and cards[0] == cards[1]:
        return True
    return False


def checkIsSerialPair(cards):  # 连对
    if len(cards) < 4 or len(cards) % 2 != 0:
        return False
    card2NumDict = getCard2NumDict(cards)
    # 张数
    for card in card2NumDict:
        if card2NumDict[card] != 2:
            return False
    # 顺序
    serial = card2NumDict.keys()
    serial = sorted(serial)
    for i in range(len(serial) - 1):
        if serial[i] + 1 != serial[i + 1]:
            return False
    return True


def checkIsTriple(cards, playerCardsNum, gameEnd, disType):  # 三张
    if disType == 1:
        if gameEnd[1] != 1:
            return False
    else:
        if gameEnd[0] != 1:
            return False

    if len(cards) != playerCardsNum:
        return False
    card2NumDict = getCard2NumDict(cards)
    if len(cards) == 3 and len(card2NumDict) == 1:
        return True
    return False


def checkIsSerialTriple(cards, playerCardsNum):  # 三不带
    card2NumDict = getCard2NumDict(cards)
    # 3 * 3 以上
    if len(card2NumDict) < 2:
        return False

    if len(cards) == playerCardsNum:
        return False
    # 每样3张
    for card in card2NumDict:
        if card2NumDict[card] != 3:
            return False
    # 是否连续
    serial = card2NumDict.keys()
    serial = sorted(serial)
    for i in range(len(serial) - 1):
        if serial[i] + 1 != serial[i + 1]:
            return False
    return True


def checkIsSerialSingle(cards):  # 顺子
    if len(cards) < 5:
        return False
    card2NumDict = getCard2NumDict(cards)
    for card in card2NumDict:
        if card2NumDict[card] != 1:
            return False
    serial = card2NumDict.keys()
    serial = sorted(serial)
    for i in range(len(serial) - 1):
        if serial[i] + 1 != serial[i + 1]:
            return False
    return True


def checkIsNormalBomb(cards):  # 普通炸弹
    card2NumDict = getCard2NumDict(cards)
    if len(cards) == 4 and len(card2NumDict) == 1:
        return True
    return False


def getSerialBombNum(cards):  # 连炸, 每个炸弹张数
    card2NumDict = getCard2NumDict(cards)
    for card in card2NumDict:
        return card2NumDict[card]


def getSerialBombSerialNum(cards):  # 连炸, X连炸
    card2NumDict = getCard2NumDict(cards)
    serial = card2NumDict.keys()
    return len(serial)


def checkIsTripleBring1(cards, playerCardsNum, gameEnd, disType):  # 三带一
    DEBUG_MSG("checkIsTripleBring1 is running")
    if len(cards) != 4:
        return False
    if disType == 1:
        if gameEnd[1] != 1:
            return False
    else:
        if gameEnd[0] != 1:
            return False
    if len(cards) != playerCardsNum:
        return False
    card2NumDict = getCard2NumDict(cards)
    serial = card2NumDict.keys()
    serial = sorted(serial)
    if len(serial) != 2:
        return False
    if (card2NumDict[serial[0]] == 3 and card2NumDict[serial[1]] == 1) or (
                    card2NumDict[serial[0]] == 1 and card2NumDict[serial[1]] == 3):
        DEBUG_MSG("checkIsTripleBring1 is True")
        return True
    return False


def checkIsTripleBring2(cards):  # 三带二
    DEBUG_MSG("checkIsTripleBring2 is running")
    if len(cards) != 5:
        return False
    isTriple = False
    card2NumDict = getCard2NumDict(cards)
    for card in card2NumDict:
        if card2NumDict[card] >= 3:
            isTriple = True

    if isTriple and len(cards) - 3 == 2:
        DEBUG_MSG("checkIsTripleBring2 is True")
        return True
    return False


def checkIsPlane(cards, playerCardsNum, gameEnd, disType):  # 飞机
    DEBUG_MSG("checkIsPlane is running")
    if playerCardsNum >= 10 and len(cards) < 10:
        return False

    planeCardList = []  # 手牌中相同的牌超过3个的牌的个数
    card2NumDict = getCard2NumDict(cards)
    for card in card2NumDict:
        if card2NumDict[card] >= 3:
            planeCardList.append(card)
    if len(planeCardList) < 2:
        return False
    planeCardList = sorted(planeCardList)
    planeNum = 1
    temp_planeNum = 1
    for i in range(len(planeCardList) - 1):
        if (planeCardList[i] + 1) == planeCardList[i + 1]:
            temp_planeNum += 1
        else:
            planeNum = temp_planeNum if planeNum < temp_planeNum else planeNum
            temp_planeNum = 1
    planeNum = temp_planeNum if planeNum < temp_planeNum else planeNum  # 手牌中最大的飞机个数,比如333444666777888,个数为3,比如333344445555666,个数为4
    for i in range(1, planeNum + 1):
        if len(cards) - i * 3 == i * 2:
            DEBUG_MSG("checkIsPlane is True")
            return True  # 如果能执行到这里,此时的i是有效的飞机个数,比如333344445555666,此时i为3
        elif disType == 0:
            if len(cards) - i * 3 < i * 2 and len(cards) == playerCardsNum and gameEnd[2] == 1:
                DEBUG_MSG("checkIsPlane is True,last")
                return True
        elif disType == 1:
            if len(cards) - i * 3 < i * 2 and len(cards) == playerCardsNum and gameEnd[3] == 1:
                DEBUG_MSG("checkIsPlane is True,last")
                return True
    return False


def checkIsFourBring2(cards, gamePlays):  # 四带二
    if len(cards) < 6 or gamePlays[1] != 1:
        return False
    DEBUG_MSG("checkIsFourBring2,cards:{}".format(cards))
    card2NumDict = getCard2NumDict(cards)
    fourCardNum = 0
    bringNum = 0
    for card in card2NumDict:
        if card2NumDict[card] == 4:
            fourCardNum += 1
        else:
            bringNum += card2NumDict[card]
    if fourCardNum == 1 and bringNum == 2:
        return True
    else:
        return False
    return False


def checkIsFourBring3(cards, gamePlays):  # 四带三
    if len(cards) < 7 or gamePlays[2] != 1:
        return False
    DEBUG_MSG("checkIsFourBring3,cards:{}".format(cards))
    card2NumDict = getCard2NumDict(cards)
    fourCardNum = 0
    bringNum = 0
    for card in card2NumDict:
        if card2NumDict[card] == 4:
            fourCardNum += 1
        else:
            bringNum += card2NumDict[card]
    if fourCardNum == 1 and bringNum == 3:
        return True
    else:
        return False
    return False


def checkIsJokerBomb(cards):
    if len(cards) != 2:
        return False
    if cards[0] == 18 and cards[1] == 19 or cards[1] == 19 and cards[0] == 18:
        return True
    return False


def checkIsKeyCardPair(normalCards, keyCards):  # 对子
    DEBUG_MSG("checkIsKeyCardPair")
    if len(normalCards) == 1 and len(keyCards) == 1:
        return True
    return False


def checkIsKeyCardSerialPair(normalCards, keyCards):  # 连对
    DEBUG_MSG("checkIsKeyCardSerialPair")
    if len(normalCards) + len(keyCards) < 4 or (len(normalCards) + len(keyCards)) % 2 != 0:
        return False
    if len(normalCards) + len(keyCards) > 16:  # 最多不能超过 16张
        return False
    keyCardNum = len(keyCards)
    card2NumDict = getCard2NumDict(normalCards)
    # 数量是否满足
    for card in card2NumDict:
        if card2NumDict[card] > 2:
            return False
        elif card2NumDict[card] < 2:
            needNum = 2 - card2NumDict[card]
            if keyCardNum < needNum:
                return False
            keyCardNum -= needNum
    # 是否连续
    isSerial = True
    serial = card2NumDict.keys()
    serial = sorted(serial)
    for i in range(len(serial) - 1):
        j = 1
        while serial[i] + j != serial[i + 1]:
            if keyCardNum < 2:
                isSerial = False
                break
            j += 1
            keyCardNum -= 2
    if isSerial and keyCardNum % 2 == 0:
        return True
    return False


def checkIsKeyCardTriple(normalCards, keyCards):  # 三张 三张王不是三张一样的
    DEBUG_MSG("checkIsKeyCardTriple")
    if len(normalCards) + len(keyCards) != 3:
        return False
    if len(normalCards) == 2:
        if normalCards[0] == normalCards[1]:
            return True
        return False
    elif len(keyCards) == 3:
        return False
    return True


def checkIsKeyCardTripleBring(normalCards, keyCards):  # 三带二或三带一
    DEBUG_MSG("checkIsKeyCardTripleBring")
    if len(normalCards) + len(keyCards) != 5 and len(normalCards) + len(keyCards) != 4:
        return False

    keyCardNum = len(keyCards)
    card2NumDict = getCard2NumDict(normalCards)
    for card in card2NumDict:
        if (3 - card2NumDict[card]) == keyCardNum:
            return True
    return False


def checkIsKeyCardSerialTriple(normalCards, keyCards):  # 连三张
    DEBUG_MSG("checkIsKeyCardSerialTriple")
    if len(normalCards) + len(keyCards) < 6 or (len(normalCards) + len(keyCards)) % 3 != 0:
        return False
    if len(normalCards) + len(keyCards) > 15:  # 最多不能超过 3-A
        return False
    keyCardNum = len(keyCards)
    card2NumDict = getCard2NumDict(normalCards)
    # 数量
    for card in card2NumDict:
        if card2NumDict[card] > 3:
            return False
        elif card2NumDict[card] < 3:
            needNum = 3 - card2NumDict[card]
            if keyCardNum < needNum:
                return False
            keyCardNum -= needNum
    # 连续
    isSerial = True
    serial = card2NumDict.keys()
    serial = sorted(serial)
    for i in range(len(serial) - 1):
        j = 1
        while serial[i] + j != serial[i + 1]:
            if keyCardNum < 3:
                isSerial = False
                break
            j += 1
            keyCardNum -= 3
    if isSerial and keyCardNum % 3 == 0:
        return True
    return False


def checkIsKeyCardSerialSingle(normalCards, keyCards):  # 顺子
    DEBUG_MSG("checkIsKeyCardSerialSingle")
    if len(normalCards) + len(keyCards) < 5:
        return False
    if len(normalCards) + len(keyCards) > 12:  # 最多不能超过 3-A
        return False
    card2NumDict = getCard2NumDict(normalCards)
    # 数量
    for card in card2NumDict:
        if card2NumDict[card] != 1:
            return False
        if card == 16:
            return False
    # 连续
    isSerial = True
    keyCardNum = len(keyCards)
    serial = card2NumDict.keys()
    serial = sorted(serial)
    for i in range(len(serial) - 1):
        j = 1
        while serial[i] + j != serial[i + 1]:
            if keyCardNum <= 0:
                isSerial = False
                break
            j += 1
            keyCardNum -= 1
    return isSerial


def checkIsKeyCardPlane(normalCards, keyCards):  # 飞机
    DEBUG_MSG("checkIsKeyCardPlane")
    keyCardNum = len(keyCards)
    cardsNum = len(normalCards) + keyCardNum
    if cardsNum < 7 or cardsNum > 16:
        return False
    normalCards = sorted(normalCards)

    pairNum = math.ceil(cardsNum / 5)
    min_card = normalCards[0]
    max_card = normalCards[len(normalCards) - 1]
    card2NumDict = getCard2NumDict(normalCards)
    for i in range(min_card, max_card + 1):
        pairCardNum = 0
        useKeyCardNum = keyCardNum
        for j in range(pairNum):
            if not (i + j) in card2NumDict.keys():
                useKeyCardNum -= 3
                pairCardNum += 1
            elif card2NumDict[i + j] == 3:
                pairCardNum += 1
            elif card2NumDict[i + j] == 2:
                useKeyCardNum -= 1
                pairCardNum += 1
            elif card2NumDict[i + j] == 1:
                useKeyCardNum -= 2
                pairCardNum += 1

            if useKeyCardNum < 0:
                pairCardNum -= 1
                break
        if pairCardNum == pairNum:
            return True
    return False


def checkIsKeyCardFourBring2(normalCards, keyCards):
    DEBUG_MSG("checkIsKeyCardFourBring2")
    keyCardNum = len(keyCards)
    if (len(normalCards) + keyCardNum) != 6:
        return False
    card2NumDict = getCard2NumDict(normalCards)
    for card in card2NumDict:
        if (card2NumDict[card] + keyCardNum) == 4:
            return True
    return False


def checkIsKeyCardFourBring3(normalCards, keyCards):
    DEBUG_MSG("checkIsKeyCardFourBring3")
    keyCardNum = len(keyCards)
    if (len(normalCards) + keyCardNum) != 7:
        return False
    card2NumDict = getCard2NumDict(normalCards)
    for card in card2NumDict:
        if (card2NumDict[card] + keyCardNum) == 4:
            return True
    return False


def checkIsKeyCardBombMAX(normalCards, keyCards):  # 普通炸弹 四王炸 不算普通炸弹
    if len(normalCards) == 0 and len(keyCards) == 4:
        return True
    else:
        return False


def checkIsKeyCardBomb(normalCards, keyCards):  # 普通炸弹 四王炸 不算普通炸弹
    DEBUG_MSG("checkIsKeyCardBomb")
    if len(normalCards) + len(keyCards) != 4:
        return False
    if len(normalCards) <= 0:
        return False
    card2NumDict = getCard2NumDict(normalCards)
    if len(card2NumDict) != 1:
        return False
    return True


def getOriginCardInsteadNum(originCard):
    notJokerList = [const.HEI, const.HONG, const.MEI, const.FANG]
    for i in range(len(notJokerList)):
        if originCard in notJokerList[i]:
            return const.INSTEAD[notJokerList[i].index(originCard)]
    return originCard


def getRightShiftCardInsteadNum(shiftCard):
    originCard = shiftCard << 3
    return getOriginCardInsteadNum(originCard)


def getInsteadMidSerialCard(shiftSerialCard, keyCardNum):  # 往中间填
    insteadCards = []
    shiftSerialCard = sorted(shiftSerialCard)
    for i in range(len(shiftSerialCard) - 1):
        j = 1
        while shiftSerialCard[i] + j != shiftSerialCard[i + 1]:
            insteadCards.append(getRightShiftCardInsteadNum(shiftSerialCard[i] + j))
            keyCardNum -= 1
            j += 1
    return insteadCards, keyCardNum


def getInsteadEndSerialCard(shiftSerialCard, keyCardNum):  # 往后填
    insteadCards = []
    shiftSerialCard = sorted(shiftSerialCard)
    maxCard = shiftSerialCard[-1]
    while maxCard < (getMaxSerialCard() >> 3) and keyCardNum > 0:
        maxCard += 1
        keyCardNum -= 1
        insteadCards.append(getRightShiftCardInsteadNum(maxCard))
    return insteadCards, keyCardNum


def getInsteadBeforeSerialCard(shiftSerialCard, keyCardNum):  # 往前填
    insteadCards = []
    shiftSerialCard = sorted(shiftSerialCard)
    minCard = shiftSerialCard[0]
    while minCard > (getMinSerialCard() >> 3) and keyCardNum > 0:
        minCard -= 1
        keyCardNum -= 1
        insteadCards.append(getRightShiftCardInsteadNum(minCard))
    return insteadCards, keyCardNum


# 按最大牌型生成新牌(必须满足可以生成)
def makeKeyCardPair(originCardsButKey, originKeys):  # 癞子转化为新的对子
    # 王不能替王 两个王的情况(一大一小)
    newOriginPair = []
    newOriginPair.append(originCardsButKey[0])
    newOriginPair.append(getOriginCardInsteadNum(originCardsButKey[0]))
    newOriginPair = sorted(newOriginPair)
    return newOriginPair


def makeKeyCardSerialSingle(originCardsButKey, originKeys):  # 癞子转化为新的顺子
    makeCards = copy.deepcopy(originCardsButKey)
    shiftCards = rightShiftCards(originCardsButKey)
    shiftCards = sorted(shiftCards)
    pairNum = int(len(shiftCards) + len(originKeys))

    card2NumDict = getCard2NumDict(shiftCards)
    min_card = shiftCards[0]
    max_card = shiftCards[len(shiftCards) - 1]
    if min_card > (14 - pairNum + 1) and max_card <= 14:
        min_card = 14 - pairNum + 1
    for j in range(pairNum):
        tempList = []
        if not (min_card + j) in card2NumDict.keys():
            tempList.append((min_card + j) << 3)
        makeCards.extend(tempList)

    makeCards = sorted(makeCards)
    return makeCards


def makeKeyCardSerialPair(originCardsButKey, originKeys):  # 癞子转化为新的连对
    makeCards = copy.deepcopy(originCardsButKey)
    shiftCards = rightShiftCards(originCardsButKey)
    shiftCards = sorted(shiftCards)
    pairNum = int((len(shiftCards) + len(originKeys)) / 2)

    card2NumDict = getCard2NumDict(shiftCards)
    min_card = shiftCards[0]
    max_card = shiftCards[len(shiftCards) - 1]
    if min_card > (14 - pairNum + 1) and max_card <= 14:
        min_card = 14 - pairNum + 1
    for j in range(pairNum):
        tempList = []
        if (min_card + j) in card2NumDict.keys():
            if card2NumDict[min_card + j] == 1:
                tempList.append((min_card + j) << 3)
        else:
            tempList.append((min_card + j) << 3)
            tempList.append((min_card + j) << 3)
        makeCards.extend(tempList)

    makeCards = sorted(makeCards)
    return makeCards


def makeKeyCardTriple(originCardsButKey, originKeys):  # 癞子转化为新的三张
    keyCardNum = len(originKeys)
    makeCards = copy.deepcopy(originCardsButKey)
    for i in range(len(originKeys)):
        makeCards.append(getOriginCardInsteadNum(originCardsButKey[0]))
    return makeCards


def makeKeyCardTripleBring(originCardsButKey, originKeys):  # 癞子转化为新的三带二或三带一
    makeCards = copy.deepcopy(originCardsButKey)
    shiftCards = rightShiftCards(originCardsButKey)
    shiftCards = sorted(shiftCards)
    keyCardNum = len(originKeys)
    if keyCardNum != 0:
        keyCard = originKeys[0]

    suggestList = []
    card2NumDict = getCard2NumDict(shiftCards)
    keyList = card2NumDict.keys()
    keyList = sorted(keyList)
    for i in range(len(keyList)):
        tempList = []
        needNum = 3 - card2NumDict[keyList[i]]
        if needNum == keyCardNum:
            for j in range(keyCardNum):
                tempList.append(keyList[i] << 3)
            suggestList = tempList
        if needNum < keyCardNum:
            for j in range(needNum):
                tempList.append(keyList[i] << 3)
            for j in range(keyCardNum - needNum):
                tempList.append(keyCard)
            suggestList = tempList

    makeCards.extend(suggestList)
    makeCards = sorted(makeCards)
    return makeCards


def makeKeyCardSerialTriple(originCardsButKey, originKeys):  # 癞子转化为新的飞机不带
    makeCards = copy.deepcopy(originCardsButKey)
    shiftCards = rightShiftCards(originCardsButKey)
    shiftCards = sorted(shiftCards)
    pairNum = int((len(shiftCards) + len(originKeys)) / 3)

    card2NumDict = getCard2NumDict(shiftCards)
    min_card = shiftCards[0]
    max_card = shiftCards[len(shiftCards) - 1]
    if min_card > (14 - pairNum + 1) and max_card <= 14:
        min_card = 14 - pairNum + 1
    for j in range(pairNum):
        tempList = []
        if (min_card + j) in card2NumDict.keys():
            if card2NumDict[min_card + j] == 1:
                tempList.append((min_card + j) << 3)
                tempList.append((min_card + j) << 3)
            elif card2NumDict[min_card + j] == 2:
                tempList.append((min_card + j) << 3)
        else:
            tempList.append((min_card + j) << 3)
            tempList.append((min_card + j) << 3)
            tempList.append((min_card + j) << 3)
        makeCards.extend(tempList)

    makeCards = sorted(makeCards)
    return makeCards


def makeKeyCardPlane(originCardsButKey, originKeys):  # 癞子转化为新的飞机
    makeCards = copy.deepcopy(originCardsButKey)
    shiftCards = rightShiftCards(originCardsButKey)
    shiftCards = sorted(shiftCards)
    keyCardNum = len(originKeys)
    if keyCardNum != 0:
        keyCard = originKeys[0]
    pairNum = math.ceil((len(shiftCards) + keyCardNum) / 5)

    card2NumDict = getCard2NumDict(shiftCards)
    min_card = shiftCards[0]
    max_card = shiftCards[len(shiftCards) - 1]
    suggestList = []
    for i in range(min_card, (max_card + 1)):
        tempList = []
        useKeyCardNum = keyCardNum
        pairCardNum = 0
        for j in range(pairNum):
            if (i + j) in card2NumDict.keys():
                if card2NumDict[i + j] == 2:
                    useKeyCardNum -= 1
                    pairCardNum += 1
                    if useKeyCardNum >= 0:
                        tempList.append((i + j) << 3)
                elif card2NumDict[i + j] == 1:
                    useKeyCardNum -= 2
                    pairCardNum += 1
                    if useKeyCardNum >= 0:
                        tempList.append((i + j) << 3)
                        tempList.append((i + j) << 3)
                elif card2NumDict[i + j] == 3 and (i + j) != 15:
                    pairCardNum += 1
            else:
                useKeyCardNum -= 3
                pairCardNum += 1
                if useKeyCardNum >= 0:
                    tempList.append((i + j) << 3)
                    tempList.append((i + j) << 3)
                    tempList.append((i + j) << 3)
            if useKeyCardNum < 0:
                pairCardNum -= 1
                break
        if pairCardNum == pairNum:
            suggestList = tempList

    for j in range(len(originKeys) - len(suggestList)):
        suggestList.append(keyCard)

    makeCards.extend(suggestList)
    makeCards = sorted(makeCards)
    return makeCards


def makeKeyCardFourBring(originCardsButKey, originKeys):
    makeCards = copy.deepcopy(originCardsButKey)
    shiftCards = rightShiftCards(originCardsButKey)
    shiftCards = sorted(shiftCards)
    keyCardNum = len(originKeys)

    suggestList = []
    card2NumDict = getCard2NumDict(shiftCards)
    keyList = card2NumDict.keys()
    keyList = sorted(keyList)
    for i in range(len(keyList)):
        tempList = []
        if (4 - card2NumDict[keyList[i]]) <= keyCardNum:
            for j in range(4 - card2NumDict[keyList[i]]):
                tempList.append(keyList[i] << 3)
            suggestList = tempList

    makeCards.extend(suggestList)
    makeCards = sorted(makeCards)
    return makeCards


def makeKeyCardNormalBomb(originCardsButKey, originKeys):  # 癞子转化为新的炸弹
    makeCards = copy.deepcopy(originCardsButKey)
    keyCardNum = len(originKeys)
    for i in range(keyCardNum):
        makeCards.append((originCardsButKey[0] >> 3) << 3)
    makeCards = sorted(makeCards)
    return makeCards


def getLeftOffset(i, seq):  # 返回需要 的list
    sequence = copy.deepcopy(seq)
    if const.CARD2 in sequence:
        sequence.remove(const.CARD2)
    sequence = sorted(sequence, reverse=True)
    if i < 0:
        lis = []
        for j in range(3, 15)[::-1]:
            if j > sequence[0]:
                lis.append(j)
        return lis
    # elif i >= len(sequence)
    # 	lis = []
    # 	for j in range(3, 15)[::-1]:
    # 		if j < sequence[-1]:
    # 			lis.append(j)
    # 	return lis
    lis = []
    for j in range(3, 15)[::-1]:
        if sequence[i + 1] < j and j < sequence[i]:
            lis.append(j)
    return lis


def getRightOffset(i, seq):
    sequence = copy.deepcopy(seq)
    if const.CARD2 in sequence:
        sequence.remove(const.CARD2)
    sequence = sorted(sequence)
    if i < 0:
        lis = []
        for j in range(3, 15):
            if j < sequence[0]:
                lis.append(j)
        return lis
    # elif i >= len(sequence):
    # 	lis = []
    # 	for j in range(3, 15):
    # 		if j > sequence[-1]:
    # 			lis.append(j)
    # 	return lis
    lis = []
    for j in range(3, 15):
        if sequence[i] < j and j < sequence[i + 1]:
            lis.append(j)
    return lis


def checkIsCard2Serial(serial, minCardNum=5):
    copySerial = copy.deepcopy(serial)
    if const.CARD2 not in copySerial or len(serial) >= len(const.CIRCLE) or len(serial) < minCardNum:
        return False
    copySerial.remove(const.CARD2)
    for i in range(len(const.CIRCLE)):
        if const.CIRCLE[i] in copySerial:
            copySerial.remove(const.CIRCLE[i])
        else:
            break

    for i in range(len(const.CIRCLE) - 1)[::-1]:
        if const.CIRCLE[i] in copySerial:
            copySerial.remove(const.CIRCLE[i])
        else:
            break
    if len(copySerial) > 0:
        return False
    return True


def rightShiftCards(cards):
    result = [0] * len(cards)
    for i in range(len(cards)):
        result[i] = cards[i] >> 3
    return result


# 炸弹不可拆
def getCanPlay(cards, playerCards, gamePlays, key_card):
    if gamePlays[3] == 0:
        return True

    fourKeyList = []
    fourKeyNum = 0
    playerCards = rightShiftCards(playerCards)
    playerCardsDict = getCard2NumDict(playerCards)
    for card in playerCardsDict:
        if playerCardsDict[card] == 4 and (key_card >> 3) != card:
            fourKeyList.append(card)

    for i in range(len(fourKeyList)):
        for j in range(len(cards)):
            if fourKeyList[i] == cards[j]:
                fourKeyNum += 1
    if fourKeyNum == 0 or fourKeyNum == 4:
        return True
    return False


def checkSplitBomb(cards, playerCards, gamePlays, key_card):
    playerCards = rightShiftCards(playerCards)
    card2NumDict = getCard2NumDict(cards)
    playerCards2NumDict = getCard2NumDict(playerCards)
    if gamePlays[3] == 1:  # 炸弹不可拆
        for card in card2NumDict:
            if (key_card >> 3) != card:
                if card2NumDict[card] == 4 and len(cards) != 4 and checkIsFourBring2(cards,
                                                                                     gamePlays) == False and checkIsFourBring3(
                    cards, gamePlays) == False:
                    DEBUG_MSG("zha dan bu ke chai")
                    return True
                if playerCards2NumDict.get(card) and playerCards2NumDict[card] == 4 and playerCards2NumDict[card] != \
                        card2NumDict[card]:
                    DEBUG_MSG("zha dan bu ke chai")
                    return True
    return False


# 0无牌 1非可出牌型 2单张 3对子 4连对 5三张 6连三张
# 7顺子 8炸弹 9四王炸
def getNormalCardsType(cards, playerCards, playerCardsNum, gamePlays, gameEnd, disType=0,
                       key_card=0):  # cards 为右移2位后的牌
    DEBUG_MSG("cards:{0},playerCards:{1},playerCardsNum:{2},gamePlays:{3},gameEnd:{4}".format(cards, playerCards,
                                                                                              playerCardsNum, gamePlays,
                                                                                              gameEnd))
    if len(cards) <= 0:
        return const.TYPE_NO_CARD
    elif checkSplitBomb(cards, playerCards, gamePlays, key_card):  # 炸弹不可拆
        return const.TYPE_INVALID
    elif checkIsSingle(cards):  # 单张
        return const.TYPE_SINGLE
    elif checkIsPair(cards):  # 对子
        return const.TYPE_PAIR
    elif checkIsSerialPair(cards):  # 连对
        return const.TYPE_SERIAL_PAIR
    elif checkIsTriple(cards, playerCardsNum, gameEnd, disType):  # 三张
        return const.TYPE_TRIPLE
    elif checkIsSerialTriple(cards, playerCardsNum):  # 飞机不带
        return const.TYPE_SERIAL_TRIPLE
    elif checkIsSerialSingle(cards):  # 顺子
        return const.TYPE_SERIAL_SINGLE
    elif checkIsNormalBomb(cards):  # 炸弹
        return const.TYPE_BOMB
    elif checkIsTripleBring1(cards, playerCardsNum, gameEnd, disType):  # 三带一
        return const.TYPE_TRIPLE_ONE
    elif checkIsTripleBring2(cards):  # 三带二
        return const.TYPE_TRIPLE_TWO
    elif checkIsPlane(cards, playerCardsNum, gameEnd, disType):  # 飞机
        return const.TYPE_PLANE_ONE
    elif checkIsFourBring2(cards, gamePlays):  # 四带二
        return const.TYPE_FOUR_TWO
    elif checkIsFourBring3(cards, gamePlays):  # 四带三
        return const.TYPE_FOUR_THREE
    return 1


def IsCardsTypeSame(normalCards, keyCards, cmpType):
    type = False
    if cmpType == const.TYPE_BOMB:
        type = checkIsKeyCardBomb(normalCards, keyCards)
    elif cmpType == const.TYPE_SERIAL_SINGLE:
        type = checkIsKeyCardSerialSingle(normalCards, keyCards)
    elif cmpType == const.TYPE_PLANE_ONE:
        type = checkIsKeyCardPlane(normalCards, keyCards)
    elif cmpType == const.TYPE_PAIR:
        type = checkIsKeyCardPair(normalCards, keyCards)
    elif cmpType == const.TYPE_SERIAL_PAIR:
        type = checkIsKeyCardSerialPair(normalCards, keyCards)
    elif cmpType == const.TYPE_TRIPLE:
        type = checkIsKeyCardTriple(normalCards, keyCards)
    elif cmpType == const.TYPE_SERIAL_TRIPLE:
        type = checkIsKeyCardSerialTriple(normalCards, keyCards)
    elif cmpType == const.TYPE_TRIPLE_TWO:
        type = checkIsKeyCardTripleBring(normalCards, keyCards)
    else:
        type = False
    return type


# 0无牌 1非可出牌型 22对子 23连对 24三张 25连三张 
# 26顺子 27炸弹 
def getInsteadCardsType(normalCards, keyCards):
    discardType = []
    if len(normalCards) + len(keyCards) <= 0:
        discardType.append(const.TYPE_NO_CARD)
    elif checkIsKeyCardBombMAX(normalCards, keyCards):
        discardType.append(const.TYPE_BOMB_MAX)
    elif checkIsKeyCardBomb(normalCards, keyCards):
        discardType.append(const.TYPE_BOMB)
    elif checkIsKeyCardSerialSingle(normalCards, keyCards):
        discardType.append(const.TYPE_SERIAL_SINGLE)
    elif checkIsKeyCardPair(normalCards, keyCards):
        discardType.append(const.TYPE_PAIR)
    elif checkIsKeyCardSerialPair(normalCards, keyCards):
        discardType.append(const.TYPE_SERIAL_PAIR)
    elif checkIsKeyCardPlane(normalCards, keyCards):
        discardType.append(const.TYPE_PLANE_ONE)
    elif checkIsKeyCardTriple(normalCards, keyCards):
        discardType.append(const.TYPE_TRIPLE)
    elif checkIsKeyCardSerialTriple(normalCards, keyCards):
        discardType.append(const.TYPE_SERIAL_TRIPLE)
    elif checkIsKeyCardTripleBring(normalCards, keyCards):
        discardType.append(const.TYPE_TRIPLE_TWO)
    else:
        discardType.append(const.TYPE_INVALID)
    return discardType


# 必须传入 类型相等 且 >= 2 牌型
# 0 小于等于  1 大于
def cmpSameTypeCards(controllerCards, cards, cardsType):  # baseCards, selCards 为右移2位后的牌
    DEBUG_MSG("cmpSameTypeCards  {0}--{1}--{2}".format(controllerCards, cards, cardsType))
    baseCards = rightShiftCards(controllerCards)
    selCards = rightShiftCards(cards)
    DEBUG_MSG("cmpSameTypeCards  {0}--{1}".format(baseCards, selCards))
    card2NumDict_1 = getCard2NumDict(baseCards)
    card2NumDict_2 = getCard2NumDict(selCards)
    comList=[]
    for card in card2NumDict_1:
        if card2NumDict_1[card] >= 3:
            comList.append(card)
    if cardsType == 0 or cardsType == 1:
        return False
    elif cardsType == 2 or cardsType == 3 or cardsType == 4 or cardsType == 5 or cardsType == 6 or cardsType == 7:
        if len(selCards) == len(baseCards) and selCards[0] > baseCards[0]:
            return True
        elif cardsType == 6 and len(selCards) != len(baseCards) and selCards[0] > comList[0]:
            return True
        elif cardsType == 5 and len(selCards) != len(baseCards) and selCards[0] > comList[0]:
            return True
    elif cardsType == 99:
        conKeyNum = 0
        cardsKeyNum = 0
        for i in range(len(controllerCards)):
            if controllerCards[i] in const.INSTEAD:
                conKeyNum += 1
        for i in range(len(cards)):
            if cards[i] in const.INSTEAD:
                cardsKeyNum += 1
        if conKeyNum == 4:
            return False
        if cardsKeyNum == 4:
            return True

        if conKeyNum > 0 and cardsKeyNum > 0:
            if selCards[0] > baseCards[0]:
                return True
        elif cardsKeyNum > 0 and conKeyNum <= 0:
            return False
        elif cardsKeyNum <= 0 and conKeyNum > 0:
            return True
        elif cardsKeyNum <= 0 and conKeyNum <= 0:
            if selCards[0] > baseCards[0]:
                return True
    elif cardsType == 12 or cardsType == 13:
        DEBUG_MSG("cardsType {0}".format(cardsType))
        tripleBring_1 = -1
        tripleBring_2 = -1
        for card in card2NumDict_1:
            if card2NumDict_1[card] >= 3:
                tripleBring_1 = card

        for card in card2NumDict_2:
            if card2NumDict_2[card] >= 3:
                tripleBring_2 = card
        if tripleBring_2 > tripleBring_1:
            return True
    elif cardsType == 14:
        key3List_1 = []
        key3List_2 = []
        key3List_1_max = 0
        key3List_2_min = 0
        for card in card2NumDict_1:
            if card2NumDict_1[card] >= 3:
                key3List_1.append(card)
        for card in card2NumDict_2:
            if card2NumDict_2[card] >= 3:
                key3List_2.append(card)
        key3List_1.sort()
        key3List_2.sort()
        for i in range(len(key3List_1) - 1):
            if (key3List_1[i] + 1) == key3List_1[i + 1]:
                key3List_1_max = key3List_1[i + 1]
        for i in range(len(key3List_2) - 1):
            if (key3List_2[i] + 1) == key3List_2[i + 1]:
                key3List_2_min = key3List_2[i]
        if key3List_1_max < key3List_2_min:
            return True
        return False
    elif cardsType == 15 or cardsType == 16:
        fourCard_1 = 0
        fourCard_2 = 0
        for card in card2NumDict_1:
            if card2NumDict_1[card] == 4:
                fourCard_1 = card
        for card in card2NumDict_2:
            if card2NumDict_2[card] == 4:
                fourCard_2 = card
        if fourCard_1 < fourCard_2:
            return True
        return False
    return False


def makeCard(originCards, cardsType, keyCard):
    normalCards, keyCards = classifyCards(originCards, keyCard)
    if cardsType == 3:
        return makeKeyCardPair(normalCards, keyCards)
    elif cardsType == 4:
        return makeKeyCardSerialPair(normalCards, keyCards)
    elif cardsType == 5:
        return makeKeyCardTriple(normalCards, keyCards)
    elif cardsType == 6:
        return makeKeyCardSerialTriple(normalCards, keyCards)
    elif cardsType == 7:
        return makeKeyCardSerialSingle(normalCards, keyCards)
    elif cardsType == 13:
        return makeKeyCardTripleBring(normalCards, keyCards)
    elif cardsType == 14:
        return makeKeyCardPlane(normalCards, keyCards)
    elif cardsType == 99:
        return makeKeyCardNormalBomb(normalCards, keyCards)
    return originCards


# elif cardsType == 15 or cardsType == 16:
# 	return makeKeyCardFourBring(normalCards, keyCards)

def cards2baseLines(cards):
    tmp_dict = {}
    for card in cards:
        if tmp_dict.get(card):
            tmp_dict[card] += 1
        else:
            tmp_dict[card] = 1
    baseLineList = [0] * 12
    for card in tmp_dict:
        baseLineList[tmp_dict[card]] += 1
    return baseLineList


def checkValuesIn(value_list, range_list):
    """
    检查所有值是否在某个范围内
    :param value_list: 需要检查的值
    :param range_list: 合法值
    :return: True or False
    """
    for v in value_list:
        if v not in range_list:
            return False
    return True

