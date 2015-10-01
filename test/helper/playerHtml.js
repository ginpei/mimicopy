test_helper_html =
	'<div class="js-player">' +
		'<audio class="js-audio"></audio>' +
		'<div class="player-time-range js-timeRange"></div>' +
		'<input class="player-time player-timeFrom js-timeFrom" type="range" value="0" step="0.001" />' +
		'<input class="player-time player-currentTime js-currentTime" type="range" value="0" step="0.001" />' +
		'<input class="player-time player-timeTo js-timeTo" type="range" value="0" step="0.001" />' +
		'<button class="js-play" disabled></button>' +
		'<button class="js-pause" disabled></button>' +
		'<span class="js-currentTimeText"></span>' +
		'<span class="js-durationText"></span>' +
		'<div class="player-volumes">' +
			'Volume: <input class="js-volume" type="range" value="0" min="0" max="1" step="0.01" disabled />' +
			'<input class="js-muted" type="checkbox" disabled />' +
		'</div>' +
		'<div class="player-memories">' +
			'<span class="js-timeFromText"></span>' +
			'<span class="js-timeToText"></span>' +
		'</div>' +
	'</div>';
