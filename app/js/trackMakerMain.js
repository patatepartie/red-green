requirejs.config({
	baseUrl: 'js',
	paths: {
		'async': 'lib/async-0.1.1',
		'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',
		'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
		'backbone': '//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min',
		'backbone.localstorage': '//cdnjs.cloudflare.com/ajax/libs/backbone-localstorage.js/1.1.0/backbone.localStorage-min',
		'text': '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.3/text',
		'gmaps': 'gmaps'
	},
	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'backbone.localstorage': ['backbone'],
		'app': ['underscore', 'backbone'],
		'config': ['underscore']
	}
});

require(['trackMakerApp', 'config'], function(TrackMakerApp) {
	window.trackMaker = new TrackMakerApp();
});