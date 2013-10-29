/**
 * app module
 *
 * 应用程序级模块
 *
 * 模块依赖项：
 * app.router 路由模块
 * app.socket SocketIO封装模块
 * 
 */
angular.module('app', ['app.router', 'app.socket']);