/**
 * router module
 *
 * 路由模块
 *
 * 模块依赖项：
 * ui.router 外部依赖项ui-router
 * 
 */
angular.module('app.router', ['ui.router']);

angular.module('app.router')
	.config(['$urlRouterProvider', '$locationProvider', function($urlRouterProvider, $locationProvider) {
		// html5模式，使url不含'#'
		$locationProvider.html5Mode(true);
		// 设定错误url导向页面
		$urlRouterProvider.otherwise('/login');
	}]);

angular.module('app.router').config(['$stateProvider', function($stateProvider) {
	// 设置路由
	// 形成一个嵌套的树形结构
	
	// 页1
	// 首页，抽象
	$stateProvider.state('home', {
		name: 'home',
		abstract: true,
		templateUrl: 'template/home.html'
	});

	// 页1.1
	// 登录页
	$stateProvider.state('login', {
		name: 'login',
		parent: 'home',
		url: '/login',
		templateUrl: 'template/login.html',
		controller: LoginCtrl
	});

	// 页1.2
	// 注册页
	$stateProvider.state('register', {
		name: 'register',
		parent: 'home',
		url: '/register',
		templateUrl: 'template/register.html',
		controller: RegisterCtrl
	});

	// 页2
	// 主页，抽象
	$stateProvider.state('main', {
		name: 'main',
		abstract: true,
		templateUrl: 'template/main.html'
		// 页面中导航条单独定义控制器
	});

	// 页2.1
	// 个人文件列表
	$stateProvider.state('myfile', {
		name: 'myfile',
		parent: 'main',
		url: '/myfile',
		templateUrl: 'template/myfile.html',
		controller: MyFileCtrl
	});

	// 页2.2
	// 共享文件列表
	$stateProvider.state('sharedfile', {
		name: 'sharedfile',
		parent: 'main',
		url: '/shardefile',
		templateUrl: 'template/sharedfile.html',
		controller: SharedFileCtrl
	});

	// 页2.3
	// 协同编辑页面
	$stateProvider.state('edit', {
		name: 'edit',
		parent: 'main',
		url: '/edit',
		template: '<div>edit page</div><a ui-sref="myfile">to myfile</a>',
		controller: function() {
			alert('edit page');
		}
	});
}]);