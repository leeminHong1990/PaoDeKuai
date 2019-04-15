"use strict";
var cutil = function () {
};

cutil.lock_ui = function () {
    if (h1global.globalUIMgr) {
        h1global.globalUIMgr.lock_ui.show();
    }
};

cutil.unlock_ui = function () {
    if (h1global.globalUIMgr) {
        h1global.globalUIMgr.lock_ui.hide();
    }
};

cutil.randomContainBorder = function (a, b) { // a,b整数 并 包含a,b (a<=b)
    var sub = b - a;
    return Math.round(Math.random() * sub + a)
};

cutil.deepCopy = function (obj) {
    var str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
        return;
    } else if (window.JSON) {
        str = JSON.stringify(obj); //系列化对象
        newobj = JSON.parse(str); //还原
    } else {
        for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object' ?
                cutil.deepCopy(obj[i]) : obj[i];
        }
    }
    return newobj;
};

cutil.convert_time_to_date = function (rtime) {
    var temp = os.date("*t", rtime);
    return temp.year.toString() + "年" + temp.month.toString() + "月" + temp.day.toString() + "日"
};

cutil.convert_time_to_hour2second = function (rtime) {
    var temp = os.date("*t", rtime);
    return temp.hour.toString() + ":" + temp.min.toString()
};

cutil.convert_time_to_stime = function (ttime) {
    var temp = os.date("*t", ttime);
    return temp.year.toString() + "/" + temp.month.toString() + "/" + temp.day.toString() + "  " + temp.hour.toString() + ":" + temp.min.toString() + ":" + temp.sec.toString()
};

cutil.convert_seconds_to_decimal = function (seconds, decimalNum) {
    seconds = String(seconds);
    var lis = [[], []];
    var index = 0;
    for (var i = 0; i < seconds.length; i++) {
        if (seconds[i] === '.') {
            index += 1
        }
        if (index <= 1 && seconds[i] !== '.') {
            lis[index].push(seconds[i])
        }
    }
    if (lis[0].length <= 0) {
        return null;
    }
    var integerPart = "";
    for (var i = 0; i < lis[0].length; i++) {
        integerPart += lis[0][i];
    }
    var decimalPart = "";
    if (lis[1].length < decimalNum) {
        for (var i = 0; i < lis[1].length; i++) {
            decimalPart += lis[1][i];
        }
        for (var i = 0; i < decimalNum - lis[1].length; i++) {
            decimalPart += '0';
        }
    } else {
        for (var i = 0; i < decimalNum; i++) {
            decimalPart += lis[1][i];
        }
    }
    return integerPart + "." + decimalPart
};


cutil.tileSortFunc = function (a, b) {
    if (a === b) {
        return 0;
    }

    var player = h1global.entityManager.player();
    if (!player.curGameRoom || player.curGameRoom.keyCard <= 0) {
        return a - b;
    }

    if (player.curGameRoom.keyCard === a) {
        return 1;
    }
    if (player.curGameRoom.keyCard === b) {
        return -1;
    }

    return a - b;
};

cutil.convert_second_to_hms = function (sec) {
    if (!sec || sec <= 0) {
        return "00:00:00";
    }
    sec = Math.floor(sec);
    var hour = Math.floor(sec / 3600);
    var minute = Math.floor((sec % 3600) / 60);
    var second = (sec % 3600) % 60;
    // cc.log(second)

    var timeStr = "";
    if (hour < 10) {
        timeStr = timeStr + "0" + hour + ":";
    } else {
        timeStr = hour + ":";
    }
    if (minute < 10) {
        timeStr = timeStr + "0" + minute + ":";
    } else {
        timeStr = timeStr + minute + ":";
    }
    if (second < 10) {
        timeStr = timeStr + "0" + second;
    } else {
        timeStr = timeStr + second;
    }
    return timeStr;
};


cutil.convert_time_to_hm = function (time) {

    let date = new Date(time * 1000);
    var hours = date.getHours();
    var minute = date.getMinutes();

    var timeStr = "";
    if (hours < 10) {
        timeStr = timeStr + "0" + hours + ":";
    } else {
        timeStr = timeStr + hours + ":";
    }
    if (minute < 10) {
        timeStr = timeStr + "0" + minute;
    } else {
        timeStr = timeStr + minute;
    }
    return timeStr;
};


cutil.convert_second_to_ms = function (sec) {
    if (!sec || sec <= 0) {
        return "00:00";
    }
    sec = Math.floor(sec);

    var minute = Math.floor(sec / 60);
    var second = sec % 60;
    // cc.log(second)

    var timeStr = "";
    if (minute < 10) {
        timeStr = timeStr + "0" + minute + ":";
    } else {
        timeStr = timeStr + minute + ":";
    }
    if (second < 10) {
        timeStr = timeStr + "0" + second;
    } else {
        timeStr = timeStr + second;
    }
    return timeStr;
};

cutil.convert_date_to_ymd = function (ttime) {
    let date = new Date(ttime * 1000);

    let year = date.getFullYear();
    let mon = date.getMonth() + 1;
    let day = date.getDate();

    var timeStr = year;
    if (mon < 10) {
        timeStr = timeStr + "0" + mon;
    } else {
        timeStr = timeStr + mon;
    }
    if (day < 10) {
        timeStr = timeStr + "0" + day;
    } else {
        timeStr = timeStr + day;
    }
    return timeStr;
};

cutil.convert_time_to_ymd = function (ttime) {
    let date = new Date(ttime * 1000);

    let year = date.getFullYear();
    let mon = date.getMonth() + 1;
    let day = date.getDate();

    var timeStr = year + "-";
    if (mon < 10) {
        timeStr = timeStr + "0" + mon +"-";
    } else {
        timeStr = timeStr + mon;
    }
    if (day < 10) {
        timeStr = timeStr + "0" + day;
    } else {
        timeStr = timeStr + day;
    }
    return timeStr;
};


cutil.convert_date_to_hms = function (ttime) {
    let date = new Date(ttime * 1000);

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    var timeStr = "";
    if (hour < 10) {
        timeStr = timeStr + "0" + hour+":";
    } else {
        timeStr = timeStr + hour+":";
    }
    if (minute < 10) {
        timeStr = timeStr + "0" + minute+":";
    } else {
        timeStr = timeStr + minute+":";
    }
    if (second < 10) {
        timeStr = timeStr + "0" + second;
    } else {
        timeStr = timeStr + second;
    }
    return timeStr;
};


cutil.resize_img = function (item_img, size) {
    var rect = item_img.getContentSize();
    var scale = size / rect.height;
    var width = rect.width * scale;
    if (width > size)
        scale = size / rect.width;
    item_img.setScale(scale)
};

cutil.show_portrait_by_num = function (portrait_img, characterNum) {
    if (characterNum <= 100) {
        portrait_img.loadTexture("res/portrait/zhujue" + characterNum + ".png")
    }
    else {
        // var table_mercenary = require("data/table_mercenary")
        var mercenary_info = table_mercenary[characterNum];
        KBEngine.DEBUG_MSG("mercenary_info", mercenary_info["PORTRAIT"]);
        portrait_img.loadTexture("res/portrait/" + mercenary_info["PORTRAIT"] + ".png")
    }
};


cutil.print_table = function (lst) {
    if (lst === undefined) {
        KBEngine.DEBUG_MSG("ERROR------>Table is undefined");
        return;
    }
    for (var key in lst) {
        var info = lst[key];
        KBEngine.DEBUG_MSG(key + " : " + info);
        if (info instanceof Array) {
            cutil.print_table(info);
        }
    }
};

cutil.is_in_list = function (x, t) {
    for (var index in t) {
        if (t[index] === x) {
            return index;
        }
    }
    return null;
};


cutil.str_sub = function (strinput, len) {
    if (strinput.length < len)
        return strinput;
    if (strinput.length >= 128 && strinput.length < 192)
        return cutil.str_sub(strinput, len - 1);
    return strinput.substring(0, len)
};

cutil.info_sub = function (strinput, len) {
    var output = cutil.str_sub(strinput, len);
    if (output.length < strinput.length) {
        return output + "..."
    }
    return output
};
/*
 cutil.deep_copy_table =
 function (tb)
 if type(tb) ~= "table" then return tb end
 var result = {}
 for i, j in pairs(tb) do
 result[i] = cutil.deep_copy_table(j)
 end
 return result
 end
 */
cutil.convert_num_to_chstr = function (num) {
    if (typeof num !== "number") {
        // 处理UINT64
        num = num.toDouble();
    }
    function convert(num, limit, word) {
        var integer = Math.floor(num / limit);
        var res_str = integer.toString();
        var floatNum = 0;
        if (integer < 10) {
            // floatNum = (Math.floor((num % limit) / (limit / 100))) * 0.01;
            floatNum = (Math.floor((num % limit) / (limit / 100)));
            if (floatNum < 1) {
            } else if (floatNum < 10) {
                res_str = res_str + ".0" + floatNum.toString();
            } else {
                res_str = res_str + "." + floatNum.toString();
            }
        }
        else if (integer < 100) {
            floatNum = (Math.floor((num % limit) / (limit / 10)));
            if (floatNum < 1) {
            } else {
                res_str = res_str + "." + floatNum.toString();
            }
        }
        // floatNum = Math.floor(floatNum * limit)/limit
        // integer += floatNum;

        // return integer.toString() + word;
        // cc.log(num)
        // cc.log(res_str + word)
        return res_str + word;
    }

    if (num >= 1000000000) {
        return convert(num, 1000000000, "B");
    }
    else if (num >= 1000000) {
        return convert(num, 1000000, "M");
    }
    else if (num >= 1000) {
        return convert(num, 1000, "K");
    }
    else {
        return Math.floor(num).toString();
    }

};

