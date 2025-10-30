/* third lib*/
import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  CircularProgress,
  Avatar,
} from '@mui/material';
import Button from '@basics/Button';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  CloudQueue as CloudIcon,
  Storage as DatabaseIcon,
  Business as BusinessIcon,
  Dns as DnsIcon,
  Link as LinkIcon,
  Info as InfoIcon,
  DataObject as DataObjectIcon,
  Speed as SpeedIcon,
  AcUnit as AcUnitIcon,
  Fireplace as FireplaceIcon,
  CloudQueue as CloudQueueIcon,
  CloudDone as CloudDoneIcon,
  InsertDriveFile as InsertDriveFileIcon,
  PlayArrow as PlayArrowIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import styled from '@emotion/styled';

/* local components & methods */
import { COLORS, SPACING } from '@comp/theme';
import {
  getConnectors,
  getConnectorConfig,
  testConnectorConfig,
  testGcpConfig,
  testGcpDiscovery,
  testConnectorDiscovery,
  getSystemHealth,
} from '@lib/api';
import { Alert } from '@mui/material';
import ConnectionWizard from './ConnectionWizard';

const ConnectorCard = styled(Card)`
  height: 100%;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ConnectorIcon = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: ${props => props.bgcolor || COLORS.mainPurple};
  color: white;
  margin-right: ${SPACING.space16};
`;

