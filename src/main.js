
'use strict';

let version = '1.0.0',
	maxLength = 500000,
	time = 0,
	oldLibrary = false,
	jqueryMark = false,
	showTooltips = false,
	currentIndex = 0,
	currentTab = '',
	testContainerSelector = '',
	markElementSelector = '',
	markElement = '',
	jsonEditor = null,
	marks = $(),
	startElements = $(),
	settings = {},
	previousButton = $(`.previous`),
	nextButton = $(`.next`);

const types = {
	string_ : {
		options : [ 'element', 'className', 'exclude', 'separateWordSearch', 'accuracy', 'diacritics', 'synonyms', 'iframes', 'iframesTimeout', 'acrossElements', 'caseSensitive', 'ignoreJoiners', 'ignorePunctuation', 'wildcards', 'debug' ],
		editors : { 'queryString' : null, 'testString' : null, 'exclude' : null, 'synonyms' : null, 'ignorePunctuation' : null, 'accuracyObject' : null, 'filterCallback' : null, 'eachCallback' : null },
		queryEditor : 'queryString',
		testEditorMode : 'text'
	},

	array : {
		options : [ 'element', 'className', 'exclude', 'separateWordSearch', 'accuracy', 'diacritics', 'synonyms', 'iframes', 'iframesTimeout', 'acrossElements', 'caseSensitive', 'ignoreJoiners', 'ignorePunctuation', 'wildcards', 'cacheTextNodes', 'wrapAllRanges', 'debug' ],
		editors : { 'queryArray' : null, 'testString' : null, 'exclude' : null, 'synonyms' : null, 'ignorePunctuation' : null, 'accuracyObject' : null, 'filterCallback' : null, 'eachCallback' : null },
		queryEditor : 'queryArray',
		testEditorMode : 'text'
	},

	regexp : {
		options : [ 'element', 'className', 'exclude', 'iframes', 'iframesTimeout', 'acrossElements', 'ignoreGroups', 'separateGroups', 'blockElementsBoundary', 'blockElements', 'wrapAllRanges', 'debug' ],
		editors : { 'queryRegExp' : null, 'testString' : null, 'exclude' : null, 'blockElements' : null, 'filterCallback' : null, 'eachCallback' : null },
		queryEditor : 'queryRegExp',
		testEditorMode : 'text'
	},

	ranges : {
		options : [ 'element', 'className', 'exclude', 'iframes', 'iframesTimeout', 'wrapAllRanges', 'debug' ],
		editors : { 'queryRanges' : null, 'testString' : null, 'exclude' : null, 'filterCallback' : null, 'eachCallback' : null },
		queryEditor : 'queryRanges',
		testEditorMode : 'text'
	}
};

const newOptions = [ 'blockElementsBoundary', 'cacheTextNodes', 'wrapAllRanges' ];

const defaultOptions = {
	element : [ 'mark', 'text' ],
	className : [ '', 'text' ],
	exclude : [[], 'editor' ],
	separateWordSearch : [ true, 'checkbox' ],
	diacritics : [ true, 'checkbox' ],
	accuracy : [ 'partially', 'select' ],
	synonyms : [ {}, 'editor' ],
	iframes : [ false, 'checkbox' ],
	iframesTimeout : [ '5000', 'number' ],
	acrossElements : [ false, 'checkbox' ],
	caseSensitive : [ false, 'checkbox' ],
	ignoreJoiners : [ false, 'checkbox' ],
	ignorePunctuation : [[], 'editor' ],
	wildcards : [ 'disabled', 'select' ],
	ignoreGroups : [ '0', 'number' ],
	cacheTextNodes : [ false, 'checkbox' ],
	wrapAllRanges : [ false, 'checkbox' ],
	separateGroups : [ false, 'checkbox' ],
	blockElementsBoundary : [ false, 'checkbox' ],
	blockElements : [[], 'editor' ],
	debug : [ false, 'checkbox' ],
	log : [ false, 'checkbox' ],
};

$(document).ready(function() {
	let t0 = performance.now();

	detectLibrary();
	//testSaveLoad();

	registerEvents();
	tab.selectTab();
	tab.initTab();

	console.log('total time - ' + (performance.now() - t0));
});

