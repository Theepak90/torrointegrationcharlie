/* third libs */
import React, { useMemo } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';

/* material-ui */
import Model from '@basics/Modal';
import Text from '@basics/Text';
import HeadLine from '@basics/HeadLine';
import Button from '@basics/Button';
import Loading from '@assets/icons/StatusIcon/Loading';
import Confirm from '@assets/icons/StatusIcon/Confirm';
import Success from '@assets/icons/StatusIcon/Success';
import ErrorIcon from '@assets/icons/StatusIcon/Error';

// 从theme.js中导入全局变量
import { COLORS, SPACING, FONT_SIZES } from '../../theme';

// 使用@emotion/styled创建样式组件
const ConfirmModal = styled.div`
  width: 46rem;
  min-height: 30.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  .close {
    width: 2rem;
    height: 2rem;
    color: ${COLORS.color12};
    position: absolute;
    top: 2rem;
    right: 2rem;
    cursor: pointer;
  }

  &:focus-visible {
    outline: 0;
  }
`;

const StatusIcon = styled.div`
  width: 10.25rem;
  height: 10.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${SPACING.space20} 0 4rem 0;

  svg {
    width: auto;
    height: auto;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3rem;

  h1 {
    text-align: center;
  }
`;

// 为不同状态创建不同的Modal样式
const Status0Modal = styled(ConfirmModal)`
  ${ModalContent} h1 {
    color: ${COLORS.headlineGrey};
  }
`;

const Status1Modal = styled(ConfirmModal)`
  ${ModalContent} h1 {
    color: ${COLORS.darkYellow};
  }
`;

const Status2Modal = styled(ConfirmModal)`
  ${ModalContent} h1 {
    color: ${COLORS.mainPurple};
  }
`;

const StatusErrorModal = styled(ConfirmModal)`
  ${ModalContent} h1 {
    color: ${COLORS.darkRed};
  }
`;

const Content = styled.div`
  margin-top: ${SPACING.space32};
  color: ${COLORS.textGrey};

  span {
    font-size: ${FONT_SIZES.fontSize2};
    display: inline-block;
    text-align: center;
  }
`;

const Extent = styled.div`
  width: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${SPACING.space20};
`;
const statusMap = {
  0: { buttonText: 'back', title: 'plsWait', icon: Loading },
  1: { buttonText: 'confirm', title: 'almost', icon: Confirm },
  2: { buttonText: 'continue', title: 'allDone', icon: Success },
  3: { buttonText: 'tryAgain', title: 'ooops', icon: ErrorIcon },
  4: {
    buttonText: 'stay',
    title: 'loginPendingExpired',
    icon: ErrorIcon,
    button2Text: 'logout',
  },
  5: {
    buttonText: 'logout',
    title: 'loginExpired',
    icon: ErrorIcon,
  },
};
const CallModal = ({
  status,
  children,
  content,
  open,
  buttonClickHandle,
  handleClose,
  buttonText,
  successCb,
}) => {
  const currentModelData = useMemo(() => {
    return statusMap[status];
  }, [status]);

  const Icon = useMemo(() => {
    return currentModelData.icon;
  }, [currentModelData]);

  const closeHandler = useMemo(() => {
    return status === 4 ? null : handleClose;
  }, [status, handleClose]);

  // 根据不同status选择不同的Modal组件
  const ModalComponent = useMemo(() => {
    switch (status) {
      case 0:
        return Status0Modal;
      case 1:
        return Status1Modal;
      case 2:
        return Status2Modal;
      case 3:
      case 4:
      case 5:
        return StatusErrorModal;
      default:
        return ConfirmModal;
    }
  }, [status]);

  return (
    <Model open={open} handleClose={closeHandler}>
      <ModalComponent>
        <StatusIcon>
          <Icon />
        </StatusIcon>
        <ModalContent>
          <HeadLine>
            <Intl id={currentModelData.title} />
          </HeadLine>
          <Content>
            <Text type='large'>{content}</Text>
          </Content>
        </ModalContent>
        <Extent>{children}</Extent>
        <ButtonGroup>
          <Button
            onClick={() => {
              if (buttonClickHandle) {
                buttonClickHandle();
              } else {
                handleClose();
              }
            }}
          >
            <Text type='title'>
              <Intl id={buttonText || currentModelData.buttonText} />
            </Text>
          </Button>
          {successCb && (
            <Button
              onClick={() => {
                successCb();
              }}
              style={{ marginLeft: SPACING.space20 }}
            >
              <Text type='title'>
                <Intl
                  id={
                    currentModelData.button2Text
                      ? currentModelData.button2Text
                      : 'checkRequest'
                  }
                />
              </Text>
            </Button>
          )}
        </ButtonGroup>
      </ModalComponent>
    </Model>
  );
};

export default CallModal;
