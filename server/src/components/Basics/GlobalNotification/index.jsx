/* third lib*/
import React, { useMemo, useEffect } from 'react';
import styled from '@emotion/styled';

/* MUI */
import Alert from '@mui/material/Alert';

// 使用@emotion/styled创建样式组件
const GlobalNotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  max-width: 500px;
  width: 90%;
`;

const statusMap = {
  0: { severity: 'info', autoHideDuration: 6000 },
  1: { severity: 'warning' },
  2: { severity: 'success', autoHideDuration: 6000 },
  3: { severity: 'error' },
};

const GlobalNotification = ({ status, msg, show, handleClose }) => {
  const [open, setOpen] = React.useState(show);
  const severity = useMemo(() => {
    let tmpStatus = status || 1;
    return statusMap[tmpStatus].severity;
  }, [status]);

  const autoHideDuration = useMemo(() => {
    let tmpStatus = status || 1;
    return statusMap[tmpStatus].autoHideDuration;
  }, [status]);

  const onClose = () => {
    setOpen(false);
    if (handleClose) {
      handleClose();
    }
  };

  useEffect(() => {
    setOpen(show);
  }, [show]);

  useEffect(() => {
    if (open && autoHideDuration) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration]);

  // 添加错误边界处理
  if (!msg || !open) {
    return null;
  }

  return (
    <GlobalNotificationContainer>
      <Alert
        severity={severity}
        onClose={onClose}
        elevation={6}
        variant='filled'
        sx={{
          width: '100%',
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
      >
        {msg}
      </Alert>
    </GlobalNotificationContainer>
  );
};

export default GlobalNotification;
