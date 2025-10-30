/* third lib*/
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';

/* material-ui */
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Tooltip } from '@mui/material';

/* local components & methods */
import OnboardDataDisplay from '@comp/OnboardDataDisplay';
import Model from '@basics/Modal';
import styled from '@emotion/styled';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  SHADOWS,
} from '@comp/theme';
import { getTableSchema } from '@lib/api';
import TableTagDisplay from '@comp/TableTag';
import Loading from '@assets/icons/Loading';
import Text from '@basics/Text';
import { sendNotify } from 'src/utils/systerm-error';
import DesignPanel from '../DesignPanel';
import bigQuery from 'src/assets/bigquery.png';
import hive from 'src/assets/hive.png';
import Database from 'src/assets/icons/Database';
import TableView from 'src/assets/icons/TableView';
import { covertToCurrentTime } from 'src/utils/timeFormat';
import { useGlobalContext } from 'src/context';
// import Tooltip from "@basics/Tooltip";

const StyledCard = styled(Card)`
  width: calc(33.3% - 2.5rem);
  margin: ${SPACING.space20};
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: space-around;

  &.GCP {
    .tableImg {
      width: 10rem;
    }
    svg {
      color: ${COLORS.mainPurple};
      fill: ${COLORS.mainPurple};
    }
  }
  &.Hive {
    .tagItem {
      background-color: ${COLORS.mainYellow};
    }
    .attrLabel {
      color: ${COLORS.lightYellow};
    }
    svg {
      color: ${COLORS.lightYellow};
      fill: ${COLORS.lightYellow};
    }
    .tableImg {
      width: 5rem;
    }
  }
`;

const CardHeader = styled.div`
  margin-bottom: ${SPACING.space24};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${COLORS.bgGrey};
`;

const HeaderTitle = styled.div`
  height: 3rem;
  line-height: 3rem;
  color: ${COLORS.textGrey};
  font-weight: ${FONT_WEIGHTS.medium};
  margin-bottom: ${SPACING.space12};
`;

const HeaderDes = styled.div`
  color: ${COLORS.textGrey};
  margin-bottom: ${SPACING.space12};
`;

const ProjectIcon = styled.div`
  text-align: left;
`;

const TableImg = styled.img`
  width: 10rem;
`;

const MainDetail = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${SPACING.space16};
`;

const TableDetail = styled.div`
  width: 70%;
`;

const TagsDetail = styled.div`
  width: 100%;
`;

const TypeIcon = styled.div`
  svg {
    width: 6rem;
    height: 6rem;
    fill: ${COLORS.mainPurple};
  }
`;

const CardLine = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: ${SPACING.space12};
  font-size: ${FONT_SIZES.fontSize3};
  align-items: center;
`;

const AttrLabel = styled.div`
  margin-right: ${SPACING.space8};
  color: ${COLORS.mainPurple};
  font-weight: ${FONT_WEIGHTS.medium};
  display: flex;
  align-items: center;

  svg {
    width: 3rem;
    height: 3rem;
  }
`;

const DataOwner = styled.div`
  margin-top: ${SPACING.space12};

  .attrLabel,
  .value {
    font-size: ${FONT_SIZES.fontSize3};
    font-weight: ${FONT_WEIGHTS.medium};
  }
`;

const TagBox = styled.div`
  margin-bottom: ${SPACING.space20};

  &:last-child() {
    margin-bottom: 0;
  }
`;

const TagTitle = styled.div`
  margin-right: ${SPACING.space8};
  color: ${COLORS.textGrey};
  font-weight: ${FONT_WEIGHTS.medium};
  font-size: ${FONT_SIZES.fontSize4};
  margin-bottom: ${SPACING.space12};
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const TagItem = styled.div`
  padding: ${SPACING.space8};
  background-color: ${COLORS.mainPurple};
  color: ${COLORS.white};
  margin: 0 ${SPACING.space12} ${SPACING.space12} 0;
  border-radius: 0.5rem;
  cursor: pointer;
