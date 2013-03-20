define(['gmaps'], function(gmaps) {
	function toGmapsCoord(gpsCoords) {
		return gpsCoords.map(function(gpsCoord) {
			return new gmaps.LatLng(gpsCoord.lat, gpsCoord.lng);
		});
	};

	function addPath(map, coords, color) {
		var path = new gmaps.Polyline({
			path: coords,
			strokeColor: color,
			strokeOpacity: 1.0,
			strokeWeight: 2
		});

		path.setMap(map);

		return path;
	};

	var MapView = Backbone.View.extend({
		el: '#map',
		
		events: {
		},
		
		initialize: function(options) {
			this.gmapsPaths = [];

			this.pathList = options.pathList;

			this.listenTo(this.pathList, 'change', this.render);

			
			var mapOptions = {
				center: new gmaps.LatLng(35.393795,140.089604),
				zoom: 17,
				mapTypeId: gmaps.MapTypeId.SATELLITE
			};
			
			this.map = new gmaps.Map(this.el, mapOptions);
		},
		
		render: function() {
			var self = this;
			
			this.clearGmapsPath();

			self.pathList.included().forEach(function(path) {
				var gmapsPath = toGmapsCoord(path.get('coordinates'));
				self.gmapsPaths.push(addPath(self.map, gmapsPath, 'red'));
			});

			return this;
		},

		clearGmapsPath: function() {
			this.gmapsPaths.forEach(function(gmapsPath) {
				gmapsPath.setMap(null);
			});

			this.gmapsPaths = [];
		}
	});
	
	return MapView;
});