const tab = {
	initTab : function() {
		this.initializeEditors();
		this.loadDefaultHtml();
		this.loadDefaultSearchParameter();

		this.setLoadButton();

		this.clear();
		highlighter.highlight();
	},

	selectTab : function(type) {
		if( !type) {
			type = getValue('tabType');
			if( !type) type = 'string_';
		}

		$('.mark-type li').removeClass('selected');
		$('.mark-type li[data-type=' + type + ']').addClass('selected');

		setValue('tabType', type);

		if(type === 'string_') {
			this.setVisibleString();

		} else if(type === 'array') {
			this.setVisibleArray();

		} else if(type === 'regexp') {
			this.setVisibleRegExp();

		} else if(type === 'ranges') {
			this.setVisibleRanges();
		}

		checkIframes($(`section.${type} .iframes input`)[0]);

		testContainerSelector = `section.${type} .testString .editor`;

		this.initializeEditors();
		this.clear();
	},

	setVisibleString : function() {
		$('section.string_').removeClass('hide');
		$('section.array').addClass('hide');
		$('section.regexp').addClass('hide');
		$('section.ranges').addClass('hide');

		checkAccuracy($('section.string_ .accuracy>select')[0]);
	},

	setVisibleArray : function() {
		$('section.string_').addClass('hide');
		$('section.array').removeClass('hide');
		$('section.regexp').addClass('hide');
		$('section.ranges').addClass('hide');

		checkAccuracy($('section.array .accuracy>select')[0]);
	},

	setVisibleRegExp : function() {
		$('section.string_').addClass('hide');
		$('section.array').addClass('hide');
		$('section.regexp').removeClass('hide');
		$('section.ranges').addClass('hide');
		this.switchElements($('.blockElementsBoundary input'), '.blockElements');
	},

	setVisibleRanges : function() {
		$('section.string_').addClass('hide');
		$('section.array').addClass('hide');
		$('section.regexp').addClass('hide');
		$('section.ranges').removeClass('hide');
	},

	switchElements : function(elem, selector) {
		let checked = elem.prop('checked');

		if(checked) $(selector).removeClass('hide');
		else $(selector).addClass('hide');
	},

	loadDefaultHtml : function() {
		const info = this.getTestEditorInfo();

		if(info) {
			if(info.editor.toString().trim() === '') {
				//$(info.selector).html(minHtml);
				$(info.selector).html(defaultHtml);

				testContainerSelector = info.selector;
				types[info.type].testEditorMode = 'text';
				this.highlightButton('.text');
			}
		}
	},

	loadDefaultSearchParameter : function() {
		const info = this.getSearchEditorInfo();
		if( !info) return;

		if(info.editor.toString().trim() === '') {
			const searchParameter = defaultSearchParameter[info.type];

			if(searchParameter) {
				let str = searchParameter;

				if(info.type === 'array' || info.type === 'ranges') {
					str = JSON.stringify(searchParameter);
				}
				info.editor.updateCode(str);
			}
		}
	},

	setHtmlMode : function(content, highlight = true) {
		const info = this.getTestEditorInfo();

		if( !info || types[info.type].testEditorMode === 'html') return;

		types[info.type].testEditorMode = 'html';

		const editor = $(info.selector),
			html = content !== null ? content : editor.html();

		if(html !== '') {
			// as it turn out, the performance problem causes contenteditable attribute
			// nevertheless, it's better to replace the editor node by the new one
			this.destroyTestEditor();

			const parent = editor.parent();
			editor.remove();
			parent.append('<div class="editor lang-html"></div>');

			$(info.selector).text(html);

			if(highlight) {
				// it's still better to avoid syntax highlighting in some cases - the performance is more important
				let forbid = html.length > maxLength || oldLibrary && (isChecked('acrossElements') || info.type === 'ranges') && html.length > maxLength / 10;
				if( !forbid) {
					hljs.highlightElement($(info.selector)[0]);
				}

				highlighter.highlightRawHtml(info.selector);
			}

			this.initializeEditors();

		} else {
			info.editor.updateCode('');
		}

		this.highlightButton('.html');
	},

	setTextMode : function(content = null) {
		const info = this.getTestEditorInfo();

		if( !info || types[info.type].testEditorMode === 'text') return;

		types[info.type].testEditorMode = 'text';

		const editor = $(info.selector),
			text = content !== null ? content : editor.text();

		if(text !== '') {
			// switching from html mode to text one with large highlighted html content is very slowly
			// this is a workaround for this issue
			this.destroyTestEditor();

			const parent = editor.parent();
			editor.remove();
			parent.append('<div class="editor"></div>');

			$(info.selector).html(text);

			runCode();
			this.initializeEditors();

		} else {
			info.editor.updateCode('');
		}

		this.highlightButton('.text');
	},

	highlightButton : function(selector) {
		const info = this.getTestEditorInfo(),
			parent = $(info.selector).parent();

		parent.find(selector).addClass('pressed');
		parent.find(selector === '.text' ? '.html' : '.text').removeClass('pressed');
	},

	initializeEditors : function() {
		const type = this.getType(),
			obj = types[type];

		for(const key in obj.editors) {
			if(obj.editors[key] === null) {
				let selector = `section.${type} .${key} .editor`;
				obj.editors[key] = CodeJar(document.querySelector(selector), () => {});
			}
		}
	},

	destroyTestEditor : function() {
		const obj = types[this.getType()];

		obj.editors.testString.destroy();
		obj.editors.testString = null;
	},

	getSearchEditorInfo : function() {
		const type = this.getType(),
			obj = types[type],
			selector = `section.${type} .${obj.queryEditor} .editor`,
			editor = obj.editors[obj.queryEditor];

		if( !editor) return  null;

		return  { type, selector, editor };
	},

	getTestEditorInfo : function() {
		const type = this.getType(),
			obj = types[type],
			selector = `section.${type} .testString .editor`,
			editor = obj.editors.testString;

		//if( !editor) return  null;
		if( !editor) { obj.editors.testString = CodeJar(document.querySelector(selector), () => {}); }

		return  { type, selector, editor };
	},

	getOptionEditor : function(option) {
		if(option) {
			const type = this.getType();

			return  types[type].editors[option];
		}
		return  null;
	},

	clear : function() {
		$('.results code').empty();
		$('.generated-code code').empty();
		$('body *').removeClass('warning');
		marks = $();
		startElements = $();
	},

	setLoadButton : function() {
		$('.toolbar button.load').css('opacity', getValue('section_' + this.getType()) ? 1 : 0.5);
	},

	getType : function() {
		return  $("article .mark-type li.selected").data('type');
	}
};

// DOM 'onclick' event
function checkSeparateGroups(elem) {
	const div = $(elem).parents('section').first().find('.ignoreGroups');

	if($(elem).prop('checked')) div.addClass('hide');
	else div.removeClass('hide');
}

// also DOM 'onclick' event
function checkIframes(elem) {
	const div = $(elem).parents('section').first().find('.iframesTimeout');

	if($(elem).prop('checked')) div.removeClass('hide');
	else div.addClass('hide');
}

// also DOM 'onclick' event
function checkAccuracy(elem) {
	const div = $(elem).parents('section').first().find('.accuracyObject');

	if(elem.value === 'object') div.removeClass('hide');
	else div.addClass('hide');
}

// DOM 'onclick' event
function setTextMode() {
	tab.setTextMode();
}

