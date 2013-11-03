function GlobalCtrl($route, $cookies, socket, VERSION) {

	var connected = false;

	var user = {};
	var currentPath;

	socket.on('connect', function(){
		console.log('connected!');
		socket.emit('version', {});
	});

	socket.on('version', function(data){
		if (data.version != VERSION) {
			$route.reload();
		}
		connected = true;
		if ($cookies.sid) {
			socket.emit('relogin', {
				sid: $cookies.sid
			});
		}
	});

	return {
		user : user,
		currentPath: currentPath,
		connected : connected
	};
}