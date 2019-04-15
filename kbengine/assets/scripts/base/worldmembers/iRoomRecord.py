# -*- coding: utf-8 -*-

import KBEngine
from KBEDebug import *

import json
import copy
import datetime
import re

import const
import time


class iRoomRecord(object):
    def __init__(self):
        # self.recordCache = SimpleCache(const.MAX_RECORD_CACHE)
        # self.recordNoneCache = SimpleCache(const.MAX_RECORD_NONE_CACHE)
        # 没有打完的牌局不记录数据库
        self.transientRecordDict = {}
        self.roomRecordIdDict = {}
        self.game_room = None
        self.init_database()

    @staticmethod
    def init_database():
        def create_callback(result, rows, insert_id, errorCode):
            DEBUG_MSG("room record init_database: {0}, {1}, {2},{3}".format(result, rows, insert_id, errorCode))

        KBEngine.executeRawDatabaseCommand(
            'CREATE TABLE IF NOT EXISTS {0} ( id INT NOT NULL AUTO_INCREMENT,record_id INT,player_id_list VARCHAR(255) NOT NULL, record TEXT NOT NULL, create_time DATETIME,PRIMARY KEY (id)) DEFAULT CHARSET = utf8;'
                .format(const.TABLE_GAME_RECORD_NAME),
            create_callback)

    def begin_record_room(self, mailbox, room_id, game_room):
        rid = self.recordIndex + 1
        self.recordIndex = rid
        self.roomRecordIdDict[room_id] = rid

        self.game_room = game_room
        players_list = game_room.origin_players_list
        init_cards = [None] * len(players_list)
        player_id_list = []
        for i,p in enumerate(players_list):
            if p:
                init_cards[p.idx] = copy.copy(p.cards)
                player_id_list.append([p.mb.userId, i])
                DEBUG_MSG("begin_record_room {0} ".format(p.mb.userId))

        record = {
            'recordId': rid,
            'key_card': game_room.key_card,
            'wait_idx': game_room.wait_idx,
            'init_info': game_room.get_init_client_dict(),
            'player_id_list': player_id_list,
            'init_cards': init_cards,
            'start_time': time.time()
        }
        self.transientRecordDict[rid] = record
        mailbox.begin_record_callback(rid)

    def end_record_room(self, room_id, game_room, result_info):
        rid = self.roomRecordIdDict[room_id]
        record = self.transientRecordDict[rid]
        DEBUG_MSG("end_record_room {0}".format(game_room.op_record))
        record['op_record_list'] = game_room.op_record
        record['round_result'] = result_info
        record['end_time'] = time.time()
        record_str = str(record)

        del self.transientRecordDict[rid]
        del self.roomRecordIdDict[room_id]
        self._insert_record(rid, record['player_id_list'], record_str)

    def give_up_record_room(self, room_id):
        if self.roomRecordIdDict.__contains__(room_id):
            rid = self.roomRecordIdDict[room_id]
            del self.transientRecordDict[rid]
            del self.roomRecordIdDict[room_id]

    def query_record(self, mailbox, record_id):
        DEBUG_MSG("queryRecord {0} ".format(record_id))

        def query_callback_with_cache(results, rows, insert_id, error):
            DEBUG_MSG("query result: {0}, {1}, {2}, {3}".format(len(results), rows, insert_id, error))
            if len(results) > 0:
                record = results[0][1].decode()
                record = record.replace('\'', '\"')
                mailbox.query_record_result(record)
            else:
                mailbox.query_record_result(None)

        self._query_record_from_db(record_id, query_callback_with_cache)

    def query_user_record(self, mailbox, user_id, size):
        pass

    def _insert_record(self, record_id, player_id_list, record):
        def insert_callback(result, rows, insert_id, error):
            DEBUG_MSG('insert_callback {0}, {1}, {2}, {3}'.format(result, rows, insert_id, error))

        sql = 'INSERT INTO {0} (record_id, player_id_list,record,create_time) VALUES ("{1}", "{2}","{3}","{4}")' \
            .format(const.TABLE_GAME_RECORD_NAME, record_id, json.dumps(player_id_list), re.escape(record),
                    datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        DEBUG_MSG("sql = {0} ".format(sql))
        KBEngine.executeRawDatabaseCommand(sql, insert_callback)

    def _query_record_from_db(self, record_id, callback):
        sql = 'SELECT record_id, record, create_time FROM {0} WHERE record_id = "{1}";' \
            .format(const.TABLE_GAME_RECORD_NAME, record_id)
        KBEngine.executeRawDatabaseCommand(sql, callback)
