import { opendir, lstat } from 'node:fs/promises'
import { errInvalidInput, errOperationFailed } from './constants.js'

const entTypeName = {
    file: 'file',
    directory: 'directory',
    undefined: 'undefined',
    symbolicLink: 'symbolicLink',
    socket: 'socket',
    characterDevice: 'characterDevice',
    FIFO: 'FIFO',
    blockDevice: 'blockDevice',
}

const getEntType = (dirent) => {
    if (dirent.isFile()) {
        return entTypeName.file;
    } else if (dirent.isDirectory()) {
        return entTypeName.directory;
    } else if (dirent.isSymbolicLink()) {
        return entTypeName.symbolicLink;
    } else if (dirent.isSocket()) {
        return entTypeName.socket;
    } else if (dirent.isFIFO()) {
        return entTypeName.FIFO;
    } else if (dirent.isCharacterDevice()) {
        return entTypeName.characterDevice;
    } else if (dirent.isBlockDevice()) {
        return entTypeName.blockDevice;
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

const listDir = async () => {
    const res = [];
    try {
        const dir = await opendir('./');
        for await (const dirent of dir) {
            res.push({ name: dirent.name, type: await lstat(dirent.name).then(getEntType) });
        }
        res.sort(dirEntCompare);
        return res;
    } catch (err) {
        throw errOperationFailed;
    }
}

export { listDir }