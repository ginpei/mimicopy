(function() {
	var soundFileTable = { length:0 };

	var elBody = document.body;
	var elDroppable = document.querySelector('html');
	var elSoundList = document.querySelector('.js-soundList');

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
		}

		if (el) {
			var id = el.getAttribute('data-id');
			var file = soundFileTable[id].file;
			console.log(file.name);
		}
	});

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
