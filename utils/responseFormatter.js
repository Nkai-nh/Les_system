exports.formatResponse = (message, data = null, error = null) => {
    return {
        message,
        data,
        error
    };
};