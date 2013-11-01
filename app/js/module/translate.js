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
			"USERNAME":			"Username",
			"YOUR_USERNAME":	"Your username",
			"PASSWORD":			"Password",
			"YOUR_PASSWORD":	"Your password",
			"CONFIRM_PASSWORD":	"Confrim Password",
			"ITEM_REQUIRED":	"Required",
			"LENGTH_INVALID":	"6~20 letters and numbers",
			"LOGIN":			"Login",
			"REGISTER":			"Register",
			"BUTTON_TEXT_EN":	"English",
			"BUTTON_TEXT_CN":	"Chinese",
			"ABOUT_TEAM":		"All rights reserved | Smart Programmers",
			"OWNING_FILES":		"my files",
			"SHARED_FILES":		"shared files",
			"NEW_FILE":			"new file",
			"NEW_FOLDER":		"new folder",
			"CURRENT_DIR":		"current directory",
			"SHARE_USER":		"share user",
			"FILE_NAME":		"file name",
			"STATUS": 			"status",
			"MODIFY_TIME":		"modify time",
			"SHARE_MANAGE":		"share manage",
			"DELETE":			"delete",
			"RENAME":			"rename"	
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
			"ABOUT_TEAM":       "版权所有 | 机智的程序猿小组",
			"OWNING_FILES":     "我的文件",
			"SHARED_FILES":     "共享文件",
			"NEW_FILE":         "新建文件",
			"NEW_FOLDER":       "新建文件夹",
			"CURRENT_DIR":      "当前目录",
			"SHARE_USER":       "共享用户",
			"FILE_NAME":		"文件名",
			"STATUS": 			"状态",
			"MODIFY_TIME":		"修改时间",
			"SHARE_MANAGE":		"共享管理",
			"DELETE":			"删除",
			"RENAME":			"重命名"
		});

		// 选择初始语言
		$translateProvider.preferredLanguage('en_us');
		

		// 使用localstorage保存当前的语言选择
		// $translateProvider.useLocalStorage();
}]);
