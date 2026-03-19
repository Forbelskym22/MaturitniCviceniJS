const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.getHome);
router.get('/notes', homeController.getNotes);
router.post('/notes', homeController.postNote);
router.get('/notes/delete/:id', homeController.deleteNote);

module.exports = router;
