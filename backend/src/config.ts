import dotenv from "dotenv";
dotenv.config();

const AppConfig = {
    port: process.env.PORT || 4000,
    app: {
        name: "gigsama"
    },
    db: {
        uri: process.env.MONGODB_URI || "mongodb://localhost:27017/gigsama",
        database: process.env.MONGODB_DATABASE || "gigsama"
    },
    redis: {
        port: parseInt(process.env.REDIS_PORT || "6379", 10), // Redis port
        host: process.env.REDIS_HOST || "127.0.0.1", // Redis host
        username: process.env.REDIS_USER || "default", // Redis username
        password: process.env.REDIS_PASS || "my-top-secret", // Redis password
        db: 0,
    },


}

export default AppConfig