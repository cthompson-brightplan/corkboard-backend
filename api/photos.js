import Cors from 'cors';

const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
  origin: '*',
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

let storage = {};

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  const { method } = req;
  
  if (method === 'GET') {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ 
        error: 'Board ID required',
        success: false 
      });
    }

    const photos = storage[id] || [];
    
    return res.status(200).json({
      photos: photos,
      success: true
    });
    
  } else if (method === 'POST') {
    const { id, photos } = req.body;
    
    if (!id || !photos) {
      return res.status(400).json({ 
        error: 'Board ID and photos required',
        success: false 
      });
    }

    storage[id] = photos;
    
    return res.status(200).json({
      success: true,
      message: 'Photos saved successfully'
    });
    
  } else {
    return res.status(405).json({ 
      error: 'Method not allowed',
      success: false 
    });
  }
}
