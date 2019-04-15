// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var InvitationUI = UIBase.extend({
	ctor:function() {
		this._super();
		this.resourceFilename = "res/ui/InvitationUI.json";
	},

	initUI:function(){
		this.curRoomNum = 0;
		this.joinroom_panel = this.rootUINode.getChildByName("joinroom_panel");
		this.joinroom_panel.getChildByName("hint_label").setString("请绑定邀请码");
		var self = this;
		this.joinroom_panel.getChildByName("_1_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				if(self.curRoomNum >= 100000){return;}
				self.curRoomNum = (self.curRoomNum * 10 + 1) % 1000000;
				self.update_room_num();
			}
		});
		this.joinroom_panel.getChildByName("_2_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				if(self.curRoomNum >= 100000){return;}
				self.curRoomNum = (self.curRoomNum * 10 + 2) % 1000000;
				self.update_room_num();
			}
		});
		this.joinroom_panel.getChildByName("_3_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				if(self.curRoomNum >= 100000){return;}
				self.curRoomNum = (self.curRoomNum * 10 + 3) % 1000000;
				self.update_room_num();
			}
		});
		this.joinroom_panel.getChildByName("_4_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				if(self.curRoomNum >= 100000){return;}
				self.curRoomNum = (self.curRoomNum * 10 + 4) % 1000000;
				self.update_room_num();
			}
		});
		this.joinroom_panel.getChildByName("_5_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				if(self.curRoomNum >= 100000){return;}
				self.curRoomNum = (self.curRoomNum * 10 + 5) % 1000000;
				self.update_room_num();
			}
		});
		this.joinroom_panel.getChildByName("_6_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				if(self.curRoomNum >= 100000){return;}
				self.curRoomNum = (self.curRoomNum * 10 + 6) % 1000000;
				self.update_room_num();
			}
		});
		this.joinroom_panel.getChildByName("_7_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				if(self.curRoomNum >= 100000){return;}
				self.curRoomNum = (self.curRoomNum * 10 + 7) % 1000000;
				self.update_room_num();
			}
		});
		this.joinroom_panel.getChildByName("_8_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				if(self.curRoomNum >= 100000){return;}
				self.curRoomNum = (self.curRoomNum * 10 + 8) % 1000000;
				self.update_room_num();
			}
		});
		this.joinroom_panel.getChildByName("_9_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				if(self.curRoomNum >= 100000){return;}
				self.curRoomNum = (self.curRoomNum * 10 + 9) % 1000000;
				self.update_room_num();
			}
		});
		this.joinroom_panel.getChildByName("_0_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				if(self.curRoomNum >= 100000){return;}
				self.curRoomNum = (self.curRoomNum * 10) % 1000000;
				self.update_room_num();
			}
		});
		this.joinroom_panel.getChildByName("_ok_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				cutil.lock_ui();
				// var xhr = cc.loader.getXMLHttpRequest();
    //             xhr.open("POST", switchesnin1.PHP_SERVER_URL + "/", true);
    //             xhr.onreadystatechange = function () {
    //                 if (xhr.readyState === 4 && xhr.status === 200) {
    //                     var invite_code_str = xhr.responseText;
    //                     if(isNaN(invite_code_str)){
    //                     	h1global.globalUIMgr.info_ui.show_by_info("绑定失败！");
    //                     } else {
	   //                      var info_json = cc.sys.localStorage.getItem("INFO_JSON");
	   //                      var info_dict = eval('(' + info_json + ')');
	   //                      info_dict["invite_code"] = parseInt(invite_code_str);
	   //                      cc.sys.localStorage.setItem("INFO_JSON", JSON.stringify(info_dict));
	   //                      h1global.globalUIMgr.info_ui.show_by_info("请访问微信公众号[" + switchesnin1.gzh_name + "]充值");
	   //                  }
	   //                  cutil.unlock_ui();
    //                 }
    //             };
    //             xhr.send();
    			var info_dict = eval('(' + cc.sys.localStorage.getItem("INFO_JSON") + ')');
    			cutil.app_bind_agent("wx_" + info_dict["unionid"], self.curRoomNum, function(content){
    				cutil.unlock_ui();
    				if(content == "SUCCESS"){
                        info_dict["invite_code"] = 1;
                        cc.sys.localStorage.setItem("INFO_JSON", JSON.stringify(info_dict));
                        h1global.globalUIMgr.info_ui.show_by_info("请访问微信公众号搜索\r\n[" + switchesnin1.gzh_name + "]进行充值");
    				} else if(content == "FAIL"){
    					h1global.globalUIMgr.info_ui.show_by_info("绑定失败！");
    				} else if(content == "ERROR ALREADY"){
    					h1global.globalUIMgr.info_ui.show_by_info("该用户已绑定！");
    				} else if(content == "ERROR NO AGENT"){
    					h1global.globalUIMgr.info_ui.show_by_info("该代理不存在！");
    				} else {
    					h1global.globalUIMgr.info_ui.show_by_info(content);
    				}
    			})
				self.hide();
			}
		});
		this.joinroom_panel.getChildByName("_back_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				self.curRoomNum = Math.floor(self.curRoomNum / 10);
				self.update_room_num();
			}
		});
		this.joinroom_panel.getChildByName("return_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				self.hide();
			}
		});
		this.update_room_num();
	},

	update_room_num:function(){
		var roomNum = this.curRoomNum;
		for(var i = 0; i < 6; i++){
			var cur_num_img = this.joinroom_panel.getChildByName("num_img" + i.toString());
			cur_num_img.ignoreContentAdaptWithSize(true);
			if(roomNum <= 0){
				cur_num_img.setVisible(false);
			} else {
				cur_num_img.loadTexture("InvitationUI/" + (roomNum%10).toString() + ".png", ccui.Widget.PLIST_TEXTURE);
				cur_num_img.setVisible(true);
				roomNum = Math.floor(roomNum/10);
			}
		}
	},
});