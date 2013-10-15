//当前文件的所有共享用户的列表
var allUserLists = [];

//共享文件时的用户相关操作
function userList(div) {

	//obj为当前页面中的div元素（应该就是显示添加用户的那个层）
	var obj = $(div);
	
	//elements是用户信息
	var elements = [];
	
	//n是当前用户列表的长度
	var n = allUserLists.length;
	
	//标记被选中的用户
	var selected;
	
	//r是一个当前文件所共享的用户对象
	r = {
		
		elements: elements,
		
		//删除用户
		clear: function() {
			obj.html('');
			elements = [];
			this.elements = elements;
			selected = null;
		},
		
		//添加用户
		add: function(user) {
			var i = elements.length;
			obj.append(
				'<li><a href="javascript:;" onclick="allUserLists['+n+'].onselect('+i+')">' +
				'<img class="userlistimg user-' + user.name + '" height="32" width="32" src="' + user.avatar + '">' + user.name + '</a></li>'
			);
			return elements.push(user);
		},
		
		//获取当前被选择的用户
		getselection: function() {
			return selected;
		},
		
		//当用户被选择时发生的事情；将该用户的class改成active，将selected改为该用户
		onselect: function(i) {
			obj.find('li').removeClass('active');
			obj.find('li:eq('+i+')').addClass('active');
			selected = elements[i];
		},
		
		//从服务器读取当前文件的共享用户列表，显示到当前div里
		fromusers: function(users) {
			this.clear();
			users.sort(function(a,b) {
				return a.name>b.name?1:-1;
			});
			for(var i=0; i<users.length; i++) {
				this.add(users[i]);
			}
		}
		
	};
	
	allUserLists.push(r);
	
	return r;

}

//在代码编辑窗口以及个人页面的文档共享用户操作
function userListAvatar(div) {

	var obj = $(div);
	
	var elements = {};
	
	var n = allUserLists.length;
	
	r = {
	
		elements: elements,
		
		clear: function() {
			obj.html('');
			elements = {};
			this.elements = elements;
		},
		
		//在分享中添加用户
		add: function(user, owner) {
			var userobj = $(
				'<img id="avatar' + n + '-' + user.name + '" src="' + user.avatar + '" width="40" height="40"' +
				' class="pull-left online shared-character user-' + user.name + '" />'
				);
			obj.append(userobj);
			//悬浮时弹出每个用户的名字和头像
			$('#avatar' + n + '-' + user.name).popover({
				html: true,
				content: '<img class="pull-left popover-character user-' + user.name + '" src="' + user.avatar + '" width="48" height="48" />' +
				'<b>' + user.name + '</b><br /><span></span><div style="clear:both;"></div>',
				placement: 'bottom',
				trigger: 'hover'
			});
			user.obj = userobj;
			user.online = false;
			user.owner = false;
			if(owner)
				user.owner = true;
			elements[user.name] = user;
		},
		
		//从分享中移除用户
		remove: function(username) {
			$('#avatar' + n + '-' + username).remove();
			if(elements[username])
				delete elements[username];
		},
		
		//读取当前文档的所有共享用户
		fromdoc: function(doc) {
			this.clear();
			doc.members.sort(function(a,b) {
				return a.name>b.name?1:-1;
			});
			this.add(doc.owner, true);
			for(var i=0; i<doc.members.length; i++) {
				var user = doc.members[i];
				this.add(user);
			}
		},
		
		//更新悬浮弹出
		refreshpopover: function(user) {
			$('#avatar' + n + '-' + user.name).popover('destroy');
			$('#avatar' + n + '-' + user.name).popover({
				html: true,
				content: '<img class="pull-left popover-character user-' + user.name + '" src="' + user.avatar + '" width="48" height="48" />' +
				'<b>' + user.name + '</b><br /><span></span><div style="clear:both;"></div>',
				placement: 'bottom',
				trigger: 'hover'
			});
		},
		
		//当一个用户进入了共享的文件编辑，将其设置为online，在别人处看到的是在线状态
		setonline: function(username, online) {
			if(online)
				$('#avatar' + n + '-' + username).addClass('online');
			else
				$('#avatar' + n + '-' + username).removeClass('online');
			elements[username].online = online;
		},
		
		//当用户退出编辑，取消online属性
		setalloffline: function() {
			for(var i in elements) {
				var user = elements[i];
				$('#avatar' + n + '-' + user.name).removeClass('online');
				user.online = false;
			}
		},
		
		//对用户排序
		sort: function() {
			var arr = [];
			for(var i in elements) {
				arr.push(elements[i]);
			}
			arr.sort(function(a, b) {
				return (
					(a.owner && !b.owner)?-1:
					(!a.owner && b.owner)?1:
					(a.online && !b.online)?-1:
					(!a.online && b.online)?1:
					(a.name>b.name)?1:-1
					);
			});
			for(var i=0; i<arr.length; i++) {
				obj.append(arr[i].obj);
			}
		}
	};
	
	allUserLists.push(r);
	
	return r;
	
}
