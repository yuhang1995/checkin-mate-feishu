import express from "express"

import { webhookRouter } from "./routes"
import { logger } from "@/utils"
import { errorHandler } from "./middleware"

const PORT = process.env.PORT
const app = express()

app.use(express.json({ strict: false }))

app.use("/webhook", webhookRouter)

app.use(errorHandler)

app.listen(PORT, () => {
    logger.info(`服务启动成功，端口http://localhost:${PORT}`)
})
