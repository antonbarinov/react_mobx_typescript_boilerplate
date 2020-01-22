const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const path = require('path');

(async () => {
    const { stdout } = await exec(`git diff --name-only --cached`, { cwd: __dirname });
    const files = stdout
        .trim()
        .split('\n')
        .filter((f) => f != '');
    console.log(files);

    const prettierFiles = [];
    const eslintFiles = [];

    for (const file of files) {
        // Prettier
        if (/\.(t|j)sx?$/.test(file) || /\.(c|sa|sc)ss$/.test(file)) {
            prettierFiles.push('"' + file.split('/').join(path.sep) + '"');
        }

        // ESlint
        if (/\.(t|j)sx?$/.test(file)) {
            eslintFiles.push('"' + file.split('/').join(path.sep) + '"');
        }
    }

    try {
        if (prettierFiles.length) {
            const cmd = 'node_modules/.bin/prettier'.split('/').join(path.sep);
            await exec(`${cmd} --write ${prettierFiles.join(' ')}`, { cwd: __dirname });
        }
        if (eslintFiles.length) {
            const cmd = 'node_modules/.bin/eslint'.split('/').join(path.sep);
            await exec(`${cmd} --fix ${eslintFiles.join(' ')}`, { cwd: __dirname });
        }
    } catch (e) {
        console.error(e);
        throw e;
    }

    await exec(`git add ${files.map((f) => '"' + f + '"').join(' ')}`, { cwd: __dirname });
})();
