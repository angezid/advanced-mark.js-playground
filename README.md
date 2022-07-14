# Mark.js-playground

### Description
The program can handle `mark.js` or `jquery.mark.js` - it only requires adding according reference in `Playground.html` file.
It works both with new [https://github.com/angezid/mark.js](https://github.com/angezid/mark.js) and standard library. The standard library has many limitations, so behavior of this program will depend on mark.js library.  

Currently, the two mark libraries are installed by default:
* the mark.js package v8.11.1
* the jquery.mark.js from 'https://raw.githubusercontent.com/angezid/mark.js/master/dist/jquery.mark.js'
They are not conflicting with each other and can be switch by checkbox.  

#### The Codejar editor issue
On local machine, using modules will only complicate things - it will be required of using server.  
The package of a code editor `codejar` don't contain `umd` format, currently the `codejar.js` is converted to this format by `replace-in-file` plugin (`rollup` failed to do this).

### Install Mark.js-playground
Clone or download this repository and run:
```
npm install
npm run build
```

### Export/Import
The idea to export/import 'Playground tab' in JSON format:
* save/load the current state
* bug report
* ask for help, if there's problem highlighting something

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
- switching to the Html mode with big Html content is slowly due to using not efficient RegExp
- if you change `mark` element name, highlighting of matches won't work in the Html mode.

Warning: currently there is no protection on unsaved state on the browser reload or on load from local storage.  
You may accidentally click the Load button and silently overwrite the current state by a previously saved one.

### Custom code example
It's a simplify hack to improve performance in the `mark()` method with the large array.  
Switch to the `advanced library` first, then copy below code, paste to the JSON form and press 'Import JSON' button.

``` json
{
    "version": "1.0.0",
    "section": {
        "type": "array",
        "diacritics": false,
        "acrossElements": true,
        "customCode": "const ranges=[];\n<<markjsCode>>\n\nfunction filter(node, term, marks, count, info) {\n  const range = {\n    start : info.offset + info.match.index + info.match[1].length,\n    length : info.match[2].length,\n  };\n  range.startElement = true;  \n  ranges.push(range);\n  return  false;\n}\n\nfunction each(element, info) {}\n\nfunction done() {\n  $('section.array .testString .editor').markRanges(ranges, {\n    // 'wrapAllRanges' : true,\n    'each' : function(elem, range) {\n      if(range.startElement) {\n        elem.setAttribute('data-markjs', 'start-1');\n      }\n    },\n    done : (totalMarks, totalMatches) => highlighter.finish(totalMarks, totalMatches)\n  });\n}",
        "queryArray": "wordsArray_50",
        "testString": {
            "mode": "html",
            "content" : "<p>Load default Html and press Run button</p>"
        }
    }
}
```

### TODO
A lot ...