// DOM 'onclick' event
function setHtmlMode() {
	tab.setHtmlMode(null, true);
}

// DOM 'onclick' event
function loadDefaultHtml() {
	tab.loadDefaultHtml();
}

// DOM 'onclick' event
function save() {
	const str = Json.buildJson();

	if(str) {
		setValue('section_' + tab.getType(), str);
		tab.setLoadButton();
	}
}

// DOM 'onclick' event
function load() {
	importer.loadOptions();
}

// DOM 'onclick' event
function exportJson() {
	const json = Json.buildJson(true);

	if(json) {
		jsonEditor.updateCode(json);
		$('button.import-json').attr('disabled', false);
	}
}

// DOM 'onclick' event
function importJson() {
	importer.loadJson();
}

// DOM 'onclick' event
function clearJsonEditor() {
	jsonEditor.updateCode('');
	$('button.import-json').attr('disabled', true);
}

// DOM 'onclick' event
function clearEditor(elem) {
	const type = tab.getType(),
		parent = elem.parentNode.parentNode,
		obj = types[type];

	let editor = obj.editors[parent.className];

	if(editor) {
		editor.updateCode('');
	}
}

const importer = {
	loadOptions : function() {
		const type = tab.getType(),
			str = getValue('section_' + type);

		if(str) {
			const json = Json.parseJson(str);
			if( !json) return;

			this.setOptions(type, json);

		} else {
			log('Something is wrong with the local storage', true);
		}
	},

	loadOptionsFromFile : function(str) {
		if( !str) return;

		const json = Json.parseJson(str);
		if( !json) return;

		const type = json.section['type'];

		if(type && types[type]) {
			tab.selectTab(type);
			this.setOptions(type, json);

		} else {
			log('Something is wrong with the json file', true);
		}
	},

	loadJson : function() {
		let str = jsonEditor.toString().trim();

		if(str) {
			const json = Json.parseJson(str);
			if( !json) return;

			const type = json.section['type'];

			if(type && types[type]) {
				tab.selectTab(type);
				this.setOptions(type, json);

				const info = tab.getTestEditorInfo();

				if($(info.selector).parent().find('button.pressed.html').length) {
					hljs.highlightElement($(info.selector)[0]);
				}

				if(types[type].testEditorMode === 'text') {
					runCode();
				}

			} else {
				log('Something is wrong with the json', true);
			}
		}
	},

	setOptions : function(type, json) {
		const obj = types[type],
			textMode = obj.testEditorMode === 'text';

		let opt, editor, value, saved;

		obj.options.every(option => {
			if(oldLibrary && newOptions.indexOf(option) !== -1) return  false;

			const selector = `section.${type} .${option}`;

			value = defaultOptions[option];
			saved = json.section[option];

			if(typeof saved === 'undefined' || saved === 'null') {
				saved = value[0];
			}

			if(value) {
				switch(value[1]) {
					case 'checkbox' :
						$(selector + ' input').prop('checked', saved);
						break;

					case 'text' :
					case 'number' :
						$(selector + ' input').val(saved);
						break;

					case 'select' :
						$(selector + ' select').val(saved);
						break;

					default : break;
				}
			}
			return  true;
		});

		for(const key in obj.editors) {
			editor = obj.editors[key];
			saved = json.section[key];

			if(typeof saved === 'undefined' || saved === 'null') {
				editor.updateCode('');

			} else if(key === 'testString') {
				const mode = typeof saved.mode === 'undefined' || saved.mode !== 'html' ? 'text' : saved.mode;
				const content = typeof saved.content === 'undefined' ? '' : saved.content;

				if(mode === 'text') {
					tab.setTextMode(content);

				} else {
					tab.setHtmlMode(content);
				}

			} else {
				editor.updateCode(saved);
			}
		}

		if(textMode) {
			tab.setTextMode();
			highlighter.highlight();
		}
	}
};

function updateVariables(type, element, className) {
	previousButton = $(`section.${type} .testString .previous`);
	nextButton = $(`section.${type} .testString .next`);

	// requires to highlight the custom element
	markElement = element || 'mark';
	markElementSelector = `${testContainerSelector} ${markElement}[data-markjs]`;
}

// DOM 'onclick' event
function switchLibrary(elem) {
	const info = getLibrariesInfo();

	if($(elem).prop('checked')) {
		oldLibrary = false;
		jqueryMark = info.jquery === 'new';

	} else {
		oldLibrary = true;
		jqueryMark = info.jquery === 'old';
	}

	setValue('library', oldLibrary ? 'old' : 'new');

	setVisibility();
	runCode();
}

// DOM 'onclick' event
function unmarkMethod(elem) {
	codeBuilder.build('all', $(elem).prop('checked'));
}

// DOM 'onclick' event
function buildCode() {
	codeBuilder.build('all');
}

// also DOM 'onclick' event
function runCode(button) {
	//if(types[tab.getType()].testEditorMode === 'html') return;

	tab.clear();

	if(codeBuilder.buildCallbacks().length > 3) {
		let code = codeBuilder.build('internal');

		if(code) {
			log('Evaluating the whole expression\n');

			try { eval(`'use strict'; ${code}`); } catch(e) {
				log('Failed to evaluate the code\n' + e.message, true);
			}
			$('.internal-code').removeClass('hide');
			$('.internal-code pre>code').text(code);

			hljs.highlightElement($('.internal-code pre>code')[0]);
		}

	} else {
		highlighter.highlight();
	}
}

