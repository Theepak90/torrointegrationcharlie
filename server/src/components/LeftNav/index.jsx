/* third lib */
import React, { useEffect, useMemo } from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { FormattedMessage as Intl } from 'react-intl';
import ScrollBar from 'react-perfect-scrollbar';
import styled from '@emotion/styled';

/* local components & methods */
import Text from '@basics/Text';
import Dashboard from '@assets/icons/Dashboard';
import { COLORS, SPACING, FONT_SIZES, SIZES, SHADOWS } from '@comp/theme';
import { getFormList } from '@lib/api';
import { useGlobalContext } from 'src/context';
import { GOVERNOR, IT, ADMIN } from 'src/lib/data/roleType.js';
import { SUCCESS } from 'src/lib/data/callStatus';
import { sendNotify } from 'src/utils/systerm-error';
import { GoVerified } from 'react-icons/go';
import { IoMdAnalytics } from 'react-icons/io';
import { MdOutlineMiscellaneousServices } from 'react-icons/md';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

// Styled components
const NavItem = styled.div`
  color: ${COLORS.white};
  display: flex;
  align-items: center;
  padding-left: ${SPACING.space20};
  &:hover {
    background-color: ${COLORS.mainPurple};
    > div:last-child {
      display: flex;
    }
  }
`;

const SecondNavPanel = styled.div`
  display: none;
  position: absolute;
  width: 25rem;
  height: calc(100vh - ${SIZES.sessionBarHeight});
  background-color: ${COLORS.lightPurple};
  top: 0;
  left: 18rem;
  z-index: 999;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  color: ${COLORS.darkPurple};
  box-sizing: border-box;
  flex-direction: column;
  box-shadow:
    rgba(0, 0, 0, 0.16) 0px 3px 6px,
    rgba(0, 0, 0, 0.23) 0px 3px 6px;
`;

const SecondNav = styled.div`
  width: 100%;
  min-height: 3rem;
  padding: ${SPACING.space8} ${SPACING.space20};
  line-height: 1.5;
  cursor: pointer;
  &:hover {
    background-color: ${COLORS.white};
    .secondNavLabel {
      margin-left: ${SPACING.space12};
    }
  }
`;

const SecondNavLabel = styled.div`
  transition: 0.2s all;
  color: ${COLORS.darkPurple};
`;

const ROOT = '/app';
const wsCreate = {
  id: 'wsCreate',
  title: <Intl id='createWs' />,
  link: `${ROOT}/WorkspaceCreation`,
};
const wsItemList = [
  {
    id: 'wsMan',
    title: <Intl id='wsMan' />,
    link: `${ROOT}/WorkspaceManage`,
  },

  {
    id: 'workflowManagement',
    title: <Intl id='workflowManagement' />,
    link: `${ROOT}/workflowManagement`,
  },
];
const dataGorList = [
  {
    id: 'policyMan',
    title: <Intl id='policyMan' />,
    link: `${ROOT}/policyManagement`,
  },
  {
    id: 'metadataTagsManagement',
    title: 'Data Governor Tag Template',
    link: `${ROOT}/dataGovernorTagTemplate`,
  },
  {
    id: 'catalogueDataAssets',
    title: 'Catalogue Data Assets',
    link: `${ROOT}/dataOnboarding`,
  },
  {
    id: 'dataMonitoring',
    title: <Intl id='dataMonitoring' />,
    link: `${ROOT}/dataMonitoring`,
  },
  {
    id: 'formManagement',
    title: <Intl id='formManagement' />,
    link: `${ROOT}/formManagement`,
  },
  {
    id: 'batchUpload',
    title: <Intl id='batchUpload' />,
    link: `${ROOT}/batchUpload`,
  },
];

