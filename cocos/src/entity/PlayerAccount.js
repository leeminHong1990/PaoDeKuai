"use strict";

KBEngine.PlayerAccount = KBEngine.Account.extend(
    {

        __init__: function () {
            this._super();
            KBEngine.Event.fire("onLoginSuccessfully", KBEngine.app.entity_uuid, this.id, this);

            this.avatars = {};
            KBEngine.DEBUG_MSG("Create Player Account " + this.id);
            this.name = "Guest";
            this.password = "Default"
        },

        onEnterWorld: function () {
            this._super();
            KBEngine.DEBUG_MSG("Player Account onEnterWorld " + this.id)
        },

        onLeaveWorld: function () {
            this._super();
            KBEngine.DEBUG_MSG("Player Account onLeaveWorld " + this.id)
        },

        login: function () {
            KBEngine.DEBUG_MSG("Player Account login " + this.id)

        },

        fastlogin: function () {
            KBEngine.DEBUG_MSG("Player Account fastlogin " + this.id)
        },

        // @RPC
        operationFail: function (cid, val) {
            KBEngine.DEBUG_MSG("operationFail " + cid + "," + val);
            // var title = ""
            var content = "";
            if (cid === const_val.LOGIN_OPERATION_FAIL) {
                // title = " 登录失败"
                if (val === 2) {
                    content = "你的账号因为不当操作，已被封，请联系管理员"
                }
                else if (val === 1) {
                    content = "不好意思，服务器现在爆满，请稍后再试^_^!"
                }
            }
            if (cid === const_val.LOGIN_OPERATION) {
                if (val === 1) {
                    content = "该名称已有人使用~"
                }
                cutil.unlock_ui();
            }
            // 报名成功
            h1global.globalUIMgr.toast_ui.show_toast(content)
        }
    });





