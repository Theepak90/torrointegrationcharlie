/* third lib*/
import React, { useRef, useState, useCallback, useMemo } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import { useDropzone } from 'react-dropzone';

/* MUI */
import Tooltip from '@mui/material/Tooltip';
import PublishIcon from '@mui/icons-material/Publish';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Tabs,
  Tab,
} from '@mui/material';
import styled from '@emotion/styled';
/* local components & methods */
import NotAuthorized from '../Errors/NotAuthorized';
import Text from '@basics/Text';
import HeadLine from '@basics/HeadLine';
import { fileTemplates } from 'src/constant';
import ExcelFile from 'src/assets/icons/ExcelFile';
import Button from '@basics/Button';
import Loading from '@assets/icons/Loading';
import { useGlobalContext } from 'src/context';
import { GOVERNOR, IT, ADMIN } from 'src/lib/data/roleType.js';
import { batchRunTask } from 'src/lib/api';
import { sendNotify } from 'src/utils/systerm-error';
import { SPACING, FONT_WEIGHTS, FONT_SIZES, COLORS } from '@comp/theme';

const AntTab = styled(Tab)({
  textTransform: 'none',
  minWidth: 72,
  fontWeight: FONT_WEIGHTS.regular,
  marginRight: SPACING.space24,
  fontSize: '14px',
});

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Content = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: ${SPACING.space44};
`;

const TitleSection = styled.div`
  color: ${COLORS.darkPurple};
  margin-bottom: ${SPACING.space44};
`;

const Description = styled.div`
  color: ${COLORS.color12};
  font-size: ${FONT_SIZES.fontSize4};
  font-family: 'Roboto';
  margin-top: ${SPACING.space8};
`;

const TemplateSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.space24};
`;

const TemplateList = styled.div`
  display: flex;
  gap: ${SPACING.space24};
  flex-wrap: wrap;
`;

const TemplateItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${SPACING.space8};
`;

const DropzoneContainer = styled.div`
  width: 100%;
  border: 1px dashed ${COLORS.borderGrey};
  border-radius: 4px;
  height: 200px;
  margin-bottom: ${SPACING.space24};
`;

const DropzoneContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const FileSelectedText = styled.p`
  display: flex;
  align-items: center;
  gap: ${SPACING.space8};
  margin-top: ${SPACING.space16};
`;

const DropzoneText = styled.p`
  margin-top: ${SPACING.space16};
`;

const SupportText = styled.p`
  font-size: ${FONT_SIZES.fontSize4};
  color: ${COLORS.color12};
  margin-top: ${SPACING.space8};
`;

const FormatText = styled.p`
  font-size: ${FONT_SIZES.fontSize4};
  color: ${COLORS.color12};
  margin-top: ${SPACING.space4};
`;

const ButtonContainer = styled.div`
  margin-top: ${SPACING.space20};
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.space8};
`;

const actionMap = {
  policy: 'batch_create_policy',
  data: 'batch_publish_data',
  tag: 'batch_upload_tag',
};

const BatchUpload = () => {
  const { authContext } = useGlobalContext();
  const haveAuth = useMemo(() => {
    return [ADMIN, GOVERNOR, IT].includes(authContext.role);
  }, [authContext.role]);
  const inputRef = useRef(null);
  const [acceptedFile, setAcceptedFile] = useState(null);
  const [taskList, setTaskList] = useState([]);
  const [currentTab, setCurrentTab] = useState('policy');
  const [batchLoading, setBatchLoading] = useState(false);
  const tabList = [
    { label: <Intl id='batchPolicy' />, value: 'policy' },
    { label: <Intl id='batchOnboading' />, value: 'data' },
    { label: <Intl id='batchUploadTagTemplate' />, value: 'tag' },
  ];

  const fileChoosen = !!acceptedFile;
  const disbaleFileSelect = false;
  const tabClickHandle = useCallback((event, value) => {
    setCurrentTab(value);
    setAcceptedFile(null);
  }, []);

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onDrop = acceptedFile => {
    setAcceptedFile(acceptedFile[0]);
  };

  const handleUpload = () => {
    if (acceptedFile) {
      setBatchLoading(true);
      batchRunTask({
        file: acceptedFile,
        request_type: actionMap[currentTab],
      })
        .then(res => {
          setTaskList([
            ...taskList,
            {
              status: 'loading',
              file: acceptedFile,
            },
          ]);
          setAcceptedFile(null);
          inputRef.current.value = '';
          sendNotify({ msg: res.msg, status: 2, show: true });
          setBatchLoading(false);
        })
        .catch(e => {
          sendNotify({ msg: e.message, status: 3, show: true });
          setBatchLoading(false);
        });
    }
  };

  const { getInputProps, getRootProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
  });

  const handleButtonClick = () => {
    inputRef.current.click();
  };
  if (haveAuth) {
    return (
      <Container>
        <Content>
          <TitleSection>
            <HeadLine>
              <Intl id='batchUpload' />
            </HeadLine>

            <Description>
              <Intl id='bactchDes' />
            </Description>
            <TemplateSection>
              <div style={{ width: '100%' }}>
                <TemplateSection>
                  <Text type='title'>
                    <Intl id='batchUploadTemplate' />
                  </Text>
                  <TemplateList>
                    {fileTemplates.map((item, index) => {
                      return (
                        <Tooltip
                          key={index}
                          title={
                            <span style={{ fontSize: '12px' }}>
                              {`Download ${item.fileName}`}
                            </span>
                          }
                          arrow
                        >
                          <TemplateItem
                            onClick={() => {
                              handleDownload(item.fileUrl, item.fileName);
                            }}
                          >
                            <ExcelFile />
                            <Text type='text'>{item.fileName}</Text>
                          </TemplateItem>
                        </Tooltip>
                      );
                    })}
                  </TemplateList>
                </TemplateSection>
                <div style={{ marginBottom: SPACING.space24 }}>
                  <Text type='title'>
                    <Intl id='performBatch' />
                  </Text>
                  <div>
                    <Tabs
                      value={currentTab}
                      onChange={tabClickHandle}
                      indicatorColor='primary'
                      textColor='primary'
                      centered
                    >
                      {tabList.map(tab => {
                        return (
                          <AntTab
                            key={tab.value}
                            label={tab.label}
                            value={tab.value}
                          />
                        );
                      })}
                    </Tabs>
                  </div>

                  <div key={currentTab}>
                    <DropzoneContainer
                      {...getRootProps({ className: 'dropzone' })}
                      onClick={handleButtonClick}
                    >
                      <input
                        {...getInputProps({
                          ref: inputRef,
                          disabled: disbaleFileSelect,
                        })}
                      />
                      <DropzoneContent>
                        <PublishIcon />
                        {fileChoosen ? (
                          <FileSelectedText>
                            <ExcelFile /> {acceptedFile.name} Selected
                          </FileSelectedText>
                        ) : (
                          <DropzoneText>
                            <Intl id='clickOrDrag' />
                          </DropzoneText>
                        )}

                        <SupportText>
                          <Intl id='supportSingle' />
                        </SupportText>
                        <FormatText>
                          <Intl id='excelFormat' />
                        </FormatText>
                      </DropzoneContent>
                    </DropzoneContainer>
                  </div>
                </div>
                <ButtonContainer>
                  <Button
                    disabled={!fileChoosen || batchLoading}
                    onClick={handleUpload}
                  >
                    <ButtonContent>
                      {batchLoading ? <Loading /> : <Intl id='batchRun' />}
                    </ButtonContent>
                  </Button>
                </ButtonContainer>
              </div>
            </TemplateSection>
          </TitleSection>
        </Content>
      </Container>
    );
  } else {
    return <NotAuthorized />;
  }
};

export default BatchUpload;
