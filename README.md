# Clay Field Name Finder

A Chrome extension to find field names by searching for field IDs on Clay table pages.

## 🎯 What it does

When working with Clay's API or inspecting table structures, you often need to know which field ID corresponds to which column name. This extension makes it easy:

1. Enter a field ID (e.g., `f_0t4yxpnDWo77yK64ynn`)
2. The extension searches the current Clay page
3. Returns the field name
4. Copy either the field name or field ID with one click

## 📦 Installation

1. Download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **"Developer mode"** (toggle in the top-right corner)
4. Click **"Load unpacked"**
5. Select the downloaded folder
6. Done! The extension icon will appear in your Chrome toolbar

## 💡 How to Use

1. Navigate to a Clay table page (URL: `https://app.clay.com/workspaces/.../tables/...`)
2. Click the extension icon in your toolbar
3. Enter a field ID in the search box (e.g., `f_0t4yxpnDWo77yK64ynn`)
4. Click **"Search"** or press Enter
5. View the field name and copy it or the field ID

## ⚠️ Important Notes

- **The column must be visible** on the current page
  - Scroll horizontally to make sure the column you're searching for is visible
  - The extension can only find fields in the visible table headers
- Field IDs start with `f_` (e.g., `f_0t4yxpnDWo77yK64ynn`)
- Only works on Clay table pages

## 📋 Use Cases

- **API Development**: Map field IDs to human-readable names
- **Data Integration**: Understand table structure for automation
- **Support**: Help users identify which fields they need to reference
- **Documentation**: Create field mapping documentation
- **Debugging**: Verify field IDs when troubleshooting API calls

## 🔐 Privacy & Permissions

**Required Permissions:**
- `activeTab` - Access to the current tab
- `scripting` - Inject scripts to search the page DOM
- `host_permissions: https://app.clay.com/*` - Access Clay pages

**Privacy:**
- ✅ No data is stored or transmitted
- ✅ Only works on Clay pages
- ✅ Only accesses the page when you click "Search"
- ✅ All processing happens locally in your browser

## 🛠️ Technical Details

### How it works

1. User enters a field ID
2. Extension injects a content script into the Clay page
3. Script searches for `div[id="table-header-cell-{fieldId}"]`
4. Extracts text from `<p data-slot="text">` tag inside the header
5. Returns the field name to the popup

### HTML Structure

The extension searches for this structure in Clay's DOM:
```html
<div id="table-header-cell-f_0t4yxpnDWo77yK64ynn" data-testid="table-header-cell">
  ...
  <p data-slot="text">Column Name</p>
  ...
</div>
```

## 📁 Files

- `manifest.json` - Extension configuration
- `popup.html` - User interface
- `popup.js` - Search logic and DOM manipulation
- `icon.png` - Extension icon
- `README.md` - This file

## 💡 Tips

- **Scroll to find columns**: If a field isn't found, scroll horizontally on the Clay table to make the column visible
- **Press Enter to search**: You can press Enter instead of clicking the Search button
- **Validate field IDs**: Field IDs should start with `f_` 
- **Use for bulk mapping**: Open the extension, search multiple fields, and document them

## 🤝 Pair with Clay ID Extractor

This extension pairs well with [Clay ID Extractor](https://github.com/mayato130/clay-id-extractor) which extracts Workspace and Table IDs from URLs.

---

Made for Clay users who work with APIs 🚀

