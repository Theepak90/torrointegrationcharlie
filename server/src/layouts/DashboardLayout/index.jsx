/* third lib */
import React from 'react';
import { Outlet } from 'react-router-dom';
import ScrollBar from 'react-perfect-scrollbar';
import cn from 'classnames';

/* local components & methods */
import { THEME } from '@comp/theme';
import withAuthentication from 'src/hoc/withAuthentication';

const DashboardLayout = ({ singlePage }) => {
  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: THEME.colors.lightGrey,
        width: '100%',
        height: `calc(100vh - ${THEME.sizes.sessionBarHeight})`,
        minWidth: '1280px',
        margin: '0 auto',
        padding: '0 1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          margin: `${THEME.spacing.space16} 0`,
          borderRadius: '4px',
        }}
      >
        {singlePage && (
          <div
            className={cn({
              singlePage: true,
            })}
            style={{
              height: '100%',
              backgroundColor: THEME.colors.lightGrey,
              position: 'relative',
              minHeight: '100%',
              boxShadow: THEME.shadows.paperShadow,
              overflow: 'hidden',
            }}
          >
            <ScrollBar>
              <Outlet />
            </ScrollBar>
          </div>
        )}
        {!singlePage && (
          <div
            style={{
              height: '100%',
              backgroundColor: THEME.colors.lightGrey,
              position: 'relative',
              minHeight: '100%',
            }}
          >
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuthentication(DashboardLayout);
