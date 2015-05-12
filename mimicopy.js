(function() {
	var mimicopy = window.mimicopy = {
		initialize: function() {
			this._connectToElements(this.elementConnections);
		},

		elementConnections: {
			body: 'body',

			droppable: {
				selector: 'html',
				dragover: function(event) {
					event.preventDefault();
					this.els.body.classList.add('is-dragover');
				},

				dragleave: function(event) {
					this.els.body.classList.remove('is-dragover');
				},

				drop: function(event) {
					event.preventDefault();
					this.els.body.classList.remove('is-dragover');

					var files = event.dataTransfer.files;
					var html = map(files, function(file, index) {
						var id = ++soundFileTable.length;
						soundFileTable[id] = { id:id, file:file };

						var classNameText = 'soundList-item js-soundList-item';
						if (this.player.canPlayType(file.type)) {
							classNameText += ' is-supported';
						}

						var html = '<li>';
						html += '<span class="' + classNameText + '" data-id="' + id + '">';
						html += escape(file.name);
						html += '</span></li>';
						return html;
					}.bind(this)).join('');
					this.els.soundList.innerHTML += html;
				}
			},

			play: {
				selector: '.js-play',
				click: function(event) {
					var currentTime = this.player.currentTime;
					var from = Number(this.els.timeFrom.value);
					var to = Number(this.els.timeTo.value);
					if (currentTime < from || to < currentTime) {
						this.player.currentTime = from;
					}
					this.player.play();
				}
			},

			pause: {
				selector: '.js-pause',
				click: function(event) {
					this.player.pause();
				}
			},

			currentTime: {
				selector: '.js-currentTime',
				change: function(event) {
					this.player.currentTime = event.currentTarget.value;
				}
			},

			timeFrom: {
				selector: '.js-timeFrom',
				change: function(event) {
					var from = Number(this.els.timeFrom.value);
					var to = Number(this.els.timeTo.value);
					if (from > to) {
						this.els.timeTo.value = from;
					}

					if (this.player.currentTime < from) {
						this.player.currentTime = from;
					}
				},
			},

			timeTo: {
				selector: '.js-timeTo',
				change: function(event) {
					var from = Number(this.els.timeFrom.value);
					var to = Number(this.els.timeTo.value);
					if (from > to) {
						this.els.timeFrom.value = to;
					}
				}
			},

			volume: {
				selector: '.js-volume',
				change: function(event) {
					this.player.volume = event.currentTarget.value;
				}
			},

			muted: {
				selector: '.js-muted',
				change: function(event) {
					this.player.muted = event.currentTarget.checked;
				}
			},

			currentTimeText: {
				selector: '.js-currentTimeText',
				initialize: function(el) { el.setTime = setTime; }
			},
			durationText: {
				selector: '.js-durationText',
				initialize: function(el) { el.setTime = setTime; }
			}
		},

		_connectToElements: function(elements) {
			var elRoot = this.el || document;
			var els = this.els = {};
			for (var name in elements) {
				var data = elements[name];
				if (typeof data === 'string') {
					els[name] = elRoot.querySelector(data);
				}
				else {
					var el = els[name] = elRoot.querySelector(data.selector);
					for (var type in data) {
						if (type === 'selector') {
							continue;
						}
						if (type === 'initialize') {
							data[type].call(this, el);
							continue;
						}
						el.addEventListener(type, data[type].bind(this));
					}
				}
			}
		}
	};

	mimicopy.elementConnections.soundList = {
		selector: '.js-soundList',

		click: function(event) {
			var el = event.target;
			while (el) {
				if (el.classList.contains('js-soundList-item')) {
					break;
				}
				else {
					el = el.parentNode;
					if (!el.classList) {
						el = null;
					}
				}
			}

			if (el && el.classList.contains('is-supported')) {
				var id = el.getAttribute('data-id');
				var file = soundFileTable[id].file;
				setupPlayer(file);
			}
		}
	};

	mimicopy.elementConnections.player = {
		selector: '.js-player',

		initialize: function(el) {
			this.player = el;
		},

		error: function(event) {
			this.els.play.disabled = true;
			this.els.pause.disabled = true;
		},

		canplay: function(event) {
			this.els.volume.value = this.player.volume;
			this.els.muted.checked = this.player.muted;
			this.els.volume.disabled = this.els.muted.disabled = false;
			this.player.play();
		},

		play: function(event) {
			this.els.play.disabled = true;
			this.els.pause.disabled = false;
		},

		pause: function(event) {
			this.els.play.disabled = false;
			this.els.pause.disabled = true;
		},

		volumechange: function(event) {
			this.els.volume.value = this.player.volume;
			this.els.muted.checked = this.player.muted;
		},

		durationchange: function(event) {
			var value = this.player.duration;
			if (value === Infinity) {
				this.els.currentTime.max = this.els.timeFrom.max = this.els.timeTo.max = 3600;
				this.els.durationText.innerHTML = '-:--.---';
				console.warn('Your browser does not support audio duration.');
			}
			else {
				this.els.currentTime.max = this.els.timeFrom.max = this.els.timeTo.max = value;
				this.els.durationText.setTime(value);
			}
			this.els.timeFrom.value = 0;
			this.els.timeTo.value = this.els.timeTo.max;
		},

		timeupdate: function(event) {
			var value = this.player.currentTime;
			var to = Number(this.els.timeTo.value);
			if (value > to) {
				var from = Number(this.els.timeFrom.value);
				this.player.currentTime = from;
			}
			else {
				this.els.currentTime.value = value;
				this.els.currentTimeText.setTime(value);
			}
		}
	};

	var soundFileTable = { length:0 };
	var reader = new FileReader();

	function setTime(time) {
		var min = parseInt(time/60, 10);
		var sec = ('0' + parseInt(time%60, 10)).slice(-2);
		var msec = ('000' + (time - parseInt(time, 10))).slice(-3);
		var text = min + ':' + sec + '.' + msec;
		this.innerHTML = text;
	}

	function setupPlayer(file) {
		reader.onload = function(event) {
			mimicopy.player.src = event.target.result;
		};
		reader.readAsDataURL(file);
	};

	function map(array, callback) {
		return Array.prototype.map.call(array, callback);
	}

	function escape(string) {
		var safe = string
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&quot;')
			.replace(/`/g, '&quot;');
		return safe;
	};

	var settings = mimicopy.settings = {
		initialize: function() {
			this.recipes = {};
		},

		addRecipe: function(settings) {
			var id = this._getRecipeId(settings.file);
			this.recipes[id] = {
				from: settings.from,
				to: settings.to
			};
		},

		getRecipe: function(file) {
			var id = this._getRecipeId(file);
			var recipe = this.recipes[id];
			return recipe;
		},

		_getRecipeId: function(file) {
			var id = file.name + '-' +file.size + '-' +  file.type;
			return id;
		}
	};

	document.addEventListener('DOMContentLoaded', function(event) {
		mimicopy.initialize();
	});
})();
