function MyFileCtrl($scope, $location, $modal, socket, GlobalCtrl, FileTypeCtrl, UtilCtrl) {
	
	$scope.user = GlobalCtrl.user; // 当前用户
	$scope.list = []; // 存储需要显示的文件信息的数组
	$scope.serverPath = GlobalCtrl.currentPath; // 服务器路径
	$scope.showPath = []; // 显示的路径，分段显示
	$scope.switchLock = false; // 操作锁，跳转原子操作

	// 下拉列表内容
	// $scope.dropdownItems = [
	// 	{text: 'SHARE_MANAGE', href:'#'},
	// 	{text: 'DELETE', href: '#'},
	// 	{text: 'RENAME', href: '#'}
	// ];
	$scope.itemtext1 = 'SHARE_MANAGE';
	$scope.itemtext2 = 'DELETE';
	$scope.itemtext3 = 'RENAME';

	// 刷新视图函数	
	$scope.refresh = function() {
		// 请求后台数据
		socket.emit('doc', {
			path: $scope.serverPath
		});
	};

	// 加载时刷新
	$scope.refresh();

	// 点击文件可能的路径跳转
	$scope.openFile = function(name, type) {
		if (type == 'doc') {
			// 点击文件则跳转至编辑页面
			$location.path('/edit');
		} else {
			// 点击文件夹则刷新页面
			// 若当前有跳转操作正在进行则不会刷新页面
			if ($scope.switchLock) {
				return;
			}
			// 开始文件跳转操作，加锁
			$scope.switchLock = true;
			// 当前路径变化
			$scope.serverPath += '/' + name;
			// 请求并刷新
			$scope.refresh();
		}
	}

	// 文件显示逻辑
	socket.on('doc', function(data) {
		// 变换路径成功则更新全局路径
		GlobalCtrl.currentPath = $scope.serverPath;
		// 解锁
		$scope.switchLock = false;

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

			if (doc.members.length > 0) {
				// 是共享文件
				if (doc.owner.name != $scope.user.name) {
					// 是其他用户共享给当前用户的文件
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
			// 判断文件是否共享
			var isShared = (doc.members.length == 0) ? false : true;
			// 得到修改时间
			var modifyTime = UtilCtrl.formatDate(doc.modifyTime);
			// 得到最终数据，用于写入视图
			item.iconPath = iconPath;
			item.fileName = name;
			item.isShared = isShared;
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