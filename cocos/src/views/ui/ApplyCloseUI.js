// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var ApplyCloseUI = UIBase.extend({
	ctor:function() {
		this._super();
		this.resourceFilename = "res/ui/ApplyCloseUI.json";
		this.setLocalZOrder(const_val.MAX_LAYER_NUM);
	},

	initUI:function(){
		this.applyclose_panel = this.rootUINode.getChildByName("applyclose_panel");
		var self = this;
		var player = h1global.entityManager.player();

		this.from_label = this.applyclose_panel.getChildByName("from_label");
		this.content_label = this.applyclose_panel.getChildByName("content_label");
		this.lefttime_label = this.applyclose_panel.getChildByName("lefttime_label");
		var yes_btn = this.applyclose_panel.getChildByName("yes_btn");
		this.yes_btn = yes_btn;
		var no_btn = this.applyclose_panel.getChildByName("no_btn");
		this.no_btn = no_btn;
		var waiting_label = this.applyclose_panel.getChildByName("waiting_label");
		this.waiting_label = waiting_label;
		yes_btn.addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				// 同意
				player.voteDismissRoom(1);
				yes_btn.setVisible(false);
				no_btn.setVisible(false);
				waiting_label.setVisible(true);
			}
		});
		no_btn.addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				// 不同意
				player.voteDismissRoom(2);
				yes_btn.setVisible(false);
				no_btn.setVisible(false);
				waiting_label.setVisible(true);
			}
		});

		this.update_vote_state();
	},

	update_vote_state : function(){
		var player = h1global.entityManager.player();
		var applyCloseStateList = player.curGameRoom.applyCloseStateList;
		var playerInfoList = player.curGameRoom.playerInfoList;
		var content = "";
		for(var i = 0; i < playerInfoList.length; i++){
			if(applyCloseStateList[i] == 0){
				content = content + playerInfoList[i]["nickname"] + "正在选择...\n";
			} else if(applyCloseStateList[i] == 1){
				content = content + playerInfoList[i]["nickname"] + "选择了同意\n";
			} else if(applyCloseStateList[i] == 2){
				content = content + playerInfoList[i]["nickname"] + "选择了不同意\n";
			}
		}
		this.content_label.setString(content);
	},

	update_left_time : function(leftTime){
		if(!this.is_show){
			return;
		}
		this.lefttime_label.setString("剩余" + (Math.floor(leftTime)).toString() + "秒");
	},

	show_by_sitnum:function(serverSeatNum){
		var self = this;
		var player = h1global.entityManager.player();
		this.show(function(){
			self.from_label.setString(player.curGameRoom.playerInfoList[serverSeatNum]["nickname"] + "申请解散房间");
			self.update_vote_state();
			if(serverSeatNum == player.serverSeatNum){
				self.yes_btn.setVisible(false);
				self.no_btn.setVisible(false);
				self.waiting_label.setVisible(true);
			}
		});
	},
});