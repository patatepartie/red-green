define([
    'jquery',
    'col/store'
	],
	
	function($, Store) {
		var App = function() {
			var self = this;
            self.store = new Store();
            self.supports = {
                geolocation: true,
                acceleration: true,
                orientation: true
            };
            self.watches = {};
                        
            $(function() {
                if (!navigator) {
                    $('#main').html("This navigator doesn't support sensors");
                } else {
                    if (!navigator.geolocation) {
                        $('#geo').html("No geolocalisation support");
                        $('#geo').addClass("warning");
                        self.supports.geolocation = false;
                    }
                    if (!window.DeviceMotionEvent) {
                        $('#accel').html("No acceleration sensor");
                        $('#accel').addClass("warning");
                        self.supports.acceleration = false;
                    }
                    if (!window.DeviceOrientationEvent) {
                        $('#orient').html("No orientation sensor");
                        $('#orient').addClass("warning");
                        self.supports.orientation = false;
                    }
                }
                
                $('#stop').hide();
            
                if (self.store.isNew()) {
                    $('#start').attr("disabled", "disabled");
                } else {
                    $('#track').val(self.store.getCurrentTrack());
                    $('#start').removeAttr("disabled");                    
                }
                
                if (self.store.hasCurrentSession()) {
                    self.store.persistCurrentSession();
                }
                
                if (self.store.isEmpty()) {
                    $('#push').attr("disabled", "disabled");
                } else {
                    $('#push').removeAttr("disabled");
                }
                
                $('#change').click(function(event) {
                    var trackName = $('#track').val();
                    if (trackName) {
                        self.store.currentTrackChanged(trackName);
                        $('#start').removeAttr("disabled");
                    }
                });
                
                if (self.supports.acceleration) {
                    window.addEventListener('devicemotion', function(event) {
                        if (self.watches.acceleration) {
                            $('#accel .update').html(new Date().getTime());
                        }
                    });
                }
                
                if (self.supports.orientation) {
                    window.addEventListener('deviceorientation', function(event) {
                        if (self.watches.orientation) {
                            $('#orient .update').html(new Date().getTime());
                        }
                    });
                }
                        
                $('#start').click(function(event) {
                    $('#start').hide();
                    $('#stop').show();
                    $('#push').attr("disabled", "disabled");
                    $('#change').attr("disabled", "disabled");
                    
                    self.store.startSession();
                    
                    if (self.supports.geolocation) {
                        self.watches.position = navigator.geolocation.watchPosition(function(position) {
                            $('#geo').html('<span><b>Position</b> updated: </span><span class="update">n/a</span><span> accuracy: </span><span class="accuracy">n/a</span>');
                            $('#geo .update').html(position.timestamp);
                            $('#geo .accuracy').html(position.coords.accuracy);
                        }, function(error) {
                            $('#geo').html(JSON.stringify(error));
                        }, {enableHighAccuracy: true});    
                    }
                    
                    if (self.supports.acceleration) {
                        self.watches.acceleration = true;
                    }
                    
                    if (self.supports.orientation) {
                        self.watches.orientation = true;
                    }
                });
                
                $('#stop').click(function(event) {
                    $('#start').show();
                    $('#stop').hide();
                    $('#change').removeAttr("disabled");
                    $('#push').attr("disabled", "disabled");
                    
                    if (self.watches.position) {
                        navigator.geolocation.clearWatch(self.watches.position);
                    }
                    
                    if (self.watches.acceleration) {
                        self.watches.acceleration = false;
                    }
                    
                    if (self.watches.orientation) {
                        self.watches.orientation = false;
                    }
                    
                    if (self.store.hasCurrentSession()) {
                        self.store.persistCurrentSession();
                    }
                    
                    if (self.store.hasPersistedSessions()) {
                        $('#push').removeAttr("disabled");
                    }
                });
                
                $('#push').click(function(event) {
                    $('#push').attr("disabled", "disabled");     
                    self.store.emptyPersistedSessions();
                });    
            });
		};
	
		App.prototype = {
		};
	
		return App;
	}
);
