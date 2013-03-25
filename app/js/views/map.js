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

            this.listenTo(this.pathList, 'reset', this.render);
			this.listenTo(this.pathList, 'change', this.render);

			
			var mapOptions = {
				center: new gmaps.LatLng(0, 0),
				zoom: 2,
				mapTypeId: gmaps.MapTypeId.SATELLITE
			};
			
			this.map = new gmaps.Map(this.el, mapOptions);
		},
		
		render: function() {
			var self = this;
			
            this.clearGmapsPath();

			this.bounds = new gmaps.LatLngBounds();

			var includedPaths = self.pathList.included();
            includedPaths.forEach(function(path) {
				var gmapsPath = toGmapsCoord(path.get('coordinates'));
				gmapsPath.forEach(function(gmapsCoord) {
					self.bounds.extend(gmapsCoord);
				});
				self.gmapsPaths.push(addPath(self.map, gmapsPath, 'red'));
			});

			if (this.bounds.isEmpty()) {
                this.map.panTo(new gmaps.LatLng(0, 0));
				this.map.setZoom(2);
			} else {
				this.map.fitBounds(this.bounds);
			}

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