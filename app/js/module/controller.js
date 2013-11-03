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
angular.module('app.controller', ['ui.bootstrap', 'angularFileUpload', 'ui.codemirror'])
	.value('VERSION', 0)
	.factory('GlobalCtrl', ['$route', '$cookies', 'socket', 'VERSION', GlobalCtrl])
	.factory('FileTypeCtrl', [FileTypeCtrl])
	.factory('UtilCtrl', [UtilCtrl])
	.controller('LoginCtrl', ['$scope', '$location', '$cookies', 'socket', 'GlobalCtrl', LoginCtrl])
	.controller('RegisterCtrl', ['$scope', 'socket', 'GlobalCtrl', RegisterCtrl])
	.controller('NavbarCtrl', ['$scope', '$location', '$cookies', '$translate', '$modal', 'socket', 'GlobalCtrl', 'LANGS', NavbarCtrl])
	.controller('MyFileCtrl', ['$scope', '$location', '$modal', 'socket', 'GlobalCtrl', 'FileTypeCtrl', 'UtilCtrl', MyFileCtrl])
	.controller('SharedFileCtrl', ['$scope', '$location', 'socket', 'GlobalCtrl', 'FileTypeCtrl', 'UtilCtrl', SharedFileCtrl])
	.controller('EditorCtrl', ['$scope', '$timeout', 'socket', 'GlobalCtrl', EditorCtrl]);
