"use strict";
/*-----------------------------------------------------------------------------------------
 interface
 -----------------------------------------------------------------------------------------*/
var impGameRules = impGameOperation.extend({
    __init__: function () {
        this._super();
        KBEngine.DEBUG_MSG("Create impGameRules");
        this.tipsList = [];
        this.tips_indx = -1;
    },

    getNextTips: function () {
        cc.log("getNextTips");
        this.tips_indx += 1;
        if (this.tipsList.length !== 0) {
            if (this.tips_indx >= this.tipsList.length) {
                this.tips_indx = 0;
            }

            cc.log("tipsList : ", this.tipsList);
            return this.tipsList[this.tips_indx]
        }
        return [];
    },

    getTipsCards: function (comePosi) {
        cc.log("getTipsCards: ", comePosi);
        this.tips_indx = -1;
        if (this.curGameRoom.controllerIdx === this.serverSeatNum) {
            var tips = this.getSingleTips(0, true);  //单张
            tips = tips.concat(this.getDoubleTips(0, true));  //对子
            tips = tips.concat(this.getSerialPairTips(2, 2, true)); //连对
            tips = tips.concat(this.getSingleSerialTips());  //顺子
            tips = tips.concat(this.getTripleBring(5, [])); // 三带二
            tips = tips.concat(this.getTipsPlane([]));  //飞机
            tips = tips.concat(this.getTipsFourBring([], 2));  //四带二
            tips = tips.concat(this.getTipsFourBring([], 3));  //四带三
            tips = tips.concat(this.getBombTips());  //炸弹
            this.tipsList = tips;
            cc.log("getTipsCards", this.tipsList)
        } else {
            //压过上家
            var preDiscardCards = this.curGameRoom.controller_discard_list;
            var controllerCards = cutil.rightShiftCards(preDiscardCards);
            var controllerCardsType = cutil.getNormalCardsType(controllerCards, [], 0, this.curGameRoom.gamePlays);
            controllerCards.sort(function (a, b) {
                return a - b;
            });
            cc.log("上家的牌 :" + controllerCards + " 上家的牌的类型:  " + controllerCardsType);
            var tips = [];
            if (controllerCardsType === const_val.TYPE_SINGLE) {  //单张
                tips = this.getSingleTips(controllerCards[0]);
                tips = tips.concat(this.getBombTips());
            } else if (controllerCardsType === const_val.TYPE_PAIR) {  //对子
                tips = this.getDoubleTips(controllerCards[0]);
                tips = tips.concat(this.getBombTips());
            } else if (controllerCardsType === const_val.TYPE_SERIAL_PAIR) {  //连对
                tips = this.getSerialPairTips(controllerCards.length / 2, controllerCards[0], false);
                tips = tips.concat(this.getBombTips());
            } else if (controllerCardsType === const_val.TYPE_TRIPLE) {  // 三张(三不带)
                tips = this.getTripleTips(controllerCards[0]);
                tips = tips.concat(this.getBombTips());
            } else if (controllerCardsType === const_val.TYPE_SERIAL_SINGLE) {  //顺子
                tips = this.getSingleSerialTips(controllerCards.length, controllerCards[0]);
                tips = tips.concat(this.getBombTips());
            } else if (controllerCardsType === const_val.TYPE_BOMB) {   //炸弹
                tips = this.getBombTips(preDiscardCards);
            } else if (controllerCardsType === const_val.TYPE_TRIPLE_TWO) {  //三带二
                tips = this.getTripleBring(controllerCards.length / 5, controllerCards);
                tips = tips.concat(this.getBombTips());
            } else if (controllerCardsType === const_val.TYPE_PLANE_ONE) {  //飞机
                tips = this.getTipsPlane(controllerCards);
                tips = tips.concat(this.getBombTips());
            } else if (controllerCardsType === const_val.TYPE_FOUR_TWO) {  //四带二
                tips = this.getTipsFourBring(controllerCards, 2);
                tips = tips.concat(this.getBombTips());
            } else if (controllerCardsType === const_val.TYPE_FOUR_THREE) {  //四带三
                tips = this.getTipsFourBring(controllerCards, 3);
                tips = tips.concat(this.getBombTips());
            }
            this.tipsList = tips;
            cc.log("2222getTipsCards", this.tipsList)
        }
    },

    getSingleTips: function (min_card, isOnlySingle) {
        cc.log("getSingleTips");
        //手牌
        var cards = cutil.deepCopy(this.curGameRoom.playerPokerList[this.serverSeatNum]);
        cards.sort(function (a, b) {
            return a - b;
        });       //从小到大排列
        var shiftCards = cutil.rightShiftCards(cards); //右移后手牌
        var shiftCards2NumDict = cutil.getCard2NumDict(shiftCards);

        var tipList = [];
        var allList = [];
        // 仅有一张优先
        for (var i = 0; i < shiftCards.length; i++) {
            if ((!min_card || shiftCards[i] > min_card) && shiftCards2NumDict[shiftCards[i]] === 1) {
                tipList.push([cards[i]]);
                allList.push(cards[i] >> 3);
            }
        }
        // 2张
        if (!isOnlySingle) {
            for (var i = 0; i < shiftCards.length; i++) {
                if ((!min_card || shiftCards[i] > min_card) && shiftCards2NumDict[shiftCards[i]] === 2 && allList.indexOf(shiftCards[i]) < 0) {
                    tipList.push([cards[i]]);
                    allList.push(cards[i] >> 3);
                }
            }
        }
        // 3张
        if (!isOnlySingle) {
            for (var i = 0; i < shiftCards.length; i++) {
                if ((!min_card || shiftCards[i] > min_card) && shiftCards2NumDict[shiftCards[i]] === 3 && allList.indexOf(shiftCards[i]) < 0) {
                    tipList.push([cards[i]]);
                    allList.push(cards[i] >> 3);
                }
            }
        }
        cc.log("单张提示:", tipList);
        return tipList
    },

    getDoubleTips: function (min_card, isOnlyPair) {
        cc.log("getDoubleTips");
        var tipList = [];
        var handCards = cutil.deepCopy(this.curGameRoom.playerPokerList[this.serverSeatNum]);
        handCards.sort(function (a, b) {
            return a - b;
        });       //从小到大排列
        if (handCards.length < 2) {
            return tipList;
        }
        var classList = cutil.classifyCards(handCards);
        var cards = classList[0];
        var keyCardNum = classList[1].length;
        var keyCard = classList[1][0];
        var shiftCards = cutil.rightShiftCards(cards); //右移后手牌
        var shiftCards2NumDict = cutil.getCard2NumDict(shiftCards);

        // cc.log("对子提示 handCards：", handCards);
        // cc.log("对子提示 cards: ",classList[0], cards);
        // cc.log("对子提示 shiftCards: ", shiftCards);

        // 仅有一对优先
        for (var i = 0; i < shiftCards.length - 1; i++) {
            if (shiftCards[i] === shiftCards[i + 1] && (!min_card || shiftCards[i] > min_card) && shiftCards2NumDict[shiftCards[i]] === 2) {
                tipList.push([cards[i], cards[i + 1]])
            }
        }
        // 3张第二
        if (!isOnlyPair) {
            for (var i = 0; i < shiftCards.length - 1; i++) {
                if (shiftCards[i] === shiftCards[i + 1] && (!min_card || shiftCards[i] > min_card) && shiftCards2NumDict[shiftCards[i]] === 3) {
                    i++;
                    tipList.push([cards[i], cards[i + 1]])
                }
            }
        }

        // 癞子的情况
        var keyTipList = [];
        if (this.curGameRoom.gameMode === 2 && keyCardNum > 0) {
            var oneKeyList = [];
            for (var card in shiftCards2NumDict) {
                if (shiftCards2NumDict[card] === 1 && parseInt(card) > min_card) {
                    oneKeyList.push(parseInt(card));
                }
            }
            if (oneKeyList.length > 0) {
                for (var i = 0; i < oneKeyList.length; i++) {
                    var keySuggestList = [];
                    keySuggestList.push(keyCard);
                    for (var j = 0; j < shiftCards.length; j++) {
                        if (oneKeyList[i] === shiftCards[j]) {
                            keySuggestList.push(parseInt(cards[j]));
                        }
                    }
                    keyTipList.push(keySuggestList);
                }
            }
            if (keyCardNum >= 2 && (keyCard >> 3) > min_card) {
                var keyList = [];
                keyList.push(keyCard);
                keyList.push(keyCard);
                keyTipList.push(keyList);
            }
        }
        // cc.log("带癞子的对子提示：", keyTipList);
        tipList = tipList.concat(keyTipList);
        cc.log("所有对子提示:", tipList);
        return tipList
    },

    getSerialPairTips: function (pairNum, min_card, isSelfDiscard) {
        cc.log("pairNum: " + pairNum + " min_card:" + min_card + " isSelfDiscard: " + isSelfDiscard);
        pairNum = pairNum || 2;
        min_card = min_card || 2;
        var tipList = [];
        var handCards = cutil.deepCopy(this.curGameRoom.playerPokerList[this.serverSeatNum]);
        handCards.sort(function (a, b) {
            return a - b;
        });       //从小到大排列
        if (handCards.length < pairNum * 2) {
            return tipList;
        }
        var classList = cutil.classifyCards(handCards);
        var cards = classList[0];
        var keyCardNum = classList[1].length;
        var shiftCards = cutil.rightShiftCards(cards);
        var shiftCards2NumDict = cutil.getCard2NumDict(shiftCards);

        var cardsBack = cards.concat([]);
        var bomb_open = this.curGameRoom.bombOpen;
        if (bomb_open === 1) {
            for (var card in shiftCards2NumDict) {
                if (shiftCards2NumDict[card] === 4) {
                    for (var idx = shiftCards.length - 1; idx >= 0; idx--) {
                        if (parseInt(card) === shiftCards[idx]) {
                            shiftCards.splice(idx, 1);
                            cardsBack.splice(idx, 1);
                        }
                    }
                }
            }
        }
        var card2ListDict = cutil.getCard2ListDict(cardsBack);

        var playerCardNum = 0;
        if (this.curGameRoom.cardNum === 15) {
            playerCardNum = 13;
        } else {
            playerCardNum = 14;
        }
        var keyCard = classList[1][0];
        // 先不考虑癞子
        for (var i = min_card + 1; i <= playerCardNum - pairNum + 1; i++) {
            var pairCardNum = 0;
            if (isSelfDiscard) {
                for (var j = 0; j < playerCardNum - pairNum + 1; j++) {
                    if (card2ListDict[i + j] && card2ListDict[i + j].length >= 2) {
                        pairCardNum += 1;
                    } else {
                        break;
                    }
                }
            } else {
                for (var j = 0; j < pairNum; j++) {
                    if (card2ListDict[i + j] && card2ListDict[i + j].length >= 2) {
                        pairCardNum += 1;
                    } else {
                        break;
                    }
                }
            }
            if (pairCardNum >= pairNum) {
                var suggestList = [];
                for (var j = 0; j < pairCardNum; j++) {
                    suggestList.push(card2ListDict[i + j][0]);
                    suggestList.push(card2ListDict[i + j][1])
                }
                suggestList.sort(function (a, b) {
                    return a - b;
                });
                tipList.push(suggestList)
            }
        }

        //带癞子的连对
        if (this.curGameRoom.gameMode === 2 && keyCardNum > 0) {
            for (var i = min_card + 1; i <= playerCardNum - pairNum + 1; i++) {
                var useKeyCardNum = keyCardNum;
                var pairCardNum = 0;
                var suggestList = [];
                for (var j = 0; j < pairNum; j++) {
                    if (!card2ListDict[i + j]) {
                        useKeyCardNum -= 2;
                        pairCardNum += 1;
                        suggestList.push(keyCard);
                        suggestList.push(keyCard)
                    } else if (card2ListDict[i + j].length >= 2) {
                        pairCardNum += 1;
                        suggestList.push(card2ListDict[i + j][0]);
                        suggestList.push(card2ListDict[i + j][1]);
                    } else if (card2ListDict[i + j].length < 2) {
                        useKeyCardNum -= 1;
                        pairCardNum += 1;
                        suggestList.push(card2ListDict[i + j][0]);
                        suggestList.push(keyCard)
                    }
                    if (useKeyCardNum < 0) {
                        pairCardNum -= 1;
                        break;
                    }
                }
                if (pairCardNum === pairNum) {
                    suggestList.sort(function (a, b) {
                        return a - b;
                    });
                    tipList.push(suggestList)
                }
            }
        }
        cc.log("连对提示:", tipList);
        return tipList
    },

    getTripleTips: function (min_card) {
        min_card = min_card || 2;
        //手牌
        var tipList = [];
        var handCards = cutil.deepCopy(this.curGameRoom.playerPokerList[this.serverSeatNum]);
        handCards.sort(function (a, b) {
            return a - b;
        });       //从小到大排列
        if (handCards.length < 3) {
            return tipList;
        }
        var classList = cutil.classifyCards(handCards);
        var cards = classList[0];
        var keyCardNum = classList[1].length;
        var shiftCards = cutil.rightShiftCards(cards); //右移后手牌
        var shiftCards2NumDict = cutil.getCard2NumDict(shiftCards);

        var threeKeyList = [];
        var bomb_open = this.curGameRoom.bombOpen;
        for (var card in shiftCards2NumDict) {
            if (bomb_open === 0 && shiftCards2NumDict[card] === 4) {
                threeKeyList.push(parseInt(card))
            }
            if (shiftCards2NumDict[card] === 3) {
                threeKeyList.push(parseInt(card))
            }
        }
        threeKeyList.sort(function (a, b) {
            return a - b;
        });
        for (var i = 0; i < threeKeyList.length; i++) {
            var serialNum = 0;
            var suggestList = [];
            for (var j = 0; j < shiftCards.length; j++) {
                if (serialNum === 3) {
                    break
                }
                if (threeKeyList[i] === shiftCards[j]) {
                    suggestList.push(cards[j]);
                    serialNum += 1;
                }
            }
            tipList.push(suggestList)
        }

        // 癞子的情况
        var keyTipList = [];
        if (this.curGameRoom.gameMode === 2 && keyCardNum > 0) {
            var oneKeyList = [];
            var twoKeyList = [];
            for (var card in shiftCards2NumDict) {
                if (card > min_card) {
                    if (shiftCards2NumDict[card] === 1) {
                        oneKeyList.push(parseInt(card));
                    }
                    if (shiftCards2NumDict[card] === 2) {
                        twoKeyList.push(parseInt(card));
                    }
                }
            }
            var keyCard = classList[1][0];
            if (keyCardNum >= 2 && oneKeyList.length > 0) {
                for (var i = 0; i < oneKeyList.length; i++) {
                    var keySuggestList = [];
                    keySuggestList.push(keyCard);
                    keySuggestList.push(keyCard);
                    for (var j = 0; j < shiftCards.length; j++) {
                        if (oneKeyList[i] === shiftCards[j]) {
                            keySuggestList.push(parseInt(cards[j]));
                        }
                    }
                    keyTipList.push(keySuggestList);
                }
            }
            if (keyCardNum >= 1 && twoKeyList.length > 0) {
                for (var i = 0; i < twoKeyList.length; i++) {
                    var keySuggestList = [];
                    keySuggestList.push(keyCard);
                    for (var j = 0; j < shiftCards.length; j++) {
                        if (twoKeyList[i] === shiftCards[j]) {
                            keySuggestList.push(parseInt(cards[j]));
                            keySuggestList.push(parseInt(cards[j + 1]));
                            break;
                        }
                    }
                    keyTipList.push(keySuggestList);
                }
            }
            if (keyCardNum >= 3) {
                var keyList = [];
                keyList.push(keyCard);
                keyList.push(keyCard);
                keyList.push(keyCard);
                keyTipList.push(keyList);
            }
        }
        // cc.log("癞子3张提示：", keyTipList);
        tipList = tipList.concat(keyTipList);
        cc.log("3张提示:", tipList);
        return tipList
    },

    getSingleSerialTips: function (serialNum, min_card) {
        cc.log("getSingleSerialTips  serialNum: " + serialNum + "  min_card: " + min_card);
        serialNum = serialNum || 5;
        min_card = min_card || 2;
        var tipList = [];
        var handCards = cutil.deepCopy(this.curGameRoom.playerPokerList[this.serverSeatNum]);
        handCards.sort(function (a, b) {
            return a - b;
        });       //从小到大排列
        if (handCards.length < serialNum) {
            return tipList;
        }
        var classList = cutil.classifyCards(handCards);
        var cards = classList[0];
        var keyCardNum = classList[1].length;
        var shiftCards = cutil.rightShiftCards(cards);
        var shiftCards2NumDict = cutil.getCard2NumDict(shiftCards);

        var cardsBack = cards.concat([]);
        var bomb_open = this.curGameRoom.bombOpen;
        if (bomb_open === 1) {
            for (var card in shiftCards2NumDict) {
                if (shiftCards2NumDict[card] === 4) {
                    for (var i = shiftCards.length - 1; i >= 0; i--) {
                        if (parseInt(card) === shiftCards[i]) {
                            shiftCards.splice(i, 1);
                            cardsBack.splice(i, 1);
                        }
                    }
                }
            }
        }
        var card2ListDict = cutil.getCard2ListDict(cardsBack);
        var keyCard = classList[1][0];
        for (var i = min_card + 1; i <= 14 - serialNum + 1; i++) {
            var singleSerialNum = 0;
            for (var j = 0; j < serialNum; j++) {
                if (card2ListDict[i + j] && card2ListDict[i + j].length >= 1) {
                    singleSerialNum += 1;
                } else {
                    break;
                }
            }
            if (singleSerialNum >= serialNum) {
                var suggestList = [];
                for (var j = 0; j < serialNum; j++) {
                    suggestList.push(card2ListDict[i + j][0]);
                }
                tipList.push(suggestList);
            }
        }

        // 带癞子的顺子
        if (this.curGameRoom.gameMode === 2 && keyCardNum > 0) {
            for (var i = min_card + 1; i <= 14 - serialNum + 1; i++) {
                var useKeyCardNum = keyCardNum;
                var singleSerialNum = 0;
                var suggestList = [];
                for (var j = 0; j < serialNum; j++) {
                    if (!card2ListDict[i + j]) {
                        useKeyCardNum -= 1;
                        singleSerialNum += 1;
                        suggestList.push(keyCard)
                    } else if (card2ListDict[i + j].length >= 1) {
                        singleSerialNum += 1;
                        suggestList.push(card2ListDict[i + j][0]);
                    } else if (card2ListDict[i + j].length < 1) {
                        useKeyCardNum -= 1;
                        singleSerialNum += 1;
                        suggestList.push(keyCard)
                    }
                    if (useKeyCardNum < 0) {
                        singleSerialNum -= 1;
                        break;
                    }
                }
                if (singleSerialNum === serialNum) {
                    suggestList.sort(function (a, b) {
                        return a - b;
                    });
                    tipList.push(suggestList)
                }
            }
        }

        cc.log("顺子提示:", tipList);
        return tipList;
    },

    getTripleBring: function (cardsNum, controllerCards) {
        cc.log("getTripleBring : " + cardsNum + "  " + controllerCards);
        var tipList = [];
        var min_card = 2;
        if (controllerCards.length !== 0) {
            var cards2NumDict = cutil.getCard2NumDict(controllerCards);
            var cardsKeyList = cutil.getKeyList(cards2NumDict);
            for (var i = 0; i < cardsKeyList.length; i++) {
                if (cards2NumDict[cardsKeyList[i]] >= 3) {
                    min_card = cardsKeyList[i];
                }
            }
        }
        var handCards = cutil.deepCopy(this.curGameRoom.playerPokerList[this.serverSeatNum]);
        handCards.sort(function (a, b) {
            return a - b;
        });       //从小到大排列
        if (handCards.length < controllerCards.length) {
            return tipList;
        }
        var classList = cutil.classifyCards(handCards);
        var cards = classList[0];
        var keyCardNum = classList[1].length;
        var keyCard = classList[1][0];
        var shiftCards = cutil.rightShiftCards(cards);
        var shiftCards2NumDict = cutil.getCard2NumDict(shiftCards);
        // cc.log("cards : " + cards); //cards : 25,26,27,28,33,34,35,36,41,42,43,44,49,50,51,52,129,144,152
        // cc.log("shiftCards : " + shiftCards); //shiftCards : 3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,16,18,19

        var oneKeyList = [];
        var twoKeyList = [];
        var threeKeyList = [];
        var fourKeyList = [];
        var bomb_open = this.curGameRoom.bombOpen;
        for (var card in shiftCards2NumDict) {
            if (min_card < parseInt(card)) {
                if (bomb_open === 0) {
                    if (shiftCards2NumDict[card] >= 3) {
                        threeKeyList.push(parseInt(card));
                    }
                } else {
                    if (shiftCards2NumDict[card] === 3) {
                        threeKeyList.push(parseInt(card));
                    }
                }
                if (shiftCards2NumDict[card] === 1) {
                    oneKeyList.push(parseInt(card))
                }
                if (shiftCards2NumDict[card] === 2) {
                    twoKeyList.push(parseInt(card))
                }
            }
            if (shiftCards2NumDict[card] === 4) {
                fourKeyList.push(parseInt(card));
            }
        }

        // cc.log("threeKeyList: ", threeKeyList);
        for (var i = 0; i < threeKeyList.length; i++) {
            var shiftCardsBack = shiftCards.concat([]);
            var cardsBack = cards.concat([]);
            for (var j = shiftCardsBack.length - 1; j >= 0; j--) {
                if (threeKeyList[i] === shiftCardsBack[j]) {
                    shiftCardsBack.splice(j, 1);
                    cardsBack.splice(j, 1);
                }
            }
            if (bomb_open === 1) {
                for (var j = 0; j < fourKeyList.length; j++) {
                    for (var k = shiftCardsBack.length - 1; k >= 0; k--) {
                        if (fourKeyList[j] === shiftCardsBack[k]) {
                            shiftCardsBack.splice(k, 1);
                            cardsBack.splice(k, 1);
                        }
                    }
                }
            }
            var suggestList = [];
            var threeNum = 0;
            for (var j = 0; j < shiftCards.length; j++) {
                if (threeKeyList[i] === shiftCards[j]) {
                    suggestList.push(cards[j]);
                    threeNum += 1;
                    if (threeNum === 3) {
                        break
                    }
                }
            }
            var bringList = [];
            for (var j = 0; j < shiftCardsBack.length - 1; j++) {
                var tempList = [];
                tempList.push(cardsBack[j]);
                tempList.push(cardsBack[j + 1]);
                bringList.push(tempList);
            }

            // cc.log("suggestList: ", suggestList);
            // cc.log("bringList: ", bringList);
            for (var j = 0; j < bringList.length; j++) {
                var suggestListBack = suggestList.concat([]);
                suggestListBack = suggestListBack.concat(bringList[j]);
                tipList.push(suggestListBack);
            }
        }

        // 带癞子的三带二
        if (this.curGameRoom.gameMode === 2 && keyCardNum > 0) {
            // cc.log("oneKeyList :", oneKeyList);
            // cc.log("twoKeyList :", twoKeyList);
            if (oneKeyList.length > 0 && keyCardNum >= 2) {
                for (var i = 0; i < oneKeyList.length; i++) {
                    var shiftCardsBack = shiftCards.concat([]);
                    var cardsBack = cards.concat([]);
                    for (var j = shiftCardsBack.length - 1; j >= 0; j--) {
                        if (oneKeyList[i] === shiftCardsBack[j]) {
                            shiftCardsBack.splice(j, 1);
                            cardsBack.splice(j, 1);
                        }
                    }
                    if (bomb_open === 1) {
                        for (var j = 0; j < fourKeyList.length; j++) {
                            for (var k = shiftCardsBack.length - 1; k >= 0; k--) {
                                if (fourKeyList[j] === shiftCardsBack[k]) {
                                    shiftCardsBack.splice(k, 1);
                                    cardsBack.splice(k, 1);
                                }
                            }
                        }
                    }
                    var suggestList = [];
                    for (var j = 0; j < shiftCards.length; j++) {
                        if (oneKeyList[i] === shiftCards[j]) {
                            suggestList.push(cards[j]);
                            suggestList.push(keyCard);
                            suggestList.push(keyCard);
                        }
                    }

                    var bringList = [];
                    for (var j = 0; j < shiftCardsBack.length - 1; j++) {
                        var tempList = [];
                        tempList.push(cardsBack[j]);
                        tempList.push(cardsBack[j + 1]);
                        bringList.push(tempList);
                    }

                    // cc.log("suggestList: ", suggestList);
                    // cc.log("bringList: ", bringList);
                    for (var j = 0; j < bringList.length; j++) {
                        var suggestListBack = suggestList.concat([]);
                        suggestListBack = suggestListBack.concat(bringList[j]);
                        tipList.push(suggestListBack);
                    }
                }
            }

            if (twoKeyList.length > 0 && keyCardNum >= 1) {
                for (var i = 0; i < twoKeyList.length; i++) {
                    var shiftCardsBack = shiftCards.concat([]);
                    var cardsBack = cards.concat([]);
                    for (var j = shiftCardsBack.length - 1; j >= 0; j--) {
                        if (twoKeyList[i] === shiftCardsBack[j]) {
                            shiftCardsBack.splice(j, 1);
                            cardsBack.splice(j, 1);
                        }
                    }
                    if (bomb_open === 1) {
                        for (var j = 0; j < fourKeyList.length; j++) {
                            for (var k = shiftCardsBack.length - 1; k >= 0; k--) {
                                if (fourKeyList[j] === shiftCardsBack[k]) {
                                    shiftCardsBack.splice(k, 1);
                                    cardsBack.splice(k, 1);
                                }
                            }
                        }
                    }
                    var suggestList = [];
                    for (var j = 0; j < shiftCards.length; j++) {
                        if (twoKeyList[i] === shiftCards[j]) {
                            suggestList.push(cards[j]);
                        }
                    }
                    suggestList.push(keyCard);

                    var bringList = [];
                    for (var j = 0; j < shiftCardsBack.length - 1; j++) {
                        var tempList = [];
                        tempList.push(cardsBack[j]);
                        tempList.push(cardsBack[j + 1]);
                        bringList.push(tempList);
                    }

                    // cc.log("suggestList: ", suggestList);
                    // cc.log("bringList: ", bringList);
                    for (var j = 0; j < bringList.length; j++) {
                        var suggestListBack = suggestList.concat([]);
                        suggestListBack = suggestListBack.concat(bringList[j]);
                        tipList.push(suggestListBack);
                    }
                }
            }
        }
        cc.log("三带二: ", tipList);
        return tipList;
    },

    getTipsPlane: function (controllerCards) {
        cc.log("getTipsPlane");
        var min_card = 0;
        var planeCardNum = 0;
        if (controllerCards.length !== 0) {
            var tripleCardsList = [];
            var cards2NumDict = cutil.getCard2NumDict(controllerCards);
            var cardsKeyList = cutil.getKeyList(cards2NumDict);
            planeCardNum = controllerCards.length / 5;
            for (var i = 0; i < cardsKeyList.length; i++) {
                if (cards2NumDict[cardsKeyList[i]] >= 3) {
                    tripleCardsList.push(parseInt(cardsKeyList[i]));
                }
            }
            tripleCardsList.sort(function (a, b) {
                return a - b;
            });

            cc.log("tripleCardsList :" + tripleCardsList);
            for (var i = 0; i < tripleCardsList.length - 1; i++) {
                if ((tripleCardsList[i] + 1) === tripleCardsList[i + 1]) {
                    min_card = tripleCardsList[i + 1];
                    break;
                }
            }
        }
        var tipsList = [];
        var handCards = cutil.deepCopy(this.curGameRoom.playerPokerList[this.serverSeatNum]);
        handCards.sort(function (a, b) {   //从小到大排列
            return a - b;
        });

        if (handCards.length < controllerCards.length) {  //手牌数小于飞机的张数
            return tipsList;
        }
        // cc.log("cards:", cards)
        var classList = cutil.classifyCards(handCards);
        var cards = classList[0];
        var keyCardNum = classList[1].length;
        var keyCard = classList[1][0];
        var shiftCards = cutil.rightShiftCards(cards);
        var shiftCards2NumDict = cutil.getCard2NumDict(shiftCards);

        var threeKeyList = [];
        var fourKeyList = [];
        var tripleList = [];
        var bomb_open = this.curGameRoom.bombOpen;
        for (var card in shiftCards2NumDict) {
            if (min_card < parseInt(card)) {
                if (bomb_open === 0) {
                    if (shiftCards2NumDict[card] >= 3) {
                        threeKeyList.push(parseInt(card));
                    }
                } else {
                    if (shiftCards2NumDict[card] === 3) {
                        threeKeyList.push(parseInt(card));
                    }
                }
                if (shiftCards2NumDict[card] === 4) {
                    fourKeyList.push(parseInt(card));
                }
            }
        }
        threeKeyList.sort(function (a, b) {   //从小到大排列
            return a - b;
        });
        // cc.log("threeKeyList: ", threeKeyList);
        for (var i = 0; i < threeKeyList.length - planeCardNum + 1; i++) {
            var tempList = [];
            for (var j = 1; j < planeCardNum; j++) {
                if ((threeKeyList[i] + j) === threeKeyList[i + j]) {
                    if (j === 1) {
                        tempList.push(threeKeyList[i]);
                        tempList.push(threeKeyList[i + j]);
                    } else {
                        tempList.push(threeKeyList[i + j]);
                    }
                }
            }
            if (tempList.length === planeCardNum) {
                tripleList.push(tempList);
            }
        }
        // cc.log("tripleList: ", tripleList);
        for (var i = 0; i < tripleList.length; i++) {
            var suggestList = [];
            var shiftCardsBack = shiftCards.concat([]);
            var cardsBack = cards.concat([]);
            if (fourKeyList.length !== 0 && bomb_open === 1) {
                for (var y = 0; y < fourKeyList.length; y++) {
                    for (var z = shiftCardsBack.length - 1; z >= 0; z--) {
                        if (fourKeyList[y] === shiftCardsBack[z]) {
                            shiftCardsBack.splice(z, 1);
                            cardsBack.splice(z, 1);
                        }
                    }
                }
            }
            // cc.log("shiftCardsBack:",shiftCardsBack);
            for (var j = 0; j < tripleList[i].length; j++) {
                var tripleNum = 0;
                for (var k = shiftCardsBack.length - 1; k >= 0; k--) {
                    if (tripleList[i][j] === shiftCardsBack[k]) {
                        suggestList.push(cardsBack[k]);
                        shiftCardsBack.splice(k, 1);
                        cardsBack.splice(k, 1);
                        tripleNum += 1;
                        if (tripleNum === 3) {
                            break;
                        }
                    }
                }
            }
            for (var x = 0; x <= (shiftCardsBack.length - 2 * planeCardNum); x++) {
                var bringCardNum = 0;
                var suggestTempList = suggestList.concat([]);
                for (var p = x; p < shiftCardsBack.length; p++) {
                    suggestTempList.push(cardsBack[p]);
                    bringCardNum += 1;
                    if (bringCardNum === 2 * planeCardNum) {
                        break;
                    }
                }
                tipsList.push(suggestTempList);
            }
        }

        // 带癞子的飞机
        var cardsListBack = cards.concat([]);
        if (bomb_open === 1) {
            for (var card in shiftCards2NumDict) {
                if (shiftCards2NumDict[card] === 4) {
                    for (var i = shiftCards.length - 1; i >= 0; i--) {
                        if (parseInt(card) === shiftCards[i]) {
                            shiftCards.splice(i, 1);
                            cardsListBack.splice(i, 1);
                        }
                    }
                }
            }
        }
        var card2ListDict = cutil.getCard2ListDict(cardsListBack);

        var playerCardNum = 0;
        if (this.curGameRoom.cardNum === 15) {
            playerCardNum = 13;
        } else {
            playerCardNum = 14;
        }

        if (this.curGameRoom.gameMode === 2 && keyCardNum > 0) {
            for (var i = min_card + 1; i <= playerCardNum - 1; i++) {
                var useKeyCardNum = keyCardNum;
                var pairCardNum = 0;
                var suggestList = [];
                var tripleList = [];
                var cardsList = cardsListBack.concat([]);
                for (var j = 0; j < planeCardNum; j++) {
                    if (!card2ListDict[i + j]) {
                        useKeyCardNum -= 3;
                        pairCardNum += 1;
                        suggestList.push(keyCard);
                        suggestList.push(keyCard);
                        suggestList.push(keyCard);
                    } else if (card2ListDict[i + j].length >= 3) {
                        pairCardNum += 1;
                        suggestList.push(card2ListDict[i + j][0]);
                        suggestList.push(card2ListDict[i + j][1]);
                        suggestList.push(card2ListDict[i + j][2]);

                        tripleList.push(card2ListDict[i + j][0]);
                        tripleList.push(card2ListDict[i + j][1]);
                        tripleList.push(card2ListDict[i + j][2]);
                    } else if (card2ListDict[i + j].length === 2) {
                        useKeyCardNum -= 1;
                        pairCardNum += 1;
                        suggestList.push(card2ListDict[i + j][0]);
                        suggestList.push(card2ListDict[i + j][1]);
                        suggestList.push(keyCard);

                        tripleList.push(card2ListDict[i + j][0]);
                        tripleList.push(card2ListDict[i + j][1]);
                    } else if (card2ListDict[i + j].length === 1) {
                        useKeyCardNum -= 2;
                        pairCardNum += 1;
                        suggestList.push(card2ListDict[i + j][0]);
                        suggestList.push(keyCard);
                        suggestList.push(keyCard);

                        tripleList.push(card2ListDict[i + j][0]);
                    }
                    if (useKeyCardNum < 0) {
                        pairCardNum -= 1;
                        break;
                    }
                }
                if (pairCardNum === planeCardNum) {
                    for (var j = 0; j < useKeyCardNum; j++) {
                        cardsList.push(keyCard)
                    }
                    for (var j = 0; j < tripleList.length; j++) {
                        for (var k = cardsList.length - 1; k >= 0; k--) {
                            if (tripleList[j] === cardsList[k]) {
                                cardsList.splice(k, 1)
                            }
                        }
                    }
                    for (var j = 0; j < cardsList.length - pairCardNum * 2; j++) {
                        var suggestListBack = suggestList.concat([]);
                        for (var k = 0; k < pairCardNum * 2; k++) {
                            suggestListBack.push(cardsList[j + k]);
                        }
                        suggestListBack.sort(function (a, b) {
                            return a - b;
                        });
                        tipsList.push(suggestListBack)
                    }
                }
                cc.log("tipList ", tipsList);
            }
        }
        cc.log("飞机提示 222222222222222222222： ", tipsList);
        return tipsList;
    },

    getTipsFourBring: function (controllerCards, bringNum) {
        cc.log("getTipsFourBring: ", controllerCards, bringNum);
        var min_card = 0;
        if (controllerCards.length !== 0) {
            var cards2NumDict = cutil.getCard2NumDict(controllerCards);
            for (var card in cards2NumDict) {
                if (cards2NumDict[card] === 4) {
                    min_card = parseInt(card);
                }
            }
        }
        var tipsList = [];
        var handCards = cutil.deepCopy(this.curGameRoom.playerPokerList[this.serverSeatNum]);
        handCards.sort(function (a, b) {   //从小到大排列
            return a - b;
        });

        if (handCards.length < controllerCards.length) {  //手牌数小于飞机的张数
            return tipsList;
        }
        // cc.log("cards:", cards)
        var classList = cutil.classifyCards(handCards);
        var cards = classList[0];
        var keyCardNum = classList[1].length;
        var keyCard = classList[1][0];
        var shiftCards = cutil.rightShiftCards(cards);
        var shiftCards2NumDict = cutil.getCard2NumDict(shiftCards);

        var fourCardList = [];
        for (var card in shiftCards2NumDict) {
            if (shiftCards2NumDict[card] === 4 && parseInt(card) > min_card) {
                fourCardList.push(parseInt(card));
            }
        }
        // if (fourCardList.length === 0) {
        //     return tipsList;
        // }
        if (fourCardList.length > 0) {
            var shiftCardsBack = shiftCards.concat([]);
            var cardsBack = cards.concat([]);
            for (var i = 0; i < fourCardList.length; i++) {
                for (var j = shiftCardsBack.length - 1; j >= 0; j--) {
                    if (fourCardList[i] === shiftCardsBack[j]) {
                        shiftCardsBack.splice(j, 1);
                        cardsBack.splice(j, 1);
                    }
                }
            }
            // cc.log("shiftCardsBack:", shiftCardsBack);
            var cardsBackDict = cutil.getCard2NumDict(shiftCardsBack);
            var fourBringCardList = [];
            for (var i = 1; i < 4; i++) {
                for (var card in cardsBackDict) {
                    if (cardsBackDict[card] === i) {
                        for (var p = 0; p < shiftCards.length; p++) {
                            if (parseInt(card) === shiftCards[p]) {
                                fourBringCardList.push(parseInt(cards[p]));
                            }
                        }
                    }
                }
            }
            // cc.log("fourBringCardList: ",fourBringCardList);
            if (fourBringCardList.length > 0) {
                for (var i = 0; i < fourBringCardList.length - (bringNum - 1); i++) {
                    var suggestList = [];
                    suggestList.push(fourBringCardList[i]);
                    suggestList.push(fourBringCardList[i + 1]);
                    if (bringNum === 3) {
                        suggestList.push(fourBringCardList[i + 2]);
                    }
                    for (var j = 0; j < fourCardList.length; j++) {
                        var tempList = [];
                        for (var p = 0; p < shiftCards.length; p++) {
                            if (fourCardList[j] === shiftCards[p]) {
                                tempList.push(cards[p]);
                            }
                        }
                        tempList = tempList.concat(suggestList);
                        tipsList.push(tempList);
                    }
                }
            }
        }

        // 带癞子的四带二，四带三
        if (this.curGameRoom.gameMode === 2 && keyCardNum > 0) {
            var card2ListDict = cutil.getCard2ListDict(cards);
            for (var i = min_card + 1; i <= 14; i++) {
                var tempList = [];
                var isFourCards = false;
                var cardsListBack = cards.concat([]);
                if (!card2ListDict[i]) {
                    continue;
                } else if (card2ListDict[i].length === 1 && keyCardNum >= 3) {
                    tempList = tempList.concat(card2ListDict[i]);
                    for (var j = 0; j < 4 - card2ListDict[i].length; j++) {
                        tempList.push(keyCard);
                    }
                    isFourCards = true;
                } else if (card2ListDict[i].length === 2 && keyCardNum >= 2) {
                    tempList = tempList.concat(card2ListDict[i]);
                    for (var j = 0; j < 4 - card2ListDict[i].length; j++) {
                        tempList.push(keyCard);
                    }
                    isFourCards = true;
                } else if (card2ListDict[i].length === 3 && keyCardNum >= 1) {
                    tempList = tempList.concat(card2ListDict[i]);
                    for (var j = 0; j < 4 - card2ListDict[i].length; j++) {
                        tempList.push(keyCard);
                    }
                    isFourCards = true;
                }

                if (isFourCards && card2ListDict[i]) {
                    for (var j = 0; j < card2ListDict[i].length; j++) {
                        for (var k = cardsListBack.length - 1; k >= 0; k--) {
                            if (card2ListDict[i][j] === cardsListBack[k]) {
                                cardsListBack.splice(k, 1);
                            }
                        }
                    }

                    for (var j = 0; j < cardsListBack.length - (bringNum - 1); j++) {
                        var suggestList = [];
                        suggestList = suggestList.concat(tempList);
                        suggestList.push(cardsListBack[j]);
                        suggestList.push(cardsListBack[j + 1]);
                        if (bringNum === 3) {
                            suggestList.push(cardsListBack[j + 2]);
                        }
                        if (suggestList.length === 6 || suggestList.length === 7) {
                            tipsList.push(suggestList);
                        }
                    }
                }
            }
        }
        cc.log("四带二 或者 四带三：", tipsList);
        return tipsList;
    },

    getBombTips: function (discardCards) {
        cc.log("getBombTips ", discardCards);  // 56, 57,58,59   有癞子  
        var bombCards = [];
        var bombCard = -1;
        var tipsList = [];
        var discardKeyNum = 0;
        if (discardCards === undefined) {
            bombCard = 0;
            discardKeyNum = 99;
        } else {
            bombCards = cutil.rightShiftCards(discardCards);
            bombCard = bombCards[0];
            for (var i = 0; i < discardCards.length; i++) {
                if (const_val.INSTEAD.indexOf(discardCards[i]) >= 0) {
                    discardKeyNum += 1;
                }
            }
        }
        if (discardKeyNum === 4) {
            return tipsList;
        }
        cc.log("discardKeyNum: ", discardKeyNum);

        var handCards = cutil.deepCopy(this.curGameRoom.playerPokerList[this.serverSeatNum]);
        handCards.sort(function (a, b) {
            return a - b;
        });       //从小到大排列
        var classList = cutil.classifyCards(handCards);
        var cards = classList[0];
        var keyCardNum = classList[1].length;
        var keyCard = classList[1][0];
        var shiftCards = cutil.rightShiftCards(cards); //右移后手牌
        var shiftCards2NumDict = cutil.getCard2NumDict(shiftCards);
        var shiftCardsKeyList = cutil.getKeyList(shiftCards2NumDict);

        // cc.log("bombCards :" + bombCard);
        // cc.log("cards : " + cards); //cards : 25,26,27,28,33,34,35,36,41,42,43,44,49,50,51,52,129,144,152
        // cc.log("shiftCards : " + shiftCards); //shiftCards : 3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,16,18,19
        // cc.log("shiftCardsKeyList :" + shiftCardsKeyList);  //shiftCardsKeyList :3,4,5,6,16,18,19

        // 带癞子的炸弹
        if (this.curGameRoom.gameMode === 2 && keyCardNum > 0 && (discardKeyNum > 0 || discardKeyNum === 99)) {
            cc.log("这里进来了。。。。。。");
            var oneKeyList = [];
            var twoKeyList = [];
            var threeKeyList = [];
            for (var card in shiftCards2NumDict) {
                if (parseInt(card) > bombCard) {
                    if (shiftCards2NumDict[card] === 1) {
                        oneKeyList.push(parseInt(card))
                    }
                    if (shiftCards2NumDict[card] === 2) {
                        twoKeyList.push(parseInt(card))
                    }
                    if (shiftCards2NumDict[card] === 3) {
                        threeKeyList.push(parseInt(card))
                    }
                }
            }

            oneKeyList.sort(function (a, b) {
                return a - b;
            });
            twoKeyList.sort(function (a, b) {
                return a - b;
            });
            threeKeyList.sort(function (a, b) {
                return a - b;
            });
            if (keyCardNum >= 1 && threeKeyList.length > 0) {
                for (var i = 0; i < threeKeyList.length; i++) {
                    var keySuggestList = [];
                    keySuggestList.push(keyCard);
                    for (var j = 0; j < shiftCards.length; j++) {
                        if (threeKeyList[i] === shiftCards[j]) {
                            keySuggestList.push(parseInt(cards[j]));
                            keySuggestList.push(parseInt(cards[j + 1]));
                            keySuggestList.push(parseInt(cards[j + 2]));
                            break;
                        }
                    }
                    tipsList.push(keySuggestList);
                }
            }

            if (keyCardNum >= 2 && twoKeyList.length > 0) {
                for (var i = 0; i < twoKeyList.length; i++) {
                    var keySuggestList = [];
                    keySuggestList.push(keyCard);
                    keySuggestList.push(keyCard);
                    for (var j = 0; j < shiftCards.length; j++) {
                        if (twoKeyList[i] === shiftCards[j]) {
                            keySuggestList.push(parseInt(cards[j]));
                            keySuggestList.push(parseInt(cards[j + 1]));
                            break;
                        }
                    }
                    tipsList.push(keySuggestList);
                }
            }

            if (keyCardNum >= 3 && oneKeyList.length > 0) {
                for (var i = 0; i < oneKeyList.length; i++) {
                    var keySuggestList = [];
                    keySuggestList.push(keyCard);
                    keySuggestList.push(keyCard);
                    keySuggestList.push(keyCard);
                    for (var j = 0; j < shiftCards.length; j++) {
                        if (oneKeyList[i] === shiftCards[j]) {
                            keySuggestList.push(parseInt(cards[j]));
                        }
                    }
                    tipsList.push(keySuggestList);
                }
            }
        }

        var bombKeyList = [];
        cc.log("shiftCardsKeyList:", shiftCardsKeyList);
        for (var i = 0; i < shiftCardsKeyList.length; i++) {
            if (bombCard < shiftCardsKeyList[i] || discardKeyNum > 0) {
                if (shiftCards2NumDict[shiftCardsKeyList[i]] === 4) {
                    bombKeyList.push(shiftCardsKeyList[i]);
                }
            }
        }
        cc.log("bombKeyList:" + bombKeyList);
        for (var i = 0; i < bombKeyList.length; i++) {
            var suggestList = [];
            for (var j = 0; j < shiftCards.length; j++) {
                if (bombKeyList[i] === shiftCards[j]) {
                    suggestList.push(cards[j]);
                }
            }
            cc.log("suggestList: " + suggestList);
            tipsList.push(suggestList);
        }

        // 四个癞子
        if (keyCardNum === 4) {
            var keyList = [];
            keyList.push(keyCard);
            keyList.push(keyCard);
            keyList.push(keyCard);
            keyList.push(keyCard);
            tipsList.push(keyList);
        }
        cc.log("炸弹：", tipsList);
        return tipsList;
    },

    canPlayCards: function (cards) {
        //不能为空
        if (cards.length <= 0) {
            cc.log("牌不能为空");
            return [false, cards, 0];
        }
        //黑3先出时，必须要含有黑3  0 1 0 1 0
        var pokerList = this.curGameRoom.discardList;
        var deskPokerNum = 0;
        for (var i = 0; i < pokerList.length; i++) {
            if (pokerList[i].length !== 0) {
                deskPokerNum += pokerList[i].length;
            }
        }

        // 0 0 1 2
        // cc.log("所有已经出过的牌：", this.curGameRoom.discardList, deskPokerNum)
        // cc.log("hei3: ",this.serverSeatNum, this.curGameRoom.dealerIdx);
        // cc.log("hei3: ",this.curGameRoom.gameHei3, this.curGameRoom.gameStart);
        // cc.log("hei3: ",this.curGameRoom.curRound);
        // cc.log("hei3: ", cards.indexOf(const_val.HEI_3));
        if (deskPokerNum === 0) {
            if (this.curGameRoom.curRound === 1) {
                if (this.curGameRoom.gameStart === 0 && this.serverSeatNum === this.curGameRoom.controllerIdx) {
                    if (cards.indexOf(const_val.HEI_3) < 0) {
                        cc.log("你他妈走了这里");
                        return [false, cards, 1];
                    }
                }
            } else {
                if (this.curGameRoom.gameHei3 === 0 && this.serverSeatNum === this.curGameRoom.waitIdx) {
                    if (cards.indexOf(const_val.HEI_3) < 0) {
                        cc.log("你他妈走了这里 22222");
                        return [false, cards, 1];
                    }
                }
            }
        }

        var canPlay = cutil.getCanPlay(cutil.rightShiftCards(cards), this.curGameRoom.playerPokerList[this.serverSeatNum], this.curGameRoom.gamePlays);
        if (!canPlay) {
            return [false, cards, 2];
        }

        //是否轮到自己出牌
        if (this.curGameRoom.waitIdx !== this.serverSeatNum) {
            cc.log("没轮到自己出牌");
            return [false, cards, 0];
        }

        var playerPokers = this.curGameRoom.playerPokerList[this.serverSeatNum];
        var gamePlays = this.curGameRoom.gamePlays;
        var gameEnd = this.curGameRoom.gameEnd;
        //是否有这些牌
        if (!this.checkHasCards(cards, playerPokers)) {
            cc.log("手上没有全部牌:", cards, playerPokers);
            return [false, cards, 0];
        }
        //测试
        // this.curGameRoom.controller_discard_list = [97,97,98,98, 105,105,106,106, 113,113,114,114]
        // cards = [97,97,98,98, 113,113,114, 129,129,130, 152, 152, 152, 152, 152, 152]
        if (this.curGameRoom.gameMode === 2) {
            cc.log("带癞子的牌型 000：", cards);
            var classifyList = cutil.classifyCards(cards);
            var normalCards = cutil.rightShiftCards(classifyList[0]);
            var keyCardsList = cutil.rightShiftCards(classifyList[1]);

            if (classifyList[0].length === 0 && classifyList[1].length === 4) {
                return [true, cards, 0]
            }

            cc.log("带癞子的牌型 111：", classifyList);
            cc.log("带癞子的牌型 111：", keyCardsList, normalCards);
            cc.log("带癞子的牌型 333：", cutil.getInsteadCardsType(normalCards, keyCardsList));

            var controllerCardsType = 0;
            var typeList = [];
            if (this.curGameRoom.waitIdx === this.curGameRoom.controllerIdx) {
                // 自己出牌
                typeList = cutil.getInsteadCardsType(normalCards, keyCardsList);
            } else {
                //接牌
                var controllerDiscardCards = this.curGameRoom.controller_discard_list;
                var controllerShiftCards = cutil.rightShiftCards(controllerDiscardCards);
                controllerCardsType = cutil.getNormalCardsType(controllerShiftCards, cutil.rightShiftCards(playerPokers), playerPokers.length, gamePlays, gameEnd);
                if (cutil.checkIsKeyCardBomb(normalCards, keyCardsList)) {
                    controllerCardsType = const_val.TYPE_BOMB;
                    typeList.push(controllerCardsType);
                } else {
                    if (!cutil.IsCardsTypeSame(normalCards, keyCardsList, controllerCardsType)) {
                        typeList = cutil.getInsteadCardsType(normalCards, keyCardsList);
                    } else {
                        typeList.push(controllerCardsType);
                    }
                }
            }
            for (let i = 0; i < typeList.length; i++) {
                var makeDiscardPoker = cutil.makeCard(cards, typeList[i]);
                if (this.canPlayNormalCards(makeDiscardPoker, playerPokers, gamePlays, gameEnd)) {
                    cc.log("玩家癞子替换出牌 makeDiscardPoker:", makeDiscardPoker);
                    return [true, makeDiscardPoker, 0];
                }
            }
        } else {
            if (this.canPlayNormalCards(cards, playerPokers, gamePlays, gameEnd)) {
                cc.log("玩家normal出牌", cards);
                return [true, cards, 0];
            }
        }
        return [false, cards, 0];
    },

    checkHasCards: function (cards, playerCards) {
        var cards2NumDict = cutil.getCard2NumDict(cards);
        var playerCards2NumDict = cutil.getCard2NumDict(playerCards);
        for (var card in cards2NumDict) {
            if (!playerCards2NumDict[card] || cards2NumDict[card] > playerCards2NumDict[card]) {
                return false
            }
        }
        return true
    },

    canPlayNormalCards: function (cards, playerCards, gamePlays, gameEnd) {
        cc.log("canPlayNormalCards:", cards);
        var controllerDiscardCards = this.curGameRoom.controller_discard_list;
        var controllerShiftCards = cutil.rightShiftCards(controllerDiscardCards);
        var controllerCardsType = cutil.getNormalCardsType(controllerShiftCards, cutil.rightShiftCards(playerCards), playerCards.length, gamePlays, gameEnd);
        var playerTransferCards = cutil.rightShiftCards(cards);
        if (this.curGameRoom.waitIdx === this.curGameRoom.controllerIdx) {
            var playerCardsType = cutil.getNormalCardsType(playerTransferCards, cutil.rightShiftCards(playerCards), playerCards.length, gamePlays, gameEnd)
        } else {
            var playerCardsType = cutil.getNormalCardsType(playerTransferCards, cutil.rightShiftCards(playerCards), playerCards.length, gamePlays, gameEnd, 1);
        }
        cc.log("上次的牌:", controllerShiftCards, "出的牌:", playerTransferCards, "出牌类型:", playerCardsType);
        if (playerCardsType === 0 || playerCardsType === 1) {
            cc.log("牌型不正确");
            return false;
        }
        if (playerCardsType === 5 && playerCards.length !== 3) {
            return false;
        }
        if (playerCardsType === 12 && playerCards.length !== 4) {
            return false;
        }

        //自由出牌
        if (this.curGameRoom.controllerIdx === this.serverSeatNum) { //其他玩家要不起 或 该局第一次出牌 牌出完则胜利
            cc.log("玩家自由出牌");
            return true
        }

        //压过上家  炸弹 8  12 
        cc.log("controllerCardsType", controllerCardsType);
        if (controllerCardsType === playerCardsType) {
            if (controllerShiftCards.length !== playerTransferCards.length) {
                if (controllerCardsType === const_val.TYPE_PLANE_ONE) {
                    if (this.curGameRoom.gameEnd[3] !== 1) {
                        return false;
                    }
                    if (playerTransferCards.length !== playerCards.length) {
                        return false;
                    }
                    var result = cutil.cmpSameTypeCards(controllerDiscardCards, cards, playerCardsType);
                    cc.log("飞机可少带接完 ", result);
                    return result
                }
                return false;
            }
            var result = cutil.cmpSameTypeCards(controllerDiscardCards, cards, playerCardsType);
            cc.log(result);
            return result
        } else if (controllerCardsType === const_val.TYPE_TRIPLE_TWO && (playerCardsType === const_val.TYPE_TRIPLE_ONE || playerCardsType === const_val.TYPE_TRIPLE)) {
            if (this.curGameRoom.gameEnd[1] !== 1) {
                return false;
            }
            if (playerTransferCards.length !== playerCards.length) {
                return false;
            }
            var result = cutil.cmpSameTypeCards(controllerDiscardCards, cards, playerCardsType);
            cc.log("三张可少带接完 ", result);
            return result
        } else if (controllerCardsType === const_val.TYPE_PLANE_ONE && playerCardsType === const_val.TYPE_SERIAL_TRIPLE) {
            if (this.curGameRoom.gameEnd[3] !== 1) {
                return false;
            }
            if (playerTransferCards.length !== playerCards.length) {
                return false;
            }
            var result = cutil.cmpSameTypeCards(controllerDiscardCards, cards, playerCardsType);
            cc.log("飞机可少带接完 ", result);
            return result;
        } else if (playerCardsType > controllerCardsType) {
            return playerCardsType === const_val.TYPE_BOMB;
        }
        cc.log("8888888");
        return false
    }

});
