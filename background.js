chrome.runtime.onConnect.addListener(function(port) {
	if(client.user.name){
		port.postMessage({
			status:"login",
			user:client.user,
		});
	}else{
		port.postMessage({
			status:"logout",
		});
	}
	port.onMessage.addListener(function(msg) {
		if(msg.status === "login"){
			client.login(msg.server,msg.name,msg.password);
		}
		if(msg.status === "logout"){
			for(var i in user)client.user[i] = false;
		}
	});
});
var dropzone = {
	type: "panel",
  	url: "dropplace/dropplace.html",
  	width: 300,
  	height: 100,
};
var $dropzone = false
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.dragging !== undefined){
		if($dropzone){
			chrome.windows.remove($dropzone.id);
			$dropzone = false;
		}
		if(request.dragging){
			chrome.windows.create(dropzone,function(w){
				$dropzone = w;
			});
		}
	}
	if(request.drop !== undefined){
		client.link.add(request.drop).catch();
	}
	if(request.page){
		chrome.tabs.create({ url: "page/page.html" });
	}
})
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request);
	if(request.broadcast){
		try{
			chrome.tabs.query({}, function(tabs) {
				for(var i of tabs)chrome.tabs.sendMessage(i.id, request,function(response) {});
			});
		}catch(e){};
		chrome.runtime.sendMessage(request, function(response) {});
	}
	sendResponse();
});