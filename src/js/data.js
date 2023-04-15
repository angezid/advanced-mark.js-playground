
const defaultSearchParameter = { string_ : 'wiki wikipedia encyclopedia', array : ['wiki', 'wikipedia', 'encyclopedia'], regexp : '/\\b(?:wiki|wikipedia|encyclopedia)\\b/gi', ranges : [{start : 1, length : 9}, {start : 310, length : 9}] };

// arrays can be used for performance test
const wordArrays = {
    name : 'wordArrays',
    default : defaultSearchParameter.array,

    topWords_50 : ['the','of','and','to','in','is','you','are','for','that','or','it','as','be','on','your','with','can','have','this','an','by','not','but','at','from','they','more','will','if','some','there','what','about','which','when','one','their','all','also','how','many','do','has','most','people','other','time','so','was'],

    words_50 : ['these','may','like','use','into','than','up','out','who','them','make','because','such','through','get','work','even','different','its','no','our','new','film','just','only','see','used','good','been','system','after','computer','best','must','her','life','since','could','does','now','during','learn','around','usually','form','meat','air','day','place','become','number'],

    words_100 : ['thanks','specific','enough','long','lot','hand','popular','small','though','experience','include','job','music','person','really','although','thank','book','early','reading','end','method','never','less','play','able','data','feel','high','off','point','type','whether','food','understanding','here','home','certain','economy','little','theory','tonight','law','put','under','value','always','body','common','market','set','bird','guide','provide','change','interest','literature','sometimes','problem','say','next','create','simple','software','state','together','control','knowledge','power','radio','ability','basic','course','economics','hard','add','company','known','love','past','price','size','away','big','internet','possible','television','three','understand','various','yourself','card','difficult','including','list','mind','particular','real','science','trade'],

    words_150 : ['consider','either','library','likely','nature','fact','line','product','care','group','idea','risk','several','someone','temperature','united','word','fat','force','key','light','simply','today','training','until','major','name','personal','school','top','current','generally','historical','investment','left','national','amount','level','order','practice','research','sense','service','area','cut','hot','instead','least','natural','physical','piece','show','society','try','check','choose','develop','second','useful','web','activity','boss','short','story','call','industry','last','media','mental','move','pay','sport','thing','actually','against','far','fun','house','let','page','remember','term','test','within','along','answer','increase','oven','quite','scared','single','sound','again','community','definition','focus','individual','matter','safety','turn','everything','kind','quality','soil','ask','board','buy','development','guard','hold','language','later','main','offer','oil','picture','potential','professional','rather','access','additional','almost','especially','garden','international','lower','management','open','player','range','rate','reason','travel','variety','video','week','above','according','cook','determine','future','site','alternative','demand','ever','exercise','following','image','quickly','special'],
};

const iframes = '<h1>Iframe Iframe</h1><iframe width="500" height="120" src="html/iframe.html"></iframe><h2>Iframe 2</h2><iframe width="400" height="100" src="html/iframe2.html"></iframe><iframe width="500" height="300" src="html/iframe.html"></iframe>';

