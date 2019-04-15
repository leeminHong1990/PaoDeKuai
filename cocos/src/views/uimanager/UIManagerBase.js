var UIManagerBase = cc.Layer.extend({
	ctor:function(){
		this._super();
		
		this.destroy_ui_handler = null;
		this.ui_list = [];
		this.ui_show_stack = [];
		if (this.onCreate){
			this.onCreate();
		}
		// var size = cc.director.getVisibleSize();
		// for (var i = 0; i < this.ui_list.length; i++){
		// 	var v = this.ui_list[i];
		// 	this.addChild(v);
		// 	v.setVisible(false);
		// }
	},
	add_ui:function(ui_name, res_list, class_name, callback){
		// 这里的res_list主要用于加载UI的js文件
		if(this[ui_name]){
			return;
		} else {
			var self = this;
			cc.loader.load(res_list, 
				function(){
                    self[ui_name] = eval("new " + class_name + "()");
                    self.ui_list.push(self[ui_name]);
                    self.addChild(self[ui_name]);
                    self[ui_name].setVisible(false);
                    if(callback){
                        callback();
                    }
				});
		}
	},
	push_ui:function(show_ui){
		var index = null;
		for (var i = 0; i < this.ui_show_stack.length; i++){
			var v = this.ui_show_stack[i];
			if (v === show_ui){
				index = i;
				break;
			}
		}
		if (index !== null){
			if (index != this.ui_show_stack.length - 1){
				// for (var i = index; i < this.ui_show_stack.length - 1){
				// 	this.ui_show_stack[i] = this.ui_show_stack[i + 1];
				// }
				// this.ui_show_stack[this.ui_show_stack.length - 1] = show_ui;
				this.ui_show_stack.splice(index, 1);
				this.ui_show_stack.push(show_ui);
				show_ui.retain();
				this.removeChild(show_ui, false);
				this.addChild(show_ui);
				show_ui.release();
			}
		} else {
			this.ui_show_stack.push(show_ui);
			show_ui.retain();
			this.removeChild(show_ui, false);
			this.addChild(show_ui);
			show_ui.release();
		}
	},
	pop_ui:function(show_ui){
		var index = null;
		for (var i = this.ui_show_stack.length - 1; i >= 0 ; i--){
			var v = this.ui_show_stack[i];
			if (v === show_ui){
				index = i;
				break;
			}
		}
		if (index !== null){
			// if (index != this.ui_show_stack.length - 1){
			// 	for (var i = index; i < this.ui_show_stack.length - 2; i)

			// }
			this.ui_show_stack.splice(index, 1);
		}
	},
	hide_all_ui:function(to_ui){
		for (var i = this.ui_show_stack.length - 1; i >= 0; i--){
			var v = this.ui_show_stack[i];
			if (to_ui === v){
				break;
			}
			v.closeUI();
			this.ui_show_stack.pop();
		}
		var self = this;
		var destroy_ui = function(){
			self.destroy_ui_handler = null;
			// cc.spriteFrameCache.removeUnusedSpriteFrames();
			// cc.animationCache.removeUnusedTextures();
		}
		this.destroy_ui_handler = this.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(destroy_ui)));
	},
	all_onHide:function(){
		for (var i = this.ui_show_stack.length - 1; i >= 0; i--){
			if (this.ui_show_stack[i].is_show){
				this.ui_show_stack[i].onHide();
			}
		}
	},
	// preload_all_ui:function(){
	// 	for (var i = 0; i < this.ui_list.length; i++){
	// 		this.ui_list[i].loadRes();
	// 	}
	// },
	// unload_all_ui:function(){
	// 	for (var i = 0; i < this.ui_list.length; i++){
	// 		this.ui_list[i].unloadRes();
	// 	}
	// },
	destroy_ui:function(ui_layer){
		if (this.destroy_ui_handler){
			this.stopAction(this.destroy_ui_handler);
			this.destroy_ui_handler = null;
		}
	}
});