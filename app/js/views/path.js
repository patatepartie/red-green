define([], function() {
	var PathView = Backbone.View.extend({
		tagName: 'li',
		
		events: {
		},
		
		initialize: function() {
		},
		
		render: function() {
			var self = this,
				$el = $(self.el);
			
			$el.html(self.model.get('name'));

			return self;
		}
	});

	return PathView;
});