
const searchParameters = { string_ : 'lorem ipsum dolor "at vero eos"', array : ['lorem', 'ipsum', 'dolor'], regexp : '/\\b(?:lorem|ipsum|dolor)\\b/gi', ranges : [{start : 0, length : 17}, {start : 291, length : 17}] };

// arrays can be used for performance test
const wordArrays = {
    name : 'wordArrays',
    default : searchParameters.array,

    topWords_50 : ['the','of','and','to','in','is','you','are','for','that','or','it','as','be','on','your','with','can','have','this','an','by','not','but','at','from','they','more','will','if','some','there','what','about','which','when','one','their','all','also','how','many','do','has','most','people','other','time','so','was'],

    words_50 : ['these','may','like','use','into','than','up','out','who','them','make','because','such','through','get','work','even','different','its','no','our','new','film','just','only','see','used','good','been','system','after','computer','best','must','her','life','since','could','does','now','during','learn','around','usually','form','meat','air','day','place','become','number'],

    words_100 : ['thanks','specific','enough','long','lot','hand','popular','small','though','experience','include','job','music','person','really','although','thank','book','early','reading','end','method','never','less','play','able','data','feel','high','off','point','type','whether','food','understanding','here','home','certain','economy','little','theory','tonight','law','put','under','value','always','body','common','market','set','bird','guide','provide','change','interest','literature','sometimes','problem','say','next','create','simple','software','state','together','control','knowledge','power','radio','ability','basic','course','economics','hard','add','company','known','love','past','price','size','away','big','internet','possible','television','three','understand','various','yourself','card','difficult','including','list','mind','particular','real','science','trade'],

    words_150 : ['consider','either','library','likely','nature','fact','line','product','care','group','idea','risk','several','someone','temperature','united','word','fat','force','key','light','simply','today','training','until','major','name','personal','school','top','current','generally','historical','investment','left','national','amount','level','order','practice','research','sense','service','area','cut','hot','instead','least','natural','physical','piece','show','society','try','check','choose','develop','second','useful','web','activity','boss','short','story','call','industry','last','media','mental','move','pay','sport','thing','actually','against','far','fun','house','let','page','remember','term','test','within','along','answer','increase','oven','quite','scared','single','sound','again','community','definition','focus','individual','matter','safety','turn','everything','kind','quality','soil','ask','board','buy','development','guard','hold','language','later','main','offer','oil','picture','potential','professional','rather','access','additional','almost','especially','garden','international','lower','management','open','player','range','rate','reason','travel','variety','video','week','above','according','cook','determine','future','site','alternative','demand','ever','exercise','following','image','quickly','special'],
};

//const iframes = '<h1>Iframe 1</h1><iframe width="500" height="120" src="html/iframe.html"></iframe><h2>Iframe 2</h2><iframe width="400" height="100" src="html/iframe2.html"></iframe><iframe width="500" height="300" src="html/iframe.html"></iframe>';

