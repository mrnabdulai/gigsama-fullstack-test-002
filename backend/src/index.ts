import express from 'express'
import AppConfig from './config'
import mongoose from 'mongoose'
import rest from './rest'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use("/api", rest)
app.get("/health", (req, res) => {
    res.status(200).send("OK")
}
)

mongoose.connect(AppConfig.db.uri, {
    dbName: AppConfig.db.database,
}).then(() => {
    console.log("Connected to the database")
    app.listen(AppConfig.port, () => {
        console.log(`Application running on port ${AppConfig.port}`)
    })
});


