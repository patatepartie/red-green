requirejs.config({
	baseUrl: 'js',
	paths: {
		'cordova': 'libs/cordova-2.5.0',
		'jquery': 'libs/jquery-1.9.1.min'
	}
});

require(['recorderApp'], function(RecorderApp) {
	window.recorder = new RecorderApp();
});