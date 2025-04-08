const express = require('express');
const upload = require('../middlewares/upload');
const { createSession, getUserSessions } = require('../controllers/sessionController');

const router = express.Router();

// Route for creating a session with image uploads
router
    .route('/:id/sessions') // Get all sessions for a user & Create a session
    .get(sessionController.getUserSessions)
    .post(upload.fields([{ name: 'photo1' }, { name: 'photo2' }]), sessionController.createSession); // Create session with images

router
    .route('/:id/sessions/:sessionId') // Get a specific session for a user
    .get(sessionController.getSessionById);


    module.exports = router;




    