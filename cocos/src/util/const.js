"use strict";

var const_val = function () {
};

const_val.Action_Enter = 0; // 进入游戏

const_val.PDK_DEFALUT = -1;
// 为了便于UI管理，globalUIMgr的ZOrder一定要大于curUIMgrZOrder
const_val.globalUIMgrZOrder = 90000;
const_val.curUIMgrZOrder = 10000;

const_val.MAX_LAYER_NUM = 99999999;


const_val.MISSION_OPERATION = 1;
const_val.GM_OPERATION = 4;
const_val.SUMMON_OPERATION = 6;

// 排行榜更新时间
const_val.RANK_DELTA_TIME = 15 * 60; // 15min
const_val.QUERY_PALYER_INFO_TIME = 15 * 60; // 15min

// const_val strings
const_val.sDefaultPortraitPath = "res/ui/GUI/image.png";
const_val.sClientDatas = "kbengine_js_demo";
const_val.sHasCreateQuickLoginAccount = "ccud_bHasCreateQuickLoginAccount";
const_val.sUseUploadedPortraitPrefix = "ccud_bUseUploadedPortrait_";
const_val.sAvatarPrefix = "res/avatars/avatar_";


const_val.nAvatarNum = 15;

const_val.GameDelayTime = 10.0;

const_val.TrusteeShipTurnNum = 2;

const_val.OP_PASS = 0; // 过
const_val.OP_DISCARD = 1; // 出牌

const_val.HEI = [28, 36, 44, 52, 60, 68, 76, 84, 92, 100, 108, 116, 132]; // 3-13 14 16
const_val.HONG = [27, 35, 43, 51, 59, 67, 75, 83, 91, 99, 107, 115, 131]; // 3-13 14 16
const_val.MEI = [26, 34, 42, 50, 58, 66, 74, 82, 90, 98, 106, 114, 130]; // 3-13 14 16
const_val.FANG = [25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 113, 129]; // 3-13 14 16

const_val.INSTEAD = [24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 128]; // 癞子 3 - 2
const_val.JOKER = [144, 152];

const_val.HEI_3 = 28; //黑3

const_val.CARD2 = 16;
const_val.CIRCLE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16];

const_val.MESSAGE_LIST = [
    "醒醒，工头喊你搬砖了",
    "隔壁老王孩子都生出来了，还舍不得出牌?",
    "惊不惊喜，意不意外",
    "吃土",
    "一脸懵逼",
    "麻麻，不玩儿了，我要回家",
    "吃瓜群众已搬好小板凳",
    "投降输一半行不行",
    "各位好汉，咱们有缘江湖见",
    "(打呼声)"
];

const_val.SIGNIN_MAX = 10;

const_val.GAME_RECORD_MAX = 10;

const_val.DISMISS_ROOM_WAIT_TIME = 60; // 申请解散房间后等待的时间, 单位为秒
const_val.PLAYER_WAIT_TIME = 15; // 玩家出牌等待的时间, 单位为秒

const_val.TYPE_NO_CARD         = 0;
const_val.TYPE_INVALID         = 1;   //  不符合规定的牌
const_val.TYPE_SINGLE          = 2;   //  单张
const_val.TYPE_PAIR            = 3;   //  一对
const_val.TYPE_SERIAL_PAIR     = 4;   //  两队
const_val.TYPE_TRIPLE          = 5;   //  三张
const_val.TYPE_SERIAL_TRIPLE   = 6;   //  飞机不带
const_val.TYPE_SERIAL_SINGLE   = 7;   //  顺子
const_val.TYPE_SERIAL_BOMB     = 11;  //  连炸
const_val.TYPE_TRIPLE_ONE      = 12;  //  三带一
const_val.TYPE_TRIPLE_TWO      = 13;  //  三带二
const_val.TYPE_PLANE_ONE       = 14;  //  飞机带一张
const_val.TYPE_FOUR_TWO        = 15;  //  四带二
const_val.TYPE_FOUR_THREE      = 16;  //  四带三
const_val.TYPE_BOMB            = 99;  //  炸弹
const_val.TYPE_BOMB_MAX        = 100;  //  纯癞子炸弹

const_val.COLOR_BLUR      = 0;  // 护眼蓝
const_val.COLOR_GREEN     = 1;  // 经典绿
const_val.COLOR_YELLOW    = 2;  // 奢侈金