const itIfraList = [
  {
    id: 'dataProjectMan',
    title: 'Add/Delete/Revoke Data Project',
    link: '',
  },
  {
    id: 'usecaseInfraMan',
    title: 'Add/Revoke Infra to Use Case',
    link: '',
  },
  {
    id: 'useCaseUserMan',
    title: 'Revoke Users from Use Cases',
    link: '',
  },
  {
    id: 'bashCommand',
    title: <Intl id='bashCommand' />,
    link: `${ROOT}/bashCommand`,
  },
];

const raiseTicketExt = [
  //   {
  //     id: "createUc",
  //     title: <Intl id="createUc" />,
  //     link: `${ROOT}/forms?id=2`,
  //   },
  //   {
  //     id: "getDataAccess",
  //     title: <Intl id="getDataAccess" />,
  //     link: `${ROOT}/getDataAccess`,
  //   },
];

const LinkWrapper = ({ children, link, closeHandle }) => {
  if (link) {
    return (
      <Link onClick={closeHandle} to={link}>
        {children}
      </Link>
    );
  }
  return <>{children}</>;
};

const LeftNav = ({ open, closeHandle }) => {
  const { authContext, formListContext, setFormContext } = useGlobalContext();

  const formList = useMemo(() => {
    return formListContext.userList.map(item => {
      return {
        ...item,
        link: `${ROOT}/forms?id=${item.id}`,
      };
    });
  }, [formListContext]);

  const dataAnalyticList = useMemo(() => {
    const sortList = [
      {
        id: 'dataOnboarding',
        title: <Intl id='dataOnboarding' />,
        link: `${ROOT}/dataOnboarding`,
      },
      {
        id: 2,
        title: 'Create Data Projects or Use Cases',
        link: '/app/forms?id=2',
      },
      {
        id: 434,
        title: 'Add User to Use Case',
        link: '/app/forms?id=434',
      },
      {
        id: 'exploration',
        title: <Intl id='exploration' />,
        link: `${ROOT}/exploration`,
      },
      {
        id: 'getDataAccess',
        title: <Intl id='getDataAccess' />,
        link: `${ROOT}/getDataAccess`,
      },
      {
        id: 'manualFileUpload',
        title: 'Manual File Upload Use Case',
        link: '',
      },
      {
        id: 'downloadData',
        title: 'Downlaod Data from Use Case',
        link: '',
      },
    ];
    const formListMap = new Map(formList.map(item => [item.id, item]));
    for (let i = 0; i < sortList.length; i++) {
      if (formListMap.has(sortList[i].id)) {
        sortList[i] = formListMap.get(sortList[i].id);
        formListMap.delete(sortList[i].id);
      }
    }
    sortList.push(...formListMap.values());

    return sortList;
  }, [formList]);

  const navList = useMemo(() => {
    const adminItem = {
      link: `${ROOT}/admin`,
      id: 'admin',
      icon: Dashboard,
    };
    const dashboardItem = {
      link: `${ROOT}/dashboard`,
      id: 'dashboard',
      icon: Dashboard,
    };
    const wsManagementAdmin = {
      link: '',
      id: 'wsManagement',
      leftPanel: true,
      icon: AccountBalanceIcon,
      list: [wsCreate].concat(wsItemList),
    };
    const wsManagementOther = {
      link: '',
      id: 'wsManagement',
      leftPanel: true,
      icon: AccountBalanceIcon,
      list: wsItemList,
    };
    const dataGovernaceService = {
      link: '',
      id: 'dataGovernaceService',
      leftPanel: true,
      icon: GoVerified,
      list: dataGorList,
    };
    const dataAnalyticsService = {
      link: '',
      id: 'dataAnalyticsService',
      leftPanel: true,
      icon: IoMdAnalytics,
      list: dataAnalyticList,
    };
    const dataNexus = {
      link: '',
      id: 'dataNexus',
      leftPanel: true,
      icon: IoMdAnalytics,
      list: [
        { id: 'dnConnectors', title: 'Connectors', link: `${ROOT}/connectors` },
        { id: 'dnDiscoveredAssets', title: 'Discovered Assets', link: `${ROOT}/assets` },
        { id: 'dnLineage', title: 'Data Lineage', link: `${ROOT}/dataLineage` },
        { id: 'dnPublishMarketplace', title: 'Publish Data Asset to Marketplace', link: `${ROOT}/marketplace` },
        { id: 'dnTrinoGovernance', title: 'Trino Governance Control', link: `${ROOT}/trinoGovernanceControl` },
      ],
    };
    const inInfraServices = {
      link: '',
      id: 'inInfraServices',
      leftPanel: true,
      icon: MdOutlineMiscellaneousServices,
      list: itIfraList,
    };

    switch (authContext.role) {
      case ADMIN:
        return [
          adminItem,
          dashboardItem,
          wsManagementAdmin,
          dataGovernaceService,
          dataAnalyticsService,
          dataNexus,
          inInfraServices,
        ];
      case IT:
        return [
          dashboardItem,
          wsManagementOther,
          dataGovernaceService,
          dataAnalyticsService,
          dataNexus,
          inInfraServices,
        ];
      case GOVERNOR:
        return [
          dashboardItem,
          wsManagementOther,
          dataGovernaceService,
          dataAnalyticsService,
          dataNexus,
        ];
      default:
        return [dashboardItem, dataAnalyticsService, dataNexus];
    }
  }, [authContext.role, dataAnalyticList]);

  useEffect(() => {
    getFormList()
      .then(res => {
        if (res && res.code === SUCCESS) {
          setFormContext(res.data);
        }
      })
      .catch(e => {
        sendNotify({
          msg: e.message,
          status: 3,
          show: true,
        });
      });

    /* eslint-disable */
  }, []);

  return (
    <div
      className={cn({ active: open })}
      style={{
        height: `calc(100vh - ${SIZES.sessionBarHeight})`,
        width: '18rem',
        backgroundColor: COLORS.darkPurple,
        position: 'absolute',
        paddingTop: '0.5rem',
        left: open ? '0' : '-18rem',
        top: SIZES.sessionBarHeight,
        zIndex: 999,
        transition: '0.5s all',
        boxShadow: SHADOWS.boxShadow,
      }}
    >
      {navList.map(item => {
        const Icon = item.icon;
        return (
          <LinkWrapper key={item.id} link={item.link} closeHandle={closeHandle}>
            <NavItem>
              {Icon && (
                <Icon
                  style={{
                    width: '2rem',
                    height: '2rem',
                    marginRight: '0.5rem',
                    color: COLORS.white,
                  }}
                />
              )}
              <div
                style={{
                  color: COLORS.white,
                  lineHeight: '3rem',
                  width: '12.5rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                }}
              >
                <Text type='large'>
                  <Intl id={item.id} />
                </Text>
              </div>
              {item.leftPanel && item.list.length > 0 && (
                <SecondNavPanel>
                  <div
                    style={{
                      fontSize: FONT_SIZES.fontSize2,
                      marginTop: '3.625rem',
                      marginLeft: SPACING.space20,
                    }}
                  >
                    <Text type='title'>
                      <Intl id={item.id} />
                    </Text>
                  </div>
                  <div
                    style={{
                      marginBottom: SPACING.space36,
                      marginLeft: SPACING.space20,
                    }}
                  >
                    <Text>
                      <Intl id='pickStart' />
                    </Text>
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <ScrollBar>
                      {item.list.map(item => {
                        return (
                          <Link
                            onClick={closeHandle}
                            key={`form-${item.id}`}
                            to={item.link}
                          >
                            <SecondNav>
                              <SecondNavLabel className='secondNavLabel'>
                                <Text type='subTitle'>{item.title}</Text>
                              </SecondNavLabel>
                            </SecondNav>
                          </Link>
                        );
                      })}
                    </ScrollBar>
                  </div>
                </SecondNavPanel>
              )}
            </NavItem>
          </LinkWrapper>
        );
      })}
    </div>
  );
};

export default LeftNav;
