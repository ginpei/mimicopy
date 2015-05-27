(function($, mimicopy) {
	var mimicopy_setup = mimicopy.setup;
	mimicopy.setup = function() { };
	var vPlayer, $el, track;

	describe('PlayerView', function() {
		beforeEach(function() {
			$el = $(window.test_helper_html);
			track = new mimicopy.Track();
			vPlayer = new mimicopy.PlayerView({
				el: $el,
				track: track
			});
		});

		describe('time range', function() {
			describe('duration value', function() {
				beforeEach(function() {
					track.set({ duration:61.001 });
				});

				it('updates text', function() {
					expect(vPlayer.$('.js-durationText').html()).toBe('1:01.001');
				});

				it('updates the maximum of time UIs', function() {
					expect(vPlayer.$('.js-timeFrom')[0].max).toBe('61.001');
					expect(vPlayer.$('.js-currentTime')[0].max).toBe('61.001');
					expect(vPlayer.$('.js-timeTo')[0].max).toBe('61.001');
				});
			});

			describe('timeFrom value', function() {
				beforeEach(function() {
					track.set({ timeFrom:61.001 });
				});

				it('updates timeFrom UI', function() {
					expect(vPlayer.$('.js-timeFrom')[0].value).toBe('61.001');
				});

				it('updates timeFrom text', function() {
					expect(vPlayer.$('.js-timeFromText').html()).toBe('1:01.001');
				});
			});

			describe('timeFrom UI', function() {
				beforeEach(function() {
					var $el = vPlayer.$('.js-timeFrom');
					$el.val(61.001);
					test_helper_fireEvent($el[0], 'change');
				});

				it('updates timeFrom value', function() {
					expect(track.get('timeFrom')).toBe(61.001);
				});
			});

			describe('currentTime value', function() {
				beforeEach(function() {
					track.set({ currentTime:61.001 });
				});

				it('updates currentTime UI', function() {
					expect(vPlayer.$('.js-currentTime')[0].value).toBe('61.001');
				});

				it('updates currentTime text', function() {
					expect(vPlayer.$('.js-currentTimeText').html()).toBe('1:01.001');
				});
			});

			describe('currentTime UI', function() {
				beforeEach(function() {
					var $el = vPlayer.$('.js-currentTime');
					$el.val(61.001);
					test_helper_fireEvent($el[0], 'change');
				});

				it('updates currentTime value', function() {
					expect(track.get('currentTime')).toBe(61.001);
				});
			});

			describe('timeTo value', function() {
				beforeEach(function() {
					track.set({ timeTo:61.001 });
				});

				it('updates timeTo UI', function() {
					expect(vPlayer.$('.js-timeTo')[0].value).toBe('61.001');
				});

				it('updates timeTo text', function() {
					expect(vPlayer.$('.js-timeToText').html()).toBe('1:01.001');
				});
			});

			describe('timeTo UI', function() {
				beforeEach(function() {
					var $el = vPlayer.$('.js-timeTo');
					$el.val(61.001);
					test_helper_fireEvent($el[0], 'change');
				});

				it('updates timeTo value', function() {
					expect(track.get('timeTo')).toBe(61.001);
				});
			});
		});
	});
})(gQuery, mimicopy);