// 用于公会共用弹窗的归属
const_val.CREATE_UNION                  = 0;                    //创建公会
const_val.CREATE_MATCH                  = 1;                    //创建新赛事
const_val.TIP_REMOVE_MATCHMEMBER        = 2;                    //在赛事管理中移出在该赛事的成员的提示
const_val.TIP_STOP_MATCH                = 3;                   //停用赛事提示
const_val.TIP_DELETE_MATCH              = 4;                    //删除赛事提示
const_val.TIP_DELETE_MEMBER             = 5;                    //成员管理中删除公会成员的提示
const_val.TIP_NOTICE                    = 6;                    //公告输入
const_val.TIP_REMARK                    = 7;                    //修改备注输入
const_val.TIP_EXITUNION                 = 8;                    //玩家退出公会
const_val.GAME_BACK_PLAY                = 9;
const_val.TIP_MODIFY                    = 10;                   //修改公会名称
//"""公会相关"""
//公会权限
const_val.PERMISSION_OWNER 		= 0;		//会长
const_val.PERMISSION_NORMAL 	= 1;		//普通会员
//赛事 状态
const_val.TEAM_INVALID 			= 0;		//无效状态
const_val.TEAM_VALID 			= 1;		//有效状态
//公会人数限制
const_val.MAX_MEMBER_NUM 		= 500;
//赛事活动数量限制
const_val.MAX_TEAM_NUM 			= 5;
//开房参数数量
const_val.ROOM_OP_ARGS_LEN 		= 13;

//匹配模式
const_val.ROOM_PRIVATE        = 0; // 所有玩家 私人房间
const_val.ROOM_PUBLIC         = 1; // 所有玩家 公开房间 自动匹配(预留)
const_val.ROOM_GROUP_PUBLIC   = 2; // 公会公开房间 自动匹配
const_val.ROOM_GROUP_PRIVATE  = 3; // 公会私人房间 非自动匹配

// 定义一些公会错误码
//group
const_val.GROUP_PMSN_LIMIT				= 1001;		//公会管理权限不足
const_val.GROUP_NOT_EXIT              	= 1002;      //公会不存在
const_val.PLAYER_NOT_EXIT               = 1003;     // 玩家不存在
//member
const_val.MEM_UP_LIMIT					= 2001;		//公会人数达到上限
const_val.MEM_IN_GROUP					= 2002;  	//玩家已在公会中
const_val.MEM_NOT_IN_GROUP				= 2003;		//玩家不在公会
//team
const_val.TEAM_MEM_UP_LIMIT  			= 3001;		//赛事数量达到上限
const_val.TEAM_PMSN_LIMIT 				= 3002;		//参与赛事权限不足
const_val.TEAM_STATE_ERROR				= 3004;		//赛事状态不正确`
const_val.TEAM_NOT_EXIST				= 3005;		//赛事活动不存在
const_val.TEAM_STATE_INVALID			= 3006;		//赛事已被停用
const_val.TEAM_ROOM_ARGS_ERROR			= 3007;		//赛事房间参数不正确
const_val.TEAM_MEM_EXIT		        	= 3008;		//赛事成员 玩家已存在
const_val.TEAM_MEM_NOT_EXIT		    	= 3009;		//赛事成员 玩家不存在
const_val.TEAM_NO_MEMBER                = 3010;     //赛事无成员
const_val.TEAM_NOT_OWNER                = 3011;     //不能删除自己
const_val.TEAM_ADD_MEMBER               = 3012;     //选择要添加的成员
const_val.TEAM_NO_ROOM                  = 3013;     //赛事无房间
// const_val.TEAM_STOP_MATCH               = 3014;     //停用赛事
//room group
const_val.ROOM_GROUP_NOT_EXIT			= 4001;		//公会房间不存在
const_val.ROOM_GROUP_IS_PLAYING			= 4002;		//公会房间正在游戏中
const_val.ROOM_GROUP_PMSN_LIMIT			= 4003;		//公会房间管理权限不足

const_val.NAME_NO_STANDARD              = 5001;     //名称不能为空或者全是空格
// 设置界面
const_val.GAMEHALL_SET			        = 1;		    //公会房间正在游戏中
const_val.GAMEROOM_SET			        = 2;		    //公会房间不存在

//回看
const_val.GAME_ROOM_GAME_MODE           = 0;

//界面放置的玩家的最大数量
const_val.GAME_PLAYER_CARD_NUM          = 16;

