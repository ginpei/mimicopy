(function(window, document, $, O) {
	O.Model.prototype.beforeFilter = function() { /* noop */ };
	O.Model.prototype._setAttributes = O.Model.prototype.set;
	O.Model.prototype.set = function(attr) {
		if (attr) {
			this.beforeFilter(attr);
		}
		return this._setAttributes(attr);
	};

	var mimicopy = window.mimicopy = {
		autorun: function() {
			$(document).on('DOMContentLoaded', function(event) {
				this.setup();
			}.bind(this));
		},

		setup: function() {
			var track = this.track = new this.Track();
			this.vPlayer = new this.PlayerView({
				el: this.$('.js-player'),
				track:track
			});
		},

		$: function(selector) {
			return $(selector);
		}
	};

	mimicopy.autorun();
})(window, document, gQuery, Osteoporosis);
