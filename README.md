# Claude Artifacts Hub

A Google Apps Script web application for organizing and sharing Claude-generated artifacts with your team.

## Features

- **Share Artifacts**: Upload and organize Claude-generated content (code, documents, designs)
- **Search & Discovery**: Find artifacts created by teammates with powerful search and filtering
- **Tag Organization**: Categorize artifacts with tags for easy discovery
- **User-Friendly Interface**: Clean, modern UI with glass-morphism design
- **Google Sheets Backend**: All data stored securely in Google Sheets

## Setup Instructions

### Prerequisites
- Google account
- Node.js installed (for Clasp CLI)
- Google Clasp CLI (`npm install -g @google/clasp`)

### Installation

1. **Clone this repository**
   ```bash
   git clone https://github.com/bsft-stephen-dunn/claude-artifacts-hub.git
   cd claude-artifacts-hub
   ```

2. **Login to Clasp**
   ```bash
   clasp login
   ```

3. **Create a new Google Apps Script project**
   ```bash
   clasp create --type webapp --title "Claude Artifacts Hub"
   ```

4. **Enable Google Apps Script API**
   - Visit https://script.google.com/home/usersettings
   - Toggle on "Google Apps Script API"

5. **Push the files**
   ```bash
   clasp push
   ```

6. **Deploy the web app**
   ```bash
   clasp deploy -d "Initial deployment"
   ```

7. **Get the web app URL**
   - Go to your script project at script.google.com
   - Click "Deploy" → "Manage deployments"
   - Copy the Web app URL

## Configuration

### Access Settings
By default, the web app is set to:
- Execute as: User accessing the web app
- Access: Only myself

To share with others, modify the `webapp.access` setting in `appsscript.json`:
- `"MYSELF"` - Only you can access
- `"DOMAIN"` - Anyone in your Google Workspace domain
- `"ANYONE"` - Anyone with the link
- `"ANYONE_ANONYMOUS"` - Anyone, even anonymous

### Data Storage
The app automatically creates a Google Sheet called "Claude Artifacts Database" in your Google Drive to store all artifacts.

## File Structure

- `Code.js` - Main server-side Google Apps Script code
- `home.html` - Homepage with overview and recent artifacts
- `add.html` - Form to add new artifacts
- `search.html` - Search and browse all artifacts
- `artifact.html` - Individual artifact detail view
- `stylesheet.html` - Shared CSS styles
- `appsscript.json` - Project manifest file

## Usage

1. **Adding Artifacts**
   - Click "Add Artifact" in the navigation
   - Fill in the title, description, type, and content
   - Add relevant tags for better discoverability
   - Submit to save to the database

2. **Searching Artifacts**
   - Use the search bar to find artifacts by title, description, or tags
   - Filter by artifact type
   - Click popular tags for quick filtering
   - Sort results by date, title, type, or author

3. **Viewing Artifacts**
   - Click on any artifact card to view full details
   - Copy code snippets with one click
   - See creation date and author information

## Development

To modify the app:

1. Make changes to the files locally
2. Push changes to Google Apps Script:
   ```bash
   clasp push
   ```
3. Create a new deployment:
   ```bash
   clasp deploy -d "Description of changes"
   ```

## Troubleshooting

- **"User has not enabled the Apps Script API" error**: Enable the API at https://script.google.com/home/usersettings
- **Permission errors**: Check the `webapp.access` setting in `appsscript.json`
- **Sheet not found**: The app will automatically create a new sheet on first run

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.