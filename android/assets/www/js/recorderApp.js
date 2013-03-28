define([ 'jquery', 'logger', 'cordova' ], function($, Logger) {
	var App = function() {
		var self = this;
		var log = new Logger('red-green/logs');
		
		document.addEventListener('deviceready', function() {
			$('#stop').hide();

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
				log.prepare(fileSystem, function(filename) {
					$('#fileName').value = filename;
					
					$('#change').click(function(event) {
						var fileName = $('#fileName').value;
		                log.changeFile(fileName);
					});
					
					$('#start').click(function(event) {
						$('#start').hide();
						$('#stop').unhide();
					});
					
					$('#stop').click(function(event) {
						$('#stop').hide();
						$('#start').unhide();
					});
				});
			}, function(error) {
				console.error("Error when requesting file system %O", error);
			});
		}, false);

//		var watchID = null;
//
//		function gotFS(fisleSystem) {
//			fileSystem.root.getFile("geoposition.txt", {
//				create : true,
//				exclusive : false
//			}, gotFileEntry, fail);
//		}
//
//		function gotFileEntry(fileEntry) {
//			fileEntry.createWriter(gotFileWriter, fail);
//		}
//
//		function gotFileWriter(writer) {
//			// Get the most accurate position updates available on the
//			// device.
//			watchID = navigator.geolocation.watchPosition(function(position) {
//				var element = document.getElementById('geolocation');
//				element.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />' + 'Longitude: '
//						+ position.coords.longitude + '<br />' + 'Heading: ' + position.coords.heading + '<br />'
//						+ 'Speed: ' + position.coords.speed + '<br />' + '<hr />' + element.innerHTML;
//				writer.seek(writer.length);
//				writer.write(position.coords.latitude + "," + position.coords.longitude + "," + position.coords.heading
//						+ "," + position.coords.speed + '\n');
//			}, function(error) {
//				var element = document.getElementById('geolocation');
//				element.innerHTML = 'Error code: ' + error.code + '<br />' + 'Error message: ' + error.message
//						+ '<br />' + '<hr />' + element.innerHTML;
//				writer.seek(writer.length);
//				writer.write(error.code + ': ' + error.message + '\n');
//			}, {
//				enableHighAccuracy : true
//			});
//		}
//
//		// clear the watch that was started earlier
//		// 
//		function clearWatch() {
//			if (watchID != null) {
//				navigator.geolocation.clearWatch(watchID);
//				watchID = null;
//			}
//		}
//
//		function fail(error) {
//			console.log(error.code);
//		}
	};

	App.prototype = {};

	return App;
});
