import path from 'node:path'
import { chdir, cwd } from 'node:process';
import { errInvalidInput, errOperationFailed } from './constants.js'

const goUpperDir = () => {
	try {
		const res = path.join(cwd(), '..');
		chdir(res);
	} catch (err) {
		throw errOperationFailed;
    }
}

const goDir = async (targetDir) => {
	try {
		if (targetDir.endsWith('\\')) {
			chdir(targetDir);
		} else {
			chdir(targetDir + '\\');
        }
	} catch (err) {
		throw errOperationFailed;
    }
}

export { goUpperDir, goDir }