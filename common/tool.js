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