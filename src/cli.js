const parseUsername = () => {
    const argsParts = process.argv.reduce((acc, value, index, array) => {
        if (value.startsWith('--')) {
            const property = value.split('=')[1];
            return [...acc, property];
        }
        return acc;
    }, []);

    return argsParts[1];
}

const parseCmd = (cliString) => {
    const parsed = cliString.split(' ');
    return { command: parsed[0], args: parsed.slice(1) };
};

export { parseCmd, parseUsername };