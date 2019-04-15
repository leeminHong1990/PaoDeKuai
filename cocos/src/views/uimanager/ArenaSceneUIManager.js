var ArenaSceneUIManager = UIManagerBase.extend({
    onCreate: function () {
        var initUIClassNameList = ["ArenaUI", "ArenaResultUI", "ArenaDailyRankUI", "ArenaInfoUI", "InfoUI", "ArenaRankUI", "ArenaTipUI","ArenaRuleUI","WebViewUI"];

        for (var uiClassName of initUIClassNameList) {
            this.add_ui(uiClassName.slice(0, uiClassName.length - 2).toLowerCase() + "_ui", [], uiClassName);
        }
    }
});