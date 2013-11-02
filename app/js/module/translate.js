/**
 * translation module
 *
 * 语言模块
 *
 * 模块依赖项：
 * pascalprecht.translate (外部依赖项 angular-translate)
 *
 */
angular.module('app.translate', ['pascalprecht.translate', 'ngCookies']);

/**
 * 支持的所有语言
 */
angular.module('app.translate')
	.value('LANGS', [
		{name: '中文', key: 'zh_cn'},
		{name: 'English', key: 'en_us'}
	]);

/**
 * 默认语言
 */
angular.module('app.translate')
	.config(['$translateProvider', function($translateProvider) {
		// 选择初始语言
		$translateProvider.preferredLanguage('en_us');
	}]);

/**
 * 存储用户语言偏好
 */
angular.module('app.translate')
	.run(['$translate', '$cookies', function($translate, $cookies) {
		// 使用cookie记录用户语言
		if ($cookies.language) {
			$translate.uses($cookies.language);
		} else {
			$cookies.language = $translate.uses();
		}
	}]);

/**
 * 首页语言控制
 */
angular.module('app.translate')
	.controller('HomeLangCtrl', ['$scope', '$translate', '$cookies', 'LANGS', HomeLangCtrl]);

/**
 * 各语言词库
 */
angular.module('app.translate')
	.config(['$translateProvider', function($translateProvider) {

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
			"OWNING_FILES":		"My files",
			"SHARED_FILES":		"Shared files",
			"NEW_FILE":			"New file",
			"NEW_FOLDER":		"New folder",
			"CURRENT_DIR":		"Current directory",
			"SHARED":			"Shared",
			"OWNER":			"Owner",
			"SHARE_USER":		"Share user",
			"FILE_NAME":		"File name",
			"STATUS": 			"Status",
			"MODIFY_TIME":		"Modify time",
			"SHARE_MANAGE":		"Share",
			"DELETE":			"Delete",
			"RENAME":			"Rename",
			"NO_FILE":			"No file",
			"CHANGE_PASSWORD":	"Change Password",
			"CHANGE_AVATAR":	"Change Avatar",
			"LOGOUT":			"Log out",
			"LANGUAGE":			"language"
		});

		// 中文
		$translateProvider.translations('zh_cn', {
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
			"SHARED":			"共享",
			"OWNER":			"所有者",
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
			"RENAME":			"重命名",
			"NO_FILE":			"没有文件",
			"CHANGE_PASSWORD":	"修改密码",
			"CHANGE_AVATAR":	"修改头像",
			"LOGOUT":			"退出",
			"LANGUAGE":			"语言"
		});
	}]);