cutil.splite_list = function (list, interval, fix_length) {
    var result_list = [];
    for (var i = 0; i < list.length; ++i) {
        var idx = Math.floor(i / interval);
        if (idx >= result_list.length) {
            result_list[idx] = [];
        }
        result_list[idx][i - idx * interval] = list[i];
    }

    if (fix_length && result_list.length < fix_length) {
        for (var i = result_list.length; i < fix_length; ++i) {
            result_list.push([]);
        }
    }
    return result_list;
};


cutil.get_rotation_angle = function (vec2) {
    var vec2_tan = Math.abs(vec2.y) / Math.abs(vec2.x);
    var angle = 0;
    if (vec2.y === 0) {
        if (vec2.x > 0) {
            angle = 90
        }
        else if (vec2.x < 0) {
            angle = 270
        }
    }
    else if (vec2.x === 0) {
        if (vec2.y > 0) {
            angle = 0
        }
        else if (vec2.y < 0) {
            angle = 180
        }
    }
    else if (vec2.y > 0 && vec2.x < 0) {
        angle = Math.atan(vec2_tan) * 180 / Math.pi - 90;
    }
    else if (vec2.y > 0 && vec2.x > 0) {
        angle = 90 - Math.atan(vec2_tan) * 180 / Math.pi
    }
    else if (vec2.y < 0 && vec2.x < 0) {
        angle = -Math.atan(vec2_tan) * 180 / Math.pi - 90;
    }
    else if (vec2.y < 0 && vec2.x > 0) {
        angle = Math.atan(vec2_tan) * 180 / Math.pi + 90;
    }
    return angle
};

cutil.post_php_info = function (info, msg) {
    var xhr = new cc.XMLHttpRequest();
    xhr.responseType = 0; // cc.XMLHTTPREQUEST_RESPONSE_STRING
    xhr.open("GET", "http://" + switches.httpServerIP + "/log_client.php?key=" + info + "&value=" + msg);
    function onReadyStateChange() {

    }

    xhr.registerScriptHandler(onReadyStateChange);
    xhr.send()
};


cutil.post_php_feedback = function (info, msg) {
    var xhr = new cc.XMLHttpRequest();
    xhr.responseType = 0; // cc.XMLHTTPREQUEST_RESPONSE_STRING
    xhr.open("GET", "http://" + switches.httpServerIP + "/log_feedback.php?key=" + info + "&value=" + msg);
    function onReadyStateChange() {
    }

    xhr.registerScriptHandler(onReadyStateChange);
    xhr.send()
};


cutil.printMessageToLogcat = function (message) {
    if (targetPlatform === cc.PLATFORM_OS_ANDROID) {
        //var ok,ret  = luaj.callStaticMethod("org/cocos2dx/lua/AppActivity", "sPrintMsg", { message }, "(Ljava/lang/String;)V")
    }
};

cutil.openWebURL = function (url) {
    if (targetPlatform === cc.PLATFORM_OS_ANDROID) {
        //var ok,ret  = luaj.callStaticMethod("org/cocos2dx/lua/AppActivity", "sOpenWebURL", { url }, "(Ljava/lang/String;)V")
    }

};

cutil.get_uint32 = function (inputNum) {
    return Math.ceil(inputNum) % 4294967294
};

cutil.schedule = function (node, callback, delay) {
    // var delayAction = cc.DelayTime.create(delay);
    // var sequence = cc.Sequence.create(delay, cc.CallFunc.create(callback));
    // var action = cc.RepeatForever.create(sequence);
    // node.runAction(action);
    var action = cc.RepeatForever.create(cc.Sequence.create(cc.DelayTime.create(delay), cc.CallFunc.create(callback)));
    node.runAction(action);
    return action;
};

cutil.performWithDelay = function (node, callback, delay) {
    var delayAction = cc.DelayTime.create(delay);
    var sequence = cc.Sequence.create(delay, cc.CallFunc.create(callback));
    node.runAction(sequence);
    return sequence;
};

cutil.binarySearch = function (targetList, val, func) {
    func = func || function (x, val) {
            return val - x;
        };
    var curIndex = 0;
    var fromIndex = 0;
    var toIndex = targetList.length - 1;
    while (toIndex > fromIndex) {
        curIndex = Math.floor((fromIndex + toIndex) / 2);
        if (func(targetList[curIndex], val) < 0) {
            toIndex = curIndex;
        } else if (func(targetList[curIndex], val) > 0) {
            fromIndex = curIndex + 1;
        } else if (func(targetList[curIndex], val) === 0) {
            return curIndex + 1;
        }
    }
    return toIndex;
};

cutil.get_count = function (cards, t) {
    var sum = 0;
    for (var i = 0; i < cards.length; i++) {
        if (cards[i] === t) {
            sum++;
        }
    }
    return sum;
};

// 用于调用本地时，保存回调方法的闭包
cutil.callFuncs = {};
cutil.callFuncMax = 10000;
cutil.callFuncIdx = -1;
cutil.addFunc = function (callback) {
    cutil.callFuncIdx = (cutil.callFuncIdx + 1) % cutil.callFuncMax;
    cutil.callFuncs[cutil.callFuncIdx] = callback;
    return cutil.callFuncIdx;
};
cutil.runFunc = function (idx, param) {
    if (cutil.callFuncs[idx]) {
        (cutil.callFuncs[idx])(param);
        cutil.callFuncs[idx] = undefined;
    }
};

cutil.portraitCache = {};

cutil.loadPortraitTexture = function (url, callback, filename) {
    if (!url) {
        if (callback) {
            callback("res/ui/Default/defaultPortrait.png");
        }
        return;
    }
    if (cutil.portraitCache[url]) {
        callback(cutil.portraitCache[url]);
        return;
    }
    var fid = cutil.addFunc(function (img) {
        cutil.portraitCache[url] = img;
        callback(img);
    });
    if ((cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative)) {
        filename = filename || encodeURIComponent(url) + ".png";
        // download portrait
        // var pathurl = 'http://wx.qlogo.cn/mmopen/Q3auHgzwzM6zHFzbk0YyibNTMxxibJ2yhg2eq0sIBOgFHCKvSBsibkm2pjYVcwgjwsJlI4yrJvWzXBYHRohiced8tQ/0';
        // var filename = 'me.jpg';
        jsb.reflection.callStaticMethod(switches.package_name + "/AppActivity", "downloadAndStoreFile", "(Ljava/lang/String;Ljava/lang/String;I)V", url, filename, fid);
    } else if ((cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative)) {
        filename = filename || h1global.entityManager.player().uuid.toString() + ".png";
        jsb.reflection.callStaticMethod("DownloaderOCBridge", "downloadAndStorePortrait:WithLocalFileName:AndFuncId:", url, filename, fid);
    } else {
        cc.loader.loadImg([url], {"isCrossOrigin": false}, function (err, img) {
            cutil.runFunc(fid, img);
        });
    }
};

cutil.remoteTextureCache = {};
// 已加载超过一天的图片会被判定过期
cutil.loadRemoteTexture = function (url, callback, filename) {
    if (!url) {
        if (callback) {
            callback("res/ui/Default/defaultPortrait.png");
        }
        return;
    }
    if (cutil.remoteTextureCache[url] && (new Date().getTime()) - cutil.remoteTextureCache[url][1] > 24 * 3600 * 1000) {
        cutil.remoteTextureCache[url] = undefined;
    }
    if (cutil.remoteTextureCache[url]) {
        callback(cutil.remoteTextureCache[url][0]);
        return;
    }
    var fid = cutil.addFunc(function (img) {
        cutil.remoteTextureCache[url] = [img, (new Date().getTime())];
        callback(img);
    });
    if ((cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative)) {
        filename = filename || encodeURIComponent(url) + ".png";
        // download portrait
        // var pathurl = 'http://wx.qlogo.cn/mmopen/Q3auHgzwzM6zHFzbk0YyibNTMxxibJ2yhg2eq0sIBOgFHCKvSBsibkm2pjYVcwgjwsJlI4yrJvWzXBYHRohiced8tQ/0';
        // var filename = 'me.jpg';
        jsb.reflection.callStaticMethod(switches.package_name + "/AppActivity", "downloadAndStoreFile", "(Ljava/lang/String;Ljava/lang/String;I)V", url, filename, fid);
    } else if ((cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative)) {
        filename = filename || encodeURIComponent(url) + ".png";
        jsb.reflection.callStaticMethod("DownloaderOCBridge", "downloadAndStorePortrait:WithLocalFileName:AndFuncId:", url, filename, fid);
    } else {
        cc.loader.loadImg([url], {"isCrossOrigin": false}, function (err, img) {
            cutil.runFunc(fid, img);
        });
    }
};

cutil.captureScreenCallback = function (success, filepath) {
    // 安卓截屏回调
    if ((cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) && success) {
        jsb.reflection.callStaticMethod(switches.package_name + "/AppActivity", "callWechatShareImg", "(ZLjava/lang/String;)V", true, filepath);
    }
};

cutil.wechatTimelineCallback = function () {
    // 微信分享成功回调
    var info_dict = eval('(' + cc.sys.localStorage.getItem("INFO_JSON") + ')');
    var bind_xhr = cc.loader.getXMLHttpRequest();
    bind_xhr.open("POST", switchesnin1.PHP_SERVER_URL + "/api/share_award", true);
    bind_xhr.onreadystatechange = function () {
        if (bind_xhr.readyState === 4 && bind_xhr.status === 200) {
            if (h1global.curUIMgr.gamehall_ui && h1global.curUIMgr.gamehall_ui.is_show) {
                h1global.curUIMgr.gamehall_ui.update_card_diamond();
            }
        }
    };
    bind_xhr.setRequestHeader("Authorization", "Bearer " + info_dict["token"]);
    bind_xhr.send();
    // cc.sys.localStorage.setItem("LAST_TIMELINE_DATE", new Date().toLocaleDateString());
    // if(h1global.curUIMgr.gamehall_ui && h1global.curUIMgr.gamehall_ui.is_show){
    //     h1global.curUIMgr.gamehall_ui.rootUINode.getChildByName("function_panel").getChildByName("share_btn").getChildByName("redpoint_img").setVisible(false);
    // }
};

