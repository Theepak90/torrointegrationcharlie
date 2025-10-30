/* third lib*/
import React from 'react';
import { COLORS, SPACING } from '../../theme';

/* material-ui */
import FormLabel from '@mui/material/FormLabel';

/* local components & methods */
import Text from '@basics/Text';
import FileUpload from '@basics/FileUpload';

const UserFileUpload = React.forwardRef(({ id, name, label }, ref) => {
  let textId = id;
  let textLabel = label;
  return (
    <div style={{ color: COLORS.mainPurple }}>
      <FormLabel
        style={{
          display: 'inline-block',
          marginBottom: SPACING.space16,
          color: COLORS.mainPurple,
        }}
      >
        <Text type='subTitle'>{textLabel}</Text>
      </FormLabel>
      <FileUpload ref={ref} id={textId} name={name} />
    </div>
  );
});

export default UserFileUpload;
