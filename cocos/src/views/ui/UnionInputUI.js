// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var UnionInputUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/UnionInputUI.json";
    },

    initUI: function () {
        this.input_panel = this.rootUINode.getChildByName("input_panel");
        var self = this;
        //
        this.input_panel.getChildByName("cancel_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType == ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });

        this.input_panel.getChildByName("confirm_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType == ccui.Widget.TOUCH_ENDED) {
                if (self.info === const_val.TIP_NOTICE){
                    // 发送到服务端，检查名字是否合法重复
                    var string = self.name_tf.getString();
                    if (self.isNull(string)){
                        h1global.curUIMgr.uniontip_ui.show_name(const_val.NAME_NO_STANDARD);
                    }else {
                        if (h1global.curUIMgr.unionhall_ui && h1global.curUIMgr.unionhall_ui.is_show) {
                            h1global.curUIMgr.unionhall_ui.sendmodifyGroupBillboard(string);
                        }
                        self.hide();
                    }
                }else if (self.info.id === const_val.TIP_REMARK){
                    // 发送到服务端，检查名字是否合法重复
                    var string = self.name_tf.getString();
                    if (self.isNull(string)){
                        h1global.curUIMgr.uniontip_ui.show_name(const_val.NAME_NO_STANDARD);
                    }else {
                        if (h1global.curUIMgr.unionhall_ui && h1global.curUIMgr.unionhall_ui.is_show) {
                            h1global.curUIMgr.unionhall_ui.sendMarkMember(self.info.userid,string);
                        }
                        self.hide();
                    }
                }
            }
        });

        //输入框
        this.name_tf = new MyEditBox("输入", "黑体", 25,"res/ui/UnionPopUI/remark_bg_img.png",1);
        this.name_tf.setAnchorPoint(0,1);
        this.name_tf.setPos(285,460);
        this.rootUINode.addChild(this.name_tf);
        this.name_tf.setMaxLength(25);
        this.name_tf.setTextColor(cc.color(135, 85, 27, 255));
        this.name_tf.addListener();

    },

    isNull:function( str ){
        if ( str == "" ) return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    },

    show_name:function (info) {
        if (!info){
            return null
        }
        var self = this;
        this.info = info;
        this.show(function () {
            if (self.info === const_val.TIP_NOTICE){
                self.input_panel.getChildByName("input_label").setString("请输入公告（不超过25个字）");
                self.input_panel.getChildByName("title_img").loadTexture("res/ui/UnionPopUI/notice_img.png");
            }else if (self.info.id === const_val.TIP_REMARK){
                self.input_panel.getChildByName("input_label").setString("请输入备注（不超过25个字）");
                self.input_panel.getChildByName("title_img").loadTexture("res/ui/UnionPopUI/remarks_img.png");
            }
        });
    }
});