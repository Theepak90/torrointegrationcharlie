/* third lib*/
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import { useForm, useWatch } from 'react-hook-form';
import ScrollBar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

/* MUI */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/* local components & methods */
import { getQueryString } from 'src/utils/url-util.js';
import { SPACING, COLORS, SHADOWS } from '@comp/theme';
import FormItem from '@comp/FormItem';
import HeadLine from '@basics/HeadLine';
import Text from '@basics/Text';
import Loading from '@assets/icons/Loading';
import Button from '@basics/Button';
import ResourceDetail from '@comp/ResourceDetail';
import {
  getOnBoardDataForm,
  getTableSchema,
  getHiveResource,
  getPolicys,
  getTags,
} from '@lib/api';
import { sendNotify } from 'src/utils/systerm-error';
import TableTagDisplay from '@comp/TableTag';
import TableSchema from './TableSchema';
import { useGlobalContext } from 'src/context';
import ShoppingCart from './ShoppingCart';

// Styled components
const DataDiscover = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
`;

const DataLeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.paperShadow};
`;

const BackWrapper = styled.div`
  height: 1rem;
`;

const OnBack = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${COLORS.mainPurple};
  position: absolute;
  top: 1rem;
  left: 1rem;

  svg {
    margin-right: ${SPACING.space12};
  }
`;

const LeftPanelContainer = styled.div`
  padding: ${SPACING.space44};
  min-height: 100%;
`;

const Title = styled.div`
  color: ${COLORS.mainPurple};
  margin-bottom: ${SPACING.space44};
`;

const TableSearch = styled.div`
  position: relative;
  margin-bottom: ${SPACING.space20};
`;

const FormOptions = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const TableTagList = styled.div`
  width: 70%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: ${SPACING.space20};

  button {
    margin-left: ${SPACING.space20};
  }
`;

const SecondTitle = styled.div`
  color: ${COLORS.mainPurple};
  margin-bottom: ${SPACING.space20};
`;

const DataRightPanel = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  padding: 3.125rem ${SPACING.space32} ${SPACING.space32} ${SPACING.space32};
  background-color: ${COLORS.white};
  margin-left: ${SPACING.space16};
  box-shadow: ${SHADOWS.paperShadow};
`;

