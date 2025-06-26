// Code.gs - Main Google Apps Script file
// Artifacts are now stored in-memory as a static array

// Function to get Rails graph HTML content
function getRailsGraphContent() {
  try {
    return HtmlService.createHtmlOutputFromFile('rails_graph').getContent();
  } catch(e) {
    // Fallback if file not found
    return '<h1>Rails Database Visualization</h1><p>Content loading...</p>';
  }
}

// Static array of artifacts - add new artifacts here
const ARTIFACTS = [
  {
    id: '1',
    title: 'Rails Database Force-Directed Graph',
    description: 'Interactive visualization of Rails database relationships using D3.js force-directed graph',
    type: 'HTML',
    tags: 'rails, database, visualization, d3js, graph',
    created_by: 'admin@example.com',
    created_date: new Date('2024-01-01'),
    updated_date: new Date('2024-01-01')
  }
];

function doGet(e) {
  const page = e.parameter.page || 'home';
  const artifactId = e.parameter.id;
  
  switch(page) {
    case 'home':
      return HtmlService.createTemplateFromFile('home').evaluate()
        .setTitle('Claude Artifacts Hub')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
        
    case 'artifact':
      if (artifactId) {
        const template = HtmlService.createTemplateFromFile('artifact');
        template.artifactId = artifactId;
        return template.evaluate()
          .setTitle('Artifact Details')
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      }
      return redirectToHome();
      
    default:
      return redirectToHome();
  }
}

function redirectToHome() {
  return HtmlService.createTemplateFromFile('home').evaluate()
    .setTitle('Claude Artifacts Hub')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// API Functions for artifact management
function getArtifacts() {
  // Add content dynamically when requested
  return ARTIFACTS.map(artifact => {
    if (artifact.id === '1' && !artifact.content) {
      artifact.content = getRailsGraphContent();
    }
    return artifact;
  });
}

function getArtifact(id) {
  const artifact = ARTIFACTS.find(a => a.id === id);
  if (artifact && artifact.id === '1' && !artifact.content) {
    artifact.content = getRailsGraphContent();
  }
  return artifact || null;
}

function searchArtifacts(query) {
  if (!query) return getArtifacts();
  
  const lowerQuery = query.toLowerCase();
  return getArtifacts().filter(artifact => 
    artifact.title.toLowerCase().includes(lowerQuery) ||
    artifact.description.toLowerCase().includes(lowerQuery) ||
    artifact.tags.toLowerCase().includes(lowerQuery) ||
    artifact.type.toLowerCase().includes(lowerQuery)
  );
}