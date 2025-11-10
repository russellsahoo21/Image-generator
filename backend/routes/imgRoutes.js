import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const router = express.Router();
const MYSTIC_API_URL = 'https://api.freepik.com/v1/ai/mystic';

// 🎨 STEP 1: POST route to START the image generation task
router.post('/', async (req, res) => {
  try {
    // ✨ NEW: Get more parameters from the frontend request
    const { prompt, model = 'realism', aspect_ratio = 'square_1_1' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // ✅ CHANGED: Call the Mystic endpoint
    const response = await fetch(MYSTIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // ✅ CHANGED: Use 'x-freepik-api-key' for auth
        'x-freepik-api-key': process.env.FREEPIK_API_KEY,
      },
      body: JSON.stringify({
        prompt,
        // ✅ CHANGED: 'size' is replaced by 'resolution' and 'aspect_ratio'
        resolution: '2k', // Or "1k", "4k"
        aspect_ratio, // e.g., "square_1_1", "widescreen_16_9"
        model, // e.g., "realism", "fluid", "zen"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Freepik API Error (POST):', errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    const taskId = data?.data?.task_id;
    const status = data?.data?.status;

    if (!taskId) {
      console.error('❌ No task_id returned from Freepik');
      return res.status(500).json({ error: 'No task_id returned from Freepik API.' });
    }

    // ✅ CHANGED: Return the task_id to the client.
    // The client must now poll the new GET endpoint.
    res.status(202).json({ taskId, status }); // 202 "Accepted" is a good code here

  } catch (error) {
    console.error('❌ Error starting image generation:', error);
    const message = error?.message || 'Something went wrong while contacting Freepik API.';
    res.status(500).json({ error: message });
  }
});


// ✨ STEP 2: GET route to CHECK the status of the task
router.get('/status/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({ error: 'taskId is required.' });
    }

    // ✅ NEW: Call the Mystic endpoint using the task_id
    const response = await fetch(`${MYSTIC_API_URL}/${taskId}`, {
      method: 'GET',
      headers: {
        // ✅ CHANGED: Use 'x-freepik-api-key' for auth
        'x-freepik-api-key': process.env.FREEPIK_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Freepik API Error (GET):', errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();

    // ✅ DEBUGGING: LOG ADDED
    // This will print the full response from Freepik to your backend console.
    console.log(`[Status Check for ${taskId}]:`, JSON.stringify(data, null, 2));
    
    const status = data?.data?.status;
    let imageUrl = null;

    // ✅ NEW: Check if the task is complete
    if (status === 'COMPLETED') {
      // ✨ FIX: The 'generated' array holds strings, not objects.
      // We just need the first element, no .url
      imageUrl = data?.data?.generated?.[0] || null;
      res.status(200).json({ status: 'COMPLETED', photo: imageUrl });
    } else if (status === 'FAILED') {
      res.status(500).json({ status: 'FAILED', error: 'Image generation failed.' });
    } else {
      // Still in progress
      res.status(200).json({ status });
    }

  } catch (error) {
    console.error('❌ Error checking image status:', error);
    const message = error?.message || 'Something went wrong while checking status.';
    res.status(500).json({ error: message });
  }
});

export default router;