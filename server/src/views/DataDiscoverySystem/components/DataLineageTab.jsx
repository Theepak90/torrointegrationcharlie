import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Timeline as TimelineIcon } from '@mui/icons-material';

const DataLineageTab = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        p: 4,
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: '100%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 6 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <TimelineIcon
                sx={{
                  fontSize: 40,
                  color: '#666',
                }}
              />
            </Box>

            {/* Title */}
            <Typography
              variant='h4'
              sx={{
                fontWeight: 600,
                color: '#333',
                mb: 2,
              }}
            >
              Data Lineage Explorer
            </Typography>

            {/* Subtitle */}
            <Typography
              variant='h6'
              sx={{
                color: '#666',
                mb: 3,
                fontWeight: 400,
              }}
            >
              Coming Soon
            </Typography>

            {/* Description */}
            <Typography
              variant='body1'
              sx={{
                color: '#888',
                lineHeight: 1.6,
                maxWidth: 400,
              }}
            >
              We&apos;re working hard to bring you powerful data lineage
              visualization and tracking capabilities. This feature will help
              you explore data flows and dependencies with column-level lineage
              tracking.
            </Typography>

            {/* Coming Soon Badge */}
            <Box
              sx={{
                mt: 4,
                px: 3,
                py: 1,
                backgroundColor: '#e3f2fd',
                borderRadius: 2,
                border: '1px solid #bbdefb',
              }}
            >
              <Typography
                variant='body2'
                sx={{
                  color: '#1976d2',
                  fontWeight: 500,
                }}
              >
                🚀 Feature in Development
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DataLineageTab;
