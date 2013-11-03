function ModalCreateNewFolderCtrl($scope, $modalInstance, socket, currentPath){
	
	socket.on('new', function(data){
		if (data.err){
			$scope.message = 'FOLDER_ALREADY_EXIST';
			return;
		}else{
			$modalInstance.close();
		}

		$modalInstance.close();
	})

	$scope.ok = function(createnewfoldername){
		if (!createnewfoldername){
			$scope.message = 'FOLDERNAME_REQUIRED';
			return;
		}
		var filepath = currentPath + '/' + createnewfoldername;
		socket.emit('new', {
			type: 'dir',
			path: filepath
		});
	};

	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
}