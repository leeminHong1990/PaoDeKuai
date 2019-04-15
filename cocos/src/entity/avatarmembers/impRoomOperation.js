"use strict";
/*-----------------------------------------------------------------------------------------
												interface
-----------------------------------------------------------------------------------------*/
var impRoomOperation = impGroup.extend({
	__init__ : function()
	{
		this._super();
		this.curGameRoom = undefined;
	    KBEngine.DEBUG_MSG("Create impRoomOperation");
  	},

    reqCreateRoom : function(room_op) {
		cc.log("createRoom:",room_op);
		this.baseCall("reqCreateRoom", room_op);
	},

	createRoomSucceed : function(roomInfo){
		cc.log("createRoomSucceed!");
		cc.log(roomInfo);
		this.curGameRoom = new GameRoomEntity(roomInfo["playerNum"]);
		this.curGameRoom.updateRoomData(roomInfo);
		this.serverSeatNum = 0;
		if(roomInfo["isAgent"]){
			this.serverSeatNum = -1;
		}
	
		h1global.runScene(new GameRoomScene());
	},

	createRoomFailed : function(err){
		cc.log("createRoomFailed!");
		if(err === -1){
			h1global.globalUIMgr.info_ui.show_by_info("钻石不足!", cc.size(300, 200));
		} else if(err === -2){
			h1global.globalUIMgr.info_ui.show_by_info("已经在房间中!", cc.size(300, 200));
		}
	},

	server2CurSitNum : function(serverSeatNum){
        if(this.curGameRoom){
			if (this.curGameRoom.playerNum === 2) {
				if (serverSeatNum < 2) {
					if ((serverSeatNum + this.curGameRoom.playerInfoList.length - this.serverSeatNum) % this.curGameRoom.playerInfoList.length === 1) {
						return 1
					}
					return (serverSeatNum + this.curGameRoom.playerInfoList.length - this.serverSeatNum) % this.curGameRoom.playerInfoList.length;
				}
				return -1	
			}
            if (this.curGameRoom.playerNum === 3 && (serverSeatNum + this.curGameRoom.playerInfoList.length - this.serverSeatNum) % this.curGameRoom.playerInfoList.length === 2) {
                return 3
            }
			return (serverSeatNum + this.curGameRoom.playerInfoList.length - this.serverSeatNum) % this.curGameRoom.playerInfoList.length;
		} else {
			return -1;
		}
	},

	notifyChangeController : function(controllerIdx){
		cc.log("notifyChangeController",controllerIdx);
		this.curGameRoom.deskPokerList[this.curGameRoom.controllerIdx.controllerIdx] = [];
		if (h1global.curUIMgr.gameroom_ui && h1global.curUIMgr.gameroom_ui.is_show) {
			h1global.curUIMgr.gameroom_ui.update_discard_card_panel(this.server2CurSitNum(this.curGameRoom.controllerIdx), [])
		}
		this.curGameRoom.controllerIdx = controllerIdx
		
	},

	enterRoom : function(roomId){
		this.baseCall("enterRoom", roomId);
	},

	enterRoomSucceed : function(serverSeatNum, roomInfo){
		cc.log("enterRoomSucceed!",serverSeatNum, roomInfo);

		this.curGameRoom = new GameRoomEntity(roomInfo["playerNum"]);
		this.curGameRoom.updateRoomData(roomInfo);
		this.serverSeatNum = serverSeatNum;
		this.curGameRoom.playerStateList = roomInfo["player_state_list"];
		if(cc.director.getRunningScene().className === "GameRoomScene"){
			h1global.runScene(new GameRoomScene());
			cutil.unlock_ui();
		} else {
			h1global.runScene(new GameRoomScene());
		}
	},

	enterRoomFailed : function(err){
		cc.log("enterRoomFailed!");
		if(err === -1){
			h1global.globalUIMgr.info_ui.show_by_info("房间不存在！", cc.size(300, 200));
		} else if(err === -2){
			h1global.globalUIMgr.info_ui.show_by_info("房间人数已满！", cc.size(300, 200));
		} else if(err === -3){
            h1global.globalUIMgr.info_ui.show_by_info("对不起，您不是该公会会员！", cc.size(300, 200));
        } else if(err === -4){
            h1global.globalUIMgr.info_ui.show_by_info("房间权限不足", cc.size(300, 200));
        } else if(err === -5){
            h1global.globalUIMgr.info_ui.show_by_info("未报名参加赛事", cc.size(300, 200));
        } else if (err == -6) {
            h1global.globalUIMgr.info_ui.show_by_info("您已经在房间中，不能再加入房间", cc.size(300, 200));
        }
	},

	quitRoom : function(){
		if(!this.curGameRoom){
			return;
		}
		this.baseCall("quitRoom");
	},

	quitRoomSucceed : function(){
		this.curGameRoom = null;
		if (onhookMgr) { 
            onhookMgr.setApplyCloseLeftTime(null);
        }
		h1global.runScene(new GameHallScene());
	},

	quitRoomFailed : function(err){
		cc.log("quitRoomFailed!");
        if (err === -1) {
            h1global.globalUIMgr.info_ui.show_by_info("房间已经开始游戏，无法退出！", cc.size(300, 200));
        }
    },

	othersQuitRoom : function(serverSeatNum){
		if(this.curGameRoom){
			this.curGameRoom.playerInfoList[serverSeatNum] = null;
			if(h1global.curUIMgr.gameroomprepare_ui && h1global.curUIMgr.gameroomprepare_ui.is_show){
				h1global.curUIMgr.gameroomprepare_ui.update_player_info_panel(serverSeatNum, this.curGameRoom.playerInfoList[serverSeatNum]);
			}

            if(h1global.curUIMgr.gps_ui && h1global.curUIMgr.gps_ui.is_show){
                h1global.curUIMgr.gps_ui.update_player_info();
            }
		}
	},

	othersEnterRoom : function(playerInfo){
		cc.log("othersEnterRoom");
		cc.log(playerInfo);
		this.curGameRoom.updatePlayerInfo(playerInfo["idx"], playerInfo);
		this.curGameRoom.updatePlayerState(playerInfo["idx"], 0);
		if(h1global.curUIMgr.gameroomprepare_ui && h1global.curUIMgr.gameroomprepare_ui.is_show){
			h1global.curUIMgr.gameroomprepare_ui.update_player_info_panel(playerInfo["idx"], playerInfo);
			h1global.curUIMgr.gameroomprepare_ui.update_player_state(playerInfo["idx"], 0);
		}
        if(h1global.curUIMgr.gps_ui && h1global.curUIMgr.gps_ui.is_show){
            h1global.curUIMgr.gps_ui.update_player_info();
        }
	},

    upLocationInfo : function () {
        cc.log("upLocationInfo");
        var location = cutil.get_location_geo() || "";
        var lat = cutil.get_location_lat() || "";
        var lng = cutil.get_location_lng() || "";
        this.baseCall("upLocationInfo", location, lat, lng);
    },

	handleReconnect : function(recRoomInfo){
        this.upLocationInfo();
		this.curGameRoom = new GameRoomEntity(recRoomInfo['init_info']["playerNum"]);
		this.curGameRoom.reconnectRoomData(recRoomInfo);

		if(this.curGameRoom.isAgent && this.curGameRoom.agentInfo['userId'].compare(this.userId) === 0){
			this.serverSeatNum = -1;
		} else {
			var player_base_info_list = recRoomInfo["init_info"]["player_base_info_list"];
			for(var i = 0; i < player_base_info_list.length; i++){
				if(player_base_info_list[i]["userId"].compare(this.userId) === 0){
					this.serverSeatNum = i;
					break;
				}
			}
		}
		h1global.runScene(new GameRoomScene());
	},

	applyDismissRoom : function(){
		if(this.curGameRoom){
			this.baseCall("applyDismissRoom");
			this.curGameRoom.applyCloseLeftTime = const_val.DISMISS_ROOM_WAIT_TIME + 1; // 本地操作先于服务端，所以增加1s防止网络延迟
			this.curGameRoom.applyCloseFrom = this.serverSeatNum;
			this.curGameRoom.applyCloseStateList[this.serverSeatNum] = 1;
			h1global.curUIMgr.applyclose_ui.show_by_sitnum(this.serverSeatNum);
			onhookMgr.setApplyCloseLeftTime(const_val.DISMISS_ROOM_WAIT_TIME + 1); // 本地操作先于服务端，所以增加1s防止网络延迟
		}
	},

	reqDismissRoom : function(serverSeatNum){
		if(this.curGameRoom){
			this.curGameRoom.applyCloseLeftTime = const_val.DISMISS_ROOM_WAIT_TIME;
			this.curGameRoom.applyCloseFrom = serverSeatNum;
			this.curGameRoom.applyCloseStateList = [0, 0, 0, 0];
			this.curGameRoom.applyCloseStateList[serverSeatNum] = 1;
			h1global.curUIMgr.applyclose_ui.show_by_sitnum(serverSeatNum);
			onhookMgr.setApplyCloseLeftTime(const_val.DISMISS_ROOM_WAIT_TIME);
		}
	},

	voteDismissRoom : function(vote){
		// cc.log("voteDismissRoom")
		this.baseCall("voteDismissRoom", vote);
	},

	voteDismissResult : function(serverSeatNum, vote){
		// cc.log("voteDismissResult")
		if(this.curGameRoom){
			this.curGameRoom.applyCloseStateList[serverSeatNum] = vote;
			var vote_agree_num = 0;
			var vote_disagree_num = 0;
			for(var i = 0; i < this.curGameRoom.playerInfoList.length; i++){
				if(this.curGameRoom.applyCloseStateList[i] === 1){
					vote_agree_num = vote_agree_num + 1;
				} else if(this.curGameRoom.applyCloseStateList[i] === 2){
					vote_disagree_num = vote_disagree_num + 1;
				}
			}
			if(vote_disagree_num >= 1){
                if(h1global.curUIMgr.applyclose_ui && h1global.curUIMgr.applyclose_ui.is_show){
                    h1global.curUIMgr.applyclose_ui.hide();
                    for(var i = 0; i < this.curGameRoom.playerInfoList.length; i++){
                        this.curGameRoom.applyCloseStateList[i] = 0;
                    }
                    if (onhookMgr) {
                        onhookMgr.setApplyCloseLeftTime(null);
                    }
                }
                return;
            }
			if(h1global.curUIMgr.applyclose_ui && h1global.curUIMgr.applyclose_ui.is_show){
				h1global.curUIMgr.applyclose_ui.update_vote_state();
			}
		}
	},

	getTestData: function() {
		this.baseCall('getTestData');
	},

	getTestDataResult: function(card_list_list) {
		var player = h1global.entityManager.player();
		if(player.curGameRoom && h1global.curUIMgr.gameroomtest_ui){
			h1global.curUIMgr.gameroomtest_ui.show(function(){
				for(var i = 0; i < card_list_list.length; i++){
					h1global.curUIMgr.gameroomtest_ui.update_hand_card_panel(player.server2CurSitNum(i), card_list_list[i]);
				}
			});
		}
	},
});
