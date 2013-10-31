/**
 * app module
 *
 * 应用程序级模块
 *
 * 模块依赖项：
 * app.router 路由模块
 * app.socket SocketIO封装模块
 * app.controller 项目依赖的所有控制器
 * app.translate 语言模块
 * 
 */
angular.module('app', [
	'app.router',
	'app.socket',
	'app.controller',
	'app.translate'
]);