const codeBuilder = {
	build : function(kind) {
		const jsCode = this.buildCode('js');
		if( !jsCode) return  '';

		$('.generated-code pre>code').text(jsCode);

		const jqCode = this.buildCode('jq');
		if(jqCode) {
			$('.generated-code pre>code').append('\n\n' + jqCode);
		}

		hljs.highlightElement($('.generated-code pre>code')[0]);

		$('.internal-code').addClass('hide');

		if(kind === 'internal') {
			return  this.buildCode(kind);
		}
	},

	buildCode : function(kind) {
		const info = tab.getSearchEditorInfo();
		const testInfo = tab.getTestEditorInfo();

		if( !info || !testInfo) return  null;

		const type = tab.getType(),
			unmark = kind === 'internal' ? true : $('.unmark-method input').prop('checked'),
			optionCode = this.buildOptions(type, kind, unmark);

		let code = '',
			str = '',
			text;

		if(kind === 'jq') {
			code = `//jQuery\n$('selector')` + (unmark ? `.unmark({\n  'done' : () => {\n    $('selector')` : '');

		} else if(kind === 'js') {
			code = `// javascript\nconst instance = new Mark(document.querySelector('selector'));\ninstance` + (unmark ? `.unmark({\n  'done' : () => {\n    instance` : '');

		} else {
			const context = jqueryMark ? `$('${testInfo.selector}')` : `new Mark(document.querySelector('${testInfo.selector}'))`,
				variables = `let a = [], o = {}, c = '', s = '', m = 0, n = 0;\n`;
			code += `${context}.unmark({\n  'done' : () => {\n    ${variables}\n    ${context}`;
		}

		if(info && (text = info.editor.toString().trim()).length) {
			switch(type) {
				case 'string_' :
					str = `.mark('${text}', ${optionCode});`;
					break;

				case 'array' :
					str = `.mark(${text}, ${optionCode});`;
					break;

				case 'regexp' :
					str = `.markRegExp(${text}, ${optionCode});`;
					break;

				case 'ranges' :
					str = `.markRanges(${text}, ${optionCode});`;
					break;

				default : break;
			}
		}

		code += str + (unmark ? '\n  }\n});' : '');

		if( !str) {
			$('.generated-code code').text('');
			log(`Missing ${type} search parameter`, true);
			return  '';
		}
		return  code;
	},

	buildOptions : function(type, kind, unmark) {
		const obj = types[type],
			indent = ' '.repeat(unmark ? 6 : 2),
			end = unmark ? ' '.repeat(4) : '';

		if( !obj) return  '{}';

		let opt, text, element, className, code = '';

		obj.options.forEach(option => {
			const selector = `section.${type} .${option}`,
				value = defaultOptions[option];

			if(value) {
				switch(value[1]) {
					case 'checkbox' :
						opt = $(selector + ' input').prop('checked');

						if(opt !== value[0]) {
							code += `${indent}${option} : ${opt},\n`;
						}
						break;

					case 'text' :
						text = $(selector + ' input').val();

						if(text && text !== value[0]) {
							code += `${indent}${option} : '${text}',\n`;

							if(option === 'element') {
								element = text;

							} else if(option === 'className') {
								className = text;
							}
						}
						break;

					case 'editor' :
						if(option !== 'accuracyObject') {
							const editor = tab.getOptionEditor(option);

							if(editor && (text = editor.toString().trim()).length) {
								code += `${indent}${option} : ${text},\n`;
							}
						}
						break;

					case 'select' :
						opt = $(selector + ' select').val();

						if(opt !== value[0]) {
							if(opt === 'object') {
								const editor = tab.getOptionEditor('accuracyObject');

								if(editor && (text = editor.toString().trim()).length > 30) {
									code += `${indent}${option} : ${text},\n`;
								}

							} else {
								code += `${indent}${option} : '${opt}',\n`;
							}
						}
						break;

					case 'number' :
						if(option === 'iframesTimeout' && !isChecked('iframes')) break;

						opt = $(selector + ' input').val();

						if(opt !== value[0]) {
							code += `${indent}${option} : ${opt},\n`;
						}
						break;

					default : break;
				}
			}
		});

		code += this.buildCallbacks(type, kind, unmark);

		if(kind === 'internal') {
			code = `{\n${code}${indent}done : highlighter.finish\n${end}}`;

		} else {
			if(oldLibrary) {
				code = `{\n${code}${indent}done : (totalMarks) => {}\n${end}}`;

			} else {
				const stats = type === 'string_' || type === 'array';
				code = `{\n${code}${indent}done : done : (totalMarks, totalMatches${stats ? ', termStats' : ''}) => {}\n${end}}`;
			}
		}

		updateVariables(type, element, className);

		return  code;
	},

	buildCallbacks : function(type, kind, unmark) {
		let code = '',
			indent = ' '.repeat(unmark ? 6 : 2),
			indent2 = ' '.repeat(unmark ? 8 : 4);

		const filter = getCode('filterCallback');
		if(filter) {
			code = `${indent}${getFilter()}\n${indent2}${filter}\n${indent2}return true;\n${indent}},\n`;
		}

		const each = getCode('eachCallback');

		if(kind !== 'internal') {
			if(each) {
				code += `${indent}${getEach()}\n${indent2}${each}\n${indent}},\n`;
			}

		} else if(code || each) {
			// necessary for the next/previous buttons functionality in the internal code
			const acrossElements = type === 'ranges' ? false : isChecked('acrossElements'),
				flagStartElem = `highlighter.flagStartElement(element, ${oldLibrary ? null : 'info'}, ${acrossElements});`;

			code += `${indent}${getEach()}\n${indent2}${flagStartElem}\n${indent}`;
			code += each ? `  ${each}\n${indent}},\n` : '},\n';
		}

		function getCode(callback) {
			const editor = tab.getOptionEditor(callback),
				text = editor.toString().trim();

			return  text && text.length > 2 ? text.replace(/\n|$/g, (m) => m + indent2) : '';
		}

		function getFilter() {
			if(type === 'string_' || type === 'array') {
				return  `'filter' : (node, term, marks, count${oldLibrary ? '' : ', info'}) => {`;

			} else if(type === 'regexp') {
				return  `'filter' : (node, matchString, count${oldLibrary ? '' : ', info'}) => {`;

			}
			return  `'filter' : (node, range, matchString, index) => {`;
		}

		function getEach() {
			if(type === 'ranges') {
				return  `'each' : (element, range) => {`;
			}
			return  `'each' : (element${oldLibrary ? '' : ', info'}) => {`;
		}

		return  code;
	}
};

