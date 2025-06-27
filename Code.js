// Code.gs - Main Google Apps Script file

// Artifact metadata
const ARTIFACTS = [
  {
    id: '1',
    title: 'Rails Database Force-Directed Graph',
    description: 'Interactive visualization of Rails database relationships using D3.js',
    type: 'HTML',
    filename: 'rails_graph.html',
    preview: 'https://via.placeholder.com/300x180/2790FF/FFFFFF?text=Rails+Graph'
  },
  {
    id: '2',
    title: 'Animated Analog Clock',
    description: 'Beautiful animated clock with analog and digital display',
    type: 'HTML',
    filename: 'clock_animation.html',
    preview: 'https://via.placeholder.com/300x180/667eea/FFFFFF?text=Animated+Clock'
  }
];

/**
 * Sanitizes input parameters to prevent injection attacks
 * @param {string} input - The input string to sanitize
 * @returns {string|null} Sanitized input or null
 */
function sanitizeInput(input) {
  if (!input) return null;
  // Only allow alphanumeric characters, hyphens, and underscores
  return input.toString().replace(/[^a-zA-Z0-9-_]/g, '');
}

/**
 * Handles HTTP GET requests for the web app
 * @param {Object} e - Event object containing request parameters
 * @returns {HtmlOutput} The appropriate HTML response
 */
function doGet(e) {
  const page = sanitizeInput(e.parameter.page) || 'home';
  const artifactId = sanitizeInput(e.parameter.id);
  
  if (page === 'view' && artifactId) {
    // Serve artifact HTML directly
    const artifact = ARTIFACTS.find(a => a.id === artifactId);
    if (artifact) {
      return HtmlService.createHtmlOutputFromFile(artifact.filename)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setTitle(artifact.title);
    }
  }
  
  // Default to home page
  const template = HtmlService.createTemplateFromFile('home');
  template.scriptUrl = ScriptApp.getService().getUrl();
  return template.evaluate()
    .setTitle('Claude Artifacts Hub')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Includes HTML content from another file
 * @param {string} filename - Name of the file to include (without .html extension)
 * @returns {string} HTML content as string
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Returns the array of artifacts for display
 * @returns {Array} Array of artifact objects
 */
function getArtifacts() {
  return ARTIFACTS;
}