# Mark.js-playground

### Description
The program can handle `mark.js` or `jquery.mark.js` - it only requires adding according reference in `Playground.html` file.
It works both with new [https://github.com/angezid/mark.js](https://github.com/angezid/mark.js) and standard library. The standard library has many limitations, so behavior of this program will depend on mark.js library.  

Currently, the two mark libraries are installed by default:
* the mark.js package v8.11.1
* the jquery.mark.js from 'https://raw.githubusercontent.com/angezid/mark.js/master/dist/jquery.mark.js'

They are not conflicting with each other and can be switch by checkbox.  

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
It also removes attributes containing `javascript:` or name start with `on`. The values of `href, src` attributes are replaced by '#'.  

Warning: 100% security is currently under the question.

Note: be reasonable, do not export big HTML test content, due to security reason, nobody will dare to import your export (only who trust you).  
Locate and leave only problematic place(s) which can be easily visually examine.  

### Things you need to know

There are two test content modes - Text and Html . If you want to add a HTML content, you need to switch to the Html mode.

An `object` option was added to the Accuracy selector, just to enable an `accuracy` object editor. This option is not part of the mark.js library.

If you enable custom editor, the program evaluate the whole internal code (see 'Internal code' which appears below the 'Results').
Otherwise, only the option that accept Objects, Arrays or RegExp are evaluated.

The generated code for all other than default option is in the 'Generated code'.

Note:
- due to limitations of the standard library, the next/previous buttons functionality with `acrossElements` option may not work as expected in the Text mode.  
In the Html mode and in the 'Ranges' tab for both libraries expected behavior - next/previous mark element.
- dealing with big Html content is slow, especially in Html mode, so I added some limits on syntax/matches highlighting
- if you change `mark` element name, highlighting of matches won't work in the Html mode.

Warning:
- currently there is no protection on unsaved state on the browser reload or on load from local storage.  
You may accidentally click the Load button and silently overwrite the current state by a previously saved one.
- the direct use of the `cacheTextNodes` option without building ranges (see 'Custom code example') will resulted in a smaller number of matches. It actuality was 'invented' for this workaround.

### Custom code
When `Custom code editor` is activated, a minimal code with all callbacks is generated.
For normal workflow, the two internal function are necessary:
- `highlighter.flagStartElement()` in the `each` callback for next/previous buttons functionality
- `highlighter.finish()` in the `done` callback for highlighting matches and logging results  
They're automatically added to the internal code, if their parameters and functions parameters are the same.

### Custom code example
It's a simplified hack to improve performance in the `mark()` method with the large array.  
Copy below code, paste to the JSON form and press 'Import JSON' button.

``` json
{
    "version": "1.0.0",
    "library": "advanced",
    "section": {
        "type": "array",
        "accuracy": "exactly",
        "diacritics": false,
        "cacheTextNodes": true,
        "customCode": "const ranges=[];\n<<markjsCode>> // don't remove it\n\nfunction filter(node, term, marks, count, info) {\n  const range = {\n    start : info.offset + info.match.index + info.match[1].length,\n    length : info.match[2].length,\n  };\n  if (options.acrossElements) {\n    if (info.matchStart) {\n      range.startElement = true;\n    }\n  } else range.startElement = true;\n  ranges.push(range);\n  \n  return  false;\n}\n\nfunction done() {\n  $('section.array .testString .editor').markRanges(ranges, {\n    'each' : function(elem, range) {\n      if(range.startElement) {\n        elem.setAttribute('data-markjs', 'start-1');\n      }\n    },\n    done : highlighter.finish\n  });\n}",
        "queryArray": "wordsArray_50",
        "testString": {
            "mode": "html",
            "content": "<head></head><body><p>Load default Html and press Run button</p></body>"
        }
    }
}
```

### TODO
A lot ...
