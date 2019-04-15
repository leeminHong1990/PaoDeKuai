var LoginUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/LoginUI.json";
    },
    initUI: function () {
        // re-scale background image
        var bg_img = ccui.helper.seekWidgetByName(this.rootUINode, "bg_img");
        var bg_img_content_size = bg_img.getContentSize();
        var scale = cc.winSize.width / bg_img_content_size.width;
        if (cc.winSize.height / bg_img_content_size.height > scale) {
            scale = cc.winSize.height / bg_img_content_size.height;
        }
        bg_img.setScale(scale);

        // 测试，账号登录相关
        var account_panel = this.rootUINode.getChildByName("account_panel");
        if (switches.TEST_OPTION) {
            account_panel.setVisible(true);
        }

        var account_input_tf = ccui.helper.seekWidgetByName(account_panel, "account_input_tf");
        var password_input_tf = ccui.helper.seekWidgetByName(account_panel, "password_input_tf");

        var get_account_btn = ccui.helper.seekWidgetByName(account_panel, "get_account_btn");
        var self = this;

        var login_btn = ccui.helper.seekWidgetByName(account_panel, "login_btn");

        function login_btn_event(sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                cutil.lock_ui();
                var username = account_input_tf.getString();
                var password = password_input_tf.getString();
                cc.log("login, username = " + username + ", password = " + password);
                KBEngine.app.login(username, password, "test");
            }
        }
        login_btn.addTouchEventListener(login_btn_event);

        // 微信登录相关
        var weixin_login_btn = this.rootUINode.getChildByName("weixin_login_btn");
        weixin_login_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                sender.setVisible(false);
                var info_json = cc.sys.localStorage.getItem("INFO_JSON");
                if (info_json) {
                    var info_dict = eval('(' + info_json + ')');
                    if ((cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) || (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative)) {
                        var unionid = info_dict["unionid"];
                        KBEngine.app.login("wx_" + unionid, info_dict["password"], JSON.stringify({"userId":info_dict["user_id"], "sex":info_dict["sex"]}));
                    } else {
                        var unionid = info_dict["unionid"];
                        KBEngine.app.login("wx_" + unionid, info_dict["password"], JSON.stringify({"userId":info_dict["user_id"], "sex":info_dict["sex"]}));
                    }
                } else {
                    if ((cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative)) {
                        cc.log("This is Android Login");
                        jsb.reflection.callStaticMethod(switches.package_name + "/AppActivity", "callWechatLogin", "()V");
                    } else if ((cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative)) {
                        cc.log("This is iOS Login");
                        jsb.reflection.callStaticMethod("WechatOcBridge", "callWechatLogin");
                    } else {
                        // window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2cdf69ccdc8fd012&redirect_uri=http%3a%2f%2fwww.zhizunhongzhong.com%2fh1hz&response_type=code&scope=snsapi_userinfo&state=" + (new Date() - 0);
                        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + switches.h5appid + "&redirect_uri=" + encodeURIComponent(switches.h5entrylink) + "&response_type=code&scope=snsapi_userinfo&state=" + g_version + "#wechat_redirect";
                    }
                }
            }
        });
    }

});