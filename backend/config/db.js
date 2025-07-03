import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://silverbullet:10022004@cluster0.yytkpkg.mongodb.net/food-del').then(()=>{console.log("DB connected")});
}