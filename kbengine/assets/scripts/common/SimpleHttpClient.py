# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
import random
import math
import time
import const
import switch
from socket import *
import base64

http_ip = const.HTTP_SERVER_IP
if KBEngine.publish() == 0:
    http_ip = const.HTTP_DEBUG_SERVER_IP
else:
    http_ip = gethostbyname(http_ip)
    INFO_MSG("HTTP_SERVER_IP: :%s." % (http_ip))

class SimpleHttpClient(object):
    def __init__(self):
        self.udpClient = socket(AF_INET, SOCK_DGRAM)

    def sendTcpHttpLog(self, operation, json_dict):
        value = str(json_dict)
        value = value.replace(' ', '%20')
        value = value.replace('#', '栋')
        #value = base64.encodestring(value)
        sendStr = "GET /log_get_reward.php?key=" + operation + "&value=" + value + " HTTP/1.1\r\nHost: " + http_ip + "\r\nConnection: Close\r\n\r\n"
        
        tcpClient = socket(AF_INET, SOCK_STREAM)
        tcpClient.connect((const.HTTP_SERVER_IP, 80))
        tcpClient.setblocking(0)
        tcpClient.send(sendStr.encode("utf-8"))
        tcpClient.close()
        DEBUG_MSG("SimpleHttpClient: ip:%s, op:%s, value:%s ." % (http_ip, operation, value))

    def sendUdpHttpLog(self, operation, json_dict):
        value = str(json_dict)
        value = value.replace(' ', '%20')
        value = value.replace('#', '栋')
        #value = base64.encodestring(value)
        sendStr = "GET /log_get.php?key=" + operation + "&value=" + value + " HTTP/1.1\r\nHost: " + http_ip + "\r\nConnection: Close\r\n\r\n"
        self.udpClient.sendto(sendStr.encode("utf-8"), (const.HTTP_SERVER_IP, 80))

    def __del__(self):
        self.udpClient.close()