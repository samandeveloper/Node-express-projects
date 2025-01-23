//404 status code that route doesn't exists
const notFound = (req, res) => res.status(404).send('Route does not exist')

module.exports = notFound