cutil.getMaxSerialCard = function () {
    return const_val.HEI[const_val.HEI.length - 2];
};

cutil.getMinSerialCard = function () {
    return const_val.HEI[0]
};

cutil.classifyCards = function (cards) {
    var keyCards = [];
    var normalCards = [];
    var keyCard = h1global.entityManager.player().curGameRoom.keyCard;
    for (var i = 0; i < cards.length; i++) {
        if (cards[i] === keyCard) {
            keyCards.push(cards[i]);
        } else {
            normalCards.push(cards[i])
        }
    }
    return [normalCards, keyCards]
};

cutil.cardSortFunc = function (a, b) {
    return b - a;
};

cutil.getKeyList = function (dic) {
    var list = Object.keys(dic);
    for (var i = 0; i < list.length; i++) {
        list[i] = Number(list[i])
    }
    list = list.sort(function (a, b) {
        return a - b
    });
    return list
};

cutil.getCard2NumDict = function (cards) {
    var card2NumDict = {};
    for (var i = 0; i < cards.length; i++) {
        if (card2NumDict[cards[i]]) {
            card2NumDict[cards[i]]++
        } else {
            card2NumDict[cards[i]] = 1
        }
    }
    return card2NumDict
};

cutil.checkIsSingle = function (cards) {
    if (cards.length === 1) {
        cc.log("牌型是单张");
        return true
    }
    return false
};

cutil.getCard2ListDict = function (oringin_cards) {
    var card2ListDict = {};
    for (var i = 0; i < oringin_cards.length; i++) {
        var shiftCard = oringin_cards[i] >> 3;
        if (card2ListDict[shiftCard]) {
            card2ListDict[shiftCard].push(oringin_cards[i])
        } else {
            card2ListDict[shiftCard] = [oringin_cards[i]]
        }
    }
    return card2ListDict
};

cutil.checkIsPair = function (cards) {
    if (cards.length === 2 && cards[0] === cards[1]) {
        cc.log("牌型是对子");
        return true
    }
    return false
};

cutil.checkIsSerialPair = function (cards) {
    if (cards.length < 4 || cards.length % 2 !== 0) {
        return false
    }
    var card2NumDict = cutil.getCard2NumDict(cards);
    //数量
    for (var key in card2NumDict) {
        if (card2NumDict[key] !== 2) {
            return false;
        }
    }
    //连续
    var keyList = cutil.getKeyList(card2NumDict);
    for (var i = 0; i < keyList.length - 1; i++) {
        if (keyList[i] + 1 !== keyList[i + 1]) {
            return false;
        }
    }
    cc.log("牌型是连对");
    return true
};

cutil.checkIsTriple = function (cards, playerCardsNum, gameEnd, discardType) {
    cc.log("checkIsTriple");
    if (cards.length !== playerCardsNum) {
        return false;
    }
    if (1 === discardType) {
        if (gameEnd[1] !== 1) {
            return false;
        }
    } else {
        if (gameEnd[0] !== 1) {
            return false;
        }
    }
    if (cards.length === 3 && cards[0] === cards[1] && cards[0] === cards[2]) {
        cc.log("牌型是三张");
        return true
    }
    return false
};

cutil.checkIsTripleBring1 = function (cards, playerCardsNum, gameEnd, discardType) {
    cc.log("checkIsTripleBring1");
    if (cards.length !== playerCardsNum) {
        return false;
    }
    if (1 === discardType) {
        if (gameEnd[1] !== 1) {
            return false;
        }
    } else {
        if (gameEnd[0] !== 1) {
            return false;
        }
    }
    var card2NumDict = cutil.getCard2NumDict(cards);
    var keyList = cutil.getKeyList(card2NumDict);
    if (keyList.length !== 2) {
        return false;
    }
    if ((card2NumDict[keyList[0]] === 3 && card2NumDict[keyList[1]] === 1) || (card2NumDict[keyList[0]] === 1 && card2NumDict[keyList[1]] === 3)) {
        cc.log("牌型是三带一");
        return true
    }
    return false
};

cutil.checkIsTripleBring2 = function (cards) {
    cc.log("checkIsTripleBring2");
    if (cards.length !== 5) {
        return false;
    }
    var isTriple = false;
    var card2NumDict = cutil.getCard2NumDict(cards);
    for (var card in card2NumDict) {
        if (card2NumDict[card] >= 3) {
            isTriple = true;
        }
    }
    if (isTriple && cards.length - 3 === 2) {
        return true;
    }
    return false;
};

cutil.checkIsSerialTriple = function (cards, playerCardsNum) {
    cc.log("checkIsSerialTriple");

    if (cards.length !== playerCardsNum) {
        return false;
    }
    var card2NumDict = cutil.getCard2NumDict(cards);
    //3种以上
    if (Object.keys(card2NumDict).length < 2) {
        return false
    }
    //每样3张
    for (var key in card2NumDict) {
        if (card2NumDict[key] !== 3) {
            return false
        }
    }
    //连续
    var keyList = cutil.getKeyList(card2NumDict);
    cc.log("keyList: " + keyList);
    for (var i = 0; i < keyList.length - 1; i++) {
        if (keyList[i] + 1 !== keyList[i + 1]) {
            return false
        }
    }
    cc.log("牌型是飞机不带");
    return true
};

cutil.checkIsSerialSingle = function (cards) {
    if (cards.length < 5) {
        return false;
    }
    var card2NumDict = cutil.getCard2NumDict(cards);
    for (var key in card2NumDict) {
        if (card2NumDict[key] !== 1) {
            return false;
        }
    }
    var keyList = cutil.getKeyList(card2NumDict);
    cc.log(keyList);
    for (var i = 0; i < keyList.length - 1; i++) {
        if (keyList[i] + 1 !== keyList[i + 1]) {
            cc.log(i);
            return false;
        }
    }
    cc.log("牌型是顺子");
    return true;
};

cutil.checkIsNormalBomb = function (cards) {
    var card2NumDict = cutil.getCard2NumDict(cards);
    if (cards.length === 4 && Object.keys(card2NumDict).length === 1) {
        return true;
    }
    return false;
};

cutil.checkHasNormalBomb = function (cards) {
    // 癞子
    var classList = cutil.classifyCards(cards);
    var keyCardNum = classList[1].length;
    var cardList = cutil.rightShiftCards(classList[0]);
    var card2NumDict = cutil.getCard2NumDict(cardList);
    if (cards.length >= 4) {
        for (var i in card2NumDict) {
            if (card2NumDict[i] === 4) {
                return true
            }
        }
    }

    if (keyCardNum === 0) {
        return false;
    } else if (keyCardNum === 1) {
        for (var i in card2NumDict) {
            if (card2NumDict[i] >= 3) {
                return true
            }
        }
        return false;
    } else if (keyCardNum === 2) {
        for (var i in card2NumDict) {
            if (card2NumDict[i] >= 2) {
                return true
            }
        }
        return false;
    } else if (keyCardNum === 3) {
        for (var i in card2NumDict) {
            if (card2NumDict[i] >= 1) {
                return true
            }
        }
        return false;
    } else if (keyCardNum === 4) {
        return true;
    }
};

cutil.getSerialBombNum = function (cards) { //连炸 每个炸弹张数
    var card2NumDict = cutil.getCard2NumDict(cards);
    for (var card in card2NumDict) {
        return card2NumDict[card]
    }
};

cutil.getSerialBombSerialNum = function (cards) { //连炸 x连炸
    var card2NumDict = cutil.getCard2NumDict(cards);
    return Object.keys(card2NumDict).length
};

cutil.checkIsPlane = function (cards, playerCardsNum, gameEnd, discardType) {  //飞机
    cc.log("checkIsPlane  ", cards);
    cc.log("playerCardsNum", playerCardsNum);
    cc.log("gameEnd", gameEnd);
    if (playerCardsNum >= 10 && cards.length < 10) {
        return false;
    }
    var planeCardList = [];
    var card2NumDict = cutil.getCard2NumDict(cards);
    for (var key in card2NumDict) {
        if (card2NumDict[key] >= 3) {
            planeCardList.push(parseInt(key))
        }
    }
    if (planeCardList.length < 2) {
        return false;
    }
    planeCardList.sort(function (a, b) {
        return a - b;
    });
    cc.log("planeCardList :", planeCardList);
    var planeNum = 1;
    var temp_planeNum = 1;
    for (var i = 0; i < planeCardList.length - 1; i++) {
        if (parseInt(planeCardList[i] + 1) === parseInt(planeCardList[i + 1])) {
            temp_planeNum++;
        } else {
            planeNum = planeNum < temp_planeNum ? temp_planeNum : planeNum;
            temp_planeNum = 1;
        }
    }
    planeNum = planeNum < temp_planeNum ? temp_planeNum : planeNum;
    for (var i = 1; i <= planeNum; i++) {
        if (cards.length - i * 3 === i * 2) {
            cc.log("普通飞机！planeNum:", i);
            return true;
        } else if (0 === discardType) {
            if (cards.length - i * 3 < i * 2 && cards.length === playerCardsNum && gameEnd[2] === 1) {
                cc.log("最后的飞机！planeNum:", i);
                return true;
            }
        } else if (1 === discardType) {
            if (cards.length - i * 3 < i * 2 && cards.length === playerCardsNum && gameEnd[3] === 1) {
                cc.log("最后的飞机！planeNum:", i);
                return true;
            }
        }
    }
    cc.log("为什么不是飞机呀");
    return false;
};

