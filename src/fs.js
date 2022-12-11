import fs from 'node:fs'
import { opendir } from 'node:fs/promises';
import { errInvalidInput, errOperationFailed } from './constants.js'

const EntType = {
    file: 1,
    directory: 2,
    blockDevice: 3,
    characterDevice: 4,
    FIFO: 5,
    socket: 6,
    symbolicLink: 7,
    undefined: 0
}

const entTypeName = {
    file: 'file',
    directory: 'directory',
    undefined: 'undefined'
}

const getEntType = (dirent) => {
    if (dirent.isFile()) {
        return entTypeName.file;
    } else if (dirent.isDirectory()) {
        return entTypeName.directory;
    } else {
        return entTypeName.undefined;
    }
}

const dirEntCompare = (a, b) => {
    if (a.type !== b.type) {
        return a.type.localeCompare(b.type, 'en', { sensitivity: 'base' });
    }
    return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
}

const listDir = async (currenDir) => {
    const res = [];
    try {
        const dir = await opendir(currenDir);
        let flag = true;
        for await (const dirent of dir) {
            res.push({ name: dirent.name, type: getEntType(dirent) });
        }
        res.sort(dirEntCompare);
        return res;
    } catch (err) {
        console.error(err);
        throw errOperationFailed;
    }
}

export { listDir }