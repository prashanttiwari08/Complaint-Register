const express = require('express');
const {
  addComplaint,
  getComplaints,
  updateComplaint,
  searchComplaints
} = require('../controllers/complaintController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/search').get(searchComplaints);

router
  .route('/')
  .post(addComplaint)
  .get(getComplaints);

router
  .route('/:id')
  .put(protect, authorize('admin'), updateComplaint); // Only admin can update status

module.exports = router;
