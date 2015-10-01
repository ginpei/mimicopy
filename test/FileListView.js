describe('FileListView', function() {
	var vFileList, $el, file, audio;
	beforeEach(function() {
		$el = gQuery('<ul />');
		vFileList = new window.mimicopy.FileListView({
			el: $el
		});

		file = new window.mimicopy.File({
			name: 'sound.mp3',
			size: 1024,
			type: 'audio/mp3'
		});
		audio = mimicopy.File._audio = {
			canPlayType: function(el) {
				return 'maybe'
			}
		};
	});

	afterEach(function() {
		mimicopy.File._audio = null;
	});

	describe('list', function() {
		beforeEach(function() {
			vFileList.add(file);
		});

		it('adds a new item element into my own list', function() {
			expect($el[0].firstChild.innerHTML).toBe('sound.mp3');
		});
	});

	describe('item element', function() {
		it('adds a flag as a class name if supported', function() {
			audio.canPlayType = function() { return 'maybe' };
			vFileList.add(file);
			expect(vFileList.$el[0].firstChild.classList.contains('is-supported')).toBeTruthy();
		});

		it('does not add any flags if not supported', function() {
			audio.canPlayType = function() { return '' };
			vFileList.add(file);
			expect(vFileList.$el[0].firstChild.classList.contains('is-supported')).toBeFalsy();
		});
	});

	describe('onclick', function() {
		var file2, elFile1, elFile2, spy;

		beforeEach(function() {
			file2 = new window.mimicopy.File({
				name: 'sound2.mp3',
				size: 1024,
				type: 'audio/mp3'
			});

			vFileList.add(file);
			vFileList.add(file2);

			elFile1 = vFileList.$el[0].children[0];
			elFile2 = vFileList.$el[0].children[1];

			spy = jasmine.createSpy('1');

			vFileList.on('selectitem', spy);

			test_helper_fireEvent(elFile1, 'click');
			test_helper_fireEvent(elFile2, 'click');
		});

		it('add event listeners to each item elements', function() {
			expect(spy.calls.first().args[0]).toBe(file)
			expect(spy.calls.mostRecent().args[0]).toBe(file2)
		});
	});
});
