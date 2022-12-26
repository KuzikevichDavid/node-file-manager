import { createReadStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { createHash } from 'node:crypto'
import { errInvalidInput, errOperationFailed } from './constants.js'

export const getHash = async (path) =>{
    try {
        const fd = createReadStream(path);
        const hash = createHash('sha256');
        hash.setEncoding('hex');
        
        await pipeline(fd, hash);
        return hash.read();
    } catch (err) {
        throw errOperationFailed;
    }
}