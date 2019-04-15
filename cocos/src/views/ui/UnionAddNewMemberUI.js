// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var UnionAddNewMemberUI = UIBase.extend({
	ctor:function() {
		this._super();
		this.resourceFilename = "res/ui/UnionAddNewMemberUI.json";
	},

	initUI:function(){
		this.curRoomNum = 0;
		var player = h1global.entityManager.player();
		this.addmember_panel = this.rootUINode.getChildByName("addmember_panel");
		var self = this;
		this.string ="";
		this.addmember_panel.getChildByName("_1_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				self.string += "1";
                self.id_tf.setString(self.string);
			}
		});
		this.addmember_panel.getChildByName("_2_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
                self.string += "2";
                self.id_tf.setString(self.string);
			}
		});
		this.addmember_panel.getChildByName("_3_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
                self.string += "3";
                self.id_tf.setString(self.string);
			}
		});
		this.addmember_panel.getChildByName("_4_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
                self.string += "4";
                self.id_tf.setString(self.string);
			}
		});
		this.addmember_panel.getChildByName("_5_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
                self.string += "5";
                self.id_tf.setString(self.string);
			}
		});
		this.addmember_panel.getChildByName("_6_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
                self.string += "6";
                self.id_tf.setString(self.string);
			}
		});
		this.addmember_panel.getChildByName("_7_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
                self.string += "7";
                self.id_tf.setString(self.string);
			}
		});
		this.addmember_panel.getChildByName("_8_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
                self.string += "8";
                self.id_tf.setString(self.string);
			}
		});
		this.addmember_panel.getChildByName("_9_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
                self.string += "9";
                self.id_tf.setString(self.string);
			}
		});
		this.addmember_panel.getChildByName("_0_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
                self.string += "0";
                self.id_tf.setString(self.string);
			}
		});
		this.addmember_panel.getChildByName("_ok_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
                if (h1global.curUIMgr.unionhall_ui && h1global.curUIMgr.unionhall_ui.is_show) {
                    h1global.curUIMgr.unionhall_ui.sendInviteJoinGroup(parseInt(self.id_tf.getString()));
                }
				// 发送id
				self.hide();
			}
		});
		this.addmember_panel.getChildByName("_back_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				self.string = self.string.substr(0,self.string.length-1);
                self.id_tf.setString(self.string);
			}
		});
		this.addmember_panel.getChildByName("return_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				self.hide();
			}
		});

        //输入框 新成员id
        this.id_tf = new MyEditBox("请输入ID", "黑体", 43,"res/ui/UnionAddNewMemberUI/input_bg_img.png");
        this.id_tf.setAnchorPoint(0, 0);
        this.id_tf.setPos(385,553);
        this.rootUINode.addChild(this.id_tf);
        this.id_tf.setMaxLength(7);
        this.id_tf.setTextColor(cc.color(138, 82, 54, 255));
	},

});