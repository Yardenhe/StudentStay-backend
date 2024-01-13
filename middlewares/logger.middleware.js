import { loggerService } from "../services/logger.service.js";


export function log(req, res, next) {
    // console.log('req', req);
    loggerService.info('Request made', req.query)
    next()
}