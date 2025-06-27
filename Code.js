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
  const category = sanitizeInput(e.parameter.category);
  const searchQuery = sanitizeInput(e.parameter.q);
  
  let template;
  let title = 'Claude Artifacts Hub';
  
  switch(page) {
    case 'home':
      template = HtmlService.createTemplateFromFile('home');
      break;
      
    case 'artifact':
      if (!artifactId) return redirectToHome();
      const artifact = ARTIFACTS.find(a => a.id === artifactId);
      if (!artifact) return redirectToHome();
      
      template = HtmlService.createTemplateFromFile('artifact');
      template.artifactId = artifactId;
      template.artifact = artifact;
      title = `${artifact.title} - Claude Artifacts Hub`;
      break;
      
    case 'view':
      // Direct HTML view for artifacts
      if (!artifactId) return redirectToHome();
      const viewArtifact = ARTIFACTS.find(a => a.id === artifactId);
      if (viewArtifact) {
        return HtmlService.createHtmlOutputFromFile(viewArtifact.filename)
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
          .setSandboxMode(HtmlService.SandboxMode.IFRAME)
          .setTitle(viewArtifact.title);
      }
      return redirectToHome();
      
    case 'category':
      template = HtmlService.createTemplateFromFile('category');
      template.category = category || 'all';
      title = `${category || 'All'} Artifacts - Claude Artifacts Hub`;
      break;
      
    case 'search':
      template = HtmlService.createTemplateFromFile('search');
      template.query = searchQuery || '';
      title = searchQuery ? `Search: ${searchQuery} - Claude Artifacts Hub` : 'Search - Claude Artifacts Hub';
      break;
      
    case 'about':
      template = HtmlService.createTemplateFromFile('about');
      title = 'About - Claude Artifacts Hub';
      break;
      
    default:
      return redirectToHome();
  }
  
  // Add common template variables
  template.currentPage = page;
  template.scriptUrl = ScriptApp.getService().getUrl();
  
  return template.evaluate()
    .setTitle(title)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Redirects to the home page
 * @returns {HtmlOutput} Home page output
 */
function redirectToHome() {
  const template = HtmlService.createTemplateFromFile('home');
  template.currentPage = 'home';
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

/**
 * Gets a single artifact by ID
 * @param {string} id - The artifact ID
 * @returns {Object|null} The artifact object or null if not found
 */
function getArtifact(id) {
  return ARTIFACTS.find(artifact => artifact.id === id) || null;
}

/**
 * Gets artifacts by category
 * @param {string} category - The category to filter by
 * @returns {Array} Array of artifacts in the category
 */
function getArtifactsByCategory(category) {
  if (!category || category === 'all') return ARTIFACTS;
  
  return ARTIFACTS.filter(artifact => {
    const artifactCategory = artifact.type.toLowerCase().replace(/[^a-z]/g, '');
    return artifactCategory === category.toLowerCase();
  });
}

/**
 * Searches artifacts by query
 * @param {string} query - The search query
 * @returns {Array} Array of matching artifacts
 */
function searchArtifacts(query) {
  if (!query) return ARTIFACTS;
  
  const lowerQuery = query.toLowerCase();
  return ARTIFACTS.filter(artifact => 
    artifact.title.toLowerCase().includes(lowerQuery) ||
    artifact.description.toLowerCase().includes(lowerQuery) ||
    artifact.type.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Gets unique categories from artifacts
 * @returns {Array} Array of category objects
 */
function getCategories() {
  const categories = new Set();
  ARTIFACTS.forEach(artifact => {
    categories.add(artifact.type);
  });
  
  return Array.from(categories).map(cat => ({
    name: cat,
    slug: cat.toLowerCase().replace(/[^a-z]/g, ''),
    count: ARTIFACTS.filter(a => a.type === cat).length
  }));
}