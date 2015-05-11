(function() {
	var soundFileTable = { length:0 };
	var reader = new FileReader();

	var elBody = document.body;
	var elDroppable = document.querySelector('html');
	var elSoundList = document.querySelector('.js-soundList');
	var elPlayer = document.querySelector('.js-player');
	var elPlay = document.querySelector('.js-play');
	var elPause = document.querySelector('.js-pause');
	var elCurrentTime = document.querySelector('.js-currentTime');
	var elTimeFrom = document.querySelector('.js-timeFrom');
	var elTimeTo = document.querySelector('.js-timeTo');
	var elCurrentTimeText = document.querySelector('.js-currentTimeText');
	var elDurationText = document.querySelector('.js-durationText');

	addListeners(elDroppable, {
		dragover: function(event) {
			event.preventDefault();
			elBody.classList.add('is-dragover');
		},

		dragleave: function(event) {
			elBody.classList.remove('is-dragover');
		},

		drop: function(event) {
			event.preventDefault();
			elBody.classList.remove('is-dragover');

			var files = event.dataTransfer.files;
			var html = map(files, function(file, index) {
				var id = ++soundFileTable.length;
				soundFileTable[id] = { id:id, file:file };

				var classNameText = 'soudList-item js-soudList-item';
				if (elPlayer.canPlayType(file.type)) {
					classNameText += ' is-supported';
				}

				var html = '<li>';
				html += '<span class="' + classNameText + '" data-id="' + id + '">';
				html += escape(file.name);
				html += '</span></li>';
				return html;
			}).join('');
			elSoundList.innerHTML += html;
		}
	});

	addListeners(elSoundList, {
		click: function(event) {
			var el = event.target;
			while (el && el.classList) {
				if (el.classList.contains('js-soudList-item')) {
					break;
				}
				else {
					el = el.parentNode;
				}
			}

			if (el && el.classList.contains('is-supported')) {
				var id = el.getAttribute('data-id');
				var file = soundFileTable[id].file;
				setupPlayer(file);
			}
		}
	});

	addListeners(elPlayer, {
		error: function(event) {
			elPlay.disabled = true;
			elPause.disabled = true;
		},

		canplay: function(event) {
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
	});

	elTimeTo.addEventListener('change', function(event) {
		var from = Number(elTimeFrom.value);
		var to = Number(elTimeTo.value);
		if (from > to) {
			elTimeFrom.value = to;
		}
	});

	elCurrentTimeText.setTime = elDurationText.setTime = function(time) {
		var min = parseInt(time/60, 10);
		var sec = ('0' + parseInt(time%60, 10)).slice(-2);
		var msec = ('000' + (time - parseInt(time, 10))).slice(-3);
		var text = min + ':' + sec + '.' + msec;
		this.innerHTML = text;
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
})();
