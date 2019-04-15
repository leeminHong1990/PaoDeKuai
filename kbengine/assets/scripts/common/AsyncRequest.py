# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
from BaseEntity import BaseEntity
import socket
from http.client import HTTPResponse
from urllib.parse import splittype, splithost, splitport
from Functor import Functor

SEND_CNT = '%s %s HTTP/1.1\r\nHost: %s\r\nUser-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36\r\n%s'

g_async = None

######################################################################################
# windows下文件描述符限制为64, linux下为1024(可设置).
# tick的时间加快为0.2s, 能更快的响应请求.
# 1次tick处理16个请求, 超时时间设置为6s. 防止极端情况描述符不够(这种情况下估计已经赚翻了).
# 相对于前一个版本提升16 * (1 / 0.2)倍的效率, 足够满足需求.
######################################################################################
SIZE_PER_SECOND = 16
REQUEST_TIMEOUT = 6

def _getAsync():
	global g_async
	if g_async == None:
		g_async = KBEngine.createBaseLocally('AsyncRequest', {})
	return g_async


def Request(url, func):
	async = _getAsync()
	async.request(url, None, func)


def Post(url, opt, func):
	async = _getAsync()
	async.request(url, opt, func)


class AsyncRequest(BaseEntity):

	def __init__(self):
		BaseEntity.__init__(self)
		self._tasks = []
		self._write_timer = {}
		self.add_repeat_timer(1, 0.2, self.run)

	def run(self):
		if len(self._tasks) > 0:
			tasks_copy = self._tasks[:SIZE_PER_SECOND]
			self._tasks = self._tasks[SIZE_PER_SECOND:]
			list(map(self.work, tasks_copy))

	def work(self, task):
		sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
		try:
			pro_, rest = splittype(task[0])
			host, rest = splithost(rest)
			host, port = splitport(host)
			task.append(rest)
			task.append(host)
			sock.setblocking(0)
			sock.connect_ex((host, int(port) if port else 80))

			def timeout_cb():
				if not sock._closed:
					KBEngine.deregisterWriteFileDescriptor(sock.fileno())
					sock.close()
				if task and task[2]:
					task[2](None)

			self._write_timer[sock.fileno()] = self.add_timer(REQUEST_TIMEOUT, timeout_cb)
			KBEngine.registerWriteFileDescriptor(sock.fileno(), Functor(self.onSend, task, sock))
		except:
			self._tasks.append(task)
			self.logsError()
			if not sock._closed:
				sock.close()

	def onSend(self, task, sock, file_no):
		if sock.fileno() == file_no:
			try:
				KBEngine.deregisterWriteFileDescriptor(file_no)
				opt, rest, host, method, end = task[1], task[3], task[4], "GET", "Accept: */*\r\n\r\n"
				if opt and len(opt) > 0:
					method = 'POST'
					end = 'Content-Type: application/x-www-form-urlencoded\r\nContent-Length: %s\r\n%s' % self.onHandlePost(opt)
				data = SEND_CNT % (method, rest, host, end)
				# DEBUG_MSG("### onSend %s" % data)
				sock.send(data.encode('utf-8'))
				KBEngine.registerReadFileDescriptor(sock.fileno(), Functor(self.onRecv, task, sock))
			except:
				self._tasks.append(task)
				self.logsError()
				if not sock._closed:
					sock.close()

	def onRecv(self, task, sock, file_no):
		if sock.fileno() == file_no:
			t_id = self._write_timer.pop(file_no, None)
			if t_id:
				self.cancel_timer(t_id)
			try:
				# INFO_MSG('------------- onRecv ------------ {} {}'.format(task[0], task[2]))
				resp = HTTPResponse(sock)
				if task and task[2]:
					resp.begin()
					if resp.getcode() / 100 == 2:
						decode = resp.read().decode('utf-8')
						task[2](decode)
					else:
						task[2](None)
			except:
				self.logsError()
			finally:
				KBEngine.deregisterReadFileDescriptor(file_no)
				if not sock._closed:
					sock.close()

	def logsError(self):
		import traceback
		ERROR_MSG(traceback.format_exc())

	def request(self, url, opt=None, callback=None):
		self._tasks.append([url, opt, callback])

	def onHandlePost(self, opt):
		ret = ''
		for k in opt:
			ret += '&%s=%s' % (k, opt[k])
		return len(ret[1:]), '\r\n' + ret[1:] + '\r\n\r\n'
