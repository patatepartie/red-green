define([], function() {
	var PathManagerView = Backbone.View.extend({
		el: '#pathSection',
		
		events: {
			'click #pathFile': 'clickPathFileLoader',
			'click #pathFileChooser': 'loadPathFile'
		},
		
		initialize: function() {
		},
		
		render: function() {
			var self = this,
				$el = $(self.el);
			
			

			return this;
		},

		clickPathFileLoader: function(event) {
			var self = this,
				$el = $(self.el);

			event.preventDefault();
				
			$el.find('#pathFileChooser').click();
		},

		loadPathFile: function(event) {
			var pathFile = event.target.files[0];
			console.log(event);
		}
	});
	
	return PathManagerView;
});