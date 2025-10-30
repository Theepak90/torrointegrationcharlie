/* third lib*/
import React, { useState, useCallback, useMemo } from 'react';
import cn from 'classnames';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';

/* local Component*/
import Frequently from './Frequently';
import RecordTable from './RecordTable';
import Text from '@basics/Text';
import { useGlobalContext } from 'src/context';
import { GOVERNOR, IT, ADMIN, USER } from 'src/lib/data/roleType.js';
import { COLORS, SPACING } from '@comp/theme';

const DataUserViewContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const FrequentlyUsed = styled.div`
  display: flex;
  align-items: center;
  color: ${COLORS.mainPurple};
  margin: ${SPACING.space20} 0;
`;

const DataContent = styled.div`
  padding: ${SPACING.space20};
  background-color: ${COLORS.white};
  border-radius: 4px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TabContainer = styled.div`
  display: flex;
`;

const TabItem = styled.div`
  color: ${COLORS.mainPurple};
  padding: 0 ${SPACING.space20};
  height: 3.25rem;
  line-height: 3.25rem;
  display: inline-block;
  border-radius: 4px;
  cursor: pointer;

  &.active {
    color: ${COLORS.white};
    background-color: ${COLORS.darkPurple};
  }
`;

const TabContent = styled.div`
  flex: 1;
  box-sizing: border-box;
  overflow: hidden;
`;

const ROOT = '/app';
const DataUserView = () => {
  const { authContext } = useGlobalContext();
  const [currentTab, setCurrentTab] = useState(2);

  const tabList = [
    { label: 'Your Requests', value: 2 },
    { label: 'Waiting Your Approval', value: 3 },
  ];

  const favoritLlinks = useMemo(() => {
    switch (authContext.role) {
      case IT:
        return [
          {
            id: 'wsMan',
            title: <Intl id='wsMan' />,
            link: `${ROOT}/WorkspaceManage`,
          },
        ];
      case ADMIN:
        return [
          {
            id: 'wsMan',
            title: <Intl id='wsMan' />,
            link: `${ROOT}/WorkspaceManage`,
          },
        ];
      case GOVERNOR:
        return [
          {
            id: 'policyMan',
            title: <Intl id='policyMan' />,
            link: `${ROOT}/policyCreation`,
          },
          {
            id: 'dataOnboarding',
            title: <Intl id='dataOnboarding' />,
            link: `${ROOT}/dataOnboarding`,
          },
          {
            id: 'exploration',
            title: <Intl id='exploration' />,
            link: `${ROOT}/exploration`,
          },
          {
            id: 'batchUpload',
            title: <Intl id='batchUpload' />,
            link: `${ROOT}/batchUpload`,
          },
        ];
      case USER:
        return [
          {
            id: 'createUc',
            title: <Intl id='createUc' />,
            link: `${ROOT}/forms?id=2`,
          },
          {
            id: 'getDataAccess',
            title: <Intl id='getDataAccess' />,
            link: `${ROOT}/getDataAccess`,
          },
        ];

      default:
        return [];
    }
  }, [authContext.role]);

  const tabClickHandle = useCallback(value => {
    setCurrentTab(value);
  }, []);

  const currentContent = useCallback(() => {
    switch (currentTab) {
      case 2:
        return <RecordTable />;
      case 3:
        return <RecordTable approved />;
      default:
        return <></>;
    }
  }, [currentTab]);

  return (
    <DataUserViewContainer>
      <DataContent>
        <FrequentlyUsed>
          <Text type='subTitle'>
            <Intl id='frequentlyUsed' />:
          </Text>
          <Frequently favoritLlinks={favoritLlinks} />
        </FrequentlyUsed>
        <TabContainer>
          {tabList.map(item => {
            return (
              <TabItem
                key={item.label}
                onClick={() => {
                  tabClickHandle(item.value);
                }}
                className={cn({
                  active: item.value === currentTab,
                })}
              >
                <Text type='subTitle'>{item.label}</Text>
              </TabItem>
            );
          })}
        </TabContainer>
        <TabContent>{currentContent()}</TabContent>
      </DataContent>
    </DataUserViewContainer>
  );
};

export default DataUserView;
