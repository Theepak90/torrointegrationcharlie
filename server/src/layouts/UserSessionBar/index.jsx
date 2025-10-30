/* third lib*/
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';

/* MUI */
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

/* local components & methods */
import { THEME } from '@comp/theme';
import { useGlobalContext } from 'src/context';
import { USER, GOVERNOR, IT, ADMIN } from 'src/lib/data/roleType.js';
// import LANGUAGE from "src/lib/data/languageType";
import TIME_FORMAT from 'src/lib/data/timeFormatOption';
import Model from '@basics/Modal';
import NotifyTable from './NotifyTable';
import DoubleSquare from '@assets/icons/DoubleSquare';
import DoubleCircle from '@assets/icons/DoubleCircle';
import DoubleTriangle from '@assets/icons/DoubleTriangle';
import LeftNav from 'src/components/LeftNav';
import Text from '@basics/Text';
import Torro from '@assets/icons/Torrotext';
import CallModal from '@basics/CallModal';
import Select from '@basics/Select';
import { sendNotify } from 'src/utils/systerm-error';
import { updateLogin, readNotify } from '@lib/api';
import decode from 'src/utils/encode.js';

const BASE_API_URL =
  import.meta.env.VITE_API_URL || 'https://torroportal.online';

// Styled Components
const UserSessionBar = styled.div`
  width: 100%;
  height: ${THEME.sizes.sessionBarHeight};
  background-color: ${THEME.colors.darkPurple};
  position: relative;
  padding: 0 ${THEME.spacing.space32} 0 ${THEME.spacing.space20};
  box-shadow: ${THEME.shadows.boxShadow};
`;

const UserSessionContent = styled.div`
  width: 100%;
  height: ${THEME.sizes.sessionBarHeight};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Menu = styled.div`
  color: ${THEME.colors.white};
  margin-right: ${THEME.spacing.space12};
  cursor: pointer;
`;

const Logo = styled.div`
  color: ${THEME.colors.white};
  margin-right: ${THEME.spacing.space20};
  display: flex;
  align-items: center;

  svg {
    width: 8rem;
    height: auto;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  color: ${THEME.colors.white};
`;

const RightBox = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .toolIcon {
    margin: 0 5px;
    position: relative;
    cursor: pointer;
    &:last-child {
      margin-right: ${THEME.spacing.space12};
    }
  }
  .svgIcon {
    width: 2rem;
    color: ${THEME.colors.white};
    height: 2rem;
    margin: 0 5px;
    display: inline-block;
  }
  .profileIcon {
    width: 2rem;
    color: ${THEME.colors.white};
    height: 2rem;
    margin: 0 5px;
    display: inline-block;
    border-radius: 100%;
  }
  .iconLabel {
    font-size: 1rem;
    color: ${THEME.colors.white};
    display: inline-block;
  }
`;

const NotificaNum = styled.div`
  width: 1rem;
  height: 1rem;
  background-color: ${THEME.colors.darkRed};
  border-radius: 50%;
  color: ${THEME.colors.white};
  font-size: 0.75rem;
  text-align: center;
  line-height: 1rem;
  position: absolute;
  bottom: ${THEME.spacing.space8};
  right: 6px;
`;

const CartNum = styled.div`
  width: 1rem;
  height: 1rem;
  background-color: ${THEME.colors.darkRed};
  border-radius: 1rem;
  color: ${THEME.colors.white};
  font-size: 0.75rem;
  text-align: center;
  line-height: 1rem;
  position: absolute;
  bottom: ${THEME.spacing.space8};
  right: 6px;

  &.ten {
    width: 1.25rem;
    right: 2px;
  }
  &.hundred {
    width: 1.75rem;
    right: -4px;
  }
`;

const UserTag = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 1.8rem !important;
    margin-right: ${THEME.spacing.space8} !important;
  }
`;

const OptionsBox = styled.div`
  height: ${THEME.sizes.sessionBarHeight};

  > div {
    color: ${THEME.colors.white} !important;
    background: transparent !important;
    height: 100%;
    box-sizing: border-box;

    svg {
      color: ${THEME.colors.white};
    }
    > div {
      padding: 0 1rem;
      line-height: 2.5rem;
      background-color: transparent !important;
    }
  }
