import { errInvalidInput, errOperationFailed } from './constants.js'

const splitCmd = (cmdLine) => {
    const checkData = (data) => {
        if (data === '""') throw errInvalidInput;
        return data;
    }

    cmdLine.trimStart();
    if (cmdLine.length === 0) throw errInvalidInput;

    let flagData = false;
    let data = '';
    let flagQuotes = false;
    let res = [];
    try {
        for (let i = 0; i < cmdLine.length; i++) {
            if (!flagData) { // если не data
                if (!cmdLine[i].match(/\s/)) { // если не пробел, то начало data
                    flagData = true;
                    data += cmdLine[i];
                    if (cmdLine[i] === '"') { // если ", то это начало "
                        flagQuotes = true; 
                    } 
                }
            } else {
                if (cmdLine[i] === '"') {
                    if (flagQuotes) { // если ", то это конец "
                        flagQuotes = false;
                        flagData = false;
                        res.push(checkData(data + cmdLine[i])); 
                        data = '';
                    } else {// " в середине аргумента 
                        throw errInvalidInput;
                    }
                } else if (cmdLine[i].match(/\s/)) { 
                    if (flagQuotes) { // если ", то пробел внутри "
                        data += cmdLine[i];
                    } else { // если нет ", то пробел сигнализирует конец data
                        flagData = false;
                        res.push(data); 
                        data = '';
                    }
                } else {
                    data += cmdLine[i];
                }
            }
        }

        if (data.length !== 0) res.push(data); // если " были не закрыты, считываем ввод до конца

        return res;
    } catch (err) {
        if (err === errInvalidInput) throw err;
        else throw errOperationFailed;
    }
}

const parseUsername = async () => {
    try {
        const argsParts = process.argv.reduce((acc, value, index, array) => {
            if (value.startsWith('--')) {
                const property = value.split('=')[1];
                return [...acc, property];
            }
            return acc;
        }, []);

        return argsParts[1];
    } catch (err) {
        throw errInvalidInput;
    }
}

const parseCmd = async (cliString) => {
    try {
        const splited = splitCmd(cliString);
        for (let i = 0; splited.length > i; i++){
            splited[i] = splited[i].replace(/["]/g, "");
        }
        return { command: splited[0].toLowerCase(), args: splited.slice(1) };
    } catch (err) {
        throw errInvalidInput;
    }
}

export const checkAgrs = async (args, count, isPath) => {
    if (args.length != count) throw errInvalidInput;
    if (isPath && process.platform === 'win32') {
        args.forEach((arg) => {
            if (arg.match(/[\?\"\*<>]+/)) throw errInvalidInput;
        });
    }
    return args;
}

export { parseCmd, parseUsername };