const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const auth = require('../middleware/auth');

router.get('/summary', async (req, res) => {
  try {
    const donations = await Donation.find().populate('user', 'name profilePhoto');

    const total = donations.reduce((sum, d) => sum + d.amount, 0);

    const byUser = {};
    donations.forEach(d => {
      const id = d.user._id.toString();
      if (!byUser[id]) byUser[id] = { user: d.user, total: 0 };
      byUser[id].total += d.amount;
    });

    const sorted = Object.values(byUser).sort((a, b) => b.total - a.total);
    const topDonor = sorted[0];

    res.json({
      totalFund: total,
      memberCount: sorted.length,
      topDonor: topDonor ? {
        name: topDonor.user.name,
        profilePhoto: topDonor.user.profilePhoto,
      } : null,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/mine', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.userId }).sort({ createdAt: -1 });
    const total = donations.reduce((sum, d) => sum + d.amount, 0);
    res.json({ donations, total });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { amount, note } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }
    const donation = new Donation({ user: req.userId, amount, note });
    await donation.save();
    res.json({ message: 'Donation added successfully', donation });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('user', 'name profilePhoto')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;