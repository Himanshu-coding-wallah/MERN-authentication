import app from "./src/app.js";
import connectDB from "./src/database/db.js";

connectDB()
app.listen(process.env.PORT, ()=>(
    console.log(`server started on port ${process.env.PORT}`)
))