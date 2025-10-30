/* third lib*/
import React, { useState, useEffect, useMemo } from 'react';
import ScrollBar from 'react-perfect-scrollbar';
import styled from '@emotion/styled';

/* material-ui */

/* local components & methods */
import Loading from '@assets/icons/Loading';
import { getTags, getPolicys } from '@lib/api';
import { sendNotify } from 'src/utils/systerm-error';
import TableSchema from './TableSchema';
import { THEME } from '../theme';

// Styled components
const DataOnboardingContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  min-width: 90rem;
`;

const OnboardDataDisplay = ({ tableList }) => {
  const [policys, setPolicys] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [tagTemplateList, setTagTempalteList] = useState([]);

  const policyMap = useMemo(() => {
    let map = {};
    if (policys.length > 0) {
      policys.forEach(item => {
        if (item.policy_tags_dict) {
          map = {
            ...map,
            ...item.policy_tags_dict,
          };
        }
      });
    }
    return map;
  }, [policys]);

  useEffect(() => {
    setFormLoading(true);
    Promise.all([getPolicys(), getTags()])
      .then(res => {
        let res1 = res[0];
        let res2 = res[1];

        if (res1.data && res2.data) {
          setPolicys(res1.data);
          setTagTempalteList(res2.data);
          setFormLoading(false);
        }
      })
      .catch(e => {
        sendNotify({ msg: e.message, status: 3, show: true });
      });
  }, []);

  return (
    <DataOnboardingContainer>
      <ScrollBar>
        {formLoading && <Loading></Loading>}
        {!formLoading && (
          <>
            <TableSchema
              tableList={tableList}
              tagTemplateList={tagTemplateList}
              policyMap={policyMap}
            />
          </>
        )}
      </ScrollBar>
    </DataOnboardingContainer>
  );
};

export default OnboardDataDisplay;
