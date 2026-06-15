import { useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { motion } from 'framer-motion';
import { generateGraph } from '../utils/generateGraph';

function GraphView({ notes, currentTitle, onSelectNote }) {
  const graphData = useMemo(() => generateGraph(notes), [notes]);

  return (
    <motion.section
      className="graph-view glass-card"
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="panel-heading graph-heading">
        <div>
          <p className="eyebrow">Knowledge Map</p>
          <h2>Note Graph</h2>
        </div>
        <p className="muted">Click a node to open that note.</p>
      </div>

      <ForceGraph2D
        graphData={graphData}
        height={560}
        backgroundColor="rgba(0,0,0,0)"
        nodeLabel="name"
        nodeColor={(node) => (node.id === currentTitle ? '#f8d66d' : '#8be9fd')}
        linkColor={() => 'rgba(255,255,255,0.28)'}
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        onNodeClick={(node) => onSelectNote(node.id)}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 13 / globalScale;
          ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
          ctx.fillStyle = node.id === currentTitle ? '#f8d66d' : '#8be9fd';
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.id === currentTitle ? 7 : 5, 0, 2 * Math.PI, false);
          ctx.fill();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
          ctx.fillText(label, node.x + 8, node.y + 4);
        }}
      />
    </motion.section>
  );
}

export default GraphView;
