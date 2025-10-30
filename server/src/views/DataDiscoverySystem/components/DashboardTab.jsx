/* third lib*/
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
} from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import styled from '@emotion/styled';

/* local components & methods */
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '@comp/theme';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ActivityList = styled(List)`
  max-height: 300px;
  overflow-y: auto;
  padding: ${SPACING.space8};
`;

const DashboardTab = ({ data }) => {
  return (
    <Box>
      {/* Top row: System Health and Recent Activity */}
      <Box
        sx={{
          display: 'flex',
          gap: SPACING.space24,
          mb: SPACING.space24,
          '& > *': {
            flex: '1 1 calc(50% - 12px)',
            minWidth: '300px',
          },
        }}
      >
        {/* System Health */}
        <Card>
          <CardContent>
            <Typography
              variant='h6'
              gutterBottom
              sx={{
                fontSize: FONT_SIZES.fontSize3,
                fontWeight: FONT_WEIGHTS.medium,
              }}
            >
              System Health
            </Typography>

            {/* Grid layout for System Health items */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: SPACING.space24,
                height: '200px',
              }}
            >
              {/* System Health Status */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: SPACING.space8,
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: COLORS.mainRed,
                      mr: SPACING.space4,
                    }}
                  />
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: COLORS.mainRed,
                    }}
                  />
                </Box>
                <Typography
                  variant='h6'
                  sx={{
                    mb: SPACING.space8,
                    fontSize: FONT_SIZES.fontSize3,
                    fontWeight: FONT_WEIGHTS.medium,
                  }}
                >
                  System Health
                </Typography>
                <Chip label='undefined' color='error' size='small' />
              </Box>

              {/* Monitoring Status */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: COLORS.color12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: FONT_SIZES.fontSize5,
                    color: COLORS.white,
                    mb: SPACING.space8,
                  }}
                >
                  👁
                </Box>
                <Typography
                  variant='h6'
                  sx={{
                    mb: SPACING.space8,
                    fontSize: FONT_SIZES.fontSize3,
                    fontWeight: FONT_WEIGHTS.medium,
                  }}
                >
                  Monitoring
                </Typography>
                <Chip label='Disabled' color='default' size='small' />
              </Box>

              {/* Connectors */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: COLORS.mainPurple,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: FONT_SIZES.fontSize5,
                    color: COLORS.white,
                    mb: SPACING.space8,
                  }}
                >
                  🔗
                </Box>
                <Typography
                  variant='h6'
                  sx={{
                    mb: SPACING.space8,
                    fontSize: FONT_SIZES.fontSize3,
                    fontWeight: FONT_WEIGHTS.medium,
                  }}
                >
                  Connectors
                </Typography>
                <Typography
                  variant='body1'
                  color='text.secondary'
                  sx={{
                    fontSize: FONT_SIZES.fontSize4,
                    fontWeight: FONT_WEIGHTS.regular,
                  }}
                >
                  0 of 0 enabled
                </Typography>
              </Box>

              {/* Last Scan */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: COLORS.mainYellow,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: FONT_SIZES.fontSize5,
                    color: COLORS.white,
                    mb: SPACING.space8,
                  }}
                >
                  🕐
                </Box>
                <Typography
                  variant='h6'
                  sx={{
                    mb: SPACING.space8,
                    fontSize: FONT_SIZES.fontSize3,
                    fontWeight: FONT_WEIGHTS.medium,
                  }}
                >
                  Last Scan
                </Typography>
                <Typography
                  variant='body1'
                  color='text.secondary'
                  sx={{
                    fontSize: FONT_SIZES.fontSize4,
                    fontWeight: FONT_WEIGHTS.regular,
                  }}
                >
                  Never
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardContent>
            <Typography
              variant='h6'
              gutterBottom
              sx={{
                fontSize: FONT_SIZES.fontSize3,
                fontWeight: FONT_WEIGHTS.medium,
              }}
            >
              Recent Activity
            </Typography>
            <ActivityList>
              <ListItem>
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: 'white',
                    }}
                  >
                    🗄
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary="Discovered bigquery_table 'torrodataset.consent_management.consent_records' from gcp_bigquery"
                  secondary='6 days ago'
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: 'white',
                    }}
                  >
                    🗄
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary="Discovered bigquery_dataset 'torrodataset.consent_management' from gcp_bigquery"
                  secondary='6 days ago'
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: 'white',
                    }}
                  >
                    🗄
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary="Discovered bigquery_table 'torrodataset.banking_pii.customer_records' from gcp_bigquery"
                  secondary='6 days ago'
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: 'white',
                    }}
                  >
                    🗄
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary="Discovered bigquery_dataset 'torrodataset.banking_pii' from gcp_bigquery"
                  secondary='6 days ago'
                />
              </ListItem>
            </ActivityList>
          </CardContent>
        </Card>
      </Box>

      {/* Bottom row: Discovery Statistics - Full width */}
      <Card>
        <CardContent>
          <Typography variant='h6' gutterBottom>
            Discovery Statistics
          </Typography>
          {data.dashboard_metrics?.assets_by_type ? (
            <Box
              sx={{
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Doughnut
                data={{
                  labels: Object.keys(data.dashboard_metrics.assets_by_type),
                  datasets: [
                    {
                      data: Object.values(
                        data.dashboard_metrics.assets_by_type
                      ),
                      backgroundColor: [
                        '#1976d2',
                        '#388e3c',
                        '#f57c00',
                        '#d32f2f',
                        '#7b1fa2',
                      ],
                      borderWidth: 2,
                      borderColor: '#fff',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                    title: {
                      display: false,
                    },
                  },
                }}
              />
            </Box>
          ) : (
            <Box
              display='flex'
              justifyContent='center'
              alignItems='center'
              height='200px'
            >
              <Typography color='text.secondary'>No Data Available</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardTab;
