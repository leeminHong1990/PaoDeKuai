// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var AudioRecordUI = UIBase.extend({
	ctor:function() {
		this._super();
		this.resourceFilename = "res/ui/AudioRecordUI.json";
	},

	initUI:function(){
		this.audiorecord_panel = this.rootUINode.getChildByName("audiorecord_panel");
		var self = this;
		var counter = -1;
		this.audiorecord_panel.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.DelayTime.create(0.5), 
			cc.CallFunc.create(function(){
				counter = (counter + 1) % 4;
				for(var i = 0; i < 3; i++){
					var curImg = self.audiorecord_panel.getChildByName("hint" + i.toString());
					if(i < counter){
						curImg.setVisible(true);
					} else {
						curImg.setVisible(false);
					}
				}
			})
		)));
	},
});