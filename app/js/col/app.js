define([
    'jquery',
    'col/store'
	],
	
	function($, Store) {
		var App = function() {
			var self = this;
            self.store = new Store();
            
            $('#stop').hide();
            
            if (self.store.isNew()) {
                $('#start').attr("disabled", "disabled");
            } else {
                $('#event').val(self.store.getCurrentEvent());
            }
            
            if (self.store.hasCurrentSession()) {
                self.store.persistCurrentSession();
            }
            
            if (self.store.isEmpty()) {
                $('#push').attr("disabled", "disabled");
            }
            
            $('change').click(function(event) {
                var eventName = $('#event').val();
                if (eventName) {
                    self.store.currentEventChanged(eventName);
                }
            });
            
            $('start').click(function(event) {
                $('start').hide();
                $('stop').show();
                $('#push').attr("disabled", "disabled");
            });
            
            $('stop').click(function(event) {
                $('start').show();
                $('stop').hide();
                $('#push').attr("disabled", "disabled");
                
                if (self.store.hasCurrentSession()) {
                    self.store.persistCurrentSession();
                }
                
                if (self.store.hasPersistedSessions()) {
                    $('#push').removeAtter("disabled");
                }
            });
            
            $('push').click(function(event) {
                $('#push').attr("disabled", "disabled");
            });
		};
	
		App.prototype = {
		};
	
		return App;
	}
);
