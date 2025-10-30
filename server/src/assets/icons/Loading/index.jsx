/* third lib */
import React from 'react';
import styled from '@emotion/styled';

/* material-ui v5 */
import SvgIcon from '@mui/material/SvgIcon';
import { THEME } from '@comp/theme';

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  svg {
    width: 5rem;
    height: 5rem;
    fill: ${THEME.colors.darkPurple};
  }
`;

function Loading(props) {
  return (
    <LoadingContainer>
      <SvgIcon
        {...props}
        width='30px'
        height='30px'
        viewBox='0 0 50 50'
        enableBackground='new 0 0 40 40'
        xmlSpace='preserve'
      >
        <path
          d='M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z'
          transform='rotate(275.098 25 25)'
        >
          <animateTransform
            attributeType='xml'
            attributeName='transform'
            type='rotate'
            from='0 25 25'
            to='360 25 25'
            dur='0.6s'
            repeatCount='indefinite'
          ></animateTransform>
        </path>
      </SvgIcon>
    </LoadingContainer>
  );
}

export default Loading;
