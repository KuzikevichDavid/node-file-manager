import { parseCmd, parseUsername } from './cli.js'
import { goDir, goUpperDir } from './pathNavigation.js'
import { listDir } from './fs.js'
import { copy, create, read, remove, rename } from './filesBasic.js'
import { createInterface } from 'node:readline'
import { chdir, cwd } from 'node:process'
import { Writable } from 'node:stream'
import os from 'node:os'
import path from 'node:path'
import { errInvalidInput, errOperationFailed } from './constants.js'

const stdoutForPipeline = () => new Writable ({
    write(chunk, enc, next) {
        process.stdout.write(chunk);
        next();
    }
}).on('close', () => process.stdout.write(os.EOL));

const printWorkDir = () => {
    console.log(`You are currently in ${cwd()}`);
}

const printError = (err) => {
    if (err === errInvalidInput || err === errOperationFailed) {
        console.log(err.message);
    }
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
                    goDir(...cmdLine.args);
                    break;
                case 'ls':
                    console.table(await listDir());
                    break;
                case 'cat':
                    await read(cmdLine.args[0], stdoutForPipeline()).catch(printError);
                    break;
                case 'add':
                    await create(cmdLine.args[0]).catch(printError);
                    break;
                case 'rn':
                    await rename(...cmdLine.args).catch(printError);
                    break;
                case 'cp':
                    await copy(...cmdLine.args).catch(printError);
                    break;
                case 'mv':
                    await copy(...cmdLine.args).catch(printError);
                    await remove(cmdLine.args[0]).catch(printError);
                    break;
                case 'rm':
                    await remove(cmdLine.args[0]).catch(printError);
                    break;
                default:
                    console.log('Invalid input');
                    break;
            }
        } finally {
            printWorkDir();
        }
    })
}

main();