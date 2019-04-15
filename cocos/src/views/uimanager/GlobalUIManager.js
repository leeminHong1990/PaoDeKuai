var GlobalUIManager = UIManagerBase.extend({
	onCreate:function(){
        var initUIClassNameList = ["InfoUI", "BroadcastUI", "LockUI","InfoBtnUI"];

        for(var uiClassName of initUIClassNameList){
            this.add_ui(uiClassName.slice(0, uiClassName.length - 2).toLowerCase() + "_ui", [], uiClassName);
        }
        this.lock_ui.hasPreload = true;

	    // 版本号嵌入
	    if(switches.show_version){
		    if((cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) || (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative)){
		    	var version_label = cc.LabelTTF.create("v" + app_version, "Arial", 26);
		    	version_label.setAnchorPoint(cc.p(1.0, 0.0));
		    	version_label.setPosition(cc.p(1280, 0));
		    	this.addChild(version_label);
		    } else {
		    	var version_label = cc.LabelTTF.create("v" + g_version, "Arial", 26);
		    	version_label.setAnchorPoint(cc.p(1.0, 0.0));
		    	version_label.setPosition(cc.p(1280, 0));
		    	this.addChild(version_label);
		    }
		}
	}
});
