const param = process.argv[3];
const username = process.argv[4];

if (param === '--username' && username) {
    console.log(`Welcome to the File Manager, ${username}!`)
    process.once('exit', () => {
        console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    });
}
else {
    process.abort();
}
