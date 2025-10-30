/* third lib*/
import React, { useCallback, useMemo } from 'react';
import cn from 'classnames';
import styled from '@emotion/styled';

/* material-ui */
import Delete from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';

/* local components & methods */
import { SPACING, COLORS, FONT_WEIGHTS } from '@comp/theme';
import Text from '@basics/Text';
import bigQuery from 'src/assets/bigquery.png';
import hive from 'src/assets/hive.png';
import { covertToCurrentTime } from 'src/utils/timeFormat';
import Database from 'src/assets/icons/Database';
import TableView from 'src/assets/icons/TableView';
import { useGlobalContext } from 'src/context';

// Styled components
const CartItemContainer = styled.div`
  display: block;
  justify-content: space-between;
  border-bottom: 2px solid;
  border-image: linear-gradient(
      to right,
      ${COLORS.white},
      ${COLORS.borderGrey},
      ${COLORS.white}
    )
    1;
  margin-bottom: ${SPACING.space16};
  padding: ${SPACING.space8};

  &.GCP {
    svg {
      color: ${COLORS.mainPurple};
    }
    .label {
      color: ${COLORS.mainPurple};
    }
  }

  &.Hive {
    svg {
      color: ${COLORS.mainYellow};
    }
    .label {
      color: ${COLORS.mainYellow};
    }
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-bottom: ${SPACING.space12};
`;

const ItemName = styled.div`
  display: flex;
  font-weight: ${FONT_WEIGHTS.medium};
  font-size: ${SPACING.space16};
  align-items: center;
  color: ${COLORS.text};
`;

const ColumnLength = styled.div`
  margin-left: ${SPACING.space20};
`;

const ImgBox = styled.div`
  width: 5rem;
  height: 2.5rem;
  margin-right: ${SPACING.space20};
  display: flex;
  align-items: center;
`;

const GcpIcon = styled.img`
  width: 5rem;
`;

const HiveIcon = styled.img`
  width: 2.5rem;
`;

const ItemDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: ${SPACING.space8};
`;

const DetailLine = styled.div`
  display: flex;
  align-items: center;
  margin: ${SPACING.space4} 0;
`;

const Label = styled.div`
  margin-right: ${SPACING.space8};
  color: ${COLORS.mainPurple};

  span {
    font-weight: ${FONT_WEIGHTS.medium};
  }
`;

const TypeIcon = styled.div`
  svg {
    width: 3rem;
    height: 3rem;
  }
`;

const ItemFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${SPACING.space12};

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const Time = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OperateIcon = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-left: ${SPACING.space8};
    cursor: pointer;
  }
`;

const TimeIcon = styled.div`
  margin-right: ${SPACING.space8};
`;

const CartItem = ({ row, seq, showBackItem, removeCartItem }) => {
  const { timeContext } = useGlobalContext();
  const covertTime = useCallback(
    date => {
      return covertToCurrentTime(date, timeContext.timeFormat);
    },
    [timeContext]
  );

  const connection_type = useMemo(() => {
    return row.connection_type ? row.connection_type : 'GCP';
  }, [row]);

  return (
    <CartItemContainer className={connection_type}>
      <ItemHeader>
        <ItemName
          onClick={() => {
            showBackItem(row);
          }}
        >
          <ImgBox>
            {connection_type === 'GCP' && (
              <GcpIcon src={bigQuery} alt='Big Query' />
            )}
            {connection_type === 'Hive' && <HiveIcon src={hive} alt='Hive' />}
          </ImgBox>
          {row.tableReference.tableId}
        </ItemName>
      </ItemHeader>
      <ItemDetail>
        <div>
          <DetailLine>
            <Label>
              <Text>project ID:</Text>
            </Label>
            <div>
              <Text>{row.tableReference.projectId}</Text>
            </div>
          </DetailLine>
          <DetailLine>
            <Label>
              <Text>Dataset:</Text>
            </Label>
            <div>
              <Text>{row.tableReference.datasetId}</Text>
            </div>
          </DetailLine>
          <DetailLine>
            <Label>
              <Text>Location:</Text>
            </Label>
            <div>
              <Text>{row.location}</Text>
            </div>
          </DetailLine>
          <DetailLine>
            <Label>
              <Text>Column quantity:</Text>
            </Label>
            <div>
              <Text>{row.schema.fields.length}</Text>
            </div>
          </DetailLine>
        </div>
        <TypeIcon>
          {row.type === 'TABLE' && <Database />}
          {row.type === 'VIEW' && <TableView />}
        </TypeIcon>
      </ItemDetail>
      <ItemFooter>
        <Time>
          <TimeIcon>
            <AccessTimeIcon />
          </TimeIcon>
          <div>{covertTime(Number(row.creationTime))}</div>
        </Time>
        <OperateIcon>
          <VisibilityIcon
            size='small'
            onClick={() => {
              showBackItem(row);
            }}
          />
          <Delete
            onClick={() => {
              removeCartItem(seq);
            }}
            size='small'
          />
        </OperateIcon>
      </ItemFooter>
    </CartItemContainer>
  );
};

export default CartItem;
