//catch async related errors and pass to next

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}