cutil.checkIsFourBring2 = function (cards, gamePalys) { //四带二
    cc.log("checkIsFourBring2:", cards, gamePalys);
    if (cards.length < 6 || gamePalys[1] !== 1) {
        return false;
    }
    var fourCardNum = 0;
    var bringNum = 0;
    var card2NumDict = cutil.getCard2NumDict(cards);
    for (var key in card2NumDict) {
        if (card2NumDict[key] === 4) {
            fourCardNum += 1;
        } else {
            bringNum += card2NumDict[key];
        }
    }
    cc.log(fourCardNum, bringNum);
    if (fourCardNum === 1 && bringNum === 2) {
        return true;
    } else {
        return false;
    }
    return false;
};

cutil.checkIsFourBring3 = function (cards, gamePlays) {  // 四带三
    cc.log("checkIsFourBring3:", cards, gamePlays);
    if (cards.length < 7 || gamePlays[2] !== 1) {
        return false;
    }
    var fourCardNum = 0;
    var bringNum = 0;
    var card2NumDict = cutil.getCard2NumDict(cards);
    for (var key in card2NumDict) {
        if (card2NumDict[key] === 4) {
            fourCardNum += 1;
        } else {
            bringNum += card2NumDict[key];
        }
    }
    if (fourCardNum === 1 && bringNum === 3) {
        return true;
    } else {
        return false;
    }
    return false;
};

cutil.checkIsBomb = function (cards) {
    cc.log("checkIsBomb");
    if (cards.length !== 2) {
        return false;
    }
    if ((cards[0] === 18 && cards[1] === 19) || (cards[0] === 19 && cards[1] === 18 )) {
        return true;
    }
    return false;
};

//癞子计算  normalCards, keyCards
cutil.checkIsKeyCardPair = function (normalCards, keyCards) { //对子
    cc.log("checkIsKeyCardPair");
    if (normalCards.length === 1 && keyCards.length === 1) {
        return true;
    }
    return false;
};

cutil.checkIsKeyCardSerialPair = function (normalCards, keyCards) { //连对
    cc.log("checkIsKeyCardSerialPair");
    if (normalCards.length + keyCards.length < 4 || (normalCards.length + keyCards.length) % 2 !== 0) {
        return false;
    }
    if (normalCards.length + keyCards.length > 16) { //最大不能超过 16张
        return false;
    }
    var keyCardNum = keyCards.length;
    var card2NumDict = cutil.getCard2NumDict(normalCards);
    //数量是否满足
    for (var card in card2NumDict) {
        if (card2NumDict[card] > 2) {
            return false
        } else if (card2NumDict[card] < 2) {
            var needNum = 2 - card2NumDict[card];
            if (keyCardNum < needNum) {
                return false
            }
            keyCardNum -= needNum
        }
    }
    //是否连续
    var isSerial = true;
    var restJokerPairNum = keyCardNum / 2;
    var keyList = cutil.getKeyList(card2NumDict);
    for (var i = 0; i < keyList.length - 1; i++) {
        var j = 1;
        while (keyList[i] + j !== keyList[i + 1]) {
            if (restJokerPairNum <= 0) {
                isSerial = false;
                break;
            }
            j += 1;
            restJokerPairNum -= 1;
        }
    }
    return isSerial
};

cutil.checkIsKeyCardTriple = function (normalCards, keyCards) { //三张
    cc.log("checkIsKeyCardTriple");
    if (normalCards.length + keyCards.length !== 3) {
        return false;
    }
    if (normalCards.length === 2) {
        if (normalCards[0] === normalCards[1]) {
            return true
        }
        return false
    }
    return true
};

cutil.checkIsKeyCardTripleBring = function (normalCards, keyCards) {    //三带二或三带一
    cc.log("checkIsKeyCardTriple");
    if ((normalCards.length + keyCards.length) !== 5 && (normalCards.length + keyCards.length) !== 4) {
        return false;
    }
    var keyCardNum = keyCards.length;
    var card2NumDict = cutil.getCard2NumDict(normalCards);
    for (var card in card2NumDict) {
        if ((3 - card2NumDict[card]) === keyCardNum) {
            return true
        }
    }
    return false
};

cutil.checkIsKeyCardSerialTriple = function (normalCards, keyCards) { //连三张
    cc.log('checkIsKeyCardSerialTriple');
    if (normalCards.length + keyCards.length < 6 && (normalCards.length + keyCards.length) % 3 !== 0) {
        return false
    }
    if (normalCards.length + keyCards.length > 15) { //最大不能超过 3-A
        return false;
    }
    var keyCardNum = keyCards.length;
    var card2NumDict = cutil.getCard2NumDict(normalCards);
    //数量
    for (var card in card2NumDict) {
        if (card2NumDict[card] > 3) {
            return false
        } else if (card2NumDict[card] < 3) {
            var needNum = 3 - card2NumDict[card];
            if (keyCardNum < needNum) {
                return false
            }
            keyCardNum -= needNum
        }
    }
    //连续;
    var isSerial = true;
    var restJokerTripleNum = keyCardNum / 3;
    var keyList = cutil.getKeyList(card2NumDict);
    for (var i = 0; i < keyList.length - 1; i++) {
        var j = 1;
        while (keyList[i] + j !== keyList[i + 1]) {
            if (restJokerTripleNum <= 0) {
                isSerial = false;
                break;
            }
            j += 1;
            restJokerTripleNum -= 1;
        }
    }
    return isSerial
};

cutil.checkIsKeyCardSerialSingle = function (normalCards, keyCards) { //顺子
    cc.log('checkIsKeyCardSerialSingle');
    cc.log(normalCards, keyCards);
    cc.log("=================================");
    if (normalCards.length + keyCards.length < 5) {
        return false
    }
    if (normalCards.length + keyCards.length > 12) { //最大不能超过 3-A
        return false;
    }

    var card2NumDict = cutil.getCard2NumDict(normalCards);
    //数量
    for (var card in card2NumDict) {
        if (card2NumDict[card] !== 1) {
            return false
        }
        if (parseInt(card) === 16){
            return false
        }
    }

    //连续
    var isSerial = true;
    var keyCardNum = keyCards.length;
    var keyList = cutil.getKeyList(card2NumDict);
    for (var i = 0; i < keyList.length - 1; i++) {
        var j = 1;
        while (keyList[i] + j !== keyList[i + 1]) {
            if (keyCardNum <= 0) {
                isSerial = false;
                break;
            }
            j += 1;
            keyCardNum -= 1
        }
    }
    return isSerial
};

cutil.checkIsKeyCardPlane = function (normalCards, keyCards) {    // 飞机
    cc.log("checkIsKeyCardPlane");
    var keyCardNum = keyCards.length;
    var cardsNum = normalCards.length + keyCardNum;
    if (cardsNum < 7 || cardsNum > 16) {
        return false
    }
    normalCards.sort(function (a, b) {   //从小到大排列
        return a - b;
    });

    var pairNum = Math.ceil(cardsNum / 5);
    var min_card = normalCards[0];
    var max_card = normalCards[normalCards.length - 1];
    var card2NumDict = cutil.getCard2NumDict(normalCards);
    for (var i = min_card; i < max_card; i++) {
        var pairCardNum = 0;
        var useKeyCardNum = keyCardNum;
        for (var j = 0; j < pairNum; j++) {
            if (card2NumDict[i + j] === undefined) {
                useKeyCardNum -= 3;
                pairCardNum += 1;
            } else if (card2NumDict[i + j] >= 3) {
                pairCardNum += 1;
            } else if (card2NumDict[i + j] === 2) {
                useKeyCardNum -= 1;
                pairCardNum += 1;
            } else if (card2NumDict[i + j] === 1) {
                useKeyCardNum -= 2;
                pairCardNum += 1;
            }
            if (useKeyCardNum < 0) {
                pairCardNum -= 1;
                break;
            }
        }

        if (pairCardNum === pairNum) {
            return true;
        }
    }
    return false;
};

cutil.checkPlaneNum = function () {

};

cutil.checkIsKeyCardTripleBring2 = function (normalCards, keyCards) {
    cc.log("checkIsKeyCardFourBring2");
    var keyNum = keyCards.length;
    if ((normalCards.length + keyNum) !== 5) {
        return false
    }

    var card2NumDict = cutil.getCard2NumDict(normalCards);
    for (var card in card2NumDict) {
        if ((card2NumDict[card] + keyNum) === 3) {
            return true;
        }
    }
    return false;
};

cutil.checkIsKeyCardFourBring2 = function (normalCards, keyCards) {
    cc.log("checkIsKeyCardFourBring2");
    return false;
    var keyNum = keyCards.length;
    if ((normalCards.length + keyNum) !== 6) {
        return false
    }

    var card2NumDict = cutil.getCard2NumDict(normalCards);
    for (var card in card2NumDict) {
        if ((card2NumDict[card] + keyNum) === 4) {
            return true;
        }
    }
    return false;
};

cutil.checkIsKeyCardFourBring3 = function (normalCards, keyCards) {
    cc.log("checkIsKeyCardFourBring3");
    return false;
    var keyNum = keyCards.length;
    if ((normalCards.length + keyNum) !== 7) {
        return false
    }

    var card2NumDict = cutil.getCard2NumDict(normalCards);
    for (var card in card2NumDict) {
        if ((card2NumDict[card] + keyNum) === 4) {
            return true;
        }
    }
    return false;
};

cutil.checkIsKeyCardBombMAX = function (normalCards, keyCards) { // 炸弹
    cc.log('checkIsKeyCardBomb');
    if (normalCards.length === 0 && keyCards.length === 4) {
        return true
    } else {
        return false;
    }
};

cutil.checkIsKeyCardBomb = function (normalCards, keyCards) { // 炸弹
    cc.log('checkIsKeyCardBomb');
    if (normalCards.length + keyCards.length !== 4) {
        return false
    }
    if (normalCards.length <= 0) {
        return false
    }
    var card2NumDict = cutil.getCard2NumDict(normalCards);
    return Object.keys(card2NumDict).length === 1;
};

