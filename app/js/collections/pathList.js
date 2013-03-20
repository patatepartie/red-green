define(['models/path', 'backbone.localstorage'], function(Path) {
	var PathList = Backbone.Collection.extend({
		model: Path,
		localStorage: new Backbone.LocalStorage("paths"),
	});
	
	return PathList;
});