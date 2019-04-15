// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var ShopUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/ShopUI.json";
    },
    initUI: function () {
        var self = this;
        var shop_panel = this.rootUINode.getChildByName("shop_panel");
        var return_btn = shop_panel.getChildByName("return_btn");

        return_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });

        var reward_panel_0 = shop_panel.getChildByName("reward_panel_0");
        reward_panel_0.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                //商品
                cutil.lock_ui();
                // cutil.get_pay_url(1);
                if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) {
                    var funcId = cutil.addFunc(function(result){
                        cutil.unlock_ui();
                        cc.log(result);
                        if (result == 'YES') {
                            h1global.curUIMgr.gamehall_ui.update_card_diamond();
                        }
                    });
                    cutil.lock_ui();
                    jsb.reflection.callStaticMethod("IAPOcBridge", "startPurchWithID:completeHandle:", "6_diamonds", funcId);
                }
            }
        });

        var reward_panel_1 = shop_panel.getChildByName("reward_panel_1");
        reward_panel_1.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                //商品
                cutil.lock_ui();
                // cutil.get_pay_url(1);
                if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) {
                    var funcId = cutil.addFunc(function(result){
                        cutil.unlock_ui();
                        cc.log(result);
                        if (result == 'YES') {
                            h1global.curUIMgr.gamehall_ui.update_card_diamond();
                        }
                    });
                    cutil.lock_ui();
                    jsb.reflection.callStaticMethod("IAPOcBridge", "startPurchWithID:completeHandle:", "18_diamonds", funcId);
                }
            }
        });

        var reward_panel_2 = shop_panel.getChildByName("reward_panel_2");
        reward_panel_2.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                //商品
                cutil.lock_ui();
                // cutil.get_pay_url(1);
                if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) {
                    var funcId = cutil.addFunc(function(result){
                        cutil.unlock_ui();
                        cc.log(result);
                        if (result == 'YES') {
                            h1global.curUIMgr.gamehall_ui.update_card_diamond();
                        }
                    });
                    cutil.lock_ui();
                    jsb.reflection.callStaticMethod("IAPOcBridge", "startPurchWithID:completeHandle:", "30_diamonds", funcId);
                }
            }
        });

        var reward_panel_3 = shop_panel.getChildByName("reward_panel_3");
        reward_panel_3.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                //商品
                cutil.lock_ui();
                // cutil.get_pay_url(1);
                if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) {
                    var funcId = cutil.addFunc(function(result){
                        cutil.unlock_ui();
                        cc.log(result);
                        if (result == 'YES') {
                            h1global.curUIMgr.gamehall_ui.update_card_diamond();
                        }
                    });
                    cutil.lock_ui();
                    jsb.reflection.callStaticMethod("IAPOcBridge", "startPurchWithID:completeHandle:", "40_diamonds", funcId);
                }
            }
        });

        var reward_panel_4 = shop_panel.getChildByName("reward_panel_4");
        reward_panel_4.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                //商品
                cutil.lock_ui();
                // cutil.get_pay_url(1);
                if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) {
                    var funcId = cutil.addFunc(function(result){
                        cutil.unlock_ui();
                        cc.log(result);
                        if (result == 'YES') {
                            h1global.curUIMgr.gamehall_ui.update_card_diamond();
                        }
                    });
                    cutil.lock_ui();
                    jsb.reflection.callStaticMethod("IAPOcBridge", "startPurchWithID:completeHandle:", "50_diamonds", funcId);
                }
            }
        });

        var reward_panel_5 = shop_panel.getChildByName("reward_panel_5");
        reward_panel_5.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                //商品
                cutil.lock_ui();
                // cutil.get_pay_url(1);
                if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) {
                    var funcId = cutil.addFunc(function(result){
                        cutil.unlock_ui();
                        cc.log(result);
                        if (result == 'YES') {
                            h1global.curUIMgr.gamehall_ui.update_card_diamond();
                        }
                    });
                    cutil.lock_ui();
                    jsb.reflection.callStaticMethod("IAPOcBridge", "startPurchWithID:completeHandle:", "68_diamond", funcId);
                }
            }
        });


    },

});