cutil.getOriginCardInsteadNum = function (originCard) {
    var notJokerList = [const_val.HEI, const_val.HONG, const_val.MEI, const_val.FANG];
    for (var i = 0; i < notJokerList.length; i++) {
        if (notJokerList[i].indexOf(originCard) >= 0) {
            return const_val.INSTEAD[notJokerList[i].indexOf(originCard)];
        }
    }
    return originCard;
};

cutil.getRightShiftCardInsteadNum = function (shiftCard) {
    var originCard = shiftCard << 3;
    return cutil.getOriginCardInsteadNum(originCard);
};

cutil.getInsteadMidSerialCard = function (shiftSerialCard, keyCardNum) { //往中间填
    var insteadCards = [];
    shiftSerialCard.sort(function (a, b) {
        return a - b;
    });
    for (var i = 0; i < shiftSerialCard.length - 1; i++) {
        var j = 1;
        while (shiftSerialCard[i] + j !== shiftSerialCard[i + 1]) {
            insteadCards.push(cutil.getRightShiftCardInsteadNum(shiftSerialCard[i] + j));
            keyCardNum -= 1;
            j += 1;
        }
    }
    return [insteadCards, keyCardNum];
};

cutil.getInsteadEndSerialCard = function (shiftSerialCard, keyCardNum) { // 往后填
    var insteadCards = [];
    shiftSerialCard.sort(function (a, b) {
        return a - b;
    });
    var maxCard = shiftSerialCard[shiftSerialCard.length - 1];
    while (maxCard && maxCard < (cutil.getMaxSerialCard() >> 3) && keyCardNum > 0) {
        maxCard += 1;
        keyCardNum -= 1;
        insteadCards.push(cutil.getRightShiftCardInsteadNum(maxCard));
    }
    return [insteadCards, keyCardNum];
};

cutil.getInsteadBeforeSerialCard = function (shiftSerialCard, keyCardNum) { //往前填
    var insteadCards = [];
    shiftSerialCard.sort(function (a, b) {
        return a - b;
    });
    var minCard = shiftSerialCard[0];
    while (minCard && minCard > (cutil.getMinSerialCard() >> 3) && keyCardNum > 0) {
        minCard -= 1;
        keyCardNum -= 1;
        insteadCards.push(cutil.getRightShiftCardInsteadNum(minCard));
    }
    return [insteadCards, keyCardNum];
};

//按最大牌型生成新牌（必须满足可以生成）
cutil.makeKeyCardPair = function (originCardsButKey, originKeys) {   //癞子转化为新的对子
    // 王不能替王 两个王的情况（一大一小）
    var newOriginPair = [];
    newOriginPair.push(originCardsButKey[0]);
    newOriginPair.push(cutil.getOriginCardInsteadNum(originCardsButKey[0]));
    newOriginPair.sort(function (a, b) {
        return a - b;
    });
    return newOriginPair;
};

cutil.makeKeyCardSerialSingle = function (originCardsButKey, originKeys) {   //癞子转化为新的顺子
    var makeCards = cutil.deepCopy(originCardsButKey);
    var shiftCards = cutil.rightShiftCards(originCardsButKey);
    shiftCards.sort(function (a, b) {
        return a - b;
    });
    var pairNum = parseInt(shiftCards.length + originKeys.length);

    var card2ListDict = cutil.getCard2ListDict(originCardsButKey);
    var min_card = shiftCards[0];
    var max_card = shiftCards[shiftCards.length - 1];
    if (min_card > 14 - pairNum + 1 && max_card <= 14) {
        min_card = 14 - pairNum + 1;
    }
    for (var j = 0; j < pairNum; j++) {
        var tempList = [];
        if (!card2ListDict[min_card + j]) {
            tempList.push((min_card + j) << 3);
        }
        makeCards = makeCards.concat(tempList);
    }

    makeCards.sort(function (a, b) {
        return a - b;
    });
    cc.log("顺子转化：", makeCards);
    return makeCards;
};

cutil.makeKeyCardSerialPair = function (originCardsButKey, originKeys) {  //癞子转化为新的连对
    var makeCards = cutil.deepCopy(originCardsButKey);
    var shiftCards = cutil.rightShiftCards(originCardsButKey);
    shiftCards.sort(function (a, b) {
        return a - b;
    });
    var pairNum = parseInt((shiftCards.length + originKeys.length) / 2);

    var card2ListDict = cutil.getCard2ListDict(originCardsButKey);
    var min_card = shiftCards[0];
    var max_card = shiftCards[shiftCards.length - 1];
    if (min_card > 14 - pairNum + 1 && max_card <= 14) {
        min_card = 14 - pairNum + 1;
    }
    cc.log("min_card " + min_card + " max_card " + max_card);
    for (var j = 0; j < pairNum; j++) {
        var tempList = [];
        if (!card2ListDict[min_card + j]) {
            tempList.push((min_card + j) << 3);
            tempList.push((min_card + j) << 3);
        } else if (card2ListDict[min_card + j].length === 1) {
            tempList.push((min_card + j) << 3)
        }
        makeCards = makeCards.concat(tempList);
    }

    makeCards.sort(function (a, b) {
        return a - b;
    });
    cc.log("连对转化：", makeCards);
    return makeCards;
};

cutil.makeKeyCardTriple = function (originCardsButKey, originKeys) {  //癞子转化为新的三张
    cc.log("makeKeyCardTriple: ", originCardsButKey, originKeys);
    var keyCardNum = originKeys.length;
    var makeCards = cutil.deepCopy(originCardsButKey);
    for (var i = 0; i < originKeys.length; i++) {
        makeCards.push(cutil.getOriginCardInsteadNum(originCardsButKey[0]))
    }
    return makeCards
};

cutil.makeKeyCardSerialTriple = function (originCardsButKey, originKeys) {  //癞子转化为新的飞机不带
    cc.log("makeKeyCardSerialTriple: ", originCardsButKey, originKeys);
    var makeCards = cutil.deepCopy(originCardsButKey);
    var shiftCards = cutil.rightShiftCards(originCardsButKey);
    shiftCards.sort(function (a, b) {
        return a - b;
    });
    var pairNum = parseInt((shiftCards.length + originKeys.length) / 3);

    var card2ListDict = cutil.getCard2ListDict(originCardsButKey);
    var min_card = shiftCards[0];
    var max_card = shiftCards[shiftCards.length - 1];
    if (min_card > 14 - pairNum + 1 && max_card <= 14) {
        min_card = 14 - pairNum + 1;
    }
    cc.log("min_card " + min_card + " max_card " + max_card);
    for (var j = 0; j < pairNum; j++) {
        var tempList = [];
        if (!card2ListDict[min_card + j]) {
            tempList.push((min_card + j) << 3);
            tempList.push((min_card + j) << 3);
            tempList.push((min_card + j) << 3);
        } else if (card2ListDict[min_card + j].length === 2) {
            tempList.push((min_card + j) << 3)
        } else if (card2ListDict[min_card + j].length === 1) {
            tempList.push((min_card + j) << 3);
            tempList.push((min_card + j) << 3)
        }
        makeCards = makeCards.concat(tempList);
    }

    makeCards.sort(function (a, b) {
        return a - b;
    });
    cc.log("飞机不带转化：", makeCards);
    return makeCards;
};

cutil.makeKeyCardPlane = function (originCardsButKey, originKeys) {
    cc.log("makeKeyCardPlane: ", originCardsButKey, originKeys);
    var makeCards = cutil.deepCopy(originCardsButKey);
    var shiftCards = cutil.rightShiftCards(originCardsButKey);
    shiftCards.sort(function (a, b) {
        return a - b;
    });
    var keyCardNum = originKeys.length;
    var pairNum = Math.ceil((shiftCards.length + keyCardNum) / 5);

    var card2ListDict = cutil.getCard2ListDict(originCardsButKey);
    var min_card = shiftCards[0];
    var max_card = shiftCards[shiftCards.length - 1];
    var suggestList = [];
    for (var i = min_card; i <= max_card; i++) {
        var tempList = [];
        var useKeyCardNum = keyCardNum;
        var pairCardNum = 0;
        for (var j = 0; j < pairNum; j++) {
            if (!card2ListDict[i + j]) {
                useKeyCardNum -= 3;
                pairCardNum += 1;
                if (useKeyCardNum >= 0) {
                    tempList.push((i + j) << 3);
                    tempList.push((i + j) << 3);
                    tempList.push((i + j) << 3);
                }
            } else if (card2ListDict[i + j].length === 3 && (i + j) !== 15) {
                pairCardNum += 1;
            } else if (card2ListDict[i + j].length === 2) {
                useKeyCardNum -= 1;
                pairCardNum += 1;
                if (useKeyCardNum >= 0) {
                    tempList.push((i + j) << 3);
                }
            } else if (card2ListDict[i + j].length === 1) {
                useKeyCardNum -= 2;
                pairCardNum += 1;
                if (useKeyCardNum >= 0) {
                    tempList.push((i + j) << 3);
                    tempList.push((i + j) << 3);
                }
            }
            if (useKeyCardNum < 0) {
                pairCardNum -= 1;
                break;
            }
        }
        if (pairCardNum === pairNum) {
            suggestList = tempList;
        }
    }

    if (originKeys.length > suggestList.length) {
        for (var i = suggestList.length; i < originKeys.length; i++) {
            suggestList.push(originKeys[i]);
        }
    }
    makeCards = makeCards.concat(suggestList);
    makeCards.sort(function (a, b) {
        return a - b;
    });
    cc.log("飞机转化：", makeCards);
    return makeCards;
};

