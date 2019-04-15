// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var UnionCreateUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/UnionCreateUI.json";

    },

    initUI: function () {
        this.unioncreate_panel = this.rootUINode.getChildByName("unioncreate_panel");
        var self = this;
        this.player = h1global.entityManager.player();

        //输入框
        this.name_tf = new MyEditBox("输入", "黑体", 35, "res/ui/UnionPopUI/bg_txt_img.png");
        this.name_tf.setAnchorPoint(0, 0.5);
        this.name_tf.setPos(285, 400);
        this.rootUINode.addChild(this.name_tf);
        this.name_tf.setMaxLength(6);
        this.name_tf.setTextColor(cc.color(135, 85, 27, 255));
        //
        this.unioncreate_panel.getChildByName("cancel_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });

        this.unioncreate_panel.getChildByName("confirm_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType === ccui.Widget.TOUCH_ENDED) {
                if (self.info === const_val.CREATE_UNION) {
                    var name = self.name_tf.getString();
                    if (self.isNull(name)){
                        h1global.curUIMgr.uniontip_ui.show_name(const_val.NAME_NO_STANDARD);
                    }else {
                        self.player.reqCreateGroup(name);
                        self.hide()
                    }
                    // 发送到服务端，检查名字是否合法重复
                } else if (self.info === const_val.CREATE_MATCH) {
                    var name = self.name_tf.getString();
                    cc.log("reqCreateGroup ", name);
                    // 发送到服务端，检查名字是否合法重复
                    if (self.isNull(name)){
                        h1global.curUIMgr.uniontip_ui.show_name(const_val.NAME_NO_STANDARD);
                    }else {
                        h1global.curUIMgr.unionhall_ui.create_team_name(name);
                        h1global.curUIMgr.unioncreateroom_ui.show();
                        self.hide();
                    }
                }else if (self.info === const_val.TIP_MODIFY){
                    // 发送到服务端，检查名字是否合法重复
                    var string = self.name_tf.getString();
                    if (self.isNull(string)){
                        h1global.curUIMgr.uniontip_ui.show_name(const_val.NAME_NO_STANDARD);
                    }else {
                        if (h1global.curUIMgr.unionhall_ui && h1global.curUIMgr.unionhall_ui.is_show) {
                            h1global.curUIMgr.unionhall_ui.sendmodifyGroupName(string);
                        }
                        self.hide();
                    }
                }
            }
        });
    },
    isNull:function( str ){
        if ( str == "" ) return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    },

    show_name: function (info) {
        var self = this;
        this.info = info;
        this.show(function () {
            if (self.info === const_val.CREATE_UNION) {
                self.unioncreate_panel.getChildByName("title_label").setString("输入公会名称（不超过6个字）");
            } else if (self.info === const_val.CREATE_MATCH) {
                self.unioncreate_panel.getChildByName("title_label").setString("输入赛事名称（不超过6个字）");
            }else if(self.info === const_val.TIP_MODIFY){
                self.unioncreate_panel.getChildByName("title_label").setString("请输入公会名称（不超过6个字）");
            }
        });
    }
});