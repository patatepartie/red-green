define([
    'jquery',
    'col/store'
	],
	
	function($, Store) {
		var App = function() {
			var self = this;
            self.store = new Store();

            $(function() {
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
                
                $('#start').click(function(event) {
                    $('#start').hide();
                    $('#stop').show();
                    $('#push').attr("disabled", "disabled");
                    $('#change').attr("disabled", "disabled");
                    
                    self.store.startSession();
                });
                
                $('#stop').click(function(event) {
                    $('#start').show();
                    $('#stop').hide();
                    $('#change').removeAttr("disabled");
                    $('#push').attr("disabled", "disabled");
                    
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