cutil.makeKeyCardFourBring = function (originCardsButKey, originKeys) {
    cc.log("makeKeyCardFourBring: ", originCardsButKey, originKeys);
    var makeCards = cutil.deepCopy(originCardsButKey);
    var shiftCards = cutil.rightShiftCards(originCardsButKey);
    shiftCards.sort(function (a, b) {
        return a - b;
    });
    var keyCardNum = originKeys.length;

    var card2ListDict = cutil.getCard2ListDict(originCardsButKey);
    var suggestList = [];
    for (var card in card2ListDict) {
        var tempList = [];
        if (card2ListDict[card].length === (4 - keyCardNum)) {
            for (var i = 0; i < keyCardNum; i++) {
                tempList.push(card << 3);
            }
            suggestList = tempList
        }
    }
    cc.log("suggestList ", suggestList);
    makeCards = makeCards.concat(suggestList);
    makeCards.sort(function (a, b) {
        return a - b;
    });
    cc.log("四带二或四带三转化：", makeCards);
    return makeCards;
};

cutil.makeKeyCardTripleBring = function (originCardsButKey, originKeys) {
    cc.log("makeKeyCardTripleBring: ", originCardsButKey, originKeys);
    var makeCards = cutil.deepCopy(originCardsButKey);
    var shiftCards = cutil.rightShiftCards(originCardsButKey);
    shiftCards.sort(function (a, b) {
        return a - b;
    });
    var keyCardNum = originKeys.length;

    var card2ListDict = cutil.getCard2ListDict(originCardsButKey);
    var suggestList = [];
    for (var card in card2ListDict) {
        var tempList = [];
        if (card2ListDict[card].length === (3 - keyCardNum)) {
            for (var i = 0; i < keyCardNum; i++) {
                tempList.push(card << 3);
            }
            suggestList = tempList
        }
    }
    cc.log("suggestList ", suggestList);
    makeCards = makeCards.concat(suggestList);
    makeCards.sort(function (a, b) {
        return a - b;
    });
    cc.log("三带二或三带一转化：", makeCards);
    return makeCards;
};

cutil.makeKeyCardNormalBomb = function (originCardsButKey, originKeys) {  //癞子转化为新的炸弹
    cc.log("makeKeyCardNormalBomb: ", originCardsButKey, originKeys);
    var makeCards = cutil.deepCopy(originCardsButKey);
    for (var i = 0; i < originKeys.length; i++) {
        makeCards.push((originCardsButKey[0] >> 3) << 3)
    }
    makeCards.sort(function (a, b) {
        return a - b;
    });
    return makeCards
};

//返回需要的 list
function getLeftOffset(i, seq) {
    var sequence = cutil.deepCopy(seq);
    if (const_val.CARD2 in sequence) {
        sequence.splice(sequence.indexOf(const_val.CARD2), 1)
    }
    sequence.sort(function (a, b) {
        return b - a
    });
    if (i < 0) {
        var lis = [];
        for (var j = 14; j >= 3; j--) {
            if (j > sequence[0]) {
                lis.push(j)
            }
            return lis
        }
    }
    var lis = [];
    for (var j = 14; j >= 3; j--) {
        if (sequence[i + 1] < j && j < sequence[i + 1]) {
            lis.push(j)
        }
    }
    return lis
}

function getRightOffset(i, seq) {
    var sequence = cutil.deepCopy(seq);
    if (const_val.CARD2 in sequence) {
        sequence.splice(sequence.indexOf(const_val.CARD2), 1)
    }
    sequence.sort(function (a, b) {
        return a - b
    });
    if (i < 0) {
        var lis = [];
        for (var j = 3; j <= 14; j++) {
            if (j < sequence[0]) {
                lis.push(j)
            }
        }
        return lis
    }
    var lis = [];
    for (var j = 3; j <= 14; j++) {
        if (sequence[i] < j && j < sequence[i + 1]) {
            lis.push(j)
        }
    }
    return lis
}

cutil.rightShiftCards = function (cards) {
    var result = [];
    for (var i = 0; i < cards.length; i++) {
        result[i] = cards[i] >> 3
    }
    return result
};

//炸弹不可拆问题
cutil.getCanPlay = function (cards, playerCards, gamePlays) {
    if (gamePlays[3] === 0) {
        return true;
    }
    cc.log(playerCards);
    var forKeyList = [];
    var keyCard = h1global.entityManager.player().curGameRoom.keyCard;
    var playerCards = cutil.rightShiftCards(playerCards);
    var playerCardsDict = cutil.getCard2NumDict(playerCards);
    for (var card in playerCardsDict) {
        if (playerCardsDict[card] === 4 && (keyCard >> 3) !== parseInt(card)) {
            forKeyList.push(parseInt(card));
        }
    }
    cc.log("forKeyList ", forKeyList);
    var forKeyNum = 0;
    for (var i = 0; i < forKeyList.length; i++) {
        for (var j = 0; j < cards.length; j++) {
            if (cards[j] === forKeyList[i]) {
                forKeyNum += 1
            }
        }
    }
    cc.log("forKeyNum :", forKeyNum);
    return forKeyNum === 0 || forKeyNum === 4;
};

cutil.checkSplitBomb = function (cards, playerCards, gamePlays) {//炸弹不可拆
    var card2NumDict = cutil.getCard2NumDict(cards);
    var playerCards2NumDict = cutil.getCard2NumDict(playerCards);
    var keyCard = h1global.entityManager.player().curGameRoom.keyCard;
    if (gamePlays[3] === 1) {//炸弹不可拆
        for (var card in card2NumDict) {
            if (parseInt(card) !== (keyCard >> 3)) {
                if (card2NumDict[card] === 4 && cards.length !== 4 && //如果出牌中有炸弹，并且出牌数不为4，并且牌型不是四带二和四带三
                    !cutil.checkIsFourBring2(cards, gamePlays) && !cutil.checkIsFourBring3(cards, gamePlays)) {
                    cc.log("炸弹不可拆！");
                    return true;
                }
                if (playerCards2NumDict[card] && playerCards2NumDict[card] === 4 && playerCards2NumDict[card] !== card2NumDict[card]) {
                    cc.log("炸弹不可拆！");
                    return true;
                }
            }
        }
    }
    return false;
};

cutil.getNormalCardsType = function (cards, playerCards, playerCardsNum, gamePlays, gameEnd, discardType) {
    playerCards = playerCards || [];
    playerCardsNum = playerCardsNum || 0;
    gamePlays = gamePlays || [];
    gameEnd = gameEnd || [];
    discardType = discardType || 0;
    cc.log("getNormalCardsType");
    if (cards.length <= 0) {  //没有的牌型
        return const_val.TYPE_NO_CARD;
    } else if (cutil.checkSplitBomb(cards, playerCards, gamePlays)) {  //炸弹不可拆
        return const_val.TYPE_INVALID;
    } else if (cutil.checkIsSingle(cards)) {  //单张
        return const_val.TYPE_SINGLE;
    } else if (cutil.checkIsPair(cards)) {  //对子
        return const_val.TYPE_PAIR;
    } else if (cutil.checkIsSerialPair(cards)) {  //连对
        return const_val.TYPE_SERIAL_PAIR;
    } else if (cutil.checkIsTriple(cards, playerCardsNum, gameEnd, discardType)) {  //三张
        return const_val.TYPE_TRIPLE;
    } else if (cutil.checkIsSerialTriple(cards)) {  //飞机不带
        return const_val.TYPE_SERIAL_TRIPLE;
    } else if (cutil.checkIsSerialSingle(cards)) {  //顺子
        return const_val.TYPE_SERIAL_SINGLE;
    } else if (cutil.checkIsNormalBomb(cards)) {  //炸弹
        return const_val.TYPE_BOMB;
    } else if (cutil.checkIsTripleBring1(cards, playerCardsNum, gameEnd, discardType)) {  //三带一
        return const_val.TYPE_TRIPLE_ONE;
    } else if (cutil.checkIsTripleBring2(cards)) {  //三带二
        return const_val.TYPE_TRIPLE_TWO;
    } else if (cutil.checkIsPlane(cards, playerCardsNum, gameEnd, discardType)) {   //飞机
        return const_val.TYPE_PLANE_ONE;
    } else if (cutil.checkIsFourBring2(cards, gamePlays)) {   //四带二
        return const_val.TYPE_FOUR_TWO;
    } else if (cutil.checkIsFourBring3(cards, gamePlays)) {   //四带三
        return const_val.TYPE_FOUR_THREE;
    }
    return const_val.TYPE_INVALID
};

cutil.IsCardsTypeSame = function (normalCards, keyCards, cmpType) {
    var type = false;
    switch (cmpType) {
        case const_val.TYPE_BOMB:
            type = cutil.checkIsKeyCardBomb(normalCards, keyCards);
            break;
        case const_val.TYPE_SERIAL_SINGLE:
            type = cutil.checkIsKeyCardSerialSingle(normalCards, keyCards);
            break;
        case const_val.TYPE_PLANE_ONE:
            type = cutil.checkIsKeyCardPlane(normalCards, keyCards);
            break;
        case const_val.TYPE_PAIR:
            type = cutil.checkIsKeyCardPair(normalCards, keyCards);
            break;
        case const_val.TYPE_SERIAL_PAIR:
            type = cutil.checkIsKeyCardSerialPair(normalCards, keyCards);
            break;
        case const_val.TYPE_TRIPLE:
            type = cutil.checkIsKeyCardTriple(normalCards, keyCards);
            break;
        case const_val.TYPE_SERIAL_TRIPLE:
            type = cutil.checkIsKeyCardSerialTriple(normalCards, keyCards);
            break;
        case const_val.TYPE_TRIPLE_TWO:
            type = cutil.checkIsKeyCardTripleBring(normalCards, keyCards);
            break;
        default:
            type = false;
            break;
    }
    return type;
};
// 0无牌 1非可出牌型 22对子 23连对 24三张 25连三张
// 26顺子 27炸弹
cutil.getInsteadCardsType = function (normalCards, keyCards) {
    var type = [];
    if (normalCards.length + keyCards.length <= 0) {
        type.push(const_val.TYPE_NO_CARD);
    } else if (cutil.checkIsKeyCardBombMAX(normalCards, keyCards)) {
        type.push(const_val.TYPE_BOMB_MAX);
    } else if (cutil.checkIsKeyCardBomb(normalCards, keyCards)) {
        type.push(const_val.TYPE_BOMB);
    } else if (cutil.checkIsKeyCardSerialSingle(normalCards, keyCards)) {
        type.push(const_val.TYPE_SERIAL_SINGLE);
    } else if (cutil.checkIsKeyCardPair(normalCards, keyCards)) {
        type.push(const_val.TYPE_PAIR);
    } else if (cutil.checkIsKeyCardSerialPair(normalCards, keyCards)) {
        type.push(const_val.TYPE_SERIAL_PAIR);
    } else if (cutil.checkIsKeyCardPlane(normalCards, keyCards)) {
        type.push(const_val.TYPE_PLANE_ONE);
    } else if (cutil.checkIsKeyCardTriple(normalCards, keyCards)) {
        type.push(const_val.TYPE_TRIPLE);
    } else if (cutil.checkIsKeyCardSerialTriple(normalCards, keyCards)) {
        type.push(const_val.TYPE_SERIAL_TRIPLE);
    } else if (cutil.checkIsKeyCardTripleBring(normalCards, keyCards)) {
        type.push(const_val.TYPE_TRIPLE_TWO);
    } else {
        type.push(const_val.TYPE_INVALID);
    }
    return type;
};

