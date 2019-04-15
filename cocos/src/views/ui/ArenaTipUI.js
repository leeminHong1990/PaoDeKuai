var ArenaTipUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/ArenaTipUI.json";
        this.sportId = 0;
    },
    initUI: function () {
        this.arena_tip_panel = this.rootUINode.getChildByName("arena_tip_panel");
        var self = this;
        var player = h1global.entityManager.player();

        //重新开始
        var give_up_btn = this.arena_tip_panel.getChildByName("give_up_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                player.giveUpWeeklySport();
                player.joinSport(self.sportId);
                self.hide();
            }
        });

        //继续比赛
        var take_game_btn = this.arena_tip_panel.getChildByName("take_game_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                player.joinSport(self.sportId);
                self.hide();
            }
        });

        //继续比赛
        this.arena_tip_panel.getChildByName("return_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        })

        var sign_up_btn = this.arena_tip_panel.getChildByName("sign_up_btn");
        sign_up_btn.addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                player.joinSport(self.sportId);
                self.hide();
            }
        });

    },

    show_ui: function (flag,sportId) {
        var self = this;
        this.show(function () {
            self.sportId = sportId;
            var give_up_btn = self.arena_tip_panel.getChildByName("give_up_btn");
            var sign_up_btn = self.arena_tip_panel.getChildByName("sign_up_btn");
            var take_game_btn = self.arena_tip_panel.getChildByName("take_game_btn");
            var tip_label = self.arena_tip_panel.getChildByName("tip_label");
            if (flag == 1){
                give_up_btn.setVisible(false);
                take_game_btn.setVisible(false);
                sign_up_btn.setVisible(true);
                tip_label.setString("报名之后开始扣费(前三次免费);\n比赛开始中途不允许退出");
            }else if (flag == 2){
                give_up_btn.setVisible(false);
                take_game_btn.setVisible(false);
                sign_up_btn.setVisible(true);
                tip_label.setString("报名之后开始扣费;\n周赛需打完3轮积分记入排行榜");
            }else if(flag == 3){
                give_up_btn.setVisible(true);
                take_game_btn.setVisible(true);
                sign_up_btn.setVisible(false);
                tip_label.setString("是否继续当前竞赛?");
            }
        });
    }
});