import os from 'node:os'
import { errInvalidInput, errOperationFailed } from './constants.js'

const flags = {
    '--eol': () => JSON.stringify(os.EOL),
    '--cpus': () => {
        const cpus = os.cpus();
        return { 
            amount: cpus.length, 
            cpus: cpus.map((core) => ({ 
                model: core.model, 
                speed: Math.round((core.speed / 1000 + Number.EPSILON) * 100) / 100
            })) 
        }
    },
    '--username': () => os.userInfo().username,
    '--homedir': () => os.userInfo().homedir,
    '--architecture': os.arch
}

const getFlag = async (args) => {
    try {
        if (args.length != 1) throw errInvalidInput;
        const res = flags[args[0].toLowerCase()]?.();
        if (res) {
            return res;
        } else {
            throw errInvalidInput;
        }
    } catch(err) {
        if (err === errInvalidInput) throw errInvalidInput;
        else throw errOperationFailed;
    }
}

export { getFlag }