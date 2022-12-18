import { createReadStream, createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib'
import { errInvalidInput, errOperationFailed } from './constants.js'

export const compress = async (src, dest) => {
    try {
        return pipeline(
            createReadStream(src),
            createBrotliCompress(),
            createWriteStream(dest)
        );
    } catch (err) {
        throw errOperationFailed;
    } 
};

export const decompress = async (src, dest) => {
    try {
        return pipeline(
            createReadStream(src),
            createBrotliDecompress(),
            createWriteStream(dest)
        );
    } catch (err) {
        throw errOperationFailed;
    } 
};