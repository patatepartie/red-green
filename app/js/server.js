define(['jquery'], function($) {
	var Server = function(pathList) {
		this.pathList = pathList;
	};
	
	Server.prototype = {
		startupSync: function() {
			var self = this;
			$.getJSON("/gps-paths", function(data) {
				self.pathList.reset(data);
			});
		}
	};
	
	return Server;
});