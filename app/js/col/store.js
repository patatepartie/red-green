define([], function() {
    var Store = function() {
        if(!localStorage.persistedSessions) {
            localStorage.persistedSessions = JSON.stringify([]);
        }
    };
    
    Store.prototype.isNew = function () {
        return !localStorage.currentTrack;
    };
    
    Store.prototype.isEmpty = function () {
        return JSON.parse(localStorage.persistedSessions).length === 0;
    };
    
    Store.prototype.getCurrentTrack = function () {
        return JSON.parse(localStorage.currentTrack);
    };
    
    Store.prototype.currentTrackChanged = function (newName) {
        localStorage.currentTrack = JSON.stringify({name: newName, lastSessionId: -1});
    };
    
    Store.prototype.startSession = function () {
        var track = JSON.parse(localStorage.currentTrack);
        track.lastSessionId++;
        localStorage.currentTrack = JSON.stringify(track);
    };
        
    Store.prototype.hasPersistedSessions = function () {
        return localStorage.persistedSessions;
    };
    
    Store.prototype.persistCurrentSession = function (currentSession) {
        var persistedSessions = JSON.parse(localStorage.persistedSessions);
        persistedSessions.push(currentSession);
        localStorage.persistedSessions = JSON.stringify(persistedSessions);
    };
    
    Store.prototype.emptyPersistedSessions = function () {
        localStorage.persistedSessions = JSON.stringify([]);
    };
    
    return Store;
});