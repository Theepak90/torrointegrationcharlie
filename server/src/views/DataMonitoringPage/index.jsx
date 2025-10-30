/* third lib*/
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FormattedMessage as Intl } from 'react-intl';

/* material-ui */

/* local components & methods */
import HeadLine from '@basics/HeadLine';
import styled from '@emotion/styled';
import { COLORS, SPACING } from '@comp/theme';

const DataMonitoringPageContainer = styled.div`
  background-color: ${COLORS.white};
  min-height: 100%;
  width: 100%;
  padding: ${SPACING.space44};
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 8.5rem);
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  color: ${COLORS.darkPurple};
  margin-bottom: ${SPACING.space44};
`;

const MonitoringContent = styled.div`
  flex: 1;
  width: 100%;
  height: calc(100vh - 12rem);
`;

const DataMonitoringPage = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  const handleIframeError = () => {
    console.error('Iframe loading failed');
  };

  return (
    <DataMonitoringPageContainer>
      <Container>
        {/* <Title>
          <HeadLine>
            <Intl id="dataMonitoring" />
          </HeadLine>
        </Title> */}
        <MonitoringContent>
          <iframe
            width='100%'
            height='100%'
            src='https://lookerstudio.google.com/embed/reporting/3ebae63e-3b8d-4fcc-b30b-034a1f59a8ff/page/2dwnD'
            frameBorder='0'
            style={{ border: 0 }}
            allowFullScreen
            sandbox='allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox'
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
          {!iframeLoaded && <div>Loading the report...</div>}
        </MonitoringContent>
      </Container>
    </DataMonitoringPageContainer>
  );
};

export default DataMonitoringPage;
