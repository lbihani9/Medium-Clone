const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashPassword(plainTextPassword) {
    try {
        const hash = await bcrypt.hash(plainTextPassword, saltRounds);
        return hash;

    } catch (e) {
        throw e;
    }
}

//returns a boolean value.
async function matchPassword(hash, plainTextPassword) {
    try {
        const verdict = await bcrypt.compare(plainTextPassword, hash);
        return verdict;

    } catch (e) {
        throw e;
    }
}

// Just a small test to check correctness.

/* async function test() {
    const pass = 'sdagerger324';
    const h = await hashPassword(pass);
    console.log(pass, h);

    const c1 = pass;
    const c2 = 'gww322';
    const m1 = await matchPassword(h, c1);
    const m2 = await matchPassword(h, c2);
    console.log('m1, ', m1);
    console.log('m2, ', m2);

}
test (); */

module.exports = { hashPassword, matchPassword };