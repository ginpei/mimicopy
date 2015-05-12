(function() {
	var mimicopy = window.mimicopy = {
		initialize: function() {
			this._connectToElements(this.elementConnections);
			this.initialize2();
		},

		elementConnections: {
			'body': 'body',

			'droppable': {
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
						if (elPlayer.canPlayType(file.type)) {
							classNameText += ' is-supported';
						}

						var html = '<li>';
						html += '<span class="' + classNameText + '" data-id="' + id + '">';
						html += escape(file.name);
						html += '</span></li>';
						return html;
					}).join('');
					this.els.soundList.innerHTML += html;
				}
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

	var soundFileTable = { length:0 };
	var reader = new FileReader();

	var elPlayer = document.querySelector('.js-player');
	var elPlay = document.querySelector('.js-play');
	var elPause = document.querySelector('.js-pause');
	var elCurrentTime = document.querySelector('.js-currentTime');
	var elTimeFrom = document.querySelector('.js-timeFrom');
	var elTimeTo = document.querySelector('.js-timeTo');
	var elCurrentTimeText = document.querySelector('.js-currentTimeText');
	var elDurationText = document.querySelector('.js-durationText');
	var elVolume = document.querySelector('.js-volume');
	var elMuted = document.querySelector('.js-muted');

	mimicopy.initialize2 = function() {
		addListeners(elPlayer, {
			error: function(event) {
				elPlay.disabled = true;
				elPause.disabled = true;
			},

			canplay: function(event) {
				elVolume.value = this.volume;
				elMuted.checked = this.muted;
				elVolume.disabled = elMuted.disabled = false;
				this.play();
			},

			play: function(event) {
				elPlay.disabled = true;
				elPause.disabled = false;
			},

			pause: function(event) {
				elPlay.disabled = false;
				elPause.disabled = true;
			},

			volumechange: function(event) {
				elVolume.value = this.volume;
				elMuted.checked = this.muted;
			},

			durationchange: function(event) {
				var value = this.duration;
				if (value === Infinity) {
					elCurrentTime.max = elTimeFrom.max = elTimeTo.max = 3600;
					elDurationText.innerHTML = '-:--.---';
					console.warn('Your browser does not support audio duration.');
				}
				else {
					elCurrentTime.max = elTimeFrom.max = elTimeTo.max = value;
					elDurationText.setTime(value);
				}
				elTimeFrom.value = 0;
				elTimeTo.value = elTimeTo.max;
			},

			timeupdate: function(event) {
				var value = this.currentTime;
				var to = Number(elTimeTo.value);
				if (value > to) {
					var from = Number(elTimeFrom.value);
					elPlayer.currentTime = from;
				}
				else {
					elCurrentTime.value = value;
					elCurrentTimeText.setTime(value);
				}
			}
		});

		elPlay.addEventListener('click', function(event) {
			var currentTime = elPlayer.currentTime;
			var from = Number(elTimeFrom.value);
			var to = Number(elTimeTo.value);
			if (currentTime < from || to < currentTime) {
				elPlayer.currentTime = from;
			}
			elPlayer.play();
		});

		elPause.addEventListener('click', function(event) {
			elPlayer.pause();
		});

		elCurrentTime.addEventListener('change', function(event) {
			elPlayer.currentTime = this.value;
		});

		elTimeFrom.addEventListener('change', function(event) {
			var from = Number(elTimeFrom.value);
			var to = Number(elTimeTo.value);
			if (from > to) {
				elTimeTo.value = from;
			}

			if (elPlayer.currentTime < from) {
				elPlayer.currentTime = from;
			}
		});

		elTimeTo.addEventListener('change', function(event) {
			var from = Number(elTimeFrom.value);
			var to = Number(elTimeTo.value);
			if (from > to) {
				elTimeFrom.value = to;
			}
		});

		elVolume.addEventListener('change', function(event) {
			elPlayer.volume = this.value;
		});

		elMuted.addEventListener('change', function(event) {
			elPlayer.muted = this.checked;
		});

		elCurrentTimeText.setTime = elDurationText.setTime = function(time) {
			var min = parseInt(time/60, 10);
			var sec = ('0' + parseInt(time%60, 10)).slice(-2);
			var msec = ('000' + (time - parseInt(time, 10))).slice(-3);
			var text = min + ':' + sec + '.' + msec;
			this.innerHTML = text;
		};
	};

	function setupPlayer(file) {
		reader.onload = function(event) {
			elPlayer.src = event.target.result;
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

	function addListeners(el, listeners) {
		for (var type in listeners) {
			el.addEventListener(type, listeners[type]);
		}
	}

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