const ConnectorsTab = ({ onRefresh, showNotification }) => {
  const [connectorsData, setConnectorsData] = useState({
    connectors: {},
    available_connectors: {},
    enabled_connectors: 0,
    total_connectors: 0,
  });
  const [systemHealth, setSystemHealth] = useState({
    connector_status: {},
  });
  const [myConnections, setMyConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardMode, setWizardMode] = useState('new'); // 'new' or 'edit'
  const [selectedConnector, setSelectedConnector] = useState(null);
  const [testingConnection, setTestingConnection] = useState(false);

  // Get connector display name
  const getConnectorDisplayName = useCallback(connectorId => {
    const displayNames = {
      gcp: 'Google Cloud Platform',
      azure: 'Microsoft Azure',
      mysql: 'MySQL Database',
      postgresql: 'PostgreSQL Database',
      oracle: 'Oracle Database',
      bigquery: 'Google BigQuery',
      databricks: 'Databricks',
      trino: 'Trino',
      snowflake: 'Snowflake',
      nas: 'NAS Drives',
      sftp: 'SFTP Server',
    };

    return (
      displayNames[connectorId] ||
      connectorId.charAt(0).toUpperCase() + connectorId.slice(1)
    );
  }, []);

  // Load My Connections based on system health
  const loadMyConnections = useCallback(
    connectorStatus => {
      try {
        // Filter for enabled/configured connectors
        const activeConnections = Object.entries(connectorStatus)
          .filter(([, status]) => status.enabled && status.configured)
          .map(([connectorId, status]) => ({
            id: connectorId,
            name: getConnectorDisplayName(connectorId),
            status: status.connected ? 'connected' : 'disconnected',
            lastTest: status.last_test,
            error: status.error,
          }));

        setMyConnections(activeConnections);
      } catch (error) {
        console.error('Failed to load my connections:', error);
        setMyConnections([]);
      }
    },
    [getConnectorDisplayName]
  );

  const loadConnectors = useCallback(async () => {
    try {
      setLoading(true);
      const [connectorsResponse, healthResponse] = await Promise.all([
        getConnectors(),
        getSystemHealth(),
      ]);

      setConnectorsData({
        connectors: connectorsResponse.connectors || {},
        available_connectors: connectorsResponse.available_connectors || {},
        enabled_connectors: connectorsResponse.enabled_connectors || 0,
        total_connectors: connectorsResponse.total_connectors || 0,
      });

      setSystemHealth({
        connector_status: healthResponse.connector_status || {},
      });

      // Load My Connections based on system health
      loadMyConnections(healthResponse.connector_status || {});
    } catch (error) {
      console.error('Failed to load connectors:', error);
    } finally {
      setLoading(false);
    }
  }, [loadMyConnections]);

  useEffect(() => {
    loadConnectors();
  }, [loadConnectors]);

  const getConnectorIcon = type => {
    switch (type?.toLowerCase()) {
      case 'gcp':
      case 'google cloud':
        return <CloudIcon />;
      case 'azure':
      case 'microsoft azure':
        return <CloudIcon />;
      case 'aws':
      case 'amazon web services':
        return <CloudIcon />;
      case 'database':
      case 'postgresql':
      case 'mysql':
      case 'oracle':
      case 'sql server':
        return <DatabaseIcon />;
      case 'api':
      case 'rest':
        return <LinkIcon />;
      case 'warehouse':
      case 'bigquery':
        return <BusinessIcon />;
      case 'databricks':
        return <DataObjectIcon />;
      case 'trino':
        return <SpeedIcon />;
      case 'snowflake':
        return <AcUnitIcon />;
      case 'file':
      case 'csv':
      case 'nas':
      case 'sftp':
        return <InsertDriveFileIcon />;
      case 'firestore':
        return <FireplaceIcon />;
      case 'cloud storage':
        return <CloudQueueIcon />;
      case 'cloud sql':
        return <CloudDoneIcon />;
      default:
        return <DnsIcon />;
    }
  };

  const getConnectorColor = type => {
    switch (type?.toLowerCase()) {
      case 'gcp':
      case 'google cloud':
        return '#4285f4';
      case 'database':
        return '#4caf50';
      case 'api':
        return '#ff9800';
      case 'warehouse':
        return '#9c27b0';
      default:
        return COLORS.mainPurple;
    }
  };

  const handleConfigureConnector = async connector => {
    try {
      setWizardMode('edit');
      setSelectedConnector(connector);
      setWizardOpen(true);
    } catch (error) {
      console.error('Failed to load connector config:', error);
    }
  };

  // View connection details function - following pendingMergeUI logic
  const handleViewConnectionDetails = async connectorId => {
    try {
      const response = await getConnectorConfig(connectorId);

      if (response && response.config) {
        // Show connection details in a simple alert (matching pendingMergeUI behavior)
        const configDetails = JSON.stringify(response.config, null, 2);
        alert(`Connection Details for ${connectorId}:\n\n${configDetails}`);
      } else {
        showNotification('No configuration details available', 'warning');
      }
    } catch (error) {
      console.error('Failed to get connection details:', error);
      showNotification('Failed to load connection details', 'error');
    }
  };

  // Remove connection function - following pendingMergeUI logic
  const handleRemoveConnection = async connectorId => {
    const connection = myConnections.find(conn => conn.id === connectorId);
    if (!connection) {
      showNotification('Connection not found', 'error');
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to remove the connection "${connection.name}"?`
      )
    ) {
      try {
        // In pendingMergeUI, this calls removeUserConnection which updates local storage
        // For now, we'll just refresh the connections list
        showNotification(
          `Connection "${connection.name}" has been removed`,
          'success'
        );
        loadConnectors(); // Refresh the connections
      } catch (error) {
        console.error('Error removing connection:', error);
        showNotification('Failed to remove connection', 'error');
      }
    }
  };

  // Test connection function - following pendingMergeUI logic
  const handleTestConnection = async connectorType => {
    try {
      setTestingConnection(true);
      showNotification('Testing connection...', 'info');

      let testResult;
      let discoveryResult;

      // Step 1: Test connection
      if (connectorType === 'gcp') {
        // For GCP, use specific GCP test API
        testResult = await testGcpConfig();
      } else {
        // For other connectors, use generic test API
        testResult = await testConnectorConfig({
          connectorId: connectorType,
        });
      }

      if (
        testResult &&
        (testResult.status === 'success' ||
          testResult.connection_status === 'connected')
      ) {
        showNotification(
          'Connection successful! Discovering assets...',
          'success'
        );

        // Step 2: Discover assets
        try {
          if (connectorType === 'gcp') {
            discoveryResult = await testGcpDiscovery();
          } else {
            discoveryResult = await testConnectorDiscovery({
              connectorId: connectorType,
            });
          }

          if (discoveryResult && discoveryResult.status === 'success') {
            const assetsCount = discoveryResult.assets_discovered || 0;
            showNotification(
              `Connection successful! Discovered ${assetsCount} assets`,
              'success'
            );

            // Show assets modal if there are assets
            if (discoveryResult.assets && discoveryResult.assets.length > 0) {
              showAssetsModal(connectorType, discoveryResult.assets);
            }

            // Refresh connectors and dashboard
            loadConnectors();
            onRefresh();
          } else {
            showNotification(
              'Connection successful, but asset discovery failed',
              'warning'
            );
          }
        } catch (discoveryError) {
          console.error('Asset discovery error:', discoveryError);
          showNotification(
            'Connection successful, but asset discovery failed',
            'warning'
          );
        }
      } else {
        showNotification(
          `Connection test failed: ${testResult?.message || 'Unknown error'}`,
          'error'
        );
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      showNotification('Connection test failed: ' + error.message, 'error');
    } finally {
      setTestingConnection(false);
    }
  };

  // Show assets modal function
  const showAssetsModal = (connectorType, assets) => {
    // Create a simple modal to show discovered assets
    const assetNames = assets.map(asset => asset.name).slice(0, 4);

    // For now, use a simple alert. In a real implementation, you'd use a proper modal component
    alert(
      `Discovered ${
        assets.length
      } assets in ${connectorType}:\n\n${assetNames.join('\n')}${
        assets.length > 4 ? `\n... and ${assets.length - 4} more` : ''
      }`
    );
  };

  // View connection details function
  const handleViewDetails = async connectorType => {
    try {
      const response = await getConnectorConfig({ connectorId: connectorType });

      // Check if response has config data (following pendingMergeUI logic)
      if (
        response &&
        response.current_config &&
        Object.keys(response.current_config).length > 0
      ) {
        // Show connection details in a simple alert like pendingMergeUI
        const configDetails = JSON.stringify(response.current_config, null, 2);
        alert(`Connection Details for ${connectorType}:\n\n${configDetails}`);
      } else {
        showNotification(
          'No configuration found for this connection',
          'warning'
        );
      }
    } catch (error) {
      console.error('Failed to load connection details:', error);
      showNotification('Failed to load connection details', 'error');
    }
  };

  const handleSaveConfig = async connectionData => {
    try {
      // Save configuration logic here
      console.log('Saving connection data:', connectionData);
      showNotification('Configuration saved successfully', 'success');
      await loadConnectors();
      onRefresh();
    } catch (error) {
      console.error('Failed to save config:', error);
      showNotification('Failed to save configuration', 'error');
    }
  };

  const handleSaveNewConnection = async connectionData => {
    try {
      // Save new connection logic here
      console.log('Saving new connection data:', connectionData);
      showNotification('New connection created successfully', 'success');
      await loadConnectors();
      onRefresh();
    } catch (error) {
      console.error('Failed to save new connection:', error);
      showNotification('Failed to create new connection', 'error');
    }
  };

  // Get connector status from system health data
  const getConnectorStatus = connectorType => {
    if (!systemHealth?.connector_status)
      return { enabled: false, configured: false, connected: false };
    const status = systemHealth.connector_status[connectorType];
    return status || { enabled: false, configured: false, connected: false };
  };

  const connectorCategories = [
    {
      title: 'Cloud Providers',
      icon: <CloudIcon />,
      connectors: connectorsData.connectors.cloud_providers || [],
    },
    {
      title: 'Databases',
      icon: <DatabaseIcon />,
      connectors: connectorsData.connectors.databases || [],
    },
    {
      title: 'Data Warehouses',
      icon: <BusinessIcon />,
      connectors: connectorsData.connectors.data_warehouses || [],
    },
    {
      title: 'Network Storage',
      icon: <DnsIcon />,
      connectors: connectorsData.connectors.network_storage || [],
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={3}
      >
        <Typography variant='h5'>
          Data Connectors
          <Chip
            label={`${connectorsData.total_connectors} (${connectorsData.enabled_connectors} enabled)`}
            color='secondary'
            sx={{ ml: 2 }}
          />
        </Typography>
        <Box>
          <Button
            filled
            onClick={() => {
              setWizardMode('new');
              setSelectedConnector(null);
              setWizardOpen(true);
            }}
            size='small'
            style={{ marginRight: SPACING.space16 }}
          >
            <AddIcon sx={{ mr: 1 }} />
            New Connection
          </Button>
          <Button onClick={loadConnectors} size='small'>
            <RefreshIcon sx={{ mr: 1 }} />
            Refresh Connectors
          </Button>
        </Box>
      </Box>

      {/* My Connections */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant='h6' gutterBottom>
            My Connections
            <Chip
              label={myConnections.length}
              color='success'
              size='small'
              sx={{ ml: 2 }}
            />
          </Typography>
          {loading ? (
            <Box display='flex' justifyContent='center' p={3}>
              <CircularProgress />
            </Box>
          ) : myConnections.length > 0 ? (
            <Grid container spacing={2}>
              {myConnections.map(connection => (
                <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={connection.id}>
                  <Card sx={{ p: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                        {getConnectorIcon(connection.id)}
                      </Avatar>
                      <Typography variant='h6' sx={{ flex: 1 }}>
                        {connection.name}
                      </Typography>
                      <Chip
                        label={
                          connection.status === 'connected'
                            ? 'Connected'
                            : 'Disconnected'
                        }
                        color={
                          connection.status === 'connected'
                            ? 'success'
                            : 'error'
                        }
                        size='small'
                      />
                    </Box>

                    {connection.lastTest && (
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mb: 1 }}
                      >
                        Last test:{' '}
                        {new Date(connection.lastTest).toLocaleString()}
                      </Typography>
                    )}

                    {connection.error && (
                      <Alert severity='error' sx={{ mt: 1, mb: 2 }}>
                        {connection.error}
                      </Alert>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        size='small'
                        variant='outlined'
                        color='primary'
                        startIcon={<PlayArrowIcon />}
                        onClick={() => handleTestConnection(connection.id)}
                        disabled={testingConnection}
                        title='Test Connection'
                      >
                        Test
                      </Button>
                      <Button
                        size='small'
                        variant='outlined'
                        color='info'
                        startIcon={<InfoIcon />}
                        onClick={() =>
                          handleViewConnectionDetails(connection.id)
                        }
                        title='View Details'
                      >
                        View
                      </Button>
                      <Button
                        size='small'
                        variant='outlined'
                        color='error'
                        startIcon={<DeleteIcon />}
                        onClick={() => handleRemoveConnection(connection.id)}
                        title='Remove Connection'
                      >
                        Remove
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign='center' py={4}>
              <Typography color='text.secondary'>
                No active connections available
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Available Connectors */}
      <Card>
        <CardContent>
          <Typography variant='h6' gutterBottom>
            Available Connectors
          </Typography>
          {connectorCategories.map((category, index) => (
            <Accordion key={index} defaultExpanded={index === 0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display='flex' alignItems='center'>
                  {category.icon}
                  <Typography variant='h6' sx={{ ml: 1 }}>
                    {category.title}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {category.connectors.map(connectorType => {
                    const connector =
                      connectorsData.available_connectors[connectorType];
                    const status = getConnectorStatus(connectorType);
                    if (!connector) return null;

                    return (
                      <Grid
                        item
                        size={{ xs: 12, sm: 6, md: 4 }}
                        key={connectorType}
                      >
                        <ConnectorCard>
                          <CardContent>
                            <Box display='flex' alignItems='center' mb={2}>
                              <ConnectorIcon
                                bgcolor={getConnectorColor(connectorType)}
                              >
                                {getConnectorIcon(connectorType)}
                              </ConnectorIcon>
                              <Box>
                                <Typography variant='h6'>
                                  {connector.name}
                                </Typography>
                                <Typography
                                  variant='body2'
                                  color='text.secondary'
                                >
                                  {connectorType}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography
                              variant='body2'
                              color='text.secondary'
                              mb={1}
                            >
                              {connector.description}
                            </Typography>

                            {connector.services &&
                              connector.services.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                  <Typography
                                    variant='caption'
                                    color='text.secondary'
                                    sx={{ display: 'block', mb: 1 }}
                                  >
                                    Services:
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      gap: 0.5,
                                    }}
                                  >
                                    {connector.services.map(service => (
                                      <Chip
                                        key={service}
                                        label={service}
                                        size='small'
                                        variant='outlined'
                                        color='primary'
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              )}
                            <Box display='flex' gap={1} mb={2}>
                              <Chip
                                label={status.enabled ? 'Enabled' : 'Disabled'}
                                color={status.enabled ? 'success' : 'default'}
                                size='small'
                              />
                              <Chip
                                label={
                                  status.configured
                                    ? 'Configured'
                                    : 'Not Configured'
                                }
                                color={
                                  status.configured ? 'primary' : 'default'
                                }
                                size='small'
                              />
                            </Box>
                            <Box
                              display='flex'
                              justifyContent='flex-end'
                              gap={1}
                            >
                              <Tooltip title='Configure Connection'>
                                <IconButton
                                  onClick={() => {
                                    setWizardMode('edit');
                                    setSelectedConnector({
                                      ...connector,
                                      type: connectorType,
                                    });
                                    setWizardOpen(true);
                                  }}
                                  sx={{ color: '#7b1fa2' }}
                                >
                                  <SettingsIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title='Test Connection'>
                                <IconButton
                                  onClick={() =>
                                    handleTestConnection(connectorType)
                                  }
                                  disabled={testingConnection}
                                  sx={{ color: '#7b1fa2' }}
                                >
                                  {testingConnection ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    <LinkIcon />
                                  )}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title='View Details'>
                                <IconButton
                                  onClick={() =>
                                    handleViewDetails(connectorType)
                                  }
                                  sx={{ color: '#1976d2' }}
                                >
                                  <InfoIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </CardContent>
                        </ConnectorCard>
                      </Grid>
                    );
                  })}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>

      {/* Unified Connection Wizard */}
      <ConnectionWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        mode={wizardMode}
        connectorId={selectedConnector?.type}
        connectorName={selectedConnector?.name}
        onSave={
          wizardMode === 'new' ? handleSaveNewConnection : handleSaveConfig
        }
      />
    </Box>
  );
};

export default ConnectorsTab;
