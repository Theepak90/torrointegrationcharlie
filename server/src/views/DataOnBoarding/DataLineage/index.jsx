import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

import DataSetNode from '../CustomNode/DataSetNode';
import DataJobNode from '../CustomNode/DataJobNode';

let nodeId = 5;
const getId = () => `${nodeId++}`;
const nodeOrigin = [0.5, 0];

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const DataLineage = ({ graphData }) => {
  const reactFlowWrapper = useRef(null);

  const { screenToFlowPosition, getNodes, fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodesMeasured, setNodesMeasured] = useState(false);

  useEffect(() => {
    const initialNodes = graphData.nodes.map(node => ({
      id: node.id,
      position: { x: 0, y: 0 },
      data: {
        label: node.name,
        type: node.type,
        parameter: node,
      },
      type: node.type,
      sourcePosition: 'right',
      targetPosition: 'left',
    }));

    const newEdges = graphData.edges.map(e => ({
      id: `${e.source}-${e.target}`,
      source: e.source,
      target: e.target,
      sourceHandle: 'source',
      targetHandle: 'target',
    }));

    setNodes(initialNodes);
    setEdges(newEdges);
    setNodesMeasured(false);
  }, [graphData]);

  const calculateLayout = useCallback(() => {
    const allNodes = getNodes();
    const allMeasured = allNodes.every(node => node.measured);

    if (allMeasured) {
      dagreGraph.setGraph({ rankdir: 'LR' });
      allNodes.forEach(node => {
        dagreGraph.setNode(node.id, {
          width: node.measured.width,
          height: node.measured.height,
        });
      });

      edges.forEach(edge => {
        dagreGraph.setEdge(edge.source, edge.target);
      });
      dagre.layout(dagreGraph);
      const newNodes = allNodes.map(node => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
          ...node,
          position: {
            x: nodeWithPosition.x,
            y: nodeWithPosition.y,
          },
        };
      });

      setNodes(newNodes);
      fitView();
      setNodesMeasured(true);
    }
  }, [edges, getNodes, setNodes, fitView]);

  useEffect(() => {
    if (!nodesMeasured) {
      const interval = setInterval(calculateLayout, 100);
      return () => clearInterval(interval);
    }
  }, [calculateLayout, nodesMeasured]);

  const onConnect = useCallback(
    params => setEdges(eds => addEdge(params, eds)),
    [setEdges]
  );

  const onConnectEnd = useCallback(
    (event, connectionState) => {
      if (!connectionState.isValid) {
        const id = getId();
        const { clientX, clientY } =
          'changedTouches' in event ? event.changedTouches[0] : event;
        const newNode = {
          id,
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          data: { label: `New Node ${id}` },
          draggable: true,
          origin: nodeOrigin,
          sourcePosition: 'right',
          targetPosition: 'left',
        };
        setNodes(nds => nds.concat(newNode));
        setEdges(eds =>
          eds.concat({
            id: `e-${connectionState.fromNode.id}-${id}`,
            source: connectionState.fromNode.id,
            target: id,
            label: 'New Connection',
          })
        );
        setNodesMeasured(false);
      }
    },
    [screenToFlowPosition, setNodes, setEdges]
  );

  return (
    <div
      className='wrapper'
      ref={reactFlowWrapper}
      style={{ width: '100%', height: '500px' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        fitView
        nodeOrigin={nodeOrigin}
        nodeTypes={{
          DATA_JOB: DataJobNode,
          DATASET: DataSetNode,
        }}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

const DataLineageWithProvider = ({ graphData }) => (
  <ReactFlowProvider>
    <DataLineage graphData={graphData} />
  </ReactFlowProvider>
);

export default DataLineageWithProvider;
