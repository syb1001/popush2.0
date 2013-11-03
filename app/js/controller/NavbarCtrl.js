function NavbarCtrl($scope, $location, $cookies, $translate, $modal, socket, GlobalCtrl, LANGS) {
	
	$scope.username = GlobalCtrl.user.name;
	$scope.avatar = GlobalCtrl.user.avatar;

	$scope.langs = LANGS;

	$scope.logout = function() {
		socket.emit('logout', {});
		delete $cookies['sid'];
		$location.path('/login');
	}

	$scope.useLanguage = function(key) {
		$translate.uses(key);
		$cookies.language = $translate.uses();
	};

	$scope.changePassword = function() {
		var modalInstance = $modal.open({
			templateUrl: 'template/changepassworddialog.html',
			controller: ModalChangePasswordCtrl
		});
	};

	$scope.changeAvatar = function() {
		var modalInstance = $modal.open({
			templateUrl: 'template/changeavatardialog.html',
			controller: ModalChangeAvatarCtrl
		});
		modalInstance.result.then(function(avatarUrl) {
			$scope.avatar = avatarUrl;
			GlobalCtrl.user.avatar = $scope.avatar;
		});
	}
}