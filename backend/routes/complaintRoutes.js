const express = require('express');
const {
  addComplaint,
  getComplaints,
  updateComplaint,
  searchComplaints
} = require('../controllers/complaintController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/search').get(searchComplaints);

router
  .route('/')
  .post(addComplaint)
  .get(getComplaints);

router
  .route('/:id')
  .put(protect, updateComplaint); // Protected as an example, though paper just says "Protected Routes"

module.exports = router;
