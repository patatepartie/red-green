define(function() {
	var Path = Backbone.Model.extend({
		defaults: function() {
			return {
				name: '',
				coordinates: [],
				included: true
			}
		},

		toggle: function() {
			this.save({included: !this.get('included')});
		}
	});
	
	return Path;
});