define([
	'jquery',
	'views/pathManager',
	'views/map'
	],
	
	function($, PathManagerView, MapView) {
		var App = function() {
			var self = this;

			self.views.pathManager = new PathManagerView();
			self.views.pathManager.render();

			self.views.map = new MapView({models: self.models});
			self.views.map.render();
		};
	
		App.prototype = {
				views: {},
				collections: {},
				models: {}
		};
	
		return App;
	}
);
