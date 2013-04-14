requirejs.config({
	baseUrl: '/js',
	paths: {
		'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min'
	}
});

require(['app'], function(App) {
	window.redGreen = new App();
});