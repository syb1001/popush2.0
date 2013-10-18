var app = angular.module('app', ['ui.router']);

app.config(['$stateProvider', function($stateProvider) {
	
	$stateProvider.state('login', {
		name: 'login',
		url: '/login',
		templateUrl: 'template/login.html'
	});

	$stateProvider.state('register', {
		name: 'register',
		url: '/register',
		templateUrl: 'template/register.html'
	});

	$stateProvider.state('dashboard', {
		name: 'dashboard',
		url: '/dashboard',
		templateUrl: 'template/dashboard.html'
	});

	$stateProvider.state('room', {
		name: 'room',
		url: '/room',
		templateUrl: 'template/room.html'
	});

}]);

app.config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true);
}]);

app.run(['$state', function($state) {
	$state.transitionTo('login');
}]);