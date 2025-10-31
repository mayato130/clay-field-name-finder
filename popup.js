// popup.js - Clay Field Name Finder

document.addEventListener('DOMContentLoaded', async () => {
  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;
  
  const notClayPage = document.getElementById('notClayPage');
  const content = document.getElementById('content');
  
  // Check if we're on a Clay page
  if (!url || !url.includes('app.clay.com')) {
    notClayPage.style.display = 'block';
    return;
  }
  
  // Show main content
  content.style.display = 'block';
  
  // Setup search functionality
  const searchButton = document.getElementById('searchButton');
  const fieldIdInput = document.getElementById('fieldIdInput');
  const errorDiv = document.getElementById('error');
  const resultSection = document.getElementById('resultSection');
  const fieldNameElement = document.getElementById('fieldName');
  const fieldIdElement = document.getElementById('fieldId');
  
  const performSearch = async () => {
    const fieldId = fieldIdInput.value.trim();
    
    if (!fieldId) {
      showError('Please enter a field ID');
      return;
    }
    
    // Validate field ID format
    if (!fieldId.startsWith('f_')) {
      showError('Field ID should start with "f_" (e.g., f_0t4yxpnDWo77yK64ynn)');
      return;
    }
    
    // Show loading state
    searchButton.textContent = 'Searching...';
    searchButton.classList.add('loading');
    searchButton.disabled = true;
    hideError();
    resultSection.style.display = 'none';
    
    try {
      // Inject script to search for field name
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: findFieldName,
        args: [fieldId]
      });
      
      const fieldName = results[0].result;
      
      if (fieldName) {
        // Show result
        fieldNameElement.textContent = fieldName;
        fieldIdElement.textContent = fieldId;
        resultSection.style.display = 'block';
        
        // Setup copy buttons
        setupCopyButton('copyFieldName', fieldName);
        setupCopyButton('copyFieldId', fieldId);
      } else {
        showError('Field ID not found. Make sure the column is visible on the page.');
      }
    } catch (err) {
      console.error('Search error:', err);
      showError('Error searching for field. Please make sure you\'re on a Clay table page with visible columns.');
    } finally {
      // Reset button state
      searchButton.textContent = 'Search';
      searchButton.classList.remove('loading');
      searchButton.disabled = false;
    }
  };
  
  // Search on button click
  searchButton.addEventListener('click', performSearch);
  
  // Search on Enter key
  fieldIdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
  
  // Focus on input
  fieldIdInput.focus();
});

function showError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

function hideError() {
  const errorDiv = document.getElementById('error');
  errorDiv.style.display = 'none';
}

function setupCopyButton(buttonId, text) {
  const button = document.getElementById(buttonId);
  // Remove old event listeners by cloning
  const newButton = button.cloneNode(true);
  button.parentNode.replaceChild(newButton, button);
  
  newButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text);
      const originalText = newButton.textContent;
      newButton.textContent = 'Copied!';
      newButton.classList.add('copied');
      setTimeout(() => {
        newButton.textContent = originalText;
        newButton.classList.remove('copied');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      newButton.textContent = 'Error';
    }
  });
}

// This function runs in the context of the Clay page
function findFieldName(fieldId) {
  // Search for the header cell with the field ID
  const headerCell = document.querySelector(`div[id="table-header-cell-${fieldId}"]`);
  
  if (headerCell) {
    // Find the <p data-slot="text"> element that contains the field name
    const textElement = headerCell.querySelector('p[data-slot="text"]');
    if (textElement) {
      return textElement.textContent.trim();
    }
  }
  
  return null;
}

