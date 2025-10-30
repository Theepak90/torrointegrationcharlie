/* third lib*/
import React, { useEffect, useState } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';

/* MUI */
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

/* local components & methods */
import Text from '@basics/Text';
import Model from '@basics/Modal';
import Button from '@basics/Button';
import Select from '@basics/Select';
import TextBox from '@basics/TextBox';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from '@basics/Table';
import { THEME } from '../../../../../theme';

// Styled components
const EditBtn = styled.div`
  cursor: pointer;
`;

const ValueBox = styled.div`
  display: flex;
  align-items: center;
`;

const AddRow = styled.div`
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
`;

const ModelOperation = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: ${THEME.spacing.space20};

  svg {
    width: 2rem;
    height: 2rem;
  }

  .clear {
    margin-right: ${THEME.spacing.space8};
  }
  .finish {
    color: ${THEME.colors.mainPurple};
  }
  .buttonContent {
    display: flex;
    align-items: center;
  }
`;

const TableWrapper = styled.div`
  width: 42rem;
  border: 1px solid #d4d4d4;
  box-sizing: border-box;
  margin-top: ${THEME.spacing.space16};

  div[class*='edui-editor-toolbarbox edui-default'] {
    display: none;
  }
  div[id*='edui1'] {
    border: none;
    border-radius: 0;
  }

  .delete {
    color: ${THEME.colors.textGrey};
    cursor: pointer;
  }
`;

const SchemaHolder = styled.div`
  padding: 4px;
  background: ${THEME.colors.mainPurple};
  border-radius: 4px;
  color: ${THEME.colors.white};
  display: flex;
  cursor: pointer;

  .schemaLabel {
    margin-right: ${THEME.spacing.space8};
  }
  svg {
    color: ${THEME.colors.white};
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const typeList = [
  {
    label: 'STRING',
    value: 'STRING',
  },
  {
    label: 'BYTES',
    value: 'BYTES',
  },
  {
    label: 'INTEGER',
    value: 'INTEGER',
  },
  {
    label: 'FLOAT',
    value: 'FLOAT',
  },
  {
    label: 'NUMERIC',
    value: 'NUMERIC',
  },
  {
    label: 'BIGNUMERIC',
    value: 'BIGNUMERIC',
  },
  {
    label: 'BYTES',
    value: 'BYTES',
  },
];

const modeList = [
  {
    label: 'NULLABLE',
    value: 'NULLABLE',
  },
  {
    label: 'REQUIRED',
    value: 'REQUIRED',
  },
  {
    label: 'REPEATED',
    value: 'REPEATED',
  },
];

const DataTable = ({ value, onChange, handleClose }) => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (value && JSON.parse(value)) {
      setRows(JSON.parse(value));
    } else {
      setRows([]);
    }
  }, [value]);
  return (
    <Model open={true}>
      <AddRow
        onClick={() => {
          setRows([...rows, { name: '', type: 'Integer', mode: false }]);
        }}
      >
        <Text type='large'>Add new row</Text>
      </AddRow>
      <TableWrapper>
        <TableContainer>
          <Table aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell align='center'>
                  <Intl id='name' />
                </TableCell>
                <TableCell align='center'>
                  <Intl id='type' />
                </TableCell>
                <TableCell align='center'>
                  <Intl id='mode' />
                </TableCell>
                <TableCell align='center'>
                  <Intl id='operation' />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length < 1 && (
                <TableRow>
                  <TableCell align='center'>
                    <Intl id='plsAddSchema' />
                  </TableCell>
                </TableRow>
              )}
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align='center'>
                    <TextBox
                      value={row.name}
                      onChange={value => {
                        let tmp = [...rows];
                        tmp[index].name = value;
                        setRows(tmp);
                      }}
                    />
                  </TableCell>
                  <TableCell align='center'>
                    <Select
                      value={row.type}
                      options={typeList}
                      onChange={value => {
                        let tmp = [...rows];
                        tmp[index].type = value;
                        setRows(tmp);
                      }}
                    />
                  </TableCell>
                  <TableCell align='center'>
                    <Select
                      value={row.mode}
                      options={modeList}
                      onChange={value => {
                        let tmp = [...rows];
                        tmp[index].mode = value;
                        setRows(tmp);
                      }}
                    />
                  </TableCell>
                  <TableCell align='center'>
                    <div className='delete'>
                      <DeleteIcon
                        onClick={() => {
                          let tmp = [...rows];
                          tmp.splice(index, 1);
                          setRows(tmp);
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TableWrapper>
      <ModelOperation>
        <div className='clear'>
          <Button
            onClick={() => {
              handleClose && handleClose();
            }}
            size='small'
          >
            cancel
          </Button>
        </div>
        <div className='finish'>
          <Button
            onClick={() => {
              handleClose();
              onChange(JSON.stringify(rows));
            }}
            size='small'
            filled
          >
            Done
          </Button>
        </div>
      </ModelOperation>
    </Model>
  );
};
const Schema = ({ value, options, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ValueBox>
        <SchemaHolder
          onClick={() => {
            setOpen(true);
          }}
        >
          <div className='schemaLabel'>Schema</div>
          <EditBtn>
            <EditIcon />
          </EditBtn>
        </SchemaHolder>
      </ValueBox>
      {open && (
        <DataTable
          value={value}
          options={options}
          onChange={onChange}
          handleClose={() => {
            setOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Schema;
