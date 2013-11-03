function EditorCtrl($scope, $timeout, socket, GlobalCtrl) {

	var operationLock = false;
	//测试区
	//$scope.disrunable = true;
	//$scope.disdebugable = true;

	//向服务器发送join请求，获取当前文档信息

	//变量定义

	var cursors = {};

	var runable = true;
	var runableext = [
		'c', 'cpp', 'js', 'py', 'pl', 'rb', 'lua', 'java'
	];

	var debugable = true;
	var debugableext = [
		'c', 'cpp'
	];

	var savetimestamp;
	var issaving = false;
	var timer = null;
	var savetimeout = 500;

	var editor;
	var ext;
	var doc;
	var runLock = false;
	var debugLock = false;
	var waiting = false;
	var lock = false;
	var q = [];
	var bq = [];
	var bps = "";
	var languagemap = {
		'c':		'clike',
		'clj':		'clojure',
		'coffee':	'coffeescript',
		'cpp':		'clike',
		'cs':		'clike',
		'css':		'css',
		'go':		'go',
		'h':		'clike',
		'htm':		'htmlmixed',
		'html':		'htmlmixed',
		'hpp':		'clike',
		'java':		'clike',
		'js':		'javascript',
		'json':		'javascript',
		'lisp':		'commonlisp',
		'lua':		'lua',
		'md':		'markdown',
		'pas':		'pascal',
		'php':		'php',
		'pl':		'perl',
		'py':		'python',
		'rb':		'ruby',
		'sql':		'sql',
		'tex':		'stex',
		'vbs':		'vb',
		'xml':		'xml',
	};

	var modemap = {
		'c':		'text/x-csrc',
		'clj':		'text/x-clojure',
		'coffee':	'text/x-coffeescript',
		'cpp':		'text/x-c++src',
		'cs':		'text/x-csharp',
		'css':		'text/css',
		'go':		'text/x-go',
		'h':		'text/x-csrc',
		'htm':		'text/html',
		'html':		'text/html',
		'hpp':		'text/x-c++src',
		'java':		'text/x-java',
		'js':		'text/javascript',
		'json':		'application/json',
		'lisp':		'text/x-common-lisp',
		'lua':		'text/x-lua',
		'md':		'text/x-markdown',
		'pas':		'text/x-pascal',
		'php':		'application/x-httpd-php',
		'pl':		'text/x-perl',
		'py':		'text/x-python',
		'rb':		'text/x-ruby',
		'sql':		'text/x-sql',
		'tex':		'text/x-latex',
		'vbs':		'text/x-vb',
		'xml':		'application/xml',
	};

	var old_text;
	var old_bps;
	var runningline = -1;
	var SAVE_TIME_OUT = 1000;

	/// buffer 机制相关
    var bufferfrom = -1;
    var bufferto = -1;
    var buffertext = "";
    var buffertimeout = SAVE_TIME_OUT;

	var gutterclick = function(cm, n) {};

	$scope.setsavecolor = true;
    var currentpathsplit = GlobalCtrl.currentPath.split('/');
    $scope.currentdoc = currentpathsplit[currentpathsplit.length - 1];


	$scope.currentsavemessage = 'saving...';

    $scope.testPath = "";
    $scope.disrunable = false;
    $scope.runicon = 'play';
    $scope.runtitle = 'RUN';

    $scope.disdebugable = false;
    $scope.debugicon = 'open';
    $scope.debugtitle = 'DEBUG';

    $scope.consolemessage = 'CONSOLE';

    $scope.chatMessages= [
    ];

    var appendtochatbox = function(_name, _type, _content, _time) {
        var usernameStr = "";
        var joinStr = "";
        if (arguments[4] == "join"){
            usernameStr = arguments[5];
            usernameStr += ' ';
            joinStr = "JOIN";

            $scope.chatMessages.push({
                name: _name,
                type: _type,
                username: usernameStr,
                joinstring: joinStr,
                content: "",
                time: _time.toTimeString().substr(0, 8)
            });
        }
        else if (arguments[4] == "leave"){
            usernameStr = arguments[5];
            usernameStr += ' ';
            joinStr = "LEAVE";

            $scope.chatMessages.push({
                name: _name,
                type: _type,
                username: usernameStr,
                joinstring: joinStr,
                content: "",
                time: _time.toTimeString().substr(0, 8)
            });
        }
        else {
            $scope.chatMessages.push({
                name: _name,
                type: _type,
                username: "",
                joinstring: "",
                content: _content,
                time: _time.toTimeString().substr(0, 8)
            });
        }


        /// 调整聊天窗口滚动位置高度
        //var o = $('#chat-show').get(0);
        //o.scrollTop = o.scrollHeight;
    };

    function appendtoconsole(content, type) {
        if(type) {
            type = ' class="' + type + '"';
        } else {
            type = '';
        }
        $('#console-inner').append(
            '<span' + type + '">' + htmlescape(content) + '</span>'
        );
        var o = $('#console-inner').get(0);
        o.scrollTop = o.scrollHeight;
    }

    function runtoline(n) {
        if(runningline >= 0) {
            editor.removeLineClass(runningline, '*', 'running');
            editor.setGutterMarker(runningline, 'runat', null);
        }
        if(n >= 0) {
            editor.addLineClass(n, '*', 'running');
            editor.setGutterMarker(n, 'runat', $('<div><img src="img/arrow.png" width="16" height="16" style="min-width:16px;min-width:16px;" /></div>').get(0));
            editor.scrollIntoView({line:n, ch:0});
        }
        runningline = n;
    }

    //初始化uiCodeMirror
    $scope.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
		indentUnit: 4,
		indentWithTabs: true,
		gutters: ["runat", "CodeMirror-linenumbers", "breakpoints"],
        onLoad: function(cm){
        	editor = cm;
        	cm.on("gutterClick", function(cm, n) {
				gutterclick(cm, n);
			});
			socket.emit('join', {
				path: GlobalCtrl.currentPath
			});
			CodeMirror.on(cm.getDoc(), 'change', function(editorDoc, chg){
				whendocchange(editorDoc, chg);
        	});
        }
    };

    q._push = q.push;
	q.push = function(element) {
		this._push(element);
		setsaving();
	}

	q._shift = q.shift;
	q.shift = function() {
		var r = this._shift();
		if(this.length == 0 && bufferfrom == -1){ // buffertext == "") {
			setsaved();
		}
		return r;
	}

    //判断当前是否可以运行
    function runenabled(){
		return (runable && !debugLock && (!issaving || runLock));
	}


	//判断当前是否可以编译
	function debugenabled(){
		return (debugable && !runLock && (!issaving || debugLock));
	}


	//根据文件类型判断是否可以运行
	function isrunable(ext) {
		for(var i=0; i<runableext.length; i++) {
			if(runableext[i] == ext)
				return true;
		}
		return false;
	}

	//根据文件类型判断是否可以编辑
	function isdebugable(ext) {
		for(var i=0; i<debugableext.length; i++) {
			if(debugableext[i] == ext)
				return true;
		}
		return false;
	}

	//根据当前是否可以运行、编译改变按钮的class
    function setrunanddebugstate(){
		//$('#editor-run').removeClass('disabled');
		//$('#editor-debug').removeClass('disabled');
		$scope.disrunable = false;
		$scope.disdebugable = false;
		if(!runenabled())
			$scope.disrunable = true;
			//$('#editor-run').addClass('disabled');
		if(!debugenabled())
			$scope.disdebugable = true;
			//$('#editor-debug').addClass('disabled');
	}

	function setsaving(){
		$scope.setsavecolor = true;
		$scope.currentsavemessage = 'saving...';
/*		$('#current-doc-state').addClass('red');
		$('#current-doc-state').text(strings['saving...']);
		$('#editor-back').attr('title', '');
		$('#editor-back').popover({
			html: true,
			content: strings['unsaved'],
			placement: 'right',
			trigger: 'hover',
			container: 'body'
		});*/
		savetimestamp = 0;
		issaving = true;
		setrunanddebugstate();
	}

	function setsaved(){
		savetimestamp = new Date().getTime();
		$timeout(function(){
			setsavedthen(savetimestamp);
		}, savetimeout);
		savetimeout = 500;
	}

    function setsavedthen(timestamp){
		if(savetimestamp == timestamp) {
			$scope.setsavecolor = false;
			$scope.currentsavemessage = 'saved';
			//$('#editor-back').popover('destroy');
			//$('#editor-back').attr('title', strings['back']);
			issaving = false;
			setrunanddebugstate();
		}
	}

	//根据当前文件类型设置CodeMirror的高亮模式
	function changelanguage(language) {
		if(languagemap[language]) {
			if(modemap[language])
				editor.setOption('mode', modemap[language]);
			else
				editor.setOption('mode', languagemap[language]);
			CodeMirror.autoLoadMode(editor, languagemap[language]);
		} else {
			editor.setOption('mode', 'text/plain');
			CodeMirror.autoLoadMode(editor, '');
		}
	}


	//清除当前的所有断点
	function removeallbreakpoints() {
		for (var i = 0; i < bps.length; i++){
			if (bps[i] == "1"){
				var info = editor.lineInfo(i);
				if (info.gutterMarkers && info.gutterMarkers["breakpoints"]) {
					editor.setGutterMarker(i, 'breakpoints', null);
				}
			}
		}
		bps.replace("1", "0");
	}

	//删除断点n
	function removebreakpointat(cm, n){
		var info = cm.lineInfo(n);
		if (info.gutterMarkers && info.gutterMarkers["breakpoints"]) {
			cm.setGutterMarker(n, 'breakpoints', null);
			//bps = bps.substr(0, n) + "0" + bps.substr(n+1);
			sendbreak(n, n+1, "0");
			return true;
		}
		return false;
	}



	//将新建的断点信息发送给服务器
	function sendbreak(from, to, text){
		var req = {version:doc.version, from:from, to:to, text:text};
		if(bq.length == 0){
			socket.emit('bps', req);
		}
		bq.push(req);
	}

	function addbreakpointat(cm, n){
		var addlen = n - bps.length;
		if (addlen > 0){
			var addtext = "";
			for (var i = bps.length; i < n-1; i++){
				addtext += "0";
			}
			addtext += "1";
			//bps += addtext;
			sendbreak(bps.length, bps.length, addtext);
		}
		else{
			//bps = bps.substr(0, n) + "1" + bps.substr(n+1);
			sendbreak(n, n+1, "1");
		}

		var element = $('<div><img src="img/breakpoint.png" /></div>').get(0);
		cm.setGutterMarker(n, 'breakpoints', element);
	}

	//根据文件类型判断是否可以运行、编译，初始化gutterclick函数以及runable、debugable变量
	function checkrunanddebug(ext) {
		runable = isrunable(ext);
		debugable = isdebugable(ext);
		if(debugable) {
			gutterclick = function(cm, n) {
				if(debugLock && !waiting)
					return;
				if (!removebreakpointat(cm, n)){
					addbreakpointat(cm, n);
				}
			};
		} else {
			gutterclick = function(cm, n) { };
		}
		removeallbreakpoints();
		setrunanddebugstate();
	}

	//初始化断点
	function initbreakpoints(bpsstr) {
		bps = bpsstr;
		for (var i = bpsstr.length; i < editor.lineCount(); i++){
			bps += "0";
		}
		for (var i = 0; i < bps.length; i++){
			if (bps[i] == "1"){
				var element = $('<div><img src="img/breakpoint.png" /></div>').get(0);
				editor.setGutterMarker(i, 'breakpoints', element);
			}
		}
	}


	//新建一个光标
	function newcursor(content) {
		var cursor = $(
			'<div class="cursor">' +
				'<div class="cursor-not-so-inner">' +
					'<div class="cursor-inner">' +
						'<div class="cursor-inner-inner">' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>'
			).get(0);
		/*$(cursor).find('.cursor-inner').popover({
			html: true,
			content: '<b>' + content + '</b>',
			placement: 'bottom',
			trigger: 'hover'
		});*/
		return cursor;
	}

	//设置为正在运行
	function setrun() {
		runLock = true;
		$scope.runicon = "stop";
		$scope.runtitle = "RUNSTOP";
		$scope.disdebugable = true;
/*		$('#editor-run').html('<i class="icon-stop"></i>');
		$('#editor-run').attr('title', strings['kill-title']);
		$('#console-inner').html('');
		$('#console-input').val('');
		$('#editor-debug').addClass('disabled');
		$('#console-title').text(strings['console']);
		openconsole();*/
	}

	//设置为正在编译
	function setdebug() {
		debugLock = true;
		$scope.debugicon = "close";
		$scope.debugtitle = "DEBUGSTOP";
		$scope.disrunable = true;
/*		$('#editor-debug').html('<i class="icon-eye-close"></i>');
		$('#editor-debug').attr('title', strings['stop-debug-title']);
		$('#console-inner').html('');
		$('#console-input').val('');
		$('#editor-run').addClass('disabled');
		$('#console-title').text(strings['console']);
		openconsole();*/
	}

	//设置为运行至第n行
	function runtoline(n) {
		if(runningline >= 0) {
			editor.removeLineClass(runningline, '*', 'running');
			editor.setGutterMarker(runningline, 'runat', null);
		}
		if(n >= 0) {
			editor.addLineClass(n, '*', 'running');
			editor.setGutterMarker(n, 'runat', $('<div><img src="img/arrow.png" width="16" height="16" style="min-width:16px;min-width:16px;" /></div>').get(0));
			editor.scrollIntoView({line:n, ch:0});
		}
		runningline = n;
	}

/*
     buffer 有关小函数
     */
    /// 处理本地未压入发送队列的文本修改数据
    function sendbuffer(){
        /// bufferfrom 用于表示本地是否有修改还未加入 文本数据包 发送队列
        /// 当 bufferfrom 等于 -1 时，说明本地修改已经全部加入 文本数据包 发送队列，否则需要将修改加入 文本数据包 发送队列
        if (bufferfrom != -1) {
            if (bufferto == -1){
                var req = {version:doc.version, from:bufferfrom, to:bufferfrom, text:buffertext};
                if(q.length == 0){
                    socket.emit('change', req);
                }
                q.push(req);
                buffertext = "";
                bufferfrom = -1;
            }
            else {
                var req = {version:doc.version, from:bufferfrom, to:bufferto, text:buffertext};
                if(q.length == 0){
                    socket.emit('change', req);
                }
                q.push(req);
                bufferfrom = -1;
                bufferto = -1;
            }
            /// 将 buffertimeout 重置为 1s; SAVE_TIME_OUT 是 conf.js 中定义的全局变量，值为1000;
            buffertimeout = SAVE_TIME_OUT;
        }
    }

    /// 启动保存机制，一段时间后处理 buffer；若上一次调用 save() 到现在的时间小于 buffertimeout, 则取消上一次的 buffer 定时处理。
    function save(){
        /// 将页面上相关部分调整为与 正在保存 的状态一致的样式
        setsaving();
        /// 若 timer 不为null, 则清除定时
        if (timer != null){
            $timeout.cancel(timer);
        }
        /// 等待 buffertimeout 时间后，调用 sendbuffer()
        timer = $timeout(function(){
        	sendbuffer();
        }, buffertimeout);
    }

    /// 是否有断点，具体的，codemirror 的实例 cm 的 一维位置 n 处是否有断点，有返回 1，无返回 0
    function havebreakat (cm, n) {
        var info = cm.lineInfo(n);
        if (info && info.gutterMarkers && info.gutterMarkers["breakpoints"]) {
            return "1";
        }
        return "0";
    }

    socket.on('running', function(data){
        if(!debugLock)
            return;
        waiting = false;
        runtoline(-1);
        //$('.debugandwait').addClass('disabled');
        //$('#console-title').text(strings['console']);
    });

    socket.on('waiting', function(data){
        if(!debugLock)
            return;
        waiting = true;
        if(typeof data.line === 'number'){
            runtoline(data.line - 1);
        }else{
            runtoline(-1);
        }
        /*
        for(var k in data.exprs) {
            expressionlist.setValue(k, data.exprs[k]);
        }
        */
        //$('.debugandwait').removeClass('disabled');
        if(typeof data.line === 'number')
            $('#console-title').text('console' + 'waiting');
        else if(data.line !== null)
            $('#console-title').text('console' + 'waiting' + '[' + data.line + ']');
        else
            $('#console-title').text('console' + 'waiting' + 'nosource');
    });


    socket.on('debug', function(data){
        appendtochatbox('SYSTEMMESSAGE', 'system', data.name + '  ' + 'starts to debug', new Date(data.time));

        setdebug();

        editor.setOption('readOnly', true);
        old_text = editor.getValue();
        old_bps = bps;
        editor.setValue(data.text);
        removeallbreakpoints();
        initbreakpoints(data.bps);

        var editordoc = editor.getDoc();
        var hist = editordoc.getHistory();
        hist.done.pop();
        editordoc.setHistory(hist);

        operationLock = false;
    });

    function htmlescape(text) {
        return text.
            replace(/&/gm, '&amp;').
            replace(/</gm, '&lt;').
            replace(/>/gm, '&gt;').
            replace(/ /gm, '&nbsp;').
            replace(/\n/gm, '<br />');
    }

    socket.on('chat', function(data) {
        var text = htmlescape(data.text);

        var time = new Date(data.time);

        appendtochatbox(data.name, (data.name == GlobalCtrl.name?'self':''), text, time);
    });

    $scope.chat = function() {
        var text = $('#chat-input').val();
        if(text == '')
            return;

        socket.emit('chat', {
            text: text
        });
        $('#chat-input').val('');
    }

    $scope.pressenter = function(e, func) {
        e = e || event;
        if(e.keyCode == 13 && loadDone)
            func();
    }

    $scope.stdin = function() {
        if(debugLock && waiting)
            return;

        var text = $('#console-input').val();

        if(runLock || debugLock) {
            socket.emit('stdin', {
                data: text + '\n'
            });
        } else {
            appendtoconsole(text + '\n', 'stdin');
        }

        $('#console-input').val('');
    }





    //运行
    $scope.run = function() {
		if(!runenabled())
			return;
		if(operationLock)
			return;
		operationLock = true;
		if(runLock) {
			socket.emit('kill');
		} else {
			socket.emit('run', {
				version: doc.version,
				type: ext
			});
		}
	}

    $scope.debug = function() {
        if(!debugenabled())
            return;
        if(operationLock)
            return;
        operationLock = true;
        if(debugLock) {
            socket.emit('kill');
        } else {
            socket.emit('debug', {
                version: doc.version,
                type: ext
            });
        }
    }

    /// 逐语句 step in
    $scope.debugstep = function() {
        if(debugLock && waiting) {
            socket.emit('step', {
            });
        }
    }

    /// 此函数添加在 html 标签中，点击时触发
/// 逐过程 over
     $scope.debugnext = function() {
        if(debugLock && waiting) {
            socket.emit('next', {
            });
        }
    }

/// 此函数添加在 html 标签中，点击时触发
/// 跳出过程 step out
     $scope.debugfinish = function() {
        if(debugLock && waiting) {
            socket.emit('finish', {
            });
        }
    }

/// 此函数添加在 html 标签中，点击时触发
/// 继续 resume
     $scope.debugcontinue = function() {
        if(debugLock && waiting) {
            socket.emit('resume', {
            });
        }
    }


	/// 收到 set 消息, 成功进入房间，更准确的说是成功进入某个文件的编辑界面，任意文件，包括自己的，共享给别人的，别人共享的
	/// set 消息内容包括: id, users, version, text, bps, exprs
    socket.on('set', function(data){

		savetimestamp = 1;
		setsavedthen(1);

		q.length = 0;
		bq.length = 0;
		lock = false;

		$scope.runtitle = 'RUN';

		runLock = false;
		debugLock = false;
		waiting = false;

		//$('#current-doc').html(htmlescape(docobj.showname));
		//$('#chat-input').val('');
		//$('#chat-show-inner').text('');
		//$('#editor').show();
		//$('#filecontrol').hide();
		//$('#footer').hide();
		var filepart = GlobalCtrl.currentPath.split('.');
		ext = filepart[filepart.length - 1];
		changelanguage(ext);
		checkrunanddebug(ext);

		editor.refresh();

/*		if(currentDir.length == 1) {
			memberlistdoc.fromdoc(docobj);
		}
		memberlistdoc.setalloffline();
		memberlistdoc.setonline(currentUser.name, true);*/

		for(var k in cursors) {
			$(cursors[k].element).remove();
		}

		cursors = {};

		//oldscrolltop = $('body').scrollTop();

/*		window.voiceon = false;
		window.voiceLock = false;
		window.userArray = [];
		window.audioArray = {};
		window.joinedARoom = false;
		window.peerArray = {};
		window.peerUserArray = [];*/

		//$('#voice-on').removeClass('active');

		operationLock = false;

		lock = true;
		doc = data;
		editor.setValue(doc.text);
        if (lock)
            lock = false;
		editor.clearHistory();
		editor.setOption('readOnly', false);
		initbreakpoints(data.bps);
		for(var i in data.users) {
			//memberlistdoc.setonline(i, true);
			if(i == GlobalCtrl.user.name)
				continue;
			var cursor = newcursor(i);
			if(cursors[i] && cursors[i].element)
				$(cursors[i].element).remove();
			cursors[i] = { element:cursor, pos:0 };
		}
		//memberlistdoc.sort();

		//filelist.removeloading();
		//$('#console-inner').html('');
		//closeconsole();

		/*expressionlist.clear();
		for(var k in data.exprs) {
			expressionlist.addExpression(k);
			expressionlist.setValue(k, data.exprs[k]);
		}*/

		//$('#console-title').text(strings['console']);


		//resize();
		//$('body').scrollTop(99999);

		if(data.running) {
			setrun();
		}
		if(data.debugging) {
			setdebug();
			editor.setOption('readOnly', true);
			old_text = data.text;
			old_bps = data.bps;
			if(data.state == 'waiting') {
				waiting = true;
				runtoline(data.line - 1);
				//$('.debugandwait').removeClass('disabled');
				//if(data.line !== null)
					//$('#console-title').text(strings['console'] + strings['waiting']);
				//else
					//$('#console-title').text(strings['console'] + strings['waiting'] + strings['nosource']);
			}
		}
		setrunanddebugstate();

		delete data.running;
		delete data.debugging;
		delete data.state;
	});



    /// 收到 ok 消息，修改文档成功
    /// ok 消息的内容是 null
    socket.on('ok', function(data){
        /// 从队列中弹出一个数据包
        var chg = q.shift();
        if(!chg)
            return;
        doc.text = doc.text.substr(0, chg.from) + chg.text + doc.text.substr(chg.to);
        doc.version++;
        doc.version = doc.version % 65536;
        for(var i = 0; i < q.length; i++){
            q[i].version++;
            q[i].version = q[i].version % 65536;
        }
        for(var i = 0; i < bq.length; i++){
            bq[i].version++;
            bq[i].version = bq[i].version % 65536;
        }
        if(q.length > 0){
            socket.emit('change', q[0]);
        }
        if (bq.length > 0){
            socket.emit('bps', bq[0]);
        }
    });

    /// 收到 run 消息，当前文档被对方运行
    /// run 消息内容包含 name, time
    socket.on('run', function(data){
        /// 在 聊天窗口 中添加一条 系统消息 显示
        appendtochatbox('SYSTEMMESSAGE', 'system', data.name + '  ' + 'excutes the program', new Date(data.time));
        setrun();
        /// operationLock 是 popush.js 中定义的全局变量，bool 类型
        operationLock = false;
    });


    //收到运行结束的消息
    socket.on('exit', function(data){
		operationLock = false;

		if(data.err.code !== undefined)
			appendtochatbox('SYSTEMMESSAGE', 'system', 'program finish' + ' ' + data.err.code, new Date(data.time));
		else
			appendtochatbox('SYSTEMMESSAGE', 'system', 'program killed by' + ' ' + data.err.signal, new Date(data.time));

		if(runLock) {
			$scope.runtitle = 'RUN';
			$scope.runicon = 'play';
			runLock = false;
		}
		if(debugLock) {
			editor.setValue(old_text);
			removeallbreakpoints();
			initbreakpoints(old_bps);

			var editordoc = editor.getDoc();
			var hist = editordoc.getHistory();
			hist.done.pop();
			editordoc.setHistory(hist);

			editor.setOption('readOnly', false);
			if(q.length > 0){
				socket.emit('change', q[0]);
			}
			$scope.debugtitle = 'DEBUG';
			$scope.debugicon = 'open';
			runtoline(-1);
            /*
			for(var k in expressionlist.elements) {
				expressionlist.setValue(expressionlist.elements[k].expression, null);
			}
			*/
			debugLock = false;
		}
		setrunanddebugstate();
		//$('#console-title').text(strings['console'] + strings['finished']);
	});

    socket.on('stdout', function(data){
        appendtoconsole(data.data);
    });





    /// 收到 change 消息，情景是当前文档被对方程序员修改
    /// change 消息内容包括 version, from, to, text
    /// 依赖全局变量: lock
    socket.on('change', function(data){
        lock = true; // 全局变量
        var tfrom = data.from;
        var tto = data.to;
        var ttext = data.text;
        /// 更新本地文件修改数据包队列
        for (var i = 0; i < q.length; i++){
            if (q[i].to <= tfrom){
                tfrom += q[i].text.length + q[i].from - q[i].to;
                tto += q[i].text.length + q[i].from - q[i].to;
            }
            else if (q[i].to <= tto && q[i].from <= tfrom){
                var tdlen = tto - q[i].to;
                q[i].to = tfrom;
                tfrom = q[i].from + q[i].text.length;
                tto = tfrom + tdlen;
            }
            else if (q[i].to <= tto && q[i].from > tfrom){
                tto = tto + q[i].text.length + q[i].from - q[i].to;
                ttext = q[i].text + ttext;
                q[i].from = tfrom;
                q[i].to = tfrom;
            }
            else if (q[i].to > tto && q[i].from <= tfrom){
                var qlen = q[i].text.length;
                //q[i].to = q[i].to + ttext.length + tfrom - tto;
                q[i].to = q[i].to + ttext.length + tfrom - tto;
                q[i].text = q[i].text + ttext;
                tfrom = q[i].from + qlen;
                tto = tfrom;
            }
            else if (q[i].to > tto && q[i].from <= tto){
                var qdlen = q[i].to - tto;
                tto = q[i].from;
                q[i].from = tfrom + ttext.length;
                q[i].to = q[i].from + qdlen;
            }
            else if (q[i].from > tto){
                q[i].from += ttext.length + tfrom - tto;
                q[i].to += ttext.length + tfrom - tto;
            }
            q[i].version++;
            q[i].version = q[i].version % 65536;
        }
        /// 更新本地断点修改数据包发送队列
        for (var i = 0; i < bq.length; i++){
            bq[i].version++;
            bq[i].version = bq[i].version % 65536;
        }
        /// 如果本地有未加入队列的缓冲
        if (bufferfrom != -1){
            if (bufferto == -1){
                if (bufferfrom <= tfrom){
                    tfrom += buffertext.length;
                    tto += buffertext.length;
                }
                else if (bufferfrom <= tto){
                    tto += buffertext.length;
                    ttext = buffertext + ttext;
                    bufferfrom = tfrom;
                }
                else {
                    bufferfrom += ttext.length + tfrom - tto;
                }
            }
            else{
                if (bufferto <= tfrom){
                    tfrom += bufferfrom - bufferto;
                    tto += bufferfrom - bufferto;
                }
                else if (bufferto <= tto && bufferfrom <= tfrom){
                    var tdlen = tto - bufferto;
                    bufferto = tfrom;
                    tfrom = bufferfrom;
                    tto = tfrom + tdlen;
                }
                else if (bufferto <= tto && bufferfrom > tfrom){
                    tto = tto + bufferfrom - bufferto;
                    bufferfrom = -1;
                    bufferto = -1;
                }
                else if (bufferto > tto && bufferfrom <= tfrom){
                    bufferto = bufferto + ttext.length + tfrom - tto;
                    buffertext = buffertext + ttext;
                    tfrom = bufferfrom;
                    tto = tfrom;
                }
                else if (bufferto > tto && bufferfrom <= tto){
                    var qdlen = bufferto - tto;
                    tto = bufferfrom;
                    bufferfrom = tfrom + ttext.length;
                    bufferto = bufferfrom + qdlen;
                }
                else if (bufferfrom > tto){
                    bufferfrom += ttext.length + tfrom - tto;
                    bufferto += ttext.length + tfrom - tto;
                }
            }
        }
        var delta = tfrom + ttext.length - tto;
        var editorDoc = editor.getDoc();
        var hist = editorDoc.getHistory();
        var donefrom = new Array(hist.done.length);
        var doneto = new Array(hist.done.length);
        for (var i = 0; i < hist.done.length; i++) {
            donefrom[i] = editor.indexFromPos(hist.done[i].changes[0].from);
            doneto[i] = editor.indexFromPos(hist.done[i].changes[0].to);
        }
        var undonefrom = new Array(hist.undone.length);
        var undoneto = new Array(hist.undone.length);
        for (var i = 0; i < hist.undone.length; i++) {
            undonefrom[i] = editorDoc.indexFromPos(hist.undone[i].changes[0].from);
            undoneto[i] = editorDoc.indexFromPos(hist.undone[i].changes[0].to);
        }
        for (var i = 0; i < hist.done.length; i++){
            if (doneto[i] <= tfrom){
            }
            else if (doneto[i] <= tto && donefrom[i] <= tfrom){
                hist.done[i].changes[0].to = editor.posFromIndex(tfrom);
                //doneto[i] = tfrom;
            }
            else if (doneto[i] <= tto && donefrom[i] > tfrom){
                hist.done[i].changes[0].from = editor.posFromIndex(tfrom);
                hist.done[i].changes[0].to = editor.posFromIndex(tfrom);
            }
        }
        for (var i = 0; i < hist.undone.length; i++){
            if (undoneto[i] <= tfrom){
            }
            else if (undoneto[i] <= tto && undonefrom[i] <= tfrom){
                hist.undone[i].changes[0].to = editor.posFromIndex(tfrom);
                //undoneto[i] = tfrom;
            }
            else if (undoneto[i] <= tto && undonefrom[i] > tfrom){
                hist.undone[i].changes[0].from = editor.posFromIndex(tfrom);
                hist.undone[i].changes[0].to = editor.posFromIndex(tfrom);
            }
        }
        //var cursor = editorDoc.getCursor();
        //var curfrom = editor.indexFromPos(cursor);
        /// 全局变量editor 在 popush.js 中声明.
        /// 然后调用codemirror的方法： doc.replaceRange(replacement: string, from: {line, ch}, to: {line, ch})
        editor.replaceRange(ttext, editor.posFromIndex(tfrom), editor.posFromIndex(tto));
        //if (curfrom == tfrom){
        //	editorDoc.setCursor(cursor);
        //}
        for (var i = 0; i < hist.done.length; i++){
            if (doneto[i] <= tfrom){
            }
            else if (doneto[i] <= tto && donefrom[i] <= tfrom){
            }
            else if (doneto[i] <= tto && donefrom[i] > tfrom){
            }
            else if (doneto[i] > tto && donefrom[i] <= tfrom){
                hist.done[i].changes[0].to = editor.posFromIndex(doneto[i] + delta);

            }
            else if (doneto[i] > tto && donefrom[i] <= tto){
                hist.done[i].changes[0].from = editor.posFromIndex(tfrom + ttext.length);
                hist.done[i].changes[0].to = editor.posFromIndex(donefrom[i] + doneto[i] - tto);
            }
            else if (donefrom[i] > tto){
                hist.done[i].changes[0].from = editor.posFromIndex(donefrom[i] + ttext.length + tfrom - tto);
                hist.done[i].changes[0].to = editor.posFromIndex(doneto[i] + ttext.length + tfrom - tto);
            }
        }
        for (var i = 0; i < hist.undone.length; i++){
            if (undoneto[i] <= tfrom){
            }
            else if (undoneto[i] <= tto && undonefrom[i] <= tfrom){
            }
            else if (undoneto[i] <= tto && undonefrom[i] > tfrom){
            }
            else if (undoneto[i] > tto && undonefrom[i] <= tfrom){
                hist.undone[i].changes[0].to = editor.posFromIndex(undoneto[i] + delta);
            }
            else if (undoneto[i] > tto && undonefrom[i] <= tto){
                hist.undone[i].changes[0].from = editor.posFromIndex(tfrom + ttext.length);
                hist.undone[i].changes[0].to = editor.posFromIndex(undonefrom[i] + undoneto[i] - tto);
            }
            else if (undonefrom[i] > tto){
                hist.undone[i].changes[0].from = editor.posFromIndex(undonefrom[i] + ttext.length + tfrom - tto);
                hist.undone[i].changes[0].to = editor.posFromIndex(undoneto[i] + ttext.length + tfrom - tto);
            }
        }
        for (var i = 0; i < hist.done.length; i++){
            hist.done[i].anchorAfter = hist.done[i].changes[0].from;
            hist.done[i].anchorBefore = hist.done[i].changes[0].from;
            hist.done[i].headAfter = hist.done[i].changes[0].from;
            hist.done[i].headBefore = hist.done[i].changes[0].from;
        }
        for (var i = 0; i < hist.undone.length; i++){
            hist.undone[i].anchorAfter = hist.undone[i].changes[0].from;
            hist.undone[i].anchorBefore = hist.undone[i].changes[0].from;
            hist.undone[i].headAfter = hist.undone[i].changes[0].from;
            hist.undone[i].headBefore = hist.undone[i].changes[0].from;
        }
        /// 调用 codemirror 的方法: doc.setHistory(history: object)
        /// Replace the editor's undo history with the one provided
        editorDoc.setHistory(hist);
        /// doc 是全局变量
        doc.text = doc.text.substr(0, data.from) + data.text + doc.text.substr(data.to);
        doc.version++;
        doc.version = doc.version % 65536;
        if(q.length > 0){
            socket.emit('change', q[0]);
        }

        /// 调用 codemirror 的方法: doc.posFromIndex(index: integer) → {line, ch}
        /// 由 index 得到相应的包含行、列信息的对象
        /// Calculates and returns a {line, ch} object for a zero-based index who's value is relative to the start of the editor's text.
        var pos = editor.posFromIndex(data.from + data.text.length);
        /// cursors 是一个全局变量，一个Object
        cursors[data.name].pos = data.from + data.text.length;
        /// 调用 codemirror 的方法: cm.addWidget(pos: {line, ch}, node: Element, scrollIntoView: boolean)
        /// Puts node, which should be an absolutely positioned DOM node, into the editor, positioned right below the given {line, ch} position.
        editor.addWidget(pos, cursors[data.name].element, false);
    });

	socket.on('bps', function(data){
		var tfrom = data.from;
		var tto = data.to;
		var ttext = data.text;
		for (var i = 0; i < bq.length; i++){
			if (bq[i].to <= tfrom){
				tfrom += bq[i].text.length + bq[i].from - bq[i].to;
				tto += bq[i].text.length + bq[i].from - bq[i].to;
			}
			else if (bq[i].to <= tto && bq[i].from <= tfrom){
				var tdlen = tto - bq[i].to;
				bq[i].to = tfrom;
				tfrom = bq[i].from + bq[i].text.length;
				tto = tfrom + tdlen;
			}
			else if (bq[i].to <= tto && bq[i].from > tfrom){
				tto = tto + bq[i].text.length + bq[i].from - bq[i].to;
				ttext = bq[i].text + ttext;
				bq[i].from = tfrom;
				bq[i].to = tfrom;
			}
			else if (bq[i].to > tto && bq[i].from <= tfrom){
				var bqlen = bq[i].text.length;
				//q[i].to = q[i].to + ttext.length + tfrom - tto;
				bq[i].to = bq[i].to + ttext.length + tfrom - tto;
				bq[i].text = bq[i].text + ttext;
				tfrom = bq[i].from + bqlen;
				tto = tfrom;
			}
			else if (bq[i].to > tto && bq[i].from <= tto){
				var bqdlen = bq[i].to - tto;
				tto = bq[i].from;
				bq[i].from = tfrom + ttext.length;
				bq[i].to = bq[i].from + bqdlen;
			}
			else if (bq[i].from > tto){
				bq[i].from += ttext.length + tfrom - tto;
				bq[i].to += ttext.length + tfrom - tto;
			}
			bq[i].version++;
			bq[i].version = bq[i].version % 65536;
		}
		for (var i = 0; i < q.length; i++){
			q[i].version++;
			q[i].version = q[i].version % 65536;
		}
		bps = bps.substr(0, data.from) + data.text + bps.substr(data.to);
		if(debugLock)
			old_bps = old_bps.substr(0, data.from) + data.text + old_bps.substr(data.to);
		if (data.to == data.from + 1){
			if (data.text == "1"){
				var element = $('<div><img src="img/breakpoint.png" /></div>').get(0);
				editor.setGutterMarker(data.from, 'breakpoints', element);
			}
			else if (data.text == "0"){
				var info = editor.lineInfo(data.from);
				if (info.gutterMarkers && info.gutterMarkers["breakpoints"]) {
					editor.setGutterMarker(data.from, 'breakpoints', null);
				}
			}
		}
		doc.version++;
		doc.version = doc.version % 65536;
		if(bq.length > 0){
			socket.emit('bps', bq[0]);
		}
	});

	socket.on('bpsok', function(data){
		var chg = bq.shift();
		if (!chg)
			return;
		bps = bps.substr(0, chg.from) + chg.text + bps.substr(chg.to);
		if(debugLock)
			old_bps = old_bps.substr(0, chg.from) + chg.text + old_bps.substr(chg.to);
		doc.version++;
		doc.version = doc.version % 65536;
		for(var i = 0; i < q.length; i++){
			q[i].version++;
			q[i].version = q[i].version % 65536;
		}
		for(var i = 0; i < bq.length; i++){
			bq[i].version++;
			bq[i].version = bq[i].version % 65536;
		}
		if(q.length > 0){
			socket.emit('change', q[0]);
		}
		if (bq.length > 0){
			socket.emit('bps', bq[0]);
		}
	});

	socket.on('join', function(data){
		if(data.err) {
			alert('error');
		} else {
			//memberlistdoc.setonline(data.name, true);
			//memberlistdoc.sort();
			appendtochatbox('SYSTEMMESSAGE', 'system', "", new Date(data.time), "join", data.name);
			var cursor = newcursor(data.name);
			if(cursors[data.name] && cursors[data.name].element)
				$(cursors[data.name].element).remove();
			cursors[data.name] = { element:cursor, pos:0 };
		}
	});



	function whendocchange(editorDoc, chg){
		/// 以下内容当 editor.getDoc() 发生改变时触发

        //console.log(chg);

        /// 如果正在调试
        if(debugLock){
            return true;
        }

        /// 如果从本地 editor 的 document 上一次被修改到现在，这段时间内，收到过 set 或 change 消息
        /// (每当本地 editor 的 document 被修改，就会触发 change 函数，就会将 lock 置为 false)
        if(lock){
            lock = false;
            return true;
        }

        /// codemirror 的方法, 由 二维坐标 到 一维坐标
        /// doc.indexFromPos(object: {line, ch}) → integer
        var cfrom = editor.indexFromPos(chg.from);
        var cto = editor.indexFromPos(chg.to);
        var removetext = "";
        /// removed is the text that used to be between from and to.
        /// removed 是从 from 到 to 的修改前的文本
        for (var i = 0; i < chg.removed.length - 1; i++){
            removetext += chg.removed[i] + '\n';
        }
        removetext += chg.removed[chg.removed.length - 1];
        cto = cfrom + removetext.length;
        var cattext = "";
        /// text is an array of strings representing the text that replaced the changed range (split by line).
        /// text 是一个数组，表示新的文本，其中每一项是一个字符串，按行分开
        /// 这个 for 循环及后面一句话，把 text 连接成一个字符串，具体的，把 text 中来自不同行的字符串之间以 \n 分隔
        for (var i = 0; i < chg.text.length - 1; i++){
            cattext += chg.text[i] + '\n';
        }
        /// 最后一个字符串后面不需要 \n
        cattext += chg.text[chg.text.length - 1];

        /// 偏移量，位置的净增长，可以理解为修改生效后总文本长度的增长
        var delta = cfrom + cattext.length - cto;

        /// 修改 光标 的位置，这个光标是他人的光标
        for (var k in cursors){
            /// 如果 改变的末尾 在 光标之前， 则把光标位置加上一个偏移量 delta
            if (cto <= cursors[k].pos){
                cursors[k].pos += delta;
                /// cm.addWidget(pos: {line, ch}, node: Element, scrollIntoView: boolean)
                /// Puts node, which should be an absolutely positioned DOM node,
                ///     into the editor, positioned right below the given {line, ch} position.
                editor.addWidget(editor.posFromIndex(cursors[k].pos), cursors[k].element, false);
            }
            /// 如果 改变的开始位置 在 光标之后，
            else if (cfrom < cursors[k].pos) {
                cursors[k].pos = cfrom + cattext.length;
                editor.addWidget(editor.posFromIndex(cursors[k].pos), cursors[k].element, false);
            }
        }

        /// from 及 to 都是对象，比如： {ch:0, line:18}
        var bfrom = chg.from.line;
        var bto = chg.to.line;

        if (chg.text.length != (bto-bfrom+1)){
            sendbuffer();
            var req = {version:doc.version, from:cfrom, to:cto, text:cattext};
            if(q.length == 0){
                socket.emit('change', req);
            }
            q.push(req);
            var btext = "";
            for (var i = 0; i < chg.text.length; i++){
                btext += havebreakat(editor, bfrom + i);
            }
            sendbreak(bfrom, bto+1, btext);
            return;
        }
        if (chg.text.length > 1){
            buffertimeout = buffertimeout / 2;
        }
        if (bufferto == -1 && cfrom == cto &&
            (cfrom ==  bufferfrom + buffertext.length ||  bufferfrom == -1)){
            if (bufferfrom == -1){
                buffertext = cattext;
                bufferfrom = cfrom;
            }
            else {
                buffertext += cattext;
            }
            save();
            return;
        }
        else if (bufferto == -1 && chg.origin == "+delete" &&
            bufferfrom != -1 && cto == bufferfrom + buffertext.length && cfrom >= bufferfrom){
            buffertext = buffertext.substr(0, cfrom - bufferfrom);
            if (buffertext.length == 0){
                bufferfrom = -1;
                if(q.length == 0){
                    setsaved();
                }
                return;
            }
            save();
            return;
        }
        else if (chg.origin == "+delete" &&
            bufferfrom == -1){
            bufferfrom = cfrom;
            bufferto = cto;
            buffertext = "";
            save();
            return;
        }
        else if (bufferto != -1 && chg.origin == "+delete" &&
            cto == bufferfrom){
            bufferfrom = cfrom;
            save();
            return;
        }
        else if (bufferfrom != -1) {
            if (bufferto == -1){
                var req = {version:doc.version, from:bufferfrom, to:bufferfrom, text:buffertext};
                if(q.length == 0){
                    socket.emit('change', req);
                }
                q.push(req);
                buffertext = "";
                bufferfrom = -1;
            }
            else {
                var req = {version:doc.version, from:bufferfrom, to:bufferto, text:buffertext};
                if(q.length == 0){
                    socket.emit('change', req);
                }
                q.push(req);
                bufferfrom = -1;
                bufferto = -1;
            }
        }

        var req = {version:doc.version, from:cfrom, to:cto, text:cattext};
        /// 如果文本发送队列为空，则当即发送 change 消息
        if(q.length == 0){
            socket.emit('change', req);
        }
        /// 进入文本发送队列
        q.push(req);
	}
}