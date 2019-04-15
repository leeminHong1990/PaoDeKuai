"use strict";
var switches = function () {
};

if (targetPlatform === cc.PLATFORM_OS_ANDROID) {

}
else if ((targetPlatform === cc.PLATFORM_OS_IPHONE) || (targetPlatform === cc.PLATFORM_OS_IPAD)) {

}
else {

}

switches.TEST_OPTION = true;

switches.share_android_url = "http://fir.im/r731";
switches.share_ios_url = "http://fir.im/r731";
switches.h5entrylink = "http://www.zhizunhongzhong.com/h1hz";

switches.PHP_SERVER_URL = "http://10.0.0.4:9981/api/user_info";
switches.TEST_PHP_SERVER_URL = "http://test2.game918918.com";

switches.package_name = "com/a/b";

switches.kbeServerIP = "10.0.0.24";
switches.kbeServerLoginPort = 20013;

switches.httpServerIP = "10.0.0.24";
switches.audioUploadSite = "http://" + switches.httpServerIP + ":9981/upyun/upload_audio";
switches.versionUrl = 'http://10.0.0.6:10101/version';

switches.gzh_name = "跑得快";