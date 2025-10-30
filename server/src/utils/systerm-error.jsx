/* third lib*/
import React from 'react';
import { createRoot } from 'react-dom/client';

/* material-ui */
import GlobalNotification from '@basics/GlobalNotification';

const ID = 'system-error';
let closeTimer = null;
let root = null;

export const closeNotify = () => {
  const el = document.getElementById(ID);
  if (!el) {
    return;
  }
  if (root) {
    root.unmount();
    root = null;
  }
  setTimeout(() => {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
};

export const sendNotify = (options = {}) => {
  try {
    // Clear previous notifications first
    closeNotify();

    // Create new notification element
    const el = document.createElement('div');
    el.id = ID;
    el.style.position = 'fixed';
    el.style.top = '0';
    el.style.left = '0';
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9999';

    // Add to page
    const parent = document.querySelector('#root') || document.body;
    parent.appendChild(el);

    // Create root and render
    root = createRoot(el);
    root.render(<GlobalNotification handleClose={closeNotify} {...options} />);

    // Set auto-close timer
    closeTimer = setTimeout(() => {
      closeNotify();
    }, 5000);
  } catch (error) {
    console.error('Error in sendNotify:', error);
    // If error occurs, try simple alert as fallback
    if (options.msg) {
      alert(options.msg);
    }
  }
};

export default {
  sendNotify,
  closeNotify,
};
