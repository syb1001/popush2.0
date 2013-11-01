function GlobalCtrl(socket, VERSION) {

	var isconnect = false;

	var user;
	var currentPath;

	socket.on('connect', function(){
		console.log('connected!');
		socket.emit('version', {});
	});

	socket.on('version', function(data){
		console.log(data.version);
		VERSION = data.version;
		isconnect = true;
	});

	return {
		user : user,
		currentPath: currentPath,
		isbuild : isconnect
	};
}