const Json = {
	buildJson : function(format) {
		const type = tab.getType(),
			obj = types[type];

		let textMode = false;

		if(obj.testEditorMode === 'text') {
			tab.setHtmlMode(null, false);
			textMode = true;
		}

		let json = this.serialiseOptions(type, `{"version":"${version}","section":{`),
			editor = tab.getOptionEditor(obj.queryEditor),
			text;

		if(editor && (text = editor.toString().trim()).length) {
			json += `,"${obj.queryEditor}":${JSON.stringify(text)}`;
		}

		const info = tab.getTestEditorInfo();

		if(info && (text = info.editor.toString()).trim().length) {
			const mode = types[info.type].testEditorMode;

			if(mode === 'html') {
				// removes all mark elements from the text
				const regex = new RegExp(`<${markElement} data-markjs=[^>]+>((?:(?!</${markElement}>)[^])+)</${markElement}>`, 'g');
				let max = 20;    // just to be on the safe side

				while(--max > 0 && regex.test(text)) {
					text = text.replace(regex, '$1');
				}
			}
			json += `,"testString":{"mode":"${mode}","content":${JSON.stringify(text)}}`;
		}
		json += '}}';

		const jsonObj = Json.parseJson(json);

		if( !jsonObj) return  null;

		if(format) {
			json = JSON.stringify(jsonObj, null, '    ');
		}

		if(textMode) {
			tab.setTextMode();
		}

		return  json;
	},

	serialiseOptions : function(type, json) {
		const obj = types[type];

		let opt, text;
		json += `"type":"${type}"`;

		obj.options.forEach(option => {
			const selector = `section.${type} .${option}`,
				value = defaultOptions[option];

			if(value) {
				switch(value[1]) {
					case 'checkbox' :
						opt = $(selector + ' input').prop('checked');

						if(opt !== value[0]) {
							json += `,"${option}":${opt}`;
						}
						break;

					case 'text' :
						text = $(selector + ' input').val();

						if(text && text !== value[0]) {
							json += `,"${option}":"${text}"`
						}
						break;

					case 'editor' :
						if(option !== 'accuracyObject') {
							const editor = tab.getOptionEditor(option);

							if(editor && (text = editor.toString().trim()).length > 2) {
								json += `,"${option}":${JSON.stringify(text)}`;
							}
						}
						break;

					case 'select' :
						opt = $(selector + ' select').val();

						if(opt !== value[0]) {
							json += `,"${option}":"${opt}"`;

							if(opt === 'object') {
								const editor = tab.getOptionEditor('accuracyObject');

								if(editor && (text = editor.toString().trim()).length > 30) {
									json += `,"accuracyObject":${JSON.stringify(text)}`;
								}
							}
						}
						break;

					case 'number' :
						if(option === 'iframesTimeout' && !isChecked('iframes')) break;

						opt = $(selector + ' input').val();

						if(opt !== value[0]) {
							json += `,"${option}":${opt }`;
						}
						break;

					default : break;
				}
			}
		});

		json += this.serialiseCallbacks(type);

		return  json;
	},

	serialiseCallbacks : function(type) {
		let json = '',
			filterEditor = tab.getOptionEditor('filterCallback'),
			eachEditor = tab.getOptionEditor('eachCallback');

		if(filterEditor) {
			let filter = filterEditor.toString().trim();

			if(filter && filter.length > 2) {
				json = `,"filterCallback":${JSON.stringify(filter)}`;
			}
		}

		if(eachEditor) {
			let each = eachEditor.toString().trim();

			if(each && each.length > 2) {
				json += `,"eachCallback":${JSON.stringify(each)}`;
			}
		}

		return  json;
	},

	parseJson : function(str) {
		let json;
		try { json = JSON.parse(str); } catch(e) {
			log('Failed to parse this json\n' + e.message, true);
		}
		return  json;
	}
};

