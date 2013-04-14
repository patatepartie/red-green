define([], function() {
    var Store = function() {
            
    };
    
    Store.prototype.isNew = function () {
        return true;
    };
    
    Store.prototype.isEmpty = function () {
        return true;
    };
    
    Store.prototype.hasCurrentSession = function () {
        
    };
    
    Store.prototype.persistCurrentSession = function () {
        
    };
    
    Store.prototype.currentEventChanged = function () {
        
    };
    
    Store.prototype.hasPersistedSessions = function () {
        return true;
    };
    
    return Store;
});