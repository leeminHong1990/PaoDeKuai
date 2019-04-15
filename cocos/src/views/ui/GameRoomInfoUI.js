// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var GameRoomInfoUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/GameRoomInfoUI.json";
    },

    initUI: function () {
        var player = h1global.entityManager.player();

        h1global.curScene.bg_txt.setString(player.curGameRoom.update_room_info());
        this.people_panel = this.rootUINode.getChildByName("three_people_panel");

        if (player.curGameRoom.playerNum === 4) {
            this.people_panel.setVisible(false);
            this.people_panel = this.rootUINode.getChildByName("four_people_panel");
            this.people_panel.setVisible(true);
            this.people_panel.setSwallowTouches(false);
        } else {
            this.people_panel.setVisible(false);
            this.people_panel = this.rootUINode.getChildByName("three_people_panel");
            this.people_panel.setVisible(true);
        }
        this.function_panel = this.people_panel.getChildByName("function_panel");
        this.roominfo_panel = this.people_panel.getChildByName("roominfo_panel");

        var player = h1global.entityManager.player();
        var self = this;

        var roomid_label = this.roominfo_panel.getChildByName("roomid_label");
        roomid_label.setString("房间号:" + player.curGameRoom.roomID.toString());

        this.function_panel.getChildByName("communicate_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.communicate_ui.show();
            }
        });
        this.function_panel.getChildByName("config_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.config_ui.show_by_info(const_val.GAMEROOM_SET);
            }
        });
        this.function_panel.getChildByName("help_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.help_ui.show();
            }
        });

        this.function_panel.getChildByName("return_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                player.quitRoom();
                self.hide();
            }
        });

        this.function_panel.getChildByName("out_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                if (player.curGameRoom.isCompetition === 1) {
                    h1global.globalUIMgr.info_ui.show_by_info("比赛场不允许退出/解散房间！");
                } else {
                    if (player.curGameRoom) {
                        if (player.curGameRoom.curRound > 0) {
                            player.applyDismissRoom();
                        }
                    }
                }
            }
        });
        this.function_panel.getChildByName("gps_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                h1global.curUIMgr.gps_ui.show();
            }
        });

        //录音按钮
        var voice = {
            localId: "",
            serverId: ""
        };
        this.voice = voice;
        this.record_btn = this.function_panel.getChildByName("record_btn");
        var start_record_time = 0;
        var stop_record_time = 0;
        var audioName = ""; // 本地版本記錄語音名稱
        var self = this;

        function stopAudioFunc() {
            stop_record_time = new Date().getTime();
            var record_time = new Date().getTime() - start_record_time;
            // if(!cc.audioEngine.isMusicPlaying()){
            //     cc.audioEngine.resumeMusic();
            // }
            if ((cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) || (cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative)) {
                // var fid = cutil.addFunc(function (audioPath) {
                //     // 上傳語音文件
                //     // cc.log("uploadVoice##########################################")
                //     // cc.log(audioPath)
                //     // self.record_btn.setTouchEnabled(true);
                //     h1global.curUIMgr.audiorecord_ui.hide();
                //     var uploadCBId = cutil.addFunc(function (url) {
                //         player.sendAppVoice(url, record_time / 1000);
                //         self.record_btn.setTouchEnabled(true);
                //     });
                //     jsb.reflection.callStaticMethod("UpYunOcBridge", "uploadAudioFile:WithFuncID:", audioName, uploadCBId);
                //     // player.sendAppVoice();
                // });
                // jsb.reflection.callStaticMethod("AudioOcBridge", "avStopAudioRecord:", fid);
                stop_record_time = new Date().getTime();
                h1global.curUIMgr.audiorecord_ui.hide();
                self.record_btn.setTouchEnabled(true);
                cutil.stop_record();
            } else {
                if (!cc.audioEngine.isMusicPlaying()) {
                    cc.audioEngine.resumeMusic();
                }
                wx.stopRecord({
                    success: function (res) {
                        voice.localId = res.localId;
                        // 上传语音
                        h1global.curUIMgr.audiorecord_ui.hide();
                        wx.uploadVoice({
                            localId: voice.localId,
                            success: function (res) {
                                // alert('上传语音成功，serverId 为' + res.serverId);
                                voice.serverId = res.serverId;
                                player.sendVoice(voice.serverId, record_time / 1000);
                                self.record_btn.setTouchEnabled(true);
                            },
                            fail: function (res) {
                                self.record_btn.setTouchEnabled(true);
                            },
                        });
                    },
                    fail: function (res) {
                        // alert(JSON.stringify(res));
                        h1global.curUIMgr.audiorecord_ui.hide();
                        self.record_btn.setTouchEnabled(true);
                    }
                });
                var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;
                var vay = battery.level;
            }
        }

        this.record_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_BEGAN) {
                h1global.curUIMgr.audiorecord_ui.show();
                // if(cc.audioEngine.isMusicPlaying()){
                //     cc.audioEngine.pauseMusic();
                // }
                start_record_time = new Date().getTime();
                // if ((cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative)) {
                //     audioName = player.uuid.toString() + "_" + parseInt(start_record_time).toString();
                //     var result = jsb.reflection.callStaticMethod(switches.package_name + "/AppActivity", "avStartAudioRecord", "(Ljava/lang/String;)Z", audioName);
                //     // cc.log("avStartAudioRecord#################", result)
                // } else if ((cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative)) {
                //     audioName = player.uuid.toString() + "_" + parseInt(start_record_time).toString();
                //     var result = jsb.reflection.callStaticMethod("AudioOcBridge", "avStartAudioRecord:", audioName);
                //     // cc.log("avStartAudioRecord#################", result)
                // } else {
                if ((cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) || (cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative)) {
                    var fileName = start_record_time.toString() + ".dat";
                    var fid = cutil.addFunc(function (fileID) {
                        cc.log("finish upload, fileID = " + fileID);
                        player.sendAppVoice(fileID, (stop_record_time - start_record_time) > 0 ? (stop_record_time - start_record_time) : 0);
                    });
                    cutil.start_record(fileName, fid);
                } else {
                    if (cc.audioEngine.isMusicPlaying()) {
                        cc.audioEngine.pauseMusic();
                    }
                    wx.startRecord({
                        cancel: function () {
                            alert('用户拒绝授权录音');
                        }
                    });
                }
                sender.runAction(cc.Sequence.create(cc.DelayTime.create(30.0),
                    cc.CallFunc.create(function () {
                        // cc.log("LZRTEST:TIME OUT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                        sender.setTouchEnabled(false);
                        sender.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
                        stopAudioFunc();
                    })
                ))
            } else if (eventType === ccui.Widget.TOUCH_ENDED || eventType === ccui.Widget.TOUCH_CANCELED) {
                sender.stopAllActions();
                sender.setTouchEnabled(false);
                var record_time = new Date().getTime() - start_record_time;
                if (record_time >= 1000) {
                    stopAudioFunc();
                } else {
                    // 錄音不足1s則强制延遲到1s執行
                    sender.runAction(cc.Sequence.create(cc.DelayTime.create(1.0), cc.CallFunc.create(function () {
                        stopAudioFunc();
                    })))
                }
            }
        });

        this.update_return_out_btn();
        this.update_round();
        var curDateTime = new Date();
        this.update_curtime(curDateTime);
        onhookMgr.setCurTime((curDateTime.getTime()) / 1000);
        this.update_key_card_panel();
    },


    update_return_out_btn: function () {
        if (!this.is_show) {
            return;
        }
        var player = h1global.entityManager.player();
        var return_btn = this.function_panel.getChildByName("return_btn");
        var out_btn = this.function_panel.getChildByName("out_btn");
        if (player.curGameRoom.curRound > 0) {
            out_btn.setVisible(true);
            return_btn.setVisible(false);
        } else {
            out_btn.setVisible(false);
            return_btn.setVisible(true);
        }
    },

    update_round: function () {
        if (!this.is_show) {
            return;
        }
        this.roominfo_panel.getChildByName("round_label").setString(h1global.entityManager.player().curGameRoom.curRound.toString() + "/" + h1global.entityManager.player().curGameRoom.maxRound.toString() + "局")
    },

    update_curtime: function (curDateTime) {
        if (!this.is_show) {
            return;
        }
        var hour = curDateTime.getHours();
        var min = curDateTime.getMinutes();
        this.roominfo_panel.getChildByName("time_label").setString((hour < 10 ? "0" : "") + hour.toString() + ":" + (min < 10 ? "0" : "") + min.toString());
    },

    update_key_card_panel: function () {
        cc.log("update_key_card_panel");
        if (!this.is_show) {
            return
        }
        var player = h1global.entityManager.player();
        var keyCard = player.curGameRoom.keyCard;
        if (player.curGameRoom.playerNum === 4) {
            var key_panel = this.rootUINode.getChildByName("four_people_panel");
        } else {
            var key_panel = this.rootUINode.getChildByName("three_people_panel");
        }
        cc.log(key_panel);
        var roominfo_panel = key_panel.getChildByName("roominfo_panel");
        var change_frame = roominfo_panel.getChildByName("change_frame");
        var card_img = change_frame.getChildByName("card_img");
        if (keyCard <= 0) {
            change_frame.setVisible(false);
            return
        }
        cc.log("update_key_card_panel", change_frame, card_img);
        change_frame.setVisible(true);
        card_img.ignoreContentAdaptWithSize(true); //Card/48.png
        card_img.loadTexture("Card/" + keyCard.toString() + ".png", ccui.Widget.PLIST_TEXTURE);
    },

});