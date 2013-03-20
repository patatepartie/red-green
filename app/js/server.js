define(['jquery'], function($) {
	var Server = function(pathList) {
		_.extend(this, Backbone.Events);

		this.pathList = pathList;
	};

	Server.prototype = {
		startupSync: function() {
			var self = this;
			$.getJSON("/gps-paths", function(data) {
				self.pathList.reset(data);

				self.listenTo(self.pathList, 'add', self.sendCreatePathCommand());
				self.listenTo(self.pathList, 'change', self.sendModifyCoordinatesCommand());
				self.listenTo(self.pathList, 'remove', self.sendRemovePathCommand());
			});
		},

		sendCreatePathCommand: function(event) {
			console.log(event);
		},

		sendModifyCoordinatesCommand: function(event) {
			console.log(event);
		},

		sendRemovePathCommand: function(event) {

		}
	};
	
	return Server;
});