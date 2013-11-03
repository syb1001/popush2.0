function ModalCreateNewFileCtrl($scope, $modalInstance, socket, currentPath){
	
	socket.on('new', function(data){
		if (data.err){
			$scope.message = 'FILE_ALREADY_EXIST';
			return;
		}else{
			$modalInstance.close();
		}

		$modalInstance.close();
	})

	$scope.ok = function(createnewfilename){
		if (!createnewfilename){
			$scope.message = 'FILENAME_REQUIRED';
			return;
		}
		var filepath = currentPath + '/' + createnewfilename;
		socket.emit('new', {
			type: 'doc',
			path: filepath
		});
	};

	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
}