define(['text!templates/path.html'], function(template) {
	var PathView = Backbone.View.extend({
		tagName: 'li',

		template: _.template(template),
		
		events: {
			'click .toggle': 'toggleIncluded'
		},
		
		initialize: function() {
		},
		
		render: function() {
			var self = this,
				$el = $(self.el);
			
			$el.html(self.template(self.model.toJSON()));

			return self;
		},

		toggleIncluded: function() {
			this.model.toggle();
		}
	});

	return PathView;
});