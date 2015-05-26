window.mimicopy.FileListView = Osteoporosis.View.extend({
	add: function(file) {
		var $file = this._renderOne(file);
		this.$el[0].appendChild($file[0]);
	},

	_renderOne: function(file) {
		var title = file.get('name');

		var className = 'soundList-item';
		if (file.isSupported()) {
			className += ' is-supported';
		}

		var html = '<li class="' + className + '">' + this._e(title) + '</li>';
		var $el = $(html);
		$el.on('click', function(event) {
			this.trigger('selectitem', file);
		}.bind(this));
		return $el;
	}
});
