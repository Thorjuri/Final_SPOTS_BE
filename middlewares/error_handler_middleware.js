module.exports = (err, req, res, next) => {
    console.log(err);
    if (err.status === undefined) {
        // 명시하지 않은 에러에 대한 처리.
        res.status(500).json({
            name: err.name,
            status: 500,
            errorMessage: err.message,
            Request: {
                header: req.headers,
                params: req.params,
                body: req.body,
            },
            errorStack: err.stack,
        });
    } else {
        // 명시해놓은 에러에 대한 처리.
        res.status(err.status).json({
            type: err.name,
            status: err.status,
            error: err.message,
            code: (err.code || "")
        });
    }
};
