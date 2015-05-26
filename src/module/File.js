window.mimicopy.File = Osteoporosis.Model.extend({
	initialize: function(file) {
		this.attributes = {
			name: file.name,
			size: file.size,
			type: file.type
		};
		this.original = file;
	},

	isSupported: function() {
		var audio = this._getAudio();
		return (audio.canPlayType(this.get('type')));
	},

	_getAudio: function() {
		return window.mimicopy.File.getAudio();
	}
}, {
	getAudio: function() {
		if (!this._audio) {
			this._audio = document.createElement('audio');
		}
		return this._audio;
	}
});
