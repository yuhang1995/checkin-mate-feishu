import type { Request, Response, NextFunction } from "express"
import { CustomError } from "@/errors"
import { logger } from "@/utils"

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error(err.stack) // Log the error stack trace

    // Handle specific types of errors and send an appropriate response
    if (err instanceof CustomError) {
        return res.status(err.status).json({ error: err.message })
    }

    // Handle uncaught errors with a generic response
    console.log(err)
    res.status(500).json({ error: "Internal Server Error" })
}