cutil.cmpSameLineSerialBomb = function (baseCards, selCards) {
    cc.log("cmpSameLineSerialBomb");
    var baseLine = cutil.getSerialBombLine(baseCards);
    var selLine = cutil.getSerialBombLine(selCards);
    if (selLine > baseLine) {
        return true
    } else if (baseCards.indexOf(const_val.CARD2) >= 0 && selCards.indexOf(const_val.CARD2) < 0) {
        return true
    } else if (baseCards.indexOf(const_val.CARD2) < 0 && selCards.indexOf(const_val.CARD2) >= 0) {
        return false
    } else if (baseCards.indexOf(const_val.CARD2) >= 0 && selCards.indexOf(const_val.CARD2) >= 0) {
        var baseMin = cutil.getMinCard2SerialBombCard(baseCards);
        var selMin = cutil.getMinCard2SerialBombCard(selCards);
        cc.log(baseMin, selMin);
        if (selMin > baseMin) {
            return true
        }
        return false
    } else {
        var baseMin = cutil.getMinSerialBombCard(baseCards);
        var selMin = cutil.getMinSerialBombCard(selCards);
        cc.log(baseMin, selMin);
        if (selMin > baseMin) {
            return true;
        }
        return false
    }
};

cutil.getMinCard2SerialBombCard = function (cards) {
    var minCard = const_val.CARD2;
    for (var i = const_val.CIRCLE.length - 1; i >= 0; i--) {
        if (cards.indexOf(const_val.CIRCLE[i]) >= 0) {
            minCard = const_val.CIRCLE[i];
        } else {
            break;
        }
    }
    return minCard;
};

cutil.getMinSerialBombCard = function (cards) {
    var copyList = cutil.deepCopy(cards);
    copyList.sort(function (a, b) {
        return a - b;
    });
    return copyList[0]
};

cutil.getSerialBombLine = function (cards) {
    return cutil.getSerialBombNum(cards) + cutil.getSerialBombSerialNum(cards)
};

cutil.cmpSameTypeCards = function (controllerCards, cards, cardsType) { //[24, 24, 25, 28] [72, 73, 74, 75]
    cc.log("cmpSameTypeCards", controllerCards, cards, cardsType);
    var baseCards = cutil.rightShiftCards(controllerCards);
    var selCards = cutil.rightShiftCards(cards);
    var card2NumDict_1 = cutil.getCard2NumDict(baseCards);
    var card2NumDict_2 = cutil.getCard2NumDict(selCards);
    var comList = [];
    for (var key in card2NumDict_1) {
        if (card2NumDict_1[key] >= 3) {
            comList.push(parseInt(key));
        }
    }
    cc.log("cmpSameTypeCards", baseCards, selCards);
    if (cardsType === 0 || cardsType === 1) {
        return false
    } else if (cardsType === 2 || cardsType === 3 || cardsType === 4 || cardsType === 5 || cardsType === 6 || cardsType === 7) {
        if (baseCards.length === selCards.length && selCards[0] > baseCards[0]) {
            return true
        } else if (cardsType === 6 && baseCards.length !== selCards.length && selCards[0] > comList[0]) {
            return true
        } else if (cardsType === 5 && baseCards.length !== selCards.length && selCards[0] > comList[0]) {
            return true
        }
    } else if (cardsType === 12 || cardsType === 13) {
        // 普通（不含癞子）
        var tripleBring_1 = null;
        var tripleBring_2 = null;
        for (var key in card2NumDict_1) {
            if (card2NumDict_1[key] >= 3) {
                tripleBring_1 = key;
            }
        }
        for (var key in card2NumDict_2) {
            if (card2NumDict_2[key] >= 3) {
                tripleBring_2 = key;
            }
        }
        cc.log("tripleBring_1 :" + tripleBring_1 + "tripleBring_2 :" + tripleBring_2);
        return parseInt(tripleBring_2) > parseInt(tripleBring_1);
    } else if (cardsType === 14) {
        var tripleCrds_1 = [];
        var tripleCrds_2 = [];
        var tripleCrds_1_max = 0;
        var tripleCrds_2_min = 0;
        for (var key in card2NumDict_1) {
            if (card2NumDict_1[key] >= 3) {
                tripleCrds_1.push(parseInt(key));
            }
        }
        for (var key in card2NumDict_2) {
            if (card2NumDict_2[key] >= 3) {
                tripleCrds_2.push(parseInt(key));
            }
        }
        tripleCrds_1.sort(function (a, b) {
            return a - b;
        });
        tripleCrds_2.sort(function (a, b) {
            return a - b;
        });
        for (var i = 0; i < tripleCrds_1.length - 1; i++) {
            if ((tripleCrds_1[i] + 1) === tripleCrds_1[i + 1]) {
                tripleCrds_1_max = tripleCrds_1[i + 1];
            }
        }
        for (var i = 0; i < tripleCrds_2.length - 1; i++) {
            if ((tripleCrds_2[i] + 1) === tripleCrds_2[i + 1]) {
                tripleCrds_2_min = tripleCrds_2[i];
            }
        }

        if (tripleCrds_1_max < tripleCrds_2_min) {
            return true
        }
        return false
    } else if (cardsType === 15 || cardsType === 16) {
        var fourcard_1 = 0;
        var fourcard_2 = 0;
        for (var key in card2NumDict_1) {
            if (card2NumDict_1[key] === 4) {
                fourcard_1 = parseInt(key);
            }
        }
        for (var key in card2NumDict_2) {
            if (card2NumDict_2[key] >= 3) {
                fourcard_2 = parseInt(key);
            }
        }
        if (fourcard_1 < fourcard_2) {
            return true;
        }
        return false;
    } else if (cardsType === 99) {
        var conKeyNum = 0;
        var cardsKeyNum = 0;
        for (var i = 0; i < controllerCards.length; i++) {
            if (const_val.INSTEAD.indexOf(controllerCards[i]) >= 0) {
                conKeyNum += 1
            }
        }
        for (var i = 0; i < cards.length; i++) {
            if (const_val.INSTEAD.indexOf(cards[i]) >= 0) {
                cardsKeyNum += 1
            }
        }
        if (conKeyNum === 4) {
            return false
        }
        if (cardsKeyNum === 4) {
            return true
        }

        if (cardsKeyNum > 0 && conKeyNum > 0) {
            if (selCards[0] > baseCards[0]) {
                return true
            }
        } else if (cardsKeyNum > 0 && conKeyNum <= 0) {
            return false
        } else if (cardsKeyNum <= 0 && conKeyNum > 0) {
            return true
        } else if (cardsKeyNum <= 0 && conKeyNum <= 0) {
            if (selCards[0] > baseCards[0]) {
                return true
            }
        }
    }
    return false
};

cutil.makeCard = function (originCards, cardsType) {
    var classifyList = cutil.classifyCards(originCards);
    cc.log("makeCard ", originCards, cardsType);
    cc.log(classifyList, cardsType);
    if (cardsType === 3) {
        return cutil.makeKeyCardPair(classifyList[0], classifyList[1]);
    } else if (cardsType === 4) {
        return cutil.makeKeyCardSerialPair(classifyList[0], classifyList[1]);
    } else if (cardsType === 5) {
        return cutil.makeKeyCardTriple(classifyList[0], classifyList[1]);
    } else if (cardsType === 6) {
        return cutil.makeKeyCardSerialTriple(classifyList[0], classifyList[1]);
    } else if (cardsType === 7) {
        return cutil.makeKeyCardSerialSingle(classifyList[0], classifyList[1]);
    } else if (cardsType === 13) {
        return cutil.makeKeyCardTripleBring(classifyList[0], classifyList[1]);
    } else if (cardsType === 14) {
        return cutil.makeKeyCardPlane(classifyList[0], classifyList[1]);
    } else if (cardsType === 99) {
        return cutil.makeKeyCardNormalBomb(classifyList[0], classifyList[1]);
    }
    return originCards;
    //    if (cardsType === 15 || cardsType === 16) {
    // 	return cutil.makeKeyCardFourBring(classifyList[0], classifyList[1]);
    // }
};

cutil.get_user_info = function (accountName, callback) {
    var info_dict = eval('(' + cc.sys.localStorage.getItem("INFO_JSON") + ')');
    var user_info_xhr = cc.loader.getXMLHttpRequest();
    user_info_xhr.open("GET", switches.PHP_SERVER_URL + "/api/user_info", true);
    user_info_xhr.onreadystatechange = function () {
        if (user_info_xhr.readyState === 4 && user_info_xhr.status === 200) {
            // cc.log(user_info_xhr.responseText);
            if (callback) {
                callback(user_info_xhr.responseText);
            }
        }
    };
    user_info_xhr.setRequestHeader("Authorization", "Bearer " + info_dict["token"]);
    user_info_xhr.send();
};

