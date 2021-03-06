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
				expect(track.get('timeFrom')).toBe(0);
			});

			it('reset to-time', function() {
				expect(track.get('timeTo')).toBe(100);
			});

			it('reset current-time', function() {
				expect(track.get('currentTime')).toBe(0);
				expect(track.audio.currentTime).toBe(0);
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

			it('move to timeFrom if currentTime is earlier than timeFrom', function() {
				track.set({ timeFrom:101 });
				track.audio = { currentTime:100 };
				track.ontimeupdate({ type:'timeupdate' });

				expect(track.get('currentTime')).toBe(101);
			});

			it('move to timeFrom if currentTime is later than timeTo', function() {
				track.set({ timeFrom:1, timeTo:99 });
				track.audio = { currentTime:100 };
				track.ontimeupdate({ type:'timeupdate' });

				expect(track.get('currentTime')).toBe(1);
			});
		});

		describe('volumechange', function() {
			beforeEach(function() {
				track.audio = { volume:100, muted:true };
				track.onvolumechange({ type:'volumechange' });
			});

			it('updates volume', function() {
				expect(track.get('volume')).toBe(100);
				expect(track.get('muted')).toBe(true);
			});
		});
	});

	describe('reflecting to the audio when model\'s value is changed', function() {
		beforeEach(function() {
			track.set({ currentTime:100, volume:0.123, muted:true });
		});

		it('updates currentTime', function() {
			expect(track.audio.currentTime).toBe(100);
		});

		it('updates volume', function() {
			expect(track.audio.volume).toBe(0.123);
		});

		it('updates muted', function() {
			expect(track.audio.muted).toBe(true);
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
