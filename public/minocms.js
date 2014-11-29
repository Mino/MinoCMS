function MinoCMS() {
	var cms = this;
	cms.init_path();
}

MinoCMS.prototype.init_path = function(name, callback) {
	var cms = this;
	var scripts = document.getElementsByTagName("script");
	for (var i=0; i<scripts.length; i++) {
		var script = scripts[i];
		if (script.src.indexOf('/minocms.js') != -1) {
			cms.path = script.src.replace('/minocms.js', '');
			break;
		}
	}
}

MinoCMS.prototype.get = function(name, callback) {
	var cms = this;
	var body = {
		name: name
	}

	$.post(cms.path + "/value", body, function(res) {
		callback(res);
	})
}

minocms = new MinoCMS();