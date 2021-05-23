const mongoose = require('mongoose');

MONGO_URI = 'mongodb+srv://arpit:9140632261@cluster0.ttapc.mongodb.net/demo-project?retryWrites=true&w=majority'

const connectDB = async () => {

    const conn = await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    console.log(`Mongo Connected ${conn.connection.host}`.cyan.underline.bold);
}

module.exports = connectDB;
