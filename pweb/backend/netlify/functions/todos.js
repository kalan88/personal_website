const connectToDatabase = require('./mongo.js'); // adjust path if needed
const jwt = require('jsonwebtoken');

const allowedOrigins = ['https://kalan88.netlify.app']; 

module.exports.handler = async (event) => {
  const origin = event.headers.origin;

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      },
      body: 'Preflight OK',
    };
  }

  const headers = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  };

  // 🔐 JWT authentication check
  const token = event.headers.authorization?.split(' ')[1];
  if (!token) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Missing Authorization header' }),
    };
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.userId;
  } catch (error) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Invalid token' }),
    };
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection('todos');

    if (event.httpMethod === 'GET') {
      const todos = await collection.find({ userId }).toArray();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(todos),
      };
    }

    if (event.httpMethod === 'POST') {
      const { task, dueDate } = JSON.parse(event.body);
      const result = await collection.insertOne({ task, dueDate, userId });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result.ops[0]),
      };
    }

    if (event.httpMethod === 'DELETE') {
      const id = event.queryStringParameters?.id;
      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing ID' }),
        };
      }

      const { ObjectId } = require('mongodb');
      await collection.deleteOne({ _id: new ObjectId(id), userId });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Deleted' }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: 'Method Not Allowed',
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
