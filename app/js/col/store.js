define([], function() {
    var Store = function() {
        if(!localStorage.persistedSessions) {
            localStorage.persistedSessions = JSON.stringify([]);
            localStorage.currentTrack = "-1";
        }
    };
    
    Store.prototype.isEmpty = function () {
        return JSON.parse(localStorage.persistedSessions).length === 0;
    };
    
    Store.prototype.getCurrentTrack = function () {
        return localStorage.currentTrack;
    };
    
    Store.prototype.currentTrackChanged = function (newName) {
        localStorage.currentTrack = newName;
    };
    
    Store.prototype.hasPersistedSessions = function () {
        return localStorage.persistedSessions;
    };
    
    Store.prototype.persistCurrentSession = function (currentSession) {
        var persistedSessions = JSON.parse(localStorage.persistedSessions);
        persistedSessions.push(currentSession);
        localStorage.persistedSessions = JSON.stringify(persistedSessions);
    };
    
    Store.prototype.eachSession = function (iter) {
        var persistedSessions = JSON.parse(localStorage.persistedSessions);
        persistedSessions.forEach(iter);
    };
    
    Store.prototype.removeSession = function (sessionToRemove) {
        var persistedSessions = JSON.parse(localStorage.persistedSessions);
        var newSessions = persistedSessions.filter(function(session) {
            return !(session.key === sessionToRemove.key && session.track === sessionToRemove.track);
        });
        localStorage.persistedSessions = JSON.stringify(newSessions);
    };
    
    return Store;
});