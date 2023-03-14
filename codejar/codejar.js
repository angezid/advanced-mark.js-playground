(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define([], factory(root));
    } else if(typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.CodeJar = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function(root) {

const globalWindow = window;
function CodeJar(editor, highlight, opt = {}) {
    const options = Object.assign({ tab: '\t', indentOn: /[({\[]$/, moveToNewLine: /^[)}\]]/, spellcheck: false, catchTab: true, preserveIdent: true, addClosing: true, history: true, window: globalWindow }, opt);
    const window = options.window;
    const document = window.document;
    let listeners = [];
    let history = [];
    let at = -1;
    let focus = false;
    let callback;
    let prev; // code content prior keydown event
    editor.setAttribute('contenteditable', 'plaintext-only');
    editor.setAttribute('spellcheck', options.spellcheck ? 'true' : 'false');
    editor.style.outline = 'none';
    editor.style.overflowWrap = 'break-word';
    editor.style.overflowY = 'auto';
    editor.style.whiteSpace = 'pre-wrap';
    let isLegacy = false; // true if plaintext-only is not supported
    highlight(editor);
    if (editor.contentEditable !== 'plaintext-only')
        isLegacy = true;
    if (isLegacy)
        editor.setAttribute('contenteditable', 'true');
    const debounceHighlight = debounce(() => {
        const pos = save();
        highlight(editor, pos);
        restore(pos);
    }, 30);
    let recording = false;
    const shouldRecord = (event) => {
        return !isUndo(event) && !isRedo(event)
            && event.key !== 'Meta'
            && event.key !== 'Control'
            && event.key !== 'Alt'
            && !event.key.startsWith('Arrow');
    };
    const debounceRecordHistory = debounce((event) => {
        if (shouldRecord(event)) {
            recordHistory();
            recording = false;
        }
    }, 300);
    const on = (type, fn) => {
        listeners.push([type, fn]);
        editor.addEventListener(type, fn);
    };
    on('keydown', event => {
        if (event.defaultPrevented)
            return;
        prev = toString();
        if (options.preserveIdent)
            handleNewLine(event);
        else
            legacyNewLineFix(event);
        if (options.catchTab)
            handleTabCharacters(event);
        if (options.addClosing)
            handleSelfClosingCharacters(event);
        if (options.history) {
            handleUndoRedo(event);
            if (shouldRecord(event) && !recording) {
                recordHistory();
                recording = true;
            }
        }
        if (isLegacy)
            restore(save());
    });
    on('keyup', event => {
        if (event.defaultPrevented)
            return;
        if (event.isComposing)
            return;
        if (prev !== toString())
            debounceHighlight();
        debounceRecordHistory(event);
        if (callback)
            callback(toString(), event);
    });
    on('focus', _event => {
        focus = true;
    });
    on('blur', _event => {
        focus = false;
    });
    on('paste', event => {
        recordHistory();
        handlePaste(event);
        recordHistory();
        if (callback)
            callback(toString(), event);
    });
    on('dragover', event => {
        var _a;
        // prevents dragover event when there is a plain text
        if ((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.types.includes('text/plain'))
            preventDefault(event);
    });
    on('drop', event => {
        handleDrop(event);
    });
    function save() {
        const s = getSelection();
        const pos = { start: 0, end: 0, dir: undefined };
        let { anchorNode, anchorOffset, focusNode, focusOffset } = s;
        if (!anchorNode || !focusNode)
            throw 'error1';
        // Selection anchor and focus are expected to be text nodes,
        // so normalize them.
        if (anchorNode.nodeType === Node.ELEMENT_NODE) {
            const node = document.createTextNode('');
            anchorNode.insertBefore(node, anchorNode.childNodes[anchorOffset]);
            anchorNode = node;
            anchorOffset = 0;
        }
        if (focusNode.nodeType === Node.ELEMENT_NODE) {
            const node = document.createTextNode('');
            focusNode.insertBefore(node, focusNode.childNodes[focusOffset]);
            focusNode = node;
            focusOffset = 0;
        }
        visit(editor, el => {
            if (el === anchorNode && el === focusNode) {
                pos.start += anchorOffset;
                pos.end += focusOffset;
                pos.dir = anchorOffset <= focusOffset ? '->' : '<-';
                return 'stop';
            }
            if (el === anchorNode) {
                pos.start += anchorOffset;
                if (!pos.dir) {
                    pos.dir = '->';
                }
                else {
                    return 'stop';
                }
            }
            else if (el === focusNode) {
                pos.end += focusOffset;
                if (!pos.dir) {
                    pos.dir = '<-';
                }
                else {
                    return 'stop';
                }
            }
            if (el.nodeType === Node.TEXT_NODE) {
                if (pos.dir != '->')
                    pos.start += el.nodeValue.length;
                if (pos.dir != '<-')
                    pos.end += el.nodeValue.length;
            }
        });
        // collapse empty text nodes
        editor.normalize();
        return pos;
    }
    function restore(pos) {
        const s = getSelection();
        let startNode, startOffset = 0;
        let endNode, endOffset = 0;
        if (!pos.dir)
            pos.dir = '->';
        if (pos.start < 0)
            pos.start = 0;
        if (pos.end < 0)
            pos.end = 0;
        // Flip start and end if the direction reversed
        if (pos.dir == '<-') {
            const { start, end } = pos;
            pos.start = end;
            pos.end = start;
        }
        let current = 0;
        visit(editor, el => {
            if (el.nodeType !== Node.TEXT_NODE)
                return;
            const len = (el.nodeValue || '').length;
            if (current + len > pos.start) {
                if (!startNode) {
                    startNode = el;
                    startOffset = pos.start - current;
                }
                if (current + len > pos.end) {
                    endNode = el;
                    endOffset = pos.end - current;
                    return 'stop';
                }
            }
            current += len;
        });
        if (!startNode)
            startNode = editor, startOffset = editor.childNodes.length;
        if (!endNode)
            endNode = editor, endOffset = editor.childNodes.length;
        // Flip back the selection
        if (pos.dir == '<-') {
            [startNode, startOffset, endNode, endOffset] = [endNode, endOffset, startNode, startOffset];
        }
        s.setBaseAndExtent(startNode, startOffset, endNode, endOffset);
    }
    function beforeCursor() {
        const s = getSelection();
        const r0 = s.getRangeAt(0);
        const r = document.createRange();
        r.selectNodeContents(editor);
        r.setEnd(r0.startContainer, r0.startOffset);
        return r.toString();
    }
    function afterCursor() {
        const s = getSelection();
        const r0 = s.getRangeAt(0);
        const r = document.createRange();
        r.selectNodeContents(editor);
        r.setStart(r0.endContainer, r0.endOffset);
        return r.toString();
    }
    function handleNewLine(event) {
        if (event.key === 'Enter') {
            const before = beforeCursor();
            const after = afterCursor();
            let [padding] = findPadding(before);
            let newLinePadding = padding;
            // If last symbol is "{" ident new line
            if (options.indentOn.test(before)) {
                newLinePadding += options.tab;
            }
            // Preserve padding
            if (newLinePadding.length > 0) {
                preventDefault(event);
                event.stopPropagation();
                insert('\n' + newLinePadding);
            }
            else {
                legacyNewLineFix(event);
            }
            // Place adjacent "}" on next line
            if (newLinePadding !== padding && options.moveToNewLine.test(after)) {
                const pos = save();
                insert('\n' + padding);
                restore(pos);
            }
        }
    }
    function legacyNewLineFix(event) {
        // Firefox does not support plaintext-only mode
        // and puts <div><br></div> on Enter. Let's help.
        if (isLegacy && event.key === 'Enter') {
            preventDefault(event);
            event.stopPropagation();
            if (afterCursor() == '') {
                insert('\n ');
                const pos = save();
                pos.start = --pos.end;
                restore(pos);
            }
            else {
                insert('\n');
            }
        }
    }
    // correctly determines whether character before the cursor is escaped
    function isEscape(code) {
        let i = code.length;
        let escaped = false;
        while (--i >= 0 && code[i] === '\\')
            escaped = !escaped;
        return escaped;
    }
    function handleSelfClosingCharacters(event) {
        const open = `([{`;
        const close = `)]}`;
        const quotes = `'"`;
        const ch = event.key;
        const openIncludes = open.includes(ch);
        // wraps a selection in brackets or quotes, regardless of characters before/after selection
        if ((openIncludes || quotes.includes(ch)) && getSelection().toString()) {
            if (openIncludes)
                enclose(event, open, close);
            else
                enclose(event, quotes, quotes);
        }
        else {
            const charAfter = afterCursor().charAt(0);
            const codeBefore = beforeCursor();
            const array = ['', ' ', '\t', '\n'];
            if (openIncludes) {
                if (!isEscape(codeBefore) && (close.includes(charAfter) || array.includes(charAfter))) {
                    enclose(event, open, close);
                }
            }
            // regex checks whether the last character is non-white-space
            // prevents adding second quote if there is non-white-space character before cursor
            else if (!/\S$/.test(codeBefore)) {
                // NEEDS investigation
                // adds closing quote if the array contains 'charAfter'
                //else if (quotes.includes(ch) && array.includes(charAfter)) {
                // adds closing quote if the same quote is after the cursor or the array contains 'charAfter'
                if (quotes.includes(ch) && (ch === charAfter || array.includes(charAfter))) {
                    enclose(event, quotes, quotes);
                }
            }
        }
    }
    // if text is selected, wraps selection, otherwise adds closing character
    function enclose(event, open, close) {
        preventDefault(event);
        const pos = save();
        const wrapText = pos.start == pos.end ? '' : getSelection().toString();
        const text = event.key + wrapText + close[open.indexOf(event.key)];
        insert(text);
        pos.start++;
        pos.end++;
        restore(pos);
    }
    function handleTabCharacters(event) {
        if (event.key === 'Tab') {
            preventDefault(event);
            if (event.shiftKey) {
                const before = beforeCursor();
                let [padding, start,] = findPadding(before);
                if (padding.length > 0) {
                    const pos = save();
                    // Remove full length tab or just remaining padding
                    const len = Math.min(options.tab.length, padding.length);
                    restore({ start, end: start + len });
                    document.execCommand('delete');
                    pos.start -= len;
                    pos.end -= len;
                    restore(pos);
                }
            }
            else {
                insert(options.tab);
            }
        }
    }
    function handleUndoRedo(event) {
        if (isUndo(event)) {
            preventDefault(event);
            at--;
            const record = history[at];
            if (record) {
                editor.innerHTML = record.html;
                restore(record.pos);
            }
            if (at < 0)
                at = 0;
        }
        if (isRedo(event)) {
            preventDefault(event);
            at++;
            const record = history[at];
            if (record) {
                editor.innerHTML = record.html;
                restore(record.pos);
            }
            if (at >= history.length)
                at--;
        }
    }
    function recordHistory() {
        if (!focus)
            return;
        const html = editor.innerHTML;
        const pos = save();
        const lastRecord = history[at];
        if (lastRecord) {
            if (lastRecord.html === html
                && lastRecord.pos.start === pos.start
                && lastRecord.pos.end === pos.end)
                return;
        }
        at++;
        history[at] = { html, pos };
        history.splice(at + 1);
        const maxHistory = 300;
        if (at > maxHistory) {
            at = maxHistory;
            history.splice(0, 1);
        }
    }
    function handleDrop(event) {
        var _a;
        let text = (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData("text/plain");
        // handles drop event only when there is real text
        if (text) {
            preventDefault(event);
            recordHistory();
            text = normalizeSpaces(text);
            const pos = save();
            insert(text);
            highlight(editor);
            restore({
                start: Math.min(pos.start, pos.end) + text.length,
                end: Math.min(pos.start, pos.end) + text.length,
                dir: '<-',
            });
            recordHistory();
            if (callback)
                callback(toString(), event);
        }
    }
    function handlePaste(event) {
        preventDefault(event);
        let text = (event.originalEvent || event)
            .clipboardData
            .getData('text/plain');
        text = normalizeSpaces(text);
        const pos = save();
        insert(text);
        highlight(editor);
        restore({
            start: Math.min(pos.start, pos.end) + text.length,
            end: Math.min(pos.start, pos.end) + text.length,
            dir: '<-',
        });
    }
    function normalizeSpaces(text) {
        text = text.replace(/\r\n?/g, '\n');
        const tabReg = /\t/g, indentReg = /(?:^|\n)[ \t]+/g;
        let tabSize = 0;
        if (options.tab === '\t') {
            const style = window.getComputedStyle(editor);
            tabSize = parseInt(style.tabSize);
            if (tabSize > 0) {
                //indentation may contain a mix of tabs and spaces, so first it normalizes spaces by replacing tabs and then replaces spaces by tabs
                const regex = new RegExp(` {${tabSize}}`, 'g'), spaces = ' '.repeat(tabSize);
                return text.replace(indentReg, (m) => m.replace(tabReg, spaces).replace(regex, '\t'));
            }
        }
        else {
            return text.replace(indentReg, (m) => m.replace(tabReg, options.tab));
        }
        return text;
    }
    function visit(editor, visitor) {
        const queue = [];
        if (editor.firstChild)
            queue.push(editor.firstChild);
        let el = queue.pop();
        while (el) {
            if (visitor(el) === 'stop')
                break;
            if (el.nextSibling)
                queue.push(el.nextSibling);
            if (el.firstChild)
                queue.push(el.firstChild);
            el = queue.pop();
        }
    }
    function isCtrl(event) {
        return event.metaKey || event.ctrlKey;
    }
    function isUndo(event) {
        return isCtrl(event) && !event.shiftKey && event.code === 'KeyZ';
    }
    function isRedo(event) {
        return isCtrl(event) && event.shiftKey && event.code === 'KeyZ';
    }
    function insert(text) {
        text = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
        document.execCommand('insertHTML', false, text);
    }
    function debounce(cb, wait) {
        let timeout = 0;
        return (...args) => {
            clearTimeout(timeout);
            timeout = window.setTimeout(() => cb(...args), wait);
        };
    }
    function findPadding(text) {
        // Find beginning of previous line.
        let i = text.length - 1;
        while (i >= 0 && text[i] !== '\n')
            i--;
        i++;
        // Find padding of the line.
        let j = i;
        while (j < text.length && /[ \t]/.test(text[j]))
            j++;
        return [text.substring(i, j) || '', i, j];
    }
    function toString() {
        return editor.textContent || '';
    }
    function preventDefault(event) {
        event.preventDefault();
    }
    function getSelection() {
        const root = editor.getRootNode();
        if (root.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            try { return root.getSelection(); } catch(e) { } 
        }
        return window.getSelection();
    }
    return {
        updateOptions(newOptions) {
            Object.assign(options, newOptions);
        },
        updateCode(code) {
            editor.textContent = code;
            highlight(editor);
        },
        onUpdate(cb) {
            callback = cb;
        },
        toString,
        save,
        restore,
        recordHistory,
        destroy() {
            for (let [type, fn] of listeners) {
                editor.removeEventListener(type, fn);
            }
        },
    };
}
return CodeJar;
});
