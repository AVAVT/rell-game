// node rmp-to-rell <input-file-path.rmp> <output-directory-path>

const fs = require('fs');
const path = require('path');

const ensureDirectoryExistence = (filePath) => {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

const args = process.argv.slice(2);
const content = fs.readFileSync(args[0], 'utf8').toString().trim();
const json = JSON.parse(content);

const dir = json.name;
const root = args[1] || './';

ensureDirectoryExistence(path.join(root, dir, '/code', '/tmp.rell'));
ensureDirectoryExistence(path.join(root, dir, '/test', '/tmp.test'));

for (let codeFile of json.code) {
  fs.writeFileSync(path.join(root, dir, '/code', codeFile.name), codeFile.text, 'utf8');
}
for (let testFile of json.tests) {
  fs.writeFileSync(path.join(root, dir, '/test', testFile.name), testFile.text, 'utf8');
}