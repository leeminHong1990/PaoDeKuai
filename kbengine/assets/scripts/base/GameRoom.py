# -*- coding: utf-8 -*-

import KBEngine
from KBEDebug import *
import time
from datetime import datetime
from interfaces.GameObject import GameObject
from entitymembers.iRoomRules import iRoomRules
from entitymembers.iRoomTips import iRoomTips
from entitymembers.PlayerProxy import PlayerProxy
from BaseEntity import BaseEntity
import h1global
import const
import random
import copy
import math
import switch
import utility
import json
import threading
import x42
import Functor

SPORT_DELETE_TIME = 60 * 60


class GameRoom(BaseEntity, GameObject, iRoomRules, iRoomTips):
    """
	这是一个游戏房间/桌子类
	该类处理维护一个房间中的实际游戏， 例如：跑得快、斗地主、麻将等
	该房间中记录了房间里所有玩家的mailbox，通过mailbox我们可以将信息推送到他们的客户端。
	"""

    def __init__(self):
        BaseEntity.__init__(self)
        GameObject.__init__(self)
        iRoomRules.__init__(self)
        iRoomTips.__init__(self)

        self.owner_uid = 0
        self.agent = None
        self.roomID = utility.gen_room_id(self.id)

        # 状态0：未开始游戏， 1：某一局游戏中
        self.state = 0

        # 存放该房间内的玩家mailbox
        self.players_dict = {}
        self.players_list = [None] * self.player_num
        self.origin_players_list = [None] * self.player_num
        # 控牌玩家
        self.controller_idx = -1
        # 控牌玩家出的牌
        self.controller_discard_list = []
        # 等待出牌玩家
        self.wait_idx = -1
        # 桌牌
        self.deskPokerList = [[] for i in range(self.player_num)]
        # 当前局数
        self.current_round = 0
        # 癞子
        self.key_card = 0
        # 交换顺序
        self.swap_list = [i for i in range(self.player_num)]
        # 房间开局所有操作的记录(idx, op, cards, insteadCards)
        self.op_record = []
        # 房间开局操作的记录对应的记录id
        self.record_id = -1

        # 房间基础轮询timer
        self._poll_timer = None
        # 玩家操作限时timer
        self._op_timer = None
        # 一局游戏结束后, 玩家准备界面等待玩家确认timer
        self._next_game_timer = None
        # 确认继续的玩家
        self.confirm_next_idx = []
        # 解散房间操作的发起者
        self.dismiss_room_from = -1
        # 解散房间操作开始的时间戳
        self.dismiss_room_ts = 0
        # 解散房间操作投票状态
        self.dismiss_room_state_list = [0, 0, 0, 0]
        self.dismiss_timer = None

        self.roomOpenTime = time.time()

        # 当前庄家
        self.dealer_idx = -1
        # 玩家的总的牌数
        self.player_cards_num = 16
        # 炸弹数量
        self.bomb_times_list = [0, 0, 0]
        # 所有玩家已经出过的牌
        self.players_discard_list = [[] for i in range(self.player_num)]
        # 是否轮过一圈
        self.player_op = [0] * self.player_num
        # 红桃10所现在玩家的idx 默认-1
        self.hong_idx = -1
        # 玩家手牌的中间变量
        if self.player_num <= 3:
            self.player_cards_list = [[], [], []]
        else:
            self.player_cards_list = [[], [], [], []]

        # 创建房间开始的时间戳
        self.create_room_timer = None
        self.create_room_ts = 0

        # 自动出牌倒计时
        self.auto_discards_timer = None
        # 自动过牌倒计时
        self.auto_pass_timer = None

        # 比赛场继续游戏倒计时
        self.auto_continue_timer = None

        # 赛事 增加一个关闭倒计时
        if self.sportId > 0:
            self.add_timer(SPORT_DELETE_TIME, self.kick)

        # 游戏结束时间
        self.end_time = None

    def kick(self):
        if self.current_round > 0:
            self.dismiss()
        else:
            self.dropRoom()

    @property
    def isFull(self):
        count = sum([1 for i in self.players_list if i is not None])
        return count == self.player_num

    @property
    def isEmpty(self):
        count = sum([1 for i in self.players_list if i is not None])
        return count == 0 and self.agent is None

    def getNextWaitIdx(self, cur_wait_idx):
        DEBUG_MSG("getNextWaitIdx {0}".format(cur_wait_idx))
        next_wait_idx = cur_wait_idx
        for i in range(1, self.player_num + 1):
            next_wait_idx = (next_wait_idx + 1) % self.player_num
            DEBUG_MSG("getNextWaitIdx  next_wait_idx :{0}".format(next_wait_idx))
            DEBUG_MSG("getNextWaitIdx  controller_idx :{0}".format(self.controller_idx))
            if self.controller_idx == next_wait_idx and len(self.players_list[self.controller_idx].cards) <= 0:
                return (next_wait_idx + 2) % 4, True
            if len(self.players_list[next_wait_idx].cards) > 0:
                return next_wait_idx, False
        return next_wait_idx, False

    def getSit(self):
        for i, j in enumerate(self.players_list):
            if j is None:
                return i

    def _reset(self):
        self.state = 2
        KBEngine.globalData["GameWorld"].delRoom(self)
        self.state = 0
        self.agent = None
        self.players_list = [None] * self.player_num
        self.controller_idx = -1
        self.wait_idx = -1
        self.swap_list = [i for i in range(self.player_num)]
        self.controller_discard_list = []
        self.deskPokerList = [[] for i in range(self.player_num)]
        self._poll_timer = None
        self._op_timer = None
        self._next_game_timer = None
        self.current_round = 0
        self.confirm_next_idx = []
        self.dismiss_timer = None
        self.dismiss_room_ts = 0
        self.dismiss_room_state_list = [0, 0, 0, 0]
        self.player_cards_num = 0
        self.dealer_idx = -1  # 庄家
        self.player_op = [0] * self.player_num
        self.players_discard_list = [[] for i in range(self.player_num)]
        self.key_card = 0
        self.create_room_timer = None
        self.create_room_ts = 0
        self.hong_idx = -1
        self.end_time = None

    def destroySelf(self):
        self.clear_timers()
        not self.isDestroyed and self.destroy()

    def reqEnterRoom(self, avt_mb, first=False):
        """
		defined.
		客户端调用该接口请求进入房间/桌子
		"""
        if self.isFull:
            avt_mb.enterRoomFailed(const.ENTER_FAILED_ROOM_FULL)
            return

        self.end_time = time.time()
        # 代开房
        if first and self.is_agent == 1:
            self.agent = PlayerProxy(avt_mb, self, -1)
            self.players_dict[avt_mb.userId] = self.agent
            avt_mb.enterRoomSucceed(self, -1)
            return

        for i, p in enumerate(self.players_list):
            if p and p.mb and p.mb.userId == avt_mb.userId:
                p.mb = avt_mb
                avt_mb.enterRoomSucceed(self, i)
                return
        if first:
            self.create_room_ts = time.time()
            self.create_room_timer = self.add_timer(
                const.BOT_JOIN_ROOM_TIMER if self.is_competition == 1 else const.CREATE_ROOM_WAIT_TIMER,
                self.botEnterRoom)

        DEBUG_MSG("Room.reqEnterRoom: %s" % self.roomID)
        idx = self.getSit()
        n_player = PlayerProxy(avt_mb, self, idx)
        self.players_dict[avt_mb.userId] = n_player
        self.players_list[idx] = n_player

        if not first:
            self.broadcastEnterRoom(idx)
            # self.check_same_ip()

        if self.isFull:
            self.origin_players_list = self.players_list[:]
            self.showGPS()

    def reqReconnect(self, avt_mb):
        DEBUG_MSG("GameRoom reqReconnect userid = {}".format(avt_mb.userId))
        if avt_mb.userId not in self.players_dict.keys():
            return

        DEBUG_MSG("GameRoom reqReconnect player is in room".format(avt_mb.userId))
        # 如果进来房间后牌局已经开始, 就要传所有信息
        # 如果还没开始, 跟加入房间没有区别
        player = self.players_dict[avt_mb.userId]
        if self.agent and player.userId == self.agent.userId:
            self.agent.mb = avt_mb
            self.agent.online = 1
            avt_mb.enterRoomSucceed(self, -1)
            return

        player.mb = avt_mb
        player.online = 1
        if self.state == 1 or 0 < self.current_round <= self.game_round:
            if self.state == 0:
                for idx, p in enumerate(self.players_list):
                    if p and p.mb:
                        if p.mb.userId == avt_mb.userId and idx not in self.confirm_next_idx:
                            # 重连回来直接准备
                            self.roundEndCallback(avt_mb)
                            break

            rec_room_info = self.get_reconnect_room_dict(player.mb.userId)
            player.mb.handle_reconnect(rec_room_info)
        else:
            sit = 0
            for idx, p in enumerate(self.players_list):
                if p and p.mb:
                    if p.mb.userId == avt_mb.userId:
                        sit = idx
                        break
            avt_mb.enterRoomSucceed(self, sit)

            # self.check_same_ip()

    def reqLeaveRoom(self, player):
        """
		defined.
		客户端调用该接口请求离开房间/桌子
		"""
        DEBUG_MSG("Room.reqLeaveRoom:{0}, is_agent={1}".format(self.roomID, self.is_agent))
        if player.userId in self.players_dict.keys():
            n_player = self.players_dict[player.userId]
            idx = n_player.idx
            if idx == -1 and self.is_agent == 1:
                self.give_up_record_game()
                self.dropRoom()
            elif idx == 0 and self.is_agent == 0:
                # 房主离开房间, 则解散房间
                self.give_up_record_game()
                self.dropRoom()
            else:
                n_player.mb.quitRoomSucceed()
                self.players_list[idx] = None
                del self.players_dict[player.userId]
                if idx in self.confirm_next_idx:
                    self.confirm_next_idx.remove(idx)
                # 通知其它玩家该玩家退出房间
                for i, p in enumerate(self.players_list):
                    if i != idx and p and p.mb:
                        p.mb.othersQuitRoom(idx)
                if self.agent and self.agent.mb:
                    self.agent.mb.othersQuitRoom(idx)

        if self.isEmpty:
            self.give_up_record_game()
            self._reset()

    def dropRoom(self):
        if self.current_round >= 1 and getattr(self, 'game_result', None) and len(
                self.game_result.get('round_result', [])) > 0:
            info = self.getResultRoomInfo()
            player_info_list = [p.get_final_client_dict() for p in self.players_list if p is not None]
            DEBUG_MSG(
                "room:{0}, curround:{1} subTotalResult, player_info_list:{2}".format(self.roomID, self.current_round,
                                                                                     player_info_list))
            weekly_score_list = [p.get_weekly_sport_score_list() for p in self.players_list if p is not None]
            # 大赢家
            maxScore = 0
            winId = 0
            for p in self.players_list:
                if p and p.mb:
                    if p.total_score > maxScore:
                        maxScore = p.total_score
                        winId = p.mb.userId
            # 公会排行榜
            for p in self.players_list:
                if p and p.mb:
                    try:
                        p.mb.subTotalResult(player_info_list, info, weekly_score_list)
                        if self.group_id > 0:
                            rankInfo = p.get_group_rank_info()
                            KBEngine.globalData['GameWorld'].updateGroupRankList(self.group_id, rankInfo, winId)
                    except:
                        pass
        else:
            for p in self.players_list:
                if p and p.mb:
                    try:
                        p.mb.quitRoomSucceed()
                    except:
                        pass

        if self.agent and self.agent.mb:
            try:
                self.agent.mb.quitRoomSucceed()
            except:
                pass

        self._reset()

    def botEnterRoom(self):
        if self.is_competition == 1:
            playerNum = 0
            for p in self.players_list:
                if p is None:
                    playerNum += 1
            KBEngine.globalData["GameWorld"].queryBotsEnterRoom(self.roomID, playerNum, self.sportId)
        else:
            self.dropRoom()

    def startGame(self):
        """ 开始游戏 """
        cards_list = [16, 15, 13, 27]
        self.op_record = []
        self.player_op = [0] * self.player_num
        self.controller_discard_list = []
        self.deskPokerList = [[] for i in range(self.player_num)]
        self.state = 1
        self.key_card = 0
        self.current_round += 1
        self.hong_idx = -1
        self.player_cards_num = cards_list[self.game_mode if self.game_mode != 2 else self.game_cardnum]
        self.players_discard_list = [[] for i in range(self.player_num)]

        # 防止局数大于总局数
        if self.current_round > self.game_round:
            self.dropRoom()

        if self.player_num <= 3:
            self.player_cards_list = [[], [], []]
        else:
            self.player_cards_list = [[], [], [], []]

        if self.create_room_timer:
            self.cancel_timer(self.create_room_timer)
            self.create_room_timer = None
            self.create_room_ts = 0

        if self.auto_discards_timer:
            self.cancel_timer(self.auto_discards_timer)
            self.auto_discards_timer = None

        if self.auto_continue_timer:
            self.cancel_timer(self.auto_continue_timer)
            self.auto_continue_timer = None

        # 扣费后开始游戏的回调
        def callback(content):
            if content[0] != '{':
                DEBUG_MSG(content)
                self.give_up_record_game()
                self.dropRoom()
                return
            for p in self.players_list:
                p.reset()
            self.initCards(self.game_mode)
            self.deal()
            discard_idx = -1

            # 确定庄家和出牌的人
            if self.current_round == 1:
                # 移除 赛事 房间信息
                if h1global.getRoomSportType(self.sportId) == const.SPORT_DAILY:
                    x42.SportDailyStub.dismissRoom(self)
                elif h1global.getRoomSportType(self.sportId) == const.SPORT_WEEKLY:
                    x42.SportWeeklyStub.dismissRoom(self)

                if self.player_num == 2:
                    isController = random.randint(0, 1)
                    self.wait_idx = isController
                    self.controller_idx = isController
                    discard_idx = isController
                    self.dealer_idx = 0
                else:
                    if self.game_start == 0:
                        for i, p in enumerate(self.players_list):
                            if const.HEI_THREE in p.cards:
                                self.wait_idx = i
                                self.controller_idx = i
                                discard_idx = i
                    else:
                        discard_idx = 0
                        self.wait_idx = 0
                        self.controller_idx = 0
                    self.dealer_idx = 0
            else:
                if self.game_hei3 == 0:
                    for i, p in enumerate(self.players_list):
                        if const.HEI_THREE in p.cards:
                            self.wait_idx = i
                            self.controller_idx = i
                            discard_idx = i
                else:
                    self.wait_idx = self.dealer_idx
                    self.controller_idx = self.dealer_idx
                    discard_idx = self.dealer_idx
            DEBUG_MSG("=========== {0}".format(self.dealer_idx))
            for i, p in enumerate(self.players_list):
                DEBUG_MSG("player [{0}] cards: {1}".format(p.idx, p.cards))
            if self.game_mode == 2:
                # 确定癞子
                self.random_key_card()
                # 切换癞子牌
                self.exchangeKeyCard()

            # 判断红桃10所在的玩家
            if self.game_plays[0] == 1:
                for i, p in enumerate(self.players_list):
                    if p and (83 in p.cards):
                        self.hong_idx = i
            self.cards = []
            for p in self.players_list:
                if p and p.mb:
                    p.mb.startGame(self.dealer_idx, discard_idx, self.key_card, p.cards)
            self.begin_record_game()

            if self.is_competition == 1:
                for i, p in enumerate(self.players_list):
                    if p and p.mb and i == discard_idx:
                        if p.mb.isBot:
                            self.auto_discards_timer = self.add_timer(random.randint(5, 10),
                                                                      Functor.Functor(self.autoDiscard, self.wait_idx))
                        else:
                            self.auto_discards_timer = self.add_timer(const.AUTO_DISCARD_TIME,
                                                                      Functor.Functor(self.autoDiscard, self.wait_idx))
                        break

        if self.current_round == 1 and self.is_agent == 0:
            # 仅仅在第1局扣房卡, 不然每局都会扣房卡
            card_cost, diamond_cost = switch.calc_cost(self.game_round)
            if switch.DEBUG_BASE:
                callback('{"card":99, "diamond":999}')
            elif self.is_competition != 0:
                callback('{"card":99, "diamond":999}')
            else:
                accountName = self.players_list[0].mb.accountName
                if self.group_id > 0:
                    group = KBEngine.globalData["GameWorld"].groupDict.get(self.group_id)
                    if group:
                        accountName = KBEngine.globalData["GameWorld"].cacheDict.get(group.owner_info["userId"],
                                                                                     {}).get("accountName", "")
                utility.update_card_diamond(accountName, -card_cost, -diamond_cost, callback,
                                            "PaoDeKuai RoomID:{}".format(self.roomID))
            return
        DEBUG_MSG(
            "start Game: Room{0} - Round{1}".format(self.roomID, str(self.current_round) + '/' + str(self.game_round)))

        callback('{"card":99, "diamond":999}')

    def exchangeKeyCard(self):
        """ 将玩家的牌换成对应的癞子牌 """
        DEBUG_MSG("key_card: {0}".format(self.key_card))
        self.key_card = math.floor(self.key_card / 8) * 8
        key_card_list = []
        for x in range(4):
            key_card_list.append(self.key_card + x + 1)
        for i, p in enumerate(self.players_list):
            if p:
                for j in range(len(p.cards)):
                    if p.cards[j] in key_card_list:
                        p.cards[j] = self.key_card
        for i, p in enumerate(self.player_cards_list):
            if p:
                for j in range(len(p)):
                    if p[j] in key_card_list:
                        p[j] = self.key_card
        for i, p in enumerate(self.players_list):
            DEBUG_MSG("exchangeKeyCard player [{0}] cards: {1}".format(p.idx, p.cards))

    def swapTileToTop(self, tile):
        pass

    def passOperation(self, is_auto, idx):
        p = self.players_list[idx]
        p.turnPass(is_auto)
        self.wait_idx, isChangeController = self.getNextWaitIdx(self.wait_idx)
        # DEBUG_MSG("confirmOperation,wait_idx:{0},isChangeController:{1}".format(self.wait_idx, isChangeController))
        if isChangeController:
            self.deskPokerList[self.controller_idx] = []
            self.controller_idx = self.wait_idx
            for i, p in enumerate(self.players_list):
                if p.mb is not None:
                    p.mb.notifyChangeController(self.wait_idx)
        self.deskPokerList[self.wait_idx] = []
        self.waitForOperation(self.wait_idx)
        self.passDiscards(idx)

    def reqStopGame(self):
        """
		客户端调用该接口请求停止游戏
		"""
        DEBUG_MSG("Room.reqLeaveRoom: %s" % self.roomID)
        self.state = 0

    def doOperation(self, avt_mb, aid, cards):
        if self.dismiss_room_ts != 0 and int(time.time() - self.dismiss_room_ts) < const.DISMISS_ROOM_WAIT_TIME:
            # 说明在准备解散投票中,不能进行其他操作
            return

        idx = -1
        for i, p in enumerate(self.players_list):
            if p and p.mb == avt_mb:
                idx = i

        if idx != self.wait_idx:
            avt_mb.doOperationFailed(const.OP_ERROR_NOT_CURRENT)
            return

    def confirmOperation(self, avt_mb, aid, cards, is_auto):
        """
        被轮询的玩家确认了某个操作
        """
        DEBUG_MSG("confirmOperatin,aid:{0},cards:{1}.".format(aid, cards))
        # if self.dismiss_room_ts != 0 and int(time.time() - self.dismiss_room_ts) < const.DISMISS_ROOM_WAIT_TIME:
        #     # 说明在准备解散投票中,不能进行其他操作
        #     return
        idx = -1
        for i, p in enumerate(self.players_list):
            if p and p.mb == avt_mb:
                idx = i

        if idx != self.wait_idx:
            avt_mb.doOperationFailed(const.OP_ERROR_NOT_CURRENT)
            return

        if self.auto_discards_timer is not None and is_auto == 0:
            self.cancel_timer(self.auto_discards_timer)
            self.auto_discards_timer = None

        p = self.players_list[idx]
        if aid == const.OP_PASS and self.controller_idx != self.wait_idx:
            if self.game_force == 1:
                self.passOperation(is_auto, idx)
            else:
                tipslist = self.getTipsCards(self.wait_idx)
                if len(tipslist) == 0:
                    self.passOperation(is_auto, idx)
        elif aid == const.OP_DISCARD:
            isCanPlay, insteadCard, firstDiscardErr = self.can_play_cards(p.cards, cards, idx, self.current_round)
            DEBUG_MSG("OP_DISCARD : {0}  insteadCard : {1} ".format(isCanPlay, insteadCard))
            if isCanPlay and firstDiscardErr == 0:
                self.game_start = 0
                self.getBombTimes(idx, cards)  # 计算炸弹数量
                p.discard(cards, insteadCard, is_auto)
                # DEBUG_MSG("==========cards {0}".format(cards))
                self.deskPokerList[idx] = insteadCard
                self.players_discard_list[idx].extend(cards)
                if len(p.cards) <= 0:
                    self.winGame(idx)
                else:
                    self.wait_idx, isChangeController = self.getNextWaitIdx(self.wait_idx)
                    self.deskPokerList[self.wait_idx] = []
                    self.waitForOperation(self.wait_idx)
            elif firstDiscardErr == 1:
                avt_mb.doOperationFailed(const.OP_ERROR_FIRST_DISCARD)
            else:
                DEBUG_MSG("doOperationFailed 111 caozuo feifa")
                avt_mb.doOperationFailed(const.OP_ERROR_ILLEGAL)
        else:
            DEBUG_MSG("doOperationFailed 222 caozuo feifa")
            avt_mb.doOperationFailed(const.OP_ERROR_ILLEGAL)

    def autoDiscard(self, waitIdx):
        tipsList = self.getTipsCards(waitIdx)
        DEBUG_MSG("autoDiscard tipsList: {0}".format(tipsList))
        for i, p in enumerate(self.players_list):
            if p and p.mb and i == waitIdx:
                wait_idx, isChangeController = self.getNextWaitIdx(waitIdx)
                if len(tipsList) > 0:
                    if len(self.players_list[wait_idx].cards) == 1:
                        if self.isAllSingleCard(tipsList):
                            maxCardIndex = self.getMaxCardindex(tipsList)
                            self.confirmOperation(p.mb, const.OP_DISCARD, tipsList[maxCardIndex], 1)
                        else:
                            if tipsList[0] == [28]:
                                self.confirmOperation(p.mb, const.OP_DISCARD, tipsList[1], 1)
                            else:
                                self.confirmOperation(p.mb, const.OP_DISCARD, tipsList[0], 1)
                    else:
                        self.confirmOperation(p.mb, const.OP_DISCARD, tipsList[0], 1)
                else:
                    self.confirmOperation(p.mb, const.OP_PASS, [], 1)

    def isAllSingleCard(self, tipsList):
        for x in tipsList:
            if len(x) > 1:
                return False
        return True

    def getMaxCardindex(self, tipsList):
        maxCard = 0
        flag = 0
        for i, p in enumerate(tipsList):
            if maxCard < p[0]:
                maxCard = p[0]
                flag = i
        return flag

    def getBombTimes(self, idx, cards):
        # DEBUG_MSG("getBombTimes idx:{0} controller_idx:{1}".format(idx, self.controller_idx))
        DEBUG_MSG("getBombTimes cards:{0} controller_discard_list:{1}".format(cards, self.controller_discard_list))
        if self.game_mode == 2:
            normalCards, keyCards = utility.classifyCards(cards, self.key_card)
            normalCardsShift = utility.rightShiftCards(normalCards)
            keyCardsShift = utility.rightShiftCards(keyCards)

            controllerCards, controllerKeyCards = utility.classifyCards(self.controller_discard_list, self.key_card)
            controllerCardsShift = utility.rightShiftCards(controllerCards)
            controllerKeyCardsShift = utility.rightShiftCards(controllerKeyCards)
            isBomb = utility.checkIsKeyCardBomb(normalCardsShift, keyCardsShift)
            controllerBomd = utility.checkIsKeyCardBomb(controllerCardsShift, controllerKeyCardsShift)
        else:
            isBomb = utility.checkIsNormalBomb(utility.rightShiftCards(cards))
            controllerBomd = utility.checkIsNormalBomb(utility.rightShiftCards(self.controller_discard_list))
        for i, p in enumerate(self.players_list):
            if p and i == idx:
                if isBomb:
                    # DEBUG_MSG("======================== 0000: {0}, {1}".format(i, idx))
                    p.addBombTimes(1)
            # if p and i == ((idx + (self.player_num - 1)) % self.player_num) and self.controller_idx != idx:
            if p and i == self.controller_idx and self.controller_idx != idx:
                if isBomb and controllerBomd:
                    # DEBUG_MSG("======================== 1111: {0}, {1}".format(i, idx))
                    p.addBombTimes(-1)

    def passDiscards(self, idx):
        # DEBUG_MSG("passDiscards11111  {0}".format(idx))
        for i, p in enumerate(self.players_list):
            if p and p.mb is not None:
                p.mb.passDiscards(idx)

    def waitForOperation(self, wait_idx):
        for i, p in enumerate(self.players_list):
            if p and p.mb is not None:
                if i == wait_idx:
                    cardList = copy.deepcopy(p.cards)
                    isCanPlay, insteadCard, firstDiscardErr = self.can_play_cards(cardList, p.cards, wait_idx,
                                                                                  self.current_round)

                    if isCanPlay and self.is_competition == 0:
                        p.mb.waitForOperation(wait_idx, const.OP_DISCARD, [])
                    elif isCanPlay and self.is_competition == 1:
                        self.confirmOperation(p.mb, const.OP_DISCARD, cardList, 1)
                    else:
                        tipslist = self.getTipsCards(wait_idx)
                        if len(tipslist) == 0:
                            if self.is_competition == 1 and p.mb.isBot:
                                self.auto_pass_timer = self.add_timer(random.uniform(0.5, 1),
                                                                      Functor.Functor(self.confirmOperation, p.mb,
                                                                                      const.OP_PASS, [], 1))
                                continue
                            else:
                                p.mb.waitForOperation(wait_idx, const.OP_PASS, [])
                                continue
                        else:
                            p.mb.waitForOperation(wait_idx, const.OP_DISCARD, [])
                        if self.is_competition == 1:
                            if p.mb.isBot:
                                self.auto_discards_timer = self.add_timer(random.randint(1, 3),
                                                                          Functor.Functor(self.autoDiscard,
                                                                                          self.wait_idx))
                            else:
                                self.auto_discards_timer = self.add_timer(const.AUTO_DISCARD_TIME,
                                                                          Functor.Functor(self.autoDiscard,
                                                                                          self.wait_idx))
                else:
                    p.mb.waitForOperation(wait_idx, const.OP_DISCARD, [])

    def reqIsAfford(self, waitIdx):
        tipslist = self.getTipsCards(waitIdx)
        for i, p in enumerate(self.players_list):
            if p and p.mb is not None:
                if i == waitIdx:
                    if len(tipslist) == 0:
                        p.mb.waitForOperation(waitIdx, const.OP_PASS, [])

    def calscore(self, idx):
        winScore = 0
        hong_ten = False  # 赢家是否有红桃10
        for i, p in enumerate(self.players_list):
            if p and i == idx and self.game_plays[0] == 1 and (
                            const.HONG_TEN in p.cards or const.HONG_TEN in [x for i in p.discard_cards for x in i]):
                hong_ten = True

        for i, p in enumerate(self.players_list):
            if p and i != idx:
                p.lose_times += 1
                if len(p.cards) == self.player_cards_num:
                    p.addscore(-(len(p.cards) * 2))
                    winScore += len(p.cards) * 2
                    if self.game_plays[0] == 1 and (
                                    const.HONG_TEN in p.cards or const.HONG_TEN in [x for i in p.discard_cards for x in
                                                                                    i]):  # 输家有红桃10,自己分数再扣一次
                        p.addscore(-(len(p.cards) * 2))
                        winScore += len(p.cards) * 2
                elif len(p.cards) == 1:
                    p.addscore(0)
                else:
                    p.addscore(-len(p.cards))
                    winScore += len(p.cards)
                    if self.game_plays[0] == 1 and (
                                    const.HONG_TEN in p.cards or const.HONG_TEN in [x for i in p.discard_cards for x in
                                                                                    i]):  # 输家有红桃10,自己分数再扣一次
                        p.addscore(-len(p.cards))
                        winScore += len(p.cards)

                if hong_ten:  # 如果赢家有红桃10,分数再算一遍,就相当于分数加倍
                    if len(p.cards) == self.player_cards_num:
                        p.addscore(-(len(p.cards) * 2))
                        winScore += len(p.cards) * 2
                    elif len(p.cards) == 1:
                        p.addscore(0)
                    else:
                        p.addscore(-len(p.cards))
                        winScore += len(p.cards)

        for i, p in enumerate(self.players_list):  # 炸弹的算分单独算,因为红桃10的炸弹分数不加倍
            if p and p.bomb_times != 0:
                for x, player in enumerate(self.players_list):
                    if i == x:
                        player.addscore(10 * p.bomb_times * (len(self.players_list) - 1))
                    else:
                        player.addscore(-10 * p.bomb_times)

        for i, p in enumerate(self.players_list):
            if p and i == idx:
                p.addscore(winScore)
                p.win_times += 1
                # for i, p in enumerate(self.players_list):
                #  DEBUG_MSG("!!: {0}, @@:{1}".format(p.win_times, p.lose_times))

    def getResultRoomInfo(self):
        info = dict()
        d = datetime.fromtimestamp(time.time())
        DEBUG_MSG("record_round_result", d)
        d_month = d.month
        d_day = d.day
        d_hour = d.hour
        d_minute = d.minute
        if d_month < 10:
            d_month = "0" + str(d_month)
        if d_day < 10:
            d_day = "0" + str(d_day)
        if d_hour < 10:
            d_hour = "0" + str(d_hour)
        if d_minute < 10:
            d_minute = "0" + str(d_minute)
        endTime = '-'.join([str(d.year), str(d_month), str(d_day)]) + " " + ':'.join([str(d_hour), str(d_minute)])
        # 房间信息
        roomInfo = {
            "game_mode": self.game_mode,
            "player_num": self.player_num,
            "game_start": self.game_start,
            "game_deal": self.game_deal,
            "game_force": self.game_force
        }
        DEBUG_MSG("record_round_result sport_type: ", h1global.getRoomSportType(self.sportId))
        group_name = ""
        if self.group_id > 0:
            group_name = KBEngine.globalData["GameWorld"].groupDict.get(self.group_id).group_name
        info['room_id'] = self.roomID
        info['group_name'] = group_name
        info['end_time'] = endTime
        info['sport_id'] = self.sportId
        info['sport_type'] = h1global.getRoomSportType(self.sportId)
        info['room_info'] = roomInfo
        return info

    def winGame(self, idx):
        DEBUG_MSG("winGame idx:{0}".format(idx))
        self.end_time = time.time()
        # 玩家的剩余牌
        for i, p in enumerate(self.players_list):
            if p:
                self.player_cards_list[i] = p.cards
        info = dict()
        self.calscore(idx)
        info['win_idx'] = idx
        info['dealer_idx'] = self.dealer_idx
        info['current_round'] = self.current_round
        info['card_list'] = self.player_cards_list
        info['hong_idx'] = self.hong_idx

        # 获取大结算界面房间信息
        r_info = self.getResultRoomInfo()
        info.update(r_info)
        # 最先出完牌的人，下一局为庄家
        self.dealer_idx = idx
        if self.current_round < self.game_round:
            self.broadcastRoundEnd(info)
        else:
            self.endAll(info)

        info['player_info_list'] = [p.get_round_client_dict() for p in self.players_list if p is not None]
        for i, p in enumerate(self.players_list):
            if p and p.mb:
                p.mb.setIntegral(p.userId, info['player_info_list'][i]['score'])

    def endAll(self, info):
        DEBUG_MSG("endAll  {0}".format(info))
        if h1global.getRoomSportType(self.sportId) == const.SPORT_DAILY:
            x42.SportDailyStub.record(self.sportId, [p.get_end_result_info() for p in self.players_list])
        elif h1global.getRoomSportType(self.sportId) == const.SPORT_WEEKLY:
            # 周赛大结算记录分数
            week_player_info_list = [p.get_end_result_info() for p in self.players_list if p is not None]
            for i, p in enumerate(self.players_list):
                if p and p.mb:
                    # if len(p.mb.weekSportScore) == 0:
                    #     p.mb.weekSportScore.append(week_player_info_list[i]['score'])
                    # else:
                    #     p.mb.weekSportScore[0] += week_player_info_list[i]['score']
                    p.mb.weekSportScore.append(week_player_info_list[i]['score'])
                    p.mb.gameLeft -= 1

        self.record_round_result()
        info['player_info_list'] = [p.get_round_client_dict() for p in self.players_list if p is not None]
        player_info_list = [p.get_final_client_dict() for p in self.players_list if p is not None]
        weekly_score_list = [p.get_weekly_sport_score_list() for p in self.players_list if p is not None]
        if h1global.getRoomSportType(self.sportId) == const.SPORT_WEEKLY:
            for p in self.players_list:
                if p and p.mb:
                    p.mb.finalResult(player_info_list, info, weekly_score_list)
            x42.SportWeeklyStub.record(self.sportId, [p.get_week_sport_result_info() for p in self.players_list])
        else:
            for p in self.players_list:
                if p and p.mb:
                    p.mb.finalResult(player_info_list, info, weekly_score_list)
        # 大赢家
        maxScore = 0
        bigWinUserId = 0
        for p in self.players_list:
            if p and p.mb:
                if p.total_score > maxScore:
                    maxScore = p.total_score
                    bigWinUserId = p.mb.userId
        # 公会排行榜
        DEBUG_MSG("GameRoom ========== {}".format(self.group_id))
        if self.group_id > 0:
            for p in self.players_list:
                if p and p.mb:
                    rankInfo = p.get_group_rank_info()
                    KBEngine.globalData['GameWorld'].updateGroupRankList(self.group_id, rankInfo, bigWinUserId)

        self.end_record_game(info)
        # 玩家牌局记录存盘
        self.save_game_result()
        self._reset()

    def sendMagicEmotion(self, avt_mb, eid, idxFrom, idxTo):
        """ 发魔法表情 """

        DEBUG_MSG("sendMagicEmotion:(%i): client reconnect!" % (idxFrom))
        for i, p in enumerate(self.players_list):
            if p and p.mb:
                p.mb.recvMagicEmotion(idxFrom, idxTo, eid)

    def sendEmotion(self, avt_mb, eid):
        """ 发表情 """
        DEBUG_MSG("Room.Player[%s] sendEmotion: %s" % (self.roomID, eid))
        idx = None
        for i, p in enumerate(self.players_list):
            if p and avt_mb == p.mb:
                idx = i
                break
        else:
            if self.agent and self.agent.userId == avt_mb.userId:
                idx = -1

        if idx is None:
            return

        if self.agent and idx != -1 and self.agent.mb:
            self.agent.mb.recvEmotion(idx, eid)

        for i, p in enumerate(self.players_list):
            if p and i != idx:
                p.mb.recvEmotion(idx, eid)

    def sendMsg(self, avt_mb, mid):
        """ 发消息 """
        # DEBUG_MSG("Room.Player[%s] sendMsg: %s" % (self.roomID, mid))
        idx = None
        for i, p in enumerate(self.players_list):
            if p and avt_mb == p.mb:
                idx = i
                break
        else:
            if self.agent and self.agent.userId == avt_mb.userId:
                idx = -1

        if idx is None:
            return

        if self.agent and idx != -1 and self.agent.mb:
            self.agent.mb.recvMsg(idx, mid)

        for i, p in enumerate(self.players_list):
            if p and i != idx:
                p.mb.recvMsg(idx, mid)

    def sendVoice(self, avt_mb, url):
        # DEBUG_MSG("Room.Player[%s] sendVoice" % (self.roomID))
        idx = None
        for i, p in enumerate(self.players_list):
            if p and avt_mb.userId == p.userId:
                idx = i
                break
        else:
            if self.agent and self.agent.userId == avt_mb.userId:
                idx = -1

        if idx is None:
            return
        if self.agent and idx != -1 and self.agent.mb:
            self.agent.mb.recvVoice(idx, url)

        for i, p in enumerate(self.players_list):
            if p and p.mb:
                p.mb.recvVoice(idx, url)

    def sendAppVoice(self, avt_mb, url, time):
        # DEBUG_MSG("Room.Player[%s] sendVoice" % (self.roomID))
        idx = None
        for i, p in enumerate(self.players_list):
            if p and avt_mb.userId == p.userId:
                idx = i
                break
        else:
            if self.agent and self.agent.userId == avt_mb.userId:
                idx = -1

        if idx is None:
            return
        if self.agent and idx != -1 and self.agent.mb:
            self.agent.mb.recvAppVoice(idx, url, time)

        for i, p in enumerate(self.players_list):
            if p and p.mb:
                p.mb.recvAppVoice(idx, url, time)

    def broadcastOperation(self, idx, aid, is_auto, cards=None):
        """
		将操作广播给所有人, 包括当前操作的玩家
		:param idx: 当前操作玩家的座位号
		:param aid: 操作id
		:param tile_list: 出牌的list
		"""
        for i, p in enumerate(self.players_list):
            if p is not None:
                p.mb.postOperation(idx, aid, cards, is_auto)

    def broadcastOperation2(self, idx, aid, is_auto, tile_list=None):
        """ 将操作广播除了自己之外的其他人 """
        for i, p in enumerate(self.players_list):
            if p and i != idx:
                p.mb.postOperation(idx, aid, tile_list, is_auto)

    def broadcastMultiOperation(self, idx_list, aid_list, tile_list=None):
        for i, p in enumerate(self.players_list):
            if p is not None:
                p.mb.postMultiOperation(idx_list, aid_list, tile_list)

    def broadcastRoundEnd(self, info):
        # 广播胡牌或者流局导致的每轮结束信息, 包括算的扎码和当前轮的统计数据

        # 先记录玩家当局战绩, 会累计总得分
        self.record_round_result()

        self.state = 0
        info['player_info_list'] = [p.get_round_client_dict() for p in self.players_list if p is not None]

        DEBUG_MSG("&" * 30)
        DEBUG_MSG("RoundEnd info = {}".format(info))
        self.confirm_next_idx = []
        for p in self.players_list:
            if p:
                p.mb.roundResult(info)

        self.end_record_game(info)
        if self.is_competition == 1:
            self.auto_continue_timer = self.add_timer(const.AUTO_DISCARD_TIME, self.autoStartGame)

    def autoStartGame(self):
        for i, p in enumerate(self.players_list):
            if p and p.mb and p.mb.isBot == 0 and i not in self.confirm_next_idx:
                p.mb.autoReady()

    def get_init_client_dict(self):
        agent_d = {
            'nickname': "",
            'userId': 0,
            'head_icon': "",
            'ip': '0.0.0.0',
            'sex': 1,
            'idx': -1,
            'uuid': 0,
            'online': 1,
            'location': "",
            'lat': "",
            'lng': ""
        }
        if self.is_agent and self.agent:
            d = self.agent.get_init_client_dict()
            agent_d.update(d)

        group_name = ""
        if self.group_id > 0:
            group_name = KBEngine.globalData["GameWorld"].groupDict.get(self.group_id).group_name

        return {
            'roomID': self.roomID,
            'ownerId': self.owner_uid,
            'isAgent': self.is_agent,
            'agentInfo': agent_d,
            'curRound': self.current_round,
            'maxRound': self.game_round,
            'gameMode': self.game_mode,
            'playerNum': self.player_num,
            'gameStart': self.game_start,
            'gameHei3': self.game_hei3,
            'gameFunc': self.game_function,
            'gameDeal': self.game_deal,
            'gameForce': self.game_force,
            'gameCardNum': self.game_cardnum,
            'gamePlays': self.game_plays,
            'gameEnd': self.game_end,
            'anticheating': self.anticheating,
            'cardNum': self.player_cards_num,
            'player_base_info_list': [p.get_init_client_dict() for p in self.players_list if p is not None],
            'player_state_list': [1 if i in self.confirm_next_idx else 0 for i in range(self.player_num)],
            'is_competition': self.is_competition,
            'sportId': self.sportId,
            'groupId': self.group_id,
            'groupName': group_name
        }

    def get_reconnect_room_dict(self, userId):
        dismiss_left_time = const.DISMISS_ROOM_WAIT_TIME - int(time.time() - self.dismiss_room_ts) + 1
        if self.dismiss_room_ts == 0 or dismiss_left_time >= const.DISMISS_ROOM_WAIT_TIME:
            dismiss_left_time = 0

        idx = 0
        for p in self.players_list:
            if p and p.userId == userId:
                idx = p.idx

        return {
            'init_info': self.get_init_client_dict(),
            'controllerIdx': self.controller_idx,
            'controller_discard_list': self.controller_discard_list,
            'deskPokerList': self.deskPokerList,
            'isPlayingGame': self.state,
            'player_state_list': [1 if i in self.confirm_next_idx else 0 for i in range(self.player_num)],
            'waitIdx': self.wait_idx,
            'dealer_idx': self.dealer_idx,
            'discardList': self.players_discard_list,
            'player_op': self.player_op,
            'key_card': self.key_card,
            'applyCloseFrom': self.dismiss_room_from,
            'applyCloseLeftTime': dismiss_left_time,
            'applyCloseStateList': self.dismiss_room_state_list,
            'player_advance_info_list': [p.get_reconnect_client_dict(userId) for p in self.players_list if
                                         p is not None],

        }

    def broadcastEnterRoom(self, idx):
        new_p = self.players_list[idx]

        if self.is_agent == 1:
            if self.agent and self.agent.mb:
                self.agent.mb.othersEnterRoom(new_p.get_init_client_dict())

        for i, p in enumerate(self.players_list):
            if p is None:
                continue
            if i == idx:
                p.mb.enterRoomSucceed(self, idx)
            else:
                p.mb.othersEnterRoom(new_p.get_init_client_dict())

    def roundEndCallback(self, avt_mb):
        """ 一局完了之后玩家同意继续游戏 """
        # ERROR_MSG("roundEndCallback:{}".format(self.confirm_next_idx))
        if self.state == 1:
            return
        idx = -1
        for i, p in enumerate(self.players_list):
            if p and p.userId == avt_mb.userId:
                idx = i
                break
        if idx in self.confirm_next_idx:
            self.confirm_next_idx.remove(idx)
            for p in self.players_list:
                if p and p.idx != idx:
                    p.mb.cancelReady(idx)
            return
        if idx not in self.confirm_next_idx:
            self.confirm_next_idx.append(idx)
            for p in self.players_list:
                if p and p.idx != idx:
                    p.mb.readyForNextRound(idx)

        if len(self.confirm_next_idx) == self.player_num and self.isFull:
            if self.current_round == 0 and self.is_agent == 1 and self.agent:
                try:
                    self.agent.mb.quitRoomSucceed()
                    leave_tips = "您代开的房间已经开始游戏, 您已被请离.\n房间号【{}】".format(self.roomID)
                    self.agent.mb.showTip(leave_tips)
                except:
                    pass
            self.startGame()

    def showGPS(self):
        for p in self.players_list:
            if p and p.mb:
                p.mb.showGPS()

    def check_same_ip(self):
        ip_list = []
        for p in self.players_list:
            if p and p.mb and p.ip != '0.0.0.0':
                ip_list.append(p.ip)
            else:
                ip_list.append(None)

        tips = []
        checked = []
        for i in range(self.player_num):
            if ip_list[i] is None or i in checked:
                continue
            checked.append(i)
            repeat = [i]
            for j in range(i + 1, self.player_num):
                if ip_list[j] is None or j in checked:
                    continue
                if ip_list[i] == ip_list[j]:
                    repeat.append(j)
            if len(repeat) > 1:
                name = []
                for k in repeat:
                    checked.append(k)
                    name.append(self.players_list[k].nickname)
                tip = '和'.join(name) + '有相同的ip地址'
                tips.append(tip)
        if tips:
            tips = '\n'.join(tips)
            # DEBUG_MSG(tips)
            for p in self.players_list:
                if p and p.mb:
                    p.mb.showTip(tips)

    def dismiss(self):
        self.save_game_result()
        self.give_up_record_game()
        self.dropRoom()

    def apply_dismiss_room(self, avt_mb):
        """ 游戏开始后玩家申请解散房间 """
        self.dismiss_room_ts = time.time()
        src = None
        for i, p in enumerate(self.players_list):
            if p.userId == avt_mb.userId:
                src = p
                break

        # 申请解散房间的人默认同意
        self.dismiss_room_from = src.idx
        self.dismiss_room_state_list[src.idx] = 1

        self.dismiss_timer = self.add_timer(const.DISMISS_ROOM_WAIT_TIME, self.dismiss)

        for p in self.players_list:
            if p and p.mb and p.userId != avt_mb.userId:
                p.mb.req_dismiss_room(src.idx)

        yes = self.dismiss_room_state_list.count(1)
        if yes == len(self.players_list):
            self.cancel_timer(self.dismiss_timer)
            self.dismiss_timer = None

            # 玩家牌局记录存盘
            self.save_game_result()
            self.give_up_record_game()
            self.dropRoom()

    def vote_dismiss_room(self, avt_mb, vote):
        """ 某位玩家对申请解散房间的投票 """
        DEBUG_MSG("vote_dismiss_room :{0}".format(vote))
        src = None
        for p in self.players_list:
            if p and p.userId == avt_mb.userId:
                src = p
                break

        self.dismiss_room_state_list[src.idx] = vote
        DEBUG_MSG("vote_dismiss_room1 :{0}".format(self.dismiss_room_state_list))
        for p in self.players_list:
            if p and p.mb:
                p.mb.vote_dismiss_result(src.idx, vote)

        yes = self.dismiss_room_state_list.count(1)
        no = self.dismiss_room_state_list.count(2)
        DEBUG_MSG("vote_dismiss_room2 :{0},{1}".format(yes, no))
        if yes == len(self.players_list):
            self.cancel_timer(self.dismiss_timer)
            self.dismiss_timer = None

            # 玩家牌局记录存盘
            self.save_game_result()
            self.give_up_record_game()
            self.dropRoom()

        if no >= 1:
            self.cancel_timer(self.dismiss_timer)
            self.dismiss_timer = None
            self.dismiss_room_from = -1
            self.dismiss_room_ts = 0
            self.dismiss_room_state_list = [0, 0, 0, 0]

    def notify_player_online_status(self, userId, status):
        src = -1
        for idx, p in enumerate(self.players_list):
            if p and p.userId == userId:
                p.online = status
                src = idx
                break

        if src == -1:
            return

        for idx, p in enumerate(self.players_list):
            if p and p.mb and p.userId != userId:
                p.mb.notifyPlayerOnlineStatus(src, status)

    # 公会相关操作
    def groupReqRoomInfo(self, room_info=0):
        DEBUG_MSG("groupReqRoomInfo current_round :{0}".format(self.current_round))
        if self.current_round <= 0 and room_info == 0:
            return None
        player_list = []
        score_list = []
        for i, p in enumerate(self.players_list):
            if p is not None:
                player_list.append(p.get_init_client_dict())
                score_list.append(p.get_round_client_dict())
        return {
            "roomID": self.roomID,
            "group_id": self.group_id,
            "match_mode": self.match_mode,
            "player_list": player_list,
            "create_time": self.create_time,
            "room_state": self.state,
            "player_num": self.player_num,
            "score_list": score_list,
            "end_time": self.end_time
        }

    def groupOwnerQuitRoom(self, req_avatar, group_id):
        DEBUG_MSG("groupOwnerQuitRoom")
        if self.state == 1:
            req_avatar.doOperationFailed(const.ROOM_GROUP_IS_PLAYING)
            return
        if group_id != self.group_id:
            req_avatar.doOperationFailed(const.ROOM_GROUP_PMSN_LIMIT)
            return
        DEBUG_MSG("dropRoom")
        self.dropRoom()
        if req_avatar.client is not None:
            req_avatar.client.pushDismissGroupRoom(self.group_id, self.roomID)

    # def groupRankInfo(self):

    # 回看相关函数
    def record_round_result(self):
        # 玩家记录当局战绩
        d = datetime.fromtimestamp(time.time())
        DEBUG_MSG("record_round_result", d)
        d_month = d.month
        d_day = d.day
        d_hour = d.hour
        d_minute = d.minute
        if d_month < 10:
            d_month = "0" + str(d_month)
        if d_day < 10:
            d_day = "0" + str(d_day)
        if d_hour < 10:
            d_hour = "0" + str(d_hour)
        if d_minute < 10:
            d_minute = "0" + str(d_minute)
        round_result_d = {
            'date': '-'.join([str(d.year), str(d_month), str(d_day)]),
            'time': ':'.join([str(d_hour), str(d_minute)]),
            'round_record': [p.get_round_result_info() for p in self.origin_players_list if p],
            'recordId': self.record_id
        }
        self.game_result['round_result'].append(round_result_d)

        # # 第一局结束时push整个房间所有局的结构, 以后就增量push
        # if self.current_round == 1:
        #     game_result_l = [[round_result_d]]
        #     for p in self.players_list:
        #         if p:
        #             p.record_all_result(game_result_l)
        # else:
        #     for p in self.players_list:
        #         if p:
        #             p.record_round_game_result(round_result_d)

    def save_game_result(self):
        if len(self.game_result['round_result']) > 0:
            result_str = json.dumps(self.game_result)
            for p in self.players_list:
                p and p.save_game_result(result_str)

    def begin_record_room(self):
        # 在第一局的时候记录基本信息
        if self.current_round != 1:
            return
        self.game_result = {
            'maxRound': self.game_round,
            'roomID': self.roomID,
            'user_info_list': [p.get_basic_user_info() for p in self.origin_players_list if p]
        }
        self.game_result['round_result'] = []

    def begin_record_game(self):
        DEBUG_MSG("game begin", self.roomID)
        self.begin_record_room()
        KBEngine.globalData['GameWorld'].begin_record_room(self, self.roomID, self)

    def begin_record_callback(self, record_id):
        self.record_id = record_id

    def end_record_game(self, result_info):
        DEBUG_MSG("game end", self.roomID)
        KBEngine.globalData['GameWorld'].end_record_room(self.roomID, self, result_info)
        self.record_id = -1

    def give_up_record_game(self):
        DEBUG_MSG("give up record", self.roomID)
        KBEngine.globalData['GameWorld'].give_up_record_room(self.roomID)