const shadowStyle = `<style>.editor {
    font-family: Arial, sans-serif;
    font-size: 1em;
    border: #ccc 1px solid;
    border-radius: 3px;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 1px 5px 0 rgba(0, 0, 0, 0.07), 0 3px 1px -2px rgba(0, 0, 0, 0.05);
    font-size: 14px;
    font-weight: 400;
    min-height: 30vh;
    max-height: 40vh;
    letter-spacing: normal;
    line-height: 20px;
    margin: 0;
    padding: 5px 10px;
    tab-size: 4;
}
a[href] { color: #006ab7; text-decoration: underline; }
p { margin: 10px 0 0 0; }
code { font-family: Consolas, monospace; font-size: 1em; padding: 0 3px; color: #b12; background: #f8f8f8; border: #d8d8d8 1px solid; }
mark[data-markjs],
*[data-markjs].custom-element { background: #c1e8ec; padding: 0; border: #c0e6ea 1px solid; }
mark[data-markjs].current,
*[data-markjs].custom-element.current { font-size: 110%; background: #ffe763; border-color: #ffe763; border-bottom: #444 2px solid; }
mark[data-markjs].mark-term { background: #ffe408; }
mark[data-markjs].mark-element.current { background: #ddd; border-width: 0; }

::highlight(advanced-markjs) { background-color: #b3e7f0; }
::highlight(playground) { background-color: #b3e7f0; }

@media only screen and (max-width: 980px) {
    .left-column, .right-column, .column { width: 100%; }
    .editor { min-height: 20vh; max-height: 35vh; }
}
</style>`;
// a8e2e8
// exported json requires replacing backslash \ by \\
// should be : backslash itself (\\) - 8, escape char (\b) - 4, escape double quote - 2
const examples = {
	name : 'Examples',

	exclude : `{
        "version": "3.0.0",
        "section": {
            "type": "array",
            "exclude": "'.exclude, .exclude *'",
            "diacritics": false,
            "queryArray": "['Lorem', 'ipsum', 'dolor', 'amet']",
            "testString": {
                "mode": "html",
                "content": "<p>Lorem ipsum dolor sit amet</p>\\n<p class=\\"exclude\\">[excluded] Lorem <i>ipsum <b>dolor</b> sit</i> amet</p><p><b>Note:</b> to exclude all descendants, you need to use '.exclude *' selector</p>\\n<p>Lorem ipsum dolor sit amet</p>"
            }
        }
    }`,

	preserveTerms : ` {
        "version": "3.0.0",
        "section": {
            "type": "string_",
            "separateWordSearch": "preserveTerms",
            "diacritics": false,
            "queryString": "word \\"preserved term\\" \\"\\"quoted term\\"\\"",
            "testString": {
                "mode": "html",
                "content": "<p>separate word preserved term \\"quoted term\\"</p>"
            }
        }
    }`,

	accuracyExactly : `{
        "version": "3.0.0",
        "section": {
            "type": "string_",
            "accuracy": "{ value: 'exactly', limiters : ',.;:?!/\\"\\\\'[]{}()~@#$%^&*+=|\\\\\\\\-' }",
            "queryString": "cafe resume expose lame mate ore pate rose",
            "testString": {
                "mode": "html",
                "content": "<p>cafe resume expose lame mate ore pate rose café résumé resumé exposé lamé maté öre øre pâté rosé (cafe) [resume] {expose} 'lame' \\"mate\\" ore, pate. rose% café- @résumé resumé, exposé. lamé? maté! $öre|øre pâté* rosé;</p>\\n<p> Accuracy <code>exactly</code> option requires an accuracy object with specified word limiters.</p>"
            }
        }
    }`,

	accuracyStartsWith : `{
        "version": "3.0.0",
        "section": {
            "type": "string_",
            "separateWordSearch": "preserveTerms",
            "accuracy": "startsWith",
            "diacritics": false,
            "queryString": "acc opt \\"st w val\\"",
            "testString": {
                "mode": "html",
                "content": "<p>accuracy option with starts with value</p>\\n<p> Accuracy example which uses built-in word boundary characters.\\nIt also demonstrates <code>separateWordSearch: 'preserveTerms'</code> option.</p>"
            }
        }
    }`,

	ignorePunctuation : `{
        "version": "3.0.0",
        "section": {
            "type": "string_",
            "diacritics": false,
            "ignorePunctuation": "':;.,-–—‒-_(){}[]!\\\\'\\"+='",
            "queryString": "browsers resign numbers",
            "testString": {
                "mode": "html",
                "content": "browser's console, number(s), re-sign, "
            }
        }
    }`,

	shadowDOM : `{
		"version": "3.0.0",
        "section": {
            "type": "array",
            "diacritics": false,
            "shadowDOM": "{ 'style' : \\"mark[data-markjs] { color:red; } ::highlight(advanced-markjs) { color:red; }\\" }",
            "customCode": "// your code before\\nconst container = tab.getTestElement();\\nlet elem = container.querySelector('#shadow-dom');\\nif ( !elem) {\\n  const div = document.createElement(\\"div\\");\\n  div.id = 's2';\\n  div.innerHTML = '<h2>Shadow DOM test</h2><div id=\\"shadow-dom\\"></div>';\\n  container.appendChild(div);\\n  elem = container.querySelector('#shadow-dom');\\n}\\n\\nif (elem && !elem.shadowRoot) {\\n  const root2 = elem.attachShadow({ mode : 'open' });\\n  root2.innerHTML = defaultHtmls['loremIframe'];\\n}\\n\\n<<markjsCode>> // don't remove this line\\n\\nfunction filter(node, term, marks, count, info) {\\n  return true;\\n}\\n\\nfunction each(element, info) {}\\n\\nfunction done(totalMarks, totalMatches, termStats) {}",
            "queryArray": "['lorem', 'ipsum', 'dolor']",
            "testString": {
                "mode": "html",
                "content": "defaultHtml"
            }
        }
	}`,

	iframes : `{
        "version": "3.0.0",
        "section": {
            "type": "string_",
            "accuracy": "exactly",
            "diacritics": false,
            "exclude": "'#ifr2'",
            "iframes": "{ 'style' : \\"mark[data-markjs] { color:red; } ::highlight(advanced-markjs) { color:red; }\\" }",
            "customCode": "// dynamically loads the HTML on run\\ncode.setHtml('<h1>Iframe</h1><iframe src=\\"html/iframe.html\\" width=\\"500\\" height=\\"120\\"></iframe><h2>Iframe 2</h2><iframe src=\\"html/iframe2.html\\" width=\\"400\\" height=\\"100\\" id=\\"ifr2\\"></iframe><h3>Iframe 3</h3><iframe src=\\"html/nested-iframe.html\\" width=\\"500\\" height=\\"450\\"></iframe>');\\n\\n<<markjsCode>> // don't remove this line\\n\\nfunction each(element, info) {}\\n\\nfunction done(totalMarks, totalMatches, termStats) {}",
            "queryString": "iframe test lorem ipsum",
            "testString": {
                "mode": "html",
                "content": "Iframes test"
            }
        }
    }`,

	srcdocIframe : `{
        "version": "3.0.0",
        "section": {
            "type": "string_",
            "accuracy": "startsWith",
            "diacritics": false,
            "iframes": "{ 'style' : \\"mark[data-markjs] { color:red; } ::highlight(advanced-markjs) { color:red; }\\" }",
            "customCode": "code.setHtml('<iframe srcdoc=\\"Hello world!\\"></iframe>');\\n// adds event listener to the search editor\\ncode.setListener('keyup', runCode);\\n\\n<<markjsCode>> // don't remove this line\\n\\nfunction each(element, info) {}\\n\\nfunction done(totalMarks, totalMatches, termStats) {}",
            "queryString": "h",
            "selectors": "iframe",
            "selectorAll": true
        }
    }`,

	markWhileTyping : `{
        "version": "3.0.0",
        "section": {
            "type": "string_",
            "diacritics": false,
            "iframes": true,
            "shadowDOM": true,
            "customCode": "// adds event listener to the search editor\\ncode.setListener('keyup', runCode);\\n\\n// initiate shadow DOM\\nconst elem = tab.getTestElement().querySelector('#shadow-dom');\\nif (elem && !elem.shadowRoot) {\\n  const root = elem.attachShadow({ mode : 'open' });\\n  root.innerHTML = '<h3>Shadow DOM test</h3><p>Hello world!</p>';\\n}\\n\\n<<markjsCode>> // don't remove this line\\n\\nfunction each(element, info) {}\\n\\nfunction done(totalMarks, totalMatches, termStats) {}",
            "queryString": "h",
            "testString": {
                "mode": "html",
                "content": "<p>Hello world!</p>\\n<hr><h3>Iframe test</h3>\\n<iframe height=\\"70\\" src=\\"\\" srcdoc=\\"<p>Hello world!</p>\\"></iframe>\\n<hr>\\n<div id=\\"shadow-dom\\"></div>\\n<hr>\\n<p>Try out accuracy 'startsWith' option</p>"
            }
        }
    }`,

	markSeparateGroups : `{
        "version": "3.0.0",
        "section": {
            "type": "regexp",
            "acrossElements": true,
            "separateGroups": true,
            "customCode": "// your code before\\n<<markjsCode>> // don't remove this line\\n\\nfunction filter(node, matchString, count, info) {\\n  if (info.match[3] && info.groupIndex === 2) return false;\\n  return true;\\n}\\n\\nfunction each(element, info) {}\\n\\nfunction done(totalMarks, totalMatches) {}",
            "queryRegExp": "/(AB)\\\\b.+?\\\\b(BC)(?!D)/dg",
            "testString": {
                "mode": "html",
                "content": "AAB xxx BCD xx BC  AAB xxx BCD xx BC\\n"
            }
        }
    }`,

	blockElementsBoundary : `{
        "version": "3.0.0",
        "section": {
            "type": "string_",
            "separateWordSearch": false,
            "accuracy": "exactly",
            "diacritics": false,
            "acrossElements": true,
            "blockElementsBoundary": "{ tagNames : ['s', 'my-tag'], extend : true }",
            "queryString": "lorem ipsum dolor",
            "testString": {
                "mode": "html",
                "content": "<h2><b>Lorem ipsum</b></h2>dolor\\n<p>Lorem ipsum dolor</p>\\n<p>Lorem ipsum<br>dolor</p>\\n<p>Lorem <s>ipsum</s> dolor</p>\\n<p>Lorem ipsum <my-tag>dolor</my-tag></p>\\n<p>// Removing 'extend : true' switch to 'only custom elements have boundaries' mode</p>"
            }
        }
	}`,

	markLineRanges : `{
        "version": "3.0.0",
        "section": {
            "type": "ranges",
            "wrapAllRanges": true,
            "markLines": true,
            "queryRanges": "[{ start: 2, length: 3 }, { start: 3, length: 1 }, { start: 6, length: 2 }, { start: 7, length: 3 }]",
            "testString": {
                "mode": "html",
                "content": "<div class=\\"mark-lines-pre\\"><pre>one<br>two\\nthree\\n\\nfive\\nsix<br>seven<br>\\nnine\\nten\\n</pre></div>"
            }
        }
    }`,

	overlappedMatches : `{
        "version": "3.0.0",
        "section": {
            "type": "regexp",
            "acrossElements": true,
            "separateGroups": true,
            "wrapAllRanges": true,
            "queryRegExp": "/(?<=(gr1)\\\\s+\\\\w+\\\\b).+?(gr2)/dg",
            "testString": {
                "mode": "html",
                "content": "gr1 match1 gr1 gr2 match2 gr2\\n\\nDemonstrates 'wrapAllRanges' option"
            }
        }
    }`,

	overlappedGroups : `{
        "version": "3.0.0",
        "section": {
            "type": "regexp",
            "acrossElements": true,
            "separateGroups": true,
            "wrapAllRanges": true,
            "queryRegExp": "/\\\\w+(?=.*?(gr1 \\\\w+))(?=.*?(\\\\w+ gr2))/dg",
            "testString": {
                "mode": "html",
                "content": "word gr1 overlapping gr2\\n\\nDemonstrates 'wrapAllRanges' option"
            }
        }
    }`,

	randomGroups : `{
        "version": "3.0.0",
        "section": {
            "type": "regexp",
            "acrossElements": true,
            "separateGroups": true,
            "wrapAllRanges": true,
            "queryRegExp": "/(?=\\\\d*(1))(?=\\\\d*(2))(?=\\\\d*(3))/dg",
            "testString": {
                "mode": "html",
                "content": "123\\n132\\n213\\n231\\n312\\n321\\n\\nDemonstrates 'wrapAllRanges' option"
            }
        }
    }`,

	performance : `{
        "version": "3.0.0",
        "library": "advanced",
        "section": {
            "type": "array",
            "accuracy": "exactly",
            "diacritics": false,
            "combineBy": 200,
            "customCode": "let count = 0;\\n// your code before\\n<<markjsCode>> // don't remove this line\\n\\nfunction filter(textNode, term, matchesSoFar, termMatchesSoFar, info) {\\n   // if (++count > 100) { info.execution.abort = true; return false; }\\n  return true;\\n}\\n\\nfunction each(element, info) {}\\n\\nfunction done(totalMarks, totalMatches, termStats) {}",
            "queryArray": "wordArrays.words_50",
            "testString": {
                "mode": "html",
                "content": "Select desired HTML size by using HTML selector."
            }
        }
    }`,
};