const highlighter = {

	highlight : function() {
		currentIndex = 0;

		tab.clear();
		codeBuilder.build('all');

		const type = tab.getType();

		if(type === 'string_' || type === 'array') {
			this.markStringArray();

		} else if(type === 'regexp') {
			this.markRegExp();

		} else if(type === 'ranges') {
			this.markRanges();
		}

		hljs.highlightElement($('.results pre>code')[0]);
	},

	highlightRawHtml : function(selector) {
		tab.clear();
		time = performance.now();

		const elem = markElement,
			open = '<mark data-markjs=[^>]+>',
			pattern = `(?<=(${open})\s*)((?:(?!</mark>|${open})[^])+)(?=(</mark>|${open}))|(?<=(</mark>))\s*((?:(?!${open})[^])+?)(?=(</mark>))`,
			regex = new RegExp(pattern, 'dg');

		markElement = 'mark';
		markElementSelector = `${selector} mark`;

		getContext(selector, jqueryMark).markRegExp(regex, {
			'acrossElements' : true,
			'separateGroups' : oldLibrary ? false : true,
			'wrapAllRanges' : true,
			'each' : (elem, info) => {
				if(oldLibrary) {
					$(elem).attr('data-markjs', 'start-1');

				} else {
					if(info.matchStart) {
						$(elem).attr('data-markjs', 'start-1');
					}
					if(info.groupIndex === 1 || info.groupIndex === 3 || info.groupIndex === 4 || info.groupIndex === 6) {
						$(elem).addClass('mark-element');

					} else if(info.groupIndex === 2 || info.groupIndex === 5) {
						$(elem).addClass('groups');
					}
				}
			},
			'done' : this.finish
		});
	},

	markStringArray : function() {
		const obj = tab.getSearchEditorInfo();
		if( !obj) return;

		const searchParameter = obj.editor.toString();
		if( !searchParameter) return;

		const hl = this,
			section = `section.${obj.type}`,
			settings = this.getCurrentSettings(section, obj.type);

		let count = 1;

		const options = {
			'element' : settings.elementName,
			'className' : settings.className,
			'separateWordSearch' : settings.separateWordSearch,
			'diacritics' : settings.diacritics,
			'caseSensitive' : settings.caseSensitive,
			'ignoreJoiners' : settings.ignoreJoiners,
			'acrossElements' : settings.acrossElements,

			'accuracy' : settings.accuracy,
			'wildcards' : settings.wildcards,

			'synonyms' : settings.synonyms,
			'ignorePunctuation' : settings.ignorePunctuation,
			'exclude' : settings.exclude,

			'filter' : (node, term, marks, count, info) => {
				return  true;
			},
			'each' : (elem, info) => {
				hl.flagStartElement(elem, info, settings.acrossElements);
			},
			'debug' : $(`${section} .debug input`).prop('checked'),
			'done' : hl.finish
		};

		let parameter;

		if(obj.type === 'array') {
			if( !oldLibrary) {
				options.cacheTextNodes = $(`${section} .cacheTextNodes input`).prop('checked');
				options.wrapAllRanges = $(`${section} .wrapAllRanges input`).prop('checked');
			}

			const array = this.tryEvaluate(searchParameter, obj.selector, 'Array');
			if( !array) return;

			parameter = array;
			log(`Search parameter 'Array' : ${searchParameter}\n`);

		} else {
			parameter = searchParameter;
			log(`Search parameter 'String' : '${searchParameter}'\n`);
		}

		time = performance.now();

		settings.context.unmark({
			'done' : () => {
				settings.context.mark(parameter, options);
			}
		});
	},

	markRegExp : function() {
		const obj = tab.getSearchEditorInfo();
		if( !obj) return;

		const searchParameter = obj.editor.toString();
		if( !searchParameter) return;

		const hl = this,
			section = `section.${obj.type}`,
			settings = this.getCurrentSettings(section, obj.type);

		let count = 1;

		const options = {
			'element' : settings.elementName,
			'className' : settings.className,
			'acrossElements' : settings.acrossElements,
			'separateGroups' : settings.separateGroups,
			'blockElementsBoundary' : settings.blockElementsBoundary,
			'cacheTextNodes' : settings.cacheTextNodes,
			'wrapAllRanges' : settings.wrapAllRanges,
			'exclude' : settings.exclude,

			'filter' : (node, match, totalMarks, info) => {
				return  true;
			},
			'each' : (elem, info) => {
				hl.flagStartElement(elem, info, settings.acrossElements);
			},
			'debug' : $(`${section} .debug input`).prop('checked'),
			'done' : hl.finish,
		};

		const regex = this.tryEvaluate(searchParameter, obj.selector, 'RegExp');
		if( !regex) return;

		log(`Search parameter 'RegExp' : ${searchParameter}\n`);
		time = performance.now();

		settings.context.unmark({
			'done' : () => {
				settings.context.markRegExp(regex, options);
			}
		});
	},

	markRanges : function() {
		const obj = tab.getSearchEditorInfo();
		if( !obj) return;

		const searchParameter = obj.editor.toString();
		if( !searchParameter) return;

		const hl = this,
			section = `section.${obj.type}`,
			settings = this.getCurrentSettings(section, obj.type);

		let count = 1;

		const options = {
			'element' : settings.elementName,
			'className' : settings.className,
			'exclude' : settings.exclude,
			'wrapAllRanges' : settings.wrapAllRanges,
			'filter' : (node, range, match, counter) => {
				return  true;
			},
			'each' : (elem, range) => {
				hl.flagStartElement(elem, null, false);
			},
			'debug' : $(`${section} .debug input`).prop('checked'),
			'done' : hl.finish
		};

		const ranges = this.tryEvaluate(searchParameter, obj.selector, 'Ranges');
		if( !ranges) return;

		log(`Search parameter 'Ranges' : ${searchParameter}\n`);
		time = performance.now();

		settings.context.unmark({
			'done' : () => {
				settings.context.markRanges(ranges, options);
			}
		});
	},

	flagStartElement : function(elem, info, acrossElements) {
		if( !info || !acrossElements || info.matchStart) {
			$(elem).attr('data-markjs', 'start-1');
		}
	},

	getCurrentSettings : function(section, type) {
		// disable contenteditable attribute for performance reason
		$(`section.${tab.getType()} .testString .editor`).attr('contenteditable', 'false');

		const obj = {},
			context = getContext(testContainerSelector, jqueryMark),
			elementName = $(`${section} .element input`).val(),
			className = $(`${section} .className input`).val();

		updateVariables(type, elementName, className);

		obj.context = context;
		obj.elementName = elementName;
		obj.className = className;
		obj.exclude = this.tryToEvaluate('exclude', 4) || [];
		obj.acrossElements = $(`${section} .acrossElements input`).prop('checked');

		if(type === 'string_' || type === 'array') {
			obj.separateWordSearch = $(`${section} .separateWordSearch input`).prop('checked');
			obj.diacritics = $(`${section} .diacritics input`).prop('checked');
			obj.caseSensitive = $(`${section} .caseSensitive input`).prop('checked');
			obj.ignoreJoiners = $(`${section} .ignoreJoiners input`).prop('checked');
			obj.accuracy = $(`${section} .accuracy select`).val();
			obj.wildcards = $(`${section} .wildcards select`).val();

			obj.synonyms = this.tryToEvaluate('synonyms', 8) || {};
			obj.ignorePunctuation = this.tryToEvaluate('ignorePunctuation', 4) || [];

			if(obj.accuracy === 'object') {
				const accuracy = this.tryToEvaluate('accuracyObject', 30);
				if(accuracy) {
					obj.accuracy = accuracy;
				}
			}

		} else if(type === 'regexp') {
			obj.separateGroups = $(`${section} .separateGroups input`).prop('checked');
			obj.blockElementsBoundary = $(`${section} .blockElementsBoundary input`).prop('checked');
		}

		if(type === 'array') {
			obj.cacheTextNodes = $(`${section} .cacheTextNodes input`).prop('checked');
		}

		if(type === 'array' || type === 'regexp' || type === 'ranges') {
			obj.wrapAllRanges = $(`${section} .wrapAllRanges input`).prop('checked');
		}

		return  obj;
	},

	tryToEvaluate : function(option, minLength) {
		const editor = tab.getOptionEditor(option);
		let text;

		if(editor && (text = editor.toString().trim()).length > minLength) {
			try {
				return  eval(`'use strict'; (${text})`);

			} catch(e) {
				log(`Failed to evaluate ${option} object:\n${e.message}`, true);
				$(`${section} .${option} .editor`).addClass('warning');
			}
		}
		return  null;
	},

	tryEvaluate : function(parameter, selector, name) {
		try {
			return  eval("'use strict';" + parameter);

		} catch(e) {
			log(`Failed to evaluate the ${name}:\n${e.message}`, true);
			$(selector).addClass('warning');
		}
		return  null;
	},

	finish : function(totalMarks, totalMatches, termStats) {
		let stats = '';

		if(termStats) {
			stats = 'Terms statics:\n';

			for(let term in termStats) {
				stats += `${term} = ${termStats[term]}\n`;
			}
		}

		let result = `${totalMatches ? 'totalMatches = ' + totalMatches : ''}\ntotalMarks = ${totalMarks}` +
			`\nmark time = ${(performance.now() - time)} ms\n\n${stats}`;

		log(result);

		marks = $(markElementSelector);
		startElements = marks.filter(function() { return  $(this).data('markjs') === 'start-1'; });

		if(marks.length > 0) {
			highlightMatch(marks.first()[0]);

			if(markElement !== 'mark') {
				$(markElementSelector).addClass('custom-element');
			}
		}
		previousButton.css('opacity', 0.5);
		nextButton.css('opacity', marks.length ? 1 : 0.5);
		// restore contenteditable attribute
		$(`section.${tab.getType()} .testString .editor`).attr('contenteditable', 'true');
	}
};

