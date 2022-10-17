# Mark.js-playground

<img height="540" src="assets/images/playground.png" border="1px solid">

### Description
The program can handle `mark.js` or `jquery.mark.js` - it only requires adding according reference in `index.html` file.
It works both with new [https://github.com/angezid/mark.js](https://github.com/angezid/mark.js) and standard library. The standard library has many limitations, so behavior of this program will depend on mark.js library.  

Currently, the two mark libraries are installed by default:
* the mark.js package v8.11.1
* the jquery.mark.js from 'https://raw.githubusercontent.com/angezid/mark.js/master/dist/jquery.mark.js'

They are not conflicting with each other and can be switch by checkbox (in settings).  

### Install Mark.js-playground
Clone or download this repository and run:
```
npm install && npm run build
```

### Export/Import
The idea to export/import 'Playground tab' in JSON format:
* save/load the current state
* bug report
* ask for help, if there's problem highlighting something

When you paste or drag & drop a Html content into the Html editor or load/import, the content runs through the Html sanitizer, which removes head, script, style, link, and meta elements and comments.
It also removes attributes containing `javascript:` or have name start with `on`. The values of `href, src, srcset` attributes are replaced by '#'.  

Warning: 100% security is currently under the question.

Note: be reasonable, do not export big HTML test content. For security reasons, nobody will dare import your export (only those who trust you).  
Locate and leave only problematic area(s) which can be easily visually examine.

### Things you need to know

There are two test content modes - Text and Html . If you want to add HTML content, you need to switch to the Html mode.  
An `object` option was added to the Accuracy selector, just to enable an `accuracy` object editor. This option is not part of the mark.js library.  
If you enable the custom code editor, the program evaluates the whole internal code (see 'Internal code' which appears below the 'Results').
Otherwise, only the options that accept Objects, Arrays or RegExp are evaluated.  

Note:
- due to limitations of the standard library, the next/previous buttons functionality with `acrossElements` option may not work as expected.

### Custom code
When `Custom code editor` is activated, a minimal code with all callbacks is generated.
For normal workflow, two internal functions are necessary:
- `highlighter.flagStartElement()` in the `each` callback for next/previous buttons functionality
- `highlighter.finish()` in the `done` callback for highlighting matches and logging results  
They're automatically added to the internal code if their parameters and functions parameters are the same.

### Custom code example
It's a simplified hack to improve performance in the `mark()` method with the large array. It demonstrates how to use the custom code editor.  
Note that currently, the option `cacheTextNodes` can be used without generating ranges.  
Copy the below code, paste it into the JSON form, and press 'Import JSON' button.
``` json
{
    "version": "1.0.0",
    "library": "advanced",
    "section": {
        "type": "array",
        "accuracy": "exactly",
        "diacritics": false,
        "cacheTextNodes": true,
        "customCode": "// your code before\nconst ranges=[];\n<<markjsCode>> // don't remove this line\n\nfunction filter(node, term, marks, count, info) {\n  const range = {\n    start : info.offset + info.match.index + info.match[1].length,\n    length : info.match[2].length,\n  };\n  if (options.acrossElements) {\n    if (info.matchStart) {\n      range.startElement = true;\n    }\n  } else range.startElement = true;\n  ranges.push(range);\n  \n  return  false;\n}\n\nfunction done() {\n  context.markRanges(ranges, {\n    'each' : function(elem, range) {\n      if(range.startElement) {\n        elem.setAttribute('data-markjs', 'start-1');\n      }\n    },\n    done : highlighter.finish\n  });\n}",
        "queryArray": "wordArrays.words_50",
        "testString": {
            "mode": "html",
            "content": "defaultHtml"
        }
    }
}
```
Shadow DOM example
``` json
{
    "version": "1.0.0",
    "library": "advanced",
    "section": {
        "type": "array",
        "shadowDOM": "{ 'style' : \"mark[data-markjs] { color:red; }\" }",
        "customCode": "// your code before\nconst container = tab.getTestElement();\nlet elem = container.querySelector('#shadow-dom');\nif( !elem) {\n  const div = document.createElement(\"DIV\");\n  div.innerHTML = '<b>Shadow DOM test</b><div id=\"shadow-dom\"></div>';\n  container.appendChild(div);\n  elem = container.querySelector('#shadow-dom');\n}\n\nif(elem && !elem.shadowRoot) {\n  const root2 = elem.attachShadow({ mode : 'open' });\n  root2.innerHTML = defaultHtml;\n}\n\n<<markjsCode>> // don't remove this line\n\nfunction filter(node, term, marks, count, info) {\n  return true;\n}\n\nfunction each(element, info) {}\n\nfunction done(totalMarks, totalMatches, termStats) {}",
        "queryArray": "['wiki', 'wikipedia', 'encyclopedia']",
        "testString": {
            "mode": "html",
            "content": "defaultHtml"
        }
    }
}
```

### License

[MIT](LICENSE)
