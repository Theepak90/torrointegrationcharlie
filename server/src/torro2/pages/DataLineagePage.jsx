import React, { useState, useEffect } from 'react';
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, MarkerType, Panel } from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, Typography, Card, CardContent, Chip, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Autocomplete, Tabs, Tab } from '@mui/material';
import { Refresh, DataObject, Search, Close, AccountTree, FilterList, TableChart } from '@mui/icons-material';

const CustomNode = ({ data }) => {
  const isSelected = data.isSelected;
  return (
    <>
      <Box
        sx={{
          px: 3,
          py: 2,
          borderRadius: 1,
          border: '1px solid #ddd',
          backgroundColor: isSelected ? '#f5f5f5' : '#ffffff',
          minWidth: 200,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isSelected ? '0 0 0 2px #666' : '0 1px 3px rgba(0,0,0,0.1)',
          '&:hover': { boxShadow: isSelected ? '0 0 0 2px #666' : '0 2px 6px rgba(0,0,0,0.15)', transform: 'translateY(-1px)' },
        }}
        onClick={() => data.onNodeClick && data.onNodeClick(data.id)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <DataObject sx={{ fontSize: 18, color: '#666' }} />
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 14, color: '#333' }}>
            {data.name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip label={data.type || 'Unknown'} size="small" variant="outlined" sx={{ height: 24, fontSize: 11, borderColor: '#ccc', color: '#666', fontWeight: 500, minWidth: '50px' }} />
          <Chip label={data.source_system || data.connector_id || 'Unknown'} size="small" variant="outlined" sx={{ height: 24, fontSize: 10, borderColor: '#999', color: '#555', fontWeight: 500, minWidth: '60px', backgroundColor: '#f5f5f5', border: '1px solid #ddd' }} />
        </Box>
      </Box>
    </>
  );
};

const nodeTypes = { custom: CustomNode };

