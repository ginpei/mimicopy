(function($, mimicopy) {
	var mimicopy_setup = mimicopy.setup;
	mimicopy.setup = function() { };
	var player, $el, track;

	describe('Player', function() {
		beforeEach(function() {
			$el = $(window.test_helper_html);
			track = new mimicopy.Track();
			player = new mimicopy.Player({
				el: $el,
				track: track
			});
		});

		describe('time range', function() {
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

			describe('timeFrom', function() {
				beforeEach(function() {
					track.set({ timeFrom:61.001 });
				});

				it('updates timeFrom UI', function() {
					expect(player.$('.js-timeFrom')[0].value).toBe('61.001');
				});
			});

			describe('currentTime', function() {
				beforeEach(function() {
					track.set({ currentTime:61.001 });
				});

				it('updates currentTime UI', function() {
					expect(player.$('.js-currentTime')[0].value).toBe('61.001');
				});
			});

			describe('timeTo', function() {
				beforeEach(function() {
					track.set({ timeTo:61.001 });
				});

				it('updates timeTo UI', function() {
					expect(player.$('.js-timeTo')[0].value).toBe('61.001');
				});
			});
		});
	});
})(gQuery, mimicopy);
