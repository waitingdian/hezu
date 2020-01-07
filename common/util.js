	function getDate(date, AddMonthCount = 0, AddDayCount = 0) {
		if (typeof date !== 'object') {
			date = date.replace(/-/g, '/')
		}
		let dd = new Date(date)
		dd.setMonth(dd.getMonth() + AddMonthCount) // 获取AddDayCount天后的日期
		dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
		let y = dd.getFullYear()
		let m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
		let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
		return y + '-' + m + '-' + d
	}
	
	function format(value, fmt) {
		fmt = fmt || 'yyyy-MM-dd hh:mm:ss'
		let that = new Date(value)
		var o = {
		  "M+" : that.getMonth()+1,                 //月份
		  "d+" : that.getDate(),                    //日
		  "h+" : that.getHours(),                   //小时
		  "m+" : that.getMinutes(),                 //分
		  "s+" : that.getSeconds(),                 //秒
		  "q+" : Math.floor((that.getMonth()+3)/3), //季度
		  "S"  : that.getMilliseconds()             //毫秒
		};
		if(/(y+)/.test(fmt)) {
		  fmt=fmt.replace(RegExp.$1, (that.getFullYear()+"").substr(4 - RegExp.$1.length));
		}
		for(var k in o) {
		  if(new RegExp("("+ k +")").test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		  }
		}
		return fmt;
	}
	
	function toStringDate(value, format){
	      let result = ""
	      format = format || '-'
	      if (value) {
	        let data = new Date(value)
	        let year = data.getFullYear();
	        let month = data.getMonth() + 1;
	        let date = data.getDate();
	        result = year + format + (month < 10 ? "0" + month : month) + format + (date < 10 ? "0" + date : date)
	      }
	      return result
	    }
		
	function getCurPage(){
		let pages = getCurrentPages();
		let curPage = pages[pages.length-1];
		return curPage
	}
	
	module.exports = {
		getDate: getDate,
		format: format,
		toStringDate: toStringDate,
		getCurPage: getCurPage
	}
	