/* third lib */
import React, { useCallback, useState } from 'react';
import { FormattedMessage as Intl } from 'react-intl';

/* MUI */
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/* local components & methods */
import styled from '@emotion/styled';
import DatePicker from '@basics/DatePicker';
import Select from '@basics/Select';
import Button from '@basics/Button';
import FilterIcon from '@assets/icons/FilterIcon';

// 导入主题变量
import { COLORS, SPACING, SHADOWS } from '../theme';

// 创建样式化组件
const FilterPaper = styled(Paper)`
  display: flex;
  align-items: center;
  position: relative;
  width: 36rem;
  height: 3rem;
  box-shadow: ${SHADOWS.cardShadow};
`;

const ListPaper = styled(Paper)`
  width: 36rem;
`;

const FilterInput = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  svg {
    margin: 0 ${SPACING.space8};
    width: 1.5rem;
    height: 1.5rem;
    color: ${COLORS.textGrey};
  }
`;

const FilterBox = styled.div`
  width: 100%;
  padding: ${SPACING.space12};
`;

const FilterItem = styled.div`
  margin-bottom: ${SPACING.space12};

  .label {
    color: ${COLORS.mainPurple};
    margin-bottom: ${SPACING.space8};
  }

  .detail {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .sep {
      margin: 0 ${SPACING.space8};
    }
  }
`;

const ButtonRow = styled.div`
  margin: ${SPACING.space20} 0 ${SPACING.space12} 0;
  display: flex;
  justify-content: flex-end;

  .clear {
    margin-right: ${SPACING.space12};
  }
`;

const FilterPanel = ({
  id,
  options,
  handleApply,
  handleReset,
  condition,
  approved,
}) => {
  const [filterData, setFilterData] = useState({
    form_id: '',
    creator_id: '',
    from: '',
    to: '',
    ...condition,
  });
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleClick = event => {
    setOpen(!open);
  };

  const handleClose = useCallback(e => {
    if (
      e &&
      e.target &&
      e.target.nodeName === 'BODY' &&
      e.target.style.overflow === 'hidden'
    ) {
      return;
    }
    setOpen(false);
  }, []);

  const handleResetClick = useCallback(
    e => {
      handleReset();
    },
    [handleReset]
  );

  return (
    <FilterPaper id={id} ref={anchorRef} elevation={0}>
      <FilterInput onClick={handleClick}>
        <FilterIcon />
        <ExpandMoreIcon />
      </FilterInput>
      <Popper
        placement='bottom'
        id='simple-menu'
        anchorEl={anchorRef.current}
        open={open}
      >
        <div style={{ width: '36rem' }}>
          <ListPaper elevation={2}>
            <ClickAwayListener
              onClickAway={e => {
                handleClose(e);
              }}
            >
              <FilterBox>
                {approved && (
                  <FilterItem>
                    <div className='label'>
                      <Intl id='requestor' />
                    </div>
                    <div className='detail'>
                      <Select
                        value={filterData.creator_id}
                        options={options.creator}
                        onChange={value => {
                          setFilterData({
                            ...filterData,
                            creator_id: value,
                          });
                        }}
                      />
                    </div>
                  </FilterItem>
                )}
                <FilterItem>
                  <div className='label'>
                    <Intl id='associatedForm' />
                  </div>
                  <div className='detail'>
                    <Select
                      value={filterData.form_id}
                      options={options.formList}
                      onChange={value => {
                        setFilterData({
                          ...filterData,
                          form_id: value,
                        });
                      }}
                    />
                  </div>
                </FilterItem>
                <FilterItem>
                  <div className='label'>Period</div>
                  <div className='detail'>
                    <DatePicker
                      value={filterData.from}
                      onChange={value => {
                        setFilterData({
                          ...filterData,
                          from: value,
                        });
                      }}
                    />
                    <div className='sep'>-</div>
                    <DatePicker
                      value={filterData.to}
                      onChange={value => {
                        setFilterData({
                          ...filterData,
                          to: value,
                        });
                      }}
                    />
                  </div>
                </FilterItem>
                <ButtonRow>
                  <div className='clear'>
                    <Button
                      onClick={() => {
                        handleResetClick();
                      }}
                      size='small'
                    >
                      Reset
                    </Button>
                  </div>
                  <Button
                    size='small'
                    filled
                    onClick={() => {
                      handleApply(filterData);
                    }}
                  >
                    Apply
                  </Button>
                </ButtonRow>
              </FilterBox>
            </ClickAwayListener>
          </ListPaper>
        </div>
      </Popper>
    </FilterPaper>
  );
};

export default FilterPanel;
