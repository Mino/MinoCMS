function MinoCMS() {
	var cms = this;
	cms.init_path();

	cms.requests = {};
	cms.responses = {};
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

MinoCMS.prototype.get = function(address, callback) {
	var cms = this;

	var split_by_dot = address.split(".");
	var item_route = split_by_dot[0];
	var key = split_by_dot[1];
	
	if(cms.responses[item_route]){
		callback(cms.responses[item_route]);
		return;
	}

	if(cms.requests[item_route]!==undefined){
		cms.requests[item_route].push([callback,key]);
		return;
	}

	cms.requests[item_route] = [
		[callback,key]
	];

	$.get(cms.path + "/path/"+item_route, function(res) {
		cms.responses[item_route] = res;
		for(var i = 0; i < cms.requests[item_route].length; i++){
			var callback_pair = cms.requests[item_route][i];
			var callback = callback_pair[0];
			var key = callback_pair[1];
			if(key){
				callback(res.cms_content[key]);
			} else {
				callback(res);
			}
		}
	})
};

(function($) {
    $.fn.minocms_text = function(address) {
        var element = this;
        
        minocms.get(address, function(val){
        	element.text(val);
        });

        return element;
    };
})(jQuery);

(function($) {
    $.fn.minocms_html = function(address) {
        var element = this;
        
        minocms.get(address, function(val){
        	element.html(val);
        });

        return element;
    };
})(jQuery);

minocms = new MinoCMS();