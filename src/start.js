import { parseCmd, parseUsername, checkAgrs } from './cli.js'
import { goDir, goUpperDir } from './pathNavigation.js'
import { listDir } from './fs.js'
import { copy, create, read, remove, rename } from './filesBasic.js'
import { getFlag } from './os.js'
import { compress, decompress } from './zlib.js'
import { getHash } from './hash.js'
import { errInvalidInput, errOperationFailed } from './constants.js'
import { createInterface } from 'node:readline'
import { cwd } from 'node:process'
import { Writable } from 'node:stream'
import os from 'node:os'

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
    } else {
        console.log(errOperationFailed.message);
    }
}

const main = async () => {
    try {
        const username = await parseUsername().catch(printError);

        if (username) {
            console.log(`Welcome to the File Manager, ${username}!`);
            await goDir(os.homedir());
            printWorkDir();
            process.once('exit', () => {
                console.log(`${os.EOL}Thank you for using File Manager, ${username}, goodbye!`);
            });
        }
        else {
            console.log('Wrong args!');
            process.exit();
        }

        const rl = createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.on('line', async (data) => {
            try {
                const cmdLine = await parseCmd(data).catch(printError);
                if (cmdLine) {
                    switch (cmdLine.command) {
                        case '.exit':
                            await checkAgrs(cmdLine.args, 0).then(() => process.exit());
                            break;
                        case 'up':
                            await checkAgrs(cmdLine.args, 0).then(() => goUpperDir()).catch(printError);
                            break;
                        case 'cd':
                            await checkAgrs(cmdLine.args, 1, true).then(() => goDir(...cmdLine.args).catch(printError))
                            break;
                        case 'ls':
                            await checkAgrs(cmdLine.args, 0).then(() => listDir().then(console.table));
                            break;
                        case 'cat':
                            await checkAgrs(cmdLine.args, 1, true).then(() => read(stdoutForPipeline(), ...cmdLine.args).catch(printError));
                            break;
                        case 'add':
                            await checkAgrs(cmdLine.args, 1, true).then(() => create(...cmdLine.args).catch(printError));
                            break;
                        case 'rn':
                            await checkAgrs(cmdLine.args, 2, true).then(() => rename(...cmdLine.args).catch(printError));
                            break;
                        case 'cp':
                            await checkAgrs(cmdLine.args, 2, true).then(() => copy(...cmdLine.args).catch(printError));
                            break;
                        case 'mv':
                            await checkAgrs(cmdLine.args, 2, true).then(() => copy(...cmdLine.args).then(() => remove(...cmdLine.args)).catch(printError));
                            break;
                        case 'rm':
                            await checkAgrs(cmdLine.args, 1, true).then(() => remove(...cmdLine.args).catch(printError));
                            break;
                        case 'os':
                            await checkAgrs(cmdLine.args, 1).then(() => getFlag(cmdLine.args).then(console.log).catch(printError));
                            break;
                        case 'hash':
                            await checkAgrs(cmdLine.args, 1, true).then(() => getHash(...cmdLine.args).then(console.log).catch(printError));
                            break;
                        case 'compress':
                            await checkAgrs(cmdLine.args, 2, true).then(() => compress(...cmdLine.args)).catch(printError);
                            break;
                        case 'decompress':
                            await checkAgrs(cmdLine.args, 2, true).then(() => decompress(...cmdLine.args)).catch(printError);
                            break;
                        default:
                            console.log(errInvalidInput.message);
                            break;
                    }
                }
            } catch (err) {
                printError(err);
            } finally {
                if (data !== '.exit') printWorkDir();
            }
        });
    } catch (err) {
        printError(err);
    }
}

main();