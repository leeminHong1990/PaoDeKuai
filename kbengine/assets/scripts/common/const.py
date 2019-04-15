# -*- coding: utf-8 -*-

HTTP_SERVER_IP = 'qxjoy.cn'
HTTP_DEBUG_SERVER_IP = '112.124.111.15'

DB_NAME = "kbe_PDK"

SUBMISSION_NUM = 5

CONST_AVATAR_TYPE = 0
CONST_NORMALGAME_TYPE = 1
CONST_SPECGAME_TYPE = 2

CONST_SPACE_WIDTH = 256
CONST_SPACE_HEIGHT = 256

SERVER_REFRESH_TIME = [0, 0, 0]  # 第一位表示：小时， 第二位表示：日期
ONEDAY_TIME = 24 * 60 * 60
TROOP_LIMIT = 4
CHARACTER_ID_LIST = [1400001, 1400002, 1400003]

# 服务端timer定义
TIMER_TYPE_AUTO_LOGIN = 0  # 等待玩家登录时创建Avatar
TIMER_TYPE_REFRESH_TASK = 2  # 刷新计时器
TIMER_TYPE_REFRESH_RANK = 3  # 刷新排行榜计时器
TIMER_TYPE_RANK_REWARD = 4  # 刷新排行榜计时器
TIMER_TYPE_BOARDCAST = 5  # 在线玩家广播
TIMER_TYPE_ROOM_POLL = 6  # 房间基础轮询timer
TIMER_TYPE_OPERATION = 7  # 玩家操作倒计时
TIMER_TYPE_NEXT_GAME = 8  # 下一局游戏开始timer
TIMER_TYPE_START_GAME = 11  # 进入房间第一局开始延迟timer
TIMER_TYPE_ROOM_EXIST = 12  # 房间存在倒计时
TIMER_TYPE_USER_DEFINE = 1000  # 用户自定义

Latitude_Division = 1  # 维度在半球上的划分
Longitude_Division = 2  # 经度在半球上的划分

RankType_Wealth = 1  # 基于总体钱数排名
RankType_Charm = 2  # 基于总魅力值数排名
RankType_Week_MasterPoint = 3  # 基于周竞技分数排名
RankType_Week_Killing = 4  # 基于收人头数排名

##########################################

# 初始手牌数目
INIT_CARD_NUMBER = 16

# 房间操作id #
OP_PASS = 0  # 过
OP_DISCARD = 1  # 出牌

# 黑红梅方 经典玩法 16张
CLASSIC_HEI = [28, 36, 44, 52, 60, 68, 76, 84, 92, 100, 108, 116, 132]  # 3 - 2
CLASSIC_HONG = [27, 35, 43, 51, 59, 67, 75, 83, 91, 99, 107, 115]  # 3 - A
CLASSIC_MEI = [26, 34, 42, 50, 58, 66, 74, 82, 90, 98, 106, 114]  # 3 - A
CLASSIC_FANG = [25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105]  # 3 - K

# 黑红梅方 15张玩法
FIFTY_HEI = [28, 36, 44, 52, 60, 68, 76, 84, 92, 100, 108, 116, 132]  # 3 - 2
FIFTY_HONG = [27, 35, 43, 51, 59, 67, 75, 83, 91, 99, 107]  # 3 - K
FIFTY_MEI = [26, 34, 42, 50, 58, 66, 74, 82, 90, 98, 106]  # 3 - K
FIFTY_FANG = [25, 33, 41, 49, 57, 65, 73, 81, 89, 97]  # 3 - Q

# 黑红梅方 单幅牌
HEI = [28, 36, 44, 52, 60, 68, 76, 84, 92, 100, 108, 116, 132]  # 3 - 2
HONG = [27, 35, 43, 51, 59, 67, 75, 83, 91, 99, 107, 115, 131]  # 3 - 2
MEI = [26, 34, 42, 50, 58, 66, 74, 82, 90, 98, 106, 114, 130]  # 3 - 2
FANG = [25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 113, 129]  # 3 - 2

INSTEAD = [24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 128]
# JOKER = [144,152] # 18 19

CARD2 = 16
CIRCLE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16]

HEI_THREE = 28  # 黑3

HONG_TEN = 83  # 红桃10

PLAYER_OPERATION_WAIT_TIME = 12  # 玩家打出一张牌后, 其他玩家是否操作的等待时间
PLAYER_DISCARD_WAIT_TIME = 12  # 玩家摸一张牌后, 打牌的等待时间45
NEXT_GAME_WAIT_TIME = 90  # 一局结束后开始下一句游戏等待玩家准备的timer
START_GAME_WAIT_TIME = 1  # 玩家都进来了之后等待开局的timer
ROOM_EXIST_TIME = 3600  # 每一局房间的时间，时间结束房间不销毁

