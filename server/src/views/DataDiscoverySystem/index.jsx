/* third lib*/
import React, { useState, useEffect, useCallback } from 'react';
// import { FormattedMessage as Intl } from 'react-intl';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Link as LinkIcon,
  TableChart as TableChartIcon,
  Search as RadarIcon,
  AccountTree as AccountTreeIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  Monitor as MonitorIcon,
} from '@mui/icons-material';
import styled from '@emotion/styled';

/* local components & methods */
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '@comp/theme';
// import { useGlobalContext } from 'src/context';
import {
  getSystemStatus,
  getSystemHealth,
  getConnectors,
  getAssetsList,
  getDiscoveryStatus,
  getLineageData,
} from '@lib/api';
import { sendNotify } from 'src/utils/systerm-error';

/* Tab Components */
import DashboardTab from './components/DashboardTab';
import ConnectorsTab from './components/ConnectorsTab';
import AssetsTab from './components/AssetsTab';
import DiscoveryTab from './components/DiscoveryTab';
import DataLineageTab from './components/DataLineageTab';

const Container = styled(Box)`
  height: 100%;
  background-color: ${COLORS.lightGrey};
  padding: ${SPACING.space20};
`;

const HeaderCard = styled(Card)`
  margin-bottom: ${SPACING.space20};
  background: linear-gradient(
    135deg,
    ${COLORS.mainPurple} 0%,
    ${COLORS.darkPurple} 100%
  );
  color: white;
`;

