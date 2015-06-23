describe('Track', function() {
	var track;
	beforeEach(function() {
		track = new mimicopy.Track();
		track.audio = {};
	});

	describe('audio events', function() {
		describe('event bubbling', function() {
			var spy, audio;
			beforeEach(function() {
				spy = jasmine.createSpy();

				audio = document.createElement('audio');
				track.setAudio(audio);
			});

			it('throws a error event', function() {
				track.on('error', spy);
				test_helper_fireEvent(audio, 'error');
				expect(spy).toHaveBeenCalled();
			});

			it('throws a play event', function() {
				track.on('play', spy);
				test_helper_fireEvent(audio, 'play');
				expect(spy).toHaveBeenCalled();
			});

			it('throws a pause event', function() {
				track.on('pause', spy);
				test_helper_fireEvent(audio, 'pause');
				expect(spy).toHaveBeenCalled();
			});

			it('throws a durationchange event', function() {
				track.on('durationchange', spy);
				test_helper_fireEvent(audio, 'durationchange');
				expect(spy).toHaveBeenCalled();
			});

			it('throws a timeupdate event', function() {
				track.on('timeupdate', spy);
				test_helper_fireEvent(audio, 'timeupdate');
				expect(spy).toHaveBeenCalled();
			});

			it('throws a ratechange event', function() {
				track.on('ratechange', spy);
				test_helper_fireEvent(audio, 'ratechange');
				expect(spy).toHaveBeenCalled();
			});

			it('throws a volumechange event', function() {
				track.on('volumechange', spy);
				test_helper_fireEvent(audio, 'volumechange');
				expect(spy).toHaveBeenCalled();
			});
		});

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

		describe('timeupdate', function() {
			beforeEach(function() {
				track.audio = { currentTime:100 };
				track.ontimeupdate({ type:'timeupdate' });
			});

			it('updates currentTime', function() {
				expect(track.get('currentTime')).toBe(100);
			});
		});
	});

	describe('reflection', function() {
		beforeEach(function() {
			track.set({ currentTime:100 });
		});

		it('updates currentTime for audio when model\'s value is changed', function() {
			expect(track.audio.currentTime).toBe(100);
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
