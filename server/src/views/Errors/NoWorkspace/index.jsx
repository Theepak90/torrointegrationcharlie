import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Page from 'src/components/Page';
import withAuthentication from 'src/hoc/withAuthentication';
import styled from '@emotion/styled';
import { SPACING } from '@comp/theme';

const StyledPage = styled(Page)({
  height: '100%',
  padding: SPACING.space44,
});

const StyledImage = styled.img({
  marginTop: SPACING.space44,
  display: 'inline-block',
  maxWidth: '100%',
  width: '48rem',
});

const NotFoundView = () => {
  return (
    <StyledPage title='404'>
      <Box
        display='flex'
        flexDirection='column'
        height='100%'
        justifyContent='center'
      >
        <Container maxWidth='md'>
          <Typography align='center' color='textPrimary' variant='h1'>
            You do not have any workspace access!
          </Typography>
          <Typography align='center' color='textPrimary' variant='subtitle2'>
            Please contact your IT support.
          </Typography>
          <Box textAlign='center'>
            <StyledImage
              alt='Under development'
              src='/static/images/undraw_page_not_found_su7k.svg'
            />
          </Box>
        </Container>
      </Box>
    </StyledPage>
  );
};

export default withAuthentication(NotFoundView);
