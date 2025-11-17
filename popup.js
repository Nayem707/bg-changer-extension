// Advanced Color Changer Extension - Popup Script
class ColorChangerPopup {
  constructor() {
    this.elements = this.getElements();
    this.currentMode = null;
    this.init();
  }

  getElements() {
    return {
      enableTheme: document.getElementById('enableTheme'),
      bgColor: document.getElementById('bgColor'),
      textColor: document.getElementById('textColor'),
      linkColor: document.getElementById('linkColor'),
      partyMode: document.getElementById('partyMode'),
      focusMode: document.getElementById('focusMode'),
      smoothMode: document.getElementById('smoothMode'),
      resetButton: document.getElementById('resetButton'),
      status: document.getElementById('status'),
    };
  }

  async init() {
    await this.loadSettings();
    this.attachEventListeners();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get({
        enabled: false,
        bgColor: '#ffffff',
        textColor: '#000000',
        linkColor: '#0066cc',
        currentMode: null,
      });

      this.elements.enableTheme.checked = result.enabled;
      this.elements.bgColor.value = result.bgColor;
      this.elements.textColor.value = result.textColor;
      this.elements.linkColor.value = result.linkColor;
      this.currentMode = result.currentMode;

      // Update mode button states
      this.updateModeButtons();
    } catch (error) {
      this.showStatus('Error loading settings', 'error');
    }
  }

  async saveSettings() {
    try {
      const settings = {
        enabled: this.elements.enableTheme.checked,
        bgColor: this.elements.bgColor.value,
        textColor: this.elements.textColor.value,
        linkColor: this.elements.linkColor.value,
        currentMode: this.currentMode,
      };

      await chrome.storage.sync.set(settings);
      await this.applyThemeToActiveTab();
      this.showStatus('Settings saved!', 'success');
    } catch (error) {
      this.showStatus('Error saving settings', 'error');
    }
  }

  async applyThemeToActiveTab() {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      const settings = {
        enabled: this.elements.enableTheme.checked,
        bgColor: this.elements.bgColor.value,
        textColor: this.elements.textColor.value,
        linkColor: this.elements.linkColor.value,
        currentMode: this.currentMode,
      };

      await chrome.tabs.sendMessage(tab.id, {
        action: 'applyTheme',
        settings: settings,
      });
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }

  attachEventListeners() {
    // Theme toggle
    this.elements.enableTheme.addEventListener('change', () => {
      this.saveSettings();
    });

    // Color inputs
    [
      this.elements.bgColor,
      this.elements.textColor,
      this.elements.linkColor,
    ].forEach((input) => {
      input.addEventListener('change', () => {
        if (this.elements.enableTheme.checked) {
          this.saveSettings();
        }
      });
    });

    // Special mode buttons
    [
      this.elements.partyMode,
      this.elements.focusMode,
      this.elements.smoothMode,
    ].forEach((button) => {
      button.addEventListener('click', () => {
        const mode = button.dataset.mode;
        this.toggleMode(mode);
      });
    });

    // Reset button
    this.elements.resetButton.addEventListener('click', () => {
      this.resetToDefault();
    });
  }

  toggleMode(mode) {
    if (this.currentMode === mode) {
      this.currentMode = null;
    } else {
      this.currentMode = mode;
    }

    this.updateModeButtons();
    this.saveSettings();
  }

  updateModeButtons() {
    [
      this.elements.partyMode,
      this.elements.focusMode,
      this.elements.smoothMode,
    ].forEach((button) => {
      const mode = button.dataset.mode;
      if (this.currentMode === mode) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  async resetToDefault() {
    this.elements.enableTheme.checked = false;
    this.elements.bgColor.value = '#ffffff';
    this.elements.textColor.value = '#000000';
    this.elements.linkColor.value = '#0066cc';
    this.currentMode = null;

    this.updateModeButtons();
    await this.saveSettings();

    // Reset the active tab
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      await chrome.tabs.sendMessage(tab.id, {
        action: 'resetTheme',
      });
    } catch (error) {
      console.error('Error resetting theme:', error);
    }

    this.showStatus('Reset to default!', 'success');
  }

  showStatus(message, type = '') {
    this.elements.status.textContent = message;
    this.elements.status.className = `status show ${type}`;

    setTimeout(() => {
      this.elements.status.classList.remove('show');
    }, 2000);
  }
}

// Initialize the popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ColorChangerPopup();
});
