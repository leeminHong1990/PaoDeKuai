import KBEngine
from KBEDebug import *


class iGroup:
    def pushGroupInfoList(self, groupLoginInfoList):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushNewGroup(self, groupLoginInfo):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushJoinGroup(self, groupLoginInfo):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushInviteJoinGroup(self, group_id, memberList):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushExitGroup(self, group_id):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushDestroyGroup(self, group_id):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushGroupBillboard(self, group_id, bill_board):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushMarkMember(self, group_id, mem_userId, remark):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushDelMember(self, group_id, mem_userId):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushCreateTeam(self, group_id, team_list):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushDestroyTeam(self, group_id, team_list):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushJoinTeam(self, group_id, team_uuid, mem_userId):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushDelTeamMem(self, group_id, team_uuid, mem_userId):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushGenTeamRoom(self, group_id, team_uuid, team_info_list):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushChangeTeamState(self, group_id, team_uuid, team_state):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushTeamRoomList(self, group_id, team_uuid, room_list):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushTeamHistoryRoomList(self, group_id, team_uuid, room_list):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushGroupRoomList(self, group_id, room_list):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushDismissGroupRoom(self, group_id, room_id):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return

    def pushGroupRankList(self, rankList, acc, per):
        # DEBUG_MSG("%s[%i] %s" % (self.__class__.__name__, self.id, sys._getframe().f_code.co_name))
        return
