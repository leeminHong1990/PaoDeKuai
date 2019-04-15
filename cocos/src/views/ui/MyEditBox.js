/**
 * Created by liyifei on 2017/11/16.
 */
"use strict";
var
MyEditBox = cc.Node.extend({
    hit: null,
    model: null,
    //  placeholder：占位字符，fontName:字体名字，fontSize:字体大小，
    //  BackgroundPath：背景资源，model==1表示加载的资源比较大
    ctor: function (placeholder, fontName, fontSize, BackgroundPath, model) {
        this._super();
        this.model = model;
        this.initBackGround(BackgroundPath);
        this.initTextField(placeholder, fontName, fontSize);
        this.initLight(fontName, fontSize);
        this.addListener();
    },
    initTextField: function (placeholder, fontName, fontSize) {
        this.tf = new ccui.TextField(placeholder, fontName, fontSize);
        if (this.model && this.model == 1) {
            this.tf.setAnchorPoint(0, 1);
        } else {
            this.tf.setAnchorPoint(0, 0.5);
        }
        this.tf.setMaxLengthEnabled(true);
        this.tf.setTouchEnabled(false);
        this.addChild(this.tf);
        this.hit = placeholder;
    },
    initBackGround: function (BackgroundPath) {
        this.backGround = new cc.Sprite(BackgroundPath);
        if (this.model && this.model == 1) {
            this.backGround.setAnchorPoint(0, 1);
        } else {
            this.backGround.setAnchorPoint(0, 0.5);
        }
        this.addChild(this.backGround);
    },
    initLight: function (fontName, fontSize) {
        this.light = new cc.LabelTTF("|", fontName, fontSize);
        this.light.setColor(cc.color(0, 0, 0));
        if (this.model && this.model == 1) {
            this.light.setAnchorPoint(0, 1);
        } else {
            this.light.setAnchorPoint(0, 0.5);
        }
        this.addChild(this.light);
        var seq = cc.sequence(cc.fadeIn(0.3), cc.delayTime(0.3), cc.fadeOut(0.3));
        var forever = cc.repeatForever(seq);
        this.light.runAction(forever);
        this.hiddenLight();
    },
    setMaxLength: function (length) {
        this.tf.setMaxLengthEnabled(true);
        this.tf.setMaxLength(length);
    },

    setTextColor: function (color) {
        this.tf.setTextColor(color);
    },
    onTouchBegan: function (touch, event) {
        if (this.tf.isVisible()){
            var pos = cc.p(touch.getLocationX(), touch.getLocationY());
            var target = event.getCurrentTarget();
            if (cc.rectContainsPoint(target.getBoundingBoxToWorld(), pos)) {
                setTimeout(function () {
                    this.tf.getVirtualRenderer().attachWithIME();
                }.bind(this), 0);
                this.showLight();
                return true;
            } else {
                setTimeout(function () {
                    this.tf.getVirtualRenderer().detachWithIME();
                    this.tf.setPlaceHolder(this.hit)
                }.bind(this), 0);
                this.hiddenLight();
                return false;
            }
        }
    },
    hiddenHit: function () {
        this.tf.setPlaceHolder("")
    },
    setPasswordEnabled: function (enable) {
        this.tf.setPasswordEnabled(enable);
    },
    setString: function (str) {
        this.tf.setString(str);
    },
    getString: function () {
        return this.tf.getString();
    },
    setPos: function (width, height) {
        this.x = width;
        this.y = height;
    },
    addListener: function () {
        // TextField 事件
        this.tf.addEventListener(this.textFieldEvent, this);

        // 点击事件
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.onTouchBegan.bind(this)
        }), this.backGround);
    },

    showLight: function () {
        this.light.setVisible(true);
        var sv = this.tf.getString();
        if (!!sv && sv.length > 0) {
            this.light.setPositionX(this.tf.width - this.light.width * 0.5 + 1);
        } else {
            // 存在焦点
            this.light.setPositionX(this.light.width * 0.5);
            this.hiddenHit();
        }
    },
    hiddenLight: function () {
        this.light.setVisible(false);
    },

    setVisible:function (isTrue) {
        this._super(isTrue);
        this.tf.setVisible(isTrue);
    },

    textFieldEvent: function (textField, type) {
        if (this.tf.isVisible()){
            switch (type) {
                case ccui.TextField.EVENT_ATTACH_WITH_IME:
                    this.showLight();
                    break;
                case ccui.TextField.EVENT_DETACH_WITH_IME:
                    this.hiddenLight();
                    break;
                case ccui.TextField.EVENT_INSERT_TEXT:
                    this.showLight();
                    break;
                case ccui.TextField.EVENT_DELETE_BACKWARD:
                    this.showLight();
                    break;
                default:
                    break;
            }
        }
    }
})
