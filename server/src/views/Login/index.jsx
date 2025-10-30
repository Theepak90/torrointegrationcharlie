/*third lib*/
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage as Intl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import styled from '@emotion/styled';

/*local components && methods*/
import withAuthentication from 'src/hoc/withAuthentication';
import UserInput from '@comp/UserComp/UserInput';
import Button from '@basics/Button';
import Torro from '@assets/icons/TorroEnterprise';
import { SPACING, COLORS } from '@comp/theme';
import { LoginCall } from '@lib/api';
import { useGlobalContext } from 'src/context';
import decode from 'src/utils/encode.js';
// import CallModal from "@basics/CallModal";

// Styled components
const LoginPageContainer = styled.div`
  width: 100%;
  position: relative;
  min-width: 1280px;
  height: 100vh;

  .logo {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-around;
    svg {
      height: 7rem;
      color: ${COLORS.mainPurple};
      width: auto;
    }
  }
`;

const LoginBox = styled.div`
  top: calc(50% - 16.875rem);
  left: 13%;
  position: absolute;
  height: 33.75rem;
  display: flex;
  align-items: center;
`;

const LoginForm = styled.form`
  margin-left: 33.75rem;

  .button {
    width: 12.5rem;
    height: 3.75rem;
    margin-right: ${SPACING.space32};
    &.disabled {
      cursor: not-allowed;
    }
  }
`;

const FormItem = styled.div`
  width: 23.75rem;
  margin-bottom: ${SPACING.space32};
`;

const LoginPage = () => {
  const { handleSubmit, reset, control } = useForm(); // initialise the hook
  const { Encrypt } = decode;
  const { setAuth, authContext } = useGlobalContext();
  const [logining, setLogining] = useState(false);
  let navigate = useNavigate();
  const [modalData, setModalData] = useState({
    open: false,
    status: 0,
    content: '',
    cb: null,
  });

  const submitHandle = useCallback(
    data => {
      if (logining) return;
      data.login_password = Encrypt(data.login_password);
      setLogining(true);
      LoginCall(data)
        .then(res => {
          if (res.msg === '[ORG_SETTING]') {
            let tmpAuth = {
              ...authContext,
              init: true,
            };
            setAuth(tmpAuth, 'refreshToken');
            navigate('/orgSetting', {
              replace: true,
            });
          } else if (res.data && res.code === 200) {
            let data = res.data;
            let tmpAuth = {
              ...authContext,
              userName: data.ACCOUNT_NAME,
              userId: data.ID,
              accountId: data.ACCOUNT_ID,
              roleList: data.role_list,
              role: data.user_role,
              wsList: data.workspace_list,
              wsId: Number(data.workspace_id),
              ad_group_list: data.ad_group_list,
              userCN: data.ACCOUNT_CN,
            };
            setAuth(tmpAuth, 'refreshToken');
          }
        })
        .catch(e => {
          setLogining(false);
          setModalData({
            ...modalData,
            open: true,
            status: 3,
            content: <Intl id='goesWrong' />,
            buttonText: 'close',
            cb: null,
          });
        });
    },
    [authContext, Encrypt, navigate, setAuth, modalData, logining]
  );

  return (
    <LoginPageContainer>
      <LoginBox>
        <div className='logo'>
          <Torro />
        </div>
        <LoginForm onSubmit={handleSubmit(submitHandle)}>
          <FormItem>
            <UserInput
              label={<Intl id='userName' />}
              id='login_name'
              name='login_name'
              autoFocus
              control={control}
            />
          </FormItem>
          <FormItem>
            <UserInput
              label={<Intl id='pwd' />}
              type='password'
              id='login_password'
              name='login_password'
              control={control}
            />
          </FormItem>
          {logining ? (
            <Button className={cn('button', 'disabled')} filled>
              <Intl id='logining' />
            </Button>
          ) : (
            <Button className='button' type='submit' filled>
              <Intl id='login' />
            </Button>
          )}
          <Button onClick={reset} className='button'>
            <Intl id='reset' />
          </Button>
        </LoginForm>
      </LoginBox>
      {/* <CallModal
        open={modalData.open}
        content={modalData.content}
        status={modalData.status}
        buttonText={modalData.buttonText}
        buttonClickHandle={() => {
          if (!modalData.cb) {
            setModalData({ ...modalData, open: false, cb: null });
          } else {
            modalData.cb();
          }
        }}
        handleClose={() => {
          setModalData({ ...modalData, open: false, cb: null });
        }}
      /> */}
    </LoginPageContainer>
  );
};

export default withAuthentication(LoginPage);
