const connectDb = require('./config/db');
const File = require('./models/filemodel');
const fs = require('fs');

connectDb();

async function deletData() {
    const files = await File.find({
        createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    if (files.length) {
        for (const file of files) {
            try {
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`successfully deleted ${file.filename}`);
            } catch (err) {
                console.log(`error while deleted ${err}`);
            }
        }
    }
    console.log('jobe done!');
}

deletData().then(process.exit);
