/* third lib*/
import 'rc-color-picker/assets/index.css';
import React, { useState, useCallback, useEffect } from 'react';
import ColorPicker from 'rc-color-picker';
import { FormattedMessage as Intl } from 'react-intl';
import Button from '@basics/Button';
import styled from '@emotion/styled';

// local componet & styles
import Text from '@basics/Text';
import CheckBoxGroup from '@basics/CheckBoxGroup';
import HeadLine from '@basics/HeadLine';
import CallModal from '@basics/CallModal';
import { SUCCESS } from 'src/lib/data/callStatus';
import { postThemeConfig } from '@lib/api';
import { useGlobalContext } from 'src/context';
import { COLORS, SPACING } from '@comp/theme';

const AdminPageContainer = styled.div`
  width: 100%;
  min-height: 100%;
  background-color: ${COLORS.white};
  padding: ${SPACING.space44};
  position: relative;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const DataContent = styled.div`
  display: flex;
`;

const OperateItem = styled.div`
  width: 25%;
`;

const Label = styled.div`
  display: inline-block;
  margin-bottom: ${SPACING.space16};
  color: ${COLORS.mainPurple};
`;

const Title = styled.div`
  color: ${COLORS.darkPurple};
  margin-bottom: ${SPACING.space44};
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: ${SPACING.space44};
  right: ${SPACING.space44};

  button {
    margin-right: ${SPACING.space20};
  }
  button:last-child(1) {
    margin-right: 0;
  }
`;

const timeZoneOption = [
  {
    label: 'Asia/Hong_Kong',
    value: 'Asia/Hong_Kong',
    suffix: '(HKT)',
  },
  {
    label: 'Europe/London',
    value: 'Europe/London',
    suffix: '(GMT)',
  },
  {
    label: 'Asia/Shanghai',
    value: 'Asia/Shanghai',
    suffix: '(CST)',
  },
  {
    label: 'Asia/Kolkata',
    value: 'Asia/Kolkata',
    suffix: '(IST)',
  },
  {
    label: 'Asia/Tokyo',
    value: 'Asia/Tokyo',
    suffix: '(JST)',
  },
  {
    label: 'America/Regina',
    value: 'America/Regina',
    suffix: '(CST)',
  },
];

const AdminPage = () => {
  const { themeContext, setTheme } = useGlobalContext();
  const [config, setConfig] = useState(themeContext);
  const [submitData, setSubmitData] = useState();
  const [modalData, setModalData] = useState({
    open: false,
    status: 0,
    content: '',
  });

  const changeMainThemeColor = useCallback(
    colors => {
      document.body.style.setProperty('--mainThemeColor', colors.color);
      setConfig({
        ...config,
        mainThemeColor: colors.color,
      });
    },
    [config]
  );

  const changeMainDarkThemeColor = useCallback(
    colors => {
      setConfig({
        ...config,
        mainDarkThemeColor: colors.color,
      });
      document.body.style.setProperty('--mainDarkThemeColor', colors.color);
    },
    [config]
  );

  const changeTimeZone = useCallback(
    value => {
      setConfig({
        ...config,
        timeZone: value,
      });
    },
    [config]
  );

  const changeMainLightThemeColor = useCallback(
    colors => {
      setConfig({
        ...config,
        mainLightThemeColor: colors.color,
      });
      document.body.style.setProperty('--mainLightThemeColor', colors.color);
    },
    [config]
  );

  const buttonClickHandle = useCallback(() => {
    let apiCall = postThemeConfig;
    let postData = submitData;

    switch (modalData.status) {
      case 1:
      case 3:
        setModalData({
          ...modalData,
          status: 0,
          content: <Intl id='loadNpatience' />,
        });

        apiCall(postData)
          .then(res => {
            if (res.code === SUCCESS) {
              setModalData({
                open: true,
                status: 2,
                content: <Intl id='newConfigChanged' />,
              });
              setTheme(res.data);
            }
          })
          .catch(e => {
            setModalData({
              ...modalData,
              status: 3,
              content: e.message,
            });
          });
        break;
      default:
        setModalData({
          ...modalData,
          open: false,
        });
        break;
    }
    /* eslint-disable */
  }, [modalData, submitData]);
   

  const submitHandle = useCallback(() => {
    setModalData({
      open: true,
      status: 1,
      content: <Intl id='adminConfirm' />,
    });
    setSubmitData(config);
  }, [setSubmitData, config]);

  useEffect(() => {
    setConfig(themeContext);
  }, [themeContext]);

  return (
    <AdminPageContainer>
      <Content>
        <Title>
          <HeadLine>
            <Intl id='adminConfig' />
          </HeadLine>
        </Title>

        <DataContent>
          <OperateItem>
            <Label>
              <Text type='subTitle'>
                <Intl id='mainColor' />
              </Text>
            </Label>
            <div>
              <ColorPicker
                animation='slide-up'
                color={config.mainThemeColor}
                onChange={changeMainThemeColor}
              />
            </div>
          </OperateItem>
          <OperateItem>
            <Label>
              <Text type='subTitle'>
                <Intl id='mainDColor' />
              </Text>
            </Label>
            <div>
              <ColorPicker
                animation='slide-up'
                color={config.mainDarkThemeColor}
                onChange={changeMainDarkThemeColor}
              />
            </div>
          </OperateItem>
          <OperateItem>
            <Label>
              <Text type='subTitle'>
                <Intl id='mainLColor' />
              </Text>
            </Label>
            <div>
              <ColorPicker
                animation='slide-up'
                color={config.mainLightThemeColor}
                onChange={changeMainLightThemeColor}
              />
            </div>
          </OperateItem>
          <OperateItem>
            <Label>
              <Text type='subTitle'>
                <Intl id='timeZoneList' />
              </Text>
            </Label>
            <div>
              <CheckBoxGroup
                options={timeZoneOption}
                value={config.timeZone}
                onChange={changeTimeZone}
              />
            </div>
          </OperateItem>
        </DataContent>
        <ButtonWrapper>
          <Button onClick={submitHandle} type='submit' variant='contained'>
            <Intl id='submit' />
          </Button>
        </ButtonWrapper>
        <CallModal
          open={modalData.open}
          content={modalData.content}
          status={modalData.status}
          successCb={modalData.successCb}
          buttonClickHandle={buttonClickHandle}
          handleClose={() => {
            setModalData({ ...modalData, open: false });
          }}
        />
      </Content>
    </AdminPageContainer>
  );
};

export default AdminPage;