function registerEvents() {
	$("body").on('mouseup', function() {
		$('body *').removeClass('warning');
	});

	$(".mark-type li").on('click', function() {
		tab.selectTab($(this).data('type'));
		tab.initTab();
	});

	$(".blockElementsBoundary input").on('change', function(e) {
		tab.switchElements($(this), '.blockElements');
	});

	$("div.actions>input.copy").on('mouseup', function(e) {
		document.getSelection().selectAllChildren($(this).parent().parent()[0]);
		document.execCommand('copy');
		document.getSelection().removeAllRanges();
	});

	$("input[type=checkbox], input[type=number], select[name]").on('change', function(e) {
		codeBuilder.build('all');
	});

	$("input[name], select[name], div.editor[name]").on('mouseenter', function(e) {
		if(showTooltips || e.ctrlKey) {
			showTooltip($(this), e);
		}
	}).on('mouseleave', function() {
		$(this).powerTip('hide', true);
	});

	$('button.open-json-form').on('click', function() {
		if($('.json-form:visible').length) {
			$('.json-form').css('display', 'none');

		} else {
			$('.json-form').css('display', 'block');

			if(jsonEditor === null) {
				jsonEditor = CodeJar($('.json-form .editor')[0], () => {});

				jsonEditor.onUpdate(code => {
					$('button.import-json').attr('disabled', code.trim().length ? false : true);
				});
			}
			$('button.import-json').attr('disabled', jsonEditor.toString().trim().length ? false : true);
		}
	});

	$('.json-form>.close').on('click', function() {
		$(this).parent().css('display', 'none');
	});

	$('button.open-file-form').on('click', function() {
		if($('.file-form:visible').length) {
			$('.file-form').css('display', 'none');

		} else {
			$('.file-form').css('display', 'block');
			$('.file-form .file-name').attr('placeholder', getFileName());
		}
	});

	$('.file-form>.close').on('click', function() {
		$(this).parent().css('display', 'none');
	});

	$('.file-form a.save-file').on('click', function(e) {
		const json = Json.buildJson(true);

		if(json) {
			let name = $('.file-form .file-name').val();

			if(name && !/\.json$/i.test(name)) {
				name = name.replace(/[.]+$/g, '') + '.json';
			}
			name = (name || getFileName());

			this.download = name;
			this.href = URL.createObjectURL(new Blob([json], { type : 'text/json' }));
			URL.revokeObjectURL(this.href);

			$('.file-form .file-name').val(name);
			setValue(tab.getType() + '-fileName', name);
		}
	});

	$('.file-form #file-dialog').on('change', function() {
		const reader = new FileReader(),
			file = this.files[0];
		reader.file = file;

		reader.onload = function() {
			importer.loadOptionsFromFile(this.result);

			$('.file-form .loaded-file-name').text(file.name);
			$('.file-form .file-name').val(file.name);
			$('.file-form').css('display', 'none');
		};

		reader.readAsText(file);
	});

	$(".copy").on('mouseup', function(e) {
		document.getSelection().selectAllChildren($(this).parent().parent().find('.editor')[0]);
		document.execCommand('copy');
		document.getSelection().removeAllRanges();
	});

}

