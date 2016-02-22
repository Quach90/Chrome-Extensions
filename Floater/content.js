console.log('content.js version: 3');

// content.js
chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {
		console.log('Start Floating');

		var elements = $('a');

		elements.push.apply(elements, $('img'));
		elements.push.apply(elements, $('button'));

		var i = 0;
		var length = elements.length;
		var interval = setInterval(timer, 100);
		function timer() {
			$(elements[i]).jqFloat()
			i++;
			if(i > length){
				abortTimer();
			}
		}
		function abortTimer() {
			clearInterval(interval);
		}
	}
	);
