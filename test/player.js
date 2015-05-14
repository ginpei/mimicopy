(function($, mimicopy) {
	var mimicopy_setup = mimicopy.setup;
	mimicopy.setup = function() { };
	var player, $el, track;

	describe('Player', function() {
		beforeEach(function() {
			$el = $(
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
						'<button class="js-save" disabled>Save</button>' +
						'<button class="js-load" disabled>Load</button>' +
					'</div>' +
				'</div>');
			track = new mimicopy.Track();
			player = new mimicopy.Player({
				el: $el,
				track: track
			});
		});

		describe('duration', function() {
			beforeEach(function() {
				track.set({ duration:61.001 });
			});

			it('updates text', function() {
				expect(player.$('.js-durationText').html()).toBe('1:01.001');
			});

			it('updates the maximum of time UIs', function() {
				expect(player.$('.js-timeFrom')[0].max).toBe('61.001');
				expect(player.$('.js-currentTime')[0].max).toBe('61.001');
				expect(player.$('.js-timeTo')[0].max).toBe('61.001');
			});
		});

		describe('UIs', function() {
			it('updates timeFrom UI', function() {
				track.set({ timeFrom:61.001 });
				expect(player.$('.js-timeFrom')[0].value).toBe('61.001');
			});

			it('updates currentTime UI', function() {
				track.set({ currentTime:61.001 });
				expect(player.$('.js-currentTime')[0].value).toBe('61.001');
			});

			it('updates timeTo UI', function() {
				track.set({ timeTo:61.001 });
				expect(player.$('.js-timeTo')[0].value).toBe('61.001');
			});
		});
	});
})(gQuery, mimicopy);
