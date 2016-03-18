(function(){
	'use strict';
document.getElementById('settings').addEventListener('click', function (e) {
	chrome.tabs.create({
		url: chrome.extension.getURL('setupPage.html')
	});
	window.close();
});
}());