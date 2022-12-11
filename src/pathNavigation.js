import path from 'node:path'
import { errInvalidInput, errOperationFailed } from './constants.js'

const getUpperDir = (currentDir) => {
	try {
		return path.join(currentDir, '..');
	} catch (err) {
		throw errOperationFailed;
    }
}

const getDir = (currentDir, targetDir) => {
	try {
		if (path.isAbsolute(targetDir)) {
			return targetDir;
		} else {
			return path.join(currentDir, targetDir);
		}
	} catch (err) {
		throw errOperationFailed;
    }
}

export { getUpperDir, getDir }