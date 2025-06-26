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

function doGet(e) {
  const page = e.parameter.page || 'home';
  const artifactId = e.parameter.id;
  
  if (page === 'view' && artifactId) {
    // Serve artifact HTML directly
    const artifact = ARTIFACTS.find(a => a.id === artifactId);
    if (artifact) {
      return HtmlService.createHtmlOutputFromFile(artifact.filename)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }
  }
  
  // Default to home page
  return HtmlService.createTemplateFromFile('home')
    .evaluate()
    .setTitle('Claude Artifacts Hub')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getArtifacts() {
  return ARTIFACTS;
}