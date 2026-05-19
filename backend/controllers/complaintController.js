const Complaint = require('../models/Complaint');

// @desc    Add Complaint
// @route   POST /api/complaints
// @access  Public or Private (Requirements don't explicitly say, let's keep public for easy testing or private if auth required)
exports.addComplaint = async (req, res, next) => {
  try {
    const { name, email, title, description, category, location } = req.body;
    
    const complaint = await Complaint.create({
      name,
      email,
      title,
      description,
      category,
      location
    });

    res.status(201).json({
      success: true,
      data: complaint
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get All Complaints
// @route   GET /api/complaints
// @access  Public or Private
exports.getComplaints = async (req, res, next) => {
  try {
    let query;

    if (req.query.category) {
      query = Complaint.find({ category: req.query.category });
    } else {
      query = Complaint.find();
    }

    const complaints = await query.sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update Complaint Status
// @route   PUT /api/complaints/:id
// @access  Private (usually for admins, but public for demo)
exports.updateComplaint = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search Complaint by Location
// @route   GET /api/complaints/search
// @access  Public
exports.searchComplaints = async (req, res, next) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ success: false, message: 'Please provide a location to search' });
    }

    // Case insensitive search
    const complaints = await Complaint.find({ 
      location: { $regex: location, $options: 'i' } 
    });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (err) {
    next(err);
  }
};
