"use strict";

KBEngine.Account = KBEngine.Entity.extend(
    {
        __init__: function () {
            this._super();
            KBEngine.DEBUG_MSG("Create Account " + this.id)
        },

        logout: function () {
            cc.log("logout");
            this.baseCall("logout");
        },

        // @RPC
        closeClient: function () {
            // KBEngine.DEBUG_MSG("closeClient");
            cc.log("closeClient")
            h1global.globalUIMgr.hide_all_ui()
            //h1global.skip_uiTable['enterLoginScene']()
            cc.director.runScene(new LoginScene());
        },

        // @RPC
        operationFail: function (cid, val) {
        }
    });
