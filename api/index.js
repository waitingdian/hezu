import request from '@/common/request.js'
// import { formatGetUri } from '@/common/util.js'

const api = {}
const PORT1 = 'baseinfo'
 //必须大写，为了兼容其他应用
//  用户
// 1.1注册获取验证码
api.register = params => request.globalRequest(`/user/register`, 'POST', params)
// 1.2获取验证码
api.sendMsg = params => request.globalRequest(`/sms/send`, 'GET', params)

// 1.3登录
api.login = params => request.globalRequest(`/login`, 'POST', params)

// 1.4修改个人信息
api.updateUserInfo = params => request.globalRequest(`/user/update`, 'PUT', params)

// 1.5获取个人资料详情
api.getUserInfo = params => request.globalRequest(`/user/detail`, 'GET', params)

// 1.6 获取个人信息(状态)
api.getInfo = params => request.globalRequest(`/user/info`, 'GET', params)

// 1.7
api.proposalReported = params => request.globalRequest(`/user/proposal/reported`, 'POST', params)

//1.8 获取学校信息
api.getColleges = params => request.globalRequest(`/sys/college/list`,'GET',params)

//1.9获取用户学校信息
api.getUserColleges = params => request.globalRequest(`/user/list/colleges`,'GET',params)

// 1.10新增学校
api.saveUserColleges = params => request.globalRequest(`/user/add/colleges`, 'POST', params)

// 1.11编辑学校
api.updateUserColleges = params => request.globalRequest(`/user/update/colleges`, 'PUT', params)

// 1.12删除学校
api.daleteUserColleges = (params) => request.globalRequest(`/user/delete/colleges/${params.id}`, 'DELETE', params)


// 租房
// 1.1 精选页面租房列表
api.getGroupList = params => request.globalRequest(`/group/list`, 'GET', params)

// 1.2 租房详情
api.getGroupDeatil = (params) => request.globalRequest(`/group/${params.id}/detail`, 'GET')

// 1.3 发布租房
api.publishRoom = params => request.globalRequest(`/group/publish`, 'POST', params)

// 1.4 申请加入组团
api.getGroupJoin = (params) => request.globalRequest(`/group/${params.id}/join`, 'POST')

// 1.5 举报租房团
api.getGroupReported = params => request.globalRequest(`/group/${params.id}/reported`, 'POST',{content: params.content})

// 1.6 根据用户id查询租房id
api.getGroupId = params => request.globalRequest(`/group/user/${params.userId}/getGroupId`, 'GET')


// 1.1 查询合租任务
api.getPersonalList = params => request.globalRequest(`/personal/list`, 'GET', params)

// 1.2 查询任务详情
api.getPersonalDetail = (params) => request.globalRequest(`/personal/group/${params.id}/detail`, 'GET')


// 1.3 解散租房团
api.getPersonaDismiss = (params) => request.globalRequest(`/personal/group/${params.id}/dismiss`, 'POST')

// 1.4 租房成员审核(只在我发布的任务详情出现)
api.getPersonalExamine = params => request.globalRequest(`/personal/examine`, 'POST', params)

// 1.5 取消租房(只在我参与的任务详情出现)
api.getCancelPersonal = (params) => request.globalRequest(`/personal/group/${params.id}/cancel`, 'POST')


// 公共
//1.1 获取七牛云token
api.getQnToken = params => request.globalRequest(`/qiniu/token`, 'GET', params)

// 1.3 查询聊天记录
api.getMessage = params => request.globalRequest(`/chat/getMessage`, 'GET', params)

// 1.3 查询聊天列表

api.getChatList = params => request.globalRequest(`/chat/list`, 'GET', params)
// 1.4 发送消息
api.sendChat = params => request.globalRequest(`/chat/send`, 'POST', params)

// 1.1 建立唯一通信
api.buildCommunication = params => request.globalRequest(`/chat/buildCommunication`, 'POST', params)

// 1.6 清除未读消息
api.cleanUnread = params => request.globalRequest(`/personal/clean/unread/${params.type}`, 'GET', params)

// 1.6 清除未读消息
api.updateSys = params => request.globalRequest(`/sys/update`, 'GET')


export default api