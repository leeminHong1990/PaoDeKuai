"use strict";
/*-----------------------------------------------------------------------------------------
												interface
-----------------------------------------------------------------------------------------*/
var impCommunicate = impBase.extend({
	__init__ : function()
	{
		this._super();
  	},

	sendEmotion : function(eid){
		// TEST:
		this.baseCall("sendEmotion", eid);
		this.recvEmotion(this.serverSeatNum, eid);
	},

	recvEmotion : function(serverSeatNum, eid){
		if(eid <= 0 || eid >= 19){
			return;
		}
		if(h1global.curUIMgr.gameroomprepare_ui && h1global.curUIMgr.gameroomprepare_ui.is_show){
			h1global.curUIMgr.gameroomprepare_ui.playEmotionAnim(serverSeatNum, eid);
		}
		if(h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show){
			h1global.curUIMgr.gameroom_ui.playEmotionAnim(serverSeatNum, eid);
		}
	},

    sendMagicEmotion : function(mid,idxFrom,idxTo){
		var room_ui = null;
        if(h1global.curUIMgr.gameroomprepare_ui && h1global.curUIMgr.gameroomprepare_ui.is_show){
            room_ui = h1global.curUIMgr.gameroomprepare_ui;
        }
        if(h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show) {
            room_ui = h1global.curUIMgr.gameroom_ui;
        }
        if (room_ui){
            if (room_ui.rootUINode.canPlayMagicEmo){
                room_ui.show_op_tips();
                return;
            } else {
                room_ui.rootUINode.canPlayMagicEmo = 1;
                room_ui.rootUINode.runAction(cc.Sequence.create(cc.DelayTime.create(3.0), cc.CallFunc.create(function(){
                    room_ui.rootUINode.canPlayMagicEmo = 0;
                })))
            }
            // TEST
            this.baseCall("sendMagicEmotion", mid,idxFrom,idxTo);
            //this.recvMagicEmotion(this.serverSeatNum, mid);
		}
    },
    recvMagicEmotion : function(idxFrom,idxTo, eid){
        if(eid <= 0 || eid >= 19){
            return;
        }
        if(h1global.curUIMgr.gameroomprepare_ui && h1global.curUIMgr.gameroomprepare_ui.is_show){
            h1global.curUIMgr.gameroomprepare_ui.playMagicEmoAnim(idxFrom,idxTo,eid);
        }
        if(h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show){
            h1global.curUIMgr.gameroom_ui.playMagicEmoAnim(idxFrom,idxTo,eid);
        }
    },

	sendMsg : function(mid){
		// TEST
		this.baseCall("sendMsg", mid);
		this.recvMsg(this.serverSeatNum, mid);
	},

	recvMsg : function(serverSeatNum, mid){
		if(mid < 0 || mid > 9){
			return;
		}
		// var info_dict = eval('(' + cc.sys.localStorage.getItem("INFO_JSON") + ')');
		var info_dict = {};
		if(serverSeatNum < 0){
			info_dict = this.curGameRoom.agentInfo;
		} else {
			info_dict = this.curGameRoom.playerInfoList[serverSeatNum];
		}
		if(h1global.curUIMgr.gameroomprepare_ui && h1global.curUIMgr.gameroomprepare_ui.is_show){
			h1global.curUIMgr.gameroomprepare_ui.playMessageAnim(serverSeatNum, mid);
            cc.audioEngine.stopAllEffects();
			if(info_dict["sex"] === 1){
				cc.audioEngine.playEffect("res/sound/voice/male/sound_man_msg_" + mid.toString() + ".mp3");
			} else {
				cc.audioEngine.playEffect("res/sound/voice/female/sound_woman_msg_" + mid.toString() + ".mp3");
			}
		}
		if(h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show){
			h1global.curUIMgr.gameroom_ui.playMessageAnim(serverSeatNum, mid);
			cc.audioEngine.stopAllEffects();
			if(info_dict["sex"] === 1){
				cc.audioEngine.playEffect("res/sound/voice/male/sound_man_msg_" + mid.toString() + ".mp3");
			} else {
				cc.audioEngine.playEffect("res/sound/voice/female/sound_woman_msg_" + mid.toString() + ".mp3");
			}
		}
	},

	sendVoice : function(url, record_time){
		this.baseCall("sendVoice", url, record_time);
		this.recvVoice(this.serverSeatNum, url, record_time);
	},

	sendAppVoice : function(url, record_time){
		this.baseCall("sendAppVoice", url, record_time);
		this.recvAppVoice(this.serverSeatNum, url, record_time);
	},

	recvVoice : function(serverSeatNum, url, record_time){
		if((cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) || (cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative)){
			return;
		}
		var self = this;
		wx.downloadVoice({
	      	serverId: url,
	      	success: function (res) {
	        	// alert('下载语音成功，localId 为' + res.localId);
	        	// voice.localId = res.localId;
	        	// 直接播放
	        	// var talk_img = undefined;
				if(h1global.curUIMgr.gameroomprepare_ui && h1global.curUIMgr.gameroomprepare_ui.is_show){
					h1global.curUIMgr.gameroomprepare_ui.playVoiceAnim(serverSeatNum, record_time)
				}
				else if(h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show){
					h1global.curUIMgr.gameroom_ui.playVoiceAnim(serverSeatNum, record_time);
				}
				// self.voiceCache[res.localId] = talk_img;
	        	wx.playVoice({
			      	localId: res.localId,
			    });
	      	}
	    });
	},

	recvAppVoice : function(serverSeatNum, fileID, record_time){
		cc.log("recvAppVoice#######################################################");
		cc.log(fileID)
        // 直接播放
        if(h1global.curUIMgr.gameroomprepare_ui && h1global.curUIMgr.gameroomprepare_ui.is_show){
            h1global.curUIMgr.gameroomprepare_ui.playVoiceAnim(serverSeatNum, record_time / 1000);
        } else if(h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show) {
            h1global.curUIMgr.gameroom_ui.playVoiceAnim(serverSeatNum, record_time / 1000);
        }
        cutil.download_voice(fileID);
	},
});