const GetDataAccess = () => {
  const resType = getQueryString('type');
  const projectId = getQueryString('id');
  const datasetName = getQueryString('dataset');
  const tableName = getQueryString('name');
  const autoAdd = getQueryString('autoAdd');

  const navigate = useNavigate();

  const { handleSubmit, control, register } = useForm({
    defaultValues: {
      datasetName: datasetName || '',
      projectId: projectId || '',
      resourceType: resType || 'GCP',
      tableName: tableName || '',
    },
  }); // initialise the hook

  let defaultQuery = null;
  if (resType && projectId && resType && tableName) {
    defaultQuery = {
      datasetName: datasetName,
      projectId: projectId,
      resourceType: resType,
      tableName: tableName,
    };
  }

  const resourceType = useWatch({
    control,
    name: 'resourceType',
    defaultValue: resType || 'GCP',
  });

  const { cartContext, setCartContext, addCartItem } = useGlobalContext();

  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [policys, setPolicys] = useState([]);
  const [tagTemplateList, setTagTempalteList] = useState([]);
  const [onBoardDataForm, setOnBoardDataForm] = useState(null);
  const [selectedList, setSelectedList] = useState([]);

  const cartList = useMemo(() => {
    return cartContext.cartList;
  }, [cartContext]);

  const tableForm = useMemo(() => {
    if (!onBoardDataForm) {
      return [];
    }
    return resourceType === 'GCP' ? onBoardDataForm.gcp : onBoardDataForm.hive;
  }, [resourceType, onBoardDataForm]);

  const tableList = useMemo(() => {
    return tableData?.schema?.fields;
  }, [tableData]);

  const submitHandle = data => {
    setSearchQuery(data);
  };

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

  const addCartHandle = useCallback(
    selectedList => {
      if (tableData.seq != null) {
        let tmp = [...cartList];
        tmp.splice(tableData.seq, 1, {
          ...tableData,
          selectedList: selectedList,
        });
        setCartContext({
          cartList: tmp,
        });
      } else {
        let exist;
        cartList.forEach(item => {
          if (
            item?.tableReference.projectId ===
              tableData?.tableReference.projectId &&
            item?.tableReference.datasetId ===
              tableData?.tableReference.datasetId &&
            item?.tableReference.tableId === tableData?.tableReference.tableId
          ) {
            exist = true;
          }
        });
        if (exist) {
          sendNotify({
            msg: 'Have exist data resouce in cart list',
            status: 3,
            show: true,
          });
          return;
        }
        setCartContext({
          cartList: [
            ...cartList,
            {
              ...tableData,
              seq: cartList.length,
              selectedList: selectedList,
            },
          ],
        });
      }

      setTableData(null);
      setSelectedList([]);
    },
    [tableData, cartList, setCartContext]
  );

  const showBackItem = useCallback(item => {
    setTableData(item);
    setSelectedList(item.selectedList);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      let postData = { ...searchQuery };
      let apiCall = resourceType === 'GCP' ? getTableSchema : getHiveResource;
      setFormLoading(true);
      apiCall(postData)
        .then(res => {
          setTableData(res.data);
          setFormLoading(false);
        })
        .catch(e => {
          sendNotify({
            msg: e.message,
            status: 3,
            show: true,
          });
        });
    }
  }, [searchQuery, resourceType]);

  useEffect(() => {
    if (resType && projectId && resType && tableName) {
      let apiCall = resType === 'GCP' ? getTableSchema : getHiveResource;
      setFormLoading(true);
      apiCall({
        datasetName: datasetName,
        projectId: projectId,
        resourceType: resType,
        tableName: tableName,
      })
        .then(res => {
          if (autoAdd) {
            addCartItem({
              ...res.data,
              seq: 0,
              selectedList: [],
            });
            setFormLoading(false);
          } else {
            setTableData(res.data);
            setFormLoading(false);
          }
        })
        .catch(e => {
          sendNotify({
            msg: e.message,
            status: 3,
            show: true,
          });
        });
    }
    /* eslint-disable */
  }, [datasetName, projectId, resType, tableName, autoAdd]);
  /* eslint-disable */

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

  return (
    <DataDiscover>
      <DataLeftPanel>
        <ScrollBar>
          <LeftPanelContainer>
            {defaultQuery && (
              <BackWrapper
                onClick={() => {
                  window.history.back();
                }}
              >
                <OnBack>
                  <ArrowBackIcon />
                  <Text type='subTitle'>
                    <Intl id='back' />
                  </Text>
                </OnBack>
              </BackWrapper>
            )}
            <Title>
              <HeadLine>
                <Intl id='getDataAccess' />
              </HeadLine>
            </Title>

            <form
              as={TableSearch}
              id='tableSearch'
              onSubmit={handleSubmit(submitHandle)}
              defaultValue
            >
              <FormOptions>{renderFormItem(tableForm)}</FormOptions>
              <ButtonWrapper>
                <Button
                  onClick={() => {
                    navigate(`/app/dashboard`);
                  }}
                  text
                >
                  <Intl id='backToDashboard' />
                </Button>
                <Button type='submit' variant='contained'>
                  <Intl id='search' />
                </Button>
              </ButtonWrapper>
            </form>
            {formLoading && <Loading></Loading>}
            {!formLoading && tableList && (
              <>
                <SecondTitle>
                  <Text type='title'>
                    <Intl id='resourceDetail' />
                  </Text>
                </SecondTitle>
                <ResourceDetail tableData={tableData} />
                {tableData.tags && tableData.tags.length > 0 && (
                  <div>
                    <SecondTitle>
                      <Text type='title'>Tags ({tableData.tags.length})</Text>
                    </SecondTitle>
                    <TableTagList>
                      {tableData.tags.map((tag, index) => {
                        return <TableTagDisplay key={index} tagData={tag} />;
                      })}
                    </TableTagList>
                  </div>
                )}
                <TableSchema
                  tableData={tableData}
                  tagTemplateList={tagTemplateList}
                  policyMap={policyMap}
                  addCartHandle={addCartHandle}
                  alreadySelected={selectedList}
                />
              </>
            )}
          </LeftPanelContainer>
        </ScrollBar>
      </DataLeftPanel>
      <DataRightPanel>
        <ShoppingCart showBackItem={showBackItem} />
      </DataRightPanel>
    </DataDiscover>
  );
};

export default GetDataAccess;
