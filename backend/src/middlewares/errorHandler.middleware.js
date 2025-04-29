const errorHandler = (err, req, res, next) => {
    console.log(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    })
}

export { errorHandler }