function getFileName() {
	const type = tab.getType();
	let name = getValue(type + '-fileName');

	return  name || (type === 'string_' ? 'string' : type) + '-tab-session.json';
}

function showTooltip(elem, e) {
	const id = elem.attr('name');

	showHideInfo(id);

	if(elem.data('powertiptarget')) elem.powerTip('destroy');

	elem.data('powertiptarget', id).powerTip({
		manual : true,
		intentPollInterval : 300,
		fadeInTime : 100,
		smartPlacement : true,
		placement : 'w',
		offset : 30
	});
	elem.powerTip('show', e);
}

function showHideInfo(id) {
	const separateGroups = isChecked('separateGroups'),
		acrossElements = isChecked('acrossElements'),
		info = $('article.option-info #' + id),
		elemsAE = info.find('.acrossElements').addClass('hide'),
		elemsSG = info.find('.separateGroups').addClass('hide');

	if(acrossElements) {
		elemsAE.each(function() {
			if($(this).hasClass('separateGroups')) {
				if(separateGroups) $(this).removeClass('hide');

			} else $(this).removeClass('hide');
		});
	}

	if(separateGroups) {
		elemsSG.each(function() {
			if($(this).hasClass('acrossElements')) {
				if(acrossElements) $(this).removeClass('hide');

			} else $(this).removeClass('hide');
		});
	}
}

function isChecked(option) {
	return  $(`section.${tab.getType()} .${option} input`).prop('checked');
}

function log(message, warning) {
	if(warning) {
		$('.toolbar').addClass('warning');
		message = `<span style="color:red">${message}</span><br>`;
	}

	$('.results code').append(message);
}

function previousMatch(elem) {
	if(--currentIndex <= 0) {
		currentIndex = 0;
		previousButton.css('opacity', 0.5);
	}

	let startElem = startElements.eq(currentIndex);
	if(startElem.length) {
		highlightMatch(startElem[0]);
	}
	nextButton.css('opacity', 1);
}

function nextMatch(elem) {
	if(++currentIndex >= startElements.length - 1) {
		currentIndex = startElements.length - 1;
		nextButton.css('opacity', 0.5);
	}

	let startElem = startElements.eq(currentIndex);
	if(startElem.length) {
		highlightMatch(startElem[0]);
	}
	previousButton.css('opacity', 1);
}

function highlightMatch(elem) {
	marks.removeClass('current');

	let found = false;
	marks.each(function(i, el) {
		if( !found) {
			if(el === elem) found = true;

		} else if($(this).data('markjs') === 'start-1') return  false;    // the start of the next 'start element' means the end of the current match

		if(found) $(this).addClass('current');
	});

	scrollIntoView($(elem));
}

function scrollIntoView(elem) {
	if(elem.length) {
		elem[0].scrollIntoView(true);
		window.scrollBy(0, -10000);
	}
}

function detectLibrary() {
	const info = getLibrariesInfo();
	let both = info.jquery && info.javascript && info.jquery !== info.javascript;

	if(both) {
		const lib = getValue('library');

		if( !lib || lib === 'old') {
			jqueryMark = info.jquery === 'old';
			oldLibrary = true;

		} else if(lib && lib === 'new') {
			jqueryMark = info.jquery === 'new';
			oldLibrary = false;
		}

	} else {
		if(info.javascript) {
			jqueryMark = false;
			oldLibrary = info.javascript === 'old';

		} else if(info.jquery) {
			jqueryMark = true;
			oldLibrary = info.jquery === 'old';
		}
	}

	$('.switch-library').removeClass('hide');
	$('.switch-library input').prop('checked', !oldLibrary);

	if( !both) {
		$('.switch-library input').attr('disabled', true);
		$('.switch-library label').css('opacity', .4);
	}

	setVisibility();
}

function getLibrariesInfo() {
	const info = {};
	let jq = false, js = false;

	$('head script[src]').each(function(i, elem) {
		const src = elem.getAttribute('src');
		if(/\/jquery\.mark\./i.test(src)) jq = true;
		if(/\/mark\./i.test(src)) js = true;
	});

	if(jq) {
		info.jquery = isOldLibrary(true) ? 'old' : 'new';
	}
	if(js) {
		info.javascript = isOldLibrary(false) ? 'old' : 'new';
	}
	return  info;
}

function isOldLibrary(jquery) {
	let old = false;
	getContext('article h1', jquery).markRegExp(/^\s*\w/g, {
		'filter' : (n, m, t, info) => {
			if( !info) old = true;
			return  false;
		}
	});
	return  old;
}

function getContext(selector, jquery) {
	return  jquery ? $(selector) : new Mark(document.querySelector(selector));
}

function setVisibility() {
	if(oldLibrary) {
		$('.new').addClass('hide');
		$('.old-library').removeClass('hide');

	} else {
		$('.new').removeClass('hide');
		$('.old-library').addClass('hide');
	}
	$('.switch-library label').text((oldLibrary ? 'standard' : 'advanced') + ' library');
}

function getValue(key) {
	try {
		return  localStorage.getItem(key);
	} catch(e) {
		log('localStorage ' + e.message);
	}
	return  null;
}

function setValue(key, value) {
	try {
		const saved = localStorage.getItem(key);

		if(value !== saved) {
			localStorage.setItem(key, value);
		}
	} catch(e) {
		log('localStorage ' + e.message);
	}
}

function testSaveLoad() {
	let json, str, testStr;

	for(const type in types) {
		tab.selectTab(type);
		tab.initializeEditors();

		testStr = testJSONs[type];

		json = Json.parseJson(testStr);
		importer.setOptions(type, json);

		str = Json.buildJson();

		if( !str || str !== testStr) {
			console.log(`The 'save/load' test for ${type} is failed`);
			console.log(str);

		} else {
			console.log(`The 'save/load' test for ${type} is passed`);
		}
	}
}























