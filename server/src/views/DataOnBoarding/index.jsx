/* third lib*/
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

/* material-ui */
import { Tabs, Tab } from '@mui/material';

/* local components & methods */
import FormItem from '@comp/FormItem';
import HeadLine from '@basics/HeadLine';
import Text from '@basics/Text';
import CallModal from '@basics/CallModal';
import Loading from '@assets/icons/Loading';
import TableTagDisplay from '@comp/TableTag';
import ResourceDetail from '@comp/ResourceDetail';
import {
  getOnBoardDataForm,
  getRequiredTableTag,
  getTableSchema,
  getHiveResource,
  getTags,
  getPolicys,
  raiseFormRequest,
  getDataLineage,
} from '@lib/api';
import { SUCCESS } from 'src/lib/data/callStatus';
import Button from '@basics/Button';
import { sendNotify } from 'src/utils/systerm-error';
import TableSchema from './TableSchema';
import DataLineage from './DataLineage';
import styled from '@emotion/styled';
import { SPACING, FONT_WEIGHTS, COLORS } from '@comp/theme';

const AntTab = styled(Tab)({
  textTransform: 'none',
  minWidth: 72,
  fontWeight: FONT_WEIGHTS.regular,
  marginRight: SPACING.space24,
  fontSize: '1.25rem',
  '&.Mui-selected': {},
});

