/**
 * controller module
 *
 * controller模块
 * 封装所有controller
 *
 * 
 */
angular.module('app.controller', [])
	.value('VERSION', 0)
	.factory('GlobalCtrl', ['socket', 'VERSION', GlobalCtrl])
	.controller('LoginCtrl', ['$scope', '$location', 'socket', 'GlobalCtrl', LoginCtrl])
	.controller('RegisterCtrl', ['$scope', 'socket', 'GlobalCtrl', RegisterCtrl])
	.controller('NavbarCtrl', ['$scope', NavbarCtrl])
	.controller('FileTreeCtrl', ['$scope', FileTreeCtrl])
	.controller('FileListCtrl', ['$scope', 'socket, FileListCtrl]);