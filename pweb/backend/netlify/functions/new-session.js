// netlify/functions/new-session.js
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

exports.handler = async (event, context) => {
  const userId = uuidv4();  // Generate a new unique ID for the user
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });  // Issue a token with the unique user ID

  return {
    statusCode: 200,
    body: JSON.stringify({ token }),  // Return the token to the frontend
  };
};
