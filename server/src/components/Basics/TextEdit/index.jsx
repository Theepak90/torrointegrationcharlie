/* third lib*/
import React, { useState, useRef, useMemo } from 'react';
import styled from '@emotion/styled';

/* MUI */
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Clear';

// Import global variables from theme.js
import { COLORS, SPACING } from '../../theme';

// Create styled component using @emotion/styled
const TextEditor = styled.div`
  display: inline-block;
`;

const TextEditorBox = styled.div`
  display: flex;
  align-items: center;

  .icon {
    width: 1rem;
    height: 1rem;
    color: ${COLORS.textGrey};
    margin-right: ${SPACING.space12};
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, visibility 0.2s ease;
  }

  &:hover,
  &.editState {
    .icon {
      opacity: 1;
      visibility: visible;
      cursor: pointer;
    }
  }
`;

const Label = styled.div`
  margin-right: ${SPACING.space24};
  outline: 0;
`;

const TextEdit = ({ value, onChange, ...props }) => {
  const [editState, setEditState] = useState(false);
  const textDivRef = useRef();

  const showEdit = useMemo(() => {
    return !value.trim() ? true : false;
  }, [value]);

  return (
    <TextEditor>
      <TextEditorBox className={editState || showEdit ? 'editState' : ''}>
        <Label
          ref={textDivRef}
          contentEditable={editState}
          onInput={e => {}}
          suppressContentEditableWarning={true}
          onFocus={e => {
            textDivRef.current.focus();
            var range = document.createRange();
            var sel = window.getSelection();
            const el = textDivRef.current;
            range.setStart(el, 1);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }}
          onBlur={e => {
            setEditState(false);
            onChange(e.target.innerText);
          }}
        >
          {value}
          <span></span>
        </Label>

        {!editState && (
          <Edit
            className='icon'
            onClick={() => {
              setEditState(true);
              setTimeout(() => {
                textDivRef.current.focus();
              });
            }}
          />
        )}
        {editState && (
          <Delete
            className='icon'
            onClick={() => {
              setEditState(false);
            }}
          />
        )}
      </TextEditorBox>
    </TextEditor>
  );
};

export default TextEdit;
