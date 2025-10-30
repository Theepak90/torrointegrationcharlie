import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Button from '@basics/Button';
import Text from '@basics/Text';
import styled from '@emotion/styled';
import FormLabel from '@mui/material/FormLabel';
import { THEME } from '@comp/theme';

const FieldTitle = styled(FormLabel)`
  display: inline-block;
  color: ${THEME.colors.mainPurple} !important;
`;

const Hierarchy = ({ departments, onChange }) => {
  const [treeData, setTreeData] = useState(departments || []);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [expanded, setExpanded] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [parentId, setParentId] = useState(null);

  // Sync with external departments prop
  useEffect(() => {
    if (departments) {
      setTreeData(departments);
    }
  }, [departments]);

  // Notify parent component when treeData changes
  useEffect(() => {
    if (onChange) {
      onChange(treeData);
    }
  }, [treeData, onChange]);

  // Recursively find node
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

  // Recursively update node
  const updateNode = useCallback((nodes, targetName, updateFn) => {
    return nodes.map(node => {
      if (node.name === targetName) {
        return updateFn(node);
      }
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: updateNode(node.children, targetName, updateFn),
        };
      }
      return node;
    });
  }, []);

  // Recursively delete node
  const deleteNode = useCallback((nodes, targetName) => {
    return nodes.filter(node => {
      if (node.name === targetName) {
        return false;
      }
      if (node.children && node.children.length > 0) {
        node.children = deleteNode(node.children, targetName);
      }
      return true;
    });
  }, []);

  // Add new item
  const handleAddItem = (parentName = null) => {
    setParentId(parentName);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
    });
    setDialogOpen(true);
  };

  // Edit item
  const handleEditItem = name => {
    const item = findNode(treeData, name);
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name || '',
        description: item.description || '',
      });
      setParentId(null);
      setDialogOpen(true);
    }
  };

  // Delete item
  const handleDeleteItem = name => {
    setTreeData(prev => deleteNode(prev, name));
    if (selectedDepartment === name) {
      setSelectedDepartment('');
    }
  };

  // Save item
  const handleSaveItem = () => {
    if (!formData.name.trim() || !formData.description.trim()) return;

    if (editingItem) {
      // Edit existing item
      setTreeData(prev =>
        updateNode(prev, editingItem.name, node => ({
          ...node,
          name: formData.name.trim(),
          description: formData.description.trim(),
        }))
      );
    } else {
      // Add new item
      const newItem = {
        name: formData.name.trim(),
        description: formData.description.trim(),
      };

      if (parentId) {
        setTreeData(prev =>
          updateNode(prev, parentId, node => ({
            ...node,
            children: [...(node.children || []), newItem],
          }))
        );
      } else {
        setTreeData(prev => [...prev, newItem]);
      }
    }

    setDialogOpen(false);
    setFormData({
      name: '',
      description: '',
    });
    setEditingItem(null);
    setParentId(null);
  };

  // Handle selection from tree (removed - tree is now for management only)

  // Handle expand/collapse
  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  // Render tree node
  const renderTreeItem = node => (
    <TreeItem
      key={node.name}
      itemId={node.name}
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 0.5,
            width: '100%',
          }}
        >
          <BusinessIcon sx={{ fontSize: 16, color: 'primary.main' }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant='body2' sx={{ fontWeight: 'medium' }}>
              {node.name}
            </Typography>
            {node.description && (
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ display: 'block' }}
              >
                {node.description}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              size='small'
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                handleAddItem(node.name);
              }}
              sx={{ p: 0.5 }}
              title='Add Sub-department'
            >
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton
              size='small'
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                handleEditItem(node.name);
              }}
              sx={{ p: 0.5 }}
              title='Edit Department'
            >
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton
              size='small'
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                handleDeleteItem(node.name);
              }}
              sx={{ p: 0.5, color: 'error.main' }}
              title='Delete Department'
            >
              <DeleteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
      }
    >
      {node.children && node.children.map(child => renderTreeItem(child))}
    </TreeItem>
  );

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <FieldTitle>
          <Text type='subTitle'>Department Hierarchy</Text>
        </FieldTitle>

        <Button
          type='button'
          filled
          size='small'
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            handleAddItem();
          }}
        >
          Add Root Department
        </Button>
      </Box>

      {treeData.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: 'grey.50',
            borderRadius: 2,
          }}
        >
          <BusinessIcon
            sx={{
              fontSize: 48,
              color: 'grey.400',
              mb: 2,
            }}
          />
          <Typography variant='h6' color='text.secondary' gutterBottom>
            No Departments Yet
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            Start building your department hierarchy by adding your first
            department.
          </Typography>
          <Button
            type='button'
            size='small'
            filled
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              handleAddItem();
            }}
          >
            Add First Department
          </Button>
        </Paper>
      ) : (
        <SimpleTreeView
          expandedItems={expanded}
          onExpandedItemsChange={handleToggle}
          sx={{
            flexGrow: 1,
            maxWidth: '100%',
            overflowY: 'auto',
            '& .MuiTreeItem-content': {
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            },
          }}
        >
          {treeData.map(node => renderTreeItem(node))}
        </SimpleTreeView>
      )}

      {/* <Paper sx={{ p: 2 }}>
        <Typography variant='h6' gutterBottom>
          Department Selection Result
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          Select a department from the dropdown below. Use this as your final
          selection.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <DepartmentSelect
            value={selectedDepartment}
            departments={treeData}
            onChange={setSelectedDepartment}
          />
        </Box>
        <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
          {selectedDepartment
            ? '1 department selected'
            : 'No department selected'}
        </Typography>
      </Paper> */}

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth='md'
        fullWidth
        disableEscapeKeyDown={false}
        onBackdropClick={() => setDialogOpen(false)}
        disableRestoreFocus={true}
        disableAutoFocus={true}
      >
        <DialogTitle>
          {editingItem ? 'Edit Department' : 'Add Department'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              autoFocus
              label='Department Name'
              fullWidth
              variant='outlined'
              required
              value={formData.name}
              onChange={e =>
                setFormData(prev => ({ ...prev, name: e.target.value }))
              }
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSaveItem();
                }
              }}
              error={!formData.name.trim()}
              helperText={
                !formData.name.trim() ? 'Department name is required' : ''
              }
            />
            <TextField
              label='Description'
              fullWidth
              variant='outlined'
              multiline
              rows={3}
              required
              value={formData.description}
              onChange={e =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              placeholder='Enter department description...'
              error={!formData.description.trim()}
              helperText={
                !formData.description.trim() ? 'Description is required' : ''
              }
            />
          </Box>
          {parentId && (
            <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
              Will be added as a sub-department of &ldquo;
              {findNode(treeData, parentId)?.name}&rdquo;
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            type='button'
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type='button'
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              handleSaveItem();
            }}
            filled
            disabled={!formData.name.trim() || !formData.description.trim()}
          >
            {editingItem ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Hierarchy;
