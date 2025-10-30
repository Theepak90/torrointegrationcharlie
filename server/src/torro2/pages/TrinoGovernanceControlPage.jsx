import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Chip, Button, CircularProgress, Alert, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Refresh, Security, TableChart } from '@mui/icons-material';

const TrinoGovernanceControlPage = () => {
  const [governanceData, setGovernanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadGovernanceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/starburst/governance-control');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setGovernanceData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGovernanceData(); }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Card><CardContent sx={{ p: 4, textAlign: 'center' }}><CircularProgress sx={{ mb: 2 }} /><Typography variant="h6">Loading Governance Control Data...</Typography></CardContent></Card>
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Card><CardContent sx={{ p: 4 }}><Alert severity="error" sx={{ mb: 2 }}>Failed to Load Governance Data: {error}</Alert><Button variant="contained" onClick={loadGovernanceData} startIcon={<Refresh />}>Retry</Button></CardContent></Card>
      </Box>
    );
  }
  if (!governanceData) return null;

  return (
    <Box sx={{ p: 1 }}>
      <Card sx={{ borderRadius: 2, maxWidth: '95%', mx: 'auto' }}>
        <CardContent sx={{ p: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#1976d2' }}>🔐 Trino Governance Control</Typography>
            <Button variant="outlined" startIcon={<Refresh />} onClick={loadGovernanceData} disabled={loading}>Refresh</Button>
          </Box>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}><Card sx={{ bgcolor: '#1976d2', color: 'white' }}><CardContent><Typography variant="h3" sx={{ fontWeight: 700 }}>{governanceData.total_roles}</Typography><Typography variant="h6">Total Roles</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={4}><Card sx={{ bgcolor: '#00D4AA', color: 'white' }}><CardContent><Typography variant="h3" sx={{ fontWeight: 700 }}>{governanceData.total_users}</Typography><Typography variant="h6">Total Users</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={4}><Card sx={{ bgcolor: '#f57c00', color: 'white' }}><CardContent><Typography variant="h3" sx={{ fontWeight: 700 }}>{governanceData.total_assets_with_rbac}</Typography><Typography variant="h6">Protected Assets</Typography></CardContent></Card></Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>📊 Roles Overview</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead><TableRow><TableCell sx={{ fontWeight: 600 }}>Role Name</TableCell><TableCell sx={{ fontWeight: 600 }} align="right">Users</TableCell><TableCell sx={{ fontWeight: 600 }} align="right">Assets Access</TableCell><TableCell sx={{ fontWeight: 600 }}>Status</TableCell></TableRow></TableHead>
                      <TableBody>
                        {governanceData.roles.slice(0, 6).map((role) => (
                          <TableRow key={role.role_name} hover>
                            <TableCell><Box sx={{ display: 'flex', alignItems: 'center' }}><Security sx={{ mr: 1, fontSize: 20, color: '#1976d2' }} /><strong>{role.role_name}</strong></Box></TableCell>
                            <TableCell align="right"><Chip label={role.users.length} color="primary" size="small" /></TableCell>
                            <TableCell align="right"><Chip label={role.asset_permissions.length} color="secondary" size="small" /></TableCell>
                            <TableCell><Chip label={role.users.length > 0 ? 'Active' : 'Orphaned'} color={role.users.length > 0 ? 'success' : 'warning'} size="small" /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>🔝 Most Accessible Assets</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[...governanceData.assets_permissions].sort((a, b) => b.roles_with_access.length - a.roles_with_access.length).slice(0, 4).map((asset, idx) => (
                      <Box key={idx} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{asset.asset_name}</Typography>
                        <Typography variant="caption" color="text.secondary">{asset.catalog}.{asset.schema}</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip label={`${asset.roles_with_access.length} roles`} size="small" />
                          {asset.privilege_type.map((priv, pidx) => (<Chip key={pidx} label={priv} size="small" color="success" variant="outlined" />))}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TrinoGovernanceControlPage;


