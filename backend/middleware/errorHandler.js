const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.error(err.stack);

    res.status(err.statusCode || 500).json({
        status: 'error',
        data: null,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;
