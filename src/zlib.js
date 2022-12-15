import { createReadStream, createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib'

export const compress = async (args) => {
    try {
        pipeline(
            createReadStream(args[0]),
            createBrotliCompress(),
            createWriteStream(args[1])
        );
    } catch (err) {
        throw errOperationFailed;
    } 
};

export const decompress = async (args) => {
    try {
        pipeline(
            createReadStream(args[0]),
            createBrotliDecompress(),
            createWriteStream(args[1])
        );
    } catch (err) {
        throw errOperationFailed;
    } 
};