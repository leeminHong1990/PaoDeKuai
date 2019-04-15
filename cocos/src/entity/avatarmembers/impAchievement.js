"use strict";
/*-----------------------------------------------------------------------------------------
												interface
-----------------------------------------------------------------------------------------*/
var impAchievement = KBEngine.Avatar.extend({
	__init__ : function()
	{
		this._super();
	},

	pushSignInNum : function(signInNum){
		this.signInNum = signInNum;
        if(h1global.curUIMgr.sign_ui && h1global.curUIMgr.sign_ui.is_show){
            h1global.curUIMgr.sign_ui.preSign(this.signInNum);
        }
	},

	signIn : function(){
		this.baseCall("signIn");
	},

	signInFailed : function(){
		var tips = "您今天已经签到过了！请明天再来签到";
		h1global.globalUIMgr.info_ui.show_by_info(tips, cc.size(300, 200));
	},

    reqSignInfo:function () {
        this.baseCall("reqSignInfo");
    },

    pushSignInfo:function (info) {
		if (!info){
			return
		}
		h1global.curUIMgr.sign_ui.preSignInfo(info,this.signInNum);
    }
});
