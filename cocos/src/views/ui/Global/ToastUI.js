
var ToastUI = UIBase.extend({
    ctor:function(){
        this._super();
        this.resourceFilename = "res/ui/ToastUI.json";
        this.setLocalZOrder(const_val.MAX_LAYER_NUM);
        // 直接初始化加载资源，不必等待首次显示加载
        //this:initUI()
    },

    initUI:function(){

    },

    show_toast:function(content, font_size, toast_pos, toast_size, toast_time){
        toast_time = toast_time || 1.5
        toast_pos = toast_pos || cc.p(0.5, 0.3)
        toast_size = toast_size || cc.size(500, 80)
        font_size = font_size || 36
        this.hide()
        var self = this;
        this.show(function(){
        //cutil.unlock_ui()
            var toast_panel = self.rootUINode.getChildByName("toast_panel");
            toast_panel.setPositionPercent(toast_pos);
            toast_panel.setContentSize(toast_size);
            var toast_label = ccui.helper.seekWidgetByName(toast_panel, "toast_label");
            toast_label.setString(content);
            toast_label.setFontSize(font_size)
            // toast_panel.runAction(cc.Sequence.create(cc.DelayTime.create(toast_time), cc.FadeOut.create(0.5), cc.CallFunc.create(function(){ self.hide() })));
            toast_panel.runAction(cc.Sequence.create(
                cc.Spawn.create(cc.MoveBy.create(toast_time, cc.p(0, 200)),
                cc.FadeOut.create(toast_time) ),
                cc.CallFunc.create(function(){ self.hide() })
            ));
        });
    }
});