function SharedFileCtrl($scope, $location, socket, GlobalCtrl, FileTypeCtrl, UtilCtrl) {

	$scope.user = GlobalCtrl.user; // 当前用户
	GlobalCtrl.currentPath = '/' + $scope.user.name; // 默认为根目录
	$scope.serverPath = GlobalCtrl.currentPath; // 服务器路径
	$scope.serverPathSplit;
	$scope.list = []; // 存储需要显示的文件信息的数组
	$scope.isRoot = true;
	$scope.owner = '';
	$scope.avatar = '';


	// 刷新视图函数	
	$scope.refresh = function(pathTo) {
		// 请求后台数据
		socket.emit('doc', {
			path: pathTo
		});
	};

	// 加载时刷新
	$scope.refresh($scope.serverPath);

	$scope.openFile = function(name, type, owner, avatar) {
		if (type == 'doc') {
			// 点击文件进入编辑页面
			if ($scope.isRoot) {
				var arr = name.split('@');
				GlobalCtrl.currentPath = '/' + arr[1] + '/' + arr[0];
			} else {
				GlobalCtrl.currentPath = $scope.serverPath + '/' + name;
			}
			$location.path('/edit');
		} else {
			// 点击文件夹
			if ($scope.isRoot) {
				var arr = name.split('@');
				$scope.serverPath = '/' + arr[1] + '/' + arr[0];
				$scope.owner = owner;
				$scope.avatar = avatar;
			} else {
				$scope.serverPath += '/' + name;
			}
			$scope.isRoot = false;
			$scope.refresh($scope.serverPath);
		}
	}

	// 跳转到目录
	$scope.goTo = function(index) {
		if (index == 0) {
			$scope.serverPath = '/' + GlobalCtrl.user.name;
			$scope.isRoot = true;
		} else {
			$scope.serverPathSplit.shift();
			var arr = $scope.serverPathSplit.shift().split('@');
			$scope.serverPathSplit.unshift(arr[0]);
			$scope.serverPathSplit.unshift(arr[1]);
			arr = $scope.serverPathSplit.slice(0, index + 1);
			$scope.serverPath = '/' + arr.join('/');
		}
		$scope.refresh($scope.serverPath);
	}

	socket.removeAllListeners('doc');
	
	// 文件显示逻辑
	socket.on('doc', function(data) {
		// 变换路径成功则更新全局路径
		GlobalCtrl.currentPath = $scope.serverPath;	

		// 生成当前路径树
		$scope.serverPathSplit = $scope.serverPath.split('/');
		$scope.serverPathSplit.shift();
		if ($scope.isRoot) {
			$scope.serverPathSplit[0] = 'shared@' + $scope.serverPathSplit[0];
		} else {
			var str = $scope.serverPathSplit[1] + '@' + $scope.serverPathSplit[0];
			$scope.serverPathSplit.shift();
			$scope.serverPathSplit.shift();
			$scope.serverPathSplit.unshift(str);
			$scope.serverPathSplit.unshift('shared@' + GlobalCtrl.user.name);
		}

		$scope.list = [];
		var docList;
		if (data.doc.docs) {
			// 当前路径为文件夹
			docList = data.doc.docs;
		} else {
			// 当前目录为根目录
			docList = data.doc;
		}

		// 遍历文件
		for (var i = 0; i < docList.length; i++) {
			var doc = docList[i];
			var item = {}; // 要得到的文件对象，对应dom信息

			if ($scope.isRoot) {
				if (doc.members.length == 0) {
					// 非共享文件
					continue;
				} else if (doc.owner.name == $scope.user.name) {
					// 用户自己共享给其他用户的文件文件
					continue;
				}
			}

			// 获得完整文件名及扩展名
			var pathSplit = doc.path.split('/');
			var name = pathSplit[pathSplit.length-1];
			var nameSplit = name.split('.');
			var ext = nameSplit[nameSplit.length-1];
			if (nameSplit.length == 1) {
				ext = 'unknown';
			}
			// 根据扩展名得到文件图标路径
			var iconPath = 'img/ext/';
			if (doc.type == 'dir') {
				iconPath += 'dict';
			} else {
				if (FileTypeCtrl.typeList[ext]) {
					iconPath += FileTypeCtrl.typeList[ext];
				} else {
					iconPath += 'file';
				}
			}
			iconPath += '.png';
			// 得到修改时间
			var modifyTime = UtilCtrl.formatDate(doc.modifyTime);
			// 得到最终数据，用于写入视图
			item.iconPath = iconPath;
			item.ownerName = $scope.isRoot ? doc.owner.name : $scope.owner;
			item.ownerAvatar = $scope.isRoot ? doc.owner.avatar : $scope.avatar;
			// 根路径下的显示不一样
			item.fileName = name + ($scope.isRoot ? ('@' + item.ownerName) : '');
			item.modifyTime = modifyTime;
			item.type = doc.type;
			// 加入数组
			$scope.list.push(item);
		}
		// 数组排序
		$scope.list.sort(function(a, b) {
			if(a.type == b.type) {
				return (a.fileName > b.fileName) ? 1 : -1;
			} else {
				return (a.type == 'dir') ? -1 : 1;
			}
		});
	});
}