/*third lib*/
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage as Intl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import Scrollbar from 'react-perfect-scrollbar';
import styled from '@emotion/styled';

/*local components && methods*/
import withAuthentication from 'src/hoc/withAuthentication';
import Button from '@basics/Button';
import Torro from '@assets/icons/Torrotext';
import { SPACING, COLORS, FONT_SIZES, FONT_WEIGHTS } from '@comp/theme';
import { getOrgForm, OrgSetup } from '@lib/api';
import { useGlobalContext } from 'src/context';
import HeadLine from '@basics/HeadLine';
import decode from 'src/utils/encode.js';
import Text from '@basics/Text';
import { sendNotify } from 'src/utils/systerm-error';
import FormItem from '@comp/FormItem';
import Loading from '@assets/icons/Loading';
import CallModal from '@basics/CallModal';

// Styled components
const OrgSettingPage = styled.div`
  width: 100%;
  position: relative;
  min-width: 1280px;
  height: calc(100vh - 60px);
  background-color: ${COLORS.white};
  padding: ${SPACING.space44};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: ${SPACING.space32};

  svg {
    color: ${COLORS.mainPurple};
    height: 7rem;
    width: auto;
  }
`;

const Title = styled.div`
  color: ${COLORS.mainPurple};
  margin-bottom: ${SPACING.space32};

  .formDes {
    color: ${COLORS.textGrey};
  }
`;

const SettingForm = styled.form`
  display: flex;
  flex-wrap: wrap;

  .button {
    width: 12.5rem;
    height: 3.75rem;
    margin-right: ${SPACING.space32};
  }

  .formItem {
    width: calc(33.3% - 0.66rem);
    margin-bottom: ${SPACING.space32};
    display: inline-block;
    margin-right: ${SPACING.space16};
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
`;

const FormControl = styled.div`
  background-color: ${COLORS.white};
  min-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: ${COLORS.mainPurple};

  .formTitle {
    font-weight: ${FONT_WEIGHTS.bold};
    font-size: ${FONT_SIZES.fontSize1};
    color: ${COLORS.darkPurple};
  }

  .formDes {
    color: ${COLORS.color12};
    font-size: ${FONT_SIZES.fontSize3};
  }
`;

const FormOptions = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${SPACING.space20};

  button:nth-child(1) {
    margin-right: ${SPACING.space20};
  }
`;

const OrgSetting = () => {
  const { handleSubmit, control, register } = useForm(); // initialise the hook
  const { Encrypt } = decode;
  const { setAuth, authContext } = useGlobalContext();
  const [formData, setFormData] = useState(null);
  const [formLoading, setFormLoading] = useState(true);
  const [postData, setPostData] = useState();
  const [modalData, setModalData] = useState({
    open: false,
    status: 0,
    content: '',
    cb: null,
  });

  let navigate = useNavigate();

  const renderFormItem = (items, disabled) => {
    return items.map((item, index) => {
      return (
        <FormItem
          key={index}
          data={item}
          index={index}
          control={control}
          register={register}
          disabled={disabled}
        />
      );
    });
  };

  const handleOrgSettingCall = useCallback(
    data => {
      setModalData({
        ...modalData,
        status: 0,
        content: <Intl id='loadNpatience' />,
      });
      data.admin_pwd = Encrypt(data.admin_pwd);
      data.smtp_pwd = Encrypt(data.smtp_pwd);
      data.use_ssl = data.use_ssl === 'false' ? false : true;
      OrgSetup(data)
        .then(res => {
          if (res.data) {
            setAuth({
              ...authContext,
              init: false,
            });
            navigate('/login', {
              replace: true,
            });
          }
        })
        .catch(e => {
          setModalData({
            ...modalData,
            status: 3,
            content: e.message,
          });
        });
    },
    [Encrypt, authContext, modalData, navigate, setAuth]
  );

  const submitHandle = useCallback(data => {
    setModalData({
      open: true,
      status: 1,
      content: <Intl id='confirmSetup' />,
    });
    setPostData(data);
  }, []);

  const buttonClickHandle = useCallback(() => {
    switch (modalData.status) {
      case 0:
      case 2:
        setModalData({ ...modalData, open: false, cb: null });
        break;
      case 1:
      case 3:
        handleOrgSettingCall(postData);
        break;
      default:
        break;
    }
  }, [handleOrgSettingCall, modalData, postData]);

  useEffect(() => {
    getOrgForm()
      .then(res => {
        if (res.data) {
          setFormData(res.data);
          setFormLoading(false);
        }
      })
      .catch(e => {
        sendNotify({ msg: e.message, status: 3, show: true });
      });
  }, []);

  return (
    <OrgSettingPage>
      <Scrollbar>
        {formLoading && <Loading />}
        {!formLoading && formData && (
          <div>
            <Logo>
              <Torro />
            </Logo>
            <Title>
              <HeadLine>{formData.title}</HeadLine>
              <div className='formDes'>
                <Text>{formData.des}</Text>
              </div>
            </Title>
            <FormControl>
              <SettingForm
                id={`currentForm${formData.id}`}
                onSubmit={handleSubmit(submitHandle)}
              >
                <FormOptions>{renderFormItem(formData.fieldList)}</FormOptions>

                <ButtonWrapper>
                  <Button className='button' type='submit' filled>
                    <Intl id='setup' />
                  </Button>
                </ButtonWrapper>
              </SettingForm>
            </FormControl>
          </div>
        )}
        <CallModal
          open={modalData.open}
          content={modalData.content}
          status={modalData.status}
          buttonClickHandle={buttonClickHandle}
          handleClose={() => {
            setModalData({ ...modalData, open: false });
          }}
        />
      </Scrollbar>
    </OrgSettingPage>
  );
};
export default withAuthentication(OrgSetting);
