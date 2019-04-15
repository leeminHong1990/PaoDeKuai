var NoviceHelpUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/NoviceHelpUI.json";
    },

    initUI: function () {
        this.flag = 0;
        var self = this;
        var help_panel = this.rootUINode.getChildByName("help_panel");
        var return_btn = help_panel.getChildByName("return_btn");

        return_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });

        help_panel.getChildByName("next_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.flag ++;
                self.touch_event();
            }
        });

        help_panel.getChildByName("previous_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.flag --;
                self.touch_event();
            }
        });
    },

    touch_event:function (){
        var self = this;
        var help_panel = this.rootUINode.getChildByName("help_panel");
        if (self.flag >= 3){
            self.flag = 0;
        }else if (self.flag <= -1){
            self.flag = 2;
        }
        for (var i = 0; i < 3; i++){
            if (self.flag === i){
                help_panel.getChildByName("content_img_"+i.toString()).setVisible(true);
            }else {
                help_panel.getChildByName("content_img_"+i.toString()).setVisible(false);
            }
        }
    },
});