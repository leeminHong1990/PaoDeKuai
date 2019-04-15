"use strict"

var LockUI = UIBase.extend({
	ctor:function(){
		this._super();
		this.resourceFilename = "res/ui/LockUI.json";
		this.setLocalZOrder(const_val.MAX_LAYER_NUM + 1);
	},

	initUI:function(){
		var effect_node = this.rootUINode.getChildByName("effect_node");
		// var effect_lockui_info = table_battle_effect[3500071];
		UICommonWidget.load_effect_plist("effect_lockui");
		var effect = cc.Sprite.create();
		effect.runAction(cc.RepeatForever.create(UICommonWidget.create_effect_action({"FRAMENUM":16, "TIME":1.0, "NAME":"effect_lockui"})));
		effect_node.addChild(effect);
	},
});