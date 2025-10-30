import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Page from 'src/components/Page';
import LockIcon from '@mui/icons-material/Lock';
import styled from '@emotion/styled';
import { SPACING, COLORS } from '@comp/theme';

const StyledPage = styled(Page)({
  height: '100%',
  padding: SPACING.space44,
});

const LockIconContainer = styled(Box)({
  marginTop: SPACING.space44,
  display: 'flex',
  justifyContent: 'center',
  maxWidth: '100%',
  '& svg': {
    width: '16rem',
    height: '16rem',
    color: COLORS.mainPurple,
  },
});

const NotAuthorized = () => {
  return (
    <StyledPage title='403'>
      <Box
        display='flex'
        flexDirection='column'
        height='100%'
        justifyContent='center'
      >
        <Container maxWidth='md'>
          <Typography align='center' color='textPrimary' variant='h1'>
            You are not authorized to access this page
          </Typography>
          <Typography align='center' color='textPrimary' variant='subtitle2'>
            You either tried some shady route or you came here by mistake.
            Whichever it is, try using the navigation
          </Typography>
          <LockIconContainer textAlign='center'>
            <LockIcon />
          </LockIconContainer>
        </Container>
      </Box>
    </StyledPage>
  );
};

export default NotAuthorized;