const TabContainer = styled(Paper)`
  background-color: ${COLORS.white};
  border-radius: 8px;
  overflow: hidden;
`;

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`data-discovery-tabpanel-${index}`}
      aria-labelledby={`data-discovery-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: SPACING.space24 }}>{children}</Box>}
    </div>
  );
};

const DataDiscoverySystem = () => {
  // const { authContext } = useGlobalContext();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [systemData, setSystemData] = useState({
    status: null,
    health: null,
    connectors: [],
    assets: [],
    discovery: null,
    lineage: null,
    dashboard_metrics: null,
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const showNotification = useCallback((message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  }, []);

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const loadSystemData = useCallback(async () => {
    try {
      setLoading(true);

      // Load all system data in parallel
      const [
        statusRes,
        healthRes,
        connectorsRes,
        assetsRes,
        discoveryRes,
        lineageRes,
      ] = await Promise.allSettled([
        getSystemStatus(),
        getSystemHealth(),
        getConnectors(),
        getAssetsList(),
        getDiscoveryStatus(),
        getLineageData(),
      ]);

      setSystemData({
        status: statusRes.status === 'fulfilled' ? statusRes.value : null,
        health: healthRes.status === 'fulfilled' ? healthRes.value : null,
        connectors:
          connectorsRes.status === 'fulfilled'
            ? connectorsRes.value?.connectors || []
            : [],
        assets:
          assetsRes.status === 'fulfilled' ? assetsRes.value?.assets || [] : [],
        discovery:
          discoveryRes.status === 'fulfilled' ? discoveryRes.value : null,
        lineage: lineageRes.status === 'fulfilled' ? lineageRes.value : null,
        // Add dashboard_metrics from status API response
        dashboard_metrics:
          statusRes.status === 'fulfilled'
            ? statusRes.value?.dashboard_metrics
            : null,
      });

      showNotification('System data loaded successfully', 'success');
    } catch (error) {
      console.error('Failed to load system data:', error);
      showNotification('Failed to load system data: ' + error.message, 'error');
      sendNotify({ msg: error.message, status: 3, show: true });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleRefresh = () => {
    loadSystemData();
  };

  useEffect(() => {
    loadSystemData();
  }, [loadSystemData]);

  const tabs = [
    {
      label: 'Dashboard',
      icon: <DashboardIcon />,
      component: <DashboardTab data={systemData} onRefresh={handleRefresh} />,
    },
    {
      label: 'Connectors',
      icon: <LinkIcon />,
      component: (
        <ConnectorsTab
          onRefresh={handleRefresh}
          systemData={systemData}
          showNotification={showNotification}
        />
      ),
    },
    {
      label: 'Assets',
      icon: <TableChartIcon />,
      component: <AssetsTab data={systemData} onRefresh={handleRefresh} />,
    },
    {
      label: 'Discovery',
      icon: <RadarIcon />,
      component: <DiscoveryTab data={systemData} onRefresh={handleRefresh} />,
    },
    {
      label: 'Data Lineage',
      icon: <AccountTreeIcon />,
      component: <DataLineageTab data={systemData} onRefresh={handleRefresh} />,
    },
  ];

  if (loading) {
    return (
      <Container>
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          height='100%'
        >
          <CircularProgress size={60} />
          <Typography
            variant='h6'
            sx={{
              ml: SPACING.space16,
              fontSize: FONT_SIZES.fontSize3,
              fontWeight: FONT_WEIGHTS.medium,
            }}
          >
            加载数据发现系统...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header */}
      <HeaderCard>
        <CardContent>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
          >
            <Box>
              <Typography
                variant='h4'
                component='h1'
                gutterBottom
                sx={{
                  fontSize: FONT_SIZES.fontSize1,
                  fontWeight: FONT_WEIGHTS.bold,
                }}
              >
                Data Discovery System
              </Typography>
              <Typography
                variant='subtitle1'
                sx={{
                  opacity: 0.9,
                  fontSize: FONT_SIZES.fontSize3,
                  fontWeight: FONT_WEIGHTS.regular,
                }}
              >
                Enterprise Data Asset Discovery & Management Platform
              </Typography>
            </Box>
            <Box display='flex' alignItems='center' gap={2}>
              <Chip
                label={
                  systemData.health?.status === 'healthy'
                    ? 'System Online'
                    : 'System Offline'
                }
                color={
                  systemData.health?.status === 'healthy' ? 'success' : 'error'
                }
                variant='outlined'
                sx={{ color: 'white', borderColor: 'white' }}
              />
              <Tooltip title='Refresh Data'>
                <IconButton onClick={handleRefresh} sx={{ color: 'white' }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </HeaderCard>

      {/* Statistics Cards */}
      <Box sx={{ mb: SPACING.space24 }}>
        <Box
          sx={{
            display: 'flex',
            gap: SPACING.space16,
            flexWrap: 'wrap',
            '& > *': {
              flex: '1 1 calc(25% - 12px)',
              minWidth: '250px',
            },
          }}
        >
          <Card
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              color: 'white',
              height: '100%',
            }}
          >
            <CardContent>
              <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'
              >
                <Box>
                  <Typography
                    variant='h4'
                    component='div'
                    sx={{
                      fontWeight: FONT_WEIGHTS.bold,
                      fontSize: FONT_SIZES.fontSize1,
                    }}
                  >
                    {systemData.dashboard_metrics?.total_assets || 0}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      opacity: 0.9,
                      fontSize: FONT_SIZES.fontSize4,
                      fontWeight: FONT_WEIGHTS.regular,
                    }}
                  >
                    Total Assets
                  </Typography>
                </Box>
                <Box
                  sx={{
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    p: SPACING.space12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TableChartIcon sx={{ fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card
            sx={{
              background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
              color: 'white',
              height: '100%',
            }}
          >
            <CardContent>
              <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'
              >
                <Box>
                  <Typography
                    variant='h4'
                    component='div'
                    sx={{
                      fontWeight: FONT_WEIGHTS.bold,
                      fontSize: FONT_SIZES.fontSize1,
                    }}
                  >
                    {systemData.dashboard_metrics?.active_connectors || 0}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      opacity: 0.9,
                      fontSize: FONT_SIZES.fontSize4,
                      fontWeight: FONT_WEIGHTS.regular,
                    }}
                  >
                    Active Connectors
                  </Typography>
                </Box>
                <Box
                  sx={{
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    p: SPACING.space12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LinkIcon sx={{ fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card
            sx={{
              background: 'linear-gradient(135deg, #0288d1 0%, #0277bd 100%)',
              color: 'white',
              height: '100%',
            }}
          >
            <CardContent>
              <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'
              >
                <Box>
                  <Typography
                    variant='h4'
                    component='div'
                    sx={{
                      fontWeight: FONT_WEIGHTS.bold,
                      fontSize: FONT_SIZES.fontSize1,
                    }}
                  >
                    {systemData.dashboard_metrics?.last_scan
                      ? new Date(
                          systemData.dashboard_metrics.last_scan
                        ).toLocaleDateString()
                      : 'Never'}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      opacity: 0.9,
                      fontSize: FONT_SIZES.fontSize4,
                      fontWeight: FONT_WEIGHTS.regular,
                    }}
                  >
                    Last Scan
                  </Typography>
                </Box>
                <Box
                  sx={{
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    p: SPACING.space12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ScheduleIcon sx={{ fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card
            sx={{
              background: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)',
              color: 'white',
              height: '100%',
            }}
          >
            <CardContent>
              <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'
              >
                <Box>
                  <Typography
                    variant='h4'
                    component='div'
                    sx={{
                      fontWeight: FONT_WEIGHTS.bold,
                      fontSize: FONT_SIZES.fontSize1,
                    }}
                  >
                    {systemData.dashboard_metrics?.monitoring_enabled
                      ? 'Enabled'
                      : 'Disabled'}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      opacity: 0.9,
                      fontSize: FONT_SIZES.fontSize4,
                      fontWeight: FONT_WEIGHTS.regular,
                    }}
                  >
                    Monitoring
                  </Typography>
                </Box>
                <Box
                  sx={{
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    p: SPACING.space12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MonitorIcon sx={{ fontSize: 24 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Main Content */}
      <TabContainer>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label='data discovery system tabs'
            variant='scrollable'
            scrollButtons='auto'
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={tab.label}
                icon={tab.icon}
                iconPosition='start'
                id={`data-discovery-tab-${index}`}
                aria-controls={`data-discovery-tabpanel-${index}`}
              />
            ))}
          </Tabs>
        </Box>

        {tabs.map((tab, index) => (
          <TabPanel key={index} value={currentTab} index={index}>
            {tab.component}
          </TabPanel>
        ))}
      </TabContainer>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DataDiscoverySystem;
