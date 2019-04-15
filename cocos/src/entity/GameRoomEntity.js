"use strict";

var GameRoomEntity = KBEngine.Entity.extend({
	ctor : function(player_num)
	{
		this._super();
		
		this.roomID = undefined;
		this.ownerId = undefined;
		this.curRound = 0;     //当前局数
		this.maxRound = 10;     //游戏局数
		this.gameMode = 0;     //游戏模式 0:经典  1:15张  2:癞子
        this.gameCardnum = 0;    // 牌数选择 0:16张 1:15张 2:一副牌
		this.playerNum = player_num;   // 玩家人数  3人 2人  4人
        this.gameStart = 1;      // 0: 首局先出黑桃3  1：首局无要求
		this.gameHei3 = 0;     // 0：黑三先出  1：庄家先出
		this.gameFunc = 0;     // 功能选择 0:显示牌 1:不显示牌
        this.gameDeal = 0;		//分牌选择 0:单张分   1:155分    2:444分
		this.gameForce = 0;    // 玩法选择 0:必须管 1:可不要
        this.gamePlays = [0, 0, 0, 0]; // 最后选择 红桃10扎鸟，四带二，四带三   炸弹不可拆
        this.gameEnd = [0, 0, 0, 0];    // 最后选择 三张可少带出完，三张可少带接完，飞机可少带出完   飞机可少带接完
        this.anticheating = 0;   // 防作弊选择 0:关 1:开
		this.isAgent = false;
		this.agentInfo = {};
		this.isCompetition = 0;	//是否是竞技场 0：不是  1：是

		this.controllerIdx = -1;   //控牌玩家idx
		this.waitIdx = -1;         //等待出牌的玩家
		this.keyCard = 0;           //财神
		this.controller_discard_list = []; //控牌玩家出的牌

		this.applyCloseLeftTime = 0;  //申请退出房间的倒计时
		this.applyCloseFrom = 0;      //申请退出房间的玩家

		this.dealerIdx = -1;     // 庄家
		this.bombOpen = 0;       // 炸弹是否能拆 0：不能拆  1：可以拆
		this.discardList = [[], [], [], []]; //每个玩家出过的牌
		this.cardNum = 16;       // 玩家开始时的总牌数
		// this.controllerType = 0;  // 控牌玩家的出牌类型
      
		if (player_num === 2) {
			this.playerInfoList = [null, null];  //玩家的信息
			this.playerPokerList = [[],[]]; 	//玩家手牌
			this.deskPokerList = [[],[]]; 		//桌面牌
			this.player_advance_info_list = [{}, {}];
			this.playerStateList = [0, 0];   //玩家准备的状态		
			this.applyCloseStateList = [0, 0];
			this.playerScoreList = [0, 0];  // 每局不清除的信息
			this.playerOperation = [0, 0]	 //玩家是否轮过一圈
		}else if (player_num ===3) {
			this.playerInfoList = [null, null, null];  
			this.playerPokerList = [[],[],[]];
			this.deskPokerList = [[],[],[]];
			this.player_advance_info_list = [{}, {}, {}];
			this.playerStateList = [0, 0, 0];   
			this.applyCloseStateList = [0, 0, 0];
			this.playerScoreList = [0, 0, 0];  
			this.playerOperation = [0, 0, 0]	
		}else{
			this.playerInfoList = [null, null, null, null];  
			this.playerPokerList = [[],[],[],[]];
			this.deskPokerList = [[],[],[],[]];
			this.player_advance_info_list = [{}, {}, {}, {}];
			this.playerStateList = [0, 0, 0, 0];   
			this.applyCloseStateList = [0, 0, 0, 0];
			this.playerScoreList = [0, 0, 0, 0];  
			this.playerOperation = [0, 0, 0, 0]	
		}

	    KBEngine.DEBUG_MSG("Create GameRoomEntity")
  	},

  	reconnectRoomData : function(recRoomInfo){
  		cc.log("断线重连:reconnectRoomData",recRoomInfo);
  		this.controllerIdx = recRoomInfo["controllerIdx"];
  		this.controller_discard_list = recRoomInfo["controller_discard_list"];
  		this.deskPokerList = recRoomInfo["deskPokerList"];
  		this.isPlayingGame = recRoomInfo["isPlayingGame"];
  		this.playerStateList = recRoomInfo["player_state_list"];
  		this.waitIdx = recRoomInfo["waitIdx"];
  		this.dealerIdx = recRoomInfo["dealer_idx"];
  		this.discardList = recRoomInfo["discardList"];
  		this.playerOperation = recRoomInfo["player_op"];
  		this.keyCard = recRoomInfo["key_card"];
  		this.applyCloseLeftTime = recRoomInfo["applyCloseLeftTime"];
  		this.applyCloseFrom = recRoomInfo["applyCloseFrom"];
		this.applyCloseStateList = recRoomInfo["applyCloseStateList"];

		this.player_advance_info_list = recRoomInfo["player_advance_info_list"];
		for (var i = 0; i < this.player_advance_info_list.length; i++) {
			this.playerPokerList[i] = this.player_advance_info_list[i]["cards"]
		}

		if(this.applyCloseLeftTime > 0){
			onhookMgr.setApplyCloseLeftTime(this.applyCloseLeftTime);
		}

		this.updateRoomData(recRoomInfo["init_info"]);
  	},

  	updateRoomData : function(roomInfo){
  		cc.log("updateRoomData:", roomInfo);
  		this.roomID = roomInfo["roomID"];
  		this.ownerId = roomInfo["ownerId"];
  		this.curRound = roomInfo["curRound"];
  		this.maxRound = roomInfo["maxRound"];
        this.gameMode = roomInfo["gameMode"];
		this.playerNum = roomInfo["playerNum"];
		this.gameStart = roomInfo["gameStart"];
		this.gameHei3 = roomInfo["gameHei3"];
		this.gameFunc = roomInfo["gameFunc"];
		this.gameDeal = roomInfo["gameDeal"];
		this.gameForce = roomInfo["gameForce"];
		this.gameCardnum = roomInfo["gameCardNum"];
		this.gamePlays = roomInfo["gamePlays"];
		this.gameEnd =  roomInfo["gameEnd"];
		this.anticheating = roomInfo["anticheating"];
		this.bombOpen = this.gamePlays[3];
		this.cardNum = roomInfo["cardNum"];
  		this.isAgent = roomInfo["isAgent"];
		this.agentInfo = roomInfo["agentInfo"];
		this.isCompetition = roomInfo["is_competition"];
        this.sportId = roomInfo["sportId"];
        this.groupId = roomInfo["groupId"];
        this.groupName = roomInfo["groupName"];

  		for(var i = 0; i < roomInfo["player_base_info_list"].length; i++){
  			this.updatePlayerInfo(roomInfo["player_base_info_list"][i]["idx"], roomInfo["player_base_info_list"][i]);
		}

		var self = this;
		if(!((cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) || (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative)) || switches.TEST_OPTION){
			wx.onMenuShareAppMessage({
                title: '房间号【' + self.roomID.toString() + '】', // 分享标题
                desc: '我在[跑得快]开了' + self.maxRound.toString() + '局的房间，快来一起玩吧', // 分享描述
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
			    fail: function() {
			    	cc.log("ShareAppMessage Fail")
			    },
			});
			wx.onMenuShareTimeline({
                title: '房间号【' + self.roomID.toString() + '】', // 分享标题
                desc: '我在[跑得快]开了' + self.maxRound.toString() + '局的房间，快来一起玩吧', // 分享描述
                link: switches.h5entrylink, // 分享链接
			    imgUrl: '', // 分享图标
			    type: '', // 分享类型,music、video或link，不填默认为link
			    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			    success: function () { 
			        // 用户确认分享后执行的回调函数
			        cc.log("onMenuShareTimeline Success!");
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
			        cc.log("onMenuShareTimeline Cancel!");
			    },
			    fail: function() {
			    	cc.log("onMenuShareTimeline Fail")
			    },
			});
		}
  	},

  	swapPlayerBaseInfo:function(swap_list){
  		var tempinfo = [];
  		for (var i = 0; i < swap_list.length; i++) {
  			tempinfo[i] = this.playerInfoList[swap_list[i]]
  		}
  		this.playerInfoList = tempinfo
  	},

  	updatePlayerInfo : function(serverSeatNum, playerInfo){
  		this.playerInfoList[serverSeatNum] = playerInfo;
  	},
	
	IsAllPreplayerState:function () {
  		for (var i = 0; i < this.playerStateList.length; i++) {
  		  	if (this.playerStateList[i] === 0) {
  		  	 	return false
  		  	}
  		}
  		return true;
    },

  	updatePlayerState : function(serverSeatNum, state){
  		this.playerStateList[serverSeatNum] = state;
  	},

	getPlayerState:function (serverSeatNum) {
        return this.playerStateList[serverSeatNum];
    },

  	updatePlayerOnlineState : function(serverSeatNum, state){
  		this.playerInfoList[serverSeatNum]["online"] = state;
  	},

  	startGame : function(){
  		this.curRound = this.curRound + 1;
  		this.isPlayingGame = 1;
		this.waitIdx = -1;
		this.controllerIdx = -1;
		this.controllerDiscard = [];
		this.dealerIdx = -1;
		this.discardList = [[], [], [], []];
        this.controller_discard_list = [];
		var cards_length_list = [16, 15, 13, 27];

		if (this.playerNum === 2) {
			this.deskPokerList = [[], []];
			this.playerOperation = [0, 0];
            this.playerPokerList = [[],[]];
			for(var i = 0 ; i < this.playerNum ; i++) {
                for (var j = 0; j < cards_length_list[this.gameMode === 2 ? this.gameCardnum : this.gameMode]; j++) {
                    this.playerPokerList[i].push(0);
                }
            }
		}else if(this.playerNum === 3){
			this.deskPokerList = [[], [], []];
			this.playerOperation = [0, 0, 0];
            this.playerPokerList = [[],[],[]];
            for(var i = 0 ; i < this.playerNum ; i++) {
                for (var j = 0; j < cards_length_list[this.gameMode === 2 ? this.gameCardnum : this.gameMode]; j++) {
                    this.playerPokerList[i].push(0);
                }
            }
		}else {
			this.deskPokerList = [[], [], [], []];
			this.playerOperation = [0, 0, 0, 0];
            this.playerPokerList = [[],[],[],[]];
            for(var i = 0 ; i < this.playerNum ; i++) {
                for (var j = 0; j < cards_length_list[this.gameMode === 2 ? this.gameCardnum : this.gameMode]; j++) {
                    this.playerPokerList[i].push(0);
                }
            }
		}
  	},

  	endGame : function(){
  		// 重新开始准备
  		this.playerStateList = [0, 0, 0];
  		this.isPlayingGame = 0;
  	},

    update_room_info: function () {
        var str = "";
        if (this.gameMode === 0) {
            str += "经典模式";
        } else if (this.gameMode === 1) {
            str += "15张模式";
        } else {
            str += "癞子模式";
        }
        switch (this.playerNum) {
            case 2:
                str += " 两人局";
                break;
            case 3:
                str += " 三人局";
                break;
            case 4:
                str += " 四人局";
                break;
            default:
                break;
        }

        if (this.playerNum == 2) {
            str += " 首局无要求";
            str += " 随机出牌";
        } else {
            if (this.gameStart === 1) {
                str += " 首局无要求";
            } else {
                str += " 首局先出黑桃3";
            }
            if (this.gameHei3 === 1) {
                str += " 庄家先出";
            } else {
                str += " 黑三先出";
            }
        }

        if (this.gameFunc === 1) {
            str += " 不显示牌";
        } else {
            str += " 显示牌";
        }

        var deal_list = [[" 单张分", " 1555分", " 444分"], [" 单张分", " 555分", " 2355分"], [" 单张分", " 355分", " 445分"]];
        if (this.gameDeal === 0) {
            str += deal_list[this.gameMode === 2 ? this.gameCardnum : this.gameMode][0];
        } else if (this.gameDeal === 1) {
            str += deal_list[this.gameMode === 2 ? this.gameCardnum : this.gameMode][1];
        } else {
            str += deal_list[this.gameMode === 2 ? this.gameCardnum : this.gameMode][2];
        }

        if (this.gameForce === 1) {
            str += " 可不要";
        } else {
            str += " 必须管";
        }
        for (var item in this.gamePlays) {
            if (this.gamePlays[item] === 1) {
                switch (parseInt(item)) {
                    case 0:
                        str += " 红桃10扎鸟";
                        break;
                    case 1:
                        str += " 四带二";
                        break;
                    case 2:
                        str += " 四带三";
                        break;
                    case 3:
                        str += " 炸弹不可拆";
                        break;
                }
            }
        }
        for (var item in this.gameEnd) {
            if (this.gameEnd[item] === 1) {
                switch (parseInt(item)) {
                    case 0:
                        str += " 三张可少带出完";
                        break;
                    case 1:
                        str += " 三张可少带接完";
                        break;
                    case 2:
                        str += " 飞机可少带出完";
                        break;
                    case 3:
                        str += " 飞机可少带接完";
                        break;
                }
            }
        }
        return str;
    },

	is_Full:function () {
  		var flag = 0;
		for (var i = 0,len = this.playerInfoList.length; i < len; i++) {
			if (this.playerInfoList[i]){
                flag++;
			}
		}
		if (flag === this.playerNum){
			return true;
		}
		return false;
    }
});