import mongoose from 'mongoose'

export const connectDB = async () => {
    await mongoose.connect(process.env.CONNECTION_URL).then(() => {
        console.log('Connected to DB successfully');
    }).catch((error) => {
        console.log('Failed in connrction to DB', error);
    })
}
