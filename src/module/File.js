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

	read: function(callback) {
		var reader = this._getReader();

		reader.onload = function(event) {
			var dataUri = event.target.result;
			callback(dataUri);
		}.bind(this);
		reader.readAsDataURL(this.original);
	},

	_getAudio: function() {
		return window.mimicopy.File.getAudio();
	},

	_getReader: function() {
		return window.mimicopy.File.getReader();
	}
}, {
	getAudio: function() {
		if (!this._audio) {
			this._audio = document.createElement('audio');
		}
		return this._audio;
	},

	getReader: function() {
		if (!this._reader) {
			this._reader = new FileReader();
		}
		return this._reader;
	}
});
