(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/home/detail"],{2811:function(t,e,n){"use strict";var i=n("810b"),a=n.n(i);a.a},"3af5":function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement;t._self._c},a=[];n.d(e,"a",function(){return i}),n.d(e,"b",function(){return a})},"693d":function(t,e,n){"use strict";n.r(e);var i=n("87eb"),a=n.n(i);for(var o in i)"default"!==o&&function(t){n.d(e,t,function(){return i[t]})}(o);e["default"]=a.a},"810b":function(t,e,n){},8600:function(t,e,n){"use strict";n.r(e);var i=n("3af5"),a=n("693d");for(var o in a)"default"!==o&&function(t){n.d(e,t,function(){return a[t]})}(o);n("2811");var c=n("2877"),s=Object(c["a"])(a["default"],i["a"],i["b"],!1,null,null,null);e["default"]=s.exports},"87eb":function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=n("2f62");function a(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},i=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),i.forEach(function(e){o(t,e,n[e])})}return t}function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var c=n("5be0"),s={data:function(){return{modalName:null,reportContent:"",dismissContent:"",detailInfo:{},dotStyle:!1,userInfo:{},id:"",defaultAvator:"https://hudongmsite.oss-cn-hangzhou.aliyuncs.com/meeting/basicYrC5Sh1570383607306.png"}},computed:a({},(0,i.mapState)(["emptyRoomPic"])),onLoad:function(e){var n=this;this.id=e.id,this.getDetailInfo(this.id),t.getStorage({key:"userInfo",success:function(t){n.userInfo=JSON.parse(t.data)}})},methods:{ViewImage:function(e){t.previewImage({urls:this.detailInfo.imgUrlList,current:"".concat(e.currentTarget.dataset.url,"?imageView2/1/w/800/h/434")})},clear:function(){t.clearStorageSync()},goChat:function(){var e=this;this.$api.buildCommunication({receive_user_id:this.detailInfo.leader_id}).then(function(n){t.navigateTo({url:"/pages/chat/detail?id=".concat(e.detailInfo.leader_id)})}).catch(function(t){})},showModal:function(t){this.modalName=t.currentTarget.dataset.target},hideModal:function(t){this.modalName=null},textareaAInput:function(t){this.reportContent=t.detail.value},reported:function(){var e=this;this.$api.getGroupReported({id:this.detailInfo.id,content:this.reportContent}).then(function(n){e.modalName=null,t.showToast({icon:"none",title:"举报成功,我们会尽快进行核实"})}).catch(function(t){e.modalName=null})},join:function(){var e=this;this.$api.getGroupJoin({id:this.detailInfo.id}).then(function(n){e.modalName=null,t.showToast({icon:"success",title:"加入成功"}),t.setStorage({key:"renttype",data:"2",success:function(){}}),setTimeout(function(){t.switchTab({url:"/pages/rent/rent?activeTab=2"})},200)}).catch(function(t){e.modalName=null})},BackPage:function(){t.navigateBack({delta:1})},getDetailInfo:function(t){var e=this;this.$api.getGroupDeatil({id:t}).then(function(t){t.data.cotenant_list&&t.data.cotenant_list.forEach(function(t){t&&t.end_time&&(t.end_time=c.getDate(t.end_time))}),t.data.chamber_img_url=t.data.chamber_img_url||e.emptyRoomPic,t.data.imgUrlList=t.data.chamber_img_url.split(","),t.data.created_time=c.getDate(t.data.created_time),e.detailInfo=t.data,t.data.end_time=c.getDate(t.data.end_time),console.log(e.detailInfo)}).catch(function(t){})},dismissTextareaAInput:function(t){this.dismissContent=t.detail.value},doDismiss:function(){var e=this;t.showModal({title:"温馨提示",content:"请确保与其他成员沟通，同意解散租房团",confirmText:"确定",cancelText:"再想想",success:function(t){t.confirm?e.doDismissAjax():t.cancel}})},openLocation:function(e){console.log(e);e.target.value;t.openLocation({longitude:Number(this.detailInfo.address_longitude),latitude:Number(this.detailInfo.address_latitude),name:this.detailInfo.address_name,address:this.detailInfo.address_detail})},doDismissAjax:function(){this.$api.getPersonaDismiss({id:this.detailInfo.id,dismissContent:this.dismissContent}).then(function(e){t.showToast({icon:"none",title:"解散成功"}),setTimeout(function(){t.switchTab({url:"/pages/home/home",success:function(e){t.setStorage({key:"hometype",data:"2"})}})},500)}).catch(function(t){})}}};e.default=s}).call(this,n("543d")["default"])},e6e4:function(t,e,n){"use strict";(function(t){n("24e0"),n("921b");i(n("66fd"));var e=i(n("8600"));function i(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("543d")["createPage"])}},[["e6e4","common/runtime","common/vendor"]]]);