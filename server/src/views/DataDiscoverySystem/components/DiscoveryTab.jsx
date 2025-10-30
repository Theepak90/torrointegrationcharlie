/* third lib*/
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import Button from '@basics/Button';
import SelectC from '@basics/Select';
import {
  PlayArrow as PlayArrowIcon,
  List as ListIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

/* local components & methods */
import {
  startDiscovery,
  scanSpecificSource,
  getDiscoveryStatus,
} from '@lib/api';

const DiscoveryTab = ({ systemData, onRefresh }) => {
  const [discoveryStatus, setDiscoveryStatus] = useState({
    discovery_status: 'idle',
    last_scan: null,
    active_connectors: 0,
  });
  const [selectedSource, setSelectedSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSourceSelection, setShowSourceSelection] = useState(false);
  const [availableSources, setAvailableSources] = useState([]);

  const loadDiscoveryStatus = async () => {
    try {
      const response = await getDiscoveryStatus();
      if (response && response.status === 'success') {
        setDiscoveryStatus({
          discovery_status: response.discovery_status || 'idle',
          last_scan: response.last_scan || null,
          active_connectors: response.active_connectors?.length || 0,
        });
      }
    } catch (error) {
      console.error('Failed to load discovery status:', error);
    }
  };

  const loadAvailableSources = useCallback(() => {
    if (systemData && systemData.connectors) {
      const sources = [];
      Object.entries(systemData.connectors).forEach(
        ([category, connectors]) => {
          Object.entries(connectors).forEach(([id, connector]) => {
            if (connector.enabled) {
              sources.push({
                id: id,
                name: connector.name,
                category: category,
              });
            }
          });
        }
      );
      setAvailableSources(sources);
    }
  }, [systemData]);

  useEffect(() => {
    loadDiscoveryStatus();
    loadAvailableSources();
  }, [loadAvailableSources]);

  const handleStartFullDiscovery = async () => {
    try {
      setLoading(true);
      // Call the API exactly like pendingMergeUI: POST /api/discovery/scan
      const response = await startDiscovery();
      if (response && response.status === 'success') {
        setDiscoveryStatus(prev => ({
          ...prev,
          discovery_status: 'running',
        }));
        // Refresh status after a delay, exactly like pendingMergeUI
        setTimeout(() => {
          loadDiscoveryStatus();
          onRefresh();
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to start discovery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowSourceSelection = () => {
    setShowSourceSelection(!showSourceSelection);
  };

  const handleStartSpecificDiscovery = async () => {
    if (!selectedSource) return;

    try {
      setLoading(true);
      // Call the API exactly like pendingMergeUI: POST /api/discovery/scan/{source}
      const response = await scanSpecificSource({ source: selectedSource });
      if (response && response.status === 'success') {
        setDiscoveryStatus(prev => ({
          ...prev,
          discovery_status: 'running',
        }));
        // Refresh status after a delay, exactly like pendingMergeUI
        setTimeout(() => {
          loadDiscoveryStatus();
          onRefresh();
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to start specific discovery:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'running':
        return 'primary';
      case 'completed':
        return 'success';
      case 'error':
        return 'error';
      case 'idle':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatDateTime = dateString => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <Box>
      {/* First row: Discovery Controls and Discovery Status */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          mb: 3,
          '& > *': {
            flex: '1 1 calc(50% - 12px)',
            minWidth: '300px',
          },
        }}
      >
        {/* Discovery Controls */}
        <Card sx={{ height: '100%', minHeight: '300px' }}>
          <CardContent
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Typography
              variant='h6'
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
            >
              <PlayArrowIcon />
              Discovery Controls
            </Typography>

            <Box
              display='flex'
              flexDirection='column'
              gap={2}
              sx={{ flex: 1, justifyContent: 'center' }}
            >
              <Button
                filled
                onClick={handleStartFullDiscovery}
                disabled={
                  loading || discoveryStatus.discovery_status === 'running'
                }
                size='large'
              >
                <SearchIcon sx={{ mr: 1 }} />
                Start Full Discovery
              </Button>

              <Button onClick={handleShowSourceSelection} size='large'>
                <ListIcon sx={{ mr: 1 }} />
                Scan Specific Source
              </Button>

              {showSourceSelection && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <SelectC
                      value={selectedSource}
                      onChange={value => setSelectedSource(value)}
                      options={availableSources.map(source => ({
                        value: source.id,
                        label: source.name,
                      }))}
                    />
                  </Box>

                  <Button
                    filled
                    onClick={handleStartSpecificDiscovery}
                    disabled={
                      !selectedSource ||
                      loading ||
                      discoveryStatus.discovery_status === 'running'
                    }
                    size='small'
                  >
                    <PlayArrowIcon sx={{ mr: 1 }} />
                    Scan Selected Source
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Discovery Status */}
        <Card sx={{ height: '100%', minHeight: '300px' }}>
          <CardContent
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Typography
              variant='h6'
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
            >
              <InfoIcon />
              Discovery Status
            </Typography>

            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Box mb={2}>
                <Typography
                  variant='body2'
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  Status:{' '}
                  <Chip
                    label={discoveryStatus.discovery_status || 'undefined'}
                    color={getStatusColor(discoveryStatus.discovery_status)}
                    size='small'
                    sx={{
                      ml: 1,
                      backgroundColor: '#1976d2',
                      color: 'white',
                      fontWeight: 500,
                    }}
                  />
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant='body2'>
                  Last Scan: {formatDateTime(discoveryStatus.last_scan)}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant='body2'>
                  Active Connectors: {discoveryStatus.active_connectors}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Second row: Discovery Results - Full width */}
      <Card>
        <CardContent>
          <Typography
            variant='h6'
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
          >
            <TrendingUpIcon />
            Discovery Results
          </Typography>

          <Box textAlign='center' py={6}>
            <Typography color='text.secondary' variant='body1'>
              No discovery results yet. Start a discovery scan to see results.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DiscoveryTab;
