/* third lib*/
import React, { useEffect, useState } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';

/* material-ui */
import Paper from '@mui/material/Paper';

/* local components & methods */
import renderOption from 'src/utils/renderOption';
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
import { THEME } from '../theme';

// Styled components
const TagCards = styled.div`
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.25);
  margin-bottom: ${THEME.spacing.space20};
  width: 100%;
`;

const Title = styled.div`
  color: #333;
  padding: ${THEME.spacing.space20};
  font-size: ${THEME.fontSizes.fontSize3};
  display: inline-block;
`;

const Required = styled.div`
  color: ${THEME.colors.mainRed};
  padding: ${THEME.spacing.space20};
  font-size: ${THEME.fontSizes.fontSize3};
  float: right;
  font-weight: ${THEME.fontWeights.medium};
`;

const TagDetail = styled.div`
  clear: both;
`;

const TableTag = ({ tagData }) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tagData) {
      getFormItem({ id: tagData.tag_template_form_id })
        .then(res => {
          if (res.data) {
            let data = res.data;
            if (tagData.data) {
              data.fieldList.map(item => {
                if (item.style === 6) {
                  item.default =
                    typeof tagData.data[item.id] === 'object'
                      ? tagData.data[item.id].toGMTString()
                      : tagData.data[item.id] || '';
                } else if (item.style === 5) {
                  item.default = String(tagData.data[item.id]);
                } else {
                  item.default = tagData.data[item.id] || '';
                }

                return item;
              });
            }
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
    <TagCards>
      {loading && <Loading />}
      {!loading && (
        <>
          <Title>{formData.title}</Title>
          {tagData.required && (
            <Required>
              <Intl id='required_' />
            </Required>
          )}
          <TagDetail>
            <TableContainer component={Paper}>
              <Table size='small' aria-label='a dense table'>
                <TableHead>
                  <TableRow>
                    <TableCell width='30%' align='center'>
                      <Intl id='label'></Intl>
                    </TableCell>
                    <TableCell width='70%' align='center'>
                      <Intl id='value'></Intl>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.fieldList.map((row, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell width='30%' align='center'>
                          {row.label}
                        </TableCell>
                        <TableCell width='70%' align='center'>
                          {row.style === 2 &&
                            renderOption(row.default, row.options)}
                          {row.style !== 2 && row.default}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </TagDetail>
        </>
      )}
    </TagCards>
  );
};

export default TableTag;
