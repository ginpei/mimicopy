window.mimicopy.PlayerView = Osteoporosis.View.extend({
	initialize: function(options) {
		var track = this.track = options.track;
		this._setupTimeFrom(track);
		this._setupCurrentTime(track);
		this._setupTimeTo(track);

		this._connectTimeText('duration');
		this._connectTimeText('timeFrom');
		this._connectTimeText('currentTime');
		this._connectTimeText('timeTo');
		track.on('change:volume', this.onchangeTrackVolume.bind(this));

		this.$('.js-play').on('click', this.onclickPlay.bind(this));
		this.$('.js-pause').on('click', this.onclickPause.bind(this));
		this.$volume = this.$('.js-volume').on('change', this.onchangeUiVolume.bind(this));

		this.$('[disabled]').prop('disabled', false);  // FIXME

		this.updateVolume();
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

	_connectTimeText: function(name) {
		var $el = this.$('.js-' + name + 'Text');
		this.track.on('change:' + name, function(track, value) {
			$el.html(this.timeText(value));
		}.bind(this));
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
	},

	/**
	 * Update volume UI's value.
	 * @param {Number} volume It can be `0.0` to `1.0`.
	 */
	updateVolume: function(volume) {
		var $volume = this.$volume;
		volume = $volume.attr('max') * this.track.get('volume');
		$volume.val(volume);
	},

	onclickPlay: function(event) {
		this.track.play();
	},

	onclickPause: function(event) {
		this.track.pause();
	},

	onchangeTrackVolume: function(event) {
		this.updateVolume();
	},

	onchangeUiVolume: function(event) {
		var $volume = this.$volume;
		var volume = $volume.val() / $volume.attr('max');
		this.track.set({ volume:volume });
	}
});
