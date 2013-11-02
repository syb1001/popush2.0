function SharedFileCtrl($scope, $location, socket, GlobalCtrl, FileTypeCtrl, UtilCtrl) {

	$scope.user = GlobalCtrl.user; // 当前用户
	$scope.list = []; // 存储需要显示的文件信息的数组

	// 刷新视图
	$scope.refresh = function() {
		socket.emit('doc', {
			path: GlobalCtrl.currentPath
		});
	};
	// 加载时刷新
	$scope.refresh();

	// 文件显示逻辑
	socket.on('doc', function(data) {

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

			if (doc.members.length == 0) {
				// 非共享文件
				continue;
			} else if (doc.owner.name == $scope.user.name) {
				// 用户自己共享给其他用户的文件文件
				continue;
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
			item.ownerName = doc.owner.name;
			item.ownerAvatar = doc.owner.avatar;
			item.fileName = name + '@' + item.ownerName;
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