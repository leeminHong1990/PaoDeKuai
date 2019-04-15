h1global.globalUIMgr.hide_all_ui();
cc.sys.localStorage.removeItem("INFO_JSON");
if((cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) || (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative)){
	h1global.runScene(new LoginScene());
} else {
	window.location.href = switches.h5entrylink;
}