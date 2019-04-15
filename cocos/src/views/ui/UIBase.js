var UIBase = cc.Layer.extend({
	ctor:function() {
		this._super();
		this.rootUINode = null;
		this.needReload = true;
		this.is_show = false;
		this.destroy_handler = null;
		this.resourceFilename = "";
		this.hasLoadRes = false;
		this.hasPreload = false;
		this.isPreloading = false;
		this.preloadCallback = undefined;
	},
	initUI:function() {

	},
	onShow:function(){

	},
	preload:function(other_res_list, callback){
		if(this.resourceFilename === ""){
			return;
		}
		this.isPreloading = true;
		other_res_list = other_res_list || [];
		if(callback){
			this.preloadCallback = callback;
		}
		var self = this;
		other_res_list.push(self.resourceFilename);

		cc.loader.load(other_res_list, function(){
			self.hasPreload = true;
			self.isPreloading = false;
			if(self.preloadCallback){
				self.preloadCallback();
				self.preloadCallback = undefined;
			}
		});
	},
	loadRes:function(){
		if(!this.hasPreload){
			var self = this;
			if(this.preloadCallback){
				var callback = this.preloadCallback;
				this.preloadCallback = function(){callback(); self.loadRes();};
			} else {
				this.preloadCallback = function(){self.loadRes();};
			}
			if(!this.isPreloading){
				this.preload();
			}
			// if(!this.hasPreload){
			// 	return;
			// }
			return;
		}
		if(!this.rootUINode){
			if (this.resourceFilename === ""){ return;}
			var rootUINode = ccs.load(this.resourceFilename).node;
			// var rootUINode = ccs.CSLoader.createNode(this.resourceFilename);
			this.rootUINode = rootUINode;
			this.addChild(rootUINode);
			var size = cc.director.getVisibleSize();
			this.rootUINode.setContentSize(size);
			ccui.helper.doLayout(this.rootUINode);
			this.hasLoadRes = true;
		}
	},
	unloadRes:function(){
		if(this.rootUINode && this.is_show === false){
			this.rootUINode.removeFromParent();
			this.rootUINode = null;
			this.hasLoadRes = false;
		}
	},
	// show:function(needReshow){
	show:function(showCallback){
		if(!this.hasPreload){
			cutil.lock_ui();
			var self = this;
			if(this.preloadCallback){
				var callback = this.preloadCallback;
				this.preloadCallback = function(){callback(); self.show(); if(showCallback){showCallback();} cutil.unlock_ui();};
			} else {
				this.preloadCallback = function(){self.show(); if(showCallback){showCallback();} cutil.unlock_ui();};
			}
			if(!this.isPreloading){
				this.preload();
			}
			// if(!this.hasPreload){
			// 	return;
			// }
			return;
		}
		// needReshow = needReshow || false;

		this.getParent().push_ui(this);
		this.setVisible(true);
		var is_show = this.is_show;
		this.is_show = true;
		if(this.destroy_handler){
			this.stopAction(this.destroy_handler);
			this.destroy_handler = null;
		}
		if(this.hasLoadRes){
			this.initUI();
			this.hasLoadRes = false;
		// } else if(!this.rootUINode || needReshow == true){
		} else if(!this.rootUINode){
			if (this.resourceFilename === ""){ return;}
			var rootUINode = ccs.load(this.resourceFilename).node;
			// var rootUINode = ccs.CSLoader.createNode(this.resourceFilename);
			this.rootUINode = rootUINode;
			this.addChild(rootUINode);
			var size = cc.director.getVisibleSize();
			this.rootUINode.setContentSize(size);
			ccui.helper.doLayout(this.rootUINode);
			this.initUI();
		}
		if (is_show !== true){
			this.onShow();
		}
		if(showCallback){
			showCallback();
		}
	},
	onHide:function(){

	},
	hide:function(){
		this.preloadCallback = undefined;
		if (this.is_show === false){
			return;
		}
		this.onHide();
		this.getParent().pop_ui(this);
		this.setVisible(false);
		this.is_show = false;
		cutil.unlock_ui();
		if (this.needReload === true){
			if(!this.hasLoadRes){
				this.rootUINode.removeFromParent();
				this.rootUINode = null;
			}
			// var self = this;
			// var destroy_ui = function(){
			// 	self.destroy_handler = null;
			// 	if (self.is_show == false){
			// 		// cc.spriteFrameCache.removeUnusedSpriteFrames();
			// 		// cc.animationCache.removeUnusedTextures();
			// 	}
			// }
			if (this.destroy_handler){
				this.stopAction(this.destroy_handler);
				this.destroy_handler = null;
			}
			// this.destroy_handler = this.runAction(cc.sequence(cc.delayTime(0), cc.callFunc(destroy_ui)));
		}
	},
	closeUI:function(){
		this.onHide();
		this.setVisible(false);
		this.is_show = false;
		if (this.needReload === true){
			this.rootUINode.removeFromParent();
			this.rootUINode = null;
			if (this.destroy_handler){
				this.stopAction(this.destroy_handler);
				this.destroy_handler = null;
			}
		}
	},
	destroy:function(){
		if (this.destroy_handler){
			this.stopAction(this.destroy_handler);
			this.destroy_handler = null;
		}
	},
	getNode:function(nodeName){
		var node = ccui.helper.seekWidgetByName(this.rootUINode, nodeName);
		if (node === null){
			return this.rootUINode;
		}
		return node;
	}
});