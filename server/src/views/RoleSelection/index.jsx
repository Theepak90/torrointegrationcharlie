/* third lib*/
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';

/* local components & methods */
import Torro from '@assets/icons/Torro';
import { default as dataUser } from '@assets/roleBtn/dataUser.svg';
import { default as dataGovernor } from '@assets/roleBtn/dataGovernor.svg';
import { default as itAdmin } from '@assets/roleBtn/itAdmin.svg';
import { SPACING, COLORS, FONT_SIZES } from '@comp/theme';
import { useGlobalContext } from 'src/context';
import { USER, GOVERNOR, IT } from 'src/lib/data/roleType.js';
import withAuthentication from 'src/hoc/withAuthentication';
import { updateLogin } from '@lib/api';
import { sendNotify } from 'src/utils/systerm-error';

// Styled components
const RoleSelectionContainer = styled.div`
  position: relative;

  .logo {
    width: 185px;
    height: 57px;
    position: absolute;
    left: calc(50% - 92px);
    top: 70px;
  }
`;

const MessageBox = styled.div`
  width: 48rem;
  height: 5.625rem;
  position: absolute;
  left: calc(50% - 24rem);
  top: 15.3125rem;
  text-align: center;
`;

const UserName = styled.div`
  font-size: ${FONT_SIZES.fontSize2};
  color: ${COLORS.mainPurple};
`;

const Message = styled.div`
  font-size: ${FONT_SIZES.fontSize3};
  line-height: 2.5rem;
  color: ${COLORS.color11};
  margin-top: ${SPACING.space20};
`;

const WsName = styled.span`
  color: ${COLORS.mainPurple};
`;

const RoleGroup = styled.div`
  position: absolute;
  top: 30rem;
  display: flex;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
`;

const BtnItem = styled.div`
  width: 18.75rem;
  height: 11.75rem;
  margin: 0 4.5rem 4.5rem 4.5rem;
  cursor: pointer;

  &:last-child(3) {
    margin: 0;
  }
`;

const Btn = styled.img`
  width: 18.75rem;
  height: 7.5rem;
`;

const BtnText = styled.div`
  font-size: 1.875rem;
  text-align: center;
  margin-top: ${SPACING.space24};
`;

const roleTextMap = {
  GOVERNOR: 'DATA GOVERNOR',
  IT: 'IT ADMIN',
  USER: 'DATA USER',
};

const RoleSelection = () => {
  const { setAuth, authContext } = useGlobalContext();

  let navigate = useNavigate();

  const selectRoleHandle = role => {
    updateLogin({ role_name: role })
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
          navigate('/app/dashboard');
        }
      })
      .catch(e => {
        sendNotify({
          msg: e.message,
          status: 3,
          show: true,
        });
      });
  };

  /* temp logic start */
  const roleList = useMemo(() => {
    const realRoles = ['USER', 'IT', 'GOVERNOR'];
    if (authContext.roleList.length > 0) {
      return authContext.roleList.filter(role => realRoles.includes(role));
    } else {
      return [];
    }
  }, [authContext.roleList]);

  const wsName = useMemo(() => {
    let ws_name = '';
    if (authContext.wsId && authContext?.wsList.length > 0) {
      authContext.wsList.forEach(ws => {
        if (ws.value === authContext.wsId) {
          ws_name = ws.label;
        }
      });
    }
    return ws_name;
  }, [authContext]);
  /* temp logic end*/

  return (
    <RoleSelectionContainer>
      <Torro className='logo' />
      <MessageBox>
        <UserName>Hi, {authContext.userName}.</UserName>
        <Message>
          {wsName && (
            <span>
              <Intl id='uAreIn' />
              <WsName>{wsName}</WsName>,
            </span>
          )}
          <Intl id='plsSelectRole' />
        </Message>
      </MessageBox>
      <RoleGroup>
        {roleList.map(item => {
          let tmpSrc;
          switch (item) {
            case USER:
              tmpSrc = dataUser;
              break;
            case GOVERNOR:
              tmpSrc = dataGovernor;
              break;
            case IT:
              tmpSrc = itAdmin;
              break;
            default:
              tmpSrc = dataUser;
          }
          return (
            <BtnItem key={item}>
              <Btn
                onClick={() => {
                  selectRoleHandle(item);
                }}
                src={tmpSrc}
                alt=''
              />
              <BtnText>{roleTextMap[item]}</BtnText>
            </BtnItem>
          );
        })}
      </RoleGroup>
    </RoleSelectionContainer>
  );
};

export default withAuthentication(RoleSelection);
