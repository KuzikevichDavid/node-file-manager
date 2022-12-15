import { createReadStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { createHash } from 'node:crypto'
import { errInvalidInput, errOperationFailed } from './constants.js'

export const getHash = async (args) =>{
    try {
        const fd = createReadStream(args[0]);
        const hash = createHash('sha256');
        hash.setEncoding('hex');
        
        await pipeline(fd, hash);
        return hash.read();
    } catch (err) {
        console.log(err);
        throw errOperationFailed;
    }
}