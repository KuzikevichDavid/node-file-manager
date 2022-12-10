import { parseCmd, parseUsername } from './cli.js'
import { createInterface } from 'node:readline'
import os from 'node:os'
import path from 'node:path'

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

    rl.on('line', (data) => {
        try {
            const cmdLine = parseCmd(data);
            switch (cmdLine.command) {
                case '.exit':
                    rl.close();
                    break;
                default:
                    console.log('Invalid input');
                    break;
            }
            printWorkDir();
        } catch (error) {
            console.log('Operation failed');
        }
    })
}

main();