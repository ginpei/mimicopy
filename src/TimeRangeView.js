window.mimicopy.TimeRangeView = Osteoporosis.View.extend({
	initialize: function(options) {
		this.attrName = options.attrName;
		this.track = options.track;
		this.$el.on('change', this.onchange.bind(this));
	},

	onchange: function(event) {
		event.preventDefault();
		var attr = {};
		attr[this.attrName] = Number(this.$el.val());
		this.track.set(attr);
	},

	updateMax: function(value) { this.$el.prop('max', value); },
	updateValue: function(value) { this.$el.val(value); }
});
