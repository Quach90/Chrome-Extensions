var calenderList;
var redirectList = [];
var defaultUrl;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.command == "saveCal"){
		var list = request.list;
		console.log(list);
		calenderList = list;
		updateRedirectList();
		saveCalendar(list);
	}
	if(request.command == "saveDefault"){
		defaultUrl = request.url;
		saveDefault(defaultUrl);
	}
	if(request.command == "getDefault"){
		sendResponse({url: defaultUrl});
	}
	if(request.command == "getCal"){
		sendResponse({calenderList: calenderList});
	}
	if(request.command == "redirect"){
		redirect(sender.tab.id);
	}
});

function updateRedirectList(){
	redirectList = [[],[],[],[],[],[],[]];
	$(calenderList).each(function(index, val){
				var object = $.parseJSON(val);
				console.log(object);
				var day = Number(object.dow);
				console.log(day);
				redirectList[day].push(object);
			})
}

function redirect(id){
	var day = new Date().getDay();
	switch(day) {
		case 0:
		console.log("Sunday");
		callRedirect(day, id);
		break;
		case 1:
		console.log("Monday");
		callRedirect(day, id);
		break;
		case 2:
		console.log("Tuesday");
		callRedirect(day, id);
		break;
		case 3:
		console.log("Wednesday");
		callRedirect(day, id);
		break;
		case 4:
		console.log("Thursday");
		callRedirect(day, id);
		break;
		case 5:
		console.log("Friday");
		callRedirect(day, id);
		break;
		case 6:
		console.log("Saturday");
		callRedirect(day, id);
		break;
	}
}

function callRedirect(day, id){
	var hour = new Date().getHours();
	var minutes = new Date().getMinutes();
	var redirected = false;
	$(redirectList[day]).each(function(index, val){
		console.log(id);
			var startSplit = val.start.split(':');
			var endSplit = val.end.split(':');
			var startHour = Number(startSplit[0]);
			var startMin = Number(startSplit[1]);
			var endHour = Number(endSplit[0]);
			var endMin = Number(endSplit[0]);
			if(startHour <= hour && hour < endHour){
				console.log("Tried to redirectList");
				if(redirected){
					chrome.tabs.create({
						url: addhttp(val.url)
					});
				}else{
					chrome.tabs.update(id, {url: addhttp(val.url)});
				}
				redirected = true;
			} else if(startHour <= hour && hour <= endHour && minutes <= endMin){
				console.log("Tried to redirectList");
				if(redirected){
					chrome.tabs.create({
						url: addhttp(val.url)
					});
				}else{
					chrome.tabs.update(id, {url: addhttp(val.url)});
				}
				redirected = true;
			}
		})
	if(!redirected){
	chrome.tabs.update(id, {url: addhttp(defaultUrl)});
	}
}

function addhttp(url) {
   if (!/^(f|ht)tps?:\/\//i.test(url)) {
      url = "http://" + url;
   }
   return url;
}

function saveCalendar(calenderList) {

        chrome.storage.sync.set({'calenderList': calenderList}, function() {

          console.log('Calendar saved');
      });
    };

function getCalendar() {

    chrome.storage.sync.get('calenderList', function(items) {

      if (!chrome.runtime.error) {
      	calenderList = items.calenderList;
      	updateRedirectList();
      	console.log('Calendar retrieved');
      }else{
      	calenderList = [];
      	console.log('No Calendar found - saved empty');
      }
      
  });
};

function saveDefault(url) {

        chrome.storage.sync.set({'defaultUrl': url}, function() {

          console.log('Url saved');
      });
    };

function getDefault() {

    chrome.storage.sync.get('defaultUrl', function(items) {

      if (!chrome.runtime.error) {
      	defaultUrl = items.defaultUrl;
      	console.log('Url retrieved');
      }else{
      	defaultUrl = "";
      	console.log('No URL found - saved empty');
      }
      
  });
};

getCalendar();
getDefault();