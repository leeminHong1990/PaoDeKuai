// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")

var GameHallUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/GameHallUI.json";
        this.ISPDKI = false;    //true: 不显示比赛场  false: 显示比赛场
    },

    initUI: function () {
        var bg_img = ccui.helper.seekWidgetByName(this.rootUINode, "bg_img_1");
        var bg_img_content_size = bg_img.getContentSize();
        var scale = cc.winSize.width / bg_img_content_size.width;
        if (cc.winSize.height / bg_img_content_size.height > scale) {
            scale = cc.winSize.height / bg_img_content_size.height;
        }
        bg_img.setScale(scale);
        cc.director.getScheduler().setTimeScale(1); //设置动画的速率为正常倍数，防止回看重连回来速率增加问题。
        this.notice_panel = ccui.helper.seekWidgetByName(this.rootUINode, "notice_panel");

        this.init_character_panel();
        this.init_function_panel();
        this.init_game_panel();
        this.init_centre_panel();
        this.init_advertisement_panel();
        this.init_notice();
    },

    init_character_panel: function () {
        cc.log(cc.sys.localStorage.getItem("INFO_JSON"));
        var character_panel = ccui.helper.seekWidgetByName(this.rootUINode, "character_panel");
        var info_dict = eval('(' + cc.sys.localStorage.getItem("INFO_JSON") + ')');
        cc.log(info_dict["headimgurl"]);
        var name_label = character_panel.getChildByName("name_label");
        cc.log(info_dict["nickname"]);
        name_label.setString(info_dict["nickname"]);
        var id_label = ccui.helper.seekWidgetByName(this.rootUINode, "id_label");
        cc.log(info_dict["user_id"]);
        id_label.setString("ID:" + info_dict["user_id"]);

        var frame_img = ccui.helper.seekWidgetByName(character_panel, "frame_img");
        character_panel.reorderChild(frame_img, 1);
        frame_img.addTouchEventListener(function (sender, eventType) {
            h1global.curUIMgr.playerinfo_ui.show();
        });
        frame_img.setTouchEnabled(true);
        cutil.loadPortraitTexture(info_dict["headimgurl"], function (img) {
            if (h1global.curUIMgr.gamehall_ui && h1global.curUIMgr.gamehall_ui.is_show) {
                h1global.curUIMgr.gamehall_ui.rootUINode.getChildByName("character_panel").getChildByName("portrait_sprite").removeFromParent();
                var portrait_sprite = new cc.Sprite(img);
                portrait_sprite.setScale(84 / portrait_sprite.getContentSize().width);
                portrait_sprite.x = character_panel.getContentSize().width * 0.134;
                portrait_sprite.y = character_panel.getContentSize().height * 0.5;
                h1global.curUIMgr.gamehall_ui.rootUINode.getChildByName("character_panel").addChild(portrait_sprite);
            }
        });

        character_panel.getChildByName("authentication_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.namecertification_ui.IsNeedshow();
                //h1global.globalUIMgr.info_ui.show_by_info("暂未开放！", cc.size(300, 200));
            }
        });


        // var img = jsb.reflection.callStaticMethod(switches.package_name + "/AppActivity", "downloadAndStoreFileSync", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", "http:\/\/wx.qlogo.cn\/mmopen\/Q3auHgzwzM6zHFzbk0YyibNTMxxibJ2yhg2eq0sIBOgFHCKvSBsibkm2pjYVcwgjwsJlI4yrJvWzXBYHRohiced8tQ\/0", h1global.entityManager.player().uuid.toString() + ".png");
        // cc.log("##############################################")
        // cc.log(img)
        // if(h1global.curUIMgr.gamehall_ui && h1global.curUIMgr.gamehall_ui.is_show){
        // 	// cc.log(err, img)
        // 	h1global.curUIMgr.gamehall_ui.rootUINode.getChildByName("character_panel").getChildByName("portrait_sprite").removeFromParent();
        // 	// if((cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) || (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative)){
        // 	// 	cc.textureCache.addImage(img);
        // 	// 	cc.spriteFrameCache.addSpriteFrames(img);
        // 	// }
        // 	var portrait_sprite  = new cc.Sprite(img);
        // 	portrait_sprite.setScale(80/750);
        // 	portrait_sprite.x = 80;
        // 	portrait_sprite.y = 75;
        // 	h1global.curUIMgr.gamehall_ui.rootUINode.getChildByName("character_panel").addChild(portrait_sprite);
        // }
    },

    init_centre_panel: function () {
        var centre_panel = ccui.helper.seekWidgetByName(this.rootUINode, "centre_panel");
        var diamond_panel = centre_panel.getChildByName("diamond_panel");
        var diamond_label = ccui.helper.seekWidgetByName(this.rootUINode, "diamond_label");
        diamond_label.setString("--");

        var info_dict = eval('(' + cc.sys.localStorage.getItem("INFO_JSON") + ')');

        function update_card_diamond() {
            cutil.get_user_info("wx_" + info_dict["unionid"], function (content) {
                if (content[0] !== '{') {
                    return;
                }
                var info = eval('(' + content + ')');
                diamond_label.setString(info["diamond"].toString());
            });
        }

        var refresh_btn = diamond_panel.getChildByName("refresh_btn");
        refresh_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                if (onhookMgr && onhookMgr.refreshBtnTime) {
                    return
                }
                if (onhookMgr) {
                    onhookMgr.setRefreshBtnTime(5.0)
                }
                // refresh function
                cc.log("refresh_btn");
                update_card_diamond()
            }
        });
        update_card_diamond();

        this.update_card_diamond_visible();

        centre_panel.getChildByName("signin_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.sign_ui.reqSignInfo();
                // h1global.globalUIMgr.info_ui.show_by_info("暂未开放！", cc.size(300, 200));
            }
        });
    },

    update_card_diamond: function () {
        var centre_panel = this.rootUINode.getChildByName("centre_panel");
        var diamond_panel = centre_panel.getChildByName("diamond_panel");
        var diamond_label = diamond_panel.getChildByName("diamond_label");

        var info_dict = eval('(' + cc.sys.localStorage.getItem("INFO_JSON") + ')');

        cutil.get_user_info("wx_" + info_dict["unionid"], function (content) {
            if (content[0] !== '{') {
                return;
            }
            var info = eval('(' + content + ')');
            diamond_label.setString(info["diamond"].toString());
        });
    },

    update_card_diamond_visible: function () {
        var diamond_panel = ccui.helper.seekWidgetByName(this.rootUINode, "diamond_panel");

        var diamond_img = diamond_panel.getChildByName("diamond_img");
        var diamond_bg_img = diamond_panel.getChildByName("diamond_bg_img");
        var diamond_label = diamond_panel.getChildByName("diamond_label");

        diamond_img.setVisible(true);
        diamond_bg_img.setVisible(true);
        diamond_label.setVisible(true);
        // if(switches.currency_mode == 1){
        //     card_img.setVisible(false);
        //     card_bg_img.setVisible(false);
        //     line_img_1.setVisible(false);
        // }else if(switches.currency_mode == 2){
        //     card_img.setPositionX(card_img.getPositionY() + 50);
        //     card_bg_img.setPositionX(card_bg_img.getPositionY() + 50);
        //     line_img_1.setVisible(false);
        //     diamond_img.setVisible(false);
        //     diamond_bg_img.setVisible(false);
        //     diamond_label.setVisible(false);
        // }
    },

    update_roomcard: function (cards) {
        // var character_panel = ccui.helper.seekWidgetByName(this.rootUINode, "character_panel");
        // var roomcard_label = character_panel.getChildByName("roomcard_label");
        // roomcard_label.setString("房卡:" + cards.toString() + "張");
    },

    init_function_panel: function () {
        var function_panel = ccui.helper.seekWidgetByName(this.rootUINode, "function_panel");
        if ((cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) && switches.appstore_check === true) {
            // if (switches.appstore_check === true) {
            function_panel.getChildByName("shopping_btn").setPositionX(function_panel.getContentSize().width * 0.1);
            function_panel.getChildByName("record_btn").setPositionX(function_panel.getContentSize().width * 0.35);
            function_panel.getChildByName("config_btn").setPositionX(function_panel.getContentSize().width * 0.65);
            function_panel.getChildByName("activity_btn").setPositionX(function_panel.getContentSize().width * 0.9);
            function_panel.getChildByName("connection_btn").setVisible(false);
            function_panel.getChildByName("leaderboard_btn").setVisible(false);
            function_panel.getChildByName("share_btn").setVisible(false);
            this.rootUINode.getChildByName("guide_btn").setVisible(false);
        } else {
            function_panel.getChildByName("connection_btn").setVisible(true);
            function_panel.getChildByName("share_btn").setVisible(true);
            function_panel.getChildByName("leaderboard_btn").setVisible(true);
            this.rootUINode.getChildByName("guide_btn").setVisible(true);
            this.rootUINode.getChildByName("guide_btn").addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    h1global.curUIMgr.novicehelp_ui.show();
                }
            });
        }

        // if (typeof switchesnin1 !== "undefined" && switchesnin1.entryPathList.length === 1) {
        //     function_panel.removeFromParent();
        //     this.rootUINode.addChild((new HallFunctionComponent()).createComponentNode());
        //     return;
        // }
        function_panel.getChildByName("config_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.config_ui.show_by_info(const_val.GAMEHALL_SET);
            }
        });
        function_panel.getChildByName("connection_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.connection_ui.show();
            }
        });
        // if((cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) || (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative)){
        //     function_panel.getChildByName("connection_btn").addTouchEventListener(function(sender, eventType){
        //         if(eventType == ccui.Widget.TOUCH_ENDED){
        //             h1global.curUIMgr.feedback_ui.show();
        //         }
        //     });
        // } else {
        //     function_panel.getChildByName("connection_btn").loadTextureNormal("res/ui/GameHallUI/shop.png", ccui.Widget.LOCAL_TEXTURE);
        //     function_panel.getChildByName("connection_btn").addTouchEventListener(function(sender, eventType){
        //         if(eventType == ccui.Widget.TOUCH_ENDED){
        //             var info_json = cc.sys.localStorage.getItem("INFO_JSON");
        //             var info_dict = eval('(' + info_json + ')');
        //             if(info_dict["invite_code"]){
        //                 h1global.globalUIMgr.info_ui.show_by_info("请访问微信公众号搜索\r\n[" + switches.gzh_name + "]进行充值");
        //             } else {
        //                 h1global.curUIMgr.invitation_ui.show();
        //             }
        //         }
        //     });
        // }

        function_panel.getChildByName("leaderboard_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.leaderboard_ui.reqLeaderBoardInfo();
                //h1global.globalUIMgr.info_ui.show_by_info("暂未开放！", cc.size(300, 200));
            }
        });
        function_panel.getChildByName("record_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.record_ui.show();
            }
        });

        var share_title = "跑得快";
        var share_desc = "全民都在跑得快，赶紧来玩吧！欢迎加入我们！";

        function_panel.getChildByName("share_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                if ((cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) || (cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative)) {
                    h1global.curUIMgr.wxshare_ui.show();
                } else {
                    wx.onMenuShareAppMessage({
                        title: share_title, // 分享标题
                        desc: share_desc, // 分享描述
                        link: switches.h5entrylink, // 分享链接
                        imgUrl: '', // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            cc.log("ShareAppMessage Success!");
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            cc.log("ShareAppMessage Cancel!");
                        },
                        fail: function () {
                            cc.log("ShareAppMessage Fail")
                        },
                    });
                    h1global.globalUIMgr.info_ui.show_by_info("请点击微信右上角菜单进行分享");
                }
            }
        });
        function_panel.getChildByName("shopping_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                if ((cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) && switches.appstore_check == true) {
                    h1global.curUIMgr.shop_ui.show();
                } else {
                    h1global.globalUIMgr.info_ui.show_by_info("请访问微信公众号搜索\r\n【" + switchesnin1.gzh_name + "】了解详情");
                }
            }
        });
        function_panel.getChildByName("activity_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.activities_ui.show();
                // h1global.globalUIMgr.info_ui.show_by_info("暂未开放！", cc.size(300, 200));
            }
        });

        // function_panel.getChildByName("exit_btn").addTouchEventListener(function(sender, eventType){
        // 	if(eventType == ccui.Widget.TOUCH_ENDED){
        // 		cutil.lock_ui();
        // 		h1global.entityManager.player().logout();
        // 	}
        // });
    },
    update_trophy_animation: function () {
        var isAppStoreCheck = false;
        if ((cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) && switches.appstore_check === true) {
            isAppStoreCheck = true;
        } else {
            isAppStoreCheck = false;
        }
        if (!isAppStoreCheck) {

            //  奖杯特效II
            cc.log("update_trophy_animation");
            var game_panel = ccui.helper.seekWidgetByName(this.rootUINode, "game_panel");
            UICommonWidget.load_effect_plist("TrophyUI");
            var action_trophy_sprite = cc.Sprite.create();
            action_trophy_sprite.setPosition(cc.p(48, 55));
            action_trophy_sprite.runAction(
                cc.spawn(
                    UICommonWidget.create_effect_action({"FRAMENUM": 14, "TIME": 1.4, "NAME": "TrophyUI/"}),
                    cc.sequence(
                        cc.moveBy(0.75, cc.p(0, 2.5)),
                        cc.moveBy(1.5, cc.p(0, -5)),
                        cc.moveBy(0.75, cc.p(0, 2.5))
                    )
                ).repeatForever()
            );
            game_panel.getChildByName("trade_union_btn").addChild(action_trophy_sprite);

            if (this.ISPDKI) {
                //  奖杯特效I
                cc.log("update_trophy_animation");
                var game_panel = ccui.helper.seekWidgetByName(this.rootUINode, "game_panel");
                UICommonWidget.load_effect_plist("Trophy");
                var action_trophy_sprite = cc.Sprite.create();
                action_trophy_sprite.setPosition(game_panel.getContentSize().width * 0.685, game_panel.getContentSize().height * 0.275);
                action_trophy_sprite.runAction(
                    cc.spawn(
                        UICommonWidget.create_effect_action({"FRAMENUM": 30, "TIME": 3, "NAME": "Trophy/"}),
                        cc.sequence(
                            cc.moveBy(0.75, cc.p(0, 2.5)),
                            cc.moveBy(1.5, cc.p(0, -5)),
                            cc.moveBy(0.75, cc.p(0, 2.5))
                        )
                    ).repeatForever()
                );
                game_panel.addChild(action_trophy_sprite);
            }

            // 皇冠特效
            var game_panel = ccui.helper.seekWidgetByName(this.rootUINode, "game_panel");
            UICommonWidget.load_effect_plist("CrownUI");
            var action_crown_sprite = cc.Sprite.create();
            action_crown_sprite.setPosition(cc.p(38, 50));
            action_crown_sprite.runAction(
                cc.spawn(
                    UICommonWidget.create_effect_action({"FRAMENUM": 22, "TIME": 2.2, "NAME": "CrownUI/"}),
                    cc.sequence(
                        cc.moveBy(0.75, cc.p(0, 2.5)),
                        cc.moveBy(1.5, cc.p(0, -5)),
                        cc.moveBy(0.75, cc.p(0, 2.5))
                    )
                ).repeatForever()
            );
            game_panel.getChildByName("arena_btn").addChild(action_crown_sprite);
        }
    },

    init_effect_dice: function () {
        var game_panel = ccui.helper.seekWidgetByName(this.rootUINode, "game_panel");

        // 骰子动画
        var createroom_btn = ccui.helper.seekWidgetByName(this.rootUINode, "game_panel").getChildByName("createroom_btn");
        var effect_dice_img_1 = new ccui.ImageView();
        effect_dice_img_1.loadTexture("res/ui/GameHallUI/effect_dice1.png");
        createroom_btn.addChild(effect_dice_img_1);
        effect_dice_img_1.setPosition(cc.p(75, 90));
        effect_dice_img_1.setAnchorPoint(cc.p(0.8, 0.28));
        var effect_dice_active_1 = cc.sequence(
            cc.spawn(
                cc.moveBy(1.5, cc.p(-8, -7)),
                cc.scaleTo(1.5, 0.9)
            ),
            cc.spawn(
                cc.moveBy(1.5, cc.p(8, 7)),
                cc.scaleTo(1.5, 1)
            )
            // cc.delayTime(0.)
        ).repeatForever();
        effect_dice_img_1.runAction(effect_dice_active_1);

        var effect_dice_img_2 = new ccui.ImageView();
        effect_dice_img_2.loadTexture("res/ui/GameHallUI/effect_dice2.png");
        createroom_btn.addChild(effect_dice_img_2);
        effect_dice_img_2.setPosition(cc.p(73, 82));
        effect_dice_img_2.setAnchorPoint(cc.p(0.1, 0.9));
        var effect_dice_active_2 = cc.sequence(
            cc.spawn(
                cc.moveBy(1.5, cc.p(1, 15)),
                cc.scaleTo(1.5, 1.07)
            ),
            cc.spawn(
                cc.moveBy(1.5, cc.p(-1, -15)),
                cc.scaleTo(1.5, 1)
            )
            //  cc.delayTime(0.4)
        ).repeatForever();
        effect_dice_img_2.runAction(effect_dice_active_2);

        // 骰子流光动画
        UICommonWidget.load_effect_plist("effectdice");
        var effectdice = cc.Sprite.create();
        effectdice.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        effectdice.setPosition(cc.p(85, 82));
        effectdice.runAction(cc.sequence(
            UICommonWidget.create_effect_action({"FRAMENUM": 30, "TIME": 3, "NAME": "EffectDiceUI/"})
        ).repeatForever());
        createroom_btn.addChild(effectdice);

    },

    init_effect_btn: function () {
        var game_panel = ccui.helper.seekWidgetByName(this.rootUINode, "game_panel");
        var createroom_btn = game_panel.getChildByName("createroom_btn");
        var joinroom_btn = game_panel.getChildByName("joinroom_btn");
        // 按钮流光1
        UICommonWidget.load_effect_plist("effectbtn");
        var effectbtn1 = cc.Sprite.create();
        effectbtn1.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        effectbtn1.setColor(cc.color(255, 158, 245));
        effectbtn1.setPosition(createroom_btn.getContentSize().width * 0.5, createroom_btn.getContentSize().height * 0.5);
        effectbtn1.runAction(cc.sequence(
            UICommonWidget.create_effect_action({"FRAMENUM": 16, "TIME": 1.5, "NAME": "EffectBtn/"}),
            cc.delayTime(3.0)
        ).repeatForever());
        createroom_btn.addChild(effectbtn1);

        // 按钮流光2
        UICommonWidget.load_effect_plist("effectbtn");
        var effectbtn2 = cc.Sprite.create();
        effectbtn2.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        effectbtn2.setColor(cc.color(158, 255, 183));
        effectbtn2.setPosition(joinroom_btn.getContentSize().width * 0.5, joinroom_btn.getContentSize().height * 0.5);
        effectbtn2.runAction(cc.sequence(
            cc.delayTime(1.0),
            UICommonWidget.create_effect_action({"FRAMENUM": 16, "TIME": 1.5, "NAME": "EffectBtn/"}),
            cc.delayTime(2.0)
        ).repeatForever());
        joinroom_btn.addChild(effectbtn2);


        var isAppStoreCheck = false;
        if ((cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) && switches.appstore_check === true) {
            isAppStoreCheck = true;
        } else {
            isAppStoreCheck = false;
        }

        if (!isAppStoreCheck) {

            if (this.ISPDKI) {
                UICommonWidget.load_effect_plist("effectbtn");
                var effectbtn3 = cc.Sprite.create();
                effectbtn3.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
                effectbtn3.setColor(cc.color(158, 217, 255));
                effectbtn3.setPosition(game_panel.getContentSize().width * 0.79, game_panel.getContentSize().height * 0.27);
                effectbtn3.runAction(cc.sequence(
                    cc.delayTime(2.0),
                    UICommonWidget.create_effect_action({"FRAMENUM": 16, "TIME": 1.5, "NAME": "EffectBtn/"}),
                    cc.delayTime(1.0)
                ).repeatForever());
                game_panel.addChild(effectbtn3);
            } else {
                //按钮流光3
                UICommonWidget.load_effect_plist("EffectStreamerUI");
                var effectbtn3 = cc.Sprite.create();
                effectbtn3.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
                // effectbtn3.setColor(cc.color(158, 217, 255));
                effectbtn3.setPosition(game_panel.getContentSize().width * 0.79, game_panel.getContentSize().height * 0.27);
                effectbtn3.runAction(cc.sequence(
                    cc.delayTime(2.0),
                    UICommonWidget.create_effect_action({"FRAMENUM": 40, "TIME": 1.5, "NAME": "EffectStreamerUI/"}),
                    cc.delayTime(1.0)
                ).repeatForever());
                game_panel.addChild(effectbtn3);
            }
        }
    },

    init_effect_game: function () {
        // 牌特效
        var game_panel = ccui.helper.seekWidgetByName(this.rootUINode, "game_panel");
        UICommonWidget.load_effect_plist("effectcard");
        var effectcard = cc.Sprite.create();
        effectcard.setPosition(cc.p(82, 79));
        effectcard.runAction(cc.sequence(
            UICommonWidget.create_effect_action({"FRAMENUM": 29, "TIME": 2.5, "NAME": "EffevtCardUI/"}),
            cc.delayTime(0.5)
            // UICommonWidget.create_effect_action({"FRAMENUM": 29, "TIME": 0.5, "NAME": "EffevtCardUI/", "INFO":1})
        ).repeatForever());
        game_panel.getChildByName("joinroom_btn").addChild(effectcard);
    },

    init_effect_mascot: function () {
        var game_panel = this.rootUINode.getChildByName("game_panel");
        var size = game_panel.getContentSize();
        // var spineBoy = new sp.SkeletonAnimation(res.mascot_json, res.mascot_atlas);
        // game_panel.addChild(spineBoy, 4);
        // spineBoy.setAnchorPoint(0.5, 0.5);
        // spineBoy.setPosition(cc.p(size.width * 0.50, size.height * 0.1));
        // spineBoy.setAnimation(0, 'niu', true);
        // spineBoy.setScale(1.0);

        ccs.armatureDataManager.addArmatureFileInfo(res.mascot_1_json);
        var wolfAnimation = new ccs.Armature("mascot");
        wolfAnimation.setScale(1.0);
        wolfAnimation.setPosition(cc.p(size.width * 0.42, size.height * 0.1));
        //wolfAnimation.getAnimation().playWithIndex(0);
        wolfAnimation.animation.play("initAction");
        game_panel.addChild(wolfAnimation);

    },

    init_effect_fireworks: function () {

        var game_panel = ccui.helper.seekWidgetByName(this.rootUINode, "game_panel");

        UICommonWidget.load_effect_plist("EffectFireworksUI");
        var effectFirework2 = cc.Sprite.create();
        effectFirework2.setBlendFunc(cc.ONE, cc.ONE_MINUS_SRC_ALPHA);
        effectFirework2.setScale(2);
        effectFirework2.setPosition(game_panel.getContentSize().width * 0.38, game_panel.getContentSize().height * 0.94);
        effectFirework2.runAction(cc.sequence(
            UICommonWidget.create_effect_action({"FRAMENUM": 36, "TIME": 2.4, "NAME": "EffectFireworksUI/"})
        ).repeatForever());
        game_panel.addChild(effectFirework2, -const_val.globalUIMgrZOrder);

        game_panel.runAction(cc.sequence(cc.delayTime(0.8), cc.callFunc(function () {
            UICommonWidget.load_effect_plist("EffectFireworksUI");
            var effectFirework1 = cc.Sprite.create();
            effectFirework1.setScale(1.2);
            effectFirework1.setBlendFunc(cc.ONE, cc.ONE_MINUS_SRC_ALPHA);
            effectFirework1.setPosition(game_panel.getContentSize().width * 0.63, game_panel.getContentSize().height * 0.85);
            effectFirework1.runAction(cc.sequence(
                UICommonWidget.create_effect_action({"FRAMENUM": 36, "TIME": 2.4, "NAME": "EffectFireworksUI/"})
            ).repeatForever());
            game_panel.addChild(effectFirework1, -const_val.globalUIMgrZOrder);
        })));
    },

    init_game_panel: function () {
        var game_panel = ccui.helper.seekWidgetByName(this.rootUINode, "game_panel");
        var createroom_btn = game_panel.getChildByName("createroom_btn");
        function createroom_btn_event(sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.createroom_ui.show();
                let player = h1global.entityManager.player();
                if (player) {
                    player.upLocationInfo();
                } else {
                    cc.log('player undefined');
                }
            }
        }
        createroom_btn.addTouchEventListener(createroom_btn_event);

        var joinroom_btn = game_panel.getChildByName("joinroom_btn");
        function joinroom_btn_event(sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.joinroom_ui.show();
                let player = h1global.entityManager.player();
                if (player) {
                    player.upLocationInfo();
                } else {
                    cc.log('player undefined');
                }
            }
        }
        joinroom_btn.addTouchEventListener(joinroom_btn_event);

        //II中的公会和竞技场   勿删
        var trade_union_btn = game_panel.getChildByName("trade_union_btn");
        function trade_union_event(sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.unionhall_ui.show();
            }
        }
        trade_union_btn.addTouchEventListener(trade_union_event);
        // 比赛场
        var arena_btn = game_panel.getChildByName("arena_btn");
        function arena_btn_event(sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.runScene(new ArenaScene());
            }
        }
        arena_btn.addTouchEventListener(arena_btn_event);

        // I中的公会
        var trade_union_btn1 = new ccui.Button();
        game_panel.addChild(trade_union_btn1);
        trade_union_btn1.loadTextureNormal("res/ui/GameHallUI/union_btn.png");
        trade_union_btn1.setPosition(game_panel.getContentSize().width * 0.78, game_panel.getContentSize().height * 0.27);
        trade_union_btn1.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.unionhall_ui.show();
            }
        });
        if ((cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) && switches.appstore_check === true) {
            trade_union_btn1.setVisible(false);
            trade_union_btn.setVisible(false);
            arena_btn.setVisible(false);
        } else {
            trade_union_btn1.setVisible(this.ISPDKI);
            game_panel.getChildByName("trade_union_btn").setVisible(!this.ISPDKI);
            game_panel.getChildByName("arena_btn").setVisible(!this.ISPDKI);
        }

        this.init_effect_fireworks();
        this.update_trophy_animation();
        this.init_effect_game();
        this.init_effect_btn();
        this.init_effect_dice();
        this.init_effect_mascot();
    },

    /*	init_centre_panel:function(){
     return;
     var centre_panel = ccui.helper.seekWidgetByName(this.rootUINode, "centre_panel");
     // var signin_label = centre_panel.getChildByName("signin_label");
     this.update_signin_content(h1global.entityManager.player().signInNum);
     var signin_btn = centre_panel.getChildByName("signin_btn");
     signin_btn.addTouchEventListener(function(sender, eventType){
     if(eventType == ccui.Widget.TOUCH_ENDED){
     // h1global.globalUIMgr.info_ui.show_by_info("該功能尚未開啟！", cc.size(300, 200));
     h1global.entityManager.player().signIn();
     }
     });

     // var notice_label = centre_panel.getChildByName("notice_label");
     // var notice_xhr = cc.loader.getXMLHttpRequest();
     // notice_xhr.open("GET", "http://www.zhizunhongzhong.com/hzmgr/index.php/notice", true);
     // notice_xhr.onreadystatechange = function(){
     //      if(notice_xhr.readyState == 4 && notice_xhr.status == 200){
     //         notice_label.setString(notice_xhr.responseText);
     //     }
     // }
     // notice_xhr.send();
     },*/

    update_signin_content: function (signInNum) {
        return;
        var centre_panel = ccui.helper.seekWidgetByName(this.rootUINode, "centre_panel");
        var signin_label = centre_panel.getChildByName("signin_label");
        signin_label.setString("签到" + signInNum.toString() + "/" + const_val.SIGNIN_MAX.toString() + "天即可获得房卡");
    },

    init_advertisement_panel: function () {
        var isAppStoreCheck = false;
        var self = this;
        if ((cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) && switches.appstore_check === true) {
            isAppStoreCheck = true;
        } else {
            isAppStoreCheck = false;
        }
        var ad_panel = this.rootUINode.getChildByName("ad_panel");
        var flag_panel = ad_panel.getChildByName("flag_panel");
        flag_panel.setTouchEnabled(false);
        var advertisement_pageView = ad_panel.getChildByName("advertisement_pageview");
        for (var i = 0; i < 3; i++) {
            this.update_activity_banner(i);
            if (!isAppStoreCheck) {
                var advertisement_panel = advertisement_pageView.getChildByName("advertisement_panel" + i.toString());
                if (i === 0) {
                    advertisement_panel.addTouchEventListener(function (sender, eventType) {
                        if (eventType === ccui.Widget.TOUCH_ENDED) {
                            h1global.curUIMgr.connection_ui.show();
                        }
                    });
                } else {
                    advertisement_panel.addTouchEventListener(function (sender, eventType) {
                        if (eventType === ccui.Widget.TOUCH_ENDED) {
                            h1global.curUIMgr.activities_ui.show();
                        }
                    });
                }
            }
        }

        var index = 0;
        advertisement_pageView.runAction(cc.RepeatForever.create(cc.Sequence.create(
            cc.DelayTime.create(3.0),
            cc.CallFunc.create(function () {
                if (index === 0) {
                    index = 1;
                } else if (index === 1) {
                    index = 2;
                } else if (index === 2) {
                    index = 0;
                }
                advertisement_pageView.scrollToPage(index);
                self.update_ad_flag(index);
            })
        )));
    },

    update_activity_banner: function (index) {
        var ad_panel = this.rootUINode.getChildByName("ad_panel");
        var advertisement_pageView = ad_panel.getChildByName("advertisement_pageview");
        var advertisement_panel = advertisement_pageView.getChildByName("advertisement_panel" + index.toString());
        var advise_img = advertisement_panel.getChildByName("advise_img");
        cutil.loadRemoteTexture("http://mypdk.game918918.com/advertisement" + (index + 1).toString() + ".png", function (img) {
            advise_img.removeFromParent();
            var adv_sprite = new cc.Sprite(img);
            adv_sprite.x = advertisement_panel.getContentSize().width * 0.5;
            adv_sprite.y = advertisement_panel.getContentSize().height * 0.5;
            advertisement_panel.addChild(adv_sprite);
        }, "advertisement" + (index + 1).toString() + ".png");
    },

    update_ad_flag: function (index) {
        var ad_panel = this.rootUINode.getChildByName("ad_panel");
        for (var i = 0; i < 3; i++) {
            var flag_img = ad_panel.getChildByName("flag_panel").getChildByName("point_img_" + i.toString());
            if (index === i) {
                flag_img.loadTexture(res.ad_point_0);
            } else {
                flag_img.loadTexture(res.ad_point_1);
            }
        }
    },

    init_notice: function () {
        this.broadcast_panel = this.notice_panel.getChildByName("label_panel");
        this.broadcast_label = this.broadcast_panel.getChildByName("notice_label");
        this.show_broadcast("抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防上当受骗。适度游戏益脑，沉迷游戏伤身，合理安排时间，享受健康生活。", 3);
    },

    show_broadcast: function (content, times) {
        times = times || 10; // 播放次数，间隔10s
        this.notice_panel.stopAllActions();
        var self = this;

        function show_callback() {
            if (times > 1) {
                times = times - 1;
                self.runAction(cc.Sequence.create(
                    cc.DelayTime.create(10.0),
                    cc.CallFunc.create(function () {
                        self.show_by_content(content, show_callback);
                    })
                ))
            }
        }

        this.show_by_content(content, show_callback);
    },

    show_by_content: function (content, callback) {
        var self = this;
        self.notice_panel.setVisible(true);

        self.broadcast_label.ignoreContentAdaptWithSize(true);
        self.broadcast_label.setString(content);
        self.broadcast_label.setPositionX(0);
        self.broadcast_label.stopAllActions();
        if (self.broadcast_label.getContentSize().width <= self.broadcast_panel.getContentSize().width) {
            self.broadcast_label.runAction(cc.Sequence.create(
                cc.DelayTime.create(3.0),
                cc.CallFunc.create(function () {
                    self.notice_panel.setVisible(false);
                    if (callback) {
                        callback();
                    }
                })
            ));
        } else {
            var offset = self.broadcast_panel.getContentSize().width - self.broadcast_label.getContentSize().width;
            self.broadcast_label.runAction(cc.Sequence.create(
                cc.MoveTo.create(-offset * 0.01, cc.p(offset, self.broadcast_label.getPositionY())),
                cc.DelayTime.create(3.0),
                cc.CallFunc.create(function () {
                    self.notice_panel.setVisible(false);
                    if (callback) {
                        callback();
                    }
                })
            ));
        }
    }
});