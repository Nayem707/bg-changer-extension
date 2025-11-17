// Advanced Color Changer Extension - Content Script
class ColorChangerContent {
  constructor() {
    this.styleId = 'color-changer-styles';
    this.originalStyles = new Map();
    this.partyInterval = null;
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (this.isInitialized) return;

    this.isInitialized = true;
    this.setupMessageListener();
    this.loadAndApplyStoredTheme();
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'applyTheme') {
        this.applyTheme(request.settings);
        sendResponse({ success: true });
      } else if (request.action === 'resetTheme') {
        this.resetTheme();
        sendResponse({ success: true });
      }
      return true;
    });
  }

  async loadAndApplyStoredTheme() {
    try {
      const result = await chrome.storage.sync.get({
        enabled: false,
        bgColor: '#ffffff',
        textColor: '#000000',
        linkColor: '#0066cc',
        currentMode: null,
      });

      if (result.enabled) {
        this.applyTheme(result);
      }
    } catch (error) {
      console.error('Error loading stored theme:', error);
    }
  }

  applyTheme(settings) {
    this.clearPartyMode();
    this.removeExistingStyles();

    if (!settings.enabled) {
      return;
    }

    // Apply special modes
    if (settings.currentMode) {
      this.applySpecialMode(settings.currentMode, settings);
    } else {
      this.applyBasicTheme(settings);
    }
  }

  applyBasicTheme(settings) {
    const css = `
      * {
        background-color: ${settings.bgColor} !important;
        color: ${settings.textColor} !important;
        transition: all 0.3s ease !important;
      }
      
      a, a:visited, a:hover, a:active {
        color: ${settings.linkColor} !important;
      }
      
      input, textarea, select {
        background-color: ${this.lightenColor(settings.bgColor, 10)} !important;
        border: 1px solid ${this.darkenColor(settings.bgColor, 20)} !important;
      }
      
      button {
        background-color: ${this.darkenColor(settings.bgColor, 15)} !important;
        border: 1px solid ${this.darkenColor(settings.bgColor, 25)} !important;
      }
      
      img, video, iframe, canvas, svg {
        opacity: 0.9 !important;
        border-radius: 4px !important;
      }
    `;

    this.injectCSS(css);
  }

  applySpecialMode(mode, settings) {
    switch (mode) {
      case 'party':
        this.applyPartyMode();
        break;
      case 'focus':
        this.applyFocusMode(settings);
        break;
      case 'smooth':
        this.applySmoothMode();
        break;
    }
  }

  applyPartyMode() {
    const colors = [
      '#ff6b6b',
      '#4ecdc4',
      '#45b7d1',
      '#96ceb4',
      '#ffeaa7',
      '#dda0dd',
      '#98d8c8',
      '#f7dc6f',
    ];
    let colorIndex = 0;

    const applyRandomColors = () => {
      const bgColor = colors[colorIndex % colors.length];
      const textColor = this.getContrastColor(bgColor);
      const linkColor = colors[(colorIndex + 2) % colors.length];

      const css = `
        * {
          background-color: ${bgColor} !important;
          color: ${textColor} !important;
          transition: all 1s ease !important;
        }
        
        a, a:visited, a:hover, a:active {
          color: ${linkColor} !important;
          text-shadow: 0 0 10px ${linkColor} !important;
        }
        
        body {
          animation: partyPulse 2s ease-in-out infinite alternate !important;
        }
        
        @keyframes partyPulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.02); }
        }
      `;

      this.injectCSS(css);
      colorIndex++;
    };

    applyRandomColors();
    this.partyInterval = setInterval(applyRandomColors, 1000);
  }

  applyFocusMode(settings) {
    const css = `
      * {
        background-color: #f8f9fa !important;
        color: #2c3e50 !important;
        transition: all 0.3s ease !important;
      }
      
      a, a:visited, a:hover, a:active {
        color: #3498db !important;
      }
      
      img, video, iframe, canvas, svg, .ad, [class*="ad"], [id*="ad"] {
        display: none !important;
      }
      
      body {
        font-family: 'Georgia', serif !important;
        line-height: 1.6 !important;
        max-width: 800px !important;
        margin: 0 auto !important;
        padding: 20px !important;
      }
      
      h1, h2, h3, h4, h5, h6 {
        color: #2c3e50 !important;
        font-weight: 600 !important;
      }
      
      p, li, td {
        font-size: 16px !important;
        line-height: 1.6 !important;
      }
    `;

    this.injectCSS(css);
  }

  applySmoothMode() {
    const pastels = [
      '#ffeaa7',
      '#fab1a0',
      '#fd79a8',
      '#e17055',
      '#a29bfe',
      '#6c5ce7',
    ];
    const bgColor = pastels[Math.floor(Math.random() * pastels.length)];
    const textColor = '#2d3436';
    const linkColor = '#00b894';

    const css = `
      * {
        background-color: ${bgColor} !important;
        color: ${textColor} !important;
        transition: all 0.5s ease !important;
        border-radius: 8px !important;
      }
      
      a, a:visited, a:hover, a:active {
        color: ${linkColor} !important;
      }
      
      body {
        filter: contrast(0.8) brightness(1.1) !important;
      }
      
      img, video {
        filter: sepia(20%) saturate(0.8) !important;
        border-radius: 12px !important;
      }
      
      input, textarea, select, button {
        background-color: ${this.lightenColor(bgColor, 15)} !important;
        border: 2px solid ${this.lightenColor(bgColor, 25)} !important;
        border-radius: 12px !important;
        padding: 8px 12px !important;
      }
      
      div, section, article {
        box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
        margin: 5px !important;
        padding: 10px !important;
      }
    `;

    this.injectCSS(css);
  }

  injectCSS(css) {
    this.removeExistingStyles();

    const style = document.createElement('style');
    style.id = this.styleId;
    style.textContent = css;
    document.head.appendChild(style);
  }

  removeExistingStyles() {
    const existingStyle = document.getElementById(this.styleId);
    if (existingStyle) {
      existingStyle.remove();
    }
  }

  clearPartyMode() {
    if (this.partyInterval) {
      clearInterval(this.partyInterval);
      this.partyInterval = null;
    }
  }

  resetTheme() {
    this.clearPartyMode();
    this.removeExistingStyles();
  }

  // Utility functions
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  rgbToHex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  lightenColor(color, percent) {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;

    const factor = percent / 100;
    const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * factor));
    const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * factor));
    const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * factor));

    return this.rgbToHex(r, g, b);
  }

  darkenColor(color, percent) {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;

    const factor = percent / 100;
    const r = Math.max(0, Math.floor(rgb.r * (1 - factor)));
    const g = Math.max(0, Math.floor(rgb.g * (1 - factor)));
    const b = Math.max(0, Math.floor(rgb.b * (1 - factor)));

    return this.rgbToHex(r, g, b);
  }

  getContrastColor(hexColor) {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return '#000000';

    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  }
}

// Initialize the content script
if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    () => new ColorChangerContent()
  );
} else {
  new ColorChangerContent();
}
