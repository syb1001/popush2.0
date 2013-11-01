/**
 * controller module
 *
 * controller模块
 * 封装所有controller
 *
 * 模块依赖项：
 * ui.bootstrap (外部依赖项UI-Bootstrap)
 * 
 */
angular.module('app.controller', ['ui.bootstrap'])
	.value('VERSION', 0)
	.factory('GlobalCtrl', ['socket', 'VERSION', GlobalCtrl])
	.factory('FileTypeCtrl', [FileTypeCtrl])
	.factory('UtilCtrl', [UtilCtrl])
	.controller('LoginCtrl', ['$scope', '$location', 'socket', 'GlobalCtrl', LoginCtrl])
	.controller('RegisterCtrl', ['$scope', 'socket', 'GlobalCtrl', RegisterCtrl])
	.controller('NavbarCtrl', ['$scope', NavbarCtrl])
	.controller('FileListCtrl', ['$scope', 'socket', 'GlobalCtrl', 'FileTypeCtrl', 'UtilCtrl', FileListCtrl]);