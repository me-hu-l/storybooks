const notFound = (req, res, next) =>{
        const error = new Error(`Not Found - ${req.originalUrl}`);
        // console.log('notFound middleware invoked')
        res.status(404);
        next(error)
}

const errorHandler = (err, req, res, next) =>{
        // console.log('errorHandler middleware invoked')
        let statusCode = res.statusCode === 200 ? 500:res.statusCode;
        let message = err.message

        if(err.name === 'CastError' && err.kind === 'ObjectId'){
                statusCode=404;
                message='Resource not found';
        }

        res.status(statusCode).json({
                message: message,
                stack: process.env.NODE_ENV === 'production' ? null: err.stack
        })
}

export {notFound, errorHandler}