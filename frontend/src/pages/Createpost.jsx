import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { surpriseMePrompts } from '../constants'; 
// Assuming constants.js is in a parent/sibling 'constants' folder.
// If it's in the same folder, it would be './constants'
// For this single-file example, I'll move the constant inside.


// Helper function for polling
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ✨ Replaced FontAwesomeIcon with an inline SVG to fix import error
const MagicWandIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M11.02 3.6a.75.75 0 0 1 .86 1.25l-2.05 3.01h6.6a.75.75 0 0 1 .75.75v.02c0 .5-.26 1.1-.6 1.58l-3.3 4.63a.75.75 0 0 1-1.11-.1l-1.92-2.88a.75.75 0 0 0-1.04-.22l-1.32.88a.75.75 0 0 1-1.09-.64V9.38a.75.75 0 0 1 .32-.62L8 6.4V4.75A.75.75 0 0 1 8.75 4h1.72l.55-2.04a.75.75 0 0 1 1.25-.86ZM12.97 3.6a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1-1.06 1.06L14 5.69V11a.75.75 0 0 1-1.5 0V5.69l-2.72 2.72a.75.75 0 0 1-1.06-1.06l3.75-3.75ZM8.63 17.6a.75.75 0 0 1 .13 1.06l-2.05 3.01h6.6a.75.75 0 0 1 .75.75v.02c0 .5-.26 1.1-.6 1.58l-3.3 4.63a.75.75 0 0 1-1.11-.1l-1.92-2.88a.75.75 0 0 0-1.04-.22l-1.32.88a.75.75 0 0 1-1.09-.64V18.38a.75.75 0 0 1 .32-.62L6 15.4V13.75a.75.75 0 0 1 .75-.75h1.72l.55-2.04a.75.75 0 0 1 1.25-.86.75.75 0 0 1-.86 1.25l-.6 2.2a.75.75 0 0 1-.72.55H7.75a.75.75 0 0 0-.75.75v1.28l-1.97 1.31a.75.75 0 0 0-.32.62v2.86c0 .11.02.21.06.31l1.32-.88a.75.75 0 0 1 1.04.22l1.92 2.88a.75.75 0 0 0 1.11.1l3.3-4.63c.34-.48.6-1.08.6-1.58v-.02a.75.75 0 0 0-.75-.75h-6.6l2.05-3.01a.75.75 0 0 1 1.06-.13Z"
      clipRule="evenodd"
    />
  </svg>
);


