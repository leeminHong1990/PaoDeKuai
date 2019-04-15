var GameHallSceneUIManager = UIManagerBase.extend({
    onCreate: function () {
        var initUIClassNameList = ["GameHallUI", "CreateRoomUI", "JoinRoomUI", "HelpUI", "FeedBackUI",
            "InvitationUI", "PlayerInfoUI", "RecordUI", "ConfigUI", "SignUI", "NameCertificationUI", "ActivitiesUI", "LeaderboardUI",
            "UnionHallUI", "UnionCreateUI", "UnionTipUI", "UnionMatchMemberUI", "UnionMemberAllSelectUI", "UnionRoomInfoUI", "UnionInputUI",
            "UnionAddNewMemberUI", "UnionCreateRoomUI", "GameRoomBackUI", "InputLayerUI", "NoviceHelpUI", "ConnectionUI", "ShopUI", "WXShareUI",
            "UnionRankUI"];

        for (var uiClassName of initUIClassNameList) {
            this.add_ui(uiClassName.slice(0, uiClassName.length - 2).toLowerCase() + "_ui", [], uiClassName);
        }
    }
});