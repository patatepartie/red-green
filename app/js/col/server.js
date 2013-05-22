define(['jquery'], function($) {
    var Server = function() {
        
    };
    
    Server.prototype.fetch = function() {
        return $.get('/tracks');
    };
    
    Server.prototype.push = function(store) {
        var pushingSessions = $.Deferred();
            
        store.eachSession(function(session) {
            var url = "/tracks/" + session.track + "/sessions";
            pushingSessions = $.post(url, {date: session.date, samples: session.samples})
                                .then(function() {                        
                                    store.removeSession(session); 
                                });
        });
        
        return pushingSessions;
    };
    
    return Server;
});