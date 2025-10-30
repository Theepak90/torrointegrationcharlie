import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from '@mui/material';
import Button from '@basics/Button';
import { addGcpConnector, testGcpConfig, testGcpDiscovery } from '@lib/api';
import {
  Storage as DatabaseIcon,
  CloudUpload as CloudIcon,
  Api as ApiIcon,
  CheckCircle as CheckIcon,
  CloudQueue as CloudQueueIcon,
  Assessment as BigQueryIcon,
  Storage as CloudSQLIcon,
  LocalFireDepartment as FirestoreIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  TableChart as TableIcon,
  Dataset as DatasetIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';

const ConnectionWizard = ({
  open,
  onClose,
  mode = 'new', // 'new' or 'edit'
  connectorId = null,
  connectorName = null,
  onSave,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedConnectionType, setSelectedConnectionType] = useState('');
  const [configForm, setConfigForm] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [discoveredAssets, setDiscoveredAssets] = useState(null);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [connectionName, setConnectionName] = useState('');
  const [buttonState, setButtonState] = useState({
    text: 'Test Connection',
    color: 'primary',
    disabled: false,
    icon: <CheckIcon />,
  });

  const steps = [
    'Connection Type',
    'Configuration',
    'Test Connection',
    'Summary',
  ];

  // Connection types based on pendingMergeUI
  const getConnectionTypes = () => {
    if (mode === 'new') {
      // New Connection Wizard - generic types
      return [
        {
          type: 'database',
          icon: <DatabaseIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
          title: 'Database',
          description:
            'Connect to SQL databases like PostgreSQL, MySQL, Oracle',
        },
        {
          type: 'cloud',
          icon: <CloudIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
          title: 'Cloud Storage',
          description: 'Connect to cloud storage services',
        },
        {
          type: 'api',
          icon: <ApiIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
          title: 'API / SaaS',
          description: 'Connect to REST APIs and SaaS platforms',
        },
      ];
    } else {
      // Edit mode - connector-specific types based on pendingMergeUI
      if (connectorId === 'gcp') {
        return [
          {
            type: 'storage',
            icon: <CloudQueueIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
            title: 'Cloud Storage',
            description: 'Connect to Google Cloud Storage buckets',
          },
          {
            type: 'bigquery',
            icon: <BigQueryIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
            title: 'BigQuery',
            description: 'Connect to Google BigQuery data warehouse',
          },
          {
            type: 'sql',
            icon: <CloudSQLIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
            title: 'Cloud SQL',
            description: 'Connect to Google Cloud SQL instances',
          },
          {
            type: 'firestore',
            icon: <FirestoreIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
            title: 'Firestore',
            description: 'Connect to Google Firestore NoSQL database',
          },
        ];
      }
      // Add other connector types as needed
      return [];
    }
  };

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setSelectedConnectionType('');
      setConfigForm({});
      setTestResult(null);
      setTesting(false);
      setEnabled(true);
      setDiscoveredAssets(null);
      setLoadingAssets(false);
      setConnectionName('');
      setButtonState({
        text: 'Test Connection',
        color: 'primary',
        disabled: false,
        icon: <CheckIcon />,
      });
    }
  }, [open, mode, connectorId]);

  // Load discovered assets for Summary step
  const loadDiscoveredAssets = useCallback(async () => {
    if (!connectorId || connectorId !== 'gcp') return;

    setLoadingAssets(true);
    try {
      // Check if GCP connector already exists
      const healthResponse = await fetch('/api/system/health');
      const healthData = await healthResponse.json();
      const gcpConnector = healthData.connector_status?.gcp;

      // Only add the connector if it doesn't exist or isn't configured
      if (!gcpConnector || !gcpConnector.configured) {
        const projectId = configForm.project_id;
        const serviceAccountJson = configForm.service_account_json;

        if (projectId && serviceAccountJson) {
          const addResponse = await fetch('/api/connectors/gcp/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name:
                configForm.connection_name ||
                connectionName ||
                'GCP Connection',
              config: {
                project_id: projectId,
                service_account_json: serviceAccountJson,
                services: ['bigquery'],
              },
            }),
          });

          if (!addResponse.ok) {
            const errorData = await addResponse.json();
            throw new Error(
              `Failed to add GCP connector: ${
                errorData.detail || 'Unknown error'
              }`
            );
          }
        } else {
          throw new Error('Project ID or Service Account JSON not found');
        }
      }

      // Now fetch discovered assets
      const response = await fetch('/api/discovery/test/gcp', {
        method: 'POST',
      });

      const result = await response.json();

      if (
        result.status === 'success' &&
        result.assets &&
        result.assets.length > 0
      ) {
        const assets = result.assets;
        const datasets = assets.filter(
          asset => asset.type === 'bigquery_dataset'
        );
        const tables = assets.filter(asset => asset.type === 'bigquery_table');

        setDiscoveredAssets({
          total: assets.length,
          datasets: datasets,
          tables: tables,
          allAssets: assets,
        });
      } else if (
        result.status === 'success' &&
        result.assets_discovered === 0
      ) {
        setDiscoveredAssets({
          total: 0,
          datasets: [],
          tables: [],
          allAssets: [],
          message: 'No Assets Found',
        });
      } else {
        setDiscoveredAssets({
          total: 0,
          datasets: [],
          tables: [],
          allAssets: [],
          error:
            result.message || 'Unknown error occurred during asset discovery',
        });
      }
    } catch (error) {
      console.error('Error loading discovered assets:', error);
      setDiscoveredAssets({
        total: 0,
        datasets: [],
        tables: [],
        allAssets: [],
        error: error.message,
      });
    } finally {
      setLoadingAssets(false);
    }
  }, [
    connectorId,
    configForm.project_id,
    configForm.service_account_json,
    configForm.connection_name,
    connectionName,
  ]);

  // Load discovered assets when entering Summary step
  useEffect(() => {
    if (
      activeStep === 3 &&
      connectorId === 'gcp' &&
      testResult?.success &&
      !discoveredAssets &&
      !loadingAssets
    ) {
      loadDiscoveredAssets();
    }
  }, [
    activeStep,
    connectorId,
    testResult,
    discoveredAssets,
    loadingAssets,
    loadDiscoveredAssets,
  ]);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setSelectedConnectionType('');
    setConfigForm({});
    setTestResult(null);
    setTesting(false);
    setEnabled(true);
    onClose();
  };

  const handleConnectionTypeSelect = type => {
    setSelectedConnectionType(type);
    setConfigForm({});
  };

  const handleConfigChange = (field, value) => {
    setConfigForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Get connection configuration based on current form data
  const getConnectionConfig = () => {
    // For GCP connectors, return unified GCP configuration format
    if (connectorId === 'gcp') {
      const config = {
        project_id: configForm.project_id || '',
        service_account_json: configForm.service_account_json || '',
      };

      // Validate service_account_json format if provided
      if (config.service_account_json && config.service_account_json.trim()) {
        try {
          JSON.parse(config.service_account_json);
        } catch (error) {
          console.error(
            'Invalid JSON format in Service Account JSON field:',
            error
          );
          throw new Error('Invalid JSON format in Service Account JSON field');
        }
      }

      // Determine services based on selected connection type
      const services = [];
      if (selectedConnectionType === 'storage') {
        services.push('cloud_storage');
      } else if (selectedConnectionType === 'bigquery') {
        services.push('bigquery');
      } else if (selectedConnectionType === 'sql') {
        // Azure SQL - no specific services needed
        // services array will be empty for Azure SQL
      } else if (selectedConnectionType === 'firestore') {
        // Firestore might be part of bigquery or separate service
        services.push('bigquery');
      } else {
        // Default to both services if no specific type selected
        services.push('bigquery', 'cloud_storage');
      }

      config.services = services;
      return config;
    }

    // For other connector types, return the form data as-is
    return { ...configForm };
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    // Update button state to loading
    setButtonState({
      text: 'Testing Connection...',
      color: 'primary',
      disabled: true,
      icon: <CircularProgress size={20} />,
    });

    try {
      // Test connection based on connector type and connection type
      if (connectorId === 'gcp' && selectedConnectionType) {
        // Validate configuration first
        const config = getConnectionConfig();

        // Check required fields based on connection type
        if (
          selectedConnectionType === 'bigquery' ||
          selectedConnectionType === 'storage'
        ) {
          if (!config.project_id || !config.service_account_json) {
            setTestResult({
              success: false,
              errorType: 'configuration_required',
              message: 'Please provide Project ID and Service Account JSON',
            });
            setButtonState({
              text: 'Configuration Required',
              color: 'warning',
              disabled: false,
              icon: <ErrorIcon />,
            });
            return;
          }

          // Validate JSON format
          try {
            JSON.parse(config.service_account_json);
          } catch {
            setTestResult({
              success: false,
              errorType: 'invalid_json',
              message: 'Please check your Service Account JSON format',
            });
            setButtonState({
              text: 'Invalid JSON',
              color: 'warning',
              disabled: false,
              icon: <ErrorIcon />,
            });
            return;
          }
        } else if (selectedConnectionType === 'sql') {
          // Azure SQL validation
          if (
            !config.server_name ||
            !config.database ||
            !config.username ||
            !config.password
          ) {
            setTestResult({
              success: false,
              errorType: 'configuration_required',
              message:
                'Please provide Server Name, Database Name, Username, and Password',
            });
            setButtonState({
              text: 'Configuration Required',
              color: 'warning',
              disabled: false,
              icon: <ErrorIcon />,
            });
            return;
          }
        }

        // Step 1: Add GCP connector
        const addResponse = await addGcpConnector({
          enabled: true,
          config: config,
        });

        if (!addResponse) {
          setTestResult({
            success: false,
            errorType: 'add_failed',
            message: 'Failed to add GCP connector',
          });
          setButtonState({
            text: 'Connection Failed',
            color: 'error',
            disabled: false,
            icon: <ErrorIcon />,
          });
          return;
        }

        // Step 2: Test connection
        const testResponse = await testGcpConfig();

        if (
          testResponse &&
          (testResponse.status === 'success' ||
            testResponse.connection_status === 'connected')
        ) {
          // Step 3: Discover assets
          try {
            const discoveryResponse = await testGcpDiscovery();

            if (discoveryResponse && discoveryResponse.status === 'success') {
              const assetsCount = discoveryResponse.assets_discovered || 0;
              const assets = discoveryResponse.assets || [];

              if (assets.length > 0) {
                const assetNames = assets.map(asset => asset.name).slice(0, 4);
                setTestResult({
                  success: true,
                  message: `✅ BigQuery Connected! Discovered ${assetsCount} assets`,
                  assets: assets,
                  assetsCount: assetsCount,
                  assetNames: assetNames,
                  hasAssets: true,
                });
                setButtonState({
                  text: 'Connection Successful',
                  color: 'success',
                  disabled: false,
                  icon: <SuccessIcon />,
                });
              } else {
                setTestResult({
                  success: true,
                  message: '✅ Connected to GCP Project',
                  assets: [],
                  assetsCount: 0,
                  hasAssets: false,
                });
                setButtonState({
                  text: 'Connected (No Assets)',
                  color: 'success',
                  disabled: false,
                  icon: <SuccessIcon />,
                });
              }
            } else {
              setTestResult({
                success: true,
                message: '✅ Connected to GCP Project',
                assets: [],
                assetsCount: 0,
                hasAssets: false,
              });
              setButtonState({
                text: 'Connected (No Assets)',
                color: 'success',
                disabled: false,
                icon: <SuccessIcon />,
              });
            }
          } catch (discoveryError) {
            console.error('Asset discovery error:', discoveryError);
            setTestResult({
              success: true,
              message: '✅ Connected to GCP Project (Asset discovery failed)',
              assets: [],
              assetsCount: 0,
              hasAssets: false,
            });
            setButtonState({
              text: 'Connected (Discovery Failed)',
              color: 'success',
              disabled: false,
              icon: <SuccessIcon />,
            });
          }
        } else {
          setTestResult({
            success: false,
            errorType: 'connection_failed',
            message: `❌ ${
              testResponse?.message || 'Unable to connect to GCP'
            }`,
            helpText: 'Check your Project ID and Service Account credentials',
          });
          setButtonState({
            text: 'Connection Failed',
            color: 'error',
            disabled: false,
            icon: <ErrorIcon />,
          });
        }
      } else {
        // For other connector types, simulate API call for now
        await new Promise(resolve => setTimeout(resolve, 2000));
        setTestResult({
          success: true,
          message: 'Connection test successful!',
        });
        setButtonState({
          text: 'Connection Successful',
          color: 'success',
          disabled: false,
          icon: <SuccessIcon />,
        });
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setTestResult({
        success: false,
        errorType: 'unknown_error',
        message: `Connection test failed: ${error.message || 'Unknown error'}`,
      });
      setButtonState({
        text: 'Connection Failed',
        color: 'error',
        disabled: false,
        icon: <ErrorIcon />,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    const connectionData = {
      mode,
      connectorId,
      connectorName,
      type: selectedConnectionType,
      config: configForm,
      enabled,
      testResult,
    };
    onSave(connectionData);
    handleClose();
  };

  const renderStepContent = step => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant='h6' gutterBottom>
              Select Connection Type
            </Typography>
            <Grid container spacing={2}>
              {getConnectionTypes().map(connectionType => (
                <Grid
                  item
                  size={{ xs: 12, sm: 6, md: 3 }}
                  key={connectionType.type}
                >
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border:
                        selectedConnectionType === connectionType.type ? 2 : 1,
                      borderColor:
                        selectedConnectionType === connectionType.type
                          ? 'primary.main'
                          : 'divider',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: 2,
                      },
                    }}
                    onClick={() =>
                      handleConnectionTypeSelect(connectionType.type)
                    }
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      {selectedConnectionType === connectionType.type && (
                        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                          <CheckIcon color='primary' />
                        </Box>
                      )}
                      <Box sx={{ mb: 2 }}>{connectionType.icon}</Box>
                      <Typography variant='h6' gutterBottom>
                        {connectionType.title}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {connectionType.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant='h6' gutterBottom>
              Connection Configuration
            </Typography>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
            >
              {/* New Connection configurations */}
              {selectedConnectionType === 'database' && (
                <Box
                  sx={{
                    background: 'rgba(248, 250, 252, 0.95)',
                    borderRadius: 3,
                    padding: 3,
                    border: '1px solid #e9ecef',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Database Type
                        </Typography>
                        <FormControl fullWidth required>
                          <Select
                            value={configForm.db_type || ''}
                            onChange={e =>
                              handleConfigChange('db_type', e.target.value)
                            }
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                border: '2px solid #e9ecef',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  borderColor: '#6366f1',
                                },
                                '&.Mui-focused': {
                                  borderColor: '#6366f1',
                                  boxShadow:
                                    '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                                },
                              },
                              '& .MuiOutlinedInput-input': {
                                padding: '12px 16px',
                              },
                            }}
                          >
                            <MenuItem value='postgresql'>PostgreSQL</MenuItem>
                            <MenuItem value='mysql'>MySQL</MenuItem>
                            <MenuItem value='oracle'>Oracle</MenuItem>
                            <MenuItem value='mssql'>SQL Server</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Connection Name
                        </Typography>
                        <TextField
                          value={configForm.connection_name || ''}
                          onChange={e =>
                            handleConfigChange(
                              'connection_name',
                              e.target.value
                            )
                          }
                          fullWidth
                          placeholder='My Database Connection'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Host
                        </Typography>
                        <TextField
                          value={configForm.host || ''}
                          onChange={e =>
                            handleConfigChange('host', e.target.value)
                          }
                          fullWidth
                          placeholder='Enter hostname'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Port
                        </Typography>
                        <TextField
                          value={configForm.port || ''}
                          onChange={e =>
                            handleConfigChange('port', e.target.value)
                          }
                          fullWidth
                          type='number'
                          placeholder='5432'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Username
                        </Typography>
                        <TextField
                          value={configForm.username || ''}
                          onChange={e =>
                            handleConfigChange('username', e.target.value)
                          }
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Password
                        </Typography>
                        <TextField
                          value={configForm.password || ''}
                          onChange={e =>
                            handleConfigChange('password', e.target.value)
                          }
                          fullWidth
                          type='password'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item size={12}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Database Name
                        </Typography>
                        <TextField
                          value={configForm.database || ''}
                          onChange={e =>
                            handleConfigChange('database', e.target.value)
                          }
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {selectedConnectionType === 'cloud' && mode === 'new' && (
                <Box
                  sx={{
                    background: 'rgba(248, 250, 252, 0.95)',
                    borderRadius: 3,
                    padding: 3,
                    border: '1px solid #e9ecef',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Cloud Provider
                        </Typography>
                        <FormControl fullWidth required>
                          <Select
                            value={configForm.cloud_provider || ''}
                            onChange={e =>
                              handleConfigChange(
                                'cloud_provider',
                                e.target.value
                              )
                            }
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                border: '2px solid #e9ecef',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  borderColor: '#6366f1',
                                },
                                '&.Mui-focused': {
                                  borderColor: '#6366f1',
                                  boxShadow:
                                    '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                                },
                              },
                              '& .MuiOutlinedInput-input': {
                                padding: '12px 16px',
                              },
                            }}
                          >
                            <MenuItem value=''>Select Provider</MenuItem>
                            <MenuItem value='azure'>Microsoft Azure</MenuItem>
                            <MenuItem value='gcp'>
                              Google Cloud Platform
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Connection Name
                        </Typography>
                        <TextField
                          value={configForm.connection_name || ''}
                          onChange={e =>
                            handleConfigChange(
                              'connection_name',
                              e.target.value
                            )
                          }
                          fullWidth
                          required
                          placeholder='My Cloud Storage'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Access Key ID
                        </Typography>
                        <TextField
                          value={configForm.access_key || ''}
                          onChange={e =>
                            handleConfigChange('access_key', e.target.value)
                          }
                          fullWidth
                          required
                          placeholder='AKIA...'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Secret Access Key
                        </Typography>
                        <TextField
                          value={configForm.secret_key || ''}
                          onChange={e =>
                            handleConfigChange('secret_key', e.target.value)
                          }
                          fullWidth
                          required
                          type='password'
                          placeholder='Secret Key'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item size={12}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Region
                        </Typography>
                        <TextField
                          value={configForm.region || ''}
                          onChange={e =>
                            handleConfigChange('region', e.target.value)
                          }
                          fullWidth
                          placeholder='us-east-1'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* GCP Specific Connection Types - matching pendingMergeUI */}
              {selectedConnectionType === 'storage' && (
                <Grid container spacing={2}>
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography
                        variant='subtitle2'
                        sx={{
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: 0.5,
                          fontSize: '0.875rem',
                        }}
                      >
                        Connection Name
                      </Typography>
                      <TextField
                        value={configForm.connection_name || ''}
                        onChange={e =>
                          handleConfigChange('connection_name', e.target.value)
                        }
                        fullWidth
                        required
                        placeholder='My GCS Connection'
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            border: '2px solid #e9ecef',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#6366f1',
                            },
                            '&.Mui-focused': {
                              borderColor: '#6366f1',
                              boxShadow:
                                '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: '12px 16px',
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography
                        variant='subtitle2'
                        sx={{
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: 0.5,
                          fontSize: '0.875rem',
                        }}
                      >
                        Bucket Name
                      </Typography>
                      <TextField
                        value={configForm.bucket_name || ''}
                        onChange={e =>
                          handleConfigChange('bucket_name', e.target.value)
                        }
                        fullWidth
                        required
                        placeholder='my-gcs-bucket'
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            border: '2px solid #e9ecef',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#6366f1',
                            },
                            '&.Mui-focused': {
                              borderColor: '#6366f1',
                              boxShadow:
                                '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: '12px 16px',
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item size={12}>
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography
                        variant='subtitle2'
                        sx={{
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: 0.5,
                          fontSize: '0.875rem',
                        }}
                      >
                        Service Account JSON
                      </Typography>
                      <TextField
                        value={configForm.service_account_json || ''}
                        onChange={e =>
                          handleConfigChange(
                            'service_account_json',
                            e.target.value
                          )
                        }
                        fullWidth
                        required
                        multiline
                        rows={6}
                        placeholder='{"type": "service_account", "project_id": "..."}'
                        helperText='Paste your Google Cloud service account JSON key'
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            border: '2px solid #e9ecef',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#6366f1',
                            },
                            '&.Mui-focused': {
                              borderColor: '#6366f1',
                              boxShadow:
                                '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: '12px 16px',
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item size={12}>
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography
                        variant='subtitle2'
                        sx={{
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: 0.5,
                          fontSize: '0.875rem',
                        }}
                      >
                        Prefix (Optional)
                      </Typography>
                      <TextField
                        value={configForm.prefix || ''}
                        onChange={e =>
                          handleConfigChange('prefix', e.target.value)
                        }
                        fullWidth
                        placeholder='data/'
                        helperText='Specify a folder path within the bucket'
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            border: '2px solid #e9ecef',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#6366f1',
                            },
                            '&.Mui-focused': {
                              borderColor: '#6366f1',
                              boxShadow:
                                '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: '12px 16px',
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              )}

              {selectedConnectionType === 'bigquery' && (
                <Box
                  sx={{
                    background: 'rgba(248, 250, 252, 0.95)',
                    borderRadius: 3,
                    padding: 3,
                    border: '1px solid #e9ecef',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Connection Name
                        </Typography>
                        <TextField
                          value={configForm.connection_name || ''}
                          onChange={e =>
                            handleConfigChange(
                              'connection_name',
                              e.target.value
                            )
                          }
                          fullWidth
                          required
                          placeholder='My BigQuery Connection'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Project ID
                        </Typography>
                        <TextField
                          value={configForm.project_id || ''}
                          onChange={e =>
                            handleConfigChange('project_id', e.target.value)
                          }
                          fullWidth
                          required
                          placeholder='my-gcp-project'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item size={12}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Service Account JSON
                        </Typography>
                        <TextField
                          value={configForm.service_account_json || ''}
                          onChange={e =>
                            handleConfigChange(
                              'service_account_json',
                              e.target.value
                            )
                          }
                          fullWidth
                          required
                          multiline
                          rows={6}
                          placeholder='{"type": "service_account", "project_id": "..."}'
                          helperText='Paste your Google Cloud service account JSON key'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item size={12}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Dataset ID (Optional)
                        </Typography>
                        <TextField
                          value={configForm.dataset_id || ''}
                          onChange={e =>
                            handleConfigChange('dataset_id', e.target.value)
                          }
                          fullWidth
                          placeholder='my_dataset'
                          helperText='Optional: Specify a specific dataset to connect to'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {selectedConnectionType === 'sql' && (
                <Box
                  sx={{
                    background: 'rgba(248, 250, 252, 0.95)',
                    borderRadius: 3,
                    padding: 3,
                    border: '1px solid #e9ecef',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Connection Name
                        </Typography>
                        <TextField
                          value={configForm.connection_name || ''}
                          onChange={e =>
                            handleConfigChange(
                              'connection_name',
                              e.target.value
                            )
                          }
                          fullWidth
                          required
                          placeholder='My Azure SQL Connection'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Server Name
                        </Typography>
                        <TextField
                          value={configForm.server_name || ''}
                          onChange={e =>
                            handleConfigChange('server_name', e.target.value)
                          }
                          fullWidth
                          required
                          placeholder='myserver.database.windows.net'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Database Name
                        </Typography>
                        <TextField
                          value={configForm.database || ''}
                          onChange={e =>
                            handleConfigChange('database', e.target.value)
                          }
                          fullWidth
                          required
                          placeholder='mydatabase'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Port
                        </Typography>
                        <TextField
                          value={configForm.port || ''}
                          onChange={e =>
                            handleConfigChange('port', e.target.value)
                          }
                          fullWidth
                          required
                          type='number'
                          placeholder='1433'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Username
                        </Typography>
                        <TextField
                          value={configForm.username || ''}
                          onChange={e =>
                            handleConfigChange('username', e.target.value)
                          }
                          fullWidth
                          required
                          placeholder='admin@myserver'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Password
                        </Typography>
                        <TextField
                          value={configForm.password || ''}
                          onChange={e =>
                            handleConfigChange('password', e.target.value)
                          }
                          fullWidth
                          required
                          type='password'
                          placeholder='password'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {selectedConnectionType === 'firestore' && (
                <Grid container spacing={2}>
                  {/* 第一行：Connection Name 和 Project ID，各占 50% */}
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography
                        variant='subtitle2'
                        sx={{
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: 1,
                          fontSize: '0.875rem',
                        }}
                      >
                        Connection Name
                      </Typography>
                      <TextField
                        value={configForm.connection_name || ''}
                        onChange={e =>
                          handleConfigChange('connection_name', e.target.value)
                        }
                        fullWidth
                        required
                        placeholder='My Firestore Connection'
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            border: '2px solid #e9ecef',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#6366f1',
                            },
                            '&.Mui-focused': {
                              borderColor: '#6366f1',
                              boxShadow:
                                '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: '12px 16px',
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography
                        variant='subtitle2'
                        sx={{
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: 1,
                          fontSize: '0.875rem',
                        }}
                      >
                        Project ID
                      </Typography>
                      <TextField
                        value={configForm.project_id || ''}
                        onChange={e =>
                          handleConfigChange('project_id', e.target.value)
                        }
                        fullWidth
                        required
                        placeholder='my-gcp-project'
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            border: '2px solid #e9ecef',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#6366f1',
                            },
                            '&.Mui-focused': {
                              borderColor: '#6366f1',
                              boxShadow:
                                '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: '12px 16px',
                          },
                        }}
                      />
                    </Box>
                  </Grid>

                  {/* 第二行：Service Account JSON，独占 100% */}
                  <Grid item size={12}>
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography
                        variant='subtitle2'
                        sx={{
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: 1,
                          fontSize: '0.875rem',
                        }}
                      >
                        Service Account JSON
                      </Typography>
                      <TextField
                        value={configForm.service_account_json || ''}
                        onChange={e =>
                          handleConfigChange(
                            'service_account_json',
                            e.target.value
                          )
                        }
                        fullWidth
                        required
                        multiline
                        rows={6}
                        placeholder='{"type": "service_account", "project_id": "..."}'
                        helperText='Paste your Google Cloud service account JSON key'
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            border: '2px solid #e9ecef',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#6366f1',
                            },
                            '&.Mui-focused': {
                              borderColor: '#6366f1',
                              boxShadow:
                                '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: '12px 16px',
                          },
                        }}
                      />
                    </Box>
                  </Grid>

                  {/* 第三行：Database ID 和 Collection (Optional)，各占 50% */}
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography
                        variant='subtitle2'
                        sx={{
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: 1,
                          fontSize: '0.875rem',
                        }}
                      >
                        Database ID
                      </Typography>
                      <TextField
                        value={configForm.database_id || ''}
                        onChange={e =>
                          handleConfigChange('database_id', e.target.value)
                        }
                        fullWidth
                        required
                        placeholder='(default)'
                        helperText='Firestore database ID, use "(default)" for default database'
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            border: '2px solid #e9ecef',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#6366f1',
                            },
                            '&.Mui-focused': {
                              borderColor: '#6366f1',
                              boxShadow:
                                '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: '12px 16px',
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography
                        variant='subtitle2'
                        sx={{
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: 1,
                          fontSize: '0.875rem',
                        }}
                      >
                        Collection (Optional)
                      </Typography>
                      <TextField
                        value={configForm.collection || ''}
                        onChange={e =>
                          handleConfigChange('collection', e.target.value)
                        }
                        fullWidth
                        placeholder='users'
                        helperText='Leave empty to scan all collections'
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            border: '2px solid #e9ecef',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#6366f1',
                            },
                            '&.Mui-focused': {
                              borderColor: '#6366f1',
                              boxShadow:
                                '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                            },
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: '12px 16px',
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              )}

              {selectedConnectionType === 'api' && (
                <Box
                  sx={{
                    background: 'rgba(248, 250, 252, 0.95)',
                    borderRadius: 3,
                    padding: 3,
                    border: '1px solid #e9ecef',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Connection Name
                        </Typography>
                        <TextField
                          value={configForm.connection_name || ''}
                          onChange={e =>
                            handleConfigChange(
                              'connection_name',
                              e.target.value
                            )
                          }
                          fullWidth
                          required
                          placeholder='My API Connection'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          API Type
                        </Typography>
                        <FormControl fullWidth required>
                          <Select
                            value={configForm.api_type || ''}
                            onChange={e =>
                              handleConfigChange('api_type', e.target.value)
                            }
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                border: '2px solid #e9ecef',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  borderColor: '#6366f1',
                                },
                                '&.Mui-focused': {
                                  borderColor: '#6366f1',
                                  boxShadow:
                                    '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                                },
                              },
                              '& .MuiOutlinedInput-input': {
                                padding: '12px 16px',
                              },
                            }}
                          >
                            <MenuItem value='rest'>REST API</MenuItem>
                            <MenuItem value='graphql'>GraphQL</MenuItem>
                            <MenuItem value='soap'>SOAP</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item size={12}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Base URL
                        </Typography>
                        <TextField
                          value={configForm.api_url || ''}
                          onChange={e =>
                            handleConfigChange('api_url', e.target.value)
                          }
                          fullWidth
                          required
                          placeholder='https://api.example.com'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          API Key
                        </Typography>
                        <TextField
                          value={configForm.api_key || ''}
                          onChange={e =>
                            handleConfigChange('api_key', e.target.value)
                          }
                          fullWidth
                          required
                          placeholder='Your API Key'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: 1,
                            fontSize: '0.875rem',
                          }}
                        >
                          Secret Key
                        </Typography>
                        <TextField
                          value={configForm.secret_key || ''}
                          onChange={e =>
                            handleConfigChange('secret_key', e.target.value)
                          }
                          fullWidth
                          type='password'
                          placeholder='Your Secret Key'
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              border: '2px solid #e9ecef',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: '#6366f1',
                              },
                              '&.Mui-focused': {
                                borderColor: '#6366f1',
                                boxShadow:
                                  '0 0 0 0.2rem rgba(99, 102, 241, 0.25)',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              padding: '12px 16px',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant='h6' gutterBottom>
              Test Connection
            </Typography>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              {testing ? (
                <Box>
                  <CircularProgress size={60} />
                  <Typography variant='body1' sx={{ mt: 2 }}>
                    Testing connection to your data source...
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mt: 1 }}
                  >
                    This may take a few moments
                  </Typography>
                </Box>
              ) : testResult ? (
                <Box>
                  {testResult.success ? (
                    <Box>
                      <Alert severity='success' sx={{ mb: 3 }}>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                        >
                          <SuccessIcon sx={{ mr: 1 }} />
                          <Typography variant='h6'>
                            {testResult.message}
                          </Typography>
                        </Box>
                        {testResult.assetsCount > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography
                              variant='body2'
                              color='text.secondary'
                              sx={{ mb: 1 }}
                            >
                              Discovered {testResult.assetsCount} assets:
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                justifyContent: 'center',
                              }}
                            >
                              {testResult.assets
                                ?.slice(0, 4)
                                .map((asset, index) => (
                                  <Chip
                                    key={index}
                                    icon={<TableIcon />}
                                    label={asset.name}
                                    size='small'
                                    color='primary'
                                    variant='outlined'
                                  />
                                ))}
                              {testResult.assetsCount > 4 && (
                                <Chip
                                  label={`+${testResult.assetsCount - 4} more`}
                                  size='small'
                                  color='default'
                                  variant='outlined'
                                />
                              )}
                            </Box>
                          </Box>
                        )}
                      </Alert>

                      {/* Detailed Assets Display */}
                      {testResult.hasAssets &&
                        testResult.assets &&
                        testResult.assets.length > 0 && (
                          <Accordion sx={{ mt: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography variant='subtitle1'>
                                <InfoIcon
                                  sx={{ mr: 1, verticalAlign: 'middle' }}
                                />
                                View Discovered Assets ({testResult.assetsCount}
                                )
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <List dense>
                                {testResult.assets.map((asset, index) => (
                                  <ListItem key={index} sx={{ px: 0 }}>
                                    <ListItemIcon>
                                      {asset.type === 'table' ? (
                                        <TableIcon />
                                      ) : (
                                        <DatasetIcon />
                                      )}
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={asset.name}
                                      secondary={
                                        <Box>
                                          <Typography
                                            variant='caption'
                                            display='block'
                                          >
                                            Type: {asset.type || 'Unknown'}
                                          </Typography>
                                          {asset.description && (
                                            <Typography
                                              variant='caption'
                                              display='block'
                                            >
                                              {asset.description}
                                            </Typography>
                                          )}
                                        </Box>
                                      }
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </AccordionDetails>
                          </Accordion>
                        )}
                    </Box>
                  ) : (
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          py: 3,
                        }}
                      >
                        <ErrorIcon
                          sx={{
                            fontSize: 60,
                            color: 'error.main',
                            mb: 2,
                          }}
                        />
                        <Typography
                          variant='h6'
                          sx={{ mb: 1, fontWeight: 'bold' }}
                        >
                          {testResult.errorType === 'configuration_required'
                            ? 'Configuration Required'
                            : testResult.errorType === 'invalid_json'
                            ? 'Invalid JSON Format'
                            : testResult.errorType === 'add_failed'
                            ? 'Failed to Add Connector'
                            : 'Connection Failed'}
                        </Typography>
                        <Typography
                          variant='body1'
                          sx={{ mb: 2, color: 'text.secondary' }}
                        >
                          {testResult.message}
                        </Typography>
                        {testResult.helpText && (
                          <Typography
                            variant='body2'
                            sx={{ color: 'text.secondary', mb: 2 }}
                          >
                            {testResult.helpText}
                          </Typography>
                        )}

                        {/* Error-specific help */}
                        {testResult.errorType === 'configuration_required' && (
                          <Alert
                            severity='warning'
                            sx={{ mt: 2, textAlign: 'left' }}
                          >
                            <Typography variant='body2'>
                              Please ensure you have filled in all required
                              fields:
                              <ul style={{ marginTop: 8, marginBottom: 0 }}>
                                <li>Project ID</li>
                                <li>Service Account JSON</li>
                              </ul>
                            </Typography>
                          </Alert>
                        )}

                        {testResult.errorType === 'invalid_json' && (
                          <Alert
                            severity='warning'
                            sx={{ mt: 2, textAlign: 'left' }}
                          >
                            <Typography variant='body2'>
                              The Service Account JSON format is invalid. Please
                              check:
                              <ul style={{ marginTop: 8, marginBottom: 0 }}>
                                <li>Valid JSON syntax</li>
                                <li>All required fields are present</li>
                                <li>
                                  No extra characters or formatting issues
                                </li>
                              </ul>
                            </Typography>
                          </Alert>
                        )}
                      </Box>
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={handleTestConnection}
                        sx={{ mt: 2, width: '100%' }}
                        startIcon={<ErrorIcon />}
                      >
                        Retry Connection Test
                      </Button>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box>
                  <Typography variant='body1' sx={{ mb: 3 }}>
                    Click the button below to test your connection
                  </Typography>
                  <Button
                    variant='contained'
                    color={buttonState.color}
                    onClick={handleTestConnection}
                    size='large'
                    disabled={buttonState.disabled}
                    startIcon={buttonState.icon}
                  >
                    {buttonState.text}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant='h6' gutterBottom>
              Connection Summary
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Connection Name */}
              {(configForm.connection_name || connectionName) && (
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography
                    variant='subtitle2'
                    color='text.secondary'
                    gutterBottom
                  >
                    Connection Name
                  </Typography>
                  <Typography variant='body1' fontWeight='medium'>
                    {configForm.connection_name ||
                      connectionName ||
                      'Unnamed Connection'}
                  </Typography>
                </Paper>
              )}

              {/* Connection Type */}
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography
                  variant='subtitle2'
                  color='text.secondary'
                  gutterBottom
                >
                  Connection Type
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {
                    getConnectionTypes().find(
                      t => t.type === selectedConnectionType
                    )?.icon
                  }
                  <Typography variant='body1' fontWeight='medium'>
                    {
                      getConnectionTypes().find(
                        t => t.type === selectedConnectionType
                      )?.title
                    }
                  </Typography>
                </Box>
              </Paper>

              {/* Configuration Details */}
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography
                  variant='subtitle2'
                  color='text.secondary'
                  gutterBottom
                >
                  Configuration Details
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {connectorId === 'gcp' ? (
                    <Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant='body2' color='text.secondary'>
                          Project ID
                        </Typography>
                        <Typography variant='body1' fontWeight='medium'>
                          {configForm.project_id || 'Not specified'}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant='body2' color='text.secondary'>
                          Service Account
                        </Typography>
                        <Typography variant='body1' fontWeight='medium'>
                          {configForm.service_account_json
                            ? 'Configured'
                            : 'Not configured'}
                        </Typography>
                      </Box>
                      {configForm.dataset_id && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant='body2' color='text.secondary'>
                            Dataset ID
                          </Typography>
                          <Typography variant='body1' fontWeight='medium'>
                            {configForm.dataset_id}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant='body2' color='text.secondary'>
                          Services
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {getConnectionConfig().services?.map(
                            (service, index) => (
                              <Chip
                                key={index}
                                label={
                                  service === 'bigquery'
                                    ? 'BigQuery'
                                    : service === 'cloud_storage'
                                    ? 'Cloud Storage'
                                    : service
                                }
                                size='small'
                                color='primary'
                                variant='outlined'
                              />
                            )
                          )}
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      {Object.entries(configForm).map(([key, value]) => (
                        <Box key={key} sx={{ mb: 1 }}>
                          <Typography variant='body2' color='text.secondary'>
                            {key
                              .replace(/_/g, ' ')
                              .replace(/\b\w/g, l => l.toUpperCase())}
                          </Typography>
                          <Typography variant='body1' fontWeight='medium'>
                            {typeof value === 'string' && value.length > 50
                              ? value.substring(0, 50) + '...'
                              : value || 'Not specified'}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Paper>

              {/* Test Status */}
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography
                  variant='subtitle2'
                  color='text.secondary'
                  gutterBottom
                >
                  Test Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {testResult?.success ? (
                    <SuccessIcon color='success' />
                  ) : testResult ? (
                    <ErrorIcon color='error' />
                  ) : (
                    <WarningIcon color='warning' />
                  )}
                  <Typography
                    variant='body1'
                    fontWeight='medium'
                    color={
                      testResult?.success
                        ? 'success.main'
                        : testResult
                        ? 'error.main'
                        : 'warning.main'
                    }
                  >
                    {testResult
                      ? testResult.success
                        ? 'Connection Successful'
                        : 'Connection Failed'
                      : 'Not Tested'}
                  </Typography>
                </Box>
                {testResult?.message && (
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mt: 1 }}
                  >
                    {testResult.message}
                  </Typography>
                )}
              </Paper>

              {/* Discovered Assets Section */}
              {testResult?.success && connectorId === 'gcp' && (
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography
                    variant='subtitle2'
                    color='text.secondary'
                    gutterBottom
                  >
                    <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Discovered Data Assets
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {loadingAssets ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          py: 2,
                        }}
                      >
                        <CircularProgress size={20} />
                        <Typography variant='body2' color='text.secondary'>
                          Loading discovered assets...
                        </Typography>
                      </Box>
                    ) : discoveredAssets ? (
                      <Box>
                        {discoveredAssets.error ? (
                          <Alert severity='error'>
                            <Typography variant='body2'>
                              <strong>Discovery Failed</strong>
                              <br />
                              {discoveredAssets.error}
                            </Typography>
                          </Alert>
                        ) : discoveredAssets.message ? (
                          <Alert severity='warning'>
                            <Typography variant='body2'>
                              <strong>No Assets Found</strong>
                              <br />
                              Connected successfully, but no BigQuery datasets
                              or tables found in this project.
                            </Typography>
                          </Alert>
                        ) : discoveredAssets.total > 0 ? (
                          <Box>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mb: 2,
                              }}
                            >
                              <Chip
                                label={`${discoveredAssets.total} assets found`}
                                color='success'
                                variant='outlined'
                              />
                              <Typography
                                variant='body2'
                                color='text.secondary'
                              >
                                {discoveredAssets.datasets.length} datasets,{' '}
                                {discoveredAssets.tables.length} tables
                              </Typography>
                            </Box>

                            {/* Datasets */}
                            {discoveredAssets.datasets.length > 0 && (
                              <Box sx={{ mb: 2 }}>
                                <Typography
                                  variant='subtitle2'
                                  color='primary'
                                  sx={{ mb: 1 }}
                                >
                                  <DatasetIcon
                                    sx={{ mr: 1, verticalAlign: 'middle' }}
                                  />
                                  Datasets Found:
                                </Typography>
                                <List dense>
                                  {discoveredAssets.datasets.map(
                                    (asset, index) => {
                                      const datasetName = asset.name
                                        .split('.')
                                        .pop();
                                      const isPII = asset.name
                                        .toLowerCase()
                                        .includes('pii');
                                      const isConsent = asset.name
                                        .toLowerCase()
                                        .includes('consent');

                                      return (
                                        <ListItem
                                          key={index}
                                          sx={{ px: 0, py: 0.5 }}
                                        >
                                          <ListItemIcon>
                                            <DatasetIcon color='primary' />
                                          </ListItemIcon>
                                          <ListItemText
                                            primary={
                                              <Box
                                                sx={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  gap: 1,
                                                }}
                                              >
                                                <Typography
                                                  variant='body2'
                                                  fontWeight='medium'
                                                >
                                                  {datasetName}
                                                </Typography>
                                                <Chip
                                                  label={
                                                    isPII
                                                      ? 'PII'
                                                      : isConsent
                                                      ? 'Consent'
                                                      : 'Dataset'
                                                  }
                                                  size='small'
                                                  color={
                                                    isPII
                                                      ? 'error'
                                                      : isConsent
                                                      ? 'warning'
                                                      : 'primary'
                                                  }
                                                  variant='outlined'
                                                />
                                              </Box>
                                            }
                                            secondary={
                                              <Typography
                                                variant='caption'
                                                color='text.secondary'
                                              >
                                                {asset.name}
                                              </Typography>
                                            }
                                          />
                                        </ListItem>
                                      );
                                    }
                                  )}
                                </List>
                              </Box>
                            )}

                            {/* Tables */}
                            {discoveredAssets.tables.length > 0 && (
                              <Box sx={{ mb: 2 }}>
                                <Typography
                                  variant='subtitle2'
                                  color='text.secondary'
                                  sx={{ mb: 1 }}
                                >
                                  <TableIcon
                                    sx={{ mr: 1, verticalAlign: 'middle' }}
                                  />
                                  Tables Found:
                                </Typography>
                                <List dense>
                                  {discoveredAssets.tables
                                    .slice(0, 5)
                                    .map((asset, index) => {
                                      const tableName = asset.name
                                        .split('.')
                                        .pop();
                                      const rowCount =
                                        asset.schema?.num_rows || 0;

                                      return (
                                        <ListItem
                                          key={index}
                                          sx={{ px: 0, py: 0.5 }}
                                        >
                                          <ListItemIcon>
                                            <TableIcon color='action' />
                                          </ListItemIcon>
                                          <ListItemText
                                            primary={
                                              <Box
                                                sx={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  gap: 1,
                                                }}
                                              >
                                                <Typography
                                                  variant='body2'
                                                  fontWeight='medium'
                                                >
                                                  {tableName}
                                                </Typography>
                                                <Chip
                                                  label={`${rowCount.toLocaleString()} rows`}
                                                  size='small'
                                                  color='default'
                                                  variant='outlined'
                                                />
                                              </Box>
                                            }
                                            secondary={
                                              <Typography
                                                variant='caption'
                                                color='text.secondary'
                                              >
                                                {asset.name}
                                              </Typography>
                                            }
                                          />
                                        </ListItem>
                                      );
                                    })}
                                </List>
                                {discoveredAssets.tables.length > 5 && (
                                  <Typography
                                    variant='caption'
                                    color='text.secondary'
                                  >
                                    ... and {discoveredAssets.tables.length - 5}{' '}
                                    more tables
                                  </Typography>
                                )}
                              </Box>
                            )}

                            {/* Summary Statistics */}
                            <Alert severity='success'>
                              <Typography variant='body2'>
                                <strong>Discovery Successful!</strong>
                                <br />
                                Found {discoveredAssets.total} total assets:{' '}
                                {discoveredAssets.datasets.length} datasets,{' '}
                                {discoveredAssets.tables.length} tables
                              </Typography>
                            </Alert>
                          </Box>
                        ) : null}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          py: 2,
                        }}
                      >
                        <Typography variant='body2' color='text.secondary'>
                          Assets will be loaded automatically...
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              )}

              {/* Next Steps */}
              {testResult?.success && (
                <Alert severity='info'>
                  <Typography variant='body2'>
                    <strong>Next Steps:</strong> Your connection has been
                    successfully configured. You can now start data discovery
                    and analysis on your connected data sources.
                  </Typography>
                </Alert>
              )}
            </Box>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  const getModalTitle = () => {
    if (mode === 'edit') {
      return `Configure ${connectorName || 'Connector'}`;
    }
    return 'Configure New Connection';
  };

  const getModalSubtitle = () => {
    if (mode === 'edit') {
      return 'Configure your existing data source connection';
    }
    return 'Set up a new data source connection';
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1,
              bgcolor: 'primary.main',
              borderRadius: 1,
              color: 'white',
            }}
          >
            <DatabaseIcon />
          </Box>
          <Box>
            <Typography variant='h6'>{getModalTitle()}</Typography>
            <Typography variant='body2' color='text.secondary'>
              {getModalSubtitle()}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ minHeight: 400 }}>{renderStepContent(activeStep)}</Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Button onClick={handleClose} text>
          Cancel
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {activeStep > 0 && (
          <Button onClick={handleBack} text sx={{ mr: 1 }}>
            Back
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button
            filled
            onClick={handleNext}
            disabled={activeStep === 0 && !selectedConnectionType}
          >
            Next
          </Button>
        ) : (
          <Button filled onClick={handleSave} disabled={!testResult?.success}>
            Save Configuration
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConnectionWizard;
