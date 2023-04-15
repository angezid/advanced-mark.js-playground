const fs = require('fs');

const path = 'build/index.html',
  version = process.env.npm_package_version;

if(version) {
  fs.readFile(path, 'utf-8', (err, text) => {
    if (err) {
      console.error(err);

    } else {
      text = text.replace(/(<p>advanced-mark\.js playground\s+v)[\d.]+/, '$1' + version);
      fs.writeFile(path, text, 'utf-8', err => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
}
