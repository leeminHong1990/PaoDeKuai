var HelpUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/HelpUI.json";
        this.setLocalZOrder(const_val.MAX_LAYER_NUM);
    },

    initUI: function () {
        var self = this;
        this.play_btn_list =[];
        this.play_scroll_list =[];
        var help_panel = this.rootUINode.getChildByName("help_panel");
        var return_btn = help_panel.getChildByName("return_btn");

        return_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });

        var close_btn = help_panel.getChildByName("close_btn");

        function play_btn_event(sender,eventType) {
            if(eventType ==ccui.Widget.TOUCH_ENDED ){
                for (var i = 0 ; i < self.play_btn_list.length; i++){
                    if (sender != self.play_btn_list[i]){
                        self.play_btn_list[i].setTouchEnabled(true);
                        self.play_btn_list[i].setBright(true);
                        self.play_scroll_list[i].setVisible(false);
                    }else {
                        self.play_btn_list[i].setTouchEnabled(false);
                        self.play_btn_list[i].setBright(false);
                        self.play_scroll_list[i].setVisible(true);
                    }
                }
            }
        }

        for (var i= 0; i < 3; i++ ){
            var play_btn = help_panel.getChildByName("play_btn_"+(i+1).toString());
            self.play_btn_list.push(play_btn);
            play_btn.addTouchEventListener(play_btn_event);

            var play_scroll = help_panel.getChildByName("play_scroll_"+(i+1).toString());
            self.play_scroll_list.push(play_scroll);
        }
        self.play_btn_list[0].setTouchEnabled(false);
        self.play_btn_list[0].setBright(false);
        self.play_scroll_list[0].setVisible(true);
    }
});