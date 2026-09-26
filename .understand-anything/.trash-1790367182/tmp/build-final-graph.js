const fs = require('fs');
const projectRoot = process.argv[2];

const assembled = JSON.parse(fs.readFileSync(`${projectRoot}/.understand-anything/intermediate/assembled-graph.json`, 'utf8'));
const layers = JSON.parse(fs.readFileSync(`${projectRoot}/.understand-anything/tmp/layers-normalized.json`, 'utf8'));
const tour = JSON.parse(fs.readFileSync(`${projectRoot}/.understand-anything/tmp/tour-normalized.json`, 'utf8'));

const finalGraph = {
  version: "1.0.0",
  project: {
    name: process.argv[3],
    languages: JSON.parse(process.argv[4]),
    frameworks: JSON.parse(process.argv[5]),
    description: process.argv[6],
    analyzedAt: process.argv[7],
    gitCommitHash: process.argv[8]
  },
  nodes: assembled.nodes || [],
  edges: assembled.edges || [],
  layers: Array.isArray(layers) ? layers : [],
  tour: Array.isArray(tour) ? tour : []
};

fs.writeFileSync(`${projectRoot}/.understand-anything/intermediate/final-graph.json`, JSON.stringify(finalGraph, null, 2));
console.log(`Final graph: ${finalGraph.nodes.length} nodes, ${finalGraph.edges.length} edges, ${finalGraph.layers.length} layers, ${finalGraph.tour.length} tour steps`);
