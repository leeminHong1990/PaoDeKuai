"use strict";

var SoundManager = function(){}


SoundManager.bMusicMute = false
SoundManager.bEffectMute = false
SoundManager.musicIDs = {}

SoundManager.play = function(fileName, finishCallback, loopEnable, volume) {
	var audioID = cc.AudioEngine.play2d(fileName, loopEnable, volume)
	if (audioID !== cc.AUDIO_INVAILD_ID && undefined !== finishCallback)
	{
		cc.AudioEngine.setFinishCallback(audioID, finishCallback)
	}
	
	return audioID
};

SoundManager.playMusic = function(fileName, finishCallback, loopEnable, volume) {
	loopEnable = loopEnable || false
	volume = volume || 1.0
	if (true === this.bMusicMute)
		volume = 0.0

	KBEngine.DEBUG_MSG("播放音乐 1:" + fileName)
	if (undefined === this.musicIDs[fileName])
	{
		KBEngine.DEBUG_MSG("播放音乐 2:" + fileName)
		this.musicIDs[fileName] = this.play(fileName, finishCallback, loopEnable, volume)
	}
};

SoundManager.pauseMusic = function(fileName) {
	var audioID = this.musicIDs[fileName]
	if (undefined !== audioID && audioID !== cc.AUDIO_INVAILD_ID)
	{
		KBEngine.DEBUG_MSG("暂停音乐:" + fileName)
		cc.AudioEngine.pause(audioID)
		audioID = cc.AUDIO_INVAILD_ID
	}
};

SoundManager.resumeMusic = function(fileName) {
	var audioID = this.musicIDs[fileName]
	if (undefined !== audioID && audioID !== cc.AUDIO_INVAILD_ID)
	{
		KBEngine.DEBUG_MSG("恢复音乐:", fileName)
		cc.AudioEngine.resume(audioID)
		audioID = cc.AUDIO_INVAILD_ID
	}
};


SoundManager.stopMusic = function(fileName) {
	var audioID = this.musicIDs[fileName]
	if (undefined !== audioID && audioID !== cc.AUDIO_INVAILD_ID)
	{
		cc.AudioEngine.stop(audioID)
		audioID = cc.AUDIO_INVAILD_ID
		this.musicIDs[fileName] = undefined
	}
};


SoundManager.playEffect = function(fileName, finishCallback, loopEnable, volume) {
	if (false === this.bEffectMute)
	{
		loopEnable = loopEnable || false
		volume = volume || 1.0
		KBEngine.DEBUG_MSG("播放音效:" + fileName)
		this.play(fileName, finishCallback, loopEnable, volume)
	}
};

SoundManager.setVolume = function(audioID, volume) {
	if (audioID !== cc.AUDIO_INVAILD_ID)
	{
        cc.AudioEngine.setVolume(audioID, volume)
	}
};

// 如果音乐设置为false，那么后面的音乐还是会播放，只不过是静音
SoundManager.setMusicMute = function(bMute) {
	var volume = 0.0
	if (true === bMute)
	{
		this.bMusicMute = true
		KBEngine.DEBUG_MSG("设置音乐静音" + this.bMusicMute)
		volume = 0.0
	}
	else
	{
		this.bMusicMute = false
		KBEngine.DEBUG_MSG("取消音乐静音" + this.bMusicMute)
		volume = 1.0
	}
	for (var fileName in this.musicIDs)
	{
		var audioID = this.musicIDs[fileName]
		if ((undefined !== audioID) && (audioID !== cc.AUDIO_INVAILD_ID)){
			this.setVolume(audioID, volume)
		}
	}
};

// 如果音效设置为false，那么后面的音效就不播放了
SoundManager.setEffectMute = function(bMute) {
	if (true === bMute){
		this.bEffectMute = true
		KBEngine.DEBUG_MSG("设置音效静音" + this.bEffectMute)
	}
	else
	{
		this.bEffectMute = false
		KBEngine.DEBUG_MSG("取消音效静音" + this.bEffectMute)
	}
};
