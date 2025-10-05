// src/useInactivityDetector.js

import { useEffect, useRef } from 'react';

/**
 * A custom hook to detect user inactivity.
 * @param {function} onInactive - The callback function to execute when inactivity is detected.
 * @param {number} timeout - The inactivity timeout in milliseconds.
 */
export function useInactivityDetector(onInactive, timeout) {
  const timerId = useRef(null);

  // Function to reset the inactivity timer
  const resetTimer = () => {
    // Clear the previous timer if it exists
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    // Set a new timer
    timerId.current = setTimeout(onInactive, timeout);
  };

  useEffect(() => {
    // List of events that indicate user activity
    const activityEvents = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
    ];

    // Set up event listeners and the initial timer
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });
    resetTimer(); // Start the timer initially

    // Cleanup function: This is crucial to prevent memory leaks!
    return () => {
      clearTimeout(timerId.current);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [onInactive, timeout]); // Rerun effect if the callback or timeout changes
}