// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var GPSUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/GPSUI.json";
        this.setLocalZOrder(const_val.MAX_LAYER_NUM);
    },

    initUI: function () {
        var self = this;
        var player = h1global.entityManager.player();
        this.gps_panel = this.rootUINode.getChildByName("gps_panel");

        this.gps_panel.getChildByName("return_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType == ccui.Widget.TOUCH_ENDED) {
                if (h1global.curUIMgr.gameroomprepare_ui && h1global.curUIMgr.gameroomprepare_ui.is_show) {
                    if (player.curGameRoom.getPlayerState(player.serverSeatNum) === 0){
                        player.curGameRoom.updatePlayerState(player.serverSeatNum, 1);
                        h1global.curUIMgr.gameroomprepare_ui.update_player_state(player.serverSeatNum, 1);
                        player.roundEndCallback();
                    }
                }
                self.hide();
            }
        });

        this.gps_panel.getChildByName("dissroom_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType == ccui.Widget.TOUCH_ENDED) {
                if (player.curGameRoom.isCompetition === 1) {
                    h1global.globalUIMgr.info_ui.show_by_info("比赛场不允许退出/解散房间！");
                }else {
                    if (player.curGameRoom) {
                        if (player.curGameRoom.curRound > 0) {
                            player.applyDismissRoom();
                        } else {
                            player.quitRoom();
                        }
                        self.hide();
                    }
                }
            }
        });

        this.player_panel = this.gps_panel.getChildByName("three_panel");
        if (player.curGameRoom.playerNum === 4) {
            this.player_panel.setVisible(false);
            this.player_panel = this.gps_panel.getChildByName("four_panel");
            this.player_panel.setVisible(true);
        } else {
            this.player_panel.setVisible(true);
        }
        this.update_player_info();
    },

    update_player_info: function () {
        var self = this;
        var player = h1global.entityManager.player();
        cc.log("playerInfoList :", player.curGameRoom.playerInfoList);
        for (var ii = 0; ii < player.curGameRoom.playerNum; ii++) {
            // 设置角色信息
            let i = ii;
            var playerInfo1 = player.curGameRoom.playerInfoList[i];
            cc.log("sitNum: ", player.server2CurSitNum(i));
            cc.log("playerInfo :", playerInfo1, player.server2CurSitNum(i));
            var playerInfo_panel = this.player_panel.getChildByName("player_panel_" + player.server2CurSitNum(i));
            if (playerInfo1) {
                playerInfo_panel.setVisible(true);
                cutil.loadPortraitTexture(playerInfo1["head_icon"], function (img) {
                    if (h1global.curUIMgr.gps_ui && h1global.curUIMgr.gps_ui.is_show) {
                        self.player_panel.getChildByName("player_panel_" + player.server2CurSitNum(i)).getChildByName("portrait_sprite").removeFromParent();
                        var portrait_sprite = new cc.Sprite(img);
                        portrait_sprite.setName("portrait_sprite");
                        portrait_sprite.setScale(72 / portrait_sprite.getContentSize().width);
                        portrait_sprite.x = 100;
                        portrait_sprite.y = 120;
                        self.player_panel.getChildByName("player_panel_" + player.server2CurSitNum(i)).addChild(portrait_sprite);
                    }
                }, playerInfo1["uuid"].toString() + ".png");
                playerInfo_panel.getChildByName("ip_label").setString(playerInfo1["ip"]);
            } else {
                playerInfo_panel.setVisible(false);
            }
            for (var j = i + 1; j < player.curGameRoom.playerNum; j++) {
                this.update_player_distance(i, j);
            }
        }
    },

    // 更新玩家之间的距离（idxFrom,idxTo是服务器座位id）
    update_player_distance: function (idxFrom, idxTo) {
        if (idxFrom < 0 || idxFrom > 3 || idxTo < 0 || idxTo > 3 || idxTo === idxFrom) {
            return
        }
        var player = h1global.entityManager.player();
        var playerInfo1 = player.curGameRoom.playerInfoList[idxFrom];
        var playerInfo2 = player.curGameRoom.playerInfoList[idxTo];

        var idxMax = (player.server2CurSitNum(idxFrom) > player.server2CurSitNum(idxTo)) ? player.server2CurSitNum(idxFrom) : player.server2CurSitNum(idxTo);
        var idxMin = (player.server2CurSitNum(idxFrom) > player.server2CurSitNum(idxTo)) ? player.server2CurSitNum(idxTo) : player.server2CurSitNum(idxFrom);
        if (idxMax === idxMin) {
            return
        }
        var line_img = this.player_panel.getChildByName("line_img_" + idxMin.toString() + "_" + idxMax.toString());
        var distance_label = this.player_panel.getChildByName("dis_label_" + idxMin.toString() + "_" + idxMax.toString());

        if (!playerInfo1 || !playerInfo2) {
            line_img.setVisible(false);
            distance_label.setVisible(false);
            return
        } else {
            line_img.setVisible(true);
            distance_label.setVisible(true);
        }

        // 设置距离
        if (playerInfo1["ip"] === playerInfo2["ip"]) {
            if (playerInfo1["lat"] == "" || playerInfo1["lng"] == "" || playerInfo1["location"] == ""
                || playerInfo2["lat"] == "" || playerInfo2["lng"] == "" || playerInfo2["location"] == "") {
                distance_label.setString("未知距离  IP相同");
            } else {
                distance_label.setString(Math.ceil(cutil.calc_distance(playerInfo1["lat"], playerInfo1["lng"], playerInfo2["lat"], playerInfo2["lng"])) + "米 IP相同");
            }
        } else {
            if (playerInfo1["lat"] == "" || playerInfo1["lng"] == "" || playerInfo1["location"] == ""
                || playerInfo2["lat"] == "" || playerInfo2["lng"] == "" || playerInfo2["location"] == "") {
                distance_label.setString("未知距离  IP不相同");
            } else {
                distance_label.setString(Math.ceil(cutil.calc_distance(playerInfo1["lat"], playerInfo1["lng"], playerInfo2["lat"], playerInfo2["lng"])) + "米 IP不相同");
            }
        }

    },
});