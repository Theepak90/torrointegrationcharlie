import styled from '@emotion/styled';
import { THEME } from '@comp/theme';

// Shared styled components
export const ModuleEdit = styled.div`
  margin-top: ${THEME.spacing.space40};

  .title {
    text-align: center;
    color: ${THEME.colors.mainPurple};
    margin-bottom: ${THEME.spacing.space40};
  }
`;

export const EditItem = styled.div`
  display: flex;
  align-items: center;
  margin: ${THEME.spacing.space20} 0;

  svg {
    color: ${THEME.colors.mainPurple};
  }
`;

export const Label = styled.div`
  color: ${THEME.colors.textGrey};
  margin-right: 1rem;
  text-align: right;
`;

export const EditInput = styled.div`
  flex: 1;

  input {
    border: 1px solid ${THEME.colors.textGrey};
    padding: 0.5rem 1rem;
    height: 1.5rem;
    border-radius: 4px;

    &:focus,
    &:active {
      border-color: ${THEME.colors.mainPurple};
    }
  }
`;

export const KeypairItem = styled.div`
  display: flex;
  align-items: center;
`;

export const ColumnItem = styled.div`
  flex-direction: column;
  align-items: start;

  .label {
    margin-bottom: ${THEME.spacing.space20};
  }
`;
