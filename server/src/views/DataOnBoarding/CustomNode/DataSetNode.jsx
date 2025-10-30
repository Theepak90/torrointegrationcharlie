import React, { useMemo, useState } from 'react';
import { Handle } from '@xyflow/react';
import { MdOutlineDataset } from 'react-icons/md';
import {
  Tooltip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Typography,
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { MdOutlineFormatColorText } from 'react-icons/md';

const DataSetNode = ({ data, id, position, selected, dragging, className }) => {
  const { parameter } = data;
  const columns = Object.keys(parameter.columns).map(key => {
    const columData = parameter.columns[key];
    return {
      type: columData.type,
      fieldPath: columData.name,
    };
  });
  const themeColor = '#10b981';
  const [isExpanded, setIsExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const indexOfLastColumn = page * rowsPerPage;
  const indexOfFirstColumn = indexOfLastColumn - rowsPerPage;
  const currentColumns = columns.slice(indexOfFirstColumn, indexOfLastColumn);

  const labelStrArr = data.label.split('.');
  const tableName = labelStrArr[2];
  const tableAssets = labelStrArr[1];

  const platformlogo = useMemo(() => {
    switch (parameter.platform) {
      case 'bigquery':
        return 'bigquerylogo.png';
      case 'hive':
        return 'hivelogo.png';
      default:
        return 'bigquerylogo.png';
    }
  }, [parameter.platform]);

  return (
    <div
      key={id}
      id={id}
      className={className}
      style={{
        border: '1px solid #ccc',
        borderLeft: `3px solid ${themeColor}`,
        zIndex: 99,
        borderRadius: 4,
        background: 'white',
      }}
    >
      <div style={{ position: 'relative', padding: 8 }}>
        <Handle type='target' position='left' id='target' />
        <div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                padding: '6px 12px 6px 6px',
                borderRight: '1px solid #f1f1f1',
              }}
            >
              <img
                alt='Under development'
                width={20}
                height={20}
                src={`/static/images/${platformlogo}`}
              />
              <Tooltip
                title={
                  <Typography style={{ fontSize: 14 }}>Data Set</Typography>
                }
                arrow
              >
                <MdOutlineDataset style={{ cursor: 'default' }} size={20} />
              </Tooltip>
            </div>
            <div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 240,
                }}
              >
                <Typography
                  variant='h6'
                  component='h6'
                  style={{ color: 'grey', fontSize: 12 }}
                >
                  {tableAssets}
                </Typography>
                <Typography variant='h6' component='h6'>
                  {tableName}
                </Typography>
              </div>

              <div style={{ marginTop: 12 }}>
                <Button
                  variant='outlined'
                  color='primary'
                  style={{ padding: '4px', width: '100%', height: '24px' }}
                  onClick={() => {
                    setIsExpanded(!isExpanded);
                  }}
                >
                  {columns.length} columns
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Handle
          type='source'
          position='right'
          id='source'
          style={{ background: '#228be6' }}
        />
      </div>
      <div
        style={{
          padding: '0 8px',
          maxHeight: isExpanded ? '300px' : '0',
          overflow: 'auto',
          transition: 'max-height 0.3s ease-in-out',
        }}
      >
        {isExpanded && (
          <div style={{ padding: '8px' }}>
            <List>
              {currentColumns.map((column, index) => (
                <ListItem key={index} style={{ padding: 0 }}>
                  <ListItemIcon style={{ minWidth: 32 }}>
                    <Tooltip
                      title={
                        <Typography style={{ fontSize: 14 }}>
                          {column.type}
                        </Typography>
                      }
                      arrow
                      placement='left'
                    >
                      <Avatar
                        style={{
                          width: 20,
                          height: 20,
                          fontSize: 14,
                          cursor: 'default',
                          background: '#c1c1c1',
                        }}
                      >
                        {column.type.charAt(0).toUpperCase()}
                      </Avatar>
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText>
                    <span style={{ fontSize: 16 }}>{column.fieldPath}</span>
                  </ListItemText>
                </ListItem>
              ))}
            </List>
            <Pagination
              size='small'
              count={Math.ceil(columns.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              variant='outlined'
              shape='rounded'
              style={{
                margin: '10px auto',
                display: 'flex',
                justifyContent: 'center',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSetNode;
