requirejs.config({
	baseUrl: '/js',
	paths: {
		'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',
        'moment': '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.0.0/moment.min'
	}
});

require(['col/app'], function(App) {
	window.collector = new App();
});