"use strict";
/*-----------------------------------------------------------------------------------------
 interface
 -----------------------------------------------------------------------------------------*/

var impSportOperation = impRoomOperation.extend({
    __init__: function () {
        this._super();
        this.surplus_times = 0;
        KBEngine.DEBUG_MSG("Create impSportOperation");
    },

    joinSport: function (sportId) {
        this.baseCall("joinSport", sportId);
    },

    pushDailySportRank: function (flag, daily_rank_list) {
        cc.log("pushDailySportRank", daily_rank_list);
        h1global.curUIMgr.arenadailyrank_ui.show_by_info(flag, daily_rank_list);
    },

    getWeeklySportRank: function (sportId) {
        this.baseCall("getWeeklySportRank", sportId);
    },


    gotWeeklySportRank:function (isOpen, rank_list) {
        cc.log("gotWeeklySportRank", rank_list)
        h1global.curUIMgr.arenarank_ui.update_week_rank_info(isOpen,rank_list);
    },

    giveUpWeeklySport: function () {
        this.baseCall("giveUpWeeklySport");
    },

    pushSportTimesList: function (times_list) {
        cc.log("pushSportTimesList", times_list);
        this.loadSportTimesList(times_list);
    },

    loadSportTimesList: function (times_list) {
        this.free_times = times_list;
    },

    getLocalSportTimesList: function () {
        this.free_times = this.free_times || null;
        return this.free_times;
    },
});