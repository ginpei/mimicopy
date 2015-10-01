describe('TimeRangeView', function() {
	var vTimeRange, track, $el;
	beforeEach(function() {
		$el = $('<input type="range" />');
		track = new mimicopy.Track();
		vTimeRange = new mimicopy.TimeRangeView({
			attrName: 'foo',
			el: $el,
			track: track
		});
	});

	it('sets track value as a number when UI value is changed', function() {
		$el.val(32);
		test_helper_fireEvent(vTimeRange.$el[0], 'change');
		expect(track.get('foo')).toBe(32);
	});

	it('sets UI\'s max', function() {
		vTimeRange.updateMax(32);
		expect($el.prop('max')).toBe('32');
	});

	it('sets UI\'s value', function() {
		vTimeRange.updateValue(32);
		expect($el.val()).toBe('32');
	});
});
