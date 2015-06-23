window.mimicopy.Track = Osteoporosis.Model.extend({
	initialize: function(attributes) {
		attributes = attributes || {};

		if (attributes.audio) {
			// audio is not data
			this.setAudio(attributes.audio);
			delete this.attributes.audio;
		}
	},

	setAudio: function(audio) {
		this.audio = audio;
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
	}
});
