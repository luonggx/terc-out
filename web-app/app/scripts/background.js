'use strict';
/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function () {

	chrome.system.display.getInfo(function(displayInfo) {
		//console.log(displayInfo);

		for (var i = 0; i < displayInfo.length; i++) {
			var current = displayInfo[i] || {};
			var windowId = current.isPrimary ?  'primry' : 'displayWall_'+i;
			var context  = current.isPrimary ? 'touch'  : 'viewer';
			var path = '../index.html#/'+context+'/photography';

			chrome.app.window.create(path, {
				id: windowId,
				frame: 'none',
				resizable: false,
				innerBounds: current.bounds
			});
		}
	});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	sendResponse({respStatus: request.updatePath + ' is received'});

	// TODO: handling the display screen window(s)
	// there are multiple monitors that will produce more than one window
	var viewerWindow = chrome.app.window.get('displayWall_1');
	viewerWindow.contentWindow.location.hash = request.updatePath;
});
