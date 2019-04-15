// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var JoinRoomUI = UIBase.extend({
	ctor:function() {
		this._super();
		this.resourceFilename = "res/ui/JoinRoomUI.json";
	},

	initUI:function(){
		this.curRoomNum = 0;
		this.joinroom_panel = this.rootUINode.getChildByName("joinroom_panel");
		var self = this;
		this.joinroom_panel.getChildByName("_1_btn").addTouchEventListener(function(sender, eventType){
			if(eventType === ccui.Widget.TOUCH_ENDED){
                if(self.curRoomNum.toString().length !== 6) {
                    self.curRoomNum = (self.curRoomNum * 10 + 1) % 1000000;
                    self.update_room_num();
                }
			}
		});
		this.joinroom_panel.getChildByName("_2_btn").addTouchEventListener(function(sender, eventType){
			if(eventType === ccui.Widget.TOUCH_ENDED){
                if(self.curRoomNum.toString().length !== 6) {
                    self.curRoomNum = (self.curRoomNum * 10 + 2) % 1000000;
                    self.update_room_num();
                }
			}
		});
		this.joinroom_panel.getChildByName("_3_btn").addTouchEventListener(function(sender, eventType){
			if(eventType === ccui.Widget.TOUCH_ENDED){
                if(self.curRoomNum.toString().length !== 6) {
                    self.curRoomNum = (self.curRoomNum * 10 + 3) % 1000000;
                    self.update_room_num();
                }
			}
		});
		this.joinroom_panel.getChildByName("_4_btn").addTouchEventListener(function(sender, eventType){
			if(eventType === ccui.Widget.TOUCH_ENDED){
                if(self.curRoomNum.toString().length !== 6) {
                    self.curRoomNum = (self.curRoomNum * 10 + 4) % 1000000;
                    self.update_room_num();
                }
			}
		});
		this.joinroom_panel.getChildByName("_5_btn").addTouchEventListener(function(sender, eventType){
			if(eventType === ccui.Widget.TOUCH_ENDED){
                if(self.curRoomNum.toString().length !== 6) {
                    self.curRoomNum = (self.curRoomNum * 10 + 5) % 1000000;
                    self.update_room_num();
                }
			}
		});
		this.joinroom_panel.getChildByName("_6_btn").addTouchEventListener(function(sender, eventType){
			if(eventType === ccui.Widget.TOUCH_ENDED){
                if(self.curRoomNum.toString().length !== 6) {
                    self.curRoomNum = (self.curRoomNum * 10 + 6) % 1000000;
                    self.update_room_num();
                }
			}
		});
		this.joinroom_panel.getChildByName("_7_btn").addTouchEventListener(function(sender, eventType){
			if(eventType === ccui.Widget.TOUCH_ENDED){
                if(self.curRoomNum.toString().length !== 6) {
                    self.curRoomNum = (self.curRoomNum * 10 + 7) % 1000000;
                    self.update_room_num();
                }
			}
		});
		this.joinroom_panel.getChildByName("_8_btn").addTouchEventListener(function(sender, eventType){
			if(eventType === ccui.Widget.TOUCH_ENDED){
                if(self.curRoomNum.toString().length !== 6) {
                    self.curRoomNum = (self.curRoomNum * 10 + 8) % 1000000;
                    self.update_room_num();
                }
			}
		});
		this.joinroom_panel.getChildByName("_9_btn").addTouchEventListener(function(sender, eventType){
			if(eventType === ccui.Widget.TOUCH_ENDED){
                if(self.curRoomNum.toString().length !== 6) {
                    self.curRoomNum = (self.curRoomNum * 10 + 9) % 1000000;
                    self.update_room_num();
                }
			}
		});
		this.joinroom_panel.getChildByName("_0_btn").addTouchEventListener(function(sender, eventType){
			if(eventType === ccui.Widget.TOUCH_ENDED){
                if(self.curRoomNum.toString().length !== 6) {
                    self.curRoomNum = (self.curRoomNum * 10) % 1000000;
                    self.update_room_num();
                }
			}
		});
		this.joinroom_panel.getChildByName("_clear_btn").addTouchEventListener(function(sender, eventType){
			if(eventType === ccui.Widget.TOUCH_ENDED){
				self.curRoomNum = 0;
                self.update_room_num();
			}
		});
		this.joinroom_panel.getChildByName("_back_btn").addTouchEventListener(function(sender, eventType){
			if(eventType === ccui.Widget.TOUCH_ENDED){
				self.curRoomNum = Math.floor(self.curRoomNum / 10);
				self.update_room_num();
			}
		});
		this.joinroom_panel.getChildByName("return_btn").addTouchEventListener(function(sender, eventType){
			if(eventType === ccui.Widget.TOUCH_ENDED){
				self.hide();
			}
		});
		this.update_room_num();
	},

	update_room_num:function(){
		var roomNum = this.curRoomNum;
		var self = this;
		if (this.curRoomNum.toString().length === 6){
            cutil.lock_ui();
            self.joinroom_panel.runAction(cc.sequence(
            	cc.delayTime(0.5),
				cc.callFunc(function () {
					cutil.unlock_ui();
					var player = h1global.entityManager.player();
					player.enterRoom(self.curRoomNum);
            })))
		}
		for(var i = 0; i < 6; i++){
			var cur_num_img = this.joinroom_panel.getChildByName("num_img" + i.toString());
			cur_num_img.ignoreContentAdaptWithSize(true);
			if(roomNum <= 0){
				cur_num_img.setVisible(false);
			} else {
				cur_num_img.loadTexture("res/ui/JoinRoomUI/0" + (roomNum%10).toString() + ".png");
				cur_num_img.setVisible(true);
				roomNum = Math.floor(roomNum/10);
			}
		}
	}
});