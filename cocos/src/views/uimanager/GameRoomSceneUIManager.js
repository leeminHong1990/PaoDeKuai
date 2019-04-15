var GameRoomSceneUIManager = UIManagerBase.extend({
    onCreate:function(){
        var initUIClassNameList = ["GameRoomUI", "GameRoomPrepareUI", "GameRoomInfoUI", "AudioRecordUI", "SettlementUI", "ResultUI",
            "HelpUI", "ConfigUI", "GamePlayerInfoUI", "CommunicateUI", "ShareUI", "ApplyCloseUI","GPSUI","ArenaDailyRankUI","ArenaWeeklyDetailsUI",
            "GameRoomTestUI"];

        for(var uiClassName of initUIClassNameList){
            this.add_ui(uiClassName.slice(0, uiClassName.length - 2).toLowerCase() + "_ui", [], uiClassName);
        }
    }
});