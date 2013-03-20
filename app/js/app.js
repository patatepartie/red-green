define([
	'jquery',
	'views/pathManager',
	'views/map',
	'collections/pathList'
	],
	
	function($, PathManagerView, MapView, PathList) {
		var App = function() {
			var self = this;

			self.collections.pathList = new PathList();

			self.views.pathManager = new PathManagerView({pathList: self.collections.pathList});
			self.views.pathManager.render();

			self.views.map = new MapView();
			self.views.map.render();
		};
	
		App.prototype = {
				views: {},
				collections: {}
		};
	
		return App;
	}
);
