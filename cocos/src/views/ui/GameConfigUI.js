// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var GameConfigUI = UIBase.extend({
	ctor:function() {
		this._super();
		this.resourceFilename = "res/ui/GameConfigUI.json";
		this.ui_style = 0;
        this.ui_style_chx_list = [];
        this.setLocalZOrder(const_val.MAX_LAYER_NUM);
	},

	initUI:function(){
		this.gameconfig_panel = this.rootUINode.getChildByName("gameconfig_panel");
		var player = h1global.entityManager.player();
		var self = this;
		this.gameconfig_panel.getChildByName("return_btn").addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				self.hide();
			}
		});

		this.out_btn = this.gameconfig_panel.getChildByName("out_btn");
		this.out_btn.addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				player.quitRoom();
				self.hide();
			}
		});

		this.close_btn = this.gameconfig_panel.getChildByName("close_btn");
		this.close_btn.addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				player.quitRoom();
				self.hide();
			}
		});

		this.applyclose_btn = this.gameconfig_panel.getChildByName("applyclose_btn");
		this.applyclose_btn.addTouchEventListener(function(sender, eventType){
			if(eventType == ccui.Widget.TOUCH_ENDED){
				player.applyDismissRoom();
				self.hide();
			}
		});

        this.gameconfig_panel.getChildByName("music_slider").addTouchEventListener(function(sender, eventType){
            if(eventType == ccui.Widget.TOUCH_ENDED){
                // if(eventType == ccui.Slider.EVENT_PERCENT_CHANGED){
                cc.audioEngine.setMusicVolume(sender.getPercent()*0.01);
                cc.sys.localStorage.setItem("MUSIC_VOLUME", sender.getPercent());
                if (sender.getPercent() == 0){
                    cc.sys.localStorage.setItem("MUSIC_IS_PLAY",2);
                    self.gameconfig_panel.getChildByName("mute_music_btn").setBright(false);
                }else {
                    cc.sys.localStorage.setItem("MUSIC_IS_PLAY",1);
                    self.gameconfig_panel.getChildByName("mute_music_btn").setBright(true);
                }
            }
        });
        cc.log(cc.sys.localStorage.getItem("MUSIC_VOLUME"))
        this.gameconfig_panel.getChildByName("music_slider").setPercent(cc.sys.localStorage.getItem("MUSIC_VOLUME"));

        this.gameconfig_panel.getChildByName("effect_slider").addTouchEventListener(function(sender, eventType){
            if(eventType == ccui.Widget.TOUCH_ENDED){
                cc.audioEngine.setEffectsVolume(sender.getPercent()*0.01);
                cc.sys.localStorage.setItem("EFFECT_VOLUME", sender.getPercent());
                if (sender.getPercent() == 0){
                    cc.sys.localStorage.setItem("EFFECT_IS_PLAY",2);
                    self.gameconfig_panel.getChildByName("mute_effect_btn").setBright(false);
                }else {
                    cc.sys.localStorage.setItem("EFFECT_IS_PLAY",1);
                    self.gameconfig_panel.getChildByName("mute_effect_btn").setBright(true);
                }
            }
        });
        cc.log(cc.sys.localStorage.getItem("EFFECT_VOLUME"))
        this.gameconfig_panel.getChildByName("effect_slider").setPercent(cc.sys.localStorage.getItem("EFFECT_VOLUME"));


        var mute_music_btn = this.gameconfig_panel.getChildByName("mute_music_btn");
        mute_music_btn.addTouchEventListener(function(sender, eventType){
            if(eventType == ccui.Widget.TOUCH_ENDED){
                if (sender.isBright()){
                    sender.setBright(false);
                    cc.audioEngine.setMusicVolume(0);
                    cc.sys.localStorage.setItem("MUSIC_IS_PLAY",2);
                    cc.sys.localStorage.setItem("MUSIC_VOLUME", 0);
                    self.gameconfig_panel.getChildByName("music_slider").setPercent(0);
                }else {
                    sender.setBright(true);
                    cc.sys.localStorage.setItem("MUSIC_VOLUME", 100);
                    self.gameconfig_panel.getChildByName("music_slider").setPercent(100);
                    cc.audioEngine.setMusicVolume(1);
                    cc.sys.localStorage.setItem("MUSIC_IS_PLAY",1);
                }
            }
        });
        var isMusicPlaying = cc.sys.localStorage.getItem("MUSIC_IS_PLAY") || 1;
        if (1 == isMusicPlaying){
            mute_music_btn.setBright(true);
        }else {
            mute_music_btn.setBright(false);
        }

        var mute_effect_btn = this.gameconfig_panel.getChildByName("mute_effect_btn");
        mute_effect_btn.addTouchEventListener(function(sender, eventType){
            if(eventType == ccui.Widget.TOUCH_ENDED){
                if (sender.isBright()){
                    sender.setBright(false);
                    cc.audioEngine.setEffectsVolume(0);
                    cc.sys.localStorage.setItem("EFFECT_IS_PLAY",2);
                    cc.sys.localStorage.setItem("EFFECT_VOLUME", 0);
                    self.gameconfig_panel.getChildByName("effect_slider").setPercent(0);
                }else {
                    sender.setBright(true);
                    cc.sys.localStorage.setItem("EFFECT_VOLUME", 100);
                    self.gameconfig_panel.getChildByName("effect_slider").setPercent(100);
                    cc.audioEngine.setEffectsVolume(1);
                    cc.sys.localStorage.setItem("EFFECT_IS_PLAY",1);
                }
            }
        });
        var isEffectPlaying = cc.sys.localStorage.getItem("EFFECT_IS_PLAY") || 1;
        if (1 == isEffectPlaying){
            mute_effect_btn.setBright(true);
        }else {
            mute_effect_btn.setBright(false);
        }

		this.update_state();
	},

	update_state:function(){
		if(!this.is_show){
			return;
		}
		var player = h1global.entityManager.player();
		if(player.curGameRoom){
			if(player.curGameRoom.curRound > 0){
				this.applyclose_btn.setVisible(true);
				this.close_btn.setVisible(false);
				this.out_btn.setVisible(false);
			} else if(player.serverSeatNum == 0){
				this.applyclose_btn.setVisible(false);
				this.close_btn.setVisible(true);
				this.out_btn.setVisible(false);
			} else {
				this.applyclose_btn.setVisible(false);
				this.close_btn.setVisible(false);
				this.out_btn.setVisible(true);
			}
		}
	},
    initUiStyle:function(){
		var self = this;
        var ui_style =cc.sys.localStorage.getItem("UI_STYLE_MODE");

        this.ui_style_chx_list = []
        function ui_style_event(sender,eventType) {
            if(eventType == ccui.CheckBox.EVENT_SELECTED || eventType == ccui.CheckBox.EVENT_UNSELECTED){
                for(var i = 0; i < self.ui_style_chx_list.length; i++){
                    if(sender != self.ui_style_chx_list[i]){
                        self.ui_style_chx_list[i].setSelected(false);
                        self.ui_style_chx_list[i].setTouchEnabled(true);
                    }else {
                        self.ui_style = i;
                        sender.setSelected(true);
                        sender.setTouchEnabled(false);
                        self.update_ui_style();
                    }
                }
            }
        }
        for(var i = 0; i < 3; i++){
            var ui_style_chx = ccui.helper.seekWidgetByName(this.createroom_panel, "ui_style_" + String(i + 1));
            this.ui_style_chx_list.push(ui_style_chx);
            ui_style_chx.addTouchEventListener(ui_style_event);
            if (ui_style && ui_style == i){
                ui_style_chx.setFocused(true);
			}
        }
	},
	update_ui_style:function(){
        var self = this;
    	if (0 == self.ui_style){
            h1global.curScene.bg_img.loadTexture(res.gamebg_png_1,ccui.Widget.LOCAL_TEXTURE);
            h1global.curScene.bg_desc_img.loadTexture(res.gamebg_label_png_1,ccui.Widget.LOCAL_TEXTURE);
		}else if (1 == self.ui_style){
            h1global.curScene.bg_img.loadTexture(res.gamebg_png_2,ccui.Widget.LOCAL_TEXTURE);
            h1global.curScene.bg_desc_img.loadTexture(res.gamebg_label_png_2,ccui.Widget.LOCAL_TEXTURE);
		}else if (2 == self.ui_style){
            h1global.curScene.bg_img.loadTexture(res.gamebg_png_3,ccui.Widget.LOCAL_TEXTURE);
            h1global.curScene.bg_desc_img.loadTexture(res.gamebg_label_png_3,ccui.Widget.LOCAL_TEXTURE);
		}
	},
});