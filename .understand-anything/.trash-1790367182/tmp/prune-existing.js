const fs = require('fs');
const path = require('path');

const graphPath = process.argv[2];
const changedFilesPath = process.argv[3];
const outputPath = process.argv[4];

try {
  const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
  const changedFiles = fs.readFileSync(changedFilesPath, 'utf-8')
    .split('\n')
    .filter(l => l.trim())
    .map(l => l.replace(/^.*\//, '').replace(/\\/g, '/'))
    .filter(l => /\.(ts|tsx|js|jsx|html|json|md|sql)$/.test(l));
  
  console.log(`Read ${changedFiles.length} changed files, ${graph.nodes.length} existing nodes, ${graph.edges.length} existing edges`);
  
  // Find nodes in changed files
  const changedNodeIds = new Set();
  graph.nodes.forEach(node => {
    if (!node.filePath) return;
    const nodePath = node.filePath.replace(/\\/g, '/');
    if (changedFiles.some(cf => nodePath.endsWith(cf) || nodePath === cf)) {
      changedNodeIds.add(node.id);
    }
  });
  
  // Filter out changed nodes
  const prunedNodes = graph.nodes.filter(n => !changedNodeIds.has(n.id));
  
  // Filter out edges referencing changed nodes
  const prunedEdges = graph.edges.filter(e => 
    !changedNodeIds.has(e.source) && !changedNodeIds.has(e.target)
  );
  
  console.log(`Pruned ${changedNodeIds.size} nodes, kept ${prunedNodes.length} nodes`);
  console.log(`Kept ${prunedEdges.length} edges`);
  
  const output = {
    nodes: prunedNodes,
    edges: prunedEdges
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`Wrote batch-existing.json`);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