const DataLineagePage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [edgeDetailsOpen, setEdgeDetailsOpen] = useState(false);
  const [selectedAssetForLineage, setSelectedAssetForLineage] = useState(null);
  const [fullLineageData, setFullLineageData] = useState({ nodes: [], edges: [], rawData: { nodes: [], edges: [] } });
  const [selectedAssetDetails, setSelectedAssetDetails] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('basic');

  const fetchLineage = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8000/api/lineage');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setFullLineageData({ nodes: [], edges: [], rawData: data });
      const layoutedNodes = layoutNodes(data.nodes, data.edges);
      const flowNodes = layoutedNodes.map((node) => ({
        id: node.id,
        type: 'custom',
        position: node.position,
        sourcePosition: 'right',
        targetPosition: 'left',
        data: { label: node.name, name: node.name, type: node.type, catalog: node.catalog, connector_id: node.connector_id, source_system: node.source_system, id: node.id, onNodeClick: handleNodeClick },
      }));
      const flowEdges = data.edges.map((edge, index) => ({
        id: `edge-${index}`,
        source: edge.source,
        target: edge.target,
        type: 'smoothstep',
        animated: Boolean(edge.column_lineage && edge.column_lineage.length > 0),
        markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12, color: '#64b5f6' },
        style: { strokeWidth: 1, stroke: '#64b5f6', strokeDasharray: edge.column_lineage && edge.column_lineage.length > 0 ? '0' : '5,5', opacity: 0.8 },
        label: edge.relationship || 'feeds into',
        data: { column_lineage: edge.column_lineage || [] },
      }));
      setNodes(flowNodes);
      setEdges(flowEdges);
      setFullLineageData({ nodes: flowNodes, edges: flowEdges, rawData: data });
    } catch (err) {
      setError(`Failed to load lineage data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssets = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/assets?page=0&size=100');
      const data = await response.json();
      setAssets(Array.isArray(data.assets) ? data.assets : []);
    } catch (error) {
      setAssets([]);
    }
  };

  useEffect(() => {
    fetchLineage();
    fetchAssets();
  }, []);

  const layoutNodes = (nodes, edges) => {
    const levels = new Map();
    const childrenMap = new Map();
    nodes.forEach(n => childrenMap.set(n.id, []));
    edges.forEach(e => { if (childrenMap.has(e.source)) childrenMap.get(e.source).push(e.target); });
    const queue = nodes.filter(n => !edges.some(e => e.target === n.id)).map(n => ({ id: n.id, level: 0 }));
    const visited = new Set();
    while (queue.length) {
      const { id, level } = queue.shift();
      if (visited.has(id)) continue;
      visited.add(id);
      levels.set(id, level);
      (childrenMap.get(id) || []).forEach(child => queue.push({ id: child, level: level + 1 }));
    }
    const nodesByLevel = new Map();
    levels.forEach((level, id) => { if (!nodesByLevel.has(level)) nodesByLevel.set(level, []); nodesByLevel.get(level).push(id); });
    const levelSpacing = 250;
    const nodeSpacing = 150;
    return nodes.map(n => {
      const level = levels.get(n.id) || 0;
      const inLevel = nodesByLevel.get(level) || [];
      const x = level * levelSpacing;
      const y = (inLevel.indexOf(n.id) * nodeSpacing) - ((inLevel.length - 1) * nodeSpacing) / 2 + 300;
      return { ...n, position: { x, y } };
    });
  };

  const handleNodeClick = async (nodeId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/assets/${encodeURIComponent(nodeId)}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedAssetDetails(data);
        setActiveDetailTab('basic');
      }
    } catch (e) {}
  };

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = !searchTerm || node.data.name.toLowerCase().includes(searchTerm.toLowerCase()) || node.data.catalog.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || node.data.type === filterType;
    const matchesSource = filterSource === 'all' || node.data.source_system === filterSource;
    return matchesSearch && matchesType && matchesSource;
  });
  const filteredEdges = edges.filter(edge => filteredNodes.find(n => n.id === edge.source) && filteredNodes.find(n => n.id === edge.target));
  const uniqueTypes = [...new Set(fullLineageData.rawData?.nodes?.map(n => n.type) || [])];
  const uniqueSources = [...new Set(fullLineageData.rawData?.nodes?.map(n => n.source_system) || [])];
  const filteredRawNodes = fullLineageData.rawData?.nodes?.filter(node => {
    const matchesSearch = !searchTerm || node.name.toLowerCase().includes(searchTerm.toLowerCase()) || node.catalog.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || node.type === filterType;
    const matchesSource = filterSource === 'all' || node.source_system === filterSource;
    return matchesSearch && matchesType && matchesSource;
  }) || [];

  return (
    <Box sx={{ minHeight: '120vh', p: 4, pb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, fontFamily: 'Comfortaa', display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountTree sx={{ fontSize: 40, color: '#8FA0F5' }} />
            Data Lineage
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Visualize data flow and dependencies across your discovered assets
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Refresh />} onClick={fetchLineage} disabled={loading} sx={{ height: 40 }}>
          Refresh
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <Autocomplete
                options={filteredRawNodes.map(n => ({ id: n.id, label: `${n.name} (${n.type})`, name: n.name }))}
                value={filteredRawNodes.find(n => n.id === selectedAssetForLineage) ? { id: selectedAssetForLineage, label: filteredRawNodes.find(n => n.id === selectedAssetForLineage)?.name } : null}
                onChange={(event, newValue) => { setSelectedAssetForLineage(newValue ? newValue.id : null); }}
                renderInput={(params) => (
                  <TextField {...params} size="small" label="Focus on Asset" placeholder="Select asset to view its lineage and details..." InputProps={{ ...params.InputProps, startAdornment: (<><InputAdornment position="start"><AccountTree /></InputAdornment>{params.InputProps.startAdornment}</>) }} />
                )}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField fullWidth size="small" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) }} />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select value={filterType} label="Type" onChange={(e) => setFilterType(e.target.value)}>
                  <MenuItem value="all">All Types</MenuItem>
                  {uniqueTypes.map(type => (<MenuItem key={type} value={type}>{type}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Source</InputLabel>
                <Select value={filterSource} label="Source" onChange={(e) => setFilterSource(e.target.value)}>
                  <MenuItem value="all">All Sources</MenuItem>
                  {uniqueSources.map(source => (<MenuItem key={source} value={source}>{source}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ position: 'relative', height: '700px', mb: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
            <Alert severity="error" sx={{ maxWidth: 600 }}>{error}</Alert>
          </Box>
        ) : filteredNodes.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
            <Alert severity="info" sx={{ maxWidth: 600 }}>
              <Typography variant="h6" gutterBottom>
                Select an Asset to View Lineage
              </Typography>
              <Typography variant="body2">
                Use the dropdown above to select a data asset (Table or View) and see its data lineage
              </Typography>
            </Alert>
          </Box>
        ) : (
          <ReactFlow nodes={filteredNodes} edges={filteredEdges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} nodeTypes={nodeTypes} fitView attributionPosition="bottom-left">
            <Background color="#aaa" gap={16} />
            <Controls />
            <MiniMap nodeColor={(node) => node.data.type === 'View' ? '#8FA0F5' : '#4caf50'} maskColor="rgba(0, 0, 0, 0.1)" />
            <Panel position="top-right">
              <Card sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Legend
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, backgroundColor: '#ffffff', border: '1px solid #ddd', borderRadius: 0.5 }} />
                    <Typography variant="caption">Table</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, backgroundColor: '#ffffff', border: '1px solid #ddd', borderRadius: 0.5 }} />
                    <Typography variant="caption">View</Typography>
                  </Box>
                </Box>
              </Card>
            </Panel>
          </ReactFlow>
        )}
      </Card>
    </Box>
  );
};

export default DataLineagePage;


