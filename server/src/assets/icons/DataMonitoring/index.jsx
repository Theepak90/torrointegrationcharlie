/* third lib */
import React from 'react';

/* material-ui */
import SvgIcon from '@mui/material/SvgIcon';

function DataMonitoring(props) {
  return (
    <SvgIcon
      {...props}
      width='32'
      height='32'
      viewBox='0 0 24 24'
      strokeWidth='2'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z'
      ></path>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z'
      ></path>
    </SvgIcon>
  );
}

export default DataMonitoring;
