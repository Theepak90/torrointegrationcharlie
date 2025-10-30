/* third lib */
import React, { useCallback } from 'react';
import styled from '@emotion/styled';

/* MUI */
import { Box, MenuItem, Select, Typography } from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';

// 从theme.js中导入全局变量
import { SPACING } from '../../theme';

// 使用@emotion/styled创建样式组件
const StyledMenuItem = styled(MenuItem)`
  padding: ${SPACING.space8} ${SPACING.space16} !important;
`;

const DepartmentSelect = ({
  value,
  departments = [],
  onChange,
  disabled,
  error,
  maxHeight = 300,
  className,
  inputProps,
  disableFullwidth,
}) => {
  // Recursively find node by name
  const findNode = useCallback((nodes, targetName) => {
    for (const node of nodes) {
      if (node.name === targetName) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = findNode(node.children, targetName);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // Get all available departments for Select component with hierarchy
  const getAllDepartments = useCallback(() => {
    const departmentList = [];
    const traverse = (nodes, level = 0) => {
      // 确保 nodes 是数组
      if (!Array.isArray(nodes)) {
        return;
      }
      nodes.forEach(node => {
        departmentList.push({
          name: node.name,
          description: node.description || '',
          level: level,
          hasChildren: node.children && node.children.length > 0,
        });
        if (node.children && node.children.length > 0) {
          traverse(node.children, level + 1);
        }
      });
    };
    traverse(departments);
    return departmentList;
  }, [departments]);

  const allDepartments = getAllDepartments();

  // Find selected department for display
  const selectedDepartment = allDepartments.find(dept => dept.name === value);

  return (
    <Select
      value={value || ''}
      onChange={e => {
        onChange(e.target.value);
      }}
      className={className}
      error={error}
      variant='filled'
      inputProps={inputProps}
      disableUnderline
      disabled={disabled}
      displayEmpty
      fullWidth={!disableFullwidth}
      renderValue={selected => {
        if (!selected) return <em>None</em>;
        return selectedDepartment ? selectedDepartment.name : selected;
      }}
      MenuProps={{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
        getContentAnchorEl: null,
        MenuListProps: {
          style: { maxHeight: maxHeight },
        },
      }}
    >
      <MenuItem value='' disabled>
        <em>None</em>
      </MenuItem>
      {allDepartments.map(department => (
        <StyledMenuItem key={department.name} value={department.name}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              pl: department.level * 2,
              width: '100%',
            }}
          >
            <BusinessIcon
              sx={{
                fontSize: 16,
                color:
                  department.level === 0 ? 'primary.main' : 'text.secondary',
              }}
            />

            <Typography
              variant='body2'
              sx={{
                fontWeight: department.level === 0 ? 'bold' : 'normal',
                fontSize: department.level === 0 ? '1rem' : '0.875rem',
                color:
                  department.level === 0 ? 'text.primary' : 'text.secondary',
              }}
            >
              {department.name}
            </Typography>
          </Box>
        </StyledMenuItem>
      ))}
    </Select>
  );
};

export default DepartmentSelect;
