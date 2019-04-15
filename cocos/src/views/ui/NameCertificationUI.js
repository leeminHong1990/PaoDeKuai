// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
var NameCertificationUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/NameCertificationUI.json";

    },
    initUI: function () {
        this.certification_panel = this.rootUINode.getChildByName("certification_panel");
        var self = this;

        //
        this.certification_panel.getChildByName("return_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType == ccui.Widget.TOUCH_ENDED) {
                self.hide();
            }
        });
        this.certification_panel.getChildByName("confirm_btn").addTouchEventListener(function (sender, eventType) {
            if (eventType == ccui.Widget.TOUCH_ENDED) {
                let player = h1global.entityManager.player();
                let info_dict = eval('(' + cc.sys.localStorage.getItem("INFO_JSON") + ')');
                let name = self.name_tf.getString();
                if (self.isNull(name) || !self.isName(name)){
                    h1global.globalUIMgr.info_ui.show_by_info("名字不符合规范！", cc.size(300, 200));
                }else {
                    let id = self.id_tf.getString();
                    if (!self.isID(id)){
                        h1global.globalUIMgr.info_ui.show_by_info("身份证号码不符合规范！", cc.size(300, 200));
                    }else {
                        let info ={
                            "id_name": name,
                            "id_number": id
                        }
                        player.updateRealNameInfo(info);
                        self.hide();
                    }
                }
            }
        });

        //输入框 名字
        this.name_tf = new MyEditBox("请输入名字", "黑体", 35,"res/ui/NameCertificationUI/txt_bg_img.png");
        this.name_tf.setAnchorPoint(0, 0);
        this.name_tf.setPos(430,432);
        this.rootUINode.addChild(this.name_tf);
        this.name_tf.setMaxLength(10);
        this.name_tf.setTextColor(cc.color(135, 85, 27, 255));


        //输入框 身份证
        this.id_tf = new MyEditBox("请输入身份证号", "黑体", 35,"res/ui/NameCertificationUI/txt_bg_img.png");
        this.id_tf.setAnchorPoint(0, 0);
        this.id_tf.setPos(430,320);
        this.rootUINode.addChild(this.id_tf);
        this.id_tf.setMaxLength(18);
        this.id_tf.setTextColor(cc.color(135, 85, 27, 255));
    },

    IsNeedshow:function () {
        var player = h1global.entityManager.player();
        player.IsNeedRealName();
    },

    isNull:function( str ){
        if ( str == "" ) return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    },

    isName:function( str ){
        if ( str == "" ) return false;
        var regu = /^[\u4E00-\u9FA5]{2,4}$/;
        var re = new RegExp(regu);
        return re.test(str);
    },

    isID:function ( id ) {
        if (id === 0){
            return false;
        }
        var regu = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        var re = new RegExp(regu);
        return re.test(id);
    }
});