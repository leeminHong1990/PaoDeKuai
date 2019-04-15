var ConnectionUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/ConnectionUI.json";
    },

    initUI: function () {
        var self = this;
        var connection_panel = this.rootUINode.getChildByName("connection_panel");
        var return_btn = connection_panel.getChildByName("return_btn");

        return_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });
    },
});