const dotenv = require('dotenv');

const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE_LOCAL.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
    console.log('connection to DB is successful');
});

const port = 3000;
const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started on http://localhost:${port}`);
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
