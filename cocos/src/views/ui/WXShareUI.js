// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var WXShareUI = UIBase.extend({
	ctor:function() {
		this._super();
		this.resourceFilename = "res/ui/WXShareUI.json";
	},

	initUI:function(){
		var self = this;
		var share_panel = this.rootUINode.getChildByName("share_panel");
		var share_btn = share_panel.getChildByName("share_btn");
		share_btn.addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				if((cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative)){
					jsb.reflection.callStaticMethod(switchesnin1.package_name + "/AppActivity","callWechatShareUrl", "(ZLjava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", true, switchesnin1.share_android_url, switchesnin1.share_title, switchesnin1.share_desc);
				} else if((cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative)){
					jsb.reflection.callStaticMethod("WechatOcBridge","callWechatShareUrlToSession:fromUrl:withTitle:andDescription:", true, switchesnin1.share_ios_url, switchesnin1.share_title, switchesnin1.share_desc);
				}
			}
		});
		var timeline_btn = share_panel.getChildByName("timeline_btn");
		timeline_btn.addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				if((cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative)){
					jsb.reflection.callStaticMethod(switchesnin1.package_name + "/AppActivity","callWechatShareUrl", "(ZLjava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", false, switchesnin1.share_android_url, switchesnin1.share_title, switchesnin1.share_desc);
				} else if((cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative)){
					jsb.reflection.callStaticMethod("WechatOcBridge","callWechatShareUrlToSession:fromUrl:withTitle:andDescription:", false, switchesnin1.share_ios_url, switchesnin1.share_title, switchesnin1.share_desc);
				}
			}
		});
		var shareinfo_panel = share_panel.getChildByName("shareinfo_panel");
		var return_btn = shareinfo_panel.getChildByName("return_btn");
		return_btn.addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				self.hide();
			}
		});


	},
});