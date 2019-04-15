# -*- coding: utf-8 -*-
import KBEngine
import Functor
import socket
from KBEDebug import *
import re
import json


class Poller:
    """
    演示：
    可以向kbengine注册一个socket，由引擎层的网络模块处理异步通知收发。
    用法:
    from Poller import Poller
    poller = Poller()

    开启(可在onBaseappReady执行)
    poller.start("localhost", 12345)

    停止
    poller.stop()
    """

    def __init__(self):
        self._socket = None
        self._clients = {}

    def start(self, addr, port):
        """
        virtual method.
        """
        self._socket = socket.socket()
        self._socket.bind((addr, port))
        self._socket.listen(10)

        KBEngine.registerReadFileDescriptor(self._socket.fileno(), self.onRecv)

    # KBEngine.registerWriteFileDescriptor(self._socket.fileno(), self.onWrite)

    def stop(self):
        if self._socket:
            KBEngine.deregisterReadFileDescriptor(self._socket.fileno())
            self._socket.close()
            self._socket = None

    def onWrite(self, fileno):
        pass

    def onRecv(self, fileno):
        if self._socket.fileno() == fileno:
            sock, addr = self._socket.accept()
            self._clients[sock.fileno()] = (sock, addr)
            KBEngine.registerReadFileDescriptor(sock.fileno(), self.onRecv)
            DEBUG_MSG("Poller::onRecv: new channel[%s/%i]" % (addr, sock.fileno()))
        else:
            sock, addr = self._clients.get(fileno, None)
            if sock is None:
                return

            data = sock.recv(2048)
            DEBUG_MSG("Poller::onRecv: %s/%i get data, size=%i" % (addr, sock.fileno(), len(data)))
            self.processData(sock, data)
            KBEngine.deregisterReadFileDescriptor(sock.fileno())
            sock.close()
            del self._clients[fileno]

    def processData(self, sock, datas):
        """
        处理接收数据
        """
        INFO_MSG("prcessData: %s" % datas)
        try:
            datasStr = datas.decode()
            data = json.loads(datasStr.split("\n")[-1])
            if "groupId" in data and "userId" in data:
                group = KBEngine.globalData["GameWorld"].groupDict.get(data["groupId"], None)
                if group:
                    group.reqShareJoinGroup(data["userId"])
            elif data.get("op", "") == "dropRoom_by_userId" and "userId" in data:
                KBEngine.globalData["GameWorld"].avatars[data["userId"]].room.kick()
        except:
            ERROR_MSG("Draw prcessData Excute Wrong!")
        else:
            INFO_MSG("Draw prcessData Excuted!")
