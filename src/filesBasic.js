import { createWriteStream, createReadStream } from 'node:fs'
import { open, rm, rename as rn } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises';
import { errInvalidInput, errOperationFailed } from './constants.js'

const create = async (path) => {
    try { 
        const file = await open(path, 'wx');
        await file.close();
    } catch {
        throw errOperationFailed;
    } 
}

const read = async (path, outStream) => {
    try {
        return await pipeline(createReadStream(path), outStream);
    } catch (err) {
        throw errOperationFailed;
    }
};

const remove = async (path) => {
    try {
        return await rm(path);
    } catch (err) {
        throw errOperationFailed;
    }
};

const rename = async (oldName, newName) => {
    try {
        return await rn(oldName, newName);
    } catch (err) {
        throw errOperationFailed;
    }
};

const copy = async (src, dest) => {
    try {
        return await pipeline(createReadStream(src), createWriteStream(dest, { flags: 'ax' }));
    } catch (err) {
        throw errOperationFailed;
    } 
};

export { create, read, remove, copy, rename }