const defaultHtml = `
<p><b>Wikipedia</b> (<span class="rt-commentedText nowrap"><span class="IPA nopopups noexcerpt" lang="en-fonipa"><a href="#">/<span style="border-bottom:1px dotted"><span>ˌ</span><span>w</span><span>ɪ</span><span>k</span><span>ɪ</span><span>ˈ</span><span>p</span><span>iː</span><span>d</span><span>i</span><span>ə</span></span>/</a></span> <span class="nowrap" style="font-size:85%">(<span class="unicode haudio"><span class="fn"><span style="white-space:nowrap;margin-right:.25em;"><a href="#"><img alt="" src="#" decoding="async" srcset="#" data-file-width="20" data-file-height="20" width="11" height="11"></a></span><a href="#" class="internal">listen</a></span></span>)</span></span> <a href="#"><i>wik-ih-<span style="font-size:90%">PEE</span>-dee-ə</i></a> or <span class="rt-commentedText nowrap"><span class="IPA nopopups noexcerpt" lang="en-fonipa"><a href="#">/<span style="border-bottom:1px dotted"><span>ˌ</span><span>w</span><span>ɪ</span><span>k</span><span>i</span></span>-/</a></span> <span class="nowrap" style="font-size:85%">(<span class="unicode haudio"><span class="fn"><span style="white-space:nowrap;margin-right:.25em;"><a href="#"><img alt="" src="#" decoding="async" srcset="#" data-file-width="20" data-file-height="20" width="11" height="11"></a></span><a href="#" class="internal">listen</a></span></span>)</span></span> <a href="#"><i>wik-ee-</i></a>) is a <a href="#">multilingual</a> <a href="#" class="mw-redirect">free online encyclopedia</a> written and maintained by a community of <a href="#" class="mw-redirect">volunteers</a> through <a href="#">open collaboration</a> and a <a href="#">wiki</a>-based editing system. Individual contributors, also called editors, are known as <a href="#" class="mw-redirect">Wikipedians</a>. Wikipedia is the largest and most-read <a href="#">reference work</a> in history.<sup id="cite_ref-Wiki20_5-0" class="reference"><a href="#">[3]</a></sup> It is consistently one of the 10 <a href="#">most popular websites</a> ranked by the <a href="#">Similarweb</a> and former <a href="#">Alexa</a>; as of 2022,<sup class="plainlinks noexcerpt noprint asof-tag update" style="display:none;"><a class="external text pressed" href="#">[update]</a></sup> Wikipedia was ranked the 7th most popular site.<sup id="cite_ref-Wiki20_5-1" class="reference"><a href="#">[3]</a></sup><sup id="cite_ref-Alexa_siteinfo_6-0" class="reference"><a href="#">[4]</a></sup><sup id="cite_ref-Similarweb_7-0" class="reference"><a href="#">[5]</a></sup> It is hosted by the <a href="#">Wikimedia Foundation</a>, an <a href="#">American non-profit organization</a> funded mainly through donations.<sup id="cite_ref-8" class="reference"><a href="#">[6]</a></sup></p>
<p>On January 15, 2001, <a href="#">Jimmy Wales</a><sup id="cite_ref-auto1_9-0" class="reference"><a href="#">[7]</a></sup> and <a href="#">Larry Sanger</a> launched Wikipedia.Sanger coined its name as a <a href="#">blend</a> of  "wiki" and "encyclopedia."<sup id="cite_ref-MiliardWho_10-0" class="reference"><a href="#">[8]</a></sup><sup id="cite_ref-J_Sidener_11-0" class="reference"><a href="#">[9]</a></sup>Wales was influenced by the "<a href="#">spontaneous order</a>" ideas associated with <a href="#">Friedrich Hayek</a> and the <a href="#">Austrian School</a> of economics, after being exposed to these ideas by Austrian economist and <a href="#">Mises Institute</a> Senior Fellow <a href="#">Mark Thornton</a>.<sup id="cite_ref-12" class="reference"><a href="#">[10]</a></sup> Initially available only in English, versions in other languages werequickly developed. Its combined editions comprise more than 58 millionarticles, attracting around 2<span class="nowrap">&nbsp;</span>billion unique device visits per month and more than 17 million edits per month (1.9<span class="nowrap">&nbsp;</span>edits per second) as of November&nbsp;2020<sup class="plainlinks noexcerpt noprint asof-tag update" style="display:none;"><a class="external text pressed" href="#">[update]</a></sup>.<sup id="cite_ref-small_screen_13-0" class="reference"><a href="#">[11]</a></sup><sup id="cite_ref-Wikimedia_Stats_14-0" class="reference"><a href="#">[12]</a></sup>In 2006, <i><a href="#">Time magazine</a></i> stated that the policy of allowing anyone to edit had made Wikipedia the "biggest (and perhaps best) encyclopedia in the world."<sup id="cite_ref-auto1_9-1" class="reference"><a href="#">[7]</a></sup></p>
`;

// exported json requires replacing backslash \ by \\
// should be : backslash itself (\\) - 8, escape char (\b) - 4, escape double quote - 2
// also, there is need to delete a library property in examples, which intended to work in both libraries
const examples = {
	name : 'examples',
	
	accuracyExactly : `{
        "version": "2.0.0",
        "library": "advanced",
        "section": {
            "type": "string_",
            "accuracy": "{ value: 'exactly', limiters : ',.;:?!/\\"\\\\'[]{}()~@#$%^&*+=|\\\\\\\\-' }",
            "queryString": "cafe resume expose lame mate ore pate rose",
            "testString": {
                "mode": "html",
                "content": "cafe resume expose lame mate ore pate rose café résumé resumé exposé lamé maté öre øre pâté rosé (cafe) [resume] {expose} 'lame' \\"mate\\" ore, pate. rose% café- @résumé resumé, exposé. lamé? maté! $öre|øre pâté* rosé;"
            }
        }
    }`,
    
	exclude : `{
        "version": "1.0.0",
        "section": {
            "type": "array",
            "exclude": "'.exclude, .exclude *'",
            "diacritics": false,
            "queryArray": "['Lorem', 'ipsum', 'dolor', 'amet']",
            "testString": {
                "mode": "html",
                "content": "<p>Lorem ipsum dolor sit amet</p>\\n<p class=\\"exclude\\">[exclude] Lorem <i>ipsum <b>dolor</b> sit</i> amet</p><p><b>Note:</b> to exclude all descendants, you need to use '.exclude *' selector</p>\\n<p>Lorem ipsum dolor sit amet</p>"
            }
        }
    }`,

	exclude : `{
        "version": "2.0.0",
        "section": {
            "type": "array",
            "exclude": "'.exclude, .exclude *'",
            "diacritics": false,
            "queryArray": "['Lorem', 'ipsum', 'dolor', 'amet']",
            "testString": {
                "mode": "html",
                "content": "<p>Lorem ipsum dolor sit amet</p>\\n<p class=\\"exclude\\">[exclude] Lorem <i>ipsum <b>dolor</b> sit</i> amet</p><p><b>Note:</b> to exclude all descendants, you need to use '.exclude *' selector</p>\\n<p>Lorem ipsum dolor sit amet</p>"
            }
        }
    }`,

	ignorePunctuation : `{
        "version": "2.0.0",
        "library": "advanced",
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
		"version": "2.0.0",
        "library": "advanced",
        "section": {
            "type": "array",
            "diacritics": false,
            "shadowDOM": "{ 'style' : \\"mark[data-markjs] { color:red; }\\" }",
            "customCode": "// your code before\\nconst container = tab.getTestElement();\\nlet elem = container.querySelector('#shadow-dom');\\nif ( !elem) {\\n  const div = document.createElement(\\"div\\");\\n  div.id = 's2';\\n  div.innerHTML = '<b>Shadow DOM test</b><div id=\\"shadow-dom\\"></div>';\\n  container.appendChild(div);\\n  elem = container.querySelector('#shadow-dom');\\n}\\n\\nif (elem && !elem.shadowRoot) {\\n  const root2 = elem.attachShadow({ mode : 'open' });\\n  root2.innerHTML = defaultHtml;\\n}\\n\\n<<markjsCode>> // don't remove this line\\n\\nfunction filter(node, term, marks, count, info) {\\n  return true;\\n}\\n\\nfunction each(element, info) {}\\n\\nfunction done(totalMarks, totalMatches, termStats) {}",
            "queryArray": "['wiki', 'wikipedia', 'encyclopedia']",
            "testString": {
                "mode": "html",
                "content": "defaultHtml"
            }
        }
	}`,

	iframes : `{
        "version": "2.0.0",
        "library": "advanced",
        "section": {
            "type": "string_",
            "accuracy": "exactly",
            "diacritics": false,
            "exclude": "'#ifr2'",
            "iframes": true,
            "combinePatterns": 10,
            "customCode": "// don't foget to launch sever (see README)\\n// dynamically loads html on run\\ncode.setHtml('<h1>Iframe</h1><iframe src=\\"html/iframe.html\\" width=\\"500\\" height=\\"120\\"></iframe><h2>Iframe 2</h2><iframe src=\\"html/iframe2.html\\" width=\\"400\\" height=\\"100\\" id=\\"ifr2\\"></iframe><h3>Iframe 3</h3><iframe src=\\"html/nested-iframe.html\\" width=\\"500\\" height=\\"450\\"></iframe>');\\n\\n<<markjsCode>> // don't remove this line\\n\\nfunction each(element, info) {}\\n\\nfunction done(totalMarks, totalMatches, termStats) {}",
            "queryString": "iframe test wikipedia encyclopedia",
            "testString": {
                "mode": "html",
                "content": "Iframes test"
            }
        }
    }`,

	markWhileTyping : `{
        "version": "2.0.0",
        "library": "advanced",
        "section": {
            "type": "string_",
            "diacritics": false,
            "iframes": true,
            "shadowDOM": true,
            "customCode": "// adds event listener to the search editor\\ncode.setListener('keyup', runCode);\\n\\n// initiate shadow DOM\\nconst elem = tab.getTestElement().querySelector('#shadow-dom');\\nif (elem && !elem.shadowRoot) {\\n  const root = elem.attachShadow({ mode : 'open' });\\n  root.innerHTML = '<h3>Shadow DOM test</h3><p>Hello world!</p>';\\n}\\n\\n<<markjsCode>> // don't remove this line\\n\\nfunction each(element, info) {}\\n\\nfunction done(totalMarks, totalMatches, termStats) {}",
            "queryString": "h",
            "testString": {
                "mode": "html",
                "content": "<p>Hello world!</p>\\n<hr><h3>Iframe test</h3>\\n<iframe height=\\"70\\" src=\\"\\" srcdoc=\\"<p>Hello world!</p>\\"></iframe>\\n<hr>\\n<div id=\\"shadow-dom\\"></div"
            }
        }
    }`,

	customCodeEditor : `{
        "version": "2.0.0",
        "library": "advanced",
        "section": {
            "type": "array",
            "accuracy": "exactly",
            "diacritics": false,
            "cacheTextNodes": true,
            "customCode": "// Note that the option 'cacheTextNodes' can be used without generating ranges.\\n// It just demonstrates how to use the custom code editor.\\n// your code before\\nconst ranges=[];\\n<<markjsCode>> // don't remove this line\\n\\nfunction filter(node, term, marks, count, info) {\\n  const range = {\\n    start : info.offset + info.match.index + info.match[1].length,\\n    length : info.match[2].length,\\n  };\\n  if (options.acrossElements) {\\n    if (info.matchStart) {\\n      range.startElement = true;\\n    }\\n  } else range.startElement = true;\\n  ranges.push(range);\\n  \\n  // it should only build ranges\\n  return  false;\\n}\\n\\nfunction done() {\\n  instance.markRanges(ranges, {\\n    'each' : function(elem, range) {\\n      if (range.startElement) {\\n        elem.setAttribute('data-markjs', 'start-1');\\n      }\\n    },\\n    done : highlighter.finish\\n  });\\n}",
            "queryArray": "wordArrays.words_50",
            "testString": {
                "mode": "html",
                "content": "defaultHtml"
            }
        }
    }`,

	markSeparateGroups : `{
        "version": "2.0.0",
        "library": "advanced",
        "section": {
            "type": "regexp",
            "acrossElements": true,
            "separateGroups": true,
            "customCode": "// your code before\\n<<markjsCode>> // don't remove this line\\n\\nfunction filter(node, matchString, count, info) {\\n  if (info.match.length === 4 && info.groupIndex === 2) return false;\\n  return true;\\n}\\n\\nfunction each(element, info) {}\\n\\nfunction done(totalMarks, totalMatches) {}",
            "queryRegExp": "/(AB)\\\\b(.+?)\\\\b(BC)(?!D)/g",
            "testString": {
                "mode": "html",
                "content": "AAB xxx BCD xx BC  AAB xxx BCD xx BC\\n\\nIt demonstrates requirement of a group 2 to correctly highlight groups without 'd' flag.\\nIf the parenthesis of the group 2 are removed, the wrong 'BC' is highlighted.\\nWith 'd' flag it's highlighted correctly."
            }
        }
    }`,

	blockElementsBoundary : `{
        "version": "2.0.0",
        "library": "advanced",
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

	overlappedMatches : `{
        "version": "2.0.0",
        "library": "advanced",
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
        "version": "2.0.0",
        "library": "advanced",
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
        "version": "2.0.0",
        "library": "advanced",
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
};
