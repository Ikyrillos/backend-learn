const dotenv = require('dotenv');

const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('connection to DB is successful'));

const port = 3000;
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started on http://localhost:${port}`);
});
