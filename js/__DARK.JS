/**
 * Title: This is Dark_Mogul jQuery framework.
 * Info: This "jQuery" has Ajax and Id selecter, Welcome to Use.
 * By: Dark_Mogul.
 * Sources: https://www.github.com/sdk250/
 * 
 */
function Ajax(object) {
	if (typeof object != 'object') {console.log('Call mode Error!'); return false;};
	var xhr = new XMLHttpRequest();
	var cache = null;
	if (object.method == 'GET' || object.method == 'get' || object.method == 'post' || object.method == 'POST') {
		if (/(http\:\/\/|https\:\/\/|).*\..{2,6}/.test(object.url) == false) {console.log('URL not correct');return false;};
		if (object.method == "GET" || object.method == "get") {
			if (object.parameter) {
				cache = "";
				if (Object.keys(object.parameter).length > 1) {
					for (var i = 0; i < Object.keys(object.parameter).length; i++) {
						cache += Object.keys(object.parameter)[i] + '=' + Object.values(object.parameter)[i] + '&';
					}
				} else {
					cache += Object.keys(object.parameter)[0] + '=' + Object.values(object.parameter)[0];
				}
				if (Object.keys(object.parameter) == "") {cache = null;};
			}
			object.url += "?" + cache;
			cache = null;
		}
		xhr.open(object.method, object.url, true);
		if (object.headers) {
			if (Object.keys(object.headers).length > 1) {
				for (var i = 0; i < Object.keys(object.headers).length; i++) {
					xhr.setRequestHeader(Object.keys(object.headers)[i], Object.values(object.headers)[i]);
				}
			} else {
				xhr.setRequestHeader(Object.keys(object.headers)[0], Object.values(object.headers)[0]);
			}
		}
		xhr.onload = object.success;
		if (object.responseType) {
			xhr.responseType = object.responseType;
		}
		if (object.dataType) {
			xhr.dataType = object.dataType;
		}
		if (object.parameter) {
			cache = "";
			if (Object.keys(object.parameter).length > 1) {
				for (var i = 0; i < Object.keys(object.parameter).length; i++) {
					cache += Object.keys(object.parameter)[i] + '=' + Object.values(object.parameter)[i] + '&';
				}
			} else {
				cache += Object.keys(object.parameter)[0] + '=' + Object.values(object.parameter)[0];
			}
			if (Object.keys(object.parameter) == "") {cache = null;};
		}
		xhr.send(cache);
	} else {
		console.log('Currently only supports \'GET\' and \'POST\' method');
	}
}
function selectId(id) {
	return document.getElementById(id);
}