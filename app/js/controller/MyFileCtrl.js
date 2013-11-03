function MyFileCtrl($scope, $location, $modal, socket, GlobalCtrl, FileTypeCtrl, UtilCtrl) {
	
	$scope.user = GlobalCtrl.user; // 当前用户
	GlobalCtrl.currentPath = '/' + $scope.user.name;
	$scope.list = []; // 存储需要显示的文件信息的数组
	$scope.serverPath = GlobalCtrl.currentPath; // 服务器路径
	$scope.serverPathSplit; // 分段显示路径
	$scope.showPath = []; // 显示的路径，分段显示
	$scope.switchLock = false; // 跳转操作锁
	$scope.isRoot = true; // 是否为根目录
	$scope.isRootShared = false; // 当前文件在根目录下的父文件夹是否被共享

	// 下拉列表内容
	$scope.itemtext1 = 'SHARE_MANAGE';
	$scope.itemtext2 = 'DELETE';
	$scope.itemtext3 = 'RENAME';

	// 刷新视图函数	
	$scope.refresh = function(pathTo) {
		// 请求后台数据
		socket.emit('doc', {
			path: pathTo
		});
	};

	// 加载时刷新
	$scope.refresh($scope.serverPath);

	// 点击文件可能的路径跳转
	$scope.openFile = function(name, type, isShared) {
		if (type == 'doc') {
			// 点击文件则跳转至编辑页面
			GlobalCtrl.currentPath = $scope.serverPath + '/' + name;
			$location.path('/edit');
		} else {
			// 点击文件夹则刷新页面
			// 若当前有跳转操作正在进行则不会刷新页面
			if ($scope.switchLock) {
				return;
			}
			// 开始文件跳转操作，加锁
			$scope.switchLock = true;
			// 判断当前是否在根目录
			if ($scope.serverPath == '/' + $scope.user.name) {
				if (isShared) {
					$scope.isRootShared = true;
				} else {
					$scope.isRootShared = false;
				}
			}
			// 当前路径变化
			$scope.serverPath += '/' + name;
			$scope.isRoot = false;
			// 请求并刷新
			$scope.refresh($scope.serverPath);
		}
	}

	//跳转到目录
	$scope.goTo = function(index) {
		if ($scope.switchLock) {
			return;
		}
		$scope.switchLock = true;
		var arr = $scope.serverPathSplit.slice(0, index + 1);
		$scope.serverPath = '/' + arr.join('/');
		if ($scope.serverPath == '/' + $scope.user.name) {
			$scope.isRoot = true;
			$scope.isRootShared = false;
		} else {
			$scope.isRoot = false;
		}
		$scope.refresh($scope.serverPath);
	};

	socket.removeAllListeners('doc');

	// 文件显示逻辑
	$scope.render = function(data) {
		// 变换路径成功则更新全局路径
		GlobalCtrl.currentPath = $scope.serverPath;
		// 解锁
		$scope.switchLock = false;

		// 生成当前路径树
		$scope.serverPathSplit = $scope.serverPath.split('/');
		$scope.serverPathSplit.shift();

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

			if (doc.members && doc.members.length > 0) {
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
			var isShared = (!doc.members || doc.members.length == 0) ? false : true;
			if ($scope.isRootShared) {
				isShared = true;
			}
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
	}

	// 初始化
	socket.on('doc', $scope.render);

	socket.on('delete', function(data){
		if (data.err){

		}
		else{
			$scope.refresh($scope.serverPath);
		}
	});

	$scope.createNewFile = function(){
		var modalInstance = $modal.open({
			templateUrl: 'template/createnewfiledialog.html',
			controller: ModalCreateNewFileCtrl,
			resolve: {
				currentPath: function (){
					return GlobalCtrl.currentPath;
				}
			}
		});
		modalInstance.result.then(function(){
			$scope.refresh($scope.serverPath);
		});
	};

	$scope.createNewFolder = function(){
		var modalInstance = $modal.open({
			templateUrl: 'template/createnewfolderdialog.html',
			controller: ModalCreateNewFolderCtrl,
			resolve: {
				currentPath: function (){
					return GlobalCtrl.currentPath;
				}
			}
		});
		modalInstance.result.then(function(){
			$scope.refresh($scope.serverPath);
		});
	};

	$scope.deletefile = function (file){
		var modalInstance = $modal.open({
			templateUrl: 'template/deletedialog.html',
			controller: ModalDeleteCtrl,
			resolve: {
				fileName: function (){
					return file;
				},
				currentPath: function (){
					return GlobalCtrl.currentPath;
				}
			}
		});
	};

	$scope.renamefile = function(file){
		var modalInstance = $modal.open({
			templateUrl: 'template/renamedialog.html',
			controller: ModalRenameCtrl,
			resolve: {
				fileName: function (){
					return file;
				},
				currentPath: function (){
					return GlobalCtrl.currentPath;
				}
			}
		});

		modalInstance.result.then(function(){
			$scope.refresh($scope.serverPath);
		});
	};

	$scope.sharemanage = function(file){
		var modalInstance = $modal.open({
			templateUrl: 'template/sharemanagedialog.html',
			controller: ModalShareCtrl,
			resolve: {
				fileName: function() {
					return file;
				},
				currentPath: function() {
					return GlobalCtrl.currentPath;
				}
			}
		});

		modalInstance.result.then(function(){
			socket.removeAllListeners('doc');
			socket.on('doc', $scope.render);
			$scope.refresh($scope.serverPath);
		});
	};
}