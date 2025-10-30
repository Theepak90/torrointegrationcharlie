/* third lib*/
import React, { useState, useMemo, useCallback } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';

/* material-ui */
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

/* local components & methods */
import { SPACING, COLORS, FONT_WEIGHTS } from '@comp/theme';
import Button from '@basics/Button';
import Text from '@basics/Text';
import { openTips } from 'src/utils/systemTips';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from '@basics/Table';

// Styled components
const Filter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: ${SPACING.space40};

  button {
    margin-right: ${SPACING.space20};
  }
`;

const SelectAll = styled.div`
  svg {
    color: ${COLORS.white};
  }
`;

const Operation = styled.div`
  cursor: pointer;
  margin-left: 1rem;
  align-items: center;

  svg {
    color: ${COLORS.textGrey};
    width: 1.5rem;
    height: 1.5rem;
    &:nth-child(1) {
      margin-right: ${SPACING.space8};
    }
    &:hover {
      color: ${COLORS.mainPurple};
    }
  }
`;

const PolicyTag = styled.div`
  padding: ${SPACING.space8};
  background: gainsboro;
  border-radius: 4px;
  display: inline-block;
  margin: ${SPACING.space4};
  min-width: ${SPACING.space16};
  min-height: ${SPACING.space12};
  position: relative;
  border-radius: ${SPACING.space8};

  .delete {
    position: absolute;
    top: -${SPACING.space12};
    right: -${SPACING.space12};
    cursor: pointer;
    display: none;
    svg {
      width: ${SPACING.space20};
      height: ${SPACING.space20};
    }
  }

  &:hover {
    .delete {
      display: block;
    }
  }
`;

const ColumnTag = styled(PolicyTag)`
  cursor: pointer;
`;

const PolicyName = styled.div`
  display: inline-block;
  font-weight: ${FONT_WEIGHTS.bold};
  color: black;
  margin-right: ${SPACING.space8};
`;

const PolicyTagName = styled.div`
  font-weight: ${FONT_WEIGHTS.bold};
  color: grey;
`;

const NestedRowList = ({
  nestedList,
  parentIndex,
  onSelect,
  tagTemplateMap,
  policyMap,
  selectedList,
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
            onSelect={onSelect}
            tagTemplateMap={tagTemplateMap}
            policyMap={policyMap}
            selectedList={selectedList}
          />
        );
      })}
    </>
  );
};

const SchemaRow = ({
  row,
  rowIndex,
  onSelect,
  tagTemplateMap,
  policyMap,
  selectedList,
}) => {
  const [open, setOpen] = useState(false);
  const schemaRowIndex = rowIndex;

  const indexArr =
    typeof schemaRowIndex === 'string'
      ? schemaRowIndex.split('.')
      : [schemaRowIndex];

  const sepPadding = 2;
  const isRecord = row.type === 'RECORD';
  const mustCheck = !row.policyTags || row.policyTags.names.length < 1;

  return (
    <>
      <TableRow>
        <TableCell align='center'>
          <Checkbox
            color='primary'
            checked={
              mustCheck ||
              (!mustCheck && selectedList.includes(row.policyTags.names[0]))
            }
            onChange={() => {
              onSelect(row.policyTags.names[0]);
            }}
            disabled={mustCheck}
          />
        </TableCell>
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
                    <PolicyTag
                      key={index}
                      onClick={() => {
                        openTips({
                          style: 1,
                          tagData: item,
                        });
                      }}
                    >
                      <PolicyName>
                        {tagTemplateMap[item.tag_template_form_id]}
                      </PolicyName>
                    </PolicyTag>
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
                      <PolicyName>
                        {policyMap[item].taxonomy_display_name} :
                      </PolicyName>
                      <PolicyTagName>
                        {policyMap[item].display_name}
                      </PolicyTagName>
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
          onSelect={onSelect}
          tagTemplateMap={tagTemplateMap}
          policyMap={policyMap}
          selectedList={selectedList}
        />
      )}
    </>
  );
};

const TableSchema = ({
  tableData,
  policyMap,
  tagTemplateList,
  addCartHandle,
  alreadySelected,
}) => {
  const [page, setPage] = useState(0);
  const [selectedList, setSelectedList] = useState(alreadySelected || []);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const tableList = useMemo(() => {
    return tableData?.schema?.fields;
  }, [tableData]);

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

  const existPolicyTag = useMemo(() => {
    if (!tableData) {
      return;
    }
    let list = [];

    const extraPolicyTag = (data, parentIndex) => {
      data.fields.forEach((item, index) => {
        let currIndex = parentIndex ? `${parentIndex}.${index}` : index;
        if (item.type === 'RECORD') {
          extraPolicyTag(item, currIndex);
        } else {
          if (item?.policyTags?.names.length > 0) {
            if (!list.includes(item?.policyTags?.names[0])) {
              list.push(item?.policyTags?.names[0]);
            }
          }
        }
      });
    };
    extraPolicyTag(tableData.schema);
    return list;
  }, [tableData]);

  const isSelectedAll = useMemo(() => {
    if (!selectedList.length || !tableList) {
      return false;
    }
    let seletAll = true;
    existPolicyTag.forEach(index => {
      if (!selectedList.includes(index)) {
        seletAll = false;
      }
    });
    return seletAll;
  }, [tableList, selectedList, existPolicyTag]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onSelectAllClick = useCallback(() => {
    if (isSelectedAll) {
      setSelectedList([]);
    } else {
      setSelectedList(JSON.parse(JSON.stringify(existPolicyTag)));
    }
  }, [isSelectedAll, setSelectedList, existPolicyTag]);

  const onSelect = currIndex => {
    if (!selectedList.includes(currIndex)) {
      let tmp = [...selectedList, currIndex];
      setSelectedList(tmp);
    } else {
      let currentIndex = selectedList.indexOf(currIndex);
      let tmp = [...selectedList];
      tmp.splice(currentIndex, 1);
      setSelectedList(tmp);
    }
  };

  return (
    <>
      <Filter>
        <Button
          filled
          onClick={() => {
            addCartHandle(selectedList);
            setSelectedList([]);
          }}
        >
          <Intl id='addToCart' />
        </Button>
      </Filter>
      <TableContainer component={Paper}>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell align='center'>
                <SelectAll>
                  <Checkbox
                    color='primary'
                    checked={isSelectedAll}
                    onChange={onSelectAllClick}
                  />
                </SelectAll>
              </TableCell>
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
                  checked={selectedList.includes(currentIndex)}
                  selectedList={selectedList}
                  onSelect={onSelect}
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
