// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var ActivitiesUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/ActivitiesUI.json";

    },
    initUI: function () {
        this.activities_panel = this.rootUINode.getChildByName("activities_panel");
        var self = this;

        this.activities_panel.getChildByName("return_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });

        this.last_idx = 0;
        this.init_activity();
        this.dataList = [];
        //测试
        // self.dataList = ["最新活动", "第二个活动", "第三个活动", "第四个活动", "第五个活动",];
        // this.imgUrlList = ["res/ui/ActivitiesUI/advitisement.png", "res/ui/ActivitiesUI/not_afford.png",
        //     "res/ui/ActivitiesUI/hottest_img.png",
        //     "res/ui/ActivitiesUI/advitisement.png",
        //     "res/ui/ActivitiesUI/hottest_light_img.png"];
        // self.init_activity_panel();
    },

    init_activity: function () {
        var self = this;
        cutil.get_activity_info(function (content) {
            var info = eval('(' + content + ')');
            cc.log("content : ", info);
            self.dataList = info;
            self.init_activity_panel();
        });
    },

    init_activity_panel: function () {
        var activity_no_img = this.activities_panel.getChildByName("activity_no_img");
        var activity_no_label = this.activities_panel.getChildByName("activity_no_label");
        var black_bg_img = this.activities_panel.getChildByName("black_bg_img");
        var yellow_bg_img = this.activities_panel.getChildByName("yellow_bg_img");
        cc.log("dataList: ", this.dataList);
        if (this.dataList.length === 0) {
            activity_no_img.setVisible(true);
            activity_no_label.setVisible(true);
            black_bg_img.setVisible(false);
            yellow_bg_img.setVisible(false);
        } else {
            activity_no_img.setVisible(false);
            activity_no_label.setVisible(false);
            black_bg_img.setVisible(true);
            yellow_bg_img.setVisible(true);
            this.update_activity();
        }
    },

    update_activity: function () {
        var self = this;
        this.activity_btn_list = [];
        this.activity_label_list = [];
        for (var i = 0; i < 5; i++) {
            var activity_btn = this.activities_panel.getChildByName("activity_btn" + i.toString());
            activity_btn.setVisible(false);
            this.activity_btn_list.push(activity_btn);
            var activity_label = this.activities_panel.getChildByName("activity_label" + i.toString());
            activity_label.setVisible(false);
            this.activity_label_list.push(activity_label);
        }

        function activity_btn_event(sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                for (var i = 0; i < self.activity_btn_list.length; i++) {
                    if (sender !== self.activity_btn_list[i]) {
                        self.activity_btn_list[i].setTouchEnabled(true);
                        self.activity_btn_list[i].setBright(true);
                    } else {
                        sender.setTouchEnabled(false);
                        sender.setBright(false);
                        self.update_activity_img(i);
                    }
                }
            }
        }

        for (var i = 0; i < this.dataList.length; i++) {
            this.activity_btn_list[i].setVisible(true);
            this.activity_btn_list[i].addTouchEventListener(activity_btn_event);
            this.activity_label_list[i].setString(this.dataList[i]);
            this.activity_label_list[i].setVisible(true);
        }
        this.activity_btn_list[0].setBright(false);
        self.update_activity_img(0);
    },

    update_activity_img: function (idx) {
        var self = this;
        cutil.loadRemoteTexture("http://mypdk.game918918.com/activity_image" + (idx + 1).toString() + ".png", function (img) {
        // cutil.loadRemoteTexture(this.imgUrlList[idx], function (img) {
            var yellow_bg_img = self.activities_panel.getChildByName("yellow_bg_img");
            yellow_bg_img.getChildByName("portrait_sprite" + self.last_idx.toString()).removeFromParent();
            var portrait_sprite = new cc.Sprite(img);
            portrait_sprite.setScale(1);
            portrait_sprite.setName("portrait_sprite" + (idx + 1).toString());
            portrait_sprite.x = yellow_bg_img.getContentSize().width * 0.5;
            portrait_sprite.y = yellow_bg_img.getContentSize().height * 0.5;
            yellow_bg_img.addChild(portrait_sprite);
            self.last_idx = idx + 1;
        }, "activity_img" + idx.toString() + ".png");
    }
});