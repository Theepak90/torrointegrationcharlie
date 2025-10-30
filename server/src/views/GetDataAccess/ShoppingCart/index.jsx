/* third lib*/
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import ScrollBar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

/* material-ui */
import List from '@mui/material/List';

/* local components & methods */
import { SPACING, COLORS } from '@comp/theme';
import Text from '@basics/Text';
import CallModal from '@basics/CallModal';
import Button from '@basics/Button';
import { getUseCaseList, raiseFormRequestList } from '@lib/api';
import { sendNotify } from 'src/utils/systerm-error';
import Select from '@basics/Select';
import { useGlobalContext } from 'src/context';

import CartItem from './CartItem';

// Styled components
const ShoppingCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const RightPanelTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${COLORS.mainPurple};
`;

const CartView = styled.div`
  flex: 1;
`;

const OrderNow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${SPACING.space20};
`;

const CartItemList = styled.div`
  color: #333;
  margin-bottom: ${SPACING.space16};
`;

const SelectUseCase = styled.div`
  color: ${COLORS.mainPurple};
  margin-bottom: ${SPACING.space16};
`;

const SelectBox = styled.div`
  margin-top: ${SPACING.space8};
`;

const GET_ACCESS_FORM_ID = 108;

const ShoppingCart = ({ showBackItem }) => {
  const navigate = useNavigate();

  const { cartContext, setCartContext } = useGlobalContext();
  const [submitData, setSubmitData] = useState(null);
  const [useCaseList, setUseCaseList] = useState([]);
  const [selectedUc, setSelectedUc] = useState('');

  const cartList = useMemo(() => {
    return cartContext.cartList;
  }, [cartContext]);

  const [modalData, setModalData] = useState({
    open: false,
    status: 0,
    content: '',
    cb: null,
  });

  const buttonClickHandle = useCallback(() => {
    debugger;
    switch (modalData.status) {
      case 1:
      case 3:
        setModalData({
          ...modalData,
          status: 0,
          content: <Intl id='loadNpatience' />,
        });

        raiseFormRequestList(submitData)
          .then(res => {
            let tempIdList = res.data.map(item => {
              return item.data.id;
            });
            setModalData({
              open: true,
              status: 2,
              content: <Intl id='newRequestSubmit' />,
              successCb: () => {
                navigate(`/app/requestDetail?idList=${tempIdList.join('|')}`);
              },
            });
          })
          .catch(e => {
            sendNotify({ msg: e.message, status: 3, show: true });
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

  const orderHandle = useCallback(() => {
    if (cartList.length > 0 && selectedUc) {
      setModalData({
        open: true,
        status: 1,
        content: <Intl id='confirmOnboard' />,
      });

      let requestList = cartList.map(item => {
        let selectedList = item.selectedList;
        let tmp = [...item.schema.fields];
        let list = [];
        const removeNotSelected = (data, parentIndex) => {
          for (let i = data.length - 1; i >= 0; i--) {
            let item = data[i];
            let index = i;
            let currIndex = parentIndex ? `${parentIndex}.${index}` : index;
            if (item.type === 'RECORD') {
              removeNotSelected(item.fields, currIndex);
            } else {
              let policTagId = item?.policyTags?.names[0] || '';
              if (policTagId && !selectedList.includes(policTagId)) {
                let indexArr =
                  typeof currIndex === 'string'
                    ? currIndex.split('.')
                    : [currIndex];
                let objPointer = null;
                list.push(currIndex);

                indexArr.forEach((tmpIndex, arrIndex) => {
                  if (!objPointer) {
                    objPointer = tmp[tmpIndex];
                    if (arrIndex === indexArr.length - 1) {
                      tmp.splice(index, 1);
                    }
                  } else if (arrIndex === indexArr.length - 1) {
                    objPointer.fields.splice(tmpIndex, 1);
                  } else {
                    objPointer = objPointer.fields[tmpIndex];
                  }
                });
              }
            }
          }
        };
        removeNotSelected(item.schema.fields);
        return {
          form_id: GET_ACCESS_FORM_ID,
          form_field_values_dict: {
            u1: item?.tableReference.projectId,
            d15: selectedUc,
            u3: item?.location,
            u4: item?.tableReference.datasetId,
            u5: item?.tableReference.tableId,
            u6: tmp,
          },
        };
      });

      setSubmitData({
        data: requestList,
      });
    }
  }, [selectedUc, cartList]);

  const closeModal = () => {
    setModalData({ ...modalData, open: false, cb: null });
  };

  const removeCartItem = useCallback(
    seq => {
      let tmp = [...cartList];
      tmp.splice(seq, 1);
      setCartContext({
        cartList: tmp,
      });
    },
    [cartList, setCartContext]
  );

  useEffect(() => {
    getUseCaseList().then(res => {
      if (res.data) {
        setUseCaseList(
          res.data.map(item => {
            return { label: item.usecase_name, value: item.usecase_name };
          })
        );
      }
    }, []);
  }, []);

  return (
    <ShoppingCartContainer>
      <RightPanelTitle>
        <Text type='title'>
          <Intl id='dataAccessCart' />
        </Text>
      </RightPanelTitle>
      <CartView>
        <ScrollBar>
          <div>
            {cartList.length > 0 && (
              <CartItemList>
                <List>
                  {cartList.map((row, index) => (
                    <CartItem
                      row={row}
                      seq={index}
                      showBackItem={showBackItem}
                      removeCartItem={removeCartItem}
                      key={index}
                    />
                  ))}
                </List>
              </CartItemList>
            )}
          </div>
        </ScrollBar>
      </CartView>
      {cartList.length > 0 && (
        <SelectUseCase>
          <Text type='subTitle'>
            <Intl id='selectedUc' />
          </Text>

          <Select
            value={selectedUc}
            options={useCaseList}
            as={SelectBox}
            onChange={value => {
              setSelectedUc(value);
            }}
          />
        </SelectUseCase>
      )}
      <OrderNow>
        <Button
          filled
          onClick={orderHandle}
          disabled={!selectedUc || cartList.length < 1}
          size='small'
        >
          <Intl id='submit' />
        </Button>
      </OrderNow>
      <CallModal
        open={modalData.open}
        content={modalData.content}
        status={modalData.status}
        buttonClickHandle={buttonClickHandle}
        handleClose={closeModal}
        successCb={modalData.successCb}
      />
    </ShoppingCartContainer>
  );
};

export default ShoppingCart;