# 定义一些错误码
OP_ERROR_NOT_CURRENT = 1  # 非当前控牌玩家
OP_ERROR_ILLEGAL = 2  # 操作非法
OP_ERROR_TIMEOUT = 3  # 操作超时
OP_ERROR_FIRST_DISCARD = 4  # 首张牌必须出黑3
##########################################

# 牌局战绩保存上限
MAX_HISTORY_RESULT = 10

# 公会房间信息保存上限
MAX_HISTORY_ROOMINFO = 1000

# 创建房间失败错误码
CREATE_FAILED_NO_ENOUGH_CARDS = -1  # 房卡不足
CREATE_FAILED_ALREADY_IN_ROOM = -2  # 已经在房间中
CREATE_FAILED_OTHER = -3

# 进入房间失败错误码
ENTER_FAILED_ROOM_NO_EXIST = -1  # 房间不存在
ENTER_FAILED_ROOM_FULL = -2  # 房间已经满员
ENTER_FAILED_ROOM_NO_GROUP = -3  # 不是公会会员
ENTER_FAILED_ROOM_LIMIT = -4  # 权限不足
ENTER_FAILED_ROOM_SPORT_LIMIT = -5  # 未报名参加赛事
ENTER_FAILED_ALREADY_IN_ROOM = -6  # 已经在房间中

# 退出房间错误码
QUIT_FAILED_ROOM_ALREADY_START = -1  # 已经开始游戏, 无法退出房间, 只能解散

###########################################
# 签到相关 #
SIGN_IN_ACHIEVEMENT_DAY = 10  # 签到几天得奖励
SIGN_IN_ACHIEVEMENT_NUM = 1  # 奖励几张房卡
###########################################

DISMISS_ROOM_WAIT_TIME = 60  # 申请解散房间后等待的时间, 单位为秒

CREATE_ROOM_WAIT_TIMER = 180  # 创建房间等待时间
BOT_JOIN_ROOM_TIMER = 20  # 创建房间等待时间

# 所有牌型
TYPE_NO_CARD = 0
TYPE_INVALID = 1  # 不符合规定的牌
TYPE_SINGLE = 2  # 单张
TYPE_PAIR = 3  # 一对
TYPE_SERIAL_PAIR = 4  # 连对
TYPE_TRIPLE = 5  # 三张
TYPE_SERIAL_TRIPLE = 6  # 飞机不带
TYPE_SERIAL_SINGLE = 7  # 顺子
TYPE_TRIPLE_ONE = 12  # 三带一
TYPE_TRIPLE_TWO = 13  # 三带二
TYPE_PLANE_ONE = 14  # 飞机带两张
TYPE_FOUR_TWO = 15  # 四带二
TYPE_FOUR_THREE = 16  # 四带三
TYPE_BOMB = 99  # 炸弹
TYPE_BOMB_MAX = 100  # 纯癞子炸弹

CREATE_UNION = 0  # 创建公会
CREATE_MATCH = 1  # 创建新赛事
TIP_REMOVE_MATCHMEMBER = 2  # 在赛事管理中移出在该赛事的成员的提示
TIP_STOP_MATCH = 3  # 停用赛事提示
TIP_DELETE_MATCH = 4  # 删除赛事提示
TIP_DELETE_MEMBER = 5  # 成员管理中删除公会成员的提示
TIP_NOTICE = 6  # 公告输入
TIP_REMARK = 7  # 修改备注输入

"""公会相关"""
# 公会权限
PERMISSION_OWNER = 0  # 会长
PERMISSION_NORMAL = 1  # 普通会员
# 赛事 状态
TEAM_INVALID = 0  # 无效状态
TEAM_VALID = 1  # 有效状态
# 公会人数限制
MAX_MEMBER_NUM = 500
# 赛事活动数量限制
MAX_TEAM_NUM = 5
# 开房参数数量
ROOM_OP_ARGS_LEN = 14
# 周赛场次数量
WEEK_SPORT_GAME_NUM = 3

# 匹配模式
ROOM_PRIVATE = 0  # 所有玩家 私人房间
ROOM_PUBLIC = 1  # 所有玩家 公开房间 自动匹配(预留)
ROOM_GROUP_PUBLIC = 2  # 公会公开房间 自动匹配
ROOM_GROUP_PRIVATE = 3  # 公会私人房间 非自动匹配

