var mimicopy = window.mimicopy;

mimicopy.initialize = function() { };

function fireEvent(el, type) {
	var event;
	if (type === 'click' || type === 'dblclick') {
		event = document.createEvent('MouseEvents');
		event.initMouseEvent(type, true, true, window,
			0, 0, 0, 0, 0, false, false, false, false, 0, null);
	}
	el.dispatchEvent(event);
}

beforeEach(function() {
	mimicopy.settings.initialize();
});

describe('Elements', function() {
	describe('connections', function() {
		var obj;
		beforeEach(function() {
			var elOuter = document.createElement('div');
			elOuter.innerHTML =
				'<div id="root">' +
					'<button id="button"></button>' +
					'<div class="checkboxes">' +
						'<input id="checkbox1" type="checkbox" />' +
						'<input id="checkbox2" type="checkbox" />' +
					'</div>' +
				'</div>';
			obj = {
				el: elOuter.firstChild,
				connectToElements: mimicopy._connectToElements
			};
			obj.connectToElements({
				button: {
					selector: '#button',
					click: function(event) {
						this.els.checkbox1.checked = true;
					},
					dblclick: function(event) {
						this.els.checkbox2.checked = true;
					}
				},
				checkbox1: {
					selector: '.checkboxes :nth-child(1)',
					initialize: function(el) {
						this.elCheckbox = el;
					}
				},
				checkbox2: '.checkboxes :nth-child(2)'
			});
		});

		it('get elements', function() {
			expect(obj.els.button).toBe(obj.el.querySelector('#button'));
			expect(obj.els.checkbox1).toBe(obj.el.querySelector('#checkbox1'));
			expect(obj.els.checkbox2).toBe(obj.el.querySelector('#checkbox2'));
		});

		it('runs initializations' ,function() {
			expect(obj.elCheckbox).toBe(obj.els.checkbox1);
		});

		it('adds event listeners' ,function() {
			var elButton = obj.el.querySelector('#button');
			fireEvent(elButton, 'click');
			fireEvent(elButton, 'dblclick');

			expect(obj.els.checkbox1.checked).toBeTruthy();
			expect(obj.els.checkbox2.checked).toBeTruthy();
		});
	});
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
