define(['gmaps'], function(gmaps) {
	var MapView = Backbone.View.extend({
		el: '#map',
		
		events: {
		},
		
		initialize: function(options) {
			this.models = options.models;
		},
		
		render: function() {
			var self = this,
				$el = $(self.el);
			
			var mapOptions = {
				center: new gmaps.LatLng(35.393795,140.089604),
				zoom: 17,
				mapTypeId: gmaps.MapTypeId.SATELLITE
			};
			
			self.map = new gmaps.Map($el.get(0), mapOptions);

			return this;
		}
	});
	
	return MapView;
});