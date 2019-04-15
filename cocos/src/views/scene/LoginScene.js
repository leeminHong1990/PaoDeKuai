var LoginScene = cc.Scene.extend({
    className: "LoginScene",
    onEnter: function () {
        this._super();
        this.loadUIManager();

        cutil.initMusicAndEffect("res/sound/music/sound_bgm.mp3");
        // TEST:
        if (switches.TEST_OPTION) {
            // cc.sys.localStorage.setItem("INFO_JSON", '{"unionid":"obEeHt0SUdbYxOUjhO7Hu93YVhIg","nickname":"Zachary","sex":1,"language":"zh_CN","city":"杭州","province":"浙江","country":"中国","headimgurl":"http:\/\/wx.qlogo.cn\/mmopen\/Q3auHgzwzM6zHFzbk0YyibNTMxxibJ2yhg2eq0sIBOgFHCKvSBsibkm2pjYVcwgjwsJlI4yrJvWzXBYHRohiced8tQ\/0","privilege":[]}');
            // cc.sys.localStorage.setItem("INFO_JSON", '{"id":2,"nickname":"\u6211\u7231\u67d0\u67d0\u67d0","email":"wx_orBKsv4ECRtCfJYUAFMrC9ZPxYmk","card":4,"diamond":1000,"gender":0,"headimgurl":"http:\/\/wx.qlogo.cn\/mmopen\/HXgZxz4agUV46LqPDHGREsBLTaia0TR67GxGiaQfbNnsO1f8ictJK9JOGXmRzuibmicM24FZREf1UCByntutlGowFWicdRyWZtv2gf\/0","province":"Zhejiang","city":"Hangzhou","inviter":null,"remark":null,"created_at":"2017-06-28 23:32:31","updated_at":"2017-06-28 23:32:31","sex":0,"user_id":8604022,"unionid":"orBKsv4ECRtCfJYUAFMrC9ZPxYmk","access_token":"kp-QOoa1StB7O_VEpYDIxs8y362170MXe5j0rTvZ7b21e72nS9eBIAECU5ckF1-aM5l9tJOm_ok9C3WoO8oXTYwihD-vtrvuVlk4W-DuHX8","refresh_token":"Ue2YPRHdkqWpN_eCPG7-0w2tze8zMNneOgbCLSm2WHPCeL1fOoJJUSpqaoyYtX1XOEU_zia3HhJOp5VAhDyNPmUSWWgbnflIayhxeoRip5E","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjI3Njc4Mjk5NGRiYWRmYThkYmNjMmZmYzYxNDg3YjhjYjI5MDU4NzAwMGE2ZGIwMTFhNWMzZDdlM2I2ZDMyZGQ5MmZiZjc4OGY5NjgyN2I1In0.eyJhdWQiOiIyIiwianRpIjoiMjc2NzgyOTk0ZGJhZGZhOGRiY2MyZmZjNjE0ODdiOGNiMjkwNTg3MDAwYTZkYjAxMWE1YzNkN2UzYjZkMzJkZDkyZmJmNzg4Zjk2ODI3YjUiLCJpYXQiOjE0OTg3MDQ1MTgsIm5iZiI6MTQ5ODcwNDUxOCwiZXhwIjoxNTMwMjQwNTE4LCJzdWIiOiIyIiwic2NvcGVzIjpbXX0.lkagAL9MjuoYgbzBeQcMW9INngfzvdTMypU_OlgYteBBQcZn5wzEh29a6KygrHLfmiTRDW0-ZDhb6S4BRbQhW6prWFMJVIvf1SiwvVNV374aRd4fcNBQ9jRvFb4njIIkfeM24ltx91vox4kORSxQn_ML6XaWFI4pVarTGDKHDGxaCYvMdCufF8rsw8XNYaeouRljW7GNBPtHLyANvihG9XwEgY_MbSROu38R7_27E77ub50c3oEJv6dWml8XTHpl1XPpjkFekw0L3MAkfQFo0xNvyiuQcnLB97SDsLwpiEl4hv8EZ8Us6-jNStfYZCX4A1hFcI_ZEnjpT9bojYyNugP96fdsx_njxzDSHbPDGraGEAv3hXGyZkkGNGhcV072oqemEDX1GVSUFUKbv6iryqKRUMV3j1AxB4D92Ig5tforQJrPg5lpM8gDVKo5nOSyeNByYXw0OwU0jc-BVPfEgVq8PLZEYCudjAyiIaSmchI1f-3-nYijn_E1XGvXCwJeYUZe63eOKE9nYXkYAXivTY58CJG9p5N4X-8N-DS1VI7uqvwGB7nVp7Z33M3lFMtnAoRnfujZi8XxYzS75PwBehvNAXFElkKxSdKX19me1iLlPYNGg2KjFh_oRvsAvQQXSfjTHR8_0xDBQNiSeh34wfOIsldE2WMhEIb-OcrLy6E"}');
            cc.sys.localStorage.setItem("INFO_JSON", '{"id":1,"nickname":"\u590f\u65e5\u6674\u6717","email":"wx_orBKsv3zvVD7mMFLt9KGC-kXY-2c","card":0,"diamond":145,"gender":0,"headimgurl":"http:\/\/wx.qlogo.cn\/mmopen\/3YwSeX8nDYxEYwrx2qGCpPSCD9Eosiaye2Bbpsa1uDmXB8gXYqhJXrAkUiaVS0rA8eia5yvPxwFwuFuRp6VBlyrzib6Af9Nia2aicib\/0","province":"Beijing","city":"Haidian","inviter":null,"remark":null,"created_at":"2017-06-20 09:44:33","updated_at":"2017-06-28 21:51:20","sex":0,"user_id":1134702,"unionid":"orBKsv3zvVD7mMFLt9KGC-kXY-2c","access_token":"qn8yLl0471p4eJ7L6MThArpU0BCLzJoYgsNS7W-y0IfP9XVQVPYNYSlXFzfln8NK9tEcTx7mfi7i2o7w54ntBkRo4rxfTm9tXKnKsYH351A","refresh_token":"JuBBdHN3I3a192_ksd3JXRjT6sngYwa2pYszvsY8KjcKRUD_g8UHIoKT23N2aEq9HLdl8ABg8NjNkJpw5Prjq3JwiO20N8lhaVckMr8mtx0","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjVjMTY1MTNjYzU5ZGY1NmY4N2Y4NmJhYjU4YzdlZjdlMTA5ZjhlYzZjMWZmODU0ODU1NWU2N2Y3M2ViYzlhODIzN2I2NmFkMDhiNGZkNTU3In0.eyJhdWQiOiIyIiwianRpIjoiNWMxNjUxM2NjNTlkZjU2Zjg3Zjg2YmFiNThjN2VmN2UxMDlmOGVjNmMxZmY4NTQ4NTU1ZTY3ZjczZWJjOWE4MjM3YjY2YWQwOGI0ZmQ1NTciLCJpYXQiOjE0OTg3MDUwOTcsIm5iZiI6MTQ5ODcwNTA5NywiZXhwIjoxNTMwMjQxMDk3LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.lVzF33KJUv48s7pojzdv4U0L5OLjkrU_4vFEwmiQEa9v-QHPRrSwLg-2vbFKtWJjLc7y_CXh999_-RQjl5PV2IR2-OQpGyT1hWXjf4K_pR14QdZe8gYR5eqV9x1HyfXHYeFmj_LqNy1TYP3XPH4dyEHFpO7PC-XtwNBs3dzuXIecb9pHxiWarNVkxk1TAWp6eJBvkcYye9cB_S8pBO2r_ma2BLJ4EW4Np4DV3GIkVd1PB-TLa2jb-iCHvwTMCoD6BnR1wtltNZvGR2QT-q1z1bc8qiE9Ot1NKlzAn0H5u9YvTGoUSC-Z13eK_9Wm2QWZngC4wKC85rBc166MCrgJxHFTcplZSu9kVRzq6DXhHCYFxZZh4jB92JAu7FKMhuGTFaTF64rRjzDgjJT77_Gfbp6ZjjH1oJ2oGnsg8uljrq-64ENh-oLJ5hHrWa77LWuTTYaFOYi73pPfgntLzyd9BfzP-7ai6RWVPLW9vtzDZIfuFzGn9kTyI1ElF2zJFmRvxTDXrphLF9KZtk4x9chLYr0DJ0Ei_GI8cNmEHM4ZCLQlIhi5lKIC3n7JFvxp-PDiiDXvRmWcsOnrZM38LkVzvSESsJhts0JMNDOZZB4KnFrBrU-ZLx_LptlqrJi2aDUTgtEveA08--2oyxu290zSdyJgFup_TdPKQazM-uFUSsI"}');
            // username = 'wx_orBKsv3zvVD7mMFLt9KGC-kXY-2c';
            // password = 'orBKsv3zvVD7mMFLt9KGC-kXY-2c';
        }

        var weixin_login_btn = h1global.curUIMgr.login_ui.rootUINode.getChildByName("weixin_login_btn");
        if (!((cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) || (cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative) || switches.TEST_OPTION)) {
            wx.onMenuShareAppMessage({
                title: '跑得快', // 分享标题
                desc: '访问公众号【' + switches.gzh_name + '】更多好玩的游戏等着你~', // 分享描述
                link: switches.h5entrylink, // 分享链接
                imgUrl: '', // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareTimeline({
                title: '跑得快', // 分享标题
                desc: '访问公众号【' + switches.gzh_name + '】更多好玩的游戏等着你~', // 分享描述
                link: switches.h5entrylink, // 分享链接
                imgUrl: '', // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

            var src = window.location.href;
            // h1global.globalUIMgr.info_ui.show_by_info(src);
            if (src.indexOf("?code=") >= 0) {
                weixin_login_btn.setVisible(false);
                var args = src.substr(src.indexOf("?code="));
                var code = args.substr(6, args.indexOf("&state") - 6);
                var xhr = cc.loader.getXMLHttpRequest();
                xhr.open("GET", switches.PHP_SERVER_URL + "/wechat/h5_access_token?code=" + code, true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        var info_json = xhr.responseText;
                        cc.sys.localStorage.setItem("INFO_JSON", info_json);
                        var info_dict = eval('(' + info_json + ')');
                        KBEngine.app.login("wx_" + info_dict["unionid"], info_dict["password"], JSON.stringify({"userId":info_dict["user_id"], "sex":info_dict["sex"]}));
                    }
                };
                xhr.send();
            } else {
                weixin_login_btn.setVisible(true);
            }
        } else {
            weixin_login_btn.setVisible(false);
            var version_xhr = cc.loader.getXMLHttpRequest();
            version_xhr.open("GET", switches.versionUrl, true);
            version_xhr.onreadystatechange = function () {
                if (version_xhr.readyState === 4 && version_xhr.status === 200) {
                    var server_version = version_xhr.responseText;
                    cc.log(server_version);
                    if (server_version === app_version) {
                        h1global.curUIMgr.login_ui.rootUINode.getChildByName("weixin_login_btn").setVisible(true);
                    } else {
                        h1global.globalUIMgr.info_ui.show_by_info("请下载最新版本！", cc.size(300, 200));
                    }
                }
            };
            version_xhr.send();
        }
    },

    loadUIManager: function () {
        var curUIManager = new LoginSceneUIManager();
        curUIManager.setAnchorPoint(0, 0);
        curUIManager.setPosition(0, 0);
        this.addChild(curUIManager, const_val.curUIMgrZOrder);

        h1global.curUIMgr = curUIManager;
        // curUIManager.playerselect_ui.show();
        // curUIManager.playerselect_ui.loadRes();
        curUIManager.login_ui.hasPreload = true;
        curUIManager.login_ui.show();

        if (onhookMgr) {
            onhookMgr = undefined;
        }
        onhookMgr = new OnHookManager();
        onhookMgr.init(this);
        this.scheduleUpdateWithPriority(0);
    },

    update: function (delta) {
        onhookMgr.update(delta);
    }
});