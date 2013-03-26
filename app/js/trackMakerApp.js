define([
	'jquery',
	'views/pathManager',
	'views/map',
	'collections/pathList',
	'server',
	'config'
	],
	
	function($, PathManagerView, MapView, PathList, Server) {
		var App = function() {
			var self = this;

			self.collections.pathList = new PathList();

			self.views.pathManager = new PathManagerView({pathList: self.collections.pathList});
			self.views.pathManager.render();

			self.views.map = new MapView({pathList: self.collections.pathList});
			self.views.map.render();
			
			self.server = new Server(self.collections.pathList);
			self.server.startupSync();
		};
	
		App.prototype = {
				views: {},
				collections: {}
		};
	
		return App;
	}
);
