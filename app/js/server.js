define(['jquery'], function($) {
	var Server = function(pathList) {
		_.extend(this, Backbone.Events);

		this.pathList = pathList;
	};

	Server.prototype = {
		startupSync: function() {
			var self = this;
			$.getJSON("/gps-paths", function(data) {
				self.pathList.reset(data.map(function(path) {
                    return {name: path.name, coordinates: path.gpsCoordinates};   
				}));

				self.listenTo(self.pathList, 'add', self.sendCreatePathCommand);
				self.listenTo(self.pathList, 'change:coordinates', self.sendModifyCoordinatesCommand);
				self.listenTo(self.pathList, 'remove', self.sendRemovePathCommand);
			});
		},

		sendCreatePathCommand: function(event) {
            $.post('/gps-paths', {name: event.attributes.name, gpsCoordinates: event.attributes.coordinates});
		},

		sendModifyCoordinatesCommand: function(event) {
			console.log(event);
		},

		sendRemovePathCommand: function(event) {
            console.log(event);
		}
	};
	
	return Server;
});