# -*- coding: utf-8 -*-
import KBEngine
import KBExtra
import random
from KBEDebug import *
from socket import *
import os

# import table_name
import switch

from interfaces.GameObject import GameObject
from avatarmembers.iBase import iBase
from avatarmembers.iGroup import iGroup
from avatarmembers.iRoomOperation import iRoomOperation
from avatarmembers.iRecordOperation import iRecordOperation
from avatarmembers.iSportOperation import iSportOperation
from avatarmembers.iAchievement import iAchievement
from avatarmembers.iRanking import iRanking
from avatarmembers.iRanking import iRanking

import table_name


class Avatar(KBEngine.Entity,
             GameObject,
             iBase,
             iGroup,
             iRoomOperation,
             iRecordOperation,
             iAchievement,
             iRanking,
             iSportOperation):
    def __init__(self):
        KBEngine.Entity.__init__(self)
        GameObject.__init__(self)
        iBase.__init__(self)
        iRoomOperation.__init__(self)
        iRecordOperation.__init__(self)
        iAchievement.__init__(self)
        iGroup.__init__(self)
        iRanking.__init__(self)
        iSportOperation.__init__(self)

        self.accountEntity = None
        self._destroyTimer = 0
        self.is_reconnect = False
        self.ip = '0.0.0.0'
        self.location = ""
        self.lat = ""
        self.lng = ""
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def onEnterWorld(self):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def onLeaveWorld(self):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def onEnterSpace(self):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def onLeaveSpace(self):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def onBecomePlayer(self):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def addBotSuccess(self, cid):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def closeClient(self):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def beginGame(self, state):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        lastname = table_name.lastnameTbl[random.randint(0, table_name.lastnameNum - 1)]
        firstname = table_name.firstnameTbl[random.randint(0, table_name.firstnameNum - 1)]
        name = lastname + firstname
        iconUrl = "http://mypdk.game918918.com/portraits/" + str(random.randint(1, 50)) + ".png"
        sex = random.randint(0, 1)
        info = {
            "nickname": name,
            "head_icon": iconUrl,
            "sex": sex,
        }
        self.base.updateUserInfo(info)
        return

    def pushRoomCard(self, roomCardNum):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def operationFail(self, cid, val):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def operationSuccess(self, cid, val):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushPlayerInfoList(self, avatarInfoList, num):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def showTip(self, content):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def showGPS(self):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def recvWorldNotice(self, content, times):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushGameLeft(self, value):
        return

    @property
    def gameLeft(self):
        return self.left_games

    @gameLeft.setter
    def gameLeft(self, value):
        self.left_games = value


class PlayerAvatar(Avatar):
    def __init__(self):
        Avatar.__init__(self)
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def onEnterSpace(self):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def onBecomePlayer(self):
        # const.player = KBEngine.bots[self.clientapp.id].entities[self.id]
        # const.player_id = self.id
        # const.bot_id = self.clientapp.id
        # const.bot = KBEngine.bots[self.clientapp.id]
        # const.entities = KBEngine.bots[self.clientapp.id].entities
        # DEBUG_MSG("%s[%i] %s, playerid=%i, botId=%i" % (
        #     self.__class__.__name__, self.id, sys._getframe().f_code.co_name, const.player_id, const.bot_id))
        DEBUG_MSG("%s[%i] %s, playerId = %i, botId = %i" % (
            self.__class__.__name__, self.id, sys._getframe().f_code.co_name, self.id, self.clientapp.id))
        return

    def addBotSuccess(self, cid):
        DEBUG_MSG("addBotSuccess botId = %i" % (self.clientapp.id))
        # self.cell.randomFashionByBot()
        #
        # city_table = ["上海市", "西安市", "杭州市", "北京市", "广州市"]
        # cityStr = city_table[cid % len(city_table)]
        # self.cell.registLocationInfo(-10.0, -20.0, cityStr)
        #
        # mNum = math.floor(const.PHOTO_BOT_NUM / 2)
        # fNum = math.floor(const.PHOTO_BOT_NUM / 2)
        #
        # # 姓名
        # name = ""
        # # 性别
        # gender = 0
        # # 头像
        # defaultindex = 0
        #
        # if cid > mNum + fNum:
        #     lastname = table_name.lastnameTbl[random.randint(0, table_name.lastnameNum-1)]
        #     firstname = table_name.firstnameTbl[random.randint(0, table_name.firstnameNum-1)]
        #     name = lastname + firstname
        #     gender = random.randint(0, 1)
        #     defaultindex = random.randint(1,15)
        # else:
        #     name = table_name.nameTbl[cid]
        #     gender = 1
        #     portName = "q" + str(cid % fNum) + ".jpg"
        #     if cid > fNum:
        #         gender = 0
        #         portName = "w" + str(cid % mNum) + ".jpg"
        #
        #     cur_time = int(time.time())
        #     realName = "_B5_" + str(self.uuid) + str(cur_time) + ".jpg"
        #
        #     upload_http_ip = "http://" + http_ip
        #     pathName = 'img/' + portName
        #
        #     if os.path.exists(pathName):
        #         boundary = '----------%s' % hex(int(time.time() * 1000))
        #         data = []
        #         data.append('\r\n--%s\r\n' % boundary)
        #
        #         fr = open(pathName,'rb')
        #         data.append('Content-Disposition: form-data; name="%s"; filename="%s"\r\n' % ('file', realName))
        #         data.append('Content-Type: %s\r\n\r\n' % 'image/jpeg')
        #         bstr = fr.read()
        #         data.append(bstr)
        #         fr.close()
        #         data.append('\r\n\r\n--%s\r\n' % boundary)
        #
        #         data.append('Content-Disposition: form-data; name="%s"\r\n\r\n' % 'submit')
        #         data.append('submit')
        #         data.append('\r\n--%s--\r\n\r\n' % boundary)
        #
        #
        #         http_url = upload_http_ip + "/upload_file.php"
        #
        #         http_body = "".encode(encoding="utf-8")
        #         for i in range(len(data)):
        #             if isinstance(data[i], bytes):
        #                 http_body += data[i]
        #             else:
        #                 http_body += data[i].encode(encoding="utf-8")
        #
        #         try:
        #             #buld http request
        #             req=urllib.request.Request(http_url, data=http_body)
        #             #header
        #             req.add_header('Content-Type', 'multipart/form-data; boundary=%s' % boundary)
        #             req.add_header('User-Agent', 'Mozilla/5.0')
        #             req.add_header('Referer', upload_http_ip)
        #             resp = urllib.request.urlopen(req, timeout=5)
        #             qrcont = resp.read()
        #             defaultindex = cur_time
        #
        #         except Exception as e:
        #             ERROR_MSG("upload error: %s" % (str(e)))
        #
        # self.base.setGenderByClient(gender)
        # self.base.setNameByClient("_" + name)
        # self.base.setDefaultPortraitIndexByClient(defaultindex)
        return

    def closeClient(self):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        # ui
        return
