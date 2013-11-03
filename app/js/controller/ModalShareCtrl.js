function ModalShareCtrl($scope, $modalInstance, socket, fileName, currentPath) {
	$scope.fileName = fileName;
	$scope.showMessage = false;
	$scope.message = '';
	$scope.members = {};
	$scope.selectedUserName = "";

	socket.emit('doc', {
		path: currentPath + '/' + fileName,
	});

	socket.removeAllListeners('doc');
	socket.on('doc', function(data) {
		// socket监听重复问题
		if (!$scope.members) {
			return;
		}
		$scope.members = data.doc.members;
		for (var i = 0; i < $scope.members.length; i++) {
			$scope.members[i].isSelected = false;
		};
	});

	socket.on('share', function(data){
		if(data.err){
			$scope.message = 'NO_THIS_USER';
			$scope.showMessage = true;
		} else {
			socket.emit('doc', {
				path: currentPath
			});
		}
	});

	$scope.share = function(shareName) {
		socket.emit('share', {
			path: currentPath + '/' + fileName,
			name: shareName
		});	
	};

	socket.on('share', function(data) {
		if (data.err) {
			$scope.message = "MEMBER_NOT_EXIST";
			$scope.showMessage = true;
		} else {
/*			alert('share success');
			// 向对话框中添加用户
			// */
			$modalInstance.close();
		}
	});

	$scope.unshare = function() {
		if ($scope.selectedUserName != "") {
			socket.emit('unshare', {
				path: currentPath + '/' + fileName,
				name: $scope.selectedUserName
			});
		}
	}

	socket.on('unshare', function(data) {
		if (data.err) {
			$scope.message = 'MEMBER_NOT_EXIST';
			$scope.showMessage = true;
		} else {
/*			alert('unshare success');
			// 从对话框中移除删掉的用户
			// */
			$modalInstance.close();
		}
	});

	$scope.closeMessage = function() {
		$scope.showMessage = false;
	};

	$scope.selectToggle = function(user) {
		if (user.isSelected) {
			for (var i = 0; i < $scope.members.length; i++) {
				$scope.members[i].isSelected = false;
			};
			user.isSelected = false;
			$scope.selectedUserName = "";
		} else {
			for (var i = 0; i < $scope.members.length; i++) {
				$scope.members[i].isSelected = false;
			};
			user.isSelected = true;
			$scope.selectedUserName = user.name;
		}
	};

	$scope.close = function() {
		socket.removeAllListeners('doc');
		$modalInstance.close();
	}
}