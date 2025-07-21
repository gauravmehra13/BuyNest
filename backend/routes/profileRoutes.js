const express = require('express');
const { check } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  updateProfile,
  updateAddress,
  deleteAddress,
  getOrderHistory,
  getOrderDetail
} = require('../controllers/profileController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Profile update validation
const profileValidation = [
  check('firstName', 'First name must be between 2 and 30 characters')
    .optional()
    .isLength({ min: 2, max: 30 }),
  check('lastName', 'Last name must be between 2 and 30 characters')
    .optional()
    .isLength({ min: 2, max: 30 }),
  check('phoneNumber', 'Please enter a valid phone number')
    .optional()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
];

// Address validation
const addressValidation = [
  check('street', 'Street address is required').not().isEmpty(),
  check('city', 'City is required').not().isEmpty(),
  check('state', 'State is required').not().isEmpty(),
  check('zipCode', 'Zip code is required').not().isEmpty(),
  check('country', 'Country is required').not().isEmpty()
];

// Routes
router.put('/', profileValidation, updateProfile);
router.post('/address', addressValidation, updateAddress);
router.delete('/address/:addressId', deleteAddress);
router.get('/orders', getOrderHistory);
router.get('/orders/:orderId', getOrderDetail);

module.exports = router; 