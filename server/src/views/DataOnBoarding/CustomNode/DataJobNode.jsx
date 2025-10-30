import React, { useState } from 'react';
import { Handle } from '@xyflow/react';
import { Tooltip, Typography } from '@mui/material';

const DataJobNode = ({ data, id, position, selected, dragging, className }) => {
  return (
    <div
      id={id}
      className={className}
      style={{
        border: '1px solid #ccc',
        zIndex: 99,
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'white',
      }}
    >
      <Handle type='target' position='left' id='target' />
      <Tooltip
        title={<Typography style={{ fontSize: 14 }}>{data.label}</Typography>}
        arrow
        style={{ fontSize: 20 }}
        placement='top'
      >
        <div
          style={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            alt={data.label}
            width={18}
            height={18}
            src='/static/images/airflowlogo.png'
          />
        </div>
      </Tooltip>
      <Handle
        type='source'
        position='right'
        id='source'
        style={{ background: '#228be6' }}
      />
    </div>
  );
};

export default DataJobNode;