`;

const BottomBox = styled.div`
  margin: 0 ${SPACING.space16};
  border-top: 1px solid ${COLORS.bgGrey};
  display: flex;
  align-items: center;
  justify-content: space-between;
  svg {
    cursor: pointer;
  }
`;

const AccessTime = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${COLORS.textGrey};
  display: flex;
  align-items: center;
  line-height: 1;

  .bottomIcon {
    margin-right: ${SPACING.space8};
    width: 2rem;
    height: 2rem;
  }
`;

const AddToCard = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;

  svg {
    width: 2rem;
    height: 2rem;
  }
`;

const TagAttr = styled.div`
  display: flex;
  margin: ${SPACING.space8};

  .attrLabel {
    margin-right: ${SPACING.space8};
  }
`;

const ModalContent = styled.div`
  padding: ${SPACING.space20};
`;

const Content = styled.div`
  margin-bottom: ${SPACING.space20};
`;

const ContentTitle = styled.div`
  margin-bottom: ${SPACING.space16};
`;

const CardItem = ({ cardData, resourceDetail }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState();
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  const { timeContext } = useGlobalContext();
  const covertTime = useCallback(
    date => {
      return covertToCurrentTime(date, timeContext.timeFormat);
    },
    [timeContext]
  );

  const connection_type = useMemo(() => {
    return cardData.connection_type ? cardData.connection_type : 'GCP';
  }, [cardData]);

  const tableTags = useMemo(() => {
    if (cardData?.in_use?.tags) {
      return Object.keys(cardData?.in_use?.tags).map(tag => {
        let details = cardData?.in_use?.tags[tag];
        let attrList = Object.keys(details.data).map(key => {
          return { label: details.labels[key], value: details.data[key] };
        });

        return { tagName: tag, attrList: attrList };
      });
    }
    return [];
  }, [cardData]);

  const policyTags = useMemo(() => {
    if (cardData?.in_use?.policyTags) {
      return Object.keys(cardData?.in_use?.policyTags).map(tag => {
        return { tagName: tag, detail: cardData?.in_use?.policyTags[tag] };
      });
    }
    return [];
  }, [cardData]);

  const onAddCartClick = useCallback(() => {
    navigate(
      `/app/getDataAccess?type=${connection_type}&id=${cardData.tableReference.projectId}&dataset=${cardData.tableReference.datasetId}&name=${cardData.tableReference.tableId}`
    );
  }, [cardData, navigate, connection_type]);

  const handleClose = useCallback(() => {
    setCartOpen(false);
  }, []);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getTableSchema({
        resourceType: connection_type,
        projectId: cardData.tableReference.projectId,
        datasetName: cardData.tableReference.datasetId,
        tableName: cardData.tableReference.tableId,
      })
        .then(res => {
          if (res.data) {
            setTableData(res.data);
            setLoading(false);
          }
        })
        .catch(e => {
          sendNotify({ msg: e.message, status: 3, show: true });
        });
    }
  }, [resourceDetail, cardData, open, connection_type]);

  return (
    <>
      <StyledCard
        className={cn({
          [connection_type]: connection_type,
        })}
      >
        <CardContent
          style={{
            flex: 1,
            padding: `${SPACING.space16} ${SPACING.space16} 0 ${SPACING.space16} !important`,
          }}
        >
          <CardHeader>
            <div>
              <HeaderTitle>
                <Text type='title'> {cardData.tableReference.tableId}</Text>
              </HeaderTitle>

              <HeaderDes>
                <Text type='small'> {cardData.description}</Text>
              </HeaderDes>
            </div>
            <ProjectIcon>
              {connection_type === 'GCP' && (
                <TableImg src={bigQuery} alt={connection_type} />
              )}
              {connection_type === 'Hive' && (
                <TableImg src={hive} alt={connection_type} />
              )}
            </ProjectIcon>
          </CardHeader>
          <MainDetail>
            <TableDetail>
              <CardLine>
                <AttrLabel>
                  <Intl id='projectName' />
                </AttrLabel>
                <div>{cardData.tableReference.projectId}</div>
              </CardLine>
              <CardLine>
                <AttrLabel>
                  <Intl id='dataSet' />
                </AttrLabel>
                <div>{cardData.tableReference.datasetId}</div>
              </CardLine>
              <CardLine>
                <AttrLabel>
                  <Intl id='location' />
                </AttrLabel>
                <div>{cardData.location}</div>
              </CardLine>
            </TableDetail>
            <TypeIcon>
              {cardData.type === 'TABLE' && <Database />}
              {cardData.type === 'VIEW' && <TableView />}
            </TypeIcon>
          </MainDetail>
          <MainDetail>
            <TagsDetail>
              {tableTags && tableTags.length > 0 && (
                <TagBox>
                  <TagTitle>
                    <Intl id='tableTags' />
                  </TagTitle>
                  <TagContainer>
                    {tableTags.map((tagItem, index) => {
                      return (
                        <Tooltip
                          key={index}
                          arrow
                          title={
                            <React.Fragment>
                              {tagItem.attrList.map((attr, index) => {
                                return (
                                  <TagAttr key={index}>
                                    <AttrLabel>{attr.label}:</AttrLabel>
                                    <div>{attr.value}</div>
                                  </TagAttr>
                                );
                              })}
                            </React.Fragment>
                          }
                          placement='bottom'
                        >
                          <TagItem>{tagItem.tagName}</TagItem>
                        </Tooltip>
                      );
                    })}
                  </TagContainer>
                </TagBox>
              )}
              {policyTags && policyTags.length > 0 && (
                <TagBox>
                  <TagTitle>
                    <Intl id='policyTag' />
                  </TagTitle>
                  <TagContainer>
                    {policyTags.map((policyTag, index) => {
                      return (
                        <Tooltip
                          key={index}
                          title={policyTag.detail.ad_groups}
                          placement='bottom'
                          arrow
                        >
                          <TagItem>{policyTag.tagName}</TagItem>
                        </Tooltip>
                      );
                    })}
                  </TagContainer>
                </TagBox>
              )}
            </TagsDetail>
          </MainDetail>
        </CardContent>
        <BottomBox>
          <AccessTime>
            <AccessTimeIcon className='bottomIcon' />
            <div>{covertTime(Number(cardData.creationTime))}</div>
          </AccessTime>
          <CardActions
            style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}
          >
            <VisibilityIcon
              size='small'
              onClick={() => {
                setOpen(true);
              }}
            />
            <ShoppingCartIcon onClick={onAddCartClick} size='small' />
          </CardActions>
        </BottomBox>
      </StyledCard>

      {cartOpen && <DesignPanel open={cartOpen} handleClose={handleClose} />}

      {open && (
        <Model
          open={open}
          handleClose={() => {
            setOpen(false);
          }}
        >
          <ModalContent>
            {loading && (
              <div>
                <Loading />
              </div>
            )}
            {!loading && tableData && (
              <>
                <Content>
                  <ContentTitle>
                    <Text type='title'>
                      <Intl id='tableTags' />
                    </Text>
                  </ContentTitle>
                  <div>
                    {tableData.tags.map((tag, index) => {
                      return <TableTagDisplay key={index} tagData={tag} />;
                    })}
                  </div>
                </Content>
                <Content>
                  <ContentTitle>
                    <Text type='title'>
                      <Intl id='tableSchema' />
                    </Text>
                  </ContentTitle>
                  <OnboardDataDisplay tableList={tableData.schema.fields} />
                </Content>
              </>
            )}
          </ModalContent>
        </Model>
      )}
    </>
  );
};

export default CardItem;
