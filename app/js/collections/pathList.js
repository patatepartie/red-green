define(['models/path', 'backbone.localstorage'], function(Path) {
	var PathList = Backbone.Collection.extend({
		model: Path,
		localStorage: new Backbone.LocalStorage("paths"),

		included: function() {
			return this.filter(function(path) {
				return path.get('included');
			});
		},

		findByName: function(name) {
			return this.filter(function(path) {
				return path.get('name') === name;
			});	
		},

		containsPathNamed: function(name) {
			return this.findByName(name).length > 0;
		},

		addPath: function(name, coordinates) {
			this.create({name: name, coordinates: coordinates});
		},

		updateCoordinates: function(name, coordinates) {
			this.findByName(name).forEach(function(path) {
				path.save({coordinates: coordinates});
			});
		}
	});
	
	return PathList;
});