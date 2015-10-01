describe('File', function() {
	var file, fileData, audio;
	beforeEach(function() {
		fileData = {
			name: 'sound.mp3',
			size: 1024,
			type: 'audio/mp3'
		};
		file = new mimicopy.File(fileData);
		audio = mimicopy.File._audio = {
			canPlayType: function(el) {
				return 'maybe'
			}
		};
	});

	afterEach(function() {
		mimicopy.File._audio = null;
	});

	describe('constructor', function() {
		it('sets file name', function() {
			expect(file.get('name')).toBe('sound.mp3');
		});

		it('sets file size', function() {
			expect(file.get('size')).toBe(1024);
		});

		it('sets file type', function() {
			expect(file.get('type')).toBe('audio/mp3');
		});

		it('sets original file object', function() {
			expect(file.original).toBe(fileData);
		});
	});

	describe('file type', function() {
		beforeEach(function() {
			audio.canPlayType = function() {
				return '123';
			};
		});

		it('detects target file is playable or not', function() {
			expect(file.isSupported()).toBe('123');
		});
	});
});
