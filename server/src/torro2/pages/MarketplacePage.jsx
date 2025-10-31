// Copied from torro2 MarketplacePage (trimmed to essential behavior)
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Snackbar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Search, Label, TableChart, ArrowDropDown, Delete, Publish, Security } from '@mui/icons-material';

const MarketplacePage = () => {
  const [resourceType, setResourceType] = useState('GCP');
  const [gcpProject, setGcpProject] = useState('');
  const [dataset, setDataset] = useState('');
  const [tableName, setTableName] = useState('');
  const [catalog, setCatalog] = useState('');
  const [schema, setSchema] = useState('');
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState(null);
  const [existingTags, setExistingTags] = useState([]);
  const [tagMenuAnchor, setTagMenuAnchor] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [tableTagDialogOpen, setTableTagDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [columnTagDialogOpen, setColumnTagDialogOpen] = useState(false);
  const [selectedColumnForTag, setSelectedColumnForTag] = useState(null);

  useEffect(() => {
    setGcpProject(''); setDataset(''); setTableName(''); setCatalog(''); setSchema(''); setTableData(null);
  }, [resourceType]);

  const fetchExistingTags = async () => {
    try {
      const apiUrl = resourceType === 'GCP' ? 'http://localhost:8000/api/bigquery/all-tags' : resourceType === 'Starburst Galaxy' ? 'http://localhost:8000/api/starburst/all-tags' : '';
      if (!apiUrl) return;
      const response = await fetch(apiUrl);
      const data = await response.json();
      setExistingTags(data.tags || []);
    } catch (err) {}
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      let response;
      if (resourceType === 'GCP') {
        response = await fetch('http://localhost:8000/api/bigquery/table-details', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId: gcpProject, datasetId: dataset, tableId: tableName }) });
      } else if (resourceType === 'Starburst Galaxy') {
        response = await fetch('http://localhost:8000/api/starburst/table-details', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ catalog, schema, tableId: tableName }) });
      } else {
        setLoading(false);
        return;
      }
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setTableData(data);
      setLoading(false);
      fetchExistingTags();
    } catch (err) {
      setLoading(false);
      setSnackbarMessage('Failed to fetch table details');
      setSnackbarOpen(true);
    }
  };

  const handleOpenTagMenu = (e) => setTagMenuAnchor(e.currentTarget);
  const handleCloseTagMenu = () => setTagMenuAnchor(null);
  const handleAddTableTag = () => { setTableTagDialogOpen(true); };
  const handleAddColumnTag = (columnName) => { setSelectedColumnForTag(columnName); setColumnTagDialogOpen(true); };
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (selectedColumnForTag) {
      const updatedColumns = tableData.columns.map((column) =>
        column.name === selectedColumnForTag
          ? { ...column, tags: [...(column.tags || []), newTag.trim()] }
          : column
      );
      setTableData({ ...tableData, columns: updatedColumns });
      setSelectedColumnForTag(null);
      setColumnTagDialogOpen(false);
    } else {
      const updated = { ...tableData, tableTags: [...(tableData.tableTags || []), newTag.trim()] };
      setTableData(updated);
      setTableTagDialogOpen(false);
    }
    setNewTag('');
  };

  const handleRemoveTag = (columnName, tagToRemove) => {
    setTableData({
      ...tableData,
      columns: tableData.columns.map((column) =>
        column.name === columnName
          ? { ...column, tags: (column.tags || []).filter((tag) => tag !== tagToRemove) }
          : column
      ),
    });
  };

  const handlePublishTags = async () => {
    if (!tableData) return;
    try {
      const body = resourceType === 'GCP' ? { projectId: gcpProject, datasetId: dataset, tableId: tableName, columns: tableData.columns.map(c => ({ name: c.name, tags: c.tags || [] })), tableTags: tableData.tableTags || [] } : { catalog, schema, tableId: tableName, columnTags: tableData.columns.map(c => ({ columnName: c.name, tags: c.tags || [] })), tableTag: (tableData.tableTags || [])[0] || null };
      const url = resourceType === 'GCP' ? 'http://localhost:8000/api/bigquery/publish-tags' : 'http://localhost:8000/api/starburst/publish-tags';
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await res.json();
      setSnackbarMessage(result.message || (res.ok ? 'Published' : 'Failed'));
      setSnackbarOpen(true);
    } catch (e) {
      setSnackbarMessage('Failed to publish tags');
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', p: 3, bgcolor: '#fafafa' }}>
      <Card sx={{ width: '100%', borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#1976d2', mb: 4 }}>
            Publish Data Assets to Marketplace
          </Typography>
          <FormControl component="fieldset" sx={{ mb: 4 }}>
            <FormLabel component="legend" sx={{ color: '#1976d2', fontWeight: 600, mb: 2, fontSize: '1rem' }}>
              Resource Type *
            </FormLabel>
            <RadioGroup value={resourceType} onChange={(e) => setResourceType(e.target.value)} row sx={{ gap: 2 }}>
              <FormControlLabel value="GCP" control={<Radio />} label="GCP" />
              <FormControlLabel value="Starburst Galaxy" control={<Radio />} label="Starburst Galaxy" />
              <FormControlLabel value="Azure Purview" control={<Radio />} label="Azure Purview" />
            </RadioGroup>
          </FormControl>

          {resourceType === 'GCP' && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={5}><FormControl fullWidth><Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600, mb: 1 }}>GCP Project *</Typography><TextField fullWidth placeholder="GCP Project" value={gcpProject} onChange={(e) => setGcpProject(e.target.value)} size="small" /></FormControl></Grid>
              <Grid item xs={12} sm={5}><FormControl fullWidth><Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600, mb: 1 }}>Dataset *</Typography><TextField fullWidth placeholder="Dataset" value={dataset} onChange={(e) => setDataset(e.target.value)} size="small" /></FormControl></Grid>
              <Grid item xs={12} sm={5}><FormControl fullWidth><Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600, mb: 1 }}>Table name *</Typography><TextField fullWidth placeholder="Table" value={tableName} onChange={(e) => setTableName(e.target.value)} size="small" /></FormControl></Grid>
            </Grid>
          )}

          {resourceType === 'Starburst Galaxy' && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={5}><FormControl fullWidth><Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600, mb: 1 }}>Catalog *</Typography><TextField fullWidth placeholder="Catalog" value={catalog} onChange={(e) => setCatalog(e.target.value)} size="small" /></FormControl></Grid>
              <Grid item xs={12} sm={5}><FormControl fullWidth><Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600, mb: 1 }}>Schema *</Typography><TextField fullWidth placeholder="Schema" value={schema} onChange={(e) => setSchema(e.target.value)} size="small" /></FormControl></Grid>
              <Grid item xs={12} sm={5}><FormControl fullWidth><Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600, mb: 1 }}>Table name *</Typography><TextField fullWidth placeholder="Table" value={tableName} onChange={(e) => setTableName(e.target.value)} size="small" /></FormControl></Grid>
            </Grid>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button variant="outlined" startIcon={<Search />} onClick={handleSearch} disabled={loading}>{loading ? 'Searching...' : 'Search'}</Button>
            {tableData && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" startIcon={<Label />} endIcon={<ArrowDropDown />} onClick={handleOpenTagMenu}>Add Tags</Button>
                <Menu anchorEl={tagMenuAnchor} open={Boolean(tagMenuAnchor)} onClose={handleCloseTagMenu}>
                  <MenuItem onClick={() => setTableTagDialogOpen(true)}><ListItemIcon><Label fontSize="small" /></ListItemIcon><ListItemText>Add Table Tags</ListItemText></MenuItem>
                </Menu>
                <Button variant="contained" startIcon={<Publish />} onClick={handlePublishTags}>Publish</Button>
              </Box>
            )}
          </Box>

          {tableData && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Table: {tableData.tableName || tableData.tableId || tableData.table}
              </Typography>
              {tableData.tableTags && tableData.tableTags.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {tableData.tableTags.map((tag, idx) => (
                    <Chip
                      key={`${tag}-${idx}`}
                      label={tag}
                      size="small"
                      onDelete={() => {
                        const updated = tableData.tableTags.filter((_, index) => index !== idx);
                        setTableData({ ...tableData, tableTags: updated });
                      }}
                      deleteIcon={<Delete fontSize="small" />}
                      sx={{ backgroundColor: '#e3f2fd', color: '#1565c0', border: '1px solid #90caf9', fontWeight: 600 }}
                    />
                  ))}
                </Box>
              )}
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Column</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Mode</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Tags</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">
                        <Button variant="outlined" size="small" startIcon={<Label />} onClick={handleAddTableTag}>
                          Add Table Tag
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.columns.map((column) => (
                      <TableRow key={column.name} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{column.name}</TableCell>
                        <TableCell><Chip label={column.type} size="small" variant="outlined" /></TableCell>
                        <TableCell>
                          <Chip
                            label={column.mode}
                            size="small"
                            color={column.mode === 'REQUIRED' ? 'error' : 'default'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {(column.tags || []).length === 0 && (
                              <Typography variant="body2" color="text.secondary">
                                None
                              </Typography>
                            )}
                            {(column.tags || []).map((tag) => (
                              <Chip
                                key={`${column.name}-${tag}`}
                                label={tag}
                                size="small"
                                onDelete={() => handleRemoveTag(column.name, tag)}
                                deleteIcon={<Delete fontSize="small" />}
                                sx={{ backgroundColor: '#e3f2fd', color: '#1565c0', border: '1px solid #90caf9', fontWeight: 600 }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Button variant="outlined" size="small" startIcon={<TableChart />} onClick={() => handleAddColumnTag(column.name)}>
                            Add Column Tag
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog open={tableTagDialogOpen} onClose={() => setTableTagDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Table Tag</DialogTitle>
        <DialogContent>
          <Autocomplete freeSolo options={existingTags} value={newTag} onInputChange={(e, v) => setNewTag(v)} renderInput={(params) => (<TextField {...params} label="Tag Name" placeholder="Enter tag" variant="outlined" onKeyPress={(e) => { if (e.key === 'Enter') handleAddTag(); }} />)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTableTagDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddTag} variant="contained" disabled={!newTag.trim()}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={columnTagDialogOpen} onClose={() => { setColumnTagDialogOpen(false); setSelectedColumnForTag(null); setNewTag(''); }} maxWidth="sm" fullWidth>
        <DialogTitle>Add Tag to {selectedColumnForTag}</DialogTitle>
        <DialogContent>
          <Autocomplete
            freeSolo
            options={existingTags}
            value={newTag}
            onInputChange={(e, v) => setNewTag(v)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tag Name"
                placeholder="Enter tag"
                variant="outlined"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleAddTag();
                }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setColumnTagDialogOpen(false); setSelectedColumnForTag(null); setNewTag(''); }}>Cancel</Button>
          <Button onClick={handleAddTag} variant="contained" disabled={!newTag.trim()}>Add</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />
    </Box>
  );
};

export default MarketplacePage;


