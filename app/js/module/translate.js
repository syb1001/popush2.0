/**
 * translation module
 *
 * 语言模块
 *
 * 作者：巩运青
 *
 * 模块依赖项：
 * pascalprecht.translate (外部依赖项 angular-translate)
 *
 */
angular.module('app.translate', ['pascalprecht.translate']);

angular.module('app.translate')
	.config(['$translateProvider', function($translateProvider/*, $cookies*/) {

		// 英文
		$translateProvider.translations('en_us', {
			"USERNAME":         "Username",
			"YOUR_USERNAME":    "Your username",
			"PASSWORD":         "Password",
			"YOUR_PASSWORD":    "Your password",
			"CONFIRM_PASSWORD": "Confrim Password",
			"ITEM_REQUIRED":    "Required",
			"LENGTH_INVALID":   "6~20 letters and numbers",
			"LOGIN":            "Login",
			"REGISTER":         "Sign up",
			"BUTTON_TEXT_EN":   "English",
			"BUTTON_TEXT_CN":   "Chinese",
			"ABOUT_TEAM":       "Refactored by Smart Programmers"
		});

		// 中文
		$translateProvider.translations('cn_zh', {
			"USERNAME":         "用户名",
			"YOUR_USERNAME":    "您的用户名",
			"PASSWORD":         "密码",
			"YOUR_PASSWORD":    "您的密码",
			"CONFIRM_PASSWORD": "确认密码",
			"ITEM_REQUIRED":    "必填",
			"LENGTH_INVALID":   "请输入6到20个英文字符或数字",
			"LOGIN":            "登录",
			"REGISTER":         "注册",
			"BUTTON_TEXT_EN":   "英文",
			"BUTTON_TEXT_CN":   "中文",
			"ABOUT_TEAM":       "由机智的程序猿小组精心重构"
		});

		// 选择初始语言
		$translateProvider.preferredLanguage('cn_zh');
		

		// 使用localstorage保存当前的语言选择
		// $translateProvider.useLocalStorage();
}]);
