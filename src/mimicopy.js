(function(window, document, $, O) {
	O.Model.prototype.beforeFilter = function() { /* noop */ };
	O.Model.prototype._setAttributes = O.Model.prototype.set;
	O.Model.prototype.set = function(attr) {
		if (attr) {
			this.beforeFilter(attr);
		}
		return this._setAttributes(attr);
	};
	O.Model.prototype.setBubbling = O.View.prototype.setBubbling = function(target, types) {
		types.forEach(function(type, index) {
			target.on(type, this.trigger.bind(this, type));
		}.bind(this));
	};

	O.View.prototype._e = function(text) {
		var safe = text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&quot;')
			.replace(/`/g, '&quot;');
		return safe;
	};

	var mimicopy = window.mimicopy = {
		autorun: function() {
			$(document).on('DOMContentLoaded', function(event) {
				this.setup();
			}.bind(this));
		},

		setup: function() {
			this.vFileReceiver = new this.FileReceiverView({
				el: $('html')
			});
			this.vFileReceiver.on('receive', this._openFiles.bind(this));

			var track = this.track = new this.Track({ audio:this.$('.js-audio')[0] });
			this.vPlayer = new this.PlayerView({
				el: this.$('.js-player'),
				track:track
			});

			this.vFileList = new this.FileListView({
				el: this.$('.js-files')
			});
			this.vFileList.on('selectitem', this._selectFile.bind(this));
		},

		$: function(selector) {
			return $(selector);
		},

		_openFiles: function(fileDataList) {
			for (var i=0, l=fileDataList.length; i<l; i++) {
				var file = new mimicopy.File(fileDataList[i]);
				this.vFileList.add(file);
			}
		},

		_selectFile: function(file) {
			this.track.attach(file);
		}
	};

	mimicopy.autorun();
})(window, document, gQuery, Osteoporosis);
