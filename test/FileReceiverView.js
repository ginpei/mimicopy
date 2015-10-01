describe('FileReceiverView', function() {
	var vFileReceiver, $el;
	beforeEach(function() {
		$el = $('<div />');
		vFileReceiver = new mimicopy.FileReceiverView({
			el: $el
		});
	});

	it('shows dragging status when dragging', function() {
		test_helper_fireEvent($el[0], 'dragover');
		expect($el[0].classList.contains('is-dragover')).toBeTruthy();
	})

	it('stops showing dragging status when dragging is finished', function() {
		test_helper_fireEvent($el[0], 'dragover');
		test_helper_fireEvent($el[0], 'dragleave');
		expect($el[0].classList.contains('is-dragover')).toBeFalsy();
	})

	it('stops showing dragging status when dropped', function() {
		test_helper_fireEvent($el[0], 'dragover');
		test_helper_fireEvent($el[0], 'drop', { dataTransfer:{} });
		expect($el[0].classList.contains('is-dragover')).toBeFalsy();
	})

	it('fires a receive event', function() {
		var called = 0;
		vFileReceiver.on('receive', function() {
			called++;
		});
		test_helper_fireEvent($el[0], 'drop', { dataTransfer:{} });
		expect(called).toBe(1);
	});

	it('stores received files', function() {
		var files = [];
		test_helper_fireEvent($el[0], 'drop', {
			dataTransfer: {
				files: files
			}
		});
		expect(vFileReceiver.files).toBe(files);
	});
});
