import { open, close, createWriteStream, createReadStream, rm, rename as rn } from 'node:fs'
import { Buffer } from 'node:buffer';
import { errInvalidInput, errOperationFailed } from './constants.js'

const create = async (path) => {
    open(path, 'wx', (err, fd) => {
        try{
            if (err) {
                throw errOperationFailed;
            }
		} finally {
			close(fd, (err) => {
				if (err) throw err;
			});
		}
	});
}

const read = async (path, outStream) => {
    try {
        const fileStream = createReadStream(path);
        await fileStream.pipe(outStream, { end: false });
    } catch (err) {
        console.log(err.message);
        throw errOperationFailed;
    }
};

const remove = async (path) => {
    rm (path, (err) => {
		if (err) {
            throw errOperationFailed;
		}
	});
};

const rename = async (oldName, newName) => {
    rn(oldName, newName, (err) => {
        if (err) {
            throw errOperationFailed;
        }
    });
};

const copy = async (src, dest) => {
    try {
        const readStream = createReadStream(src);
	    const writeStream = createWriteStream(dest, { flags: 'a' });
        await readStream.pipe(writeStream);
    } catch (err) {
        throw errOperationFailed;
    } 
};

export { create, read, remove, copy, rename }