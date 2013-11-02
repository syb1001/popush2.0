function UtilCtrl() {
	return {

		// 日期格式化函数
		formatDate: function(t) {
			var time = new Date(t);
			var year = time.getFullYear();
			var month = time.getMonth() + 1;
			var day = time.getDate();
			var hour = time.getHours();
			var minute = time.getMinutes();
			var second = time.getSeconds();

			return year + '-'
				+ (month < 10 ? ('0' + month) : month) + '-'
				+ (day < 10 ? ('0' + day) : day) + ' '
				+ (hour < 10 ? ('0' + hour) : hour) + ':'
				+ (minute < 10 ? ('0' + minute) : minute) + ':'
				+ (second < 10 ? ('0' + second) : second);
		}

		
	};
}