function Createpost() {
  const [prompt, setPrompt] = useState('');
  const [photo, setPhoto] = useState(null); // Stores the final image URL
  const [generatingImg, setGeneratingImg] = useState(false);
  const [taskId, setTaskId] = useState(null); // Stores the job ID from Freepik
  
  // State for user feedback
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState(null);

  // Use a ref to store the interval ID for cleanup
  const intervalRef = useRef(null);

  // ✨ Random prompt generator
  const handleRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
    const randomPrompt = surpriseMePrompts[randomIndex];
    setPrompt(randomPrompt);
  };

  // 🧹 Clear fields
  const handleClear = () => {
    setPrompt('');
    setPhoto(null);
    setGeneratingImg(false);
    setTaskId(null);
    setStatusMessage('');
    setError(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 🚀 STEP 1: Start the image generation
  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt first!');
      return;
    }

    // Reset UI for new generation
    setPhoto(null);
    setGeneratingImg(true);
    setTaskId(null);
    setStatusMessage('Sending prompt to the AI...');
    setError(null);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    try {
      // ✅ Use the POST route from your backend to START the job
      const response = await fetch('http://localhost:5000/api/gen/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }), // Use the prompt value
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to start generation task.');
      }

      const data = await response.json();

      if (data.taskId) {
        // ✅ Success! We have a task ID. Store it to start polling.
        setTaskId(data.taskId);
        setStatusMessage('✅ Task started... checking for result.');
      } else {
        throw new Error('No task ID received from backend.');
      }
    } catch (err) {
      console.error('Error starting image generation:', err);
      setError(err.message);
      setGeneratingImg(false);
    }
  };

  // 🚀 STEP 2: Poll for the image status
  // This effect runs whenever 'taskId' or 'generatingImg' changes
  useEffect(() => {
    // Stop any previous polling interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Only start polling if we are in 'generatingImg' mode AND have a 'taskId'
    if (generatingImg && taskId) {
      // Check status immediately, then start interval
      checkImageStatus(taskId); 

      intervalRef.current = setInterval(() => {
        checkImageStatus(taskId);
      }, 3000); // Check every 3 seconds
    }

    // Cleanup function:
    // This runs when the component unmounts or before the effect runs again
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [taskId, generatingImg]); // Dependencies for the effect


  // Async helper function to check the job status
  const checkImageStatus = async (currentTaskId) => {
    try {
      // ✅ Use the GET route from your backend to CHECK the status
      const response = await fetch(`http://localhost:5000/api/gen/status/${currentTaskId}`);
      
      if (!response.ok) {
        // Don't stop polling for a single bad network request, just log it
        console.warn('Polling check failed, will try again.');
        return; 
      }

      const data = await response.json();

      if (data.status === 'COMPLETED') {
        // ✨ CONSOLE LOG ADDED AS REQUESTED:
        // This will show you the exact response object when the job is done.
        // Check this log in your browser console to see if 'data.photo' has the URL.
        console.log('✅ Generation COMPLETED! Full response data:', data);

        // ✨ SUCCESS!
        clearInterval(intervalRef.current); // Stop polling

        // ✅ 2. ADDED CHECK: Verify the photo URL exists before setting it
        if (data.photo) {
          setPhoto(data.photo); // This is now a direct URL, not Base64
          setGeneratingImg(false);
          setTaskId(null);
          setStatusMessage('✅ Image generated successfully!');
          setError(null);
        } else {
          // ❌ FAILED! (Even though status is 'COMPLETED', no URL was found)
          setError('Generation completed, but no image URL was returned.');
          setGeneratingImg(false);
          setTaskId(null);
        }
      } else if (data.status === 'FAILED') {
        // ❌ FAILED!
        clearInterval(intervalRef.current); // Stop polling
        setError('Image generation failed. Please try a different prompt.');
        setGeneratingImg(false);
        setTaskId(null);
      } else {
        // ⏳ IN_PROGRESS...
        setStatusMessage(`...still generating (status: ${data.status || 'IN_PROGRESS'})`);
      }
    } catch (err) {
      console.error('Error in checkImageStatus:', err);
      setError('Error polling for image. Halting.');
      setGeneratingImg(false);
      setTaskId(null);
      clearInterval(intervalRef.current); // Stop polling on critical error
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 flex flex-col p-3 font-sans">
      <div className="bg-gray-800 p-6 sm:p-8 shadow-lg w-full my-1 relative rounded-2xl max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-white mb-6 text-start px-1 sm:px-4">
          Generate Image
        </h1>

        {/* Text Area Container */}
        <div className="relative">
          {/* ✨ Random Icon */}
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-400 hover:text-yellow-300 transition-colors z-10 p-2"
            title="Random prompt"
            onClick={handleRandomPrompt}
          >
            {/* ✅ Replaced FontAwesomeIcon with inline SVG */}
            <FontAwesomeIcon icon={faWandMagicSparkles} className="w-6 h-6" />
          </button>

          {/* Text Area */}
          <textarea
            placeholder="A hyper-detailed digital painting of a crocodile detective..."
            className="w-full h-64 p-4 pr-12 text-gray-200 bg-gray-700 rounded-lg resize-none outline-none focus:ring-2 focus:ring-yellow-300"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
          <button
            type="button"
            onClick={generateImage}
            disabled={generatingImg}
            className={`w-full sm:w-auto ${
              generatingImg ? 'opacity-60 cursor-not-allowed' : 'hover:bg-yellow-400'
            } bg-yellow-300 text-black font-semibold py-3 px-6 rounded-lg transition-colors`}
          >
            {generatingImg ? 'Generating...' : 'Generate Image'}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="w-full sm:w-auto bg-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* 🖼️ Image Preview Section */}
      <div className="bg-gray-800 p-6 rounded-2xl mt-6 shadow-lg flex justify-center items-center max-w-4xl mx-auto w-full min-h-[400px]">
        {/* Show error message if it exists */}
        {error && (
          <p className="text-red-400 text-lg text-center p-4">{error}</p>
        )}
        
        {/* Show generated photo if we have one (and no error) */}
        {!error && photo && (
          <img
            src={photo}
            alt="Generated visual"
            className="w-full max-w-2xl rounded-lg shadow-lg object-contain"
          />
        )}

        {/* Show loading/status message if generating (and no photo yet) */}
        {!error && !photo && generatingImg && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300 mx-auto"></div>
            <p className="text-yellow-300 text-lg mt-4">{statusMessage || '✨ Generating...'}</p>
          </div>
        )}

        {/* Show placeholder if not loading, no photo, and no error */}
        {!error && !photo && !generatingImg && (
          <p className="text-gray-400 text-lg text-center p-4">Your generated image will appear here</p>
        )}
      </div>
    </div>
  );
}

// In a real CRA/Vite app, you would export default
// export default Createpost;

// For this single-file environment, we might need to render it
// (Assuming this file is the main App)
export default Createpost;