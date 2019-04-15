"use strict";
/*-----------------------------------------------------------------------------------------
												entity
-----------------------------------------------------------------------------------------*/
KBEngine.Avatar = KBEngine.Entity.extend(
{
	__init__ : function()
	{
		this._super();
    	KBEngine.DEBUG_MSG("Create Avatar " + this.id)
  	},
  		
	onEnterWorld : function()
	{		
		this._super();		
		KBEngine.DEBUG_MSG(this.className + '::onEnterWorld: ' + this.id); 
	}
});


