const express = require('express');

const router =
  express.Router();

const {
  protect,
  authorize
} = require('./auth');


router.get(
  '/student',
  protect,
  authorize('student'),
  (req, res) => {

    res.json({
      message:
        `Welcome student ${req.user.id}`
    });
  }
);


router.get(
  '/teacher',
  protect,
  authorize('teacher'),
  (req, res) => {

    res.json({
      message:
        `Welcome teacher ${req.user.id}`
    });
  }
);


router.get(
  '/admin',
  protect,
  authorize('admin'),
  (req, res) => {

    res.json({
      message:
        `Welcome admin ${req.user.id}`
    });
  }
);


module.exports = router;