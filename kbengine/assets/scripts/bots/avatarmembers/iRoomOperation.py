# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *


class iRoomOperation(object):
    def createRoomSucceed(self, room_info):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def createRoomFailed(self, err_code):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def enterRoomSucceed(self, idx, info):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        self.base.roundEndCallback()
        return

    def enterRoomFailed(self, err_code):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def othersEnterRoom(self, playerInfo):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def othersQuitRoom(self, idx):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def quitRoomFailed(self, err_code):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def quitRoomSucceed(self):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def startGame(self, dealer_idx, discard_idx, key_card, cards):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def postOperation(self, idx, aid, tile_list, is_auto):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def postMultiOperation(self, idx_list, aid_list, tile_list):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def notifyChangeController(self, controllerIdx):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def doOperationFailed(self, errCode):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def waitForOperation(self, wait_idx, aid, tile_list):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))

        return

    def roundResult(self, round_info):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        self.base.roundEndCallback()
        return

    def finalResult(self, player_info_list, info, week_info):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def subTotalResult(self, player_info_list, room_info, week_info):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def readyForNextRound(self, idx):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def cancelReady(self, idx):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def recvMagicEmotion(self, idxFrom, idxTo, eid):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def recvEmotion(self, idx, eid):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def recvMsg(self, idx, mid):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def recvVoice(self, idx, url):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def recvAppVoice(self, idx, url, time):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def handleReconnect(self, rec_room_info):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushRoundRecord(self, round_r_dict):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushGameRecordList(self, game_record_list):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def reqDismissRoom(self, idx):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def voteDismissResult(self, idx, vote):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def notifyPlayerOnlineStatus(self, idx, status):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def passDiscards(self, idx):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return


    def autoReady(self):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return
