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
			"LANGUAGE":			"Language",
			"LOGIN_FAILED":		"Login failed",
			"LOGIN_SUCCESS":	"Login success",
			"USERNAME_REQUIRED":	"Please enter user name!",
			"PASSWORD_REQUIRED":	"Please enter password!",
			"REGISTER_FAILED":	"Register failed",
			"REGISTER_SUCCESS":	"Register success",
			"PASS_INCONSISTANT":	"Passwords are inconsistant!",
			"USERNAME_LEN_WRONG":	"User name must be more than 6 and less than 20 characters!",
			"NEWPASS_REQUIRED":	"Please enter new password!",
			"WRONG_PASSWORD":	"Wrong password!",
			"ORIGINAL_PASS":	"Original password",
			"NEW_PASS":		"New password",
			"CONFIRM_PASS":		"Confirm password",
			"OK":			"OK",
			"CANCEL":		"Cancel",
			"FILE_ALREADY_EXIST":	"File already exists, please re-enter a name",
			"FILENAME_REQUIRED":	"Please enter a name",
			"CREATE_NEW_FILE":	"Create new file",
			"FILENAME":		"File name",
			"FOLDER_ALREADY_EXIST":	"Folder already exists, please re-enter a name",
			"FOLDERNAME_REQUIRED":	"Please enter a name",
			"NEW_FOLDER":		"Create new folder",
			"FOLDERNAME":		"Folder name",
			"DELETE_FILE":		"Delete file",
			"CONFIRM_DELETE":	"Please confirm whether delete it or not",
			"NEWFILENAME_REQUIRED":	"Please enter a new file name",
			"RENAME_FILE":		"Rename file",
			"NEWFILENAME":		"New file name",
			"UPLOAD_FAILED":	"Upload failed",
			"UPLOAD_ERROR":		"Upload error",
			"UPLOAD_TOO_BIG":	"The current file is too big",
			"EDIT_AVATAR":		"Edit avatar",
			"UPLOAD_AVATAR":	"Click this image to upload",
			"ADD":				"Add",
			"BACK":				"Back",
			"NEW_USER":			"New User",
			"FILE":				"File",
			"SHARED_USERS":		"Shared users:",
			"MEMBER_NOT_EXIST": "Member doesn't exist!",
			"NO_THIS_USER":		"User doesn't exist!",
			"CONSOLE": 			"console",
			"SYSTEMMESSAGE":    "system message",
			"JOIN":             "joins the room",
			"LEAVE":            "leaves the room"
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
			"LANGUAGE":			"语言",
			"LOGIN_FAILED":		"登录失败",
			"LOGIN_SUCCESS":	"登录成功",
			"USERNAME_REQUIRED":	"请输入用户名！",
			"PASSWORD_REQUIRED":	"请输入密码！",
			"REGISTER_FAILED":	"注册失败",
			"REGISTER_SUCCESS":	"注册成功",
			"PASS_INCONSISTANT":	"密码不一致，请重新填写！",
			"USERNAME_LEN_WRONG":	"用户名长度应在6-20字符之间！",
			"NEWPASS_REQUIRED":	"请输入新密码",
			"WRONG_PASSWORD":	"密码错误！",
			"ORIGINAL_PASS":	"原密码",
			"NEW_PASS":		"新密码",
			"CONFIRM_PASS":		"确认密码",
			"OK":			"确认",
			"CANCEL":		"取消",
			"FILE_ALREADY_EXIST":	"该文件已存在，请重新输入",
			"FILENAME_REQUIRED":	"请输入文件名",
			"CREATE_NEW_FILE":	"新建文件",
			"FILENAME":		"文件名",
			"FOLDER_ALREADY_EXIST":	"该文件夹已存在，请重新输入",
			"FOLDERNAME_REQUIRED":	"请输入文件夹名",
			"NEW_FOLDER":		"新建文件夹",
			"FOLDERNAME":		"文件夹名",
			"DELETE_FILE":		"删除文件",
			"CONFIRM_DELETE":	"请确认是否删除",
			"NEWFILENAME_REQUIRED":	"请输入新文件名",
			"RENAME_FILE":		"文件重命名",
			"NEWFILENAME":		"新文件名",
			"UPLOAD_FAILED":	"文件上传失败",
			"UPLOAD_ERROR":		"文件上传错误",
			"UPLOAD_TOO_BIG":	"文件大小超过限制",
			"EDIT_AVATAR":		"修改头像",
			"UPLOAD_AVATAR":	"点击图片上传头像",
			"ADD":				"添加",
			"BACK":				"返回",
			"NEW_USER":			"新用户",
			"FILE":				"文件",
			"SHARED_USERS":		"共享的用户：",
			"MEMBER_NOT_EXIST": "用户不存在!",
			"NO_THIS_USER":		"没有这个用户",
			"CONSOLE": 			"控制器",
			"SYSTEMMESSAGE":    "系统消息",
			"JOIN":             "加入了房间",
			"LEAVE":            "离开了房间"
		});
	}]);
