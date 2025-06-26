// Code.gs - Main Google Apps Script file
// Artifacts are stored as separate HTML files

// Artifact metadata - each artifact should have a corresponding HTML file
const ARTIFACTS_METADATA = [
  {
    id: '1',
    title: 'Rails Database Force-Directed Graph',
    description: 'Interactive visualization of Rails database relationships using D3.js force-directed graph',
    type: 'HTML',
    filename: 'rails_graph',
    tags: 'rails, database, visualization, d3js, graph',
    preview: 'https://via.placeholder.com/300x200/2790FF/FFFFFF?text=Rails+Graph',
    created_by: 'admin@example.com',
    created_date: new Date('2024-01-01'),
    updated_date: new Date('2024-01-01')
  },
  {
    id: '2',
    title: 'Animated Analog Clock',
    description: 'Beautiful animated clock with both analog and digital time display',
    type: 'HTML',
    filename: 'clock_animation',
    tags: 'animation, clock, time, css, javascript',
    preview: 'https://via.placeholder.com/300x200/667eea/FFFFFF?text=Animated+Clock',
    created_by: 'admin@example.com',
    created_date: new Date('2024-01-15'),
    updated_date: new Date('2024-01-15')
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
  // Return only metadata, not content
  return ARTIFACTS_METADATA;
}

function getArtifact(id) {
  const metadata = ARTIFACTS_METADATA.find(a => a.id === id);
  if (!metadata) return null;
  
  // Load content from file when requested
  try {
    const content = HtmlService.createHtmlOutputFromFile(metadata.filename).getContent();
    return {
      ...metadata,
      content: content
    };
  } catch(e) {
    console.error('Error loading artifact content:', e);
    return {
      ...metadata,
      content: '<p>Error loading content</p>'
    };
  }
}

function searchArtifacts(query) {
  if (!query) return ARTIFACTS_METADATA;
  
  const lowerQuery = query.toLowerCase();
  return ARTIFACTS_METADATA.filter(artifact => 
    artifact.title.toLowerCase().includes(lowerQuery) ||
    artifact.description.toLowerCase().includes(lowerQuery) ||
    artifact.tags.toLowerCase().includes(lowerQuery) ||
    artifact.type.toLowerCase().includes(lowerQuery)
  );
}