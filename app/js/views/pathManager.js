define(['views/path'], function(PathView) {
	var PathManagerView = Backbone.View.extend({
		el: '#pathSection',
		
		events: {
			'click #pathFile': 'clickPathFileLoader',
			'change #pathFileChooser': 'loadPathFile'
		},
		
		initialize: function(options) {
			this.pathList = options.pathList;

			this.listenTo(this.pathList, 'add', this.addOne);
			this.listenTo(this.pathList, 'reset', this.addAll);
			this.listenTo(this.pathList, 'all', this.render);

			this.pathList.fetch();
		},
		
		render: function() {
			var self = this,
				$el = $(self.el);
			
			return this;
		},

		clickPathFileLoader: function(event) {
			event.preventDefault();
				
			this.$('#pathFileChooser').click();
		},

		loadPathFile: function(loadEvent) {
			var self = this;

			var reader = new FileReader();
			reader.onload = function(readEvent) {
				var path = JSON.parse(readEvent.target.result);
				self.pathList.create({name: path.pathName, coordinates: path.gpsCoordinates});
			};

			reader.readAsText(loadEvent.target.files[0]);
		},

		addOne: function(path) {
			var view = new PathView({model: path});
			this.$("#paths").append(view.render().el);
		},

		addAll: function() {
			this.pathList.each(this.addOne, this);
		}
	});
	
	return PathManagerView;
});