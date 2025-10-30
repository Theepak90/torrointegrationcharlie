/* third lib*/
import React, { useState } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

/* local components & methods */
import { SPACING, COLORS } from '@comp/theme';
import TagTemplateList from './TagTemplateList';
import CallModal from '@basics/CallModal';
import Button from '@basics/Button';

// Styled components
const DataGovernorTagTemplateContainer = styled.div`
  width: 100%;
  min-height: 100%;
  background-color: ${COLORS.white};
  padding: ${SPACING.space44};
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${SPACING.space32};
`;

const DataGovernorTagTemplate = () => {
  const navigate = useNavigate();

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
    <DataGovernorTagTemplateContainer>
      <TagTemplateList setStep={() => {}} setCurrentId={() => {}} />

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
    </DataGovernorTagTemplateContainer>
  );
};

export default DataGovernorTagTemplate;
