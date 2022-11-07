
const highlighter = {

	highlight : function() {
		tab.clear();
		setVariables();

		codeBuilder.build('js-jq');

		if(currentType === 'string_' || currentType === 'array') {
			this.markStringArray();

		} else if(currentType === 'regexp') {
			this.markRegExp();

		} else if(currentType === 'ranges') {
			this.markRanges();
		}
	},

	markStringArray : function() {
		const parameter = this.getSearchParameter(currentType === 'array' ? 'Array' : 'String');
		if( !parameter) return;

		const hl = this,
			settings = this.getCurrentSettings();

		const options = {
			'element' : settings.element,
			'className' : settings.className,
			'separateWordSearch' : settings.separateWordSearch,
			'diacritics' : settings.diacritics,
			'caseSensitive' : settings.caseSensitive,
			'ignoreJoiners' : settings.ignoreJoiners,
			'acrossElements' : settings.acrossElements,
			'shadowDOM' : settings.shadowDOM,

			'accuracy' : settings.accuracy,
			'wildcards' : settings.wildcards,

			'synonyms' : settings.synonyms,
			'ignorePunctuation' : settings.ignorePunctuation,
			'exclude' : settings.exclude,

			'iframes' : settings.iframes,
			'iframesTimeout' : settings.iframesTimeout,

			/*'filter' : (node, term, marks, count, info) => {
				insideShadow = node.insideShadowRoot;
				return true;
			},*/
			'each' : (elem, info) => {
				hl.flagStartElement(elem, info);
			},
			'debug' : settings.debug,
			'done' : hl.finish,
			'noMatch' : (t) => { noMatchTerms.push(t); }
		};

		if( !currentLibrary.old) {
			options.combinePatterns = settings.combinePatterns;
			options.cacheTextNodes = settings.cacheTextNodes;

			if(settings.acrossElements) {
				options.wrapAllRanges = settings.wrapAllRanges;
				options.blockElementsBoundary = settings.blockElementsBoundary;
			}
		}

		settings.testContainer.unmark({
			'shadowDOM' : settings.shadowDOM,
			'done' : () => {
				time = performance.now();
				settings.context.mark(parameter, options);
			}
		});
	},

	markRegExp : function() {
		const regex = this.getSearchParameter('RegExp');
		if( !regex) return;

		const hl = this,
			settings = this.getCurrentSettings();

		const options = {
			'element' : settings.element,
			'className' : settings.className,
			'acrossElements' : settings.acrossElements,
			'ignoreGroups' : settings.ignoreGroups,
			'separateGroups' : settings.separateGroups,
			'wrapAllRanges' : settings.wrapAllRanges,
			'shadowDOM' : settings.shadowDOM,
			'exclude' : settings.exclude,
			'blockElementsBoundary' : settings.blockElementsBoundary,
			'iframes' : settings.iframes,
			'iframesTimeout' : settings.iframesTimeout,

			/*'filter' : (node, match, totalMarks, info) => {
				return true;
			},*/
			'each' : (elem, info) => {
				hl.flagStartElement(elem, info);
			},
			'debug' : settings.debug,
			'done' : hl.finish,
			'noMatch' : (reg) => { noMatchTerms.push(reg); }
		};

		settings.testContainer.unmark({
			'shadowDOM' : settings.shadowDOM,
			'done' : () => {
				time = performance.now();
				settings.context.markRegExp(regex, options);
			}
		});
	},

	markRanges : function() {
		const ranges = this.getSearchParameter('Ranges');
		if( !ranges) return;

		const hl = this,
			settings = this.getCurrentSettings();

		const options = {
			'element' : settings.element,
			'className' : settings.className,
			'wrapAllRanges' : settings.wrapAllRanges,
			'shadowDOM' : settings.shadowDOM,
			'exclude' : settings.exclude,
			'iframes' : settings.iframes,
			'iframesTimeout' : settings.iframesTimeout,

			/*'filter' : (node, range, match, counter) => {
				return true;
			},*/
			'each' : (elem, range, info) => {
				hl.flagStartElement(elem, info);
			},

			'debug' : settings.debug,
			'done' : hl.finish
		};

		settings.testContainer.unmark({
			'shadowDOM' : settings.shadowDOM,
			'done' : () => {
				time = performance.now();
				settings.context.markRanges(ranges, options);
			}
		});
	},

	highlightRawHtml : function(elem, text) {
		time = performance.now();
		tab.clear(true);
		setVariables();

		const markReg = new RegExp(`<\/?${markElement}([> ])`, 'g'),
			openReg = new RegExp(`data-markjs="([^"]+)"[^>]*>`, 'y'),
			stack = [];

		let totalMarks = 0,
			totalMatches = 0,
			data = '',
			html = '',
			number = '0',
			index = 0,
			match;

		// RegExp don't support balance groups, which makes it difficult to find open/close pairs of tags when mark elements are nested
		// this is a workaround
		while((match = markReg.exec(text)) !== null) {
			let i = match.index;

			if(match[1] === '>' && stack.length) {
				data = stack.pop();

				if(index < i) {
					html += wrap(index, i, data, true);
				}

				index = markReg.lastIndex;
				html += wrap(i, index, data) + `</mark>`;

			} else if(match[1] === ' ') {
				openReg.lastIndex = markReg.lastIndex;

				if((match = openReg.exec(text)) !== null) {
					if(index < i) {
						html += stack.length ? wrap(index, i, data, true) : util.entitize(text.substring(index, i));
					}

					data = match[1];

					if(data === 'start-1') {
						data = 'true';
						totalMatches++;

					} else if(canBeNested && data > number) {
						number = data;
					}

					markReg.lastIndex = index = openReg.lastIndex;
					html += `<mark data-markjs="${match[1]}" class="mark-element">` + wrap(i, index, data);

					stack.push(data);
					totalMarks++;
				}
			}
		}

		function wrap(start, end, data, term) {
			return `<mark data-markjs="${data}"${term ? ' class="mark-term"' : ''}>${util.entitize(text.substring(start, end))}</mark>`;
		}

		if(index < text.length - 1) {
			html += util.entitize(text.substring(index, text.length - 1));
		}

		if(canBeNested && number !== '0') {
			totalMatches = parseInt(number) + 1;
		}

		elem.innerHTML = html;

		markElement = 'mark';
		markElementSelector = `mark[data-markjs]`;

		this.finish(totalMarks, totalMatches, null);
	},

	flagStartElement : function(elem, info) {
		if(canBeNested) {
			$(elem).attr('data-markjs', info ? info.count - 1 : matchCount++);

		} else if(flagEveryElement || !info || info.matchStart) {
			$(elem).attr('data-markjs', 'start-1');
		}
	},

	getCurrentSettings : function() {
		// disable contenteditable attribute for performance reason
		tab.setEditableAttribute(false);

		const obj = {};

		obj.context = getTestContexts();
		obj.testContainer = getTestContainer();

		obj.element = $(`${optionPad} .element input`).val().trim();
		obj.className = $(`${optionPad} .className input`).val().trim();

		obj.exclude = this.tryToEvaluate('exclude', 4) || [];
		obj.debug = tab.isChecked('debug');

		obj.iframes = tab.isChecked('iframes');
		if(obj.iframes) {
			obj.iframesTimeout = util.getNumericalValue('iframesTimeout', 5000);
		}

		if(currentType === 'string_' || currentType === 'array') {
			obj.separateWordSearch = tab.isChecked('separateWordSearch');
			obj.diacritics = tab.isChecked('diacritics');
			obj.caseSensitive = tab.isChecked('caseSensitive');
			obj.ignoreJoiners = tab.isChecked('ignoreJoiners');

			obj.accuracy = $(`${optionPad} .accuracy select`).val();
			obj.wildcards = $(`${optionPad} .wildcards select`).val();

			obj.synonyms = this.tryToEvaluate('synonyms', 8) || {};
			obj.ignorePunctuation = this.tryToEvaluate('ignorePunctuation', 4) || [];

			if(obj.accuracy === 'exactly' || obj.accuracy === 'complementary') {
				const accuracy = this.tryToEvaluate('accuracyObject', 30);
				if(accuracy) {
					obj.accuracy = accuracy;
				}
			}

		} else if(currentType === 'regexp') {
			obj.separateGroups = tab.isChecked('separateGroups');

			if( !obj.separateGroups) {
				obj.ignoreGroups = util.getNumericalValue('ignoreGroups', 0);
			}
		}

		if(currentType !== 'ranges') {
			obj.acrossElements = tab.isChecked('acrossElements');
		}

		if( !currentLibrary.old) {
			const shadowDOM = tab.isChecked('shadowDOM');
			if(shadowDOM) {
				const styleObj = this.tryToEvaluate('shadowStyle', 16);
				if(styleObj) {
					obj.shadowDOM = styleObj;

				} else {
					obj.shadowDOM = true;
				}
			}

			if(obj.acrossElements && currentType !== 'ranges') {
				const boundary = tab.isChecked('blockElementsBoundary');
				if(boundary) {
					const blockElements = this.tryToEvaluate('blockElements', 5);
					if(blockElements) {
						obj.blockElementsBoundary = blockElements;

					} else {
						obj.blockElementsBoundary = true;
					}
				}
			}

			if(markArray() && tab.isChecked('cacheTextNodes') && tab.isChecked('acrossElements')
				|| currentType === 'regexp' && tab.isChecked('separateGroups')
				|| currentType === 'ranges') {
				obj.wrapAllRanges = tab.isChecked('wrapAllRanges');
			}

			if(markArray()) {
				obj.cacheTextNodes = tab.isChecked('cacheTextNodes');

				const combine = tab.isChecked('combinePatterns');
				if(combine) {
					obj.combinePatterns = util.getNumericalValue('combineNumber', 10);
				}
			}
		}

		return obj;
	},

	tryToEvaluate : function(option, minLength) {
		const editor = tab.getOptionEditor(option);
		let text;

		if(editor) {
			text = editor.toString().trim();

			if(text.length > minLength) {
				try {
					return new Function('"use strict"; return (' + text + ')')();

				} catch(e) {
					log(`Failed to evaluate ${option} object:\n${e.message}`, true);
					$(`${optionPad} .${option} .editor`).addClass('error');
				}

			} else if(text) {
				log(`Skips evaluating ${option} object due to suspicious length.`, false, true);
				$(`${optionPad} .${option} .editor`).addClass('warning');
			}
		}
		return null;
	},

	getSearchParameter : function(name) {
		const info = tab.getSearchEditorInfo(),
			parameter = info.editor.toString();
		if( !parameter.trim()) return null;

		let result;

		if(currentType === 'string_') {
			result = parameter;

		} else {
			try {
				result = new Function('"use strict"; return (' + parameter + ')')();

			} catch(e) {
				log(`Failed to evaluate the ${name}:\n${e.message}`, true);
				$(selector).addClass('error');
				return null;
			}
		}
		return result;
	},

	getMarkElements : function() {
		const elem = tab.getTestElement();
		let markElements;

		if(tab.isChecked('shadowDOM')) {
			const className = types[currentType].testEditorMode === 'text' ? $(`${optionPad} .className input`).val().trim() : null;
			markElements = this.collectMarkElements(elem, className);

		} else {
			markElements = elem.querySelectorAll(markElementSelector);
		}
		return $(markElements);
	},

	collectMarkElements : function(root, className) {
		var elements = [];

		var loop = function(node) {
			while(node) {
				if(node.nodeType === Node.ELEMENT_NODE) {
					if(node.nodeName.toLowerCase() === markElement && node.hasAttribute('data-markjs')) {
						if( !className || node.classList.contains(className)) elements.push(node);
					}

					if(node.shadowRoot && node.shadowRoot.mode === 'open') {
						let elem = node.shadowRoot.querySelector(':first-child');
						if(elem) {
							loop(elem);
						}
					}
				}

				if(node.hasChildNodes()) {
					loop(node.firstChild);
				}
				node = node.nextSibling;
			}
		};

		loop(root.firstChild);

		return elements;
	},

	finish : function(totalMarks, totalMatches, termStats) {
		matchCount = totalMatches || totalMarks;

		let matches = totalMatches ? `totalMatches = ${totalMatches}\n` : '',
			totalTime = (performance.now() - time) | 0,
			array = noMatchTerms.flat(),
			len = array.length,
			span = '<span class="header">',
			noMatch = len ? `\n\n${span}${currentType === 'regexp' ? 'No match' : `Not found term${len > 1 ? 's' : ''}`} : </span>${array.join('<b>,</b> ')}` : '',
			stats = termStats ? writeTermStats(termStats, `\n\n${span}Terms stats : </span>`) : '';

		log(`mark time = ${totalTime} ms\n${matches}totalMarks = ${totalMarks}${stats}${noMatch}`);

		marks = highlighter.getMarkElements();

		if(marks.length > 0) {
			if(markElement !== 'mark') {
				marks.addClass('custom-element');
			}

			if(canBeNested) {
				highlightMatch2();

			} else {
				startElements = marks.filter((i, elem) => $(elem).data('markjs') === 'start-1');
				// synchronizes current match in both 'text' and 'html' modes
				let elem;
				if(currentIndex !== -1 && (elem = startElements.eq(currentIndex)).length) {
					highlightMatch(elem);

				} else {
					highlightMatch(marks.first());
				}
			}
		}

		// restore contenteditable attribute
		tab.setEditableAttribute(true);
	}
};