const defaultHtmls = {
    name : 'HTMLs',

    iframes : '<h1>Iframe 1</h1><iframe width="500" height="120" src="html/iframe.html"></iframe><h2>Iframe 2</h2><iframe width="500" height="100" src="html/nested-iframe.html"></iframe>',

    loremIframe : `<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit.</p>
    <iframe width="500" height="120" src="html/iframe.html"></iframe>`,

    lorem : `<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit.</p>
<p>Lorem <em>ipsum</em> <a href="#">dolor</a> sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor 'sit' amet.</p>`,

    fox : `<p>The quick, brown <em>fox</em> jumps over a lazy <em>dog</em>.</p>`,

    wikipedia : `<p><b>Wikipedia</b> (<span><span lang="en-fonipa"><a href="#">/<span style="border-bottom:1px dotted"><span>ˌ</span><span>w</span><span>ɪ</span><span>k</span><span>ɪ</span><span>ˈ</span><span>p</span><span>iː</span><span>d</span><span>i</span><span>ə</span></span>/</a></span> <span style="font-size:85%">(<span><span><span style="white-space:nowrap;margin-right:.25em;"><a href="#"><img alt="" src="#" decoding="async" srcset="#" data-file-width="20" data-file-height="20" width="11" height="11"></a></span><a href="#">listen</a></span></span>)</span></span> <a href="#"><i>wik-ih-<span style="font-size:90%">PEE</span>-dee-ə</i></a> or <span><span lang="en-fonipa"><a href="#">/<span style="border-bottom:1px dotted"><span>ˌ</span><span>w</span><span>ɪ</span><span>k</span><span>i</span></span>-/</a></span> <span style="font-size:85%">(<span><span><span style="white-space:nowrap;margin-right:.25em;"><a href="#"><img alt="" src="#" decoding="async" srcset="#" data-file-width="20" data-file-height="20" width="11" height="11"></a></span><a href="#">listen</a></span></span>)</span></span> <a href="#"><i>wik-ee-</i></a>) is a <a href="#">multilingual</a> <a href="#">free online encyclopedia</a> written and maintained by a community of <a href="#">volunteers</a> through <a href="#">open collaboration</a> and a <a href="#">wiki</a>-based editing system. Individual contributors, also called editors, are known as <a href="#">Wikipedians</a>. Wikipedia is the largest and most-read <a href="#">reference work</a> in history.<sup><a href="#">[3]</a></sup> It is consistently one of the 10 <a href="#">most popular websites</a> ranked by the <a href="#">Similarweb</a> and former <a href="#">Alexa</a>; as of 2022,<sup style="display:none;"><a href="#">[update]</a></sup> Wikipedia was ranked the 7th most popular site.<sup><a href="#">[3]</a></sup><sup><a href="#">[4]</a></sup><sup><a href="#">[5]</a></sup> It is hosted by the <a href="#">Wikimedia Foundation</a>, an <a href="#">American non-profit organization</a> funded mainly through donations.<sup><a href="#">[6]</a></sup></p>
<p>On January 15, 2001, <a href="#">Jimmy Wales</a><sup><a href="#">[7]</a></sup> and <a href="#">Larry Sanger</a> launched Wikipedia.Sanger coined its name as a <a href="#">blend</a> of  "wiki" and "encyclopedia."<sup><a href="#">[8]</a></sup><sup><a href="#">[9]</a></sup>Wales was influenced by the "<a href="#">spontaneous order</a>" ideas associated with <a href="#">Friedrich Hayek</a> and the <a href="#">Austrian School</a> of economics, after being exposed to these ideas by Austrian economist and <a href="#">Mises Institute</a> Senior Fellow <a href="#">Mark Thornton</a>.<sup><a href="#">[10]</a></sup> Initially available only in English, versions in other languages werequickly developed. Its combined editions comprise more than 58 millionarticles, attracting around 2<span>&nbsp;</span>billion unique device visits per month and more than 17 million edits per month (1.9<span>&nbsp;</span>edits per second) as of November&nbsp;2020<sup style="display:none;"><a href="#">[update]</a></sup>.<sup><a href="#">[11]</a></sup><sup><a href="#">[12]</a></sup>In 2006, <i><a href="#">Time magazine</a></i> stated that the policy of allowing anyone to edit had made Wikipedia the "biggest (and perhaps best) encyclopedia in the world."<sup><a href="#">[7]</a></sup></p>
    `,
    text_100KB : `Something went wrong`,
    text_250KB : `Something went wrong`,
    text_500KB : `Something went wrong`,
    text_1000KB : `Something went wrong`,
};
