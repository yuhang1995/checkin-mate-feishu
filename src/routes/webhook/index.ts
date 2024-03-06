import { Router } from "express"
import { checkIn } from "./check-in"

const webhookRouter = Router()

webhookRouter.post("/check-in", checkIn)

export { webhookRouter }
