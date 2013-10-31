function GlobalCtrl(socket, VERSION) {

	var isconnect = false;

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
		isbuild : isconnect
	};
}