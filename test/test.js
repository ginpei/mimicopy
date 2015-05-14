(function($, mimicopy) {
	var mimicopy_setup = mimicopy.setup;
	mimicopy.setup = function() { };

	beforeEach(function() {
		var $elRoot = $(
			'<div class="player">' +
				'<audio class="js-player"></audio>' +
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
					'<button class="js-save" disabled>Save</button>' +
					'<button class="js-load" disabled>Load</button>' +
				'</div>' +
			'</div>');
		mimicopy.$ = function(selector) {
			return $elRoot.find(selector);
		};
		mimicopy_setup.call(mimicopy);
	});

	describe('duration', function() {
		beforeEach(function() {
			mimicopy.track.set({ duration:61.001 });
		});

		it('updates text', function() {
			expect(mimicopy.$('.js-durationText').html()).toBe('1:01.001');
		});

		it('updates the maximum of time UIs', function() {
			expect(mimicopy.$('.js-timeFrom')[0].max).toBe('61.001');
			expect(mimicopy.$('.js-currentTime')[0].max).toBe('61.001');
			expect(mimicopy.$('.js-timeTo')[0].max).toBe('61.001');
		});
	});

	describe('UIs', function() {
		it('updates timeFrom UI', function() {
			mimicopy.track.set({ timeFrom:61.001 });
			expect(mimicopy.$('.js-timeFrom')[0].value).toBe('61.001');
		});

		it('updates currentTime UI', function() {
			mimicopy.track.set({ currentTime:61.001 });
			expect(mimicopy.$('.js-currentTime')[0].value).toBe('61.001');
		});

		it('updates timeTo UI', function() {
			mimicopy.track.set({ timeTo:61.001 });
			expect(mimicopy.$('.js-timeTo')[0].value).toBe('61.001');
		});
	});
})(gQuery, mimicopy);
