function ModalChangeAvatarCtrl($scope, $modalInstance, $upload, socket, GlobalCtrl) {
	$scope.avatar = GlobalCtrl.user.avatar;

	socket.on('avatar', function(data) {
		if (data.err) {
			$scope.message = 'UPLOAD_FAILED';
		} else {
			$scope.avatar = data.url;
			$modalInstance.close($scope.avatar);
		}
	});

	$scope.changeAvatar = function($files) {

		var file = $files[0];
		var reader = new FileReader();

		reader.onloadend = function() {
			if (reader.error) {
				$scope.message = 'UPLOAD_ERROR';
			} else {
				var s = reader.result;
				var t = s.substr(s.indexOf('base64') + 7);
				if (t.length > 0x100000) {
					$scope.message = 'UPLOAD_TOO_BIG';
				}
				socket.emit('avatar', {
					type: file.type,
					avatar: t
				});
			}
		}
		reader.readAsDataURL(file);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	}
}
