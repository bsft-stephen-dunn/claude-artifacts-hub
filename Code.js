// Code.gs - Main Google Apps Script file
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
      
    case 'add':
      // Redirect to home since we now use a modal
      return redirectToHome();
        
    case 'search':
      return HtmlService.createTemplateFromFile('search').evaluate()
        .setTitle('Search Artifacts')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
        
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

// Initialize Google Sheet for artifact storage
function initializeSheet() {
  try {
    const sheet = SpreadsheetApp.openById(getSheetId());
    return sheet;
  } catch (e) {
    // Create new sheet if doesn't exist
    const ss = SpreadsheetApp.create('Claude Artifacts Database');
    const sheet = ss.getActiveSheet();
    sheet.setName('Artifacts');
    
    // Set headers
    const headers = ['ID', 'Title', 'Description', 'Type', 'Content', 'Tags', 'Created By', 'Created Date', 'Updated Date'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Store sheet ID in script properties
    PropertiesService.getScriptProperties().setProperty('SHEET_ID', ss.getId());
    
    return sheet;
  }
}

function getSheetId() {
  let sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!sheetId) {
    // Initialize new sheet
    initializeSheet();
    sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  }
  return sheetId;
}

// API Functions for artifact management
function getArtifacts() {
  try {
    const sheet = SpreadsheetApp.openById(getSheetId()).getSheetByName('Artifacts');
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) return []; // No data besides headers
    
    const headers = data[0];
    const artifacts = [];
    
    for (let i = 1; i < data.length; i++) {
      const artifact = {};
      headers.forEach((header, index) => {
        artifact[header.toLowerCase().replace(' ', '_')] = data[i][index];
      });
      artifacts.push(artifact);
    }
    
    return artifacts.reverse(); // Most recent first
  } catch (e) {
    console.error('Error getting artifacts:', e);
    return [];
  }
}

function getArtifact(id) {
  const artifacts = getArtifacts();
  return artifacts.find(artifact => artifact.id === id) || null;
}

function addArtifact(artifactData) {
  try {
    const sheet = SpreadsheetApp.openById(getSheetId()).getSheetByName('Artifacts');
    const id = Utilities.getUuid();
    const now = new Date();
    const userEmail = Session.getActiveUser().getEmail();
    
    const newRow = [
      id,
      artifactData.title,
      artifactData.description,
      artifactData.type,
      artifactData.content,
      artifactData.tags,
      userEmail,
      now,
      now
    ];
    
    sheet.appendRow(newRow);
    return { success: true, id: id };
  } catch (e) {
    console.error('Error adding artifact:', e);
    return { success: false, error: e.toString() };
  }
}

function searchArtifacts(query) {
  const artifacts = getArtifacts();
  if (!query) return artifacts;
  
  const lowerQuery = query.toLowerCase();
  return artifacts.filter(artifact => 
    artifact.title.toLowerCase().includes(lowerQuery) ||
    artifact.description.toLowerCase().includes(lowerQuery) ||
    artifact.tags.toLowerCase().includes(lowerQuery) ||
    artifact.type.toLowerCase().includes(lowerQuery)
  );
}

function deleteArtifact(id) {
  try {
    const sheet = SpreadsheetApp.openById(getSheetId()).getSheetByName('Artifacts');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === id) { // ID is in first column
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    
    return { success: false, error: 'Artifact not found' };
  } catch (e) {
    console.error('Error deleting artifact:', e);
    return { success: false, error: e.toString() };
  }
}