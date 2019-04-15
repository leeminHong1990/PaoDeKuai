# -*- coding: utf-8 -*-

import KBEngine
from KBEDebug import *
import weakref
import utility
import const
from entitymembers.iPlayerLine import iPlayerLine


class PlayerProxy(iPlayerLine):
    def __init__(self, avt_mb, owner, idx):
        # 玩家的mailbox
        self.mb = avt_mb
        # 所属的游戏房间
        self.owner = owner if isinstance(owner, weakref.ProxyType) else weakref.proxy(owner)
        # 玩家的座位号
        self.idx = idx
        # 玩家在线状态
        self.online = 1
        # 玩家的手牌
        self.cards = []
        # 玩家自己操作
        self.op = []
        # 玩家打过的牌
        self.discard_cards = []
        # 玩家当局的得分
        self.score = 0
        # 玩家总得分
        self.total_score = 0
        # 玩家的炸弹数
        self.bomb_times = 0
        # 玩家的总的炸弹数
        self.total_bomb_times = 0
        # 最佳得分
        self.best_score = 0
        # 赢的次数
        self.win_times = 0
        # 输的次数
        self.lose_times = 0
        # 剩余张数
        self.surplus_cards = 0
        # 同一局的分数
        self.samegamescore = 0

        iPlayerLine.__init__(self)

    # 用于UI显示的信息
    @property
    def head_icon(self):
        DEBUG_MSG("PlayerProxy get head_icon = {}".format(self.mb.head_icon))
        return self.mb.head_icon

    @property
    def nickname(self):
        return self.mb.name

    @property
    def sex(self):
        return self.mb.sex

    @property
    def userId(self):
        return self.mb.userId

    @property
    def uuid(self):
        return self.mb.uuid

    @property
    def ip(self):
        return self.mb.ip

    @property
    def location(self):
        return self.mb.location

    @property
    def lat(self):
        return self.mb.lat

    @property
    def lng(self):
        return self.mb.lng

    @property
    def weekSportScore(self):
        return self.mb.weekSportScore

    def tidy(self):
        self.cards = sorted(self.cards)
        DEBUG_MSG("Player{0} original cards: {1}".format(self.idx, self.cards))

    def reset(self):
        """ 每局开始前重置 """
        self.cards = []
        self.discard_cards = []
        self.op = []
        self.score = 0
        self.bomb_times = 0
        self.samegamescore = 0

    def addscore(self, score):
        DEBUG_MSG("addscore  {0}".format(score))
        self.score += score
        self.total_score += score
        self.samegamescore += score
        if self.samegamescore > self.best_score:
            self.best_score = self.samegamescore

    def addBombTimes(self, bombTimes):
        DEBUG_MSG("addBombTimes  {0}".format(bombTimes))
        self.bomb_times += bombTimes
        self.total_bomb_times += bombTimes

    def turnPass(self, is_auto):
        self.discard_cards.append([])
        self.op.append([const.OP_PASS, [], []])
        self.owner.op_record.append([self.idx, const.OP_PASS, [], []])
        self.owner.player_op[self.idx] = 1
        self.owner.broadcastOperation(self.idx, const.OP_PASS, is_auto, [])
        # self.owner.broadcastOperation2(self.idx, const.OP_PASS, is_auto, [])

    def discard(self, card_list, instead_card_list, is_auto):
        """ 打牌 """
        DEBUG_MSG("Player[%s] owncards:[%s],discard: %s,instead:%s" % (
            self.idx, str(self.cards), str(card_list), str(instead_card_list)))
        for card in card_list:
            self.cards.remove(card)
        self.tidy()
        self.discard_cards.append(instead_card_list)
        self.owner.op_record.append([self.idx, const.OP_DISCARD, card_list, instead_card_list])
        self.owner.player_op[self.idx] = 1
        self.op.append([const.OP_DISCARD, card_list, instead_card_list])
        self.owner.controller_idx = self.idx
        self.owner.controller_discard_list = instead_card_list
        self.owner.broadcastOperation(self.idx, const.OP_DISCARD, is_auto, instead_card_list)
        # if is_auto:
        #     self.owner.broadcastOperation(self.idx, const.OP_DISCARD, is_auto, instead_card_list)
        # else:
        #     self.owner.broadcastOperation2(self.idx, const.OP_DISCARD, is_auto, instead_card_list)

    def get_init_client_dict(self):
        return {
            'nickname': self.nickname,
            'head_icon': self.head_icon,
            'sex': self.sex,
            'idx': self.idx,
            'userId': self.userId,
            'uuid': self.uuid,
            'online': self.online,
            'ip': self.ip,
            'location': self.location,
            'lat': self.lat,
            'lng': self.lng,
        }

    def get_round_client_dict(self):
        return {
            'idx': self.idx,
            'score': self.score,
            'total_score': self.total_score,
            'bomb_times': self.bomb_times,
            'total_bomb_times': self.total_bomb_times,
            'surplus_cards': len(self.cards),
        }

    def get_final_client_dict(self):
        return {
            'idx': self.idx,
            'score': self.total_score,
            'bomb_times': self.total_bomb_times,
            'best_score': self.best_score,
            'win_times': self.win_times,
            'lose_times': self.lose_times,
        }

    def get_reconnect_client_dict(self, userId):
        # 掉线重连时需要知道所有玩家打过的牌以及自己的手牌
        return {
            'score': self.score,
            'total_score': self.total_score,
            'bomb_times': self.bomb_times,
            'total_bomb_times': self.total_bomb_times,
            'cards': self.cards if userId == self.userId else [0] * len(self.cards),
            'discard_cards': self.discard_cards,
        }

    def get_round_result_info(self):
        # 记录信息后累计得分
        return {
            'nickname': self.nickname,
            'score': self.score,
        }

    def get_basic_user_info(self):
        return {
            'userID': self.userId,
            'nickname': self.nickname
        }

    def save_game_result(self, json_result):
        self.mb.saveGameResult(json_result)

    def get_end_result_info(self):
        # 最终结果信息
        return {
            'accountName': self.mb.accountName,
            'userId': self.userId,
            'nickname': self.nickname,
            'score': self.total_score,
        }

    def get_week_sport_result_info(self):
        # 最终结果信息
        return {
            'accountName': self.mb.accountName,
            'userId': self.userId,
            'nickname': self.nickname,
            'score': sum(self.weekSportScore),
            'reward': 0
        }

    def get_weekly_sport_score_list(self):
        # 最终结果信息
        return {
            'accountName': self.mb.accountName,
            'userId': self.userId,
            'nickname': self.nickname,
            'score': self.weekSportScore
        }

    def record_all_result(self, game_record_list):
        self.mb.recordGameResult(game_record_list)

    def get_group_rank_info(self):
        # 公会排行榜信息
        return {
            'userId': self.userId,
            'nickname': self.nickname,
            'integral': self.total_score,
            'winner_times': 0,
        }
