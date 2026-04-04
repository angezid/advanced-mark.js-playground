
const fs = require('fs');
const { minify } = require('terser');

const files = [ 'data.js', 'highlighter.js', 'main.js'],
	files3 = ['codejar.js', 'highlight.js', 'jquery.js', 'mark.js', 'prettify.js', 'jquery.powertip.js'],
	source3Dir = 'src/js3/',
	sourceDir = 'src/js/',
	destDir = 'playground/js/';

//const debugPlayground = true;
const debugPlayground = false;

process();

async function process() {
	let success = true;
	try {
		if ( !fs.existsSync(destDir)) {
			fs.mkdirSync(destDir, { recursive: true });
		}

		let scripts = '';

		for (let i = 0; i < files3.length; i++) {
			const code = fs.readFileSync(source3Dir + files3[i], 'utf-8');
			const result = await minify(code.trim());

			scripts += result.code + '\n\n';
		}
		fs.writeFileSync(destDir + 'plugins.js', scripts);

		scripts = '';

		for (let i = 0; i < files.length; i++) {
			const code = fs.readFileSync(sourceDir + files[i], 'utf-8');

			scripts += '/*!****************************\n* ' + files[i] + '\n******************************/\n';

			if (debugPlayground) {
				scripts += code + '\n\n';

			} else {
				const result = await minify(code.trim());
				scripts += result.code + '\n\n';
			}
		}
		fs.writeFileSync(destDir + 'main.js', scripts);

	} catch(e) {
		console.log(e);
		success = false;
	}

	if (success) {
		console.log('The playground was minified successfully.');
	}
}
