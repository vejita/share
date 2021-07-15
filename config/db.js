const mongoose = require('mongoose');
const donenv = require('dotenv').config();
// DB connection
const DB = process.env.MONGO_CONNECTION_URL.replace(
    '<PASSWARD>',
    process.env.DATABASS_CONNECTION_PASWARD
);

function connectDB() {
    mongoose.connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true, // to remove erroe/ worning on consol
    });

    const connection = mongoose.connection;

    connection
        .once('open', () => {
            console.log('DB is conected to app.....');
        })
        .catch((err) => {
            console.log(`db error ${err.message}`);
        });

    // .then(() => {
    //   // console.log(con.connections);
    //   console.log("DB is conected to app.....");
    // })
    // .catch((err) => {
    //   console.log(`db error ${err.message}`);
    // });
}

module.exports = connectDB;
