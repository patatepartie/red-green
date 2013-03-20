define(['jquery'], function($) {
	var Server = function(pathList) {
		_.extend(this, Backbone.Events);

		this.pathList = pathList;

		this.listenTo(this.pathList, 'change', this.pushChanges());
	};

	_.extend()
	
	Server.prototype = {
		startupSync: function() {
			var self = this;
			$.getJSON("/gps-paths", function(data) {
				self.pathList.reset(data);
			});
		},

		pushChanges: function() {
			console.log("changes occured");
		}
	};
	
	return Server;
});