describe('Track', function() {
	var track;
	beforeEach(function() {
		track = new mimicopy.Track();
	});

	describe('audio events', function() {
		describe('durationchange', function() {
			beforeEach(function() {
				track.audio = { duration:100 };
				track.ondurationchange({ type:'durationchange' });
			});

			it('updates duration', function() {
				expect(track.get('duration')).toBe(100);
			});

			it('reset from-time', function() {
				expect(track.get('from')).toBe(0);
			});

			it('reset to-time', function() {
				expect(track.get('to')).toBe(100);
			});
		});
	});

	describe('currentTime', function() {
		beforeEach(function() {
			track.set({
				currentTime: 10,
				timeFrom: 5,
				timeTo: 15
			});
		});

		describe('uses currentTime', function() {
			it('from specified attributes if specified', function() {
				var time = track.getTimeAttributes({ currentTime:11 });
				expect(time.current).toBe(11);
			});

			it('from current attributes if not specified', function() {
				var time = track.getTimeAttributes({});
				expect(time.current).toBe(10);
			});
		});

		describe('uses timeFrom', function() {
			it('from specified attributes if specified', function() {
				var time = track.getTimeAttributes({ timeFrom:6 });
				expect(time.from).toBe(6);
			});

			it('from current attributes if not specified', function() {
				var time = track.getTimeAttributes({});
				expect(time.from).toBe(5);
			});
		});

		describe('uses timeTo', function() {
			it('from specified attributes if specified', function() {
				var time = track.getTimeAttributes({ timeTo:16 });
				expect(time.to).toBe(16);
			});

			it('from current attributes if not specified', function() {
				var time = track.getTimeAttributes({});
				expect(time.to).toBe(15);
			});
		});

		describe('sets timeFrom as currentTime', function() {
			it('if specified currentTime is less than timeFrom', function() {
				track.set({ currentTime:4 });
				expect(track.get('currentTime')).toBe(5);
			});

			it('if currentTime is greater than specified timeTo', function() {
				track.set({ currentTime:16 });
				expect(track.get('currentTime')).toBe(5);
			});
		});

		it('triggers change:currentTime event when out range time is set for currentTime even if last currentTime equals timeFrom', function() {
			track.set({ currentTime:track.get('timeFrom') });

			var called = 0;
			track.on('change:currentTime', function() { called++; });
			track.set({ currentTime:track.get('timeFrom')-1 });
			expect(called).toBe(1);
		});
	});
});
