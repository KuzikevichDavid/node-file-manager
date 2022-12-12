import { parseCmd, parseUsername } from './cli.js'
import { goDir, goUpperDir } from './pathNavigation.js'
import { listDir } from './fs.js'
import { copy, create, read, remove, rename } from './filesBasic.js'
import { createInterface } from 'node:readline'
import { chdir, cwd } from 'node:process';
import os from 'node:os'
import path from 'node:path'
import { errInvalidInput, errOperationFailed } from './constants.js'

const printWorkDir = () => {
    console.log(`You are currently in ${cwd()}`);
}

const main = () => {
    const username = parseUsername();
    goDir(path.resolve(path.dirname(os.homedir()), username));
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
                    goUpperDir();
                    break;
                case 'cd':
                    goDir(cmdLine.args[0]);
                    break;
                case 'ls':
                    console.table(await listDir());
                    break;
                case 'cat':
                    await read(cmdLine.args[0], process.stdout);
                    break;
                case 'add':
                    await create(cmdLine.args[0]);
                    break;
                case 'rn':
                    await rename(cmdLine.args[0], cmdLine.args[1]);
                    break;
                case 'cp':
                    await copy(cmdLine.args[0], cmdLine.args[1]);
                    break;
                case 'mv':
                    await copy(cmdLine.args[0], cmdLine.args[1]);
                    await remove(cmdLine.args[0]);
                    break;
                case 'rm':
                    await remove(cmdLine.args[0]);
                    break;
                default:
                    console.log('Invalid input');
                    break;
            }
        } catch (err) {
            if (err === errInvalidInput || err === errOperationFailed) {
                console.log(err.message);
            }
            console.log(err.message);
        } finally {
            printWorkDir();
        }
    })
}

main();