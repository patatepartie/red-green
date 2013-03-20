define(['models/path', 'backbone.localstorage'], function(Path) {
	var PathList = Backbone.Collection.extend({
		model: Path,
		localStorage: new Backbone.LocalStorage("paths"),

		included: function() {
			return this.filter(function(path) {
				return path.get('included');
			});
		}
	});
	
	return PathList;
});