/* third lib*/
import React, { useEffect, useState, useCallback } from 'react';
import { FormattedMessage as Intl } from 'react-intl';

/* local components & methods */
import PolicyItems from '../PolicyItems';
import { getPolicys } from '@lib/api';
import { sendNotify } from 'src/utils/systerm-error';
import Text from '@basics/Text';
import Button from '@basics/Button';
import styled from '@emotion/styled';
import { SPACING, COLORS } from '@comp/theme';

const DesignerTitle = styled.div({
  marginTop: '1.125rem',
  color: COLORS.textGrey,
  marginBottom: SPACING.space20,
});

const ButtonWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
});

const PolicyTagTree = ({ handleApply }) => {
  const [policys, setPolicys] = useState([]);
  const [checkedList, setCheckedList] = useState([]);

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
  const onCheck = useCallback(
    tag => {
      let tmp = [...checkedList];
      if (checkedList.includes(tag)) {
        let currIndex = checkedList.indexOf(tag);
        tmp.splice(currIndex, 1);
        setCheckedList(tmp);
      } else {
        tmp.push(tag);
        setCheckedList(tmp);
      }
    },
    [checkedList]
  );

  return (
    <>
      <DesignerTitle>
        <Text type='title'>Add policy tag</Text>
      </DesignerTitle>
      <PolicyItems data={policys} onCheck={onCheck} checkedList={checkedList} />
      <ButtonWrapper>
        <Button
          size='small'
          type='submit'
          variant='contained'
          onClick={() => {
            handleApply(checkedList, 'POLICY');
          }}
        >
          <Intl id='apply' />
        </Button>
      </ButtonWrapper>
    </>
  );
};

export default PolicyTagTree;
