import app from "./app/app";
import database from "./database/database";

const PORT = process.env.PORT || 7000;
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/test";
console.log(process.env.MONGO_URI);

app.listen(PORT, () => {
    database(mongoURI);
    console.info(`API Server Started at Port: ${PORT}`);
});
