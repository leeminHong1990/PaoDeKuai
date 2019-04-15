var WebViewUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/WebViewUI.json";
    },

    initUI: function () {
        var self = this;
        this.webview_panel = this.rootUINode.getChildByName("webview_panel");
        var return_btn = this.webview_panel.getChildByName("return_btn");

        return_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });
    },

    show_by_info: function (htmlName) {
        var self = this;
        this.show(function () {
            var bg_img = self.webview_panel.getChildByName("bg_img");
            var webView = new ccui.WebView();
            webView.setAnchorPoint(0.5, 0.5);
            webView.setPosition(cc.winSize.width * 0.5, cc.winSize.height * 0.42);
            webView.setContentSize(bg_img.getContentSize().width - 120, bg_img.getContentSize().height - 160);
            webView.loadURL(htmlName);
            webView.setScalesPageToFit(true);
            self.webview_panel.addChild(webView);
        })
    }
});