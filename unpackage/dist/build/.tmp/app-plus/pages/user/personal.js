(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/user/personal"],{"0faf":function(e,t,n){"use strict";n.r(t);var i=n("6cfb"),s=n.n(i);for(var o in i)"default"!==o&&function(e){n.d(t,e,function(){return i[e]})}(o);t["default"]=s.a},"6cfb":function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=n("5be0"),s=function(){return Promise.all([n.e("common/vendor"),n.e("components/input-autocomplete/input-autocomplete")]).then(n.bind(null,"85b1"))},o={components:{inputAutocomplete:s},data:function(){return{code:"",date:"",endDate:"",selected:[{name:"入学时间"}],nick_name:"",sex:1,colegeIndex:-1,collegeList:[],start_time:"",end_time:"",test:"test",sexList:[{value:"1",name:"男"},{value:"2",name:"女",checked:"true"}],startIndex:-1,startDateList:["2000-09-01","2001-09-01","2002-09-01","2003-09-01","2004-09-01","2005-09-01","2006-09-01","2007-09-01","2008-09-01","2009-09-01","2010-09-01","2011-09-01","2012-09-01","2013-09-01","2014-09-01","2015-09-01","2016-09-01","2017-09-01","2018-09-01","2019-09-01","2020-09-01","2021-09-01","2022-09-01","2023-09-01"],endIndex:-1,endDateList:["2000-06-01","2001-06-01","2002-06-01","2003-06-01","2004-06-01","2005-06-01","2006-06-01","2007-06-01","2008-06-01","2009-06-01","2010-06-01","2011-06-01","2012-06-01","2013-06-01","2014-06-01","2015-06-01","2016-06-01","2017-06-01","2018-06-01","2019-06-01","2020-06-01","2021-06-01","2022-06-01","2023-06-01","2024-06-01","2025-06-01"]}},onLoad:function(){this.getColleges(),this.isEdit=!1},methods:{open:function(){this.$refs.calendar.open()},open2:function(){this.$refs.calendar2.open()},change:function(e){this.start_time=e.fulldate},confirm:function(e){this.start_time=e.fulldate},change2:function(e){this.end_time=e.fulldate},confirm2:function(e){this.end_time=e.fulldate},colegeChange:function(e){this.colegeIndex=e.detail.value},startDateChange:function(e){this.startIndex=e.detail.value,this.start_time=this.startDateList[this.startIndex]},endDateChange:function(e){this.endIndex=e.detail.value,this.end_time=this.endDateList[this.endIndex]},changeSex:function(e){this.sex=e.detail.value},radioChange:function(e){for(var t=0;t<this.sexList.length;t++)if(this.sexList[t].value===e.target.value){this.sex=t;break}},getColleges:function(){var e=this;this.$api.getColleges().then(function(t){e.collegeList=t.data})},saveUserInfo:function(){var t=this;if(this.nick_name)if(this.sex)if(this.colegeIndex<1)e.showToast({icon:"none",title:"请选择学校"});else if(this.startIndex<1)e.showToast({icon:"none",title:"请选择入学时间"});else if(this.endIndex<1)e.showToast({icon:"none",title:"请选择毕业时间"});else{var n="";this.end_time&&(n=i.format(this.end_time)),this.$api.updateUserInfo({nick_name:this.nick_name,sex:this.sex,college_id:this.collegeList[this.colegeIndex].id,start_time:i.format(this.start_time),end_time:n}).then(function(n){e.showToast({icon:"none",title:"保存成功"}),t.$store.dispatch("getuserinfo"),setTimeout(function(){e.switchTab({url:"/pages/home/home"})},500)}).catch(function(e){})}else e.showToast({icon:"none",title:"请选择性别"});else e.showToast({icon:"none",title:"请填写昵称"})}}};t.default=o}).call(this,n("6e42")["default"])},"759b":function(e,t,n){"use strict";var i,s=function(){var e=this,t=e.$createElement;e._self._c},o=[];n.d(t,"b",function(){return s}),n.d(t,"c",function(){return o}),n.d(t,"a",function(){return i})},"8c1b":function(e,t,n){"use strict";n.r(t);var i=n("759b"),s=n("0faf");for(var o in s)"default"!==o&&function(e){n.d(t,e,function(){return s[e]})}(o);n("e8d0");var a,c=n("f0c5"),u=Object(c["a"])(s["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],a);t["default"]=u.exports},bb2b:function(e,t,n){"use strict";(function(e){n("24e0"),n("921b");i(n("66fd"));var t=i(n("8c1b"));function i(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("6e42")["createPage"])},c7cf:function(e,t,n){},e8d0:function(e,t,n){"use strict";var i=n("c7cf"),s=n.n(i);s.a}},[["bb2b","common/runtime","common/vendor"]]]);