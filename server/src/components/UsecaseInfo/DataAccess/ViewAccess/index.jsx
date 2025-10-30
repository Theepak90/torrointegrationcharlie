/* third lib*/
import React, { useState, useEffect } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';
import { THEME } from '@comp/theme';

/* MUI */
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';

/* local components & methods */
import OnboardDataDisplay from '@comp/OnboardDataDisplay';
import Model from '@basics/Modal';
import { getTableSchema } from '@lib/api';
import TableTagDisplay from '@comp/TableTag';
import Loading from '@assets/icons/Loading';
import Text from '@basics/Text';
import { sendNotify } from 'src/utils/systerm-error';

const ViewIcon = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    svg {
      color: ${THEME.colors.mainPurple};
    }
  }
`;

const TableTags = ({ data, resourceDetail }) => {
  const [tableTag, setTableTag] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getTableSchema({
      projectId: resourceDetail.project_id,
      datasetName: resourceDetail.dataset_id,
      tableName: resourceDetail.table_id,
    })
      .then(res => {
        if (res.data) {
          setTableTag(res.data.tags);
          setLoading(false);
        }
      })
      .catch(e => {
        sendNotify({ msg: e.message, status: 3, show: true });
      });
  }, [resourceDetail]);

  if (!tableTag || loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Loading />
      </div>
    );
  }
  return (
    <div>
      {tableTag.map((tag, index) => {
        return <TableTagDisplay key={index} tagData={tag} />;
      })}
    </div>
  );
};

const ViewAccess = ({ data, resourceDetail }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <ViewIcon>
        <RemoveRedEye
          onClick={() => {
            setOpen(true);
          }}
        />
      </ViewIcon>

      <Model
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
      >
        <div style={{ marginTop: THEME.spacing.space20 }}>
          <div style={{ marginBottom: THEME.spacing.space20 }}>
            <div
              style={{
                color: THEME.colors.mainPurple,
                marginBottom: THEME.spacing.space20,
              }}
            >
              <Text type='title'>
                <Intl id='tableTags' />
              </Text>
            </div>
            <TableTags resourceDetail={resourceDetail} />
          </div>
          <div style={{ marginBottom: THEME.spacing.space20 }}>
            <div
              style={{
                color: THEME.colors.mainPurple,
                marginBottom: THEME.spacing.space20,
              }}
            >
              <Text type='title'>
                <Intl id='tableSchema' />
              </Text>
            </div>
            <OnboardDataDisplay tableList={data} />
          </div>
        </div>
      </Model>
    </div>
  );
};

export default ViewAccess;
