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

	mimicopy.PlayerView = O.View.extend({
		initialize: function(options) {
			var track = this.track = options.track;
			this._setupTimeFrom(track);
			this._setupCurrentTime(track);
			this._setupTimeTo(track);

			this.$durationText = this.$('.js-durationText');
			track.on('change:duration', function(track, value) {
				this.$durationText.html(this.timeText(value));
			}.bind(this));

			this.$timeFromText = this.$('.js-timeFromText');
			track.on('change:timeFrom', function(track, value) {
				this.$timeFromText.html(this.timeText(value));
			}.bind(this));

			this.$currentTimeText = this.$('.js-currentTimeText');
			track.on('change:currentTime', function(track, value) {
				this.$currentTimeText.html(this.timeText(value));
			}.bind(this));

			this.$timeToText = this.$('.js-timeToText');
			track.on('change:timeTo', function(track, value) {
				this.$timeToText.html(this.timeText(value));
			}.bind(this));
		},

		_setupTimeFrom: function(track) {
			var vTimeFrom = this.vTimeFrom = new mimicopy.TimeRangeView({
				attrName: 'timeFrom',
				el: this.$('.js-timeFrom'),
				track: track
			});

			this.connect(track, 'duration', vTimeFrom, 'max');
			this.connect(track, 'timeFrom', vTimeFrom, 'value');
		},

		_setupCurrentTime: function(track) {
			var vCurrentTime = this.vCurrentTime = new mimicopy.TimeRangeView({
				attrName: 'currentTime',
				el: this.$('.js-currentTime'),
				track: track
			});

			this.connect(track, 'duration', vCurrentTime, 'max');
			this.connect(track, 'currentTime', vCurrentTime, 'value');
		},

		_setupTimeTo: function(track) {
			var vTimeTo = this.vTimeTo = new mimicopy.TimeRangeView({
				attrName: 'timeTo',
				el: this.$('.js-timeTo'),
				track: track
			});

			this.connect(track, 'duration', vTimeTo, 'max');
			this.connect(track, 'timeTo', vTimeTo, 'value');
		},

		timeText: function(time) {
			var min = parseInt(time/60, 10);
			var sec = ('0' + parseInt(time%60, 10)).slice(-2);
			var msec = ('000' + ((time*1000 - parseInt(time, 10)*1000)/1000)).slice(-3);
			var text = min + ':' + sec + '.' + msec;
			return text;
		},

		connect: function(model, attrName, view, valueName) {
			var funcName = 'update' + valueName[0].toUpperCase() + valueName.slice(1);
			if (funcName in view) {
				model.on('change:' + attrName, function(model, value) {
					view[funcName](value);
				});
			}
			else {
				throw new Error('view.' + funcName + ' is not defined.');
			}
		}
	});

	mimicopy.Track = O.Model.extend({
		beforeFilter: function(attr) {
			if ('currentTime' in attr || 'timeFrom' in attr || 'timeTo' in attr) {
				this._currentTimeFilter(attr);
			}
		},

		_currentTimeFilter: function(attr) {
			var time = this.getTimeAttributes(attr);
			if (time.current < time.from || time.to < time.current) {
				this.attributes.currentTime = null;
				attr.currentTime = time.from;
			}
		},

		getTimeAttributes: function(attr) {
			var curAttr = this.attributes;
			var time = {
				current: ('currentTime' in attr ? attr : curAttr).currentTime,
				from: ('timeFrom' in attr ? attr : curAttr).timeFrom,
				to: ('timeTo' in attr ? attr : curAttr).timeTo
			};
			return time;
		}
	});

	mimicopy.TimeRangeView = O.View.extend({
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

	mimicopy.autorun();
})(window, document, gQuery, Osteoporosis);
