describe('PlayerView', function() {
	var mimicopy_setup = window.mimicopy.setup;
	window.mimicopy.setup = function() { };
	var vPlayer, $el, track;
	beforeEach(function() {
		$el = $(window.test_helper_html);
		track = new window.mimicopy.Track();
		track.audio = {};
		vPlayer = new window.mimicopy.PlayerView({
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

		describe('volume value', function() {
			beforeEach(function() {
				vPlayer.$('.js-volume').attr('max', 200);
				track.set({ volume:0.25 });
			});

			it('updates volume UI', function() {
				expect(vPlayer.$('.js-volume').val()).toBe('50');
			});
		});

		describe('volume UI', function() {
			beforeEach(function() {
				var $el = vPlayer.$('.js-volume');
				$el
					.attr('max', 200)
					.val(50);
				test_helper_fireEvent($el[0], 'change');
			});

			it('updates volume value', function() {
				expect(track.get('volume')).toBe(0.25);
			});
		});
	});
});
