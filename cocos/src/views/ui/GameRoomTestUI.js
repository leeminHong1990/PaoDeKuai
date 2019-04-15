"use strict";
var GameRoomTestUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/GameRoomTestUI.json";
        this.setLocalZOrder(1);
    },
    initUI: function () {
        var self = this;
        var bg_panel = this.rootUINode.getChildByName('bg_panel');
        bg_panel.addTouchEventListener(function(sender, eventType){
            if(eventType == ccui.Widget.TOUCH_ENDED){
                self.hide();
            }
        });
    },
    update_hand_card_panel:function (idx, card_list) {
        if(idx == 0){
            return;
        }
        var hand_card_panel = this.rootUINode.getChildByName('hand_card_panel_' + idx.toString());
        card_list = this.convert2HandCards(card_list);
        for (var i = 0; i < 16; i++) {
            var card = hand_card_panel.getChildByName("card_" + String(i));
            if(card_list[i]){
                card.loadTexture("Card/" + card_list[i].toString() + ".png", ccui.Widget.PLIST_TEXTURE);
                card.setVisible(true);
            } else {
                card.setVisible(false);
            }
        }

        hand_card_panel.setVisible(true);
    },
    convert2HandCards: function (cards) {
        var newList = [];
        var shadow_cards = [];
        shadow_cards = shadow_cards.concat(cards).sort(cutil.tileSortFunc);
        var idx = Math.floor(shadow_cards.length / 2);
        for (var i = 0; i < shadow_cards.length; i++) {
            if (i % 2 === 0) {
                idx += i
            } else {
                idx -= i
            }
            newList.push(shadow_cards[idx])
        }
        return newList
    },
});