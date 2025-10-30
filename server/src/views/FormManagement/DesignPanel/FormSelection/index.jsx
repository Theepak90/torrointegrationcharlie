/* third lib*/
import React from 'react';
import Scrollbar from 'react-perfect-scrollbar';
import cn from 'classnames';
import { FormattedMessage as Intl } from 'react-intl';

/* material-ui */
import AddIcon from '@mui/icons-material/Add';

/* local components & methods */
import Text from '@basics/Text';
import Delete from '@assets/icons/Delete';
import styled from '@emotion/styled';
import { SPACING, COLORS } from '@comp/theme';

const FormSelectionContainer = styled.div({
  height: '100%',
  backgroundColor: COLORS.white,
  marginRight: SPACING.space16,
  marginLeft: SPACING.space24,
  display: 'flex',
  flexDirection: 'column',
});

const DesignerTitle = styled.div({
  marginTop: '3.125rem',
  color: COLORS.mainPurple,
  margin: `3.125rem ${SPACING.space40} 0 ${SPACING.space40}`,
});

const CreatedForm = styled.div({
  color: COLORS.textGrey,
  lineHeight: '3.25rem',
  cursor: 'pointer',
  borderTop: `1px solid ${COLORS.lightGrey}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '& span': {
    display: 'inline-block',
    width: '100%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  '& svg': {
    width: '1rem',
    height: '1rem',
    display: 'none',
  },
  '&:hover svg': {
    display: 'inline-block',
  },
  '&.active': {
    color: COLORS.mainPurple,
  },
});

const CreatedFormList = styled.div({
  padding: '2.5rem',
  paddingBottom: 0,
});

const AddForm = styled.div({
  border: `1px solid ${COLORS.mainPurple}`,
  borderRadius: '4px',
  height: '2.25rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: COLORS.mainPurple,
  margin: `${SPACING.space24} ${SPACING.space16}`,
  cursor: 'pointer',
  '& svg': {
    marginRight: '8px',
  },
});

const FormSelection = ({
  formList,
  currentForm,
  formChange,
  addForm,
  deleteForm,
  tagTemplate,
}) => {
  return (
    <FormSelectionContainer id='formSelection'>
      <DesignerTitle>
        <Text type='title'>
          {tagTemplate ? 'Design panel' : 'Created form'}
        </Text>
      </DesignerTitle>
      {!tagTemplate && (
        <Scrollbar>
          <CreatedFormList>
            {formList.map((item, index) => {
              return (
                <CreatedForm
                  key={item.id}
                  className={cn({
                    active: currentForm && item.id === currentForm.id,
                  })}
                  onClick={() => {
                    formChange(item.id);
                  }}
                  title={item.title}
                >
                  <Text type='subTitle'>{item.title}</Text>
                  <Delete
                    onClick={() => {
                      deleteForm(item.id, index);
                    }}
                  />
                </CreatedForm>
              );
            })}
          </CreatedFormList>
          {currentForm && currentForm.id !== 'ADD' && (
            <AddForm
              onClick={() => {
                addForm();
              }}
            >
              <AddIcon />
              <Intl id='addForm' />
            </AddForm>
          )}
        </Scrollbar>
      )}
    </FormSelectionContainer>
  );
};

export default FormSelection;
