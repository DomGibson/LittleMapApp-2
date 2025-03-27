import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';

// Wait for Shopify's DOM to be fully ready before mounting React
document.addEventListener("DOMContentLoaded", () => {
  const mountNode = document.getElementById('shopify-mapbox-widget');

  if (mountNode) {
    ReactDOM.createRoot(mountNode).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    console.error("🚨 Shopify mount node #shopify-mapbox-widget not found!");
  }
});
