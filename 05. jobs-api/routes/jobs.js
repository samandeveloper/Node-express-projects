//routes from controllers>>jobs.js file
const express = require('express')
const router = express.Router()

//routes
const {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
} = require('../controllers/jobs.js')

//routes:way2
router.route('/').post(createJob).get(getAllJobs)
router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob)

module.exports = router