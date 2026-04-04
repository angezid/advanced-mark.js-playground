
const fs = require('fs');

const files = ['iframe.html', 'iframe2.html', 'iframe3.html', 'nested-iframe.html', 'nested-iframe2.html',],
    sourceHtmlDir = 'src/html/',
    destHtmlDir = 'playground/html/';

const path = 'playground/index.html',
    version = process.env.npm_package_version;

copyFile();

function copyFile() {
    let success = true;
    try {
        ['css', 'html', 'js'].forEach((name) => {
            let path = 'playground/' + name;

            if ( !fs.existsSync(path)) {
                fs.mkdirSync(path, { recursive: true });
            }
        });

        for (let i = 0; i < files.length; i++) {
            fs.copyFileSync(sourceHtmlDir + files[i], destHtmlDir + files[i], fs.constants.COPYFILE_FICLONE);
        }

        fs.copyFileSync('src/css/main.css', 'playground/css/main.css', fs.constants.COPYFILE_FICLONE);

        let html = fs.readFileSync('src/index.html', 'utf-8');
        // updates playground version; corrects scripts pathes
        html = html.replace(/(<[a-z]+>advanced-mark\.js playground\s+v)[\d.]+/, '$1' + version);
        html = html.replace(/<script [^]+<\/script>/, '<script src="js/plugins.js"></script>\n<script src="js/main.js"></script>');

        fs.writeFileSync('playground/index.html', html);

    } catch(e) {
        console.log(e);
        success = false;
    }

    if (success) {
        console.log('Files was copied to playground successfully');
    }
}

// (.+)\n		'$1', && npm run minify-plugins
