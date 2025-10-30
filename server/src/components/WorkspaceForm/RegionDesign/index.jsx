import React, { useState } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';

/* material-ui */
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

/* local component */
import TextBox from '@basics/TextBox';
import { THEME } from '@comp/theme';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from '@basics/Table';

// Styled Components
const CountryTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${THEME.colors.mainPurple};
  margin-bottom: ${THEME.spacing.space12};
`;

const AddCountryBtn = styled.div`
  display: inline-block;
  text-align: center;
  padding: 0.5rem;
  min-width: unset;
  height: auto;
  line-height: 1;
  border-width: 1px;
  background-color: ${THEME.colors.mainPurple};
  color: ${THEME.colors.white};
  border-radius: 4px;
  cursor: pointer;
`;

const Icon = styled.div`
  color: ${THEME.colors.textGrey};
  cursor: pointer;
  display: inline-block;
`;

const CountryTable = styled.div`
  margin-bottom: ${THEME.spacing.space20};
`;

const Operation = styled.div`
  /* Simple styles, using inline styles */
`;

const Region = ({ row, onChange, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell width='10%'>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell width='25%' component='th' scope='row' align='left'>
          <TextBox
            value={row.region}
            onChange={value => {
              onChange({
                ...row,
                region: value,
              });
            }}
          />
        </TableCell>
        <TableCell width='25%' align='left'>
          <TextBox
            value={row.group}
            onChange={value => {
              onChange({
                ...row,
                group: value,
              });
            }}
          />
        </TableCell>
        <TableCell width='25%' align='left'>
          <TextBox
            value={row.workflow}
            onChange={value => {
              onChange({
                ...row,
                workflow: value,
              });
            }}
          />
        </TableCell>
        <TableCell width='15%' align='center'>
          <Operation>
            <Icon
              onClick={() => {
                onDelete();
              }}
            >
              <RemoveCircleOutlineIcon />
            </Icon>
          </Operation>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box margin={1}>
              <CountryTitle>
                <Intl id='countryList' />
                <AddCountryBtn
                  onClick={() => {
                    let tmp = { ...row };
                    tmp.countryList.push({
                      country: '',
                      group: '',
                      workflow: '',
                    });
                    onChange(tmp);
                  }}
                >
                  <Intl id='addCountry' />
                </AddCountryBtn>
              </CountryTitle>
              {row.countryList.length > 0 && (
                <CountryTable>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell width='10%'>
                          <Intl id='region' />
                        </TableCell>
                        <TableCell width='25%' align='center'>
                          <Intl id='country' />
                        </TableCell>
                        <TableCell width='25%' align='center'>
                          <Intl id='group' />
                        </TableCell>
                        <TableCell width='25%' align='center'>
                          <Intl id='workflow' />
                        </TableCell>
                        <TableCell width='15%' align='center'>
                          <Intl id='workflowOperation' />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.countryList.map((historyRow, index) => (
                        <TableRow key={index}>
                          <TableCell width='10%'>{row.region}</TableCell>
                          <TableCell width='25%' align='center'>
                            <TextBox
                              value={historyRow.country}
                              onChange={value => {
                                let tmpCoun = [...row.countryList];
                                tmpCoun[index].country = value;
                                onChange({
                                  ...row,
                                  countryList: tmpCoun,
                                });
                              }}
                            />
                          </TableCell>
                          <TableCell width='25%' align='center'>
                            <TextBox
                              value={historyRow.group}
                              onChange={value => {
                                let tmpCoun = [...row.countryList];
                                tmpCoun[index].group = value;
                                onChange({
                                  ...row,
                                  countryList: tmpCoun,
                                });
                              }}
                            />
                          </TableCell>
                          <TableCell width='25%' align='center'>
                            <TextBox
                              value={historyRow.workflow}
                              onChange={value => {
                                let tmpCoun = [...row.countryList];
                                tmpCoun[index].workflow = value;
                                onChange({
                                  ...row,
                                  countryList: tmpCoun,
                                });
                              }}
                            />
                          </TableCell>
                          <TableCell width='15%' align='center'>
                            <Operation>
                              <Icon
                                onClick={() => {
                                  let tmp = { ...row };
                                  tmp.countryList.splice(index, 1);
                                  onChange(tmp);
                                }}
                              >
                                <RemoveCircleOutlineIcon />
                              </Icon>
                            </Operation>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CountryTable>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const RegionDesign = ({ regions, onChange }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            <TableCell width='10%' />
            <TableCell width='25%' align='left'>
              <Intl id='region' />
            </TableCell>
            <TableCell width='25%' align='left'>
              <Intl id='wsAdgroup' />
            </TableCell>
            <TableCell width='25%' align='left'>
              <Intl id='workflowV' />
            </TableCell>
            <TableCell width='15%' align='center'>
              <Intl id='operation' />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {regions.map((row, index) => (
            <Region
              key={index}
              row={row}
              onChange={data => {
                let tmp = [...regions];
                tmp[index] = data;
                onChange(tmp);
              }}
              onDelete={() => {
                let tmp = [...regions];
                tmp.splice(index, 1);
                onChange(tmp);
              }}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RegionDesign;
