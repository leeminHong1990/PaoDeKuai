/**
 * Created by liyifei on 2018/02/02.
 */
"use strict";
var RevolvingMenu = cc.Layer.extend({
    //菜单已经旋转角度 弧度
    _angle: 0,
    //菜单项集合,_children顺序会变化，新建数组保存顺序
    _items: [],
    //单位角度 弧度
    _unitAngle: 0,
    //当前被选择的item
    _selectedItem: null,
    //动画运行时间
    animationDuration: 0.3,
    _ContentSize: null,
    _callbacklist: [],

    ctor: function () {
        this._super();
        this.init();
        this.addListener();
    },

    init: function () {
        this._angle = 0.0;
        this.ignoreAnchorPointForPosition(false);
        this._selectedItem = null;
        var s = cc.director.getWinSize();
        this._ContentSize = cc.size(s.width * 0.4, s.height * 0.4);
        this.setAnchorPoint(cc.p(0.5, 0.5));

        //
        this._unitAngle = 0;
        this._items = [];
        this._callbacklist = [];
    },

    addListener: function () {
        // 事件
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this)
        }), this);
    },

    addMenuItem: function (item, callback) {
        item.setPosition(this._ContentSize.width / 2, this._ContentSize.height / 2);
        this.addChild(item);
        this._items.push(item);
        this._callbacklist.push(callback);
        this.setUnitAngle(2 * Math.PI / this._items.length);
        this.reset();
        this.updatePositionWithAnimation();
        return;
    },

    updatePosition: function () {
        var menuSize = this._ContentSize;
        var disY = menuSize.height / 8;
        var disX = menuSize.width / 3;
        for (var i = 0; i < this._items.length; i++) {
            var x = menuSize.width / 2 + disX * Math.sin(i * this._unitAngle + this.getAngle());
            var y = menuSize.height / 2 - disY * Math.cos(i * this._unitAngle + this.getAngle());
            this._items[i].setPosition(cc.p(x, y));
            this._items[i].setLocalZOrder(-y);
            //Opacity  129~255
            this._items[i].setOpacity(210 + 45 * Math.cos(i * this._unitAngle + this.getAngle()));
            //  this._items[i].getNormalImage().setColor(cc.color(225 + 30 * Math.cos(i * this._unitAngle + this.getAngle())
            //      ,225 + 30 * Math.cos(i * this._unitAngle + this.getAngle()),
            //      225 + 30 * Math.cos(i * this._unitAngle + this.getAngle())));
            this._items[i].setScale(0.9 + 0.1 * Math.cos(i * this._unitAngle + this.getAngle()));
        }
        return;
    },

    updatePositionWithAnimation: function () {
        //先停止所有可能存在的动作
        for (var i = 0; i < this._items.length; i++) {
            this._items[i].stopAllActions();
        }
        var menuSize = this._ContentSize;
        var disY = menuSize.height / 7;
        var disX = menuSize.width / 3;
        for (var i = 0; i < this._items.length; i++) {
            var x = menuSize.width / 2 + disX * Math.sin(i * this._unitAngle + this.getAngle());
            var y = menuSize.height / 2 - disY * Math.cos(i * this._unitAngle + this.getAngle());
            this._items[i].runAction(cc.moveTo(this.animationDuration, cc.p(x, y)));
            //Opacity  129~255
            // this._items[i].getNormalImage().setColor(cc.color(225 + 30 * Math.cos(i * this._unitAngle + this.getAngle())
            //     ,225 + 30 * Math.cos(i * this._unitAngle + this.getAngle()),
            //     225 + 30 * Math.cos(i * this._unitAngle + this.getAngle())));
            this._items[i].runAction(cc.fadeTo(this.animationDuration, (210 + 45 * Math.cos(i * this._unitAngle + this.getAngle()))));
            //缩放比例  0.8~1
            this._items[i].runAction(cc.scaleTo(this.animationDuration, 0.9 + 0.1 * Math.cos(i * this._unitAngle + this.getAngle())))
            this._items[i].setLocalZOrder(-y);
        }
        this.scheduleOnce(this.actionEndCallBack, this.animationDuration, "1");
        return;
    },

    reset: function () {
        this._angle = 0;
    },

    setAngle: function (angle) {
        this._angle = angle;
    },

    getAngle: function () {
        return this._angle;
    },

    setUnitAngle: function (angle) {
        this._unitAngle = angle;
    },

    getUnitAngle: function () {
        return this._unitAngle;
    },

    disToAngle: function (dis) {
        var width = this._ContentSize.width / 2;
        return dis / width * this.getUnitAngle();
    },

    getCurrentItem: function () {
        if (this._items.length === 0)
            return null;
        //这里实际加上了0.1getAngle(),用来防止精度丢失
        var index = Math.floor((2 * Math.PI - this.getAngle()) / this.getUnitAngle() + 0.1 * this.getUnitAngle());
        index %= this._items.length;
        return this._items[index];
    },

    getCurrentcallback: function () {
        if (this._items.length === 0)
            return null;
        //这里实际加上了0.1getAngle(),用来防止精度丢失
        var index = Math.floor((2 * Math.PI - this.getAngle()) / this.getUnitAngle() + 0.1 * this.getUnitAngle());
        index %= this._items.length;
        var callback = this._callbacklist[index];
        if (callback) {
            callback();
        }
    },

    onTouchBegan: function (touch, event) {
        //先停止所有可能存在的动作
        for (var i = 0; i < this._items.length; i++) {
            this._items[i].stopAllActions();
        }
        if (this._selectedItem) {
            this._selectedItem.unselected();
        }
        var position = this.convertToNodeSpace(touch.getLocation());
        var size = this._ContentSize;
        var rect = cc.rect(0, 0, size.width, size.height);
        if (cc.rectContainsPoint(rect, position)) {
            return true;
        }
        return false;
    },

    onTouchEnded: function (touch, event) {
        var xDelta = touch.getLocation().x - touch.getStartLocation().x;
        this.rectify(xDelta > 0);
        if (this.disToAngle(Math.abs(xDelta)) < this.getUnitAngle() / 6 && this._selectedItem)
            this._selectedItem.activate();
        this.updatePositionWithAnimation();
        return;
    },

    onTouchMoved: function (touch, event) {
        var angle = this.disToAngle(touch.getDelta().x);
        this.setAngle(this.getAngle() + angle);
        this.updatePosition();
        return;
    },

    rectify: function (forward) {
        var angle = this.getAngle();
        while (angle < 0)
            angle += Math.PI * 2;
        while (angle > Math.PI * 2)
            angle -= Math.PI * 2;
        if (forward > 0)
            angle = (Math.floor((angle + this.getUnitAngle() / 3 * 2) / this.getUnitAngle())) * this.getUnitAngle();
        else
            angle = (Math.floor((angle + this.getUnitAngle() / 3 ) / this.getUnitAngle())) * this.getUnitAngle();
        this.setAngle(angle);
    },

    actionEndCallBack: function (dx) {
        this._selectedItem = this.getCurrentItem();
        if (this._selectedItem)
            this._selectedItem.selected();

        this.getCurrentcallback();
    }
});
