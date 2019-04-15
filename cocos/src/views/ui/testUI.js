// var UIBase = require("src/views/ui/UIBase.js")
// cc.loader.loadJs("src/views/ui/UIBase.js")
"use strict"
var testUI = UIBase.extend({
    ctor: function () {
        this._super();
        this.resourceFilename = "res/ui/testUI.json";

    },
    initUI: function () {
        this.panel = this.rootUINode.getChildByName("panel");
        var self = this;
        var player = h1global.entityManager.player();
        player.reqGroupInfoList();
        //
        function func(x) {
            switch(x){
                case 0:
                    player.reqCreateGroup("王者");
                    cc.log("reqCreateGroup测试通过");
                    break;
                case 1:
                    player.modifyGroupBillboard(player.groupList[0]["group_id"],"公告1212");
                    cc.log("modifyGroupBillboard测试通过");
                    break;
                case 2:
                    player.reqInviteJoinGroup(player.groupList[0]["group_id"],2134703);
                    cc.log("reqInviteJoinGroup测试通过");
                    break;
                case 3:
                    player.reqDelMember(player.groupList[0]["group_id"],2134703);
                    cc.log("reqDelMember测试通过");
                    break;
                case 4:
                    player.reqMarkMember(player.groupList[0]["group_id"],2134703,"李");
                    cc.log("reqMarkMember测试通过");
                    break;
                case 5:
                    var room_op ={
                        game_mode : 0,
                        game_round : 10,
                        player_num : 3,
                        game_function : 0,
                        game_start : 0,
                        game_hei3 : 0,
                        game_deal : 0,
                        game_force : 0,
                        game_cardnum : 16,
                        game_plays : [0,0,0,0],
                        game_end : [0,0,0,0],
                        anticheating : 0,
                        is_agent : 0,
                    };
                    player.reqCreateTeam(player.groupList[0]["group_id"],room_op,"3人15张");
                    cc.log("reqCreateTeam测试通过");
                    break;
                case 6:
                    player.reqDestroyTeam(player.groupList[0]["group_id"],player.groupList[0]["team_list"][0]["team_uuid"]);
                    cc.log("reqDestroyTeam测试通过");
                    break;
                case 7:
                    player.reqJoinTeam(1134703,player.groupList[0]["team_list"][0]["team_uuid"],2134704);
                    cc.log("reqJoinTeam测试通过");
                    break;
                case 8:
                    player.reqDelTeamMem(player.groupList[0]["group_id"],player.groupList[0]["team_list"][0]["team_uuid"],2134703);
                    cc.log("reqDelTeamMem测试通过");
                    break;
                case 9:
                    player.reqGenTeamRoom(1134702,player.groupList[0]["team_list"][0]["team_uuid"],2);
                    cc.log("reqGenTeamRoom测试通过");
                    break;
                case 10:
                    player.reqChangeTeamState(player.groupList[0]["group_id"],player.groupList[0]["team_list"][0]["team_uuid"],0);
                    cc.log("reqChangeTeamState测试通过");
                    break;
                case 11:
                    player.reqTeamRoomList(player.groupList[0]["group_id"],player.groupList[0]["team_list"][0]["team_uuid"]);
                    cc.log("reqTeamRoomList测试通过");
                    break;
                case 12:
                    player.reqGroupRoomList(player.groupList[0]["group_id"]);
                    cc.log("reqGroupRoomList测试通过");
                    break;
                case 13:
                    player.reqDismissGroupRoom(player.groupList[0]["group_id"],999999);
                    cc.log("reqDismissGroupRoom");
                    break;
                case 14:
                    player.reqJoinGroup(1134702);
                    cc.log("reqJoinGroup测试通过");
                    break;
                case 15:
                    player.reqExitGroup(1134702);
                    cc.log("reqExitGroup测试通过");
                    break;
                case 16:
                    player.reqDestroyGroup(player.groupList[0]["group_id"]);
                    cc.log("reqDestroyGroup测试通过");
                    break;
                case 17:

                    break;
                case 18:

                    break;
                case 19:

                    break;
                case 20:

                    break;
                case 21:

                    break;
                 default:
                    break;
            }
        }
        for (let i = 0; i <22; i++) {
            this.panel.getChildByName("Button_"+(i+1).toString()).addTouchEventListener(function (sender, eventType) {
                if (eventType == ccui.Widget.TOUCH_ENDED) {
                    //player.reqGroupInfoList();
                    func(i)
                }
            });
        }
    },
});