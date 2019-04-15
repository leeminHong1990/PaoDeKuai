var LeaderboardUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/LeaderboardUI.json";
    },

    initUI: function () {
        var self = this;
        // this.integral_btn_list =[];
        // this.integral_scroll_list =[];
        var leaderboard_panel = this.rootUINode.getChildByName("leaderboard_panel");
        var return_btn = leaderboard_panel.getChildByName("return_btn");

        return_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });

        // function play_btn_event(sender,eventType) {
        //     if(eventType ==ccui.Widget.TOUCH_ENDED ){
        //         for (var i = 0 ; i < self.integral_btn_list.length; i++){
        //             if (sender != self.integral_btn_list[i]){
        //                 self.integral_btn_list[i].setTouchEnabled(true);
        //                 self.integral_btn_list[i].setBright(true);
        //                 self.integral_scroll_list[i].setVisible(false);
        //             }else {
        //                 self.integral_btn_list[i].setTouchEnabled(false);
        //                 self.integral_btn_list[i].setBright(false);
        //                 self.integral_scroll_list[i].setVisible(true);
        //             }
        //         }
        //     }
        // }
        //
        // for (var i= 0; i < 2; i++ ){
        //     var integral_btn = leaderboard_panel.getChildByName("integral_btn_"+(i+1).toString());
        //     self.integral_btn_list.push(integral_btn);
        //     integral_btn.addTouchEventListener(play_btn_event);
        //
        //     var integral_scroll = leaderboard_panel.getChildByName("integral_scroll_"+(i+1).toString());
        //     self.integral_scroll_list.push(integral_scroll);
        // }
        // self.integral_btn_list[0].setTouchEnabled(false);
        // self.integral_btn_list[0].setBright(false);
        // self.integral_scroll_list[0].setVisible(true);
        var integral_btn = leaderboard_panel.getChildByName("integral_btn_1");
        integral_btn.setTouchEnabled(false);
        integral_btn.setBright(false);
    },

    reqLeaderBoardInfo:function () {
        var player = h1global.entityManager.player();
        player.reqRankingInfos();
    },

    show_info:function (info) {
        var self = this;
        this.info = info;
        this.show(function () {
            self.update_leaderboard_info();
        });
    },

    update_leaderboard_info:function () {
        var self = this;
        var player = h1global.entityManager.player();
        function update_func(curItem, curInfo, idx){
            let id_img = curItem.getChildByName("id_img");
            let id_label = curItem.getChildByName("id_label");
            if (idx <= 2){
                id_img.setVisible(true);
                id_label.setVisible(false);
                id_img.loadTexture("res/ui/LeaderboardUI/"+(idx+1).toString()+".png");
            }else {
                id_img.setVisible(false);
                id_label.setVisible(true);
                id_label.setString((idx+1).toString());
            }
            //var portrait_sprite = curItem.getChildByName("portrait_sprite");
            self.loadPortraitTexture(curInfo["head_icon"],curItem,curInfo["uuid"].toString() + ".png",idx);
            // cutil.loadPortraitTexture(curInfo["head_icon"], function(img){
            //     curItem.getChildByName("portrait_sprite").removeFromParent();
            //     var portrait_sprite  = new cc.Sprite(img);
            //     portrait_sprite.setName("portrait_sprite");
            //     portrait_sprite.setScale(84/portrait_sprite.getContentSize().width);
            //     portrait_sprite.x = curItem.getContentSize().width * 0.2353;
            //     portrait_sprite.y = curItem.getContentSize().height * 0.50;
            //     curItem.addChild(portrait_sprite);
            // });

            curItem.getChildByName("name_label").setString(curInfo["name"]);
            curItem.getChildByName("userid_label").setString("ID:" + curInfo["userid"].toDouble().toString());
            var head_box_img = ccui.helper.seekWidgetByName(curItem, "head_box_img");
            curItem.reorderChild(head_box_img, 1);

            curItem.getChildByName("integral_label").setString(curInfo["integral"]);

        }
        var leaderboard_panel = this.rootUINode.getChildByName("leaderboard_panel");
        var integral_scroll = leaderboard_panel.getChildByName("integral_scroll_1");
        UICommonWidget.update_scroll_items(integral_scroll,self.info, update_func);
    },

    loadPortraitTexture:function (url, curItem, filename,idx) {

        if (!url) {
            if (idx === 0){
                curItem.getChildByName("portrait_sprite").removeFromParent();
            }
            var portrait_sprite  = new cc.Sprite("res/ui/Default/defaultPortrait.png");
            portrait_sprite.setName("portrait_sprite");
            portrait_sprite.setScale(84/portrait_sprite.getContentSize().width);
            portrait_sprite.x = curItem.getContentSize().width * 0.2353;
            portrait_sprite.y = curItem.getContentSize().height * 0.50;
            curItem.addChild(portrait_sprite);
            return;
        }
        if (cutil.portraitCache[url]) {
            if (idx === 0){
                curItem.getChildByName("portrait_sprite").removeFromParent();
            }
            var portrait_sprite  = new cc.Sprite(cutil.portraitCache[url]);
            portrait_sprite.setName("portrait_sprite");
            portrait_sprite.setScale(84/portrait_sprite.getContentSize().width);
            portrait_sprite.x = curItem.getContentSize().width * 0.2353;
            portrait_sprite.y = curItem.getContentSize().height * 0.50;
            curItem.addChild(portrait_sprite);
            return;
        }
        var fid = cutil.addFunc(function (img) {
            cutil.portraitCache[url] = img;
            if (idx === 0){
                curItem.getChildByName("portrait_sprite").removeFromParent();
            }
            var portrait_sprite  = new cc.Sprite(img);
            portrait_sprite.setName("portrait_sprite");
            portrait_sprite.setScale(84/portrait_sprite.getContentSize().width);
            portrait_sprite.x = curItem.getContentSize().width * 0.2353;
            portrait_sprite.y = curItem.getContentSize().height * 0.50;
            curItem.addChild(portrait_sprite);
        });
        if ((cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative)) {
            filename = filename || h1global.entityManager.player().uuid.toString() + ".png";
            // download portrait
            // var pathurl = 'http://wx.qlogo.cn/mmopen/Q3auHgzwzM6zHFzbk0YyibNTMxxibJ2yhg2eq0sIBOgFHCKvSBsibkm2pjYVcwgjwsJlI4yrJvWzXBYHRohiced8tQ/0';
            // var filename = 'me.jpg';
            jsb.reflection.callStaticMethod(switches.package_name + "/AppActivity", "downloadAndStoreFile", "(Ljava/lang/String;Ljava/lang/String;I)V", url, filename, fid);
        } else if ((cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative)) {
            filename = filename || h1global.entityManager.player().uuid.toString() + ".png";
            jsb.reflection.callStaticMethod("DownloaderOCBridge", "downloadAndStorePortrait:WithLocalFileName:AndFuncId:", url, filename, fid);
        } else {
            cc.loader.loadImg([url], {"isCrossOrigin": false}, function (err, img) {
                cutil.runFunc(fid, img);
            });
        }
    }
});