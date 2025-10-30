/* third lib*/
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import ScrollBar from 'react-perfect-scrollbar';

/* local components & methods */
import PolicyTagTree from './PolicyTagTree';
import AddTag from './AddTag';
import styled from '@emotion/styled';
import { SPACING, COLORS, SHADOWS } from '@comp/theme';

const Mask = styled.div({
  zIndex: 999,
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
});

const DesignerPanel = styled.div({
  height: '100%',
  width: 0,
  backgroundColor: COLORS.white,
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  borderRadius: '4px',
  top: 0,
  right: 0,
  padding: `${SPACING.space32} 0`,
  boxShadow: SHADOWS.paperShadow,
  '&.open': {
    transition: '0.3s all',
    width: '48rem',
  },
});

const InnerContent = styled.div({
  padding: `0 ${SPACING.space32}`,
});

const DesignPanel = ({
  open,
  handleClose,
  handleApply,
  type,
  tagTemplateList,
  checkedTagList,
}) => {
  const [openState, setOpenState] = useState(false);

  useEffect(() => {
    if (!open) {
      setOpenState(false);
      return;
    }
    setTimeout(() => {
      setOpenState(true);
    }, 0);
  }, [open]);

  if (!open) {
    return <></>;
  }

  return (
    <Mask>
      <ClickAwayListener onClickAway={handleClose}>
        <DesignerPanel
          id='designPanel'
          className={cn({
            open: openState,
          })}
        >
          <ScrollBar>
            <InnerContent>
              {type === 0 && <PolicyTagTree handleApply={handleApply} />}
              {(type === 1 || type === 2) && (
                <AddTag
                  handleApply={handleApply}
                  type={type}
                  tagTemplateList={tagTemplateList}
                  checkedTagList={checkedTagList}
                />
              )}
            </InnerContent>
          </ScrollBar>
        </DesignerPanel>
      </ClickAwayListener>
    </Mask>
  );
};

export default DesignPanel;
