# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
import const
import utility
import json
import switch
import time
import x42


class iRoomOperation(object):
    """ 玩家游戏相关 """

    def __init__(self):
        self.room = None
        self.req_entering_room = False

    @property
    def inRoom(self):
        if self.room is None:
            return False
        return self.room.isDestroyed == False

    def reqCreateRoom(self, room_op):
        belong_info = {
            'match_mode': const.ROOM_PRIVATE,
            'group_id': 0,
            'team_uuid': 0,
            'sportId': 0
        }
        self.reqCreateDetailRoom(room_op, belong_info)

    def reqCreateSportRoom(self, room_op, sportId):
        belong_info = {
            'match_mode': const.ROOM_PRIVATE,
            'group_id': 0,
            'team_uuid': 0,
            'sportId': sportId
        }
        self.reqCreateDetailRoom(room_op, belong_info)

    def reqCreateDetailRoom(self, room_op, belong_info):
        DEBUG_MSG("reqCreateGroupRoom", room_op)
        if self.req_entering_room:
            return
        if self.inRoom:
            self.createRoomFailed(const.CREATE_FAILED_ALREADY_IN_ROOM)
            return

        # 检查客户端传过来的房间参数
        game_mode = room_op["game_mode"]
        game_round = room_op["game_round"]
        player_num = room_op["player_num"]
        game_function = room_op["game_function"]
        game_start = room_op["game_start"]
        game_hei3 = room_op["game_hei3"]
        game_deal = room_op["game_deal"]
        game_force = room_op["game_force"]
        game_cardnum = room_op["game_cardnum"]
        game_plays = room_op["game_plays"]
        game_end = room_op["game_end"]
        anticheating = room_op["anticheating"]
        is_competition = room_op["is_competition"]
        is_agent = room_op["is_agent"]
        if game_mode not in const.GAME_MODE \
                or game_round not in const.GAME_ROUND \
                or player_num not in const.PLAYER_NUMBER \
                or game_function not in const.GAME_FUNCTION \
                or game_start not in const.GAME_START \
                or game_hei3 not in const.GAME_HEI3 \
                or game_deal not in const.GAME_DEAL \
                or game_force not in const.GAME_FORCE \
                or game_cardnum not in const.GAME_CARD_NUM \
                or len(game_plays) != const.GAME_PLAYS_LENGTH \
                or not utility.checkValuesIn(game_plays, const.GAME_PLAYS_VALUE) \
                or len(game_end) != const.GAME_END_LENGTH \
                or not utility.checkValuesIn(game_end, const.GAME_END_VALUE) \
                or anticheating not in const.ANTI_CHEATING \
                or is_competition not in const.ANTI_CHEATING \
                or is_agent not in const.ROOM_TYPE:
            return

        self.req_entering_room = True

        def callback(content):
            try:
                DEBUG_MSG("cards response: {}".format(content))
                if content[0] != '{':
                    self.createRoomFailed(const.CREATE_FAILED_OTHER)
                    return
                data = json.loads(content)
                card_cost, diamond_cost = switch.calc_cost(room_op["game_round"])
                can_do = False
                if x42.GW.free_play:
                    can_do = True
                if card_cost and card_cost <= data['card']:
                    can_do = True
                if diamond_cost and diamond_cost <= data['diamond']:
                    can_do = True

                if not can_do:
                    self.createRoomFailed(const.CREATE_FAILED_NO_ENOUGH_CARDS)
                    return

                detail_op = {}
                detail_op["game_mode"] = game_mode
                # FIXME 测试用, 正式时候记得改回来
                # detail_op["game_round"] = game_round
                detail_op["game_round"] = 2
                detail_op["player_num"] = player_num
                detail_op["game_function"] = game_function
                detail_op["game_start"] = game_start
                detail_op["game_hei3"] = game_hei3
                detail_op["game_deal"] = game_deal
                detail_op["game_force"] = game_force
                detail_op["game_cardnum"] = game_cardnum
                detail_op["game_plays"] = game_plays
                detail_op["game_end"] = game_end
                detail_op["anticheating"] = anticheating
                detail_op["is_competition"] = is_competition
                detail_op["is_agent"] = is_agent

                detail_op.setdefault("match_mode", belong_info["match_mode"])
                detail_op.setdefault("group_id", belong_info["group_id"])
                detail_op.setdefault("team_uuid", belong_info["team_uuid"])
                detail_op.setdefault("sportId", belong_info["sportId"])
                detail_op.setdefault("owner_uid", self.userId)
                detail_op.setdefault("create_time", time.time())

                DEBUG_MSG("reqCreate----GroupRoom", detail_op)
                KBEngine.createBaseAnywhere("GameRoom", detail_op, self.createRoomCallback)
            except:
                self.createRoomFailed(const.CREATE_FAILED_OTHER)
        if switch.DEBUG_BASE:
            callback('{"card":99, "diamond":999}')
        elif is_competition != 0:
            callback('{"card":99, "diamond":999}')
        else:
            accountName = self.accountName
            if belong_info["group_id"] > 0:
                group = KBEngine.globalData["GameWorld"].groupDict.get(belong_info["group_id"])
                if group:
                    accountName = KBEngine.globalData["GameWorld"].cacheDict.get(group.owner_info["userId"],
                                                                                 {}).get("accountName", "")
            utility.get_user_info(accountName, callback)

    def createRoomCallback(self, room, err=None):
        if room:
            if room.is_agent == 1:
                def callback(content):
                    if content[0] != '{':
                        DEBUG_MSG(content)
                        return
                    self.createRoomSucceed(room)

                card_cost, diamond_cost = switch.calc_cost(room.game_round)
                if switch.DEBUG_BASE:
                    callback('{"card":99, "diamond":999}')
                else:
                    utility.update_card_diamond(self.accountName, -card_cost, -diamond_cost, callback,
                                                "PaoDeKuai RoomID:{}".format(self.roomID))  # reason 必须为英文
            else:
                self.createRoomSucceed(room)
        else:
            self.createRoomFailed(const.CREATE_FAILED_OTHER)

    def createRoomSucceed(self, room):
        room.reqEnterRoom(self, True)
        self.room = room
        x42.GW.addRoom(room)
        self.req_entering_room = False
        info = room.get_init_client_dict()
        if getattr(self, 'client', None):
            self.client.createRoomSucceed(info)

    def createRoomFailed(self, err):
        self.req_entering_room = False
        if getattr(self, 'client', None):
            self.client.createRoomFailed(err)

    # c2s
    def enterRoom(self, roomID):
        if self.req_entering_room:
            DEBUG_MSG("iRoomOperation: enterRoom failed, entering or creating room")
            return
        if self.inRoom:
            self.enterRoomFailed(const.ENTER_FAILED_ALREADY_IN_ROOM)
            return
        self.req_entering_room = True
        KBEngine.globalData["GameWorld"].enterRoom(roomID, self)

    def enterRoomSucceed(self, room, idx):
        self.room = room
        self.req_entering_room = False
        info = room.get_init_client_dict()
        DEBUG_MSG(info)
        # DEBUG_MSG('@' * 30)
        if getattr(self, 'client', None):
            self.client.enterRoomSucceed(idx, info)

    def enterRoomFailed(self, err):
        self.req_entering_room = False
        if getattr(self, 'client', None):
            self.client.enterRoomFailed(err)

    def othersEnterRoom(self, player_info):
        if getattr(self, 'client', None):
            self.client.othersEnterRoom(player_info)

    def othersQuitRoom(self, idx):
        if getattr(self, 'client', None):
            self.client.othersQuitRoom(idx)

    # c2s
    def quitRoom(self):
        if self.room and self.room.current_round == 0:
            KBEngine.globalData["GameWorld"].quitRoom(self.room.roomID, self)
        else:
            self.quitRoomFailed(const.QUIT_FAILED_ROOM_ALREADY_START)

    def quitRoomSucceed(self):
        DEBUG_MSG('@' * 30)
        DEBUG_MSG('avatar quit room succeed!')
        if self.room.sportId > 0:
            self.sportId = 0
        self.room = None
        if getattr(self, 'client', None):
            self.client.quitRoomSucceed()
        if self.isBot:
            KBEngine.globalData["GameWorld"].queryBotsQuitRoom(self)

    def quitRoomFailed(self, err):
        # DEBUG_MSG('@' * 30)
        # DEBUG_MSG('avatar quit room failed!')
        if getattr(self, 'client', None):
            self.client.quitRoomFailed(err)

    def startGame(self, dealer_idx, discard_idx, key_card, cards):
        if getattr(self, 'client', None):
            self.client.startGame(dealer_idx, discard_idx, key_card, cards)

    def postOperation(self, idx, aid, tile_list, is_auto):
        if getattr(self, 'client', None):
            self.client.postOperation(idx, aid, tile_list, is_auto)

    def postMultiOperation(self, idx_list, aid_list, tile_list):
        if getattr(self, 'client', None):
            self.client.postMultiOperation(idx_list, aid_list, tile_list)

    def notifyChangeController(self, controllerIdx):
        if getattr(self, 'client', None):
            self.client.notifyChangeController(controllerIdx)

    # c2s
    def doOperation(self, aid, tile_list):
        if self.room:
            self.room.doOperation(self, aid, tile_list)

    def doOperationFailed(self, err):
        if getattr(self, 'client', None):
            self.client.doOperationFailed(err)

    def waitForOperation(self, wait_idx, aid, tile_list):
        if getattr(self, 'client', None):
            self.client.waitForOperation(wait_idx, aid, tile_list)

    # c2s
    def confirmOperation(self, aid, tile_list, is_auto):
        if self.room:
            self.room.confirmOperation(self, aid, tile_list, is_auto)

    # s2c
    def roundResult(self, round_info):
        if getattr(self, 'client', None):
            self.client.roundResult(round_info)

    # s2c
    def finalResult(self, player_info_list, round_info, weekly_score_list):
        self.room = None
        if getattr(self, 'client', None):
            self.client.finalResult(player_info_list, round_info, weekly_score_list)
        if self.isBot:
            KBEngine.globalData["GameWorld"].queryBotsQuitRoom(self)

    def subTotalResult(self, player_info_list, room_info, weekly_score_list):
        self.room = None
        if getattr(self, 'client', None):
            self.client.subTotalResult(player_info_list, room_info, weekly_score_list)
        if self.isBot:
            KBEngine.globalData["GameWorld"].queryBotsQuitRoom(self)

    # c2s
    def roundEndCallback(self):
        if self.room:
            self.room.roundEndCallback(self)

    def reqIsAfford(self, waitIdx):
        if self.room:
            self.room.reqIsAfford(waitIdx)

    def autoReady(self):
        if getattr(self, 'client', None):
            self.client.autoReady()
        if self.room:
            self.room.roundEndCallback(self)

    # c2s
    def upLocationInfo(self, location, lat, lng):
        DEBUG_MSG("upLocationInfo, {0}, {1}, {2}".format(location, lat, lng))
        self.location = location
        self.lat = lat
        self.lng = lng

    def readyForNextRound(self, idx):
        if getattr(self, 'client', None):
            self.client.readyForNextRound(idx)

    def cancelReady(self, idx):
        if getattr(self, 'client', None):
            self.client.cancelReady(idx)

    def recordRoundResult(self, round_r_dict):
        # 记录玩家房间中每局的记录
        if self.game_history:
            # DEBUG_MSG("recordRoundResult: {}".format(round_r_dict))
            game_record_list = self.game_history[-1]
            game_record_list.append(round_r_dict)
            if getattr(self, 'client', None):
                self.client.pushRoundRecord(round_r_dict)
        else:
            DEBUG_MSG("recordRoundResult failed. round_result = {}".format(round_r_dict))

    def recordGameResult(self, game_record_list):
        # 保存玩家房间牌局战绩, 只保留最近10条记录
        # DEBUG_MSG("game_record_list: {}".format(game_record_list))
        # DEBUG_MSG("game_history: {}".format(self.game_history))
        self.game_history.extend(game_record_list)
        # DEBUG_MSG("recordGameResult: {}".format(self.game_history[-1]))
        length = len(self.game_history)
        if length > const.MAX_HISTORY_RESULT:
            for i in range(length - const.MAX_HISTORY_RESULT):
                self.game_history.pop(0)

        if getattr(self, 'client', None):
            self.client.pushGameRecordList(game_record_list)

    def saveGameResult(self, json_r):
        # 保存玩家房间牌局战绩, 只保留最近10条记录
        # DEBUG_MSG("saveGameResult: {}".format(json_r))
        # DEBUG_MSG("before saveGameResult length = {}, history = {}".format(len(self.game_history), self.game_history))

        self.game_history.append(json.loads(json_r))
        # DEBUG_MSG("after  saveGameResult length = {}, history = {}".format(len(self.game_history), self.game_history))

        length = len(self.game_history)
        if length > const.MAX_HISTORY_RESULT:
            new_h = []
            for s in self.game_history:
                new_h.append(s)
            self.game_history = new_h[-const.MAX_HISTORY_RESULT:]
            # DEBUG_MSG("length length = {}, history = {}".format(len(self.game_history), self.game_history))

        self.writeToDB()
        if getattr(self, 'client', None):
            self.client.pushGameRecordList([json.loads(json_r)])

    # c2s
    def sendMagicEmotion(self, eid, idxFrom, idxTo):
        if self.room:
            self.room.sendMagicEmotion(self, eid, idxFrom, idxTo)

    # c2s
    def sendEmotion(self, eid):
        if self.room:
            self.room.sendEmotion(self, eid)

    # c2s
    def sendMsg(self, mid):
        if self.room:
            self.room.sendMsg(self, mid)

    # c2s
    def sendVoice(self, url):
        if self.room:
            self.room.sendVoice(self, url)

    # c2s
    def sendAppVoice(self, url, time):
        if self.room:
            self.room.sendAppVoice(self, url, time)

    def recvMagicEmotion(self, idxFrom, idxTo, eid):
        if getattr(self, 'client', None):
            DEBUG_MSG("recvMagicEmotion:(%i): client reconnect!" % (idxFrom))
            self.client.recvMagicEmotion(idxFrom, idxTo, eid)

    def recvEmotion(self, idx, eid):
        if getattr(self, 'client', None):
            self.client.recvEmotion(idx, eid)

    def recvMsg(self, idx, mid):
        if getattr(self, 'client', None):
            self.client.recvMsg(idx, mid)

    def recvVoice(self, idx, url):
        if getattr(self, 'client', None):
            self.client.recvVoice(idx, url)

    def recvAppVoice(self, idx, url, time):
        if getattr(self, 'client', None):
            self.client.recvAppVoice(idx, url, time)

    def process_reconnection(self):
        DEBUG_MSG("iRoomOperation:(%i): client reconnect!" % (self.id))
        if self.room:
            self.room.reqReconnect(self)

    def handle_reconnect(self, rec_room_info):
        if getattr(self, 'client', None):
            self.client.handleReconnect(rec_room_info)

    # c2s
    def applyDismissRoom(self):
        """ 申请解散房间 """
        if self.room:
            self.room.apply_dismiss_room(self)

    def req_dismiss_room(self, idx):
        """ 广播有人申请解散房间 """
        if getattr(self, 'client', None):
            # DEBUG_MSG("call client reqDismissRoom {0}".format(idx))
            self.client.reqDismissRoom(idx)

    # c2s
    def voteDismissRoom(self, vote):
        """ 解散房间投票操作 """
        DEBUG_MSG("voteDismissRoom :{0}".format(vote))
        if self.room:
            self.room.vote_dismiss_room(self, vote)

    def vote_dismiss_result(self, idx, vote):
        """ 广播投票结果 """
        if getattr(self, 'client', None):
            # DEBUG_MSG("call client voteDismissResult {0}->{1}".format(idx, vote))
            self.client.voteDismissResult(idx, vote)

    # s2c
    def notifyPlayerOnlineStatus(self, idx, status):
        """ 玩家上线, 下线通知 """
        DEBUG_MSG("call client notifyPlayerOnlineStatus {0}->{1}".format(idx, status))
        if getattr(self, 'client', None):
            self.client.notifyPlayerOnlineStatus(idx, status)

    def passDiscards(self, idx):
        if getattr(self, 'client', None):
            self.client.passDiscards(idx)

    def setIntegral(self, userid, score):
        DEBUG_MSG("setIntegral: {0}{1}".format(userid, score))
        if userid == self.userId:
            self.integral += score
            DEBUG_MSG("Avatar client call setIntegral:{}".format(self.integral))
            self.userRankingInfo(self.userId)

    def getTestData(self):
        DEBUG_MSG("getTestData: userId = {0}".format(str(self.userId)))
        if hasattr(switch, 'TESTER') and self.userId in switch.TESTER:
            if self.room and self.room.state == 1:
                card_list_list = []
                for p in self.room.players_list:
                    card_list_list.append(p.cards)
                if getattr(self, 'client', None):
                    self.client.getTestDataResult(card_list_list)