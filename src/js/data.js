
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

const minHtml = `<div id="mw-page-base" class="noprint"><p>Wikipedia is the largest and most-read <a href="#">reference work</a> in history.</p></div>`;

//const defaultHtml = '<h1>Iframe</h1><iframe width="500" height="250" src="http://example.com/"></iframe>';
//const defaultHtml = '<h1>Iframe</h1><iframe width="500" height="250" src="html/onload.html"></iframe>';
//const defaultHtml = '<iframe width="500" height="120" src="html/iframe.html"></iframe><h1>Iframe</h1><iframe width="500" height="250" src="html/nested.html""></iframe>';
//const defaultHtml = '<h1>Iframe Iframe</h1><iframe width="500" height="120" src="html/iframe.html"></iframe><h2>Iframe 2</h2><iframe width="400" height="100" src="html/iframe2.html"></iframe><h3>Iframe 3</h3><iframe width="300" height="100" src="html/iframe3.html"></iframe>';
//const defaultHtml = '<h1>Iframe</h1><iframe width="500" height="120" src="html/iframe.html"></iframe><h2>Iframe 2</h2><iframe width="400" height="100" src="html/iframe2.html"></iframe><h3>Iframe 3</h3><iframe width="500" height="300" src="html/nested-iframe.html"></iframe>';
//const defaultHtml = '<h1>Iframe Iframe</h1><iframe width="500" height="120" src="html/iframe.html"></iframe><h2>Iframe 2</h2><iframe width="400" height="100" src="html/iframe2.html"></iframe>';

const defaultHtml = `
<p><b>Wikipedia</b> (<span class="rt-commentedText nowrap"><span class="IPA nopopups noexcerpt" lang="en-fonipa"><a href="#">/<span style="border-bottom:1px dotted"><span>ˌ</span><span>w</span><span>ɪ</span><span>k</span><span>ɪ</span><span>ˈ</span><span>p</span><span>iː</span><span>d</span><span>i</span><span>ə</span></span>/</a></span> <span class="nowrap" style="font-size:85%">(<span class="unicode haudio"><span class="fn"><span style="white-space:nowrap;margin-right:.25em;"><a href="#"><img alt="" src="#" decoding="async" srcset="#" data-file-width="20" data-file-height="20" width="11" height="11"></a></span><a href="#" class="internal">listen</a></span></span>)</span></span> <a href="#"><i>wik-ih-<span style="font-size:90%">PEE</span>-dee-ə</i></a> or <span class="rt-commentedText nowrap"><span class="IPA nopopups noexcerpt" lang="en-fonipa"><a href="#">/<span style="border-bottom:1px dotted"><span>ˌ</span><span>w</span><span>ɪ</span><span>k</span><span>i</span></span>-/</a></span> <span class="nowrap" style="font-size:85%">(<span class="unicode haudio"><span class="fn"><span style="white-space:nowrap;margin-right:.25em;"><a href="#"><img alt="" src="#" decoding="async" srcset="#" data-file-width="20" data-file-height="20" width="11" height="11"></a></span><a href="#" class="internal">listen</a></span></span>)</span></span> <a href="#"><i>wik-ee-</i></a>) is a <a href="#">multilingual</a> <a href="#" class="mw-redirect">free online encyclopedia</a> written and maintained by a community of <a href="#" class="mw-redirect">volunteers</a> through <a href="#">open collaboration</a> and a <a href="#">wiki</a>-based editing system. Individual contributors, also called editors, are known as <a href="#" class="mw-redirect">Wikipedians</a>. Wikipedia is the largest and most-read <a href="#">reference work</a> in history.<sup id="cite_ref-Wiki20_5-0" class="reference"><a href="#">[3]</a></sup> It is consistently one of the 10 <a href="#">most popular websites</a> ranked by the <a href="#">Similarweb</a> and former <a href="#">Alexa</a>; as of 2022,<sup class="plainlinks noexcerpt noprint asof-tag update" style="display:none;"><a class="external text pressed" href="#">[update]</a></sup> Wikipedia was ranked the 7th most popular site.<sup id="cite_ref-Wiki20_5-1" class="reference"><a href="#">[3]</a></sup><sup id="cite_ref-Alexa_siteinfo_6-0" class="reference"><a href="#">[4]</a></sup><sup id="cite_ref-Similarweb_7-0" class="reference"><a href="#">[5]</a></sup> It is hosted by the <a href="#">Wikimedia Foundation</a>, an <a href="#">American non-profit organization</a> funded mainly through donations.<sup id="cite_ref-8" class="reference"><a href="#">[6]</a></sup></p>
<p>On January 15, 2001, <a href="#">Jimmy Wales</a><sup id="cite_ref-auto1_9-0" class="reference"><a href="#">[7]</a></sup> and <a href="#">Larry Sanger</a> launched Wikipedia.Sanger coined its name as a <a href="#">blend</a> of  "wiki" and "encyclopedia."<sup id="cite_ref-MiliardWho_10-0" class="reference"><a href="#">[8]</a></sup><sup id="cite_ref-J_Sidener_11-0" class="reference"><a href="#">[9]</a></sup>Wales was influenced by the "<a href="#">spontaneous order</a>" ideas associated with <a href="#">Friedrich Hayek</a> and the <a href="#">Austrian School</a> of economics, after being exposed to these ideas by Austrian economist and <a href="#">Mises Institute</a> Senior Fellow <a href="#">Mark Thornton</a>.<sup id="cite_ref-12" class="reference"><a href="#">[10]</a></sup> Initially available only in English, versions in other languages werequickly developed. Its combined editions comprise more than 58 millionarticles, attracting around 2<span class="nowrap">&nbsp;</span>billion unique device visits per month and more than 17 million edits per month (1.9<span class="nowrap">&nbsp;</span>edits per second) as of November&nbsp;2020<sup class="plainlinks noexcerpt noprint asof-tag update" style="display:none;"><a class="external text pressed" href="#">[update]</a></sup>.<sup id="cite_ref-small_screen_13-0" class="reference"><a href="#">[11]</a></sup><sup id="cite_ref-Wikimedia_Stats_14-0" class="reference"><a href="#">[12]</a></sup>In 2006, <i><a href="#">Time magazine</a></i> stated that the policy of allowing anyone to edit had made Wikipedia the "biggest (and perhaps best) encyclopedia in the world."<sup id="cite_ref-auto1_9-1" class="reference"><a href="#">[7]</a></sup></p>
`;

// (?<!\\)\\([^\\])   \\$1
const examples = {
	name : 'examples',
	accuracyExactly : `{
        "version": "1.0.0",
        "library": "advanced",
        "section": {
            "type": "string_",
            "accuracy": "{ 'value': 'exactly', 'limiters': [',', '.', ';', ':', '?', '!', '/', '\\"', '\\\\'', '[', ']', '{', '}', '(', ')', '~', '@', '#', '$', '%', '^', '&', '*', '+', '=', '|', '\\\\\\\\', '-'] }",
            "queryString": "cafe resume expose lame mate ore pate rose",
            "testString": {
                "mode": "html",
                "content": "cafe resume expose lame mate ore pate rose café résumé resumé exposé lamé maté öre øre pâté rosé (cafe) [resume] {expose} 'lame' \\"mate\\" ore, pate. rose% café- @résumé resumé, exposé. lamé? maté! $öre|øre pâté* rosé;"
            }
        }
    }`,
    
	shadowDOM : `{
		"version": "1.0.0",
        "library": "advanced",
        "section": {
            "type": "array",
            "diacritics": false,
            "shadowDOM": "{ 'style' : \\"mark[data-markjs] { color:red; }\\" }",
            "customCode": "// your code before\\nconst container = tab.getTestElement();\\nlet elem = container.querySelector('#shadow-dom');\\nif( !elem) {\\n  const div = document.createElement(\\"div\\");\\n  div.id = 's2';\\n  div.innerHTML = '<b>Shadow DOM test</b><div id=\\"shadow-dom\\"></div>';\\n  container.appendChild(div);\\n  elem = container.querySelector('#shadow-dom');\\n}\\n\\nif(elem && !elem.shadowRoot) {\\n  const root2 = elem.attachShadow({ mode : 'open' });\\n  root2.innerHTML = defaultHtml;\\n}\\n\\n<<markjsCode>> // don't remove this line\\n\\nfunction filter(node, term, marks, count, info) {\\n  return true;\\n}\\n\\nfunction each(element, info) {}\\n\\nfunction done(totalMarks, totalMatches, termStats) {}",
            "queryArray": "['wiki', 'wikipedia', 'encyclopedia']",
            "testString": {
                "mode": "html",
                "content": "defaultHtml"
            }
        }
	}`,
	
	iframes : `{
        "version": "1.0.0",
        "library": "advanced",
        "section": {
            "type": "string_",
            "accuracy": "exactly",
            "diacritics": false,
            "iframes": true,
            "combinePatterns": 10,
            "queryString": "iframe test wikipedia encyclopedia",
            "testString": {
                "mode": "html",
                "content": "<h1>Iframe</h1><iframe src=\\"html/iframe.html\\" width=\\"500\\" height=\\"120\\"></iframe><h2>Iframe 2</h2><iframe src=\\"html/iframe2.html\\" width=\\"400\\" height=\\"100\\" id=\\"ifr2\\"></iframe><h3>Iframe 3</h3><iframe src=\\"html/nested-iframe.html\\" width=\\"500\\" height=\\"300\\"></iframe>"
            }
        }
    }`,
    
	customCodeEditor : `{
        "version": "1.0.0",
        "library": "advanced",
        "section": {
            "type": "array",
            "accuracy": "exactly",
            "diacritics": false,
            "cacheTextNodes": true,
            "customCode": "// Note that the option 'cacheTextNodes' can be used without generating ranges.\\n// It just demonstrates how to use the custom code editor.\\n// your code before\\nconst ranges=[];\\n<<markjsCode>> // don't remove this line\\n\\nfunction filter(node, term, marks, count, info) {\\n  const range = {\\n    start : info.offset + info.match.index + info.match[1].length,\\n    length : info.match[2].length,\\n  };\\n  if (options.acrossElements) {\\n    if (info.matchStart) {\\n      range.startElement = true;\\n    }\\n  } else range.startElement = true;\\n  ranges.push(range);\\n  \\n  // it should only build ranges\\n  return  false;\\n}\\n\\nfunction done() {\\n  context.markRanges(ranges, {\\n    'each' : function(elem, range) {\\n      if(range.startElement) {\\n        elem.setAttribute('data-markjs', 'start-1');\\n      }\\n    },\\n    done : highlighter.finish\\n  });\\n}",
            "queryArray": "wordArrays.words_50",
            "testString": {
                "mode": "html",
                "content": "defaultHtml"
            }
        }
    }`,
    
	overlappedMatches : `{
        "version": "1.0.0",
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
        "version": "1.0.0",
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
        "version": "1.0.0",
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
