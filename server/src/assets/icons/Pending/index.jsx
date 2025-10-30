/* third lib */
import React from 'react';

/* material-ui */
import SvgIcon from '@mui/material/SvgIcon';

function Pending(props) {
  return (
    <SvgIcon {...props} viewBox='0 0 1024 1024' width='200' height='200'>
      <path
        d='M554.656 170.656h-85.344v362.656l273.056 183.456 51.2-68.256-238.944-157.856z'
        p-id='994'
      ></path>
      <path
        d='M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m0 938.656c-234.656 0-426.656-192-426.656-426.656S277.344 85.344 512 85.344s426.656 192 426.656 426.656-192 426.656-426.656 426.656z'
        p-id='995'
      ></path>
    </SvgIcon>
  );
}

export default Pending;
