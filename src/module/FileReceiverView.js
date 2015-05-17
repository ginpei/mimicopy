mimicopy.FileReceiverView = Osteoporosis.View.extend({
	initialize: function(options) {
		var $el = this.$el;

		$el.on('dragover', this.ondragover.bind(this));
		$el.on('dragleave', this.ondragleave.bind(this));
		$el.on('drop', this.ondrop.bind(this));
	},

	showDraggingOver: function() {
			this.$el[0].classList.add('is-dragover');
	},

	hideDraggingOver: function() {
			this.$el[0].classList.remove('is-dragover');
	},

	ondragover: function(event) {
		event.preventDefault();
		this.showDraggingOver();
	},

	ondragleave: function(event) {
		this.hideDraggingOver();
	},

	ondrop: function(event) {
		event.preventDefault();
		this.hideDraggingOver();
		this.files = event.dataTransfer.files;
		this.trigger('receive', this.files);
	}
});
