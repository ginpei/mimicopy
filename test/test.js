var mimicopy = window.mimicopy;

mimicopy.initialize = function() { };

beforeEach(function() {
	mimicopy.settings.initialize();
});

describe('Recipe', function() {
	beforeEach(function() {
		mimicopy.settings.addRecipe({
			file: {
				name: 'example.mp3',
				size: 123456,
				type: 'audio/mp3'
			},
			from: 12.345,
			to: 23.456
		});
	});

	it('is added', function() {
		var recipe = mimicopy.settings.recipes['example.mp3-123456-audio/mp3'];
		expect(recipe.from).toBe(12.345);
		expect(recipe.to).toBe(23.456);
	});

	it('is got by file', function() {
		var file = {
			name: 'example.mp3',
			size: 123456,
			type: 'audio/mp3'
		};
		var recipe = mimicopy.settings.getRecipe(file);

		expect(recipe.from).toBe(12.345);
		expect(recipe.to).toBe(23.456);
	});
});
