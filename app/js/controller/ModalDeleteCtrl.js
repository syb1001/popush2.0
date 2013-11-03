function ModalDeleteCtrl($scope, $modalInstance, socket, fileName, currentPath){
	$scope.fileName = fileName;
	console.log(fileName);
	$scope.ok = function(){
		socket.emit('delete', {
			path: currentPath + '/' + fileName
		});
		$modalInstance.close();
	};

	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
}