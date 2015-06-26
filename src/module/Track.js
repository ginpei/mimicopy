window.mimicopy.Track = Osteoporosis.Model.extend({
	initialize: function(attributes) {
		attributes = attributes || {};

		if (attributes.audio) {
			// audio is not data
			this.setAudio(attributes.audio);
			delete this.attributes.audio;
		}

		this.on('change:currentTime', this.onchangeCurrentTime.bind(this));
		this.on('change:volume', this.onchangeVolume.bind(this));
	},

	/**
	 * Attach audio I/F (element).
	 * This function does not consider about destructing.
	 * @param {HtmlElement} audio
	 */
	setAudio: function(audio) {
		this.audio = audio;
		var $audio = $(this.audio);

		$audio
			.on('durationchange', this.ondurationchange.bind(this))
			.on('timeupdate', this.ontimeupdate.bind(this))
			.on('volumechange', this.onvolumechange.bind(this));

		this.setBubbling($audio, [
			'error',
			'play',
			'pause',
			'durationchange',
			'timeupdate',
			'ratechange',
			'volumechange'
		]);
	},

	/**
	 * Atach a file and reset times.
	 * @param {mimicopy.File} file
	 */
	attach: function(file) {
		file.read(function(dataUri) {
			// FIXME
			var audio = this.audio;
			audio.src = dataUri;
			audio.play();
		}.bind(this));
	},

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
	},

	play: function() {
		this.audio.play();
	},

	pause: function() {
		this.audio.pause();
	},

	/**
	 * track <- audio
	 */
	ondurationchange: function(event) {
		this.set({
			currentTime: 0,
			duration: this.audio.duration,
			timeFrom: 0,
			timeTo: this.audio.duration
		});
	},

	/**
	 * track <- audio
	 */
	ontimeupdate: function(event) {
		this.set({
			currentTime: this.audio.currentTime
		});
	},

	/**
	 * track <- audio
	 */
	onvolumechange: function(event) {
		this.set({
			volume: this.audio.volume
		});
	},

	/**
	 * track -> audio
	 */
	onchangeCurrentTime: function(track, currentTime) {
		this.audio.currentTime = currentTime;
	},

	/**
	 * track -> audio
	 */
	onchangeVolume: function(track, volume) {
		this.audio.volume = volume;
	}
});
