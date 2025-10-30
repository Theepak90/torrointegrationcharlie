/* third lib */
import React from 'react';

/* material-ui */
import SvgIcon from '@mui/material/SvgIcon';

function DataExploration(props) {
  return (
    <SvgIcon {...props} width='490' height='490' viewBox='0 0 490 490'>
      <path
        fill='none'
        stroke='currentColor'
        strokeWidth='36'
        strokeLinecap='round'
        d='m280,278a153,153 0 1,0-2,2l170,170m-91-117 110,110-26,26-110-110'
      />
    </SvgIcon>
  );
}

export default DataExploration;
