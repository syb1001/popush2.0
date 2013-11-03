function ModalRenameCtrl($scope, $modalInstance, socket, fileName, currentPath) {

	$scope.fileName = fileName;

	socket.on('move', function(data){
		if (data.err){
			$scope.message = 'FILE_ALREADY_EXIST';
			return;
		}else{
			$modalInstance.close();
		}
	})
	
	$scope.ok = function(newfilename){

		if (!newfilename){
			$scope.message = 'NEWFILENAME_REQUIRED';
			return;
		}
		socket.emit('move', {
			path: currentPath + '/' + fileName,
			newPath: currentPath + '/' + newfilename
		});
	};

	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
}