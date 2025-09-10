import mongoose from "mongoose";

const dbName = "cadt-project-db";
const mongoURI = 'mongodb://cadt-project-db:27017';

export async function dbConnect() {
    mongoose.connection.on('connected', () => {
        console.log('Conected: ', dbName);
    })
    await mongoose.connect(mongoURI, {
        dbName
    })
}