cutil.get_activity_info = function (callback) {
    var activity_info_xhr = cc.loader.getXMLHttpRequest();
    activity_info_xhr.open("GET", switches.PHP_SERVER_URL + "/api/activity_info", true);
    activity_info_xhr.onreadystatechange = function () {
        if (activity_info_xhr.readyState === 4 && activity_info_xhr.status === 200) {
            // cc.log(activity_info_xhr.responseText);
            if (callback) {
                callback(activity_info_xhr.responseText);
            }
        }
    };
    activity_info_xhr.send();
};

cutil.postDataFormat = function (obj) {
    if (typeof obj !== "object") {
        alert("输入的参数必须是对象");
        return;
    }

    // 支持有FormData的浏览器（Firefox 4+ , Safari 5+, Chrome和Android 3+版的Webkit）
    if (typeof FormData === "function") {
        var data = new FormData();
        for (var attr in obj) {
            data.append(attr, obj[attr]);
        }
        return data;
    } else {
        // 不支持FormData的浏览器的处理
        var arr = [];
        var i = 0;
        for (var attr in obj) {
            arr[i] = encodeURIComponent(attr) + "=" + encodeURIComponent(obj[attr]);
            i++;
        }
        return arr.join("&");
    }
};

cutil.app_bind_agent = function (accountName, invite_code, callback) {
    var info_dict = eval('(' + cc.sys.localStorage.getItem("INFO_JSON") + ')');
    var bind_xhr = cc.loader.getXMLHttpRequest();
    bind_xhr.open("POST", switches.PHP_SERVER_URL + "/api/app_bind_agent", true);
    bind_xhr.onreadystatechange = function () {
        if (bind_xhr.readyState === 4 && bind_xhr.status === 200) {
            // cc.log(bind_xhr.responseText);
            if (callback) {
                callback(bind_xhr.responseText);
            }
        }
    };
    bind_xhr.setRequestHeader("Authorization", "Bearer " + info_dict["token"]);
    bind_xhr.send(cutil.postDataFormat({"invite_code": invite_code}));
};

cutil.time2Date = function (timeTemp) {
    var date = new Date(timeTemp);
    var date_y = date.getFullYear() + '-';
    var date_m = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var date_d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return date_y + date_m + date_d;
};

cutil.isPositiveNumber = function (text) {
    if (text === undefined) return false;
    if (cc.isNumber(text)) {
        return text % 1 === 0;
    }
    return /^[1-9]\d*$/.test(text);
};

// 语音相关 -- start
cutil.start_record = function (filename, fid) {
    if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
        jsb.reflection.callStaticMethod(switches.package_name + "/gvoice/GVoiceJavaBridge", "startRecording", "(Ljava/lang/String;I)V", filename, fid);
    }
    else if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) {
        jsb.reflection.callStaticMethod("GVoiceOcBridge", "startRecording:withFuncID:", filename, fid);
    }
    else {
        cc.log("not native, start_record pass");
    }
};

cutil.stop_record = function () {
    if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
        jsb.reflection.callStaticMethod(switches.package_name + "/gvoice/GVoiceJavaBridge", "stopRecording", "()V");
    }
    else if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) {
        jsb.reflection.callStaticMethod("GVoiceOcBridge", "stopRecording");
    }
    else {
        cc.log("not native, stop_record pass");
    }
};

cutil.download_voice = function (fileID) {
    if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
        jsb.reflection.callStaticMethod(switches.package_name + "/gvoice/GVoiceJavaBridge", "downloadVoice", "(Ljava/lang/String;)V", fileID);
    }
    else if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) {
        jsb.reflection.callStaticMethod("GVoiceOcBridge", "downloadVoiceWithID:", fileID);
    }
    else {
        cc.log("not native, download_voice pass");
    }
};
// 语音相关 -- end

// 定位相关 -- start
cutil.start_location = function () {
    if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
        jsb.reflection.callStaticMethod(switches.package_name + "/AppActivity", "startLocation", "()V");
    }
    else if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) {
        jsb.reflection.callStaticMethod("AMapOCBridge", "startLocation");
    }
    else {
        cc.log("not native, start_location pass");
    }
};
cutil.get_location_geo = function () {
    // G_LOCATION_GEO
    return cc.sys.localStorage.getItem("G_LOCATION_GEO");
};

cutil.get_location_lat = function () {
    // G_LOCATION_LAT
    return cc.sys.localStorage.getItem("G_LOCATION_LAT");
};

cutil.get_location_lng = function () {
    // G_LOCATION_LNG
    return cc.sys.localStorage.getItem("G_LOCATION_LNG");
};
cutil.calc_distance = function (lat1, lng1, lat2, lng2) {
    if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
        return jsb.reflection.callStaticMethod(switches.package_name + "/util/UtilJavaBridge", "calcDistance", "(FFFF)F", lat1, lng1, lat2, lng2);
    }
    else if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) {
        return jsb.reflection.callStaticMethod("UtilOcBridge", "calcDistanceFromLat:Lng:ToLat:Lng:", lat1, lng1, lat2, lng2);
    }
    else {
        cc.log("not native, calc_distance pass");
    }
};
// 定位相关 -- end

cutil.open_url = function (url) {
    if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
        jsb.reflection.callStaticMethod(switches.package_name + "/AppActivity", "openURL", "(Ljava/lang/String;)V", url);
    }
    else if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) {
        jsb.reflection.callStaticMethod("UtilOcBridge", "openURL:", url);
    }
    else {
        cc.log("not native, open_url pass");
    }
};

// 点击进入房间
cutil.registerGameShowEvent = function () {
    if (cc._event_show_func) {
        return;
    }
    cc._event_show_func = function () {
        cutil.callEnterRoom();
    };
    cc.eventManager.addCustomListener(cc.game.EVENT_INTENT, cc._event_show_func);
};

cutil.getOpenUrlIntentData = function (action) {
    if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
        return jsb.reflection.callStaticMethod(switches.package_name + "/AppActivity", "getOpenUrlIntentData", "(Ljava/lang/String;)Ljava/lang/String;", action);
    }
    else if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) {
        return jsb.reflection.callStaticMethod("UtilOcBridge", "getOpenUrlIntentData:", action);
    }
    else {
        cc.log('pass getOpenUrlIntentData');
    }
};

cutil.clearOpenUrlIntentData = function () {
    if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
        return jsb.reflection.callStaticMethod(switches.package_name + "/AppActivity", "clearOpenUrlIntentData", "()V");
    }
    else if (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) {
        return jsb.reflection.callStaticMethod("UtilOcBridge", "clearOpenUrlIntentData");
    }
    else {
        cc.log('pass clearOpenUrlIntentData');
    }
};

cutil.callEnterRoom = function (roomId) {
    if (roomId == undefined) {
        let player = h1global.entityManager.player();
        if (player) {
            roomId = cutil.getOpenUrlIntentData("joinroom");
            if (!roomId || roomId.length === 0) {
                cc.warn('cutil.callEnterRoom error');
                return;
            }
        }
    }
    if (cutil.isPositiveNumber(roomId)) {
        let rid = parseInt(roomId);
        let scene = cc.director.getRunningScene();
        if (scene.className !== 'GameRoomScene') {
            let player = h1global.entityManager.player();
            if (player) {
                cutil.lock_ui();
                player.enterRoom(rid);
            }
        }
    }
};

cutil.clearEnterRoom = function () {
    cutil.clearOpenUrlIntentData();
};
// 复制到粘贴板
cutil.copyToClipBoard = function (content) {
    if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
        return jsb.reflection.callStaticMethod(switchesnin1.package_name + "/AppActivity", "copyToClipBoard", "(Ljava/lang/String;)V", content);
    } else if (cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) {
        return jsb.reflection.callStaticMethod("UtilOcBridge", "copyToClipBoard:", content);
    } else {
        cc.log("not native, copyToClipBoard pass");
    }
};

// 背景音乐及背景音效相关
cutil.initMusicAndEffect = function (path) {
    if (!path){
        return;
    }

    if (cc.audioEngine.isMusicPlaying()) {
        cc.audioEngine.stopMusic();
    }
    if(!cc.audioEngine.isMusicPlaying()){
        cc.audioEngine.playMusic(path, true);
    }

    var isPlayMusic = cc.sys.localStorage.getItem("MUSIC_IS_PLAY") || 1;
    var isPlayEffect = cc.sys.localStorage.getItem("EFFECT_IS_PLAY") || 1;
    var musicVolume = cc.sys.localStorage.getItem("MUSIC_VOLUME") || 100;
    var effectVolume = cc.sys.localStorage.getItem("EFFECT_VOLUME") || 100;

    if (isPlayMusic){
        cc.audioEngine.setMusicVolume(musicVolume * 0.01);
    }else {
        cc.audioEngine.setMusicVolume(0);
    }

    if (isPlayEffect){
        cc.audioEngine.setEffectsVolume(effectVolume * 0.01);
    }else {
        cc.audioEngine.setEffectsVolume(0);
    }
};

// 竞赛场配置信息相关
cutil.getSportInfoListcache= {};
cutil.getSportInfoList = function () {
    var self = this;
    if (Object.keys(cutil.getSportInfoListcache).length !== 0) {
        return cutil.getSportInfoListcache;
    }
    cc.loader.loadJson("res/table/table_sports.json", function (err, results) {
        if (err) {
            cc.error("Failed to load res/table/table_sports.json");
            return;
        }
        var recordListDict = {};
        var recordList = []
        for (var i in results) {
            if (results[i]["type"] === 1){
                recordList.push(results[i]);
                recordListDict["1"] = recordList;
            }else if (results[i]["type"] === 2){
                recordListDict["2"] = results[i];
            }
        }
        cutil.getSportInfoListcache = recordListDict;
        return recordListDict;
    });
};