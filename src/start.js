import { parseCmd, parseUsername } from './cli.js'
import { getDir, getUpperDir } from './pathNavigation.js'
import { listDir } from './fs.js'
import { createInterface } from 'node:readline'
import os from 'node:os'
import path from 'node:path'
import { errInvalidInput, errOperationFailed } from './constants.js'

const username = parseUsername();
let workDir = path.resolve(path.dirname(os.homedir()), username);

const printWorkDir = () => {
    console.log(`You are currently in ${workDir}`);
}

const main = () => {
    if (username) {
        console.log(`Welcome to the File Manager, ${username}!`);
        printWorkDir();
        process.once('exit', () => {
            console.log(`${os.EOL}Thank you for using File Manager, ${username}, goodbye!`);
        });
    }
    else {
        process.abort();
    }

    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('line', async (data) => {
        try {
            const cmdLine = parseCmd(data);
            switch (cmdLine.command) {
                case '.exit':
                    rl.close();
                    break;
                case 'up':
                case '..':
                    workDir = getUpperDir(workDir);
                    break;
                case 'cd':
                    workDir = getDir(workDir, cmdLine.args[0]);
                    break;
                case 'ls':
                    const list = await listDir(workDir);
                    console.table(list);
                    break;
                default:
                    console.log('Invalid input');
                    break;
            }
        } catch (err) {
            if (err === errInvalidInput || err === errOperationFailed) {
                console.log(err.message);
            }
        } finally {
            printWorkDir();
        }
    })
}

main();