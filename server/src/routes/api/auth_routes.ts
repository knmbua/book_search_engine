import express from 'express';
import {auth_resolvers} from '../../schemas/resolvers/auth_resolvers.js';

const router = express.Router();

// Registers a new user
router.post('/register', registerUser);
// Logs the user in
router.post('/login', loginUser);

// Logs user out
router.get('/logout', logoutUser);

// Returns the user object if the client has a valid cookie with JWT
router.get('/user', getUser);


export default router;
