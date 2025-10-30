/* third lib*/
import React, { useEffect, useState, useCallback } from 'react';
import styled from '@emotion/styled';

/* MUI */
import Paper from '@mui/material/Paper';

/* local components & methods */
import Text from '@basics/Text';
import { getFormItem } from '@lib/api';
import { sendNotify } from 'src/utils/systerm-error';
import Loading from '@assets/icons/Loading';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from '@basics/Table';
import { covertToCurrentTime } from 'src/utils/timeFormat';
import { useGlobalContext } from 'src/context';
import { THEME } from '../theme';

// Styled components
const TagTitle = styled.div`
  margin-top: 3.125rem;
  margin-bottom: ${THEME.spacing.space20};
  color: ${THEME.colors.textGrey};
`;

const TagDisplay = ({ tagData }) => {
  const { timeContext } = useGlobalContext();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  const covertTime = useCallback(
    date => {
      return covertToCurrentTime(date, timeContext.timeFormat);
    },
    [timeContext]
  );

  useEffect(() => {
    if (tagData) {
      getFormItem({ id: tagData.tag_template_form_id })
        .then(res => {
          if (res.data) {
            let data = res.data;
            data.fieldList.map(item => {
              item.default = tagData.data[item.id] || '';
              return item;
            });
            setFormData(data);
            setLoading(false);
          }
        })
        .catch(e => {
          sendNotify({ msg: e.message, status: 3, show: true });
        });
    }
  }, [tagData]);

  return (
    <div style={{ width: '100%' }}>
      {loading && <Loading />}
      {!loading && (
        <>
          <TagTitle>
            <Text type='title'>{formData.title}</Text>
          </TagTitle>
          <div>
            <TableContainer component={Paper}>
              <Table size='small' aria-label='a dense table'>
                <TableHead>
                  <TableRow>
                    <TableCell width='30%' align='center'>
                      Label
                    </TableCell>
                    <TableCell width='70%' align='center'>
                      Value
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.fieldList.map((row, index) => {
                    let isDate = row.style === 6;
                    return (
                      <TableRow key={index}>
                        <TableCell width='30%' align='center'>
                          {row.label}
                        </TableCell>
                        <TableCell width='70%' align='center'>
                          {isDate ? covertTime(row.default) : row.default}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default TagDisplay;