`;

const NewNotify = styled(Typography)`
  padding: ${THEME.spacing.space20};
  color: ${THEME.colors.darkPurple};
  background-color: ${THEME.colors.white};
  border-radius: 4px;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.25);
`;

const LinerProgress = styled.div`
  height: 2px;
  width: 100%;
  position: absolute;
  bottom: 0;
  background-color: ${THEME.colors.lightPurple};
`;

const ActiveProgess = styled.div`
  width: 0;
  height: 100%;
  background-color: ${THEME.colors.darkPurple};

  &.active {
    width: 100%;
    transition: 3s width linear;
  }
`;

const UserName = styled.div`
  span {
    max-width: 15rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    white-space: nowrap;
  }
`;

const UserTagComponent = ({ role }) => {
  const { setAuth, authContext } = useGlobalContext();
  let navigate = useNavigate();

  const navigateToRoleSelect = useCallback(() => {
    if (authContext.roleList.length > 1) {
      setAuth({
        ...authContext,
        role: '',
      });
      navigate('/roleSelect', {
        replace: true,
      });
    }
  }, [setAuth, authContext, navigate]);

  return (
    <UserTag onClick={navigateToRoleSelect}>
      {role === ADMIN && (
        <div className='iconLabel'>
          <Intl id='serviceAdmin' />
        </div>
      )}
      {role === IT && (
        <>
          <DoubleTriangle className='svgIcon' />
          <div className='iconLabel'>
            <Intl id='it' />
          </div>
        </>
      )}
      {role === GOVERNOR && (
        <>
          <DoubleCircle className='svgIcon' />
          <div className='iconLabel'>
            <Intl id='dg' />
          </div>
        </>
      )}
      {role === USER && (
        <>
          <DoubleSquare className='svgIcon' />
          <div className='iconLabel'>
            <Intl id='du' />
          </div>
        </>
      )}
    </UserTag>
  );
};
let progressTimer = null;
let achorTimer = null;

const UserSessionBarComponent = () => {
  const {
    authContext,
    setAuth,
    timeContext,
    setTimeFormat,
    cartContext,
    themeContext,
    // languageContext,
    // setLanguage,
  } = useGlobalContext();
  const navigate = useNavigate();
  const bellRef = useRef();
  const { Encrypt } = decode;

  const [notify, setNotify] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [triggerProgress, setTriggerProgress] = useState(0);
  const [timeZoneOption, setTimeZoneOption] = useState();
  const [socket, setSocket] = useState();

  const open = Boolean(anchorEl);
  const id = open ? 'simple-Popper' : undefined;

  const [modalData, setModalData] = useState({
    open: false,
    status: 0,
    content: '',
  });

  const isLogin = useMemo(() => {
    return authContext.userId && authContext.userId !== 'null';
  }, [authContext.userId]);

  const haveRole = useMemo(() => {
    return !!authContext.role && authContext.role !== 'null';
  }, [authContext.role]);

  const isServiceAdmin = useMemo(() => {
    return authContext.role === ADMIN;
  }, [authContext.role]);

  const haveWs = useMemo(() => {
    return authContext.wsList.length > 0 && !!authContext.wsId;
  }, [authContext.wsList, authContext.wsId]);

  const displayNav = useMemo(() => {
    return isLogin && (haveRole || isServiceAdmin) && haveWs;
  }, [isLogin, haveRole, isServiceAdmin, haveWs]);

  const unRead = useMemo(() => {
    return notify.filter(item => !item.is_read);
  }, [notify]);

  const handleClose = useCallback(() => {
    setShowNav(false);
  }, []);

  const notifyClickHandle = useCallback(() => {
    setOpenModel(true);
    setAnchorEl(false);
  }, []);

  const closeHandle = useCallback(() => {
    setOpenModel(false);
  }, []);

  // workspace change
  const handleWsChange = useCallback(
    value => {
      let postData = {
        workspace_id: value,
        role_name: authContext.role !== ADMIN ? '' : ADMIN,
      };
      updateLogin(postData)
        .then(res => {
          if (res.data) {
            setAuth(
              {
                ...authContext,
                role: res.data.role_name,
                roleList: res.data.role_list,
                wsId: Number(res.data.workspace_id),
                wsList: res.data.workspace_list,
              },
              'refreshToken'
            );
            setTimeout(() => {
              window.location.reload();
            }, 0);
          }
        })
        .catch(e => {
          sendNotify({
            msg: e.message,
            status: 3,
            show: true,
          });
        });
    },
    [setAuth, authContext]
  );

  // signOut
  const signOut = useCallback(() => {
    setAuth(
      {
        userName: '',
        userId: '',
        accountId: '',
        roleList: [],
        role: '',
        init: false,
        wsList: [],
        wsId: '',
        ad_group_list: [],
      },
      'logout'
    );
  }, [setAuth]);

  const exitHandle = useCallback(() => {
    setModalData({
      open: true,
      status: 1,
      content: <Intl id='confirmLogout' />,
      cb: signOut,
    });
  }, [signOut]);

  const setUnRead = useCallback(
    id => {
      setNotify(
        notify.map(item => {
          if (item.id === id) {
            item.is_read = 1;
          }
          return item;
        })
      );
    },
    [notify]
  );

  const readAll = useCallback(() => {
    let unReadIdList = unRead.map(item => item.id);
    readNotify({ nodify_id: unReadIdList, is_read: 1 })
      .then(res => {
        if (res.code === 200) {
          setNotify(
            notify.map(not => {
              if (unReadIdList.includes(not.id)) {
                not.is_read = 1;
              }
              return not;
            })
          );
        }
      })
      .catch(e => {
        sendNotify({
          msg: e.message,
          status: 3,
          show: true,
        });
      });
  }, [unRead, notify]);

  // System notify
  const viewRequest = useCallback(
    (requestId, id) => {
      closeHandle();
      setUnRead(id);
      readNotify({ nodify_id: id, is_read: 1 })
        .then(res => {})
        .catch(e => {
          sendNotify({
            msg: e.message,
            status: 3,
            show: true,
          });
        });
      navigate(`/app/approvalFlow?id=${requestId}`);
    },
    [navigate, closeHandle, setUnRead]
  );

  const openNotifyTips = useCallback(() => {
    if (progressTimer || achorTimer) {
      return;
    }
    setAnchorEl(bellRef.current);
    setTriggerProgress(false);

    progressTimer = setTimeout(() => {
      setTriggerProgress(true);
      clearTimeout(progressTimer);
      progressTimer = null;
    }, 0);

    achorTimer = setTimeout(() => {
      setAnchorEl(null);
      clearTimeout(achorTimer);
      achorTimer = null;
    }, 3000);
  }, [bellRef]);

  const shoppingCartClickHandle = useCallback(() => {
    navigate('/app/getDataAccess', {
      replace: true,
    });
  }, [navigate]);

  useEffect(() => {
    if (themeContext.timeZone) {
      let existOption = themeContext.timeZone.split(',') || [];
      setTimeZoneOption(
        TIME_FORMAT.filter(item => {
          return existOption.includes(item.label);
        })
      );
    }
  }, [themeContext]);

  const receiveMessagee = useCallback(
    e => {
      let res = JSON.parse(e.data);
      if (res.data) {
        setNotify(res.data);
        let unReadList = res.data.filter(item => !item.is_read);
        if (unReadList.length > unRead.length) {
          openNotifyTips();
        }
      }
    },
    /* eslint-disable */
    [unRead]
    /* eslint-disable */
  );

  useEffect(() => {
    if (authContext.userCN) {
      var token = Encrypt(String(authContext.userCN));
      var webSokect = new WebSocket(
        `${BASE_API_URL.replace('https://', 'wss://')}/torro?token=` + token
      );
      webSokect.onopen = () => {
        console.log('WebSocket Client Connected');
        setSocket(webSokect);
      };
    }
  }, [authContext.userId]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = receiveMessagee;
    }
  }, [socket, receiveMessagee]);

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <UserSessionBar>
        <UserSessionContent>
          <LeftBox>
            {displayNav && (
              <Menu
                onClick={() => {
                  setShowNav(true);
                }}
              >
                <MenuIcon />
              </Menu>
            )}
            <Logo>
              <Torro />
            </Logo>
            {authContext.wsList.length > 0 && authContext.wsId && (
              <OptionsBox>
                <Select
                  value={authContext.wsId}
                  options={authContext.wsList}
                  disableFullwidth={true}
                  onChange={value => {
                    handleWsChange(value);
                  }}
                />
              </OptionsBox>
            )}
          </LeftBox>
          <div>
            <UserInfo>
              <RightBox>
                {/* <div className={styles.optionsBox}>
                  <Select
                    value={languageContext.lang}
                    options={LANGUAGE}
                    disableFullwidth={true}
                    onChange={(value) => {
                      setLanguage({
                        ...languageContext,
                        lang: value,
                      });
                    }}
                  />
                </div> */}

                {isLogin && (
                  <>
                    <OptionsBox>
                      <Select
                        value={timeContext.timeFormat}
                        options={timeZoneOption}
                        disableFullwidth={true}
                        onChange={value => {
                          setTimeFormat({
                            ...timeContext,
                            timeFormat: value,
                          });
                        }}
                      />
                    </OptionsBox>
                    <div
                      className='toolIcon'
                      onClick={shoppingCartClickHandle}
                      ref={bellRef}
                    >
                      <ShoppingCartIcon className='svgIcon' />
                      {cartContext.cartList.length > 0 && (
                        <CartNum
                          className={cn({
                            ten: 9 < cartContext.cartList.length < 100,
                            hundred: cartContext.cartList.length > 99,
                          })}
                        >
                          {cartContext.cartList.length > 99
                            ? '99+'
                            : cartContext.cartList.length}
                        </CartNum>
                      )}
                    </div>

                    <div
                      className='toolIcon'
                      onClick={notifyClickHandle}
                      ref={bellRef}
                    >
                      <NotificationsIcon className='svgIcon' />
                      {unRead.length > 0 && <NotificaNum></NotificaNum>}
                      <div>
                        <Popper
                          id={id}
                          open={open}
                          anchorEl={anchorEl}
                          onClose={() => {
                            setAnchorEl(null);
                          }}
                          placement='bottom'
                        >
                          <NewNotify>
                            <Text type='subTitle'>
                              <Intl id='gotNewRequest' />
                            </Text>
                          </NewNotify>
                          <LinerProgress>
                            <ActiveProgess
                              className={cn({
                                active: triggerProgress,
                              })}
                            ></ActiveProgess>
                          </LinerProgress>
                        </Popper>
                      </div>
                    </div>
                    {authContext.role && (
                      <div className='toolIcon'>
                        <UserTagComponent role={authContext.role} />
                      </div>
                    )}

                    <div className='toolIcon'>
                      <AccountCircleIcon className='svgIcon' />
                    </div>
                    <UserName title={authContext.userName}>
                      <Text>{authContext.userName}</Text>
                    </UserName>
                    <div className='toolIcon' title='Exit'>
                      <ExitToAppIcon onClick={exitHandle} className='svgIcon' />
                    </div>
                  </>
                )}
              </RightBox>
            </UserInfo>
          </div>
          <Model open={openModel} handleClose={closeHandle}>
            <NotifyTable
              notify={notify}
              viewRequest={viewRequest}
              unRead={unRead}
              readAll={readAll}
            />
          </Model>
          <CallModal
            open={modalData.open}
            content={modalData.content}
            status={modalData.status}
            handleClose={() => {
              setModalData({
                ...modalData,
                open: false,
              });
            }}
            buttonClickHandle={modalData.cb}
          />
        </UserSessionContent>

        {displayNav && <LeftNav open={showNav} closeHandle={handleClose} />}
      </UserSessionBar>
    </ClickAwayListener>
  );
};

export default UserSessionBarComponent;
