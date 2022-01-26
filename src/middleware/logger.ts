import { Handler, Request } from 'express';

const logger: Handler = (req: Request, res, next) => {
    if (req.session.views) {
        req.session.views++;
    } else {
        req.session.views = 1;
    }
    return next();
};

export default logger;