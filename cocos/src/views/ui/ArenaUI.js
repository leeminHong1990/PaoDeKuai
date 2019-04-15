// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")

var ArenaUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/ArenaUI.json";
    },

    initUI: function () {
        var bg_img = ccui.helper.seekWidgetByName(this.rootUINode, "bg_img");
        var bg_img_content_size = bg_img.getContentSize();
        var scale = cc.winSize.width / bg_img_content_size.width;
        if (cc.winSize.height / bg_img_content_size.height > scale) {
            scale = cc.winSize.height / bg_img_content_size.height;
        }
        bg_img.setScale(scale);

        this.arena_panel = this.rootUINode.getChildByName("arena_panel");
        this.arena_panel.getChildByName("back_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.runScene(new GameHallScene());
            }
        });

        this.arena_panel.getChildByName("rank_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.arenarank_ui.show();
            }
        });

        this.arena_panel.getChildByName("shop_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.webview_ui.show_by_info(switches.PHP_SERVER_URL+ "/mygood/display_page");
            }
        });

        this.init_artena_menu();
        this.init_money_panel();
    },

    //
    update_free_times: function (result) {
        var player = h1global.entityManager.player();
        var timesList = player.getLocalSportTimesList();
        for (var i = 0, len = timesList.length; i < len; i++) {
            result[(i + 1).toString()]["free"] = timesList[i];
        }
        return result;
    },

    init_money_panel: function () {
        var money_panel = ccui.helper.seekWidgetByName(this.rootUINode, "money_panel");
        var diamond_label = ccui.helper.seekWidgetByName(this.rootUINode, "diamond_label");
        diamond_label.setString("--");

        var moka_label = ccui.helper.seekWidgetByName(this.rootUINode, "moka_label");
        moka_label.setString("--");

        var info_dict = eval('(' + cc.sys.localStorage.getItem("INFO_JSON") + ')');

        function update_diamonds() {
            cutil.get_user_info("wx_" + info_dict["unionid"], function (content) {
                if (content[0] !== '{') {
                    return;
                }
                var info = eval('(' + content + ')');
                diamond_label.setString(info["diamond"].toString());
            });
        }

        function update_cards() {
            cutil.get_user_info("wx_" + info_dict["unionid"], function (content) {
                if (content[0] !== '{') {
                    return;
                }
                var info = eval('(' + content + ')');
                moka_label.setString(info["card"].toString());
            });
        }

        // 更新钻石
        var refresh_diamond_btn = money_panel.getChildByName("refresh_diamond_btn");
        refresh_diamond_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                if (onhookMgr && onhookMgr.refreshBtnTime) {
                    return
                }
                if (onhookMgr) {
                    onhookMgr.setRefreshBtnTime(5.0)
                }
                update_diamonds();
            }
        });

        // 更新摩卡
        var refresh_moka_btn = money_panel.getChildByName("refresh_moka_btn");
        refresh_moka_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                if (onhookMgr && onhookMgr.refreshBtnTime) {
                    return
                }
                if (onhookMgr) {
                    onhookMgr.setRefreshBtnTime(5.0)
                }
                update_cards();
            }
        });

        update_diamonds();
        update_cards();
    },

    init_artena_menu: function () {
        var self = this;
        cc.loader.loadJson("res/table/table_sports.json", function (err, results) {
            if (err) {
                cc.error("Failed to load res/table/table_sports.json");
                return;
            }

            var rankInfo = self.update_free_times(results);

            function onMenuCallback1() {
                var recordList = [
                    rankInfo["1"]
                ];
                self.update_signup_panel(recordList);
            }

            function onMenuCallback2() {
                var recordList = [
                    rankInfo["2"]
                ];
                self.update_signup_panel(recordList);
            }

            function onMenuCallback3() {
                var recordList = [
                    {
                        "consume": "wait"
                    }
                ];
                self.set_no_arena(recordList);
            }

            var item1 = new cc.MenuItemImage("res/ui/ArenaUI/png_0.png", "res/ui/ArenaUI/png_0.png");
            var item2 = new cc.MenuItemImage("res/ui/ArenaUI/png_1.png", "res/ui/ArenaUI/png_1.png");
            var item3 = new cc.MenuItemImage("res/ui/ArenaUI/png_2.png", "res/ui/ArenaUI/png_2.png");
            //
            var menu = new RevolvingMenu();
            self.arena_panel.addChild(menu);
            menu.addMenuItem(item1, onMenuCallback1);
            menu.addMenuItem(item2, onMenuCallback2);
            menu.addMenuItem(item3, onMenuCallback3);
            menu.setPosition(self.arena_panel.getContentSize().width * 0.5, self.arena_panel.getContentSize().height * 0.75);

            // 初始化
            var recordList = [
                rankInfo["1"]
            ];
            self.update_signup_panel(recordList);

        });
    },

    update_signup_panel: function (recordList) {
        var self = this;

        if (recordList) {
            recordList = recordList.concat([]);
        }

        var signup_scroll = this.arena_panel.getChildByName("signup_scroll");

        function update_item_func(curItem, curInfo, idx) {

            curItem.setBackGroundImage("res/ui/ArenaUI/panel_bg.png", ccui.Widget.LOCAL_TEXTURE);
            self.set_panel_within_state(curItem, true);

            var reward_img = curItem.getChildByName("reward_img");
            reward_img.loadTexture("res/ui/ArenaUI/game_title_img" + (curInfo["type"] - 1).toString() + ".png");

            var arena_title_img = curItem.getChildByName("arena_title_img");
            arena_title_img.loadTexture("res/ui/ArenaUI/game_txt_img" + (curInfo["type"] - 1).toString() + ".png");
            arena_title_img.ignoreContentAdaptWithSize(true);


            var time_label = curItem.getChildByName("time_label");
            time_label.setString(self.update_time_info(curInfo["type"], curInfo["time"]));

            var sign_up_btn = curItem.getChildByName("sign_up_btn");
            var free_sign_up_btn = curItem.getChildByName("free_sign_up_btn");
            var wait_btn = curItem.getChildByName("wait_btn");
            var sporting_btn = curItem.getChildByName("sporting_btn");
            var player = h1global.entityManager.player();
            var surplusTimes = player.getSurplusTimes();
            cc.log("surplusTimes 111111111111 :", surplusTimes);
            if (surplusTimes > 0 && curInfo["type"] === 2) {
                sporting_btn.setVisible(true);
                free_sign_up_btn.setVisible(false);
                sign_up_btn.setVisible(false);
                wait_btn.setVisible(false);
            } else {
                sporting_btn.setVisible(false);
                if (self.update_is_start(curInfo["time"])) {
                    if (curInfo["free"] > 0) {
                        free_sign_up_btn.setVisible(true);
                        sign_up_btn.setVisible(false);
                    } else {
                        free_sign_up_btn.setVisible(false);
                        sign_up_btn.setVisible(true);
                    }
                    wait_btn.setVisible(false);
                } else {
                    free_sign_up_btn.setVisible(false);
                    sign_up_btn.setVisible(false);
                    wait_btn.setVisible(true);
                }
            }

            // 开始比赛（无消耗）
            free_sign_up_btn.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    h1global.curUIMgr.arenatip_ui.show_ui(curInfo["type"],curInfo["id"]);
                }
            });
            // 开始比赛（消耗）
            sign_up_btn.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    h1global.curUIMgr.arenatip_ui.show_ui(curInfo["type"],curInfo["id"]);
                }
            });

            // 等待开启
            wait_btn.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    h1global.globalUIMgr.info_ui.show_by_info("未到赛事开启时间！");
                }
            });

            // 继续比赛
            sporting_btn.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    h1global.curUIMgr.arenatip_ui.show_ui(3,curInfo["id"]);
                }
            });
            curItem.setTouchEnabled(true);
            curItem.addTouchEventListener(function (sender, eventType) {
                if (eventType === ccui.Widget.TOUCH_ENDED) {
                    h1global.curUIMgr.arenarule_ui.show_by_info(curInfo);
                }
            });
        }

        UICommonWidget.update_scroll_items(signup_scroll, recordList, update_item_func);
    },

    update_consume_info: function (sign_up_btn, game_type) {
        var diamond_consume_img = sign_up_btn.getChildByName("diamond_consume_img");
        var diamond_consume_label = sign_up_btn.getChildByName("diamond_consume_label");
        var info_label = sign_up_btn.getChildByName("info_label");
        var moka_consume_img = sign_up_btn.getChildByName("moka_consume_img");
        var moka_consume_label = sign_up_btn.getChildByName("moka_consume_label");
        if (game_type === 0) {
            info_label.setVisible(false);
            moka_consume_img.setVisible(false);
            moka_consume_label.setVisible(false);
            diamond_consume_img.setPositionX(70);
            diamond_consume_label.setPositionX(95);
        }
    },

    set_no_arena: function (recordList) {
        var self = this;
        if (recordList) {
            recordList = recordList.concat([]);
        }
        var signup_scroll = this.arena_panel.getChildByName("signup_scroll");

        function update_item_func(curItem, curInfo, idx) {
            curItem.setBackGroundImage("res/ui/ArenaUI/expect_img.png", ccui.Widget.LOCAL_TEXTURE);
            self.set_panel_within_state(curItem, false);
            curItem.setTouchEnabled(false);
        }

        UICommonWidget.update_scroll_items(signup_scroll, recordList, update_item_func);
    },

    set_panel_within_state: function (panel, state) {
        if (!panel) {
            return
        }
        var items = panel.getChildren();
        for (var i = 0; i < items.length; i++) {
            items[i].setVisible(state);
        }
    },

    update_time_info: function (type, time) {
        if (!time || Object.keys.length !== 1) {
            return;
        }
        var string = "";
        for (var x in time) {
            if (type === 1) {
                string = x.toString() + "（周六除外）";
            } else if (type === 2) {
                string = x.toString() + "（周六）";
            }
        }
        return string;
    },


    update_is_start: function (time) {
        if (!time || Object.keys.length !== 1) {
            return;
        }
        var date = new Date();
        var day = date.getDay();
        var hours = date.getHours().toString();
        var minutes = date.getMinutes().toString();
        var seconds = date.getSeconds().toString();
        hours = hours.length === 1 ? "0" + hours : hours;
        minutes = minutes.length === 1 ? "0" + minutes : minutes;
        seconds = seconds.length === 1 ? "0" + seconds : seconds;
        var now_time = parseInt(hours + minutes + seconds);
        for (var x in time) {
            if (time[x].indexOf(day) !== -1) {
                var str = x.split(/[:-]/);
                cc.log(str);
                var time1 = parseInt(str[0] + str[1] + str[2]);
                var time2 = parseInt(str[3] + str[4] + str[5]);
                if (now_time > time1 && now_time < time2) {
                    return true;
                }
            }
        }
        return false;
    }


});