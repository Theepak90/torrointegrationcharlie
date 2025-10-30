/* third lib*/
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import { useForm } from 'react-hook-form';
import Scrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';
import styled from '@emotion/styled';

/* material-ui */
import FormLabel from '@mui/material/FormLabel';

/* local components & methods */
import { useGlobalContext } from 'src/context';
import HeadLine from '@basics/HeadLine';
import FormItem from '@comp/FormItem';
import Button from '@basics/Button';
import Text from '@basics/Text';
import { THEME } from '@comp/theme';
import {
  getFieldTemplate,
  wsPut,
  wsPost,
  getWsDetail,
  getWorkspaceForm,
} from '@lib/api';
import { STATIC_TEMPLATE } from '@lib/data/staticTemplate';
import Loading from '@assets/icons/Loading';
import { sendNotify } from 'src/utils/systerm-error';
import CallModal from '@basics/CallModal';
import { SUCCESS } from 'src/lib/data/callStatus';
import SystemDefineField from './SystemDefineField';
import RegionDesign from './RegionDesign';
import GroupListTable from '@comp/GroupListTable';
import Hierarchy from '@comp/Hierarchy';

const FILENAME = 'AD group list template.xlsx';

// Styled Components
const WorkspaceFormContainer = styled.div`
  display: flex;
  height: 100%;
  box-shadow: ${THEME.shadows.paperShadow};
`;

const FormView = styled.div`
  width: 100%;
  flex: 1;
  height: 100%;
`;

const FormControl = styled.div`
  background-color: ${THEME.colors.white};
  min-height: 100%;
  width: 100%;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  color: ${THEME.colors.mainPurple};
`;

const Form = styled.form`
  margin-top: 3rem;
  flex: 1;
  position: relative;
`;

const FormOptions = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const FormItemLine = styled.div`
  padding: ${THEME.spacing.space16};
`;

const FormItemTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${THEME.spacing.space16};
`;

const FieldTitle = styled(FormLabel)`
  display: inline-block;
  color: ${THEME.colors.mainPurple} !important;
`;

const ExcelBtnGroup = styled.div`
  display: flex;

  .operationBtn {
    margin-left: ${THEME.spacing.space20};
  }
`;

const OperationBtn = styled.div`
  display: inline-block;
  text-align: center;
  padding: 0.5rem;
  min-width: unset;
  height: auto;
  line-height: 1;
  border-width: 1px;
  background-color: ${THEME.colors.mainPurple};
  color: ${THEME.colors.white};
  border-radius: 4px;
  cursor: pointer;
  margin-left: ${THEME.spacing.space12};
`;

const SystemField = styled.div`
  color: ${THEME.colors.textGrey};
  display: flex;
  align-items: center;
`;

const CurrentField = styled.div`
  margin-bottom: ${THEME.spacing.space20};
  font-size: ${THEME.fontSizes.fontSize3};
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;

  button:nth-child(1) {
    margin-right: ${THEME.spacing.space20};
  }
`;

const Workspace = ({ currentId, onBack, addState }) => {
  const { handleSubmit, control, register } = useForm(); // initialise the hook
  const { setAuth, authContext } = useGlobalContext();
  const navigate = useNavigate();
  const fileRef = useRef();

  const [formData, setFormData] = useState(null);
  const [formLoading, setFormLoading] = useState(true);
  const [adList, setAdList] = useState([]);

  const [step, setStep] = useState(0);
  const [currentWs, setCurrentWs] = useState(null);
  const [regions, setRegions] = useState([]);
  const [fieldTemplate, setFieldTemplate] = useState([]);
  const [submitData, setSubmitData] = useState(null);
  const [wsId, setWsId] = useState(currentId);
  const [departments, setDepartments] = useState([]);
  const [modalData, setModalData] = useState({
    open: false,
    status: 0,
    content: '',
  });

  const currentField = useMemo(() => {
    if (currentWs && currentWs.system) {
      let tmp = '';
      const formItemMap = {
        1: 'Checkbox',
        2: 'Dropdown',
        3: 'Textbox',
        4: 'Upload',
        5: 'Toggle',
        6: 'Datepicker',
      };

      Object.keys(currentWs.system).forEach(key => {
        tmp += `${currentWs.system[key].length} ${formItemMap[key]} `;
      });
      return tmp;
    } else {
      return '';
    }
  }, [currentWs]);

  const addRegion = () => {
    let tmp = [...regions];
    tmp.push({
      region: '',
      group: '',
      workflow: '',
      countryList: [],
    });
    setRegions(tmp);
  };

  const downLoadTemplate = useCallback(async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // 添加表头
    worksheet.addRow([
      'Use case Owner Group',
      'Use case Team Group',
      'Admin Service Account',
      'Use case Label',
    ]);

    // 设置列宽
    worksheet.columns = [
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
    ];

    // 下载文件
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = FILENAME;
    link.click();
    window.URL.revokeObjectURL(url);
  }, []);

  const uploadFile = useCallback(() => {
    fileRef.current.click();
  }, []);

  const clearFile = useCallback(e => {
    e.target.value = null;
  }, []);

  const uploadExcel = useCallback(
    async e => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const workbook = new ExcelJS.Workbook();
        const buffer = await file.arrayBuffer();
        await workbook.xlsx.load(buffer);

        const worksheet = workbook.getWorksheet('Sheet1');
        if (!worksheet) {
          sendNotify({
            msg: 'No Sheet1 found in the Excel file',
            status: 3,
            show: true,
          });
          return;
        }

        const rows = [];
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            // 跳过表头
            const rowData = [];
            row.eachCell((cell, colNumber) => {
              rowData[colNumber - 1] = cell.value;
            });
            rows.push(rowData);
          }
        });

        const uploadData = rows.map(item => ({
          resource: item,
        }));

        if (uploadData.length + adList.length > 150) {
          sendNotify({
            msg: 'You uploaded more than 150 pieces of data, please update and re-try',
            status: 3,
            show: true,
          });
          return;
        }

        if (addState) {
          setAdList(uploadData);
        } else {
          setAdList([...adList, ...uploadData]);
        }
      } catch (error) {
        sendNotify({
          msg: 'Error reading Excel file: ' + error.message,
          status: 3,
          show: true,
        });
      }
    },
    [adList, addState]
  );

  const buttonClickHandle = useCallback(() => {
    let apiCall = addState ? wsPost : wsPut;
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
                content: wsId ? <Intl id='wsUpdated' /> : <Intl id='wsIsAdd' />,
                cb: () => {
                  if (addState) {
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
                  } else {
                    window.location.reload();
                  }
                },
              });
            }
          })
          .catch(() => {
            setModalData({
              ...modalData,
              status: 3,
              content: <Intl id='checkInput' />,
            });
          });
        break;
      default:
        setModalData({ ...modalData, open: false });
        break;
    }
  }, [modalData, submitData, wsId, addState, authContext, setAuth, navigate]);

  const checkRegionEmptyVal = useCallback(regions => {
    let validate = true;
    regions.forEach(regionItem => {
      if (!regionItem.region || !regionItem.workflow) {
        validate = false;
      }

      regionItem.countryList.forEach(countryItem => {
        if (!countryItem.country || !countryItem.workflow) {
          validate = false;
        }
      });
    });

    return validate;
  }, []);

  const submitHandle = useCallback(
    data => {
      if (!checkRegionEmptyVal(regions)) {
        sendNotify({
          msg: 'Each region or country need to fill in name and workflow value.',
          status: 3,
          show: true,
        });
        return;
      }
      setModalData({
        open: true,
        status: 1,
        content: wsId ? (
          <Intl id='confirmUpdateWs' />
        ) : (
          <Intl id='confirmAddWS' />
        ),
      });
      setSubmitData({
        ...currentWs,
        ...data,
        regions: regions,
        departments: departments,
        groupArr: adList,
      });
    },
    [regions, departments, currentWs, wsId, adList, checkRegionEmptyVal]
  );

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

  useEffect(() => {
    getFieldTemplate()
      .then(res => {
        if (res) {
          let dynamic = res.data.dynamic;
          let system = res.data.system;
          setFieldTemplate(
            STATIC_TEMPLATE.map((item, index) => {
              let style = index + 1;
              return {
                ...item,
                systemList: [...dynamic[style], ...system[style]],
              };
            })
          );
        }
      })
      .catch(e => {
        setFieldTemplate(STATIC_TEMPLATE);
        sendNotify({ msg: e.message, status: 3, show: true });
      });
  }, []);

  useEffect(() => {
    getWorkspaceForm()
      .then(res => {
        if (res.data) {
          let workspaceData = res.data;
          if (addState) {
            setFormData(workspaceData);
            setCurrentWs({
              it_group: '',
              dg_group: '',
              ws_name: '',
              ws_des: '',
              ws_owner_group: '',
              ws_team_group: '',
              cycle: '',
              approval: '',
              regions: [],
              departments: [],
              system: {
                1: [],
                2: [],
                3: [],
                4: [],
                5: [],
                6: [],
              },
            });
            setFormLoading(false);
            return;
          }
          setWsId(currentId);
          getWsDetail({ id: currentId })
            .then(res => {
              let data = res.data;
              let tmp = JSON.parse(JSON.stringify(workspaceData));
              let tmpFieldList = tmp.fieldList.map(item => {
                if (item.id && data[item.id]) {
                  item.default = data[item.id];
                }
                return item;
              });

              data.system =
                JSON.stringify(data.system) === '{}'
                  ? {
                      1: [],
                      2: [],
                      3: [],
                      4: [],
                      5: [],
                      6: [],
                    }
                  : data.system;
              setRegions(data.regions || []);
              setDepartments(data.departments || []);
              setFormData({
                ...tmp,
                fieldList: tmpFieldList,
                title: data.ws_name,
                des: data.ws_des,
              });
              setCurrentWs(data);
              setFormLoading(false);
              setAdList(data.groupArr);
            })
            .catch(e => {
              sendNotify({ msg: e.message, status: 3, show: true });
            });
        }
      })
      .catch(e => {
        sendNotify({ msg: e.message, status: 3, show: true });
      });
  }, [currentId, addState]);

  console.log(departments);

  return (
    <>
      {step === 0 && (
        <WorkspaceFormContainer>
          <FormView>
            <Scrollbar>
              {formLoading && <Loading />}
              {!formLoading && formData && (
                <FormControl>
                  <HeadLine>
                    {wsId ? <Intl id='updateWs' /> : <Intl id='createWs' />}
                  </HeadLine>
                  <Form
                    id={`currentForm${formData.id}`}
                    onSubmit={handleSubmit(submitHandle)}
                  >
                    <FormOptions>
                      {renderFormItem(formData.fieldList)}
                    </FormOptions>

                    <FormItemLine>
                      <FormItemTitle>
                        <FieldTitle>
                          <Text
                            style={{ marginRight: THEME.spacing.space12 }}
                            type='subTitle'
                          >
                            <Intl id='defaultAd' />
                          </Text>
                          <Text>
                            (<Intl id='limit150' />)
                          </Text>
                        </FieldTitle>
                        <ExcelBtnGroup>
                          <OperationBtn onClick={downLoadTemplate}>
                            <Intl id='downLoadExcel' />
                          </OperationBtn>
                          <OperationBtn onClick={uploadFile}>
                            {wsId ? (
                              <Intl id='addNewAD' />
                            ) : (
                              <Intl id='uploadExcel' />
                            )}

                            <input
                              style={{ display: 'none' }}
                              type='file'
                              name='xlfile'
                              id='xlf'
                              ref={fileRef}
                              accept='.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                              onChange={uploadExcel}
                              onClick={clearFile}
                            ></input>
                          </OperationBtn>
                        </ExcelBtnGroup>
                      </FormItemTitle>

                      <GroupListTable
                        data={adList}
                        onChange={data => {
                          setAdList(data);
                        }}
                      />
                    </FormItemLine>
                    <FormItemLine>
                      <FormItemTitle>
                        <FieldTitle>
                          <Text type='subTitle'>
                            <Intl id='regionStructure' />
                          </Text>
                        </FieldTitle>
                        <OperationBtn
                          onClick={() => {
                            addRegion();
                          }}
                        >
                          <Intl id='addRegion' />
                        </OperationBtn>
                      </FormItemTitle>

                      <RegionDesign
                        regions={regions}
                        onChange={data => {
                          setRegions(data);
                        }}
                      />
                    </FormItemLine>

                    <FormItemLine>
                      <Hierarchy
                        departments={departments}
                        onChange={setDepartments}
                      />
                    </FormItemLine>

                    <FormItemLine>
                      <FormItemTitle>
                        <FieldTitle>
                          <Text type='subTitle'>
                            <Intl id='systemField' />
                          </Text>
                        </FieldTitle>
                        <OperationBtn
                          onClick={() => {
                            setStep(1);
                          }}
                        >
                          <Intl id='updateSystemField' />
                        </OperationBtn>
                      </FormItemTitle>
                      <SystemField>
                        <CurrentField>{currentField}</CurrentField>
                      </SystemField>
                    </FormItemLine>

                    <ButtonWrapper>
                      {onBack && (
                        <Button
                          onClick={() => {
                            onBack();
                          }}
                          variant='contained'
                        >
                          <Intl id='back' />
                        </Button>
                      )}
                      <Button type='submit' variant='contained'>
                        <Intl id='submit' />
                      </Button>
                    </ButtonWrapper>
                  </Form>
                </FormControl>
              )}
            </Scrollbar>
          </FormView>
        </WorkspaceFormContainer>
      )}
      {step === 1 && (
        <SystemDefineField
          fieldTemplate={fieldTemplate}
          systemDefineField={currentWs.system}
          onChange={data => {
            setCurrentWs({
              ...currentWs,
              system: data,
            });
            setStep(0);
          }}
          cancelHandle={() => {
            setStep(0);
          }}
        />
      )}
      <CallModal
        open={modalData.open}
        content={modalData.content}
        status={modalData.status}
        buttonClickHandle={() => {
          if (!modalData.cb) {
            buttonClickHandle();
          } else {
            modalData.cb();
          }
        }}
        handleClose={() => {
          setModalData({ ...modalData, open: false });
        }}
      />
    </>
  );
};

export default Workspace;
