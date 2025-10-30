/* third lib*/
import React, { useCallback } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';

/* local components & methods */
import { covertToCurrentTime } from 'src/utils/timeFormat';
import { useGlobalContext } from 'src/context';
import { THEME } from '../theme';

// Styled components
const ResourceDetailContainer = styled.div`
  display: flex;
  margin-bottom: ${THEME.spacing.space20};
  flex-wrap: wrap;
`;

const DetailItem = styled.div`
  width: 50%;
  display: flex;
  margin: ${THEME.spacing.space8} 0;
`;

const DetailLabel = styled.div`
  width: 50%;
  color: ${THEME.colors.mainPurple};
  font-weight: ${THEME.fontWeights.bold};
`;

const DetailValue = styled.div`
  width: 50%;
`;

const ResourceDetail = ({ tableData }) => {
  const { timeContext } = useGlobalContext();
  const covertTime = useCallback(
    date => {
      return covertToCurrentTime(date, timeContext.timeFormat);
    },
    [timeContext]
  );
  return (
    <ResourceDetailContainer>
      <DetailItem>
        <DetailLabel>
          <Intl id='name' />
        </DetailLabel>
        <DetailValue>{tableData.tableReference.tableId}</DetailValue>
      </DetailItem>
      <DetailItem>
        <DetailLabel>
          <Intl id='type' />
        </DetailLabel>
        <DetailValue>{tableData.type}</DetailValue>
      </DetailItem>
      <DetailItem>
        <DetailLabel>
          <Intl id='location' />
        </DetailLabel>
        <DetailValue>{tableData.location}</DetailValue>
      </DetailItem>
      <DetailItem>
        <DetailLabel>
          <Intl id='des' />
        </DetailLabel>
        <DetailValue>{tableData.description}</DetailValue>
      </DetailItem>
      <DetailItem>
        <DetailLabel>
          <Intl id='createtime' />
        </DetailLabel>
        <DetailValue>{covertTime(Number(tableData.creationTime))}</DetailValue>
      </DetailItem>
    </ResourceDetailContainer>
  );
};

export default ResourceDetail;
