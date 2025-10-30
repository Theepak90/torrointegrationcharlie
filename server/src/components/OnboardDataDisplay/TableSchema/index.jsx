/* third lib*/
import React, { useState, useMemo } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';

/* material-ui */
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

/* local components & methods */
import Text from '@basics/Text';
import { openTips } from 'src/utils/systemTips';
import { THEME } from '../../theme';

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from '@basics/Table';

// Styled components
const OperationButton = styled.div`
  cursor: pointer;
  margin-left: 1rem;
  align-items: center;

  svg {
    color: ${THEME.colors.textGrey};
    width: 1.5rem;
    height: 1.5rem;

    &:nth-child(1) {
      margin-right: ${THEME.spacing.space8};
    }

    &:hover {
      color: ${THEME.colors.mainPurple};
    }
  }
`;

const PolicyTag = styled.div`
  padding: ${THEME.spacing.space8};
  background: gainsboro;
  border-radius: 4px;
  display: inline-block;
  margin: ${THEME.spacing.space4};
  min-width: ${THEME.spacing.space16};
  min-height: ${THEME.spacing.space12};
  position: relative;
  border-radius: ${THEME.spacing.space8};
  cursor: pointer;

  .delete {
    position: absolute;
    top: -${THEME.spacing.space12};
    right: -${THEME.spacing.space12};
    cursor: pointer;
    display: none;

    svg {
      width: ${THEME.spacing.space20};
      height: ${THEME.spacing.space20};
    }
  }

  &:hover {
    .delete {
      display: block;
    }
  }
`;

const ColumnTag = styled.div`
  padding: ${THEME.spacing.space8};
  background: gainsboro;
  border-radius: 4px;
  display: inline-block;
  margin: ${THEME.spacing.space4};
  min-width: ${THEME.spacing.space16};
  min-height: ${THEME.spacing.space12};
  position: relative;
  border-radius: ${THEME.spacing.space8};
  cursor: pointer;

  .delete {
    position: absolute;
    top: -${THEME.spacing.space12};
    right: -${THEME.spacing.space12};
    cursor: pointer;
    display: none;

    svg {
      width: ${THEME.spacing.space20};
      height: ${THEME.spacing.space20};
    }
  }

  &:hover {
    .delete {
      display: block;
    }
  }
`;

const NestedRowList = ({
  nestedList,
  parentIndex,
  tagTemplateMap,
  policyMap,
}) => {
  return (
    <>
      {nestedList.map((childElem, rowIndex) => {
        const schemaRowIndex = `${parentIndex}.${rowIndex}`;
        return (
          <SchemaRow
            key={`${schemaRowIndex}`}
            row={childElem}
            rowIndex={schemaRowIndex}
            tagTemplateMap={tagTemplateMap}
            policyMap={policyMap}
          />
        );
      })}
    </>
  );
};

const SchemaRow = ({ row, rowIndex, tagTemplateMap, policyMap }) => {
  const [open, setOpen] = useState(false);
  const schemaRowIndex = rowIndex;

  const indexArr =
    typeof schemaRowIndex === 'string'
      ? schemaRowIndex.split('.')
      : [schemaRowIndex];

  const sepPadding = 2;
  const isRecord = row.type === 'RECORD';

  return (
    <>
      <TableRow>
        <TableCell
          style={{ textIndent: sepPadding * (indexArr.length - 1) + 'rem' }}
          align='left'
        >
          {isRecord && (
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
          {row.name}
        </TableCell>
        <TableCell align='center'>{row.type}</TableCell>
        <TableCell align='center'>{row.mode}</TableCell>
        <TableCell align='center'>
          {row.tags &&
            row.tags.map((item, index) => {
              return (
                <div key={index}>
                  {tagTemplateMap[item.tag_template_form_id] && (
                    <ColumnTag
                      key={index}
                      onClick={() => {
                        openTips({
                          style: 1,
                          tagData: item,
                        });
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          fontWeight: THEME.fontWeights.bold,
                          color: 'black',
                          marginRight: THEME.spacing.space8,
                        }}
                      >
                        {tagTemplateMap[item.tag_template_form_id]}
                      </span>
                    </ColumnTag>
                  )}
                </div>
              );
            })}
        </TableCell>
        <TableCell align='center'>
          {row.policyTags &&
            row.policyTags.names.map((item, index) => {
              return (
                <div key={index}>
                  {policyMap[item] && (
                    <PolicyTag key={index}>
                      <span
                        style={{
                          display: 'inline-block',
                          fontWeight: THEME.fontWeights.bold,
                          color: 'black',
                          marginRight: THEME.spacing.space8,
                        }}
                      >
                        {policyMap[item].taxonomy_display_name} :
                      </span>
                      <span
                        style={{
                          fontWeight: THEME.fontWeights.bold,
                          color: 'grey',
                        }}
                      >
                        {policyMap[item].display_name}
                      </span>
                    </PolicyTag>
                  )}
                </div>
              );
            })}
        </TableCell>
        <TableCell align='center'>{row.description}</TableCell>
      </TableRow>
      {isRecord && open && (
        <NestedRowList
          nestedList={row.fields}
          parentIndex={schemaRowIndex}
          tagTemplateMap={tagTemplateMap}
          policyMap={policyMap}
        />
      )}
    </>
  );
};

const TableSchema = ({ tableList, policyMap, tagTemplateList }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const tagTemplateMap = useMemo(() => {
    let map = {};
    tagTemplateList.forEach(item => {
      map[item.tag_template_form_id] = item.display_name;
    });
    return map;
  }, [tagTemplateList]);

  const filterTableList = useMemo(() => {
    if (!tableList) {
      return [];
    }
    let tmpList = tableList;
    return tmpList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [tableList, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell align='left'>
                <Text type='subTitle'>
                  <Intl id='fieldName' />
                </Text>
              </TableCell>
              <TableCell align='center'>
                <Text type='subTitle'>
                  <Intl id='type' />
                </Text>
              </TableCell>
              <TableCell align='center'>
                <Text type='subTitle'>
                  <Intl id='mode' />
                </Text>
              </TableCell>
              <TableCell align='center'>
                <Text type='subTitle'>
                  <Intl id='ColumnTags' />
                </Text>
              </TableCell>
              <TableCell align='center'>
                <Text type='subTitle'>
                  <Intl id='policyTagOr' />
                </Text>
              </TableCell>
              <TableCell align='center' width='25%'>
                <Text type='subTitle'>
                  <Intl id='description' />
                </Text>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterTableList.map((row, rowIndex) => {
              const currentIndex = page * rowsPerPage + rowIndex;
              return (
                <SchemaRow
                  key={currentIndex}
                  row={row}
                  rowIndex={currentIndex}
                  tagTemplateMap={tagTemplateMap}
                  policyMap={policyMap}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={tableList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default TableSchema;
