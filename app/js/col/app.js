define([
    'jquery',
    'col/store',
    'col/server',
    'moment'
	],
	
	function($, Store, Server, moment) {
		var App = function() {
			var self = this;
            
            self.store = new Store();
            self.server = new Server();
            
            self.supports = {
                geolocation: true,
                acceleration: true,
                orientation: true
            };
            self.watches = {};
                        
            $(function() {
                if (!navigator) {
                    $('#error').html("This navigator doesn't support sensors");
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
                
                $('#start').attr("disabled", "disabled");
                $('#tracks').attr("disabled", "disabled");
                $('#stop').hide();
            
                self.server.fetch()
                .done(function(tracks) {
                    tracks.forEach(function(track) {
                        $("#tracks").append('<option value="' + track.key + '">' + track.name + '</option>');
                    });
                    
                    $('#tracks').removeAttr("disabled");
                    $('#tracks option[value="' + self.store.getCurrentTrack() + '"]').attr('selected', true);
                    $('#tracks').val(self.store.getCurrentTrack()).change();
                })
                .fail(function() {
                    $('#error').html("Cannot fetch tracks from the server");
                    
                    $('#tracks').attr("disabled", "disabled");
                });
                
                $('#tracks').change(function() {
                    console.log("selection changed");
                    var trackKey = $('#tracks option:selected').val();
                    if (trackKey === "-1") {
                        $('#start').attr("disabled", "disabled");
                    } else {
                        self.store.currentTrackChanged(trackKey);
                        $('#start').removeAttr("disabled");
                    }
                });
                                
                if (self.store.isEmpty()) {
                    $('#push').attr("disabled", "disabled");
                } else {
                    $('#push').removeAttr("disabled");
                }
                
                if (self.supports.acceleration) {
                    window.addEventListener('devicemotion', function(event) {
                        if (self.watches.acceleration) {
                            $('#accel .update').html(new Date().getTime());
                            self.sampleCollected({
                                type: 'acceleration', 
                                timestamp: new Date().getTime(),
                                acceleration: event.acceleration,
                                accelerationIncludingGravity: event.accelerationIncludingGravity,
                                rotationRate: event.rotationRate,
                                interval: event.interval                                
                            });
                        }
                    });
                }
                
                if (self.supports.orientation) {
                    window.addEventListener('deviceorientation', function(event) {
                        if (self.watches.orientation) {
                            $('#orient .update').html(new Date().getTime());
                            self.sampleCollected({
                                type: 'orientation', 
                                timestamp: new Date().getTime(),
                                alpha: event.alpha,
                                beta: event.beta,
                                gamma: event.gamma,
                                absolute: event.absolute                                
                            });
                        }
                    });
                }
                        
                $('#start').click(function(event) {
                    $('#start').hide();
                    $('#stop').show();
                    $('#push').attr("disabled", "disabled");
                    $('#tracks').attr("disabled", "disabled");
                    
                    self.startSession();
                    
                    if (self.supports.geolocation) {
                        self.watches.position = navigator.geolocation.watchPosition(function(position) {
                            $('#geo').html('<span><b>Position</b> updated: </span><span class="update">n/a</span><span> accuracy: </span><span class="accuracy">n/a</span>');
                            $('#geo .update').html(position.timestamp);
                            $('#geo .accuracy').html(position.coords.accuracy);
                            
                            self.sampleCollected({
                                type: 'acceleration', 
                                timestamp: position.timestamp,
                                coordinates: event.coords                               
                            });
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
                    $('#tracks').removeAttr("disabled");
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
                    
                    self.stopSession();
                    
                    if (self.store.hasPersistedSessions()) {
                        $('#push').removeAttr("disabled");
                    }
                });
                
                $('#push').click(function(event) {
                    $('#error').hide();
                    $('#push').attr("disabled", "disabled");
                    
                    self.server.push(self.store)
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        $('#push').removeAttr("disabled");
                        $('#error').html(JSON.stringify({textStatus: textStatus, errorThrown: errorThrown}));
                        $('#error').show();
                    });
                });    
            });
		};
	
		App.prototype = {
            startSession: function () {
                this.currentSession = {
                    date: moment().format("DDMMYYYYHHmm"),
                    track: this.store.getCurrentTrack(),                    
                    samples: []
                };
            },
            
            sampleCollected: function(sample) {
                this.currentSession.samples.push(sample);
            },
            
            stopSession: function () {
                this.store.persistCurrentSession(this.currentSession);
            }
		};
	
		return App;
	}
);