# 定义一些公会错误码
# group
GROUP_PMSN_LIMIT = 1001  # 公会权限不足
GROUP_NOT_EXIT = 1002  # 公会不存在
PLAYER_NOT_EXIT = 1003  # 玩家不存在
# member
MEM_UP_LIMIT = 2001  # 公会人数达到上限
MEM_IN_GROUP = 2002  # 玩家已在公会中
MEM_NOT_IN_GROUP = 2003  # 玩家不在公会
# team
TEAM_MEM_UP_LIMIT = 3001  # 赛事数量达到上限
TEAM_PMSN_LIMIT = 3002  # 参与赛事权限不足
TEAM_STATE_ERROR = 3004  # 赛事状态不正确
TEAM_NOT_EXIST = 3005  # 赛事活动不存在
TEAM_STATE_INVALID = 3006  # 赛事已被停用
TEAM_ROOM_ARGS_ERROR = 3007  # 赛事房间参数不正确
TEAM_MEM_EXIT = 3008  # 赛事成员 玩家已存在
TEAM_MEM_NOT_EXIT = 3009  # 赛事成员 玩家不存在
TEAM_NO_MEMBER = 3010  # 赛事无成员
TEAM_NOT_OWNER = 3011  # 赛事无成员
# room group
ROOM_GROUP_NOT_EXIT = 4001  # 公会房间不存在
ROOM_GROUP_IS_PLAYING = 4002  # 公会房间正在游戏中
ROOM_GROUP_PMSN_LIMIT = 4003  # 公会房间权限不足

TEAM_ROOM_INFO = 1  # 记录任何时候的房间记录
#


""" 战绩回看相关 """

TABLE_GAME_RECORD_NAME = "cus_record"
# 缓存
MAX_RECORD_CACHE = 5000  # 最大缓存记录条数
MAX_RECORD_NONE_CACHE = 10000  # 最大缓存空记录条数
CLEAN_RECORD_CACHE_INTERVAL = 60 * 60 * 3  # 定时清理回放缓存时间间隔 单位秒
CLEAN_RECORD_CACHE_IDLE_INTERVAL = 60 * 60 * 3  # 清理回放超过一定时间间隔的数据 单位秒

QUERY_RECORD_NO_EXIST = 1100

""" 赛事 相关 """
SPORT_NONE = 0
SPORT_DAILY = 1
SPORT_WEEKLY = 2
# 实时赛允许玩家同时开始的局数
DAILY_SPORT_PLAYER_ROUND = 3

""" 自动出牌 """
AUTO_DISCARD_TIME = 15  # 自动出牌倒计时时间 单位秒
AUTO_DISCARD_USER_ARG = 101  # 自动出牌标志

###################################### 开房参数 ######################################
CLASSIC_GAME_MODE = 0  # 经典模式
FIFTY_GAME_MODE = 1  # 15张模式
KING_GAME_MODE = 2  # 癞子模式
GAME_MODE = (CLASSIC_GAME_MODE, FIFTY_GAME_MODE, KING_GAME_MODE)
# 游戏局数
GAME_ROUND = (10, 20)
# 玩家人数
PLAYER_NUMBER = (2, 3, 4)
# 功能选择(0:显示牌, 1:不显示牌)
GAME_FUNCTION = (0, 1)
# 首局要求(0: 首局先出黑桃3, 1：首局无要求)
GAME_START = (0, 1)
# 先出模式(0：每局黑桃三先出, 1：第二局庄家先出)
GAME_HEI3 = (0, 1)
# 分牌选择(分牌选择 0:单张分, 1:155分, 2:444分)
GAME_DEAL = (0, 1, 2)
# 出牌选择(0:必须管, 1:可不要)
GAME_FORCE = (0, 1)
# 牌数选择(0:16张, 1:15张, 2:一副牌)
GAME_CARD_NUM = (0, 1, 2)
# 拆法、带法选择(红桃10扎鸟, 四带二, 四带三, 炸弹不可拆)
GAME_PLAYS_LENGTH = 4
GAME_PLAYS_VALUE = (0, 1)
# 结束带法选择(三张可少带出完, 三张可少带接完, 飞机可少带出完, 飞机可少带接完)
GAME_END_LENGTH = 4
GAME_END_VALUE = (0, 1)
# 防作弊开关(0:关, 1:开)
ANTI_CHEATING = (0, 1)
# 房间类型
NORMAL_ROOM = 0  # 普通开房
AGENT_ROOM = 1  # 代理开房
ROOM_TYPE = (NORMAL_ROOM, AGENT_ROOM)
# 竞赛场(0:普通房间, 1:竞赛场房间)
COMPETITION_MODE = (0, 1)
#####################################################################################
#
# 排行榜机器人
RANK_BOT_NUM = 5

DAILY_RECORT_INFO_NUM = 20  # 实时赛排行榜的记录条数
DAILY_RANK_STATE_OPEN = 1  # 实时赛进行中
DAILY_RANK_STATE_CLOSE = 2  # 实时赛结束
