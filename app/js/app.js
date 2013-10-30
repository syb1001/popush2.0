/**
 * app module
 *
 * 应用程序级模块
 *
 * 模块依赖项：
 * ngCookies            cookie
 * app.router 路由模块
 * app.translation      翻译模块
 * 
 */
angular.module('app', ['ngCookies', 'app.router', 'app.translation']);