(function() {
	// gQuery Alpha
	var $ = function(){function d(b){return this instanceof a?this.
	_initialize(b):new a(b)}var a=d,b=a.fn=a.prototype,c=[].forEach;
	return b._initialize=function(a){var b=this,d=b.nodeList=
	document.querySelectorAll(a);return b.length=d.length,c.call(d,
	function(a,c){b[c]=a}),b},b.forEach=function(a){return c.call(
	this,a),this},a}();
	$.extend = function(source, props) {
		for (var name in props) { source[name] = props[name]; }
	};

	/*! Osteoporosis.js v1.0.1 By TAKANASHI Ginpei */
	var O=function(){var t={},i="prototype",n="extend",e=
	"trigger",o="attributes",r="_listeners",s=[].slice,u="undefined"
	==typeof _?$[n]:_[n],a=function(){};t[n]=function(e,o){function
	r(t){this.__osteoporosis__(t),this.initialize(t)}return r[n]=t[n
	],u(r[i],this[i],e),u(r,o),r};var h=t.eventPrototype={on:
	function(t,i){var n=this[r];n||(n=this[r]={});var e=n[t];e||(e=n
	[t]=[]),e.push(i)},trigger:function(t){var i=this[r];if(i&&i[t])
	{var n=s.call(arguments,1);i[t].forEach(function(t){t.apply(null
	,n)})}}};return t.Model=function(){},t.Model[n]=t[n],u(t.Model[i
	],{__osteoporosis__:function(t){return this[o]={},this.set(t)},
	initialize:a,set:function(t){var i=this[o];for(var n in t){var r
	=t[n],s=i[n];r!==s&&(i[n]=r,this[e]("change:"+n,this,r),this[e](
	"change",this))}return this},get:function(t){return this[o][t]},
	on:h.on,trigger:h[e]}),t.View=function(){},t.View[n]=t[n],u(t.
	View[i],{__osteoporosis__:function(t){t=t||{},this.$el=$(t.el||
	document)},initialize:a,$:function(t){return this.$el.find(t)},
	on:h.on,trigger:h[e]}),t}();

	var mimicopy = window.mimicopy = {
		initialize: function() {
			this.soundFileTable = { length:0 };
			this.reader = new FileReader();
			this.settings.initialize();

			this._connectToElements(this.elementConnections);
		},

		setupPlayer: function(file) {
			this.file = null;
			this.reader.onload = function(event) {
				this.file = file;
				this.player.src = event.target.result;
				this.load();
			}.bind(this);
			this.reader.readAsDataURL(file);
		},

		save: function() {
			this.settings.addRecipe({
				file: this.file,
				from: this.els.timeFrom.value,
				to: this.els.timeTo.value
			});
		},

		load: function() {
			var recipe = this.settings.getRecipe(this.file);
			if (recipe) {
				this.els.timeFrom.value = recipe.from;
				this.els.timeTo.value = recipe.to;
			}
			else {
				this.els.timeFrom.value = 0;
				this.els.timeTo.value = this.player.duration;
			}
			this.updateTimeRange();
		},

		updateTimeRange: function() {
			var max = this.player.duration;
			var from = Number(this.els.timeFrom.value);
			var to = Number(this.els.timeTo.value);

			this.els.timeFromText.setTime(from);
			this.els.timeToText.setTime(to);

			var pFrom = from / max * 100;
			var pRange = to / max * 100 - pFrom;

			this.els.timeRange.style.marginLeft = pFrom + '%';
			this.els.timeRange.style.width = pRange + '%';
		},

		map: function(array, callback) {
			return Array.prototype.map.call(array, callback);
		},

		escape: function (string) {
			var safe = string
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&quot;')
				.replace(/`/g, '&quot;');
			return safe;
		},

		f_setTime: function(time) {
			var min = parseInt(time/60, 10);
			var sec = ('0' + parseInt(time%60, 10)).slice(-2);
			var msec = ('000' + (time - parseInt(time, 10))).slice(-3);
			var text = min + ':' + sec + '.' + msec;
			this.innerHTML = text;
		},

		_connectToElements: function(elements) {
			var elRoot = this.el || document;
			var els = this.els = {};
			for (var name in elements) {
				var data = elements[name];
				if (typeof data === 'string') {
					els[name] = elRoot.querySelector(data);
				}
				else {
					var el = els[name] = elRoot.querySelector(data.selector);
					for (var type in data) {
						if (type === 'selector') {
							continue;
						}
						if (type === 'initialize') {
							data[type].call(this, el);
							continue;
						}
						el.addEventListener(type, data[type].bind(this));
					}
				}
			}
		},

		elementConnections: {
			body: 'body',

			droppable: {
				selector: 'html',
				dragover: function(event) {
					event.preventDefault();
					this.els.body.classList.add('is-dragover');
				},

				dragleave: function(event) {
					this.els.body.classList.remove('is-dragover');
				},

				drop: function(event) {
					event.preventDefault();
					this.els.body.classList.remove('is-dragover');

					var files = event.dataTransfer.files;
					var html = this.map(files, function(file, index) {
						var id = ++this.soundFileTable.length;
						this.soundFileTable[id] = { id:id, file:file };

						var classNameText = 'soundList-item js-soundList-item';
						if (this.player.canPlayType(file.type)) {
							classNameText += ' is-supported';
						}

						var html = '<li>';
						html += '<span class="' + classNameText + '" data-id="' + id + '">';
						html += this.escape(file.name);
						html += '</span></li>';
						return html;
					}.bind(this)).join('');
					this.els.soundList.innerHTML += html;
				}
			},

			timeRange: '.js-timeRange',

			play: {
				selector: '.js-play',
				click: function(event) {
					var currentTime = this.player.currentTime;
					var from = Number(this.els.timeFrom.value);
					var to = Number(this.els.timeTo.value);
					if (currentTime < from || to < currentTime) {
						this.player.currentTime = from;
					}
					this.player.play();
				}
			},

			pause: {
				selector: '.js-pause',
				click: function(event) {
					this.player.pause();
				}
			},

			currentTime: {
				selector: '.js-currentTime',
				change: function(event) {
					this.player.currentTime = event.currentTarget.value;
				}
			},

			timeFrom: {
				selector: '.js-timeFrom',
				change: function(event) {
					var from = Number(this.els.timeFrom.value);
					var to = Number(this.els.timeTo.value);
					if (from > to) {
						this.els.timeTo.value = from;
					}

					this.updateTimeRange();
				},
			},

			timeTo: {
				selector: '.js-timeTo',
				change: function(event) {
					var from = Number(this.els.timeFrom.value);
					var to = Number(this.els.timeTo.value);
					if (from > to) {
						this.els.timeFrom.value = to;
					}

					this.updateTimeRange();
				}
			},

			volume: {
				selector: '.js-volume',
				change: function(event) {
					this.player.volume = event.currentTarget.value;
				}
			},

			muted: {
				selector: '.js-muted',
				change: function(event) {
					this.player.muted = event.currentTarget.checked;
				}
			},

			currentTimeText: {
				selector: '.js-currentTimeText',
				initialize: function(el) { el.setTime = this.f_setTime; }
			},
			durationText: {
				selector: '.js-durationText',
				initialize: function(el) { el.setTime = this.f_setTime; }
			},
			timeFromText: {
				selector: '.js-timeFromText',
				initialize: function(el) { el.setTime = this.f_setTime; }
			},
			timeToText: {
				selector: '.js-timeToText',
				initialize: function(el) { el.setTime = this.f_setTime; }
			},

			soundList: {
				selector: '.js-soundList',

				click: function(event) {
					var el = event.target;
					while (el) {
						if (el.classList.contains('js-soundList-item')) {
							break;
						}
						else {
							el = el.parentNode;
							if (!el.classList) {
								el = null;
							}
						}
					}

					if (el && el.classList.contains('is-supported')) {
						var id = el.getAttribute('data-id');
						var file = this.soundFileTable[id].file;
						this.setupPlayer(file);
					}
				}
			},

			player: {
				selector: '.js-player',

				initialize: function(el) {
					this.player = el;
				},

				error: function(event) {
					this.els.play.disabled = true;
					this.els.pause.disabled = true;
				},

				canplay: function(event) {
					this.els.volume.value = this.player.volume;
					this.els.muted.checked = this.player.muted;
					this.els.volume.disabled = this.els.muted.disabled = false;
					this.els.save.disabled = this.els.load.disabled = false;

					this.player.play();
				},

				play: function(event) {
					this.els.play.disabled = true;
					this.els.pause.disabled = false;
				},

				pause: function(event) {
					this.els.play.disabled = false;
					this.els.pause.disabled = true;
				},

				volumechange: function(event) {
					this.els.volume.value = this.player.volume;
					this.els.muted.checked = this.player.muted;
				},

				durationchange: function(event) {
					var value = this.player.duration;
					if (value === Infinity) {
						this.els.currentTime.max = this.els.timeFrom.max = this.els.timeTo.max = 3600;
						this.els.durationText.innerHTML = '-:--.---';
						console.warn('Your browser does not support audio duration.');
					}
					else {
						this.els.currentTime.max = this.els.timeFrom.max = this.els.timeTo.max = value;
						this.els.durationText.setTime(value);
					}

					this.updateTimeRange();
				},

				timeupdate: function(event) {
					var currentTime = this.player.currentTime;
					var from = Number(this.els.timeFrom.value);
					var to = Number(this.els.timeTo.value);
					if (currentTime < from) {
						this.player.currentTime = from;
					}
					else if (currentTime > to) {
						this.player.currentTime = from;
					}
					else {
						this.els.currentTime.value = currentTime;
						this.els.currentTimeText.setTime(currentTime);
					}
				}
			},

			save: {
				selector: '.js-save',
				click: function(event) {
					this.save();
				}
			},

			load: {
				selector: '.js-load',
				click: function(event) {
					this.load();
				}
			}
		}
	};

	var settings = mimicopy.settings = {
		initialize: function() {
			this.recipes = this._buildRecipes();
		},

		_buildRecipes: function() {
			var storage;
			var data = window.localStorage.mimicopy;
			if (data) {
				storage = JSON.parse(data);
			}
			else {
				storage = {};
			}
			return storage;
		},

		_saveRacipes: function(storage) {
			var data = JSON.stringify(storage);
			window.localStorage.mimicopy = data;
		},

		addRecipe: function(settings) {
			var id = this._getRecipeId(settings.file);
			this.recipes[id] = {
				from: settings.from,
				to: settings.to
			};
			this._saveRacipes(this.recipes);
		},

		getRecipe: function(file) {
			var id = this._getRecipeId(file);
			var recipe = this.recipes[id];
			return recipe;
		},

		_getRecipeId: function(file) {
			var id = file.name + '-' +file.size + '-' +  file.type;
			return id;
		}
	};

	document.addEventListener('DOMContentLoaded', function(event) {
		mimicopy.initialize();
	});
})();