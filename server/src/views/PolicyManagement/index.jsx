/* third lib*/
import React, { useState } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

/* local components & methods */
import { SPACING, COLORS } from '@comp/theme';
import PolicyTagTable from './PolicyTagTable';
import Policy from './Policy';
import CallModal from '@basics/CallModal';
import Button from '@basics/Button';

// Styled components
const PolicyManagementContainer = styled.div`
  width: 100%;
  min-height: 100%;
  background-color: ${COLORS.white};
  padding: ${SPACING.space44};
`;

const PolicyContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${SPACING.space32};
`;

const PolicyManagement = () => {
  const navigate = useNavigate();
  const [currentId, setCurrentId] = useState(null);
  const [step, setStep] = useState(0);

  const [modalData, setModalData] = useState({
    open: false,
    status: 0,
    content: '',
    cb: null,
  });

  const closeModal = () => {
    setModalData({ ...modalData, open: false, cb: null });
  };

  return (
    <PolicyManagementContainer>
      {step === 0 && (
        <PolicyContainer>
          <PolicyTagTable setStep={setStep} setCurrentId={setCurrentId} />
        </PolicyContainer>
      )}
      {step === 1 && (
        <Policy
          onBack={() => {
            setStep(0);
            setCurrentId(null);
          }}
          currentId={currentId}
        />
      )}

      <ButtonWrapper>
        <Button
          onClick={() => {
            navigate(`/app/dashboard`);
          }}
          variant='contained'
        >
          <Intl id='backToDashboard' />
        </Button>
      </ButtonWrapper>

      <CallModal
        open={modalData.open}
        content={modalData.content}
        status={modalData.status}
        buttonClickHandle={modalData.cb}
        handleClose={closeModal}
      />
    </PolicyManagementContainer>
  );
};

export default PolicyManagement;
