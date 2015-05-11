(function() {
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
			var html = '<li>';
			html += escape(file.name);
			html += '</li>';
			return html;
		}).join('');
		elSoundList.innerHTML += html;
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
