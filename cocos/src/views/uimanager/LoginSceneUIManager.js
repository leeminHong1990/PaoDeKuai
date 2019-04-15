var LoginSceneUIManager = UIManagerBase.extend({
    onCreate: function () {
        var initUIClassNameList = ["LoginUI"];

        for(var uiClassName of initUIClassNameList){
            this.add_ui(uiClassName.slice(0, uiClassName.length - 2).toLowerCase() + "_ui", [], uiClassName);
        }
    }
});