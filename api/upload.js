import Cors from 'cors';

const cors = Cors({
  methods: ['POST', 'OPTIONS'],
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

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      success: false 
    });
  }

  try {
    const { image, filename } = req.body;
    
    if (!image) {
      return res.status(400).json({ 
        error: 'No image data provided',
        success: false 
      });
    }

    return res.status(200).json({
      url: image,
      success: true
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: error.message,
      success: false 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
