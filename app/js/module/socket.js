/**
 * socket module
 *
 * socket模块
 * 封装socket.io函数
 * 改写自ngSocketIO外部库
 *
 * 模块依赖项：
 * socket.io 外部依赖库
 * 
 */
angular.module('app.socket', []);

/**
 * 连接到服务器地址
 */
angular.module('app.socket')
	.value('SOCKET_IO', '127.0.0.1:4444');

/**
 * socket.io封装
 * 提供可能需要的通信函数
 */
angular.module('app.socket').
	factory('socket', ['$rootScope', 'SOCKET_IO', function($rootScope, SOCKET_IO) {
	
	// 连接服务器
	var socket = io.connect(SOCKET_IO);

	// 以socket为作用域调用回调函数
	var socketCallback = function(callback) {
		return function() {
			if (callback) {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			}
		}
	};

	// socket.on封装
	var addListener = function(name, callback) {
		socket.on(name, function() {
			var args = arguments;
			$rootScope.$apply(function() {
				callback.apply(socket, args);
			});
		});
	};

	// socket.removeListener封装
	var removeListener = function(name, callback) {
		socket.removeListener(name, socketCallback(callback));
	};

	// socket.removeAllListeners封装
	var removeAllListeners = function(name) {
		socket.removeAllListeners(name);
	};

	// socket.emit封装
	var emit = function(name, data, callback) {
		socket.emit(name, data, socketCallback(callback));
	};

	return {
		addListener: addListener,
		on: addListener,
		removeListener: removeListener,
		removeAllListeners: removeAllListeners,
		emit: emit
	};
}]);