const DataOnBoarding = () => {
  const { handleSubmit, control, register } = useForm(); // initialise the hook
  const navigate = useNavigate();
  const resourceType = useWatch({
    control,
    name: 'resourceType',
    defaultValue: 'GCP',
  });

  const [policys, setPolicys] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [tableData, setTableData] = useState(null);
  const [tagTemplateList, setTagTempalteList] = useState([]);
  const [submitData, setSubmitData] = useState(null);
  const [onBoardDataForm, setOnBoardDataForm] = useState(null);
  const [requiredTableTag, setRequiredTableTag] = useState([]);
  const [graphData, setGrapthData] = useState();

  const [tab, setTab] = useState('table');

  const [modalData, setModalData] = useState({
    open: false,
    status: 0,
    content: '',
    cb: null,
  });

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

  const tableForm = useMemo(() => {
    if (!onBoardDataForm) {
      return [];
    }
    return resourceType === 'GCP' ? onBoardDataForm.gcp : onBoardDataForm.hive;
  }, [resourceType, onBoardDataForm]);

  const tableTags = useMemo(() => {
    return tableData?.tags || [];
  }, [tableData]);

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

  const submitHandle = data => {
    setSearchQuery(data);
  };

  const closeModal = () => {
    setModalData({ ...modalData, open: false, cb: null });
  };

  const buttonClickHandle = useCallback(() => {
    let apiCall = raiseFormRequest;
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
                content: <Intl id='newRequestSubmit' />,
                successCb: () => {
                  navigate(`/app/requestDetail?id=${res.data.id}`);
                },
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
        break;
      default:
        setModalData({ ...modalData, open: false });
        break;
    }
  }, [modalData, submitData, navigate]);

  const onBoardHandle = useCallback(
    data => {
      let avaliable = true;

      tableData.tags.forEach(item => {
        if (!item.data) {
          sendNotify({
            msg: 'Table tag have empty value, please check your input.',
            status: 3,
            show: true,
          });
          avaliable = false;
        }
      });

      if (avaliable) {
        setModalData({
          open: true,
          status: 1,
          content: <Intl id='confirmOnboard' />,
        });
        setSubmitData({
          form_id: '107',
          form_field_values_dict: {
            u1: tableData?.tableReference.projectId,
            u2: tableData?.location,
            u3: tableData?.tableReference.datasetId,
            u4: tableData?.tableReference.tableId,
            u5: tableData?.schema?.fields,
            u6: tableData?.tags,
          },
        });
      }
    },
    [tableData]
  );

  useEffect(() => {
    if (searchQuery) {
      setFormLoading(true);
      let apiCall = resourceType === 'GCP' ? getTableSchema : getHiveResource;

      Promise.all([
        apiCall(searchQuery),
        getDataLineage({
          entity: `${searchQuery.projectId}.${searchQuery.datasetName}.${searchQuery.tableName}`,
        }),
      ])
        .then(res => {
          let res1 = res[0];
          let res2 = res[1];

          if (res1.data) {
            let tmpData = res1.data;
            /* deal with require Table Tag */
            tmpData.tags = tmpData?.tags || [];
            let tagFormIdList = [];
            let concatList = [];

            tmpData.tags = tmpData.tags.map(item => {
              tagFormIdList.push(item.tag_template_form_id);
              if (requiredTableTag.includes(item.tag_template_form_id)) {
                return { ...item, required: true };
              } else {
                return item;
              }
            });

            requiredTableTag.forEach(id => {
              if (!tagFormIdList.includes(id)) {
                concatList.push({
                  tag_template_form_id: id,
                  data: null,
                  required: true,
                });
              }
            });
            tmpData.tags = concatList.concat(tmpData.tags);
            setTableData(tmpData);
          }
          if (res2.data) {
            setGrapthData(res2.data);
          }
          setFormLoading(false);
          setTab('table');
        })
        .catch(e => {
          console.log(e);
          sendNotify({ msg: e.message, status: 3, show: true });
        });

      // apiCall(searchQuery)
      //   .then((res) => {
      //     if (res.data) {
      //       let tmpData = res.data;
      //       tmpData.tags = tmpData?.tags || [];
      //       let tagFormIdList = [];
      //       let concatList = [];

      //       tmpData.tags = tmpData.tags.map((item) => {
      //         tagFormIdList.push(item.tag_template_form_id);
      //         if (requiredTableTag.includes(item.tag_template_form_id)) {
      //           return { ...item, required: true };
      //         } else {
      //           return item;
      //         }
      //       });

      //       requiredTableTag.forEach((id) => {
      //         if (!tagFormIdList.includes(id)) {
      //           concatList.push({
      //             tag_template_form_id: id,
      //             data: null,
      //             required: true,
      //           });
      //         }
      //       });
      //       tmpData.tags = concatList.concat(tmpData.tags);
      //       setTableData(tmpData);
      //       setFormLoading(false);
      //     }
      //     if(res2.data){
      //       setGrapthData(res.data);          }
      //   })
      //   .catch((e) => {
      //     sendNotify({ msg: e.message, status: 3, show: true });
      //   });
    }
  }, [searchQuery, requiredTableTag, resourceType]);

  useEffect(() => {
    getPolicys()
      .then(res => {
        setPolicys(res.data);
      })
      .catch(e => {
        sendNotify({
          msg: 'Get Policy tags error.',
          status: 3,
          show: true,
        });
      });
  }, []);

  useEffect(() => {
    getTags()
      .then(res => {
        setTagTempalteList(res.data);
      })
      .catch(e => {
        sendNotify({
          msg: 'Get Policy tags error.',
          status: 3,
          show: true,
        });
      });
  }, []);

  useEffect(() => {
    getOnBoardDataForm()
      .then(res => {
        if (res.data) {
          setOnBoardDataForm(res.data);
        }
      })
      .catch(e => {
        sendNotify({
          msg: 'Get Policy tags error.',
          status: 3,
          show: true,
        });
      });
  }, []);

  useEffect(() => {
    getRequiredTableTag()
      .then(res => {
        if (res.data) {
          setRequiredTableTag(res.data);
        }
      })
      .catch(e => {
        sendNotify({
          msg: 'System error',
          status: 3,
          show: true,
        });
      });
  }, []);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        backgroundColor: COLORS.white,
        padding: SPACING.space44,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ color: COLORS.darkPurple, marginBottom: SPACING.space44 }}>
        <HeadLine>
          <Intl id='dataOnboarding' />
        </HeadLine>
      </div>

      <form
        style={{ position: 'relative', marginBottom: SPACING.space20 }}
        id='tableSearch'
        onSubmit={handleSubmit(submitHandle)}
      >
        <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
          {renderFormItem(tableForm)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={() => {
              navigate(`/app/dashboard`);
            }}
            style={{ marginRight: SPACING.space20 }}
            text
          >
            <Intl id='backToDashboard' />
          </Button>
          <Button type='submit' variant='contained'>
            <Intl id='search' />
          </Button>
        </div>
      </form>
      {formLoading && <Loading></Loading>}
      {!formLoading && tableData && (
        <>
          <div
            style={{ color: COLORS.darkPurple, marginBottom: SPACING.space20 }}
          >
            <Text type='title'>
              <Intl id='resourceDetail' />
            </Text>
          </div>
          <ResourceDetail tableData={tableData} />
          {tableTags && tableTags.length > 0 && (
            <div>
              <div
                style={{
                  color: COLORS.darkPurple,
                  marginBottom: SPACING.space20,
                }}
              >
                <Text type='title'>Tags ({tableTags.length})</Text>
              </div>
              <div style={{ width: '50%' }}>
                {tableTags.map((tag, index) => {
                  return <TableTagDisplay key={index} tagData={tag} />;
                })}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <Tabs
              value={tab}
              onChange={(e, value) => {
                setTab(value);
              }}
              indicatorColor='primary'
              textColor='primary'
            >
              <AntTab label='Table' value='table' />
              <AntTab label='Data Lineage' value='dataLineage' />
            </Tabs>
          </div>
          {tab === 'table' && (
            <>
              <TableSchema
                tableData={tableData}
                tagTemplateList={tagTemplateList}
                policyMap={policyMap}
                tableTags={tableTags}
                fieldsChange={fields => {
                  let tmpData = JSON.parse(JSON.stringify(tableData));
                  tmpData.schema.fields = fields;
                  setTableData(tmpData);
                }}
                tableTagsChange={data => {
                  let tmpData = JSON.parse(JSON.stringify(tableData));
                  if (!tmpData.tags) {
                    tmpData.tags = [];
                  }
                  tmpData.tags = data;
                  setTableData(tmpData);
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: SPACING.space20,
                }}
              >
                <Button onClick={onBoardHandle} variant='contained'>
                  <Intl id='submit' />
                </Button>
              </div>
            </>
          )}

          {tab === 'dataLineage' && graphData && (
            <DataLineage graphData={graphData} />
          )}
        </>
      )}

      <CallModal
        open={modalData.open}
        content={modalData.content}
        status={modalData.status}
        successCb={modalData.successCb}
        buttonClickHandle={buttonClickHandle}
        handleClose={closeModal}
      />
    </div>
  );
};

export default DataOnBoarding;
