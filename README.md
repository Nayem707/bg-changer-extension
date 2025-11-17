# Advanced Color Changer Chrome Extension

A modern, feature-rich Chrome extension that allows users to customize the appearance of any website with advanced theming options, special modes, and persistent settings.

## 🌟 Features

### Core Functionality

- **Custom Colors**: Change background, text, and link colors on any website
- **Toggle Switch**: Easily enable/disable the theme
- **Persistent Storage**: Settings are saved and persist across browser sessions
- **Live Updates**: Changes apply immediately without page reload

### Special Modes

- **🎉 Party Mode**: Dynamic color cycling with pulsing animations
- **🎯 Focus Mode**: Reading-optimized layout with image blocking
- **🌸 Smooth Mode**: Soft pastel theme with enhanced visual effects

### User Experience

- **Modern UI**: Sleek, gradient-based popup design
- **Responsive Design**: Works on different screen sizes
- **Smooth Animations**: CSS transitions and keyframe animations
- **Status Notifications**: Visual feedback for user actions
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 📁 File Structure

```
extension/
├── manifest.json       # Extension configuration and permissions
├── popup.html         # Extension popup interface
├── popup.css          # Popup styling and animations
├── popup.js           # Popup logic and user interactions
├── content.js         # Website modification and theme application
├── icons/             # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md          # This documentation file
```

## 🚀 Installation

### For Development

1. Clone or download the extension files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked" and select the extension folder
5. The extension will appear in your toolbar

### For Distribution

1. Zip the extension folder
2. Upload to Chrome Web Store Developer Dashboard
3. Follow Chrome Web Store review process

## 💻 Technical Details

### Manifest V3 Compliance

- Uses the latest Chrome extension API
- Proper permission declarations
- Content script injection for DOM manipulation
- Service worker ready (no background scripts)

### Architecture

- **Popup Script**: Handles user interface interactions and settings management
- **Content Script**: Applies themes and modifications to web pages
- **Chrome Storage API**: Syncs settings across devices
- **Message Passing**: Communication between popup and content scripts

### Browser Compatibility

- Chrome 88+ (Manifest V3 requirement)
- Edge 88+ (Chromium-based)
- Other Chromium browsers with Manifest V3 support

## 🎨 Theme System

### Basic Theme

- Applies user-selected colors to background, text, and links
- Intelligent contrast calculation for readability
- Smooth CSS transitions for visual appeal
- Smart element targeting (inputs, buttons, etc.)

### Party Mode

- Cycles through vibrant color palette every second
- Adds pulsing animation effects
- Dynamic text shadows on links
- Creates an energetic, fun atmosphere

### Focus Mode

- Removes distracting elements (images, ads)
- Applies reading-optimized typography
- Centers content with maximum width
- Uses calm, neutral color scheme
- Perfect for article reading and studying

### Smooth Mode

- Randomly selected pastel background
- Soft color contrast for eye comfort
- Rounded corners and subtle shadows
- Sepia filter on images for cohesion
- Relaxing visual experience

## 🔧 API Reference

### Chrome Storage

```javascript
// Save settings
await chrome.storage.sync.set({
  enabled: true,
  bgColor: '#ffffff',
  textColor: '#000000',
  linkColor: '#0066cc',
  currentMode: 'smooth',
});

// Load settings
const result = await chrome.storage.sync.get({
  enabled: false,
  bgColor: '#ffffff',
  textColor: '#000000',
  linkColor: '#0066cc',
  currentMode: null,
});
```

### Message Passing

```javascript
// From popup to content script
chrome.tabs.sendMessage(tab.id, {
  action: 'applyTheme',
  settings: settingsObject,
});

// Content script listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'applyTheme') {
    applyTheme(request.settings);
    sendResponse({ success: true });
  }
});
```

## 🎯 Usage Guide

### Basic Usage

1. Click the extension icon in the toolbar
2. Toggle "Enable Theme" to activate
3. Use color pickers to customize colors
4. Changes apply immediately to the active tab

### Special Modes

1. Click any special mode button to activate
2. Button will highlight when active
3. Click again to deactivate the mode
4. Only one special mode can be active at a time

### Reset Function

- Click "Reset to Default" to restore original website appearance
- This clears all custom colors and disables special modes
- Original website styles are preserved and restored

## 🔒 Permissions Explained

- **activeTab**: Required to modify the current website's appearance
- **scripting**: Needed to inject CSS and execute theme changes
- **storage**: Saves user preferences across browser sessions

## 🐛 Troubleshooting

### Common Issues

**Extension not working on some sites**

- Some sites use Content Security Policy (CSP) that may block modifications
- HTTPS sites may have stricter security measures
- Try refreshing the page after enabling the theme

**Settings not persisting**

- Check if Chrome sync is enabled in browser settings
- Clear extension data and reconfigure if needed
- Ensure storage permissions are granted

**Performance issues in Party Mode**

- Party mode uses intervals and animations that may impact performance
- Disable party mode on resource-intensive websites
- Use other modes for better performance

### Debug Mode

Open Chrome DevTools (F12) and check the Console tab for any error messages. The extension logs helpful information for debugging.

## 📈 Future Enhancements

### Planned Features

- **Custom Theme Presets**: Save and share favorite color combinations
- **Website-Specific Settings**: Different themes for different domains
- **Dark Mode Detection**: Auto-switch based on system preferences
- **Color Palette Generator**: AI-suggested color combinations
- **Export/Import Settings**: Backup and restore configurations

### Advanced Features

- **CSS Filter Effects**: Blur, sepia, invert options
- **Animation Controls**: Customize transition speeds
- **Font Customization**: Change typography and sizing
- **Element Targeting**: Granular control over specific elements

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on multiple websites
5. Submit a pull request

### Code Style

- Use ES6+ features and modern JavaScript
- Follow consistent indentation (2 spaces)
- Add comments for complex logic
- Test on multiple browsers and websites

## 📄 License

This extension is released under the MIT License. See LICENSE file for details.

## 🔗 Links

- [Chrome Web Store](https://chrome.google.com/webstore)
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)

## 📞 Support

For issues, feature requests, or questions:

- Open an issue on the project repository
- Check existing issues for similar problems
- Provide browser version and steps to reproduce bugs

---

**Version**: 2.0  
**Last Updated**: November 2025  
**Manifest Version**: 3  
**Minimum Chrome Version**: 88

Made with ❤️ for the web customization community!
