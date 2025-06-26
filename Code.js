// Code.gs - Main Google Apps Script file
// Artifacts are now stored in-memory as a static array

// Static array of artifacts - add new artifacts here
const ARTIFACTS = [
  {
    id: '1',
    title: 'Rails Database Force-Directed Graph',
    description: 'Interactive visualization of Rails database relationships using D3.js force-directed graph',
    type: 'HTML',
    content: '', // Will be populated below
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
      
    case 'add':
      // Redirect to home since add functionality is removed
      return redirectToHome();
        
    case 'search':
      // Redirect to home since search functionality is removed
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
  return ARTIFACTS;
}

function getArtifact(id) {
  return ARTIFACTS.find(artifact => artifact.id === id) || null;
}

function searchArtifacts(query) {
  if (!query) return ARTIFACTS;
  
  const lowerQuery = query.toLowerCase();
  return ARTIFACTS.filter(artifact => 
    artifact.title.toLowerCase().includes(lowerQuery) ||
    artifact.description.toLowerCase().includes(lowerQuery) ||
    artifact.tags.toLowerCase().includes(lowerQuery) ||
    artifact.type.toLowerCase().includes(lowerQuery)
  );
}

// Helper function to add artifacts to the static array
// Call this from the script editor to add new artifacts
function addStaticArtifact(title, description, htmlContent, tags) {
  const newArtifact = {
    id: (ARTIFACTS.length + 1).toString(),
    title: title,
    description: description || 'HTML Artifact',
    type: 'HTML',
    content: htmlContent,
    tags: tags || '',
    created_by: 'admin@example.com',
    created_date: new Date(),
    updated_date: new Date()
  };
  
  // This won't persist between script runs - you need to manually add to ARTIFACTS array above
  console.log('Add this to ARTIFACTS array:', JSON.stringify(newArtifact, null, 2));
  return newArtifact;
}

// Initialize the Rails Graph artifact content
ARTIFACTS[0].content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rails Database Force-Directed Graph</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        
        #graph {
            width: 100vw;
            height: 100vh;
            background-color: #f5f5f5;
        }
        
        .node {
            cursor: pointer;
        }
        
        .node circle {
            stroke: #fff;
            stroke-width: 2px;
        }
        
        .node text {
            font-size: 12px;
            pointer-events: none;
        }
        
        .link {
            stroke: #999;
            stroke-opacity: 0.6;
            stroke-width: 1px;
            marker-end: url(#arrowhead);
        }
        
        .link.belongs-to {
            stroke: #4CAF50;
            stroke-width: 2px;
        }
        
        .link.has-many {
            stroke: #2196F3;
            stroke-width: 1.5px;
        }
        
        .link.has-one {
            stroke: #FF9800;
            stroke-width: 1.5px;
        }
        
        .tooltip {
            position: absolute;
            text-align: left;
            padding: 10px;
            font-size: 12px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 5px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        #legend {
            position: absolute;
            top: 20px;
            left: 20px;
            background: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .legend-item {
            margin: 5px 0;
            display: flex;
            align-items: center;
        }
        
        .legend-line {
            width: 30px;
            height: 3px;
            margin-right: 10px;
            display: inline-block;
        }
        
        #search {
            position: absolute;
            top: 20px;
            right: 20px;
            padding: 10px;
            font-size: 14px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 200px;
        }
    </style>
</head>
<body>
    <div id="graph"></div>
    <div id="legend">
        <h4 style="margin: 0 0 10px 0;">Relationships</h4>
        <div class="legend-item">
            <span class="legend-line" style="background-color: #4CAF50;"></span>
            <span>belongs_to</span>
        </div>
        <div class="legend-item">
            <span class="legend-line" style="background-color: #2196F3;"></span>
            <span>has_many</span>
        </div>
        <div class="legend-item">
            <span class="legend-line" style="background-color: #FF9800;"></span>
            <span>has_one</span>
        </div>
    </div>
    <input type="text" id="search" placeholder="Search models...">
    <div class="tooltip"></div>

    <script>
        // Sample Rails database structure
        const data = {
            nodes: [
                { id: "User", group: 1, size: 30 },
                { id: "Post", group: 2, size: 25 },
                { id: "Comment", group: 3, size: 20 },
                { id: "Category", group: 4, size: 22 },
                { id: "Tag", group: 5, size: 18 },
                { id: "PostTag", group: 6, size: 15 },
                { id: "Profile", group: 1, size: 20 },
                { id: "Notification", group: 7, size: 18 },
                { id: "Like", group: 8, size: 16 },
                { id: "Subscription", group: 9, size: 18 }
            ],
            links: [
                { source: "User", target: "Post", type: "has-many", label: "has_many :posts" },
                { source: "Post", target: "User", type: "belongs-to", label: "belongs_to :user" },
                { source: "Post", target: "Comment", type: "has-many", label: "has_many :comments" },
                { source: "Comment", target: "Post", type: "belongs-to", label: "belongs_to :post" },
                { source: "Comment", target: "User", type: "belongs-to", label: "belongs_to :user" },
                { source: "User", target: "Comment", type: "has-many", label: "has_many :comments" },
                { source: "Post", target: "Category", type: "belongs-to", label: "belongs_to :category" },
                { source: "Category", target: "Post", type: "has-many", label: "has_many :posts" },
                { source: "Post", target: "PostTag", type: "has-many", label: "has_many :post_tags" },
                { source: "PostTag", target: "Post", type: "belongs-to", label: "belongs_to :post" },
                { source: "PostTag", target: "Tag", type: "belongs-to", label: "belongs_to :tag" },
                { source: "Tag", target: "PostTag", type: "has-many", label: "has_many :post_tags" },
                { source: "User", target: "Profile", type: "has-one", label: "has_one :profile" },
                { source: "Profile", target: "User", type: "belongs-to", label: "belongs_to :user" },
                { source: "User", target: "Notification", type: "has-many", label: "has_many :notifications" },
                { source: "Notification", target: "User", type: "belongs-to", label: "belongs_to :user" },
                { source: "User", target: "Like", type: "has-many", label: "has_many :likes" },
                { source: "Post", target: "Like", type: "has-many", label: "has_many :likes" },
                { source: "Like", target: "User", type: "belongs-to", label: "belongs_to :user" },
                { source: "Like", target: "Post", type: "belongs-to", label: "belongs_to :post" },
                { source: "User", target: "Subscription", type: "has-many", label: "has_many :subscriptions" },
                { source: "Category", target: "Subscription", type: "has-many", label: "has_many :subscriptions" },
                { source: "Subscription", target: "User", type: "belongs-to", label: "belongs_to :user" },
                { source: "Subscription", target: "Category", type: "belongs-to", label: "belongs_to :category" }
            ]
        };

        // Set up SVG
        const width = window.innerWidth;
        const height = window.innerHeight;

        const svg = d3.select("#graph")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Define arrow markers
        svg.append("defs").append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "-0 -5 10 10")
            .attr("refX", 20)
            .attr("refY", 0)
            .attr("orient", "auto")
            .attr("markerWidth", 8)
            .attr("markerHeight", 8)
            .attr("xoverflow", "visible")
            .append("svg:path")
            .attr("d", "M 0,-5 L 10 ,0 L 0,5")
            .attr("fill", "#999")
            .style("stroke", "none");

        // Create force simulation
        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(d => d.size + 10));

        // Create tooltip
        const tooltip = d3.select(".tooltip");

        // Create links
        const link = svg.append("g")
            .selectAll("line")
            .data(data.links)
            .enter().append("line")
            .attr("class", d => \`link \${d.type}\`);

        // Create nodes
        const node = svg.append("g")
            .selectAll("g")
            .data(data.nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // Add circles to nodes
        node.append("circle")
            .attr("r", d => d.size)
            .attr("fill", d => d3.schemeCategory10[d.group % 10]);

        // Add labels to nodes
        node.append("text")
            .text(d => d.id)
            .attr("x", 0)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .attr("font-weight", "bold");

        // Add hover effects
        node.on("mouseover", function(event, d) {
            // Show tooltip
            const connections = data.links.filter(l => l.source.id === d.id || l.target.id === d.id);
            let tooltipHtml = \`<strong>\${d.id}</strong><br><br>Relationships:<br>\`;
            connections.forEach(c => {
                tooltipHtml += \`\${c.label}<br>\`;
            });
            
            tooltip.html(tooltipHtml)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px")
                .style("opacity", 1);
            
            // Highlight connected nodes
            link.style("stroke-opacity", l => 
                l.source.id === d.id || l.target.id === d.id ? 1 : 0.1
            );
            
            node.style("opacity", n => {
                const isConnected = connections.some(c => 
                    c.source.id === n.id || c.target.id === n.id
                );
                return n.id === d.id || isConnected ? 1 : 0.3;
            });
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
            link.style("stroke-opacity", 0.6);
            node.style("opacity", 1);
        });

        // Update positions on tick
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("transform", d => \`translate(\${d.x},\${d.y})\`);
        });

        // Drag functions
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        // Search functionality
        document.getElementById("search").addEventListener("input", function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            node.style("opacity", d => {
                if (!searchTerm) return 1;
                return d.id.toLowerCase().includes(searchTerm) ? 1 : 0.3;
            });
            
            link.style("stroke-opacity", l => {
                if (!searchTerm) return 0.6;
                return l.source.id.toLowerCase().includes(searchTerm) || 
                       l.target.id.toLowerCase().includes(searchTerm) ? 0.6 : 0.1;
            });
        });

        // Handle window resize
        window.addEventListener("resize", () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            
            svg.attr("width", newWidth).attr("height", newHeight);
            simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 2));
            simulation.alpha(0.3).restart();
        });
    </script>
</body>
</html>`;