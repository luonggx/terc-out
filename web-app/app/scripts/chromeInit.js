'use strict';

chrome.app.runtime.onLaunched.addListener(function (launchData) {
	console.log(launchData);

	chrome.system.display.getInfo(function(displayInfo) {
		console.log(displayInfo);

		for (var i = 0; i < displayInfo.length; i++) {
			var current = displayInfo[i] || {};
			var context  = current.isPrimary ? 'touch'  : 'viewer';
			var windowId = current.isPrimary ?  'primry' : 'displayWall_'+i;

			var path = context === 'viewer' ? 'viewer.html' : 'index.html#/touch/photography';

			createWindows(i, current, windowId, path);
		}
	});

	function createWindows(i, current, windowId, path){
		chrome.app.window.create(path, {
			id: windowId,
			frame: 'none',
			resizable: false,
			innerBounds: current.bounds
		}, function(createdWindow){
			console.log(createdWindow);
			if(createdWindow.id === 'primry'){
				createdWindow.outerBounds.setPosition(0, 0);
				createdWindow.outerBounds.setSize(1920,1080);createdWindow.focus();
			}
			else if(createdWindow.id === 'displayWall_1'){
				createdWindow.outerBounds.setPosition(-509,-1918);
				createdWindow.outerBounds.setSize(3240,1918);
			}
		});
	}

	chrome.runtime.onMessage.addListener(function(request){
		var viewerWindow = chrome.app.window.get('displayWall_1');
		var webviewElem = viewerWindow.contentWindow.document.getElementById('webviewer');
		webviewElem.src = ('http://mof.exhibits.winonearth.com/index.html#' + request.updatePath);
		webviewElem.reload();
	});
});
