const db = require('./backend/db');

async function checkUsers() {
    try {
        const res = await db.query('SELECT id, name, email, created_at FROM users;');
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();