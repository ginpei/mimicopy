(function() {
	var soundFileTable = { length:0 };

	var elBody = document.body;
	var elDroppable = document.querySelector('html');
	var elSoundList = document.querySelector('.js-soundList');
	var elPlayer = document.querySelector('.js-player');
	var elPlay = document.querySelector('.js-play');
	var elPause = document.querySelector('.js-pause');
	var elCurrentTime = document.querySelector('.js-currentTime');
	var elCurrentTimeText = document.querySelector('.js-currentTimeText');
	var elDurationText = document.querySelector('.js-durationText');
	var reader = new FileReader();

	elDroppable.addEventListener('dragover', function(event) {
		event.preventDefault();
		elBody.classList.add('is-dragover');
	});

	elDroppable.addEventListener('dragleave', function(event) {
		elBody.classList.remove('is-dragover');
	});

	elDroppable.addEventListener('drop', function(event) {
		event.preventDefault();
		elBody.classList.remove('is-dragover');

		var files = event.dataTransfer.files;
		var html = map(files, function(file, index) {
			if (file.type.indexOf('audio/') !== 0) {
				return '';
			}

			var id = ++soundFileTable.length;
			soundFileTable[id] = { id:id, file:file };

			var html = '<li><span class="soudList-item js-soudList-item" data-id="' + id + '">';
			html += escape(file.name);
			html += '</span></li>';
			return html;
		}).join('');
		elSoundList.innerHTML += html;
	});

	elSoundList.addEventListener('click', function(event) {
		var el = event.target;
		while (el) {
			if (el.classList.contains('js-soudList-item')) {
				break;
			}
			else {
				el = el.parentNode;
			}
		}

		if (el) {
			var id = el.getAttribute('data-id');
			var file = soundFileTable[id].file;
			setupPlayer(file);
		}
	});

	elPlayer.addEventListener('error', function(event) {
		elPlay.disabled = true;
		elPause.disabled = true;
	});

	elPlayer.addEventListener('canplay', function(event) {
		this.play();
	});

	elPlayer.addEventListener('play', function(event) {
		elPlay.disabled = true;
		elPause.disabled = false;
	});

	elPlayer.addEventListener('pause', function(event) {
		elPlay.disabled = false;
		elPause.disabled = true;
	});

	elPlayer.addEventListener('durationchange', function(event) {
		var value = this.duration;
		if (value === Infinity) {
			elCurrentTime.max = 3600;
			elDurationText.innerHTML = '-:--';
			console.warn('Your browser does not support audio duration.');
		}
		else {
			elCurrentTime.max = value;
			elDurationText.setTime(value);
		}
	});

	elPlayer.addEventListener('timeupdate', function(event) {
		var value = this.currentTime;
		elCurrentTime.value = value;
		elCurrentTimeText.setTime(value);
	});

	elPlay.addEventListener('click', function(event) {
		elPlayer.play();
	});

	elPause.addEventListener('click', function(event) {
		elPlayer.pause();
	});

	elCurrentTime.addEventListener('change', function(event) {
		elPlayer.currentTime = this.value;
	});

	elCurrentTimeText.setTime = elDurationText.setTime = function(time) {
		var min = parseInt(time/60, 10);
		var sec = ('0' + parseInt(time%60, 10)).slice(-2);
		var text = min + ':' + sec;
		this.innerHTML = text;
	};

	function setupPlayer(file) {
		reader.onload = function(event) {
			load(event.target.result);
		};
		reader.readAsDataURL(file);
	};

	function load(src) {
		elPlayer.onerror = function(event) { console.log(arguments); };
		elPlayer.src = src;
	}

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
})();
