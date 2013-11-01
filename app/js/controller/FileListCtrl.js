function FileListCtrl($scope, socket, GlobalCtrl, FileTypeCtrl, UtilCtrl) {
	
	$scope.user = GlobalCtrl.user;
	GlobalCtrl.currentPath = '/syb1001';

	$scope.dropdownItems = [
		{text: 'SHARE_MANAGE', href:' #'},
		{text: 'DELETE', href: '#'},
		{text: 'RENAME', href: '#'}
	];	

	$scope.refresh = function() {
		socket.emit('doc', {
			path: GlobalCtrl.currentPath
		});
	}

	$scope.refresh();

	$scope.list = []; // 存储需要显示的文件信息的数组
	socket.on('doc', function(data) {
		if (data.doc.docs) {
			// 当前路径为文件夹
			for (var i = 0; i < data.doc.docs; i++) {

			}
		} else {
			// 当前目录为根目录
			for (var i = 0; i < data.doc.length; i++) {
				var doc = data.doc[i]; // 单个文件
				var item = {}; // 要得到的文件对象，对应dom信息

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
				// 加入数组
				$scope.list.push(item);
			}
		}
	});


}