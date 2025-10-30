import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { getAssetsList } from '@lib/api';
import Button from '@basics/Button';
import SelectC from '@basics/Select';

const AssetsTab = () => {
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    assetType: '',
    dataSource: '',
  });
  const [viewMode] = useState('table');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [detailsTab, setDetailsTab] = useState(0);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // Filter assets function - defined before useEffect (only for type and source filters)
  const filterAssets = useCallback(() => {
    let filtered = [...assets];

    // Apply type filter
    if (filters.assetType) {
      filtered = filtered.filter(asset => asset.type === filters.assetType);
    }

    // Apply source filter
    if (filters.dataSource) {
      filtered = filtered.filter(asset => asset.source === filters.dataSource);
    }

    setFilteredAssets(filtered);
  }, [assets, filters]);

  // Load assets on component mount
  useEffect(() => {
    loadAssets();
  }, []);

  // Filter assets when filters change (not search query)
  useEffect(() => {
    filterAssets();
  }, [filterAssets]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const response = await getAssetsList();
      console.log('Assets API response:', response);

      // Handle the API response structure
      let assetsData = [];
      if (response.assets_list) {
        // Use the flat list from API response
        assetsData = response.assets_list;
      } else if (response.assets) {
        // Convert grouped assets to flat array
        Object.keys(response.assets).forEach(source => {
          if (Array.isArray(response.assets[source])) {
            response.assets[source].forEach(asset => {
              asset.source = asset.source || source;
              asset.id = asset.id || asset.name;
              assetsData.push(asset);
            });
          }
        });
      }

      setAssets(assetsData);
      console.log('Processed assets data:', assetsData);

      // Debug: Log size values for each asset
      assetsData.forEach((asset, index) => {
        console.log(`Asset ${index}:`, {
          name: asset.name,
          size: asset.size,
          sizeType: typeof asset.size,
          sizeValue: asset.size,
        });
      });
    } catch (error) {
      console.error('Failed to load assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = asset => {
    setSelectedAsset(asset);
    setDetailsDialogOpen(true);
    setDetailsTab(0);
  };

  // Generate search suggestions based on current query
  const generateSearchSuggestions = useCallback(
    query => {
      if (!query || query.length < 1) {
        setSearchSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const suggestions = [];
      const lowerQuery = query.toLowerCase();

      // Add asset names that match
      assets.forEach(asset => {
        if (asset.name.toLowerCase().includes(lowerQuery)) {
          suggestions.push({
            type: 'asset',
            text: asset.name,
            description: `${asset.type} from ${asset.source}`,
            value: asset.name,
          });
        }
      });

      // Add unique asset types that match
      const uniqueTypes = [...new Set(assets.map(asset => asset.type))];
      uniqueTypes.forEach(type => {
        if (type.toLowerCase().includes(lowerQuery)) {
          suggestions.push({
            type: 'type',
            text: type,
            description: 'Asset type',
            value: type,
          });
        }
      });

      // Add unique sources that match
      const uniqueSources = [...new Set(assets.map(asset => asset.source))];
      uniqueSources.forEach(source => {
        if (source.toLowerCase().includes(lowerQuery)) {
          suggestions.push({
            type: 'source',
            text: source,
            description: 'Data source',
            value: source,
          });
        }
      });

      // Limit to 8 suggestions
      const limitedSuggestions = suggestions.slice(0, 8);
      setSearchSuggestions(limitedSuggestions);
      setShowSuggestions(limitedSuggestions.length > 0);
    },
    [assets]
  );

  // Handle search input change
  const handleSearchChange = e => {
    const value = e.target.value;
    setSearchQuery(value);
    generateSearchSuggestions(value);
    setSelectedSuggestionIndex(-1);
    // Don't auto-search, wait for user to click search button or press Enter
  };

  // Handle suggestion selection
  const handleSuggestionSelect = suggestion => {
    setSearchQuery(suggestion.value);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // Handle keyboard navigation
  const handleSearchKeyDown = e => {
    if (!showSuggestions || searchSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev =>
          Math.min(prev + 1, searchSuggestions.length - 1)
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionSelect(searchSuggestions[selectedSuggestionIndex]);
        } else {
          performSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchSuggestions([]);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    // Show all assets when search is cleared
    setFilteredAssets(assets);
  };

  // Perform search (called by search button)
  const performSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredAssets(assets);
      return;
    }

    const term = searchQuery.toLowerCase();
    const filtered = assets.filter(asset => {
      const nameMatch = asset.name.toLowerCase().includes(term);
      const typeMatch = asset.type.toLowerCase().includes(term);
      const sourceMatch = asset.source.toLowerCase().includes(term);
      const schemaMatch = asset.schema?.fields?.some(field => {
        const fieldName = typeof field === 'string' ? field : field.name;
        return fieldName.toLowerCase().includes(term);
      });

      return nameMatch || typeMatch || sourceMatch || schemaMatch;
    });

    setFilteredAssets(filtered);
    setShowSuggestions(false);
  };

  const formatFileSize = bytes => {
    console.log('formatFileSize called with:', bytes, 'type:', typeof bytes);

    // Handle the case where bytes is a string "Unknown" or similar
    if (typeof bytes === 'string' && bytes.toLowerCase() === 'unknown') {
      console.log('Returning Unknown for string unknown');
      return 'Unknown';
    }

    // Convert to number and handle null/undefined
    const numBytes = Number(bytes);
    console.log('Converted to number:', numBytes);

    // When size is 0, return "Unknown" instead of "0 Bytes"
    if (numBytes === 0) {
      console.log('Returning Unknown for zero value');
      return 'Unknown';
    }

    // Handle NaN case (when bytes is not a valid number)
    if (isNaN(numBytes)) {
      console.log('Returning Unknown for NaN');
      return 'Unknown';
    }

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(numBytes) / Math.log(k));
    const result =
      parseFloat((numBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    console.log('Returning formatted size:', result);
    return result;
  };

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const getAssetIcon = type => {
    switch (type) {
      case 'bigquery_table':
        return (
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '4px',
              backgroundColor: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            📊
          </Box>
        );
      case 'bigquery_dataset':
        return (
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '4px',
              backgroundColor: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            📦
          </Box>
        );
      default:
        return (
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '4px',
              backgroundColor: '#666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            📄
          </Box>
        );
    }
  };

  const getUniqueAssetTypes = () => {
    const types = [...new Set(assets.map(asset => asset.type))];
    return types.sort();
  };

  const getUniqueDataSources = () => {
    const sources = [...new Set(assets.map(asset => asset.source))];
    return sources.sort();
  };

  const renderAssetDetails = () => {
    if (!selectedAsset) return null;

    return (
      <Box>
        <Tabs
          value={detailsTab}
          onChange={(e, newValue) => setDetailsTab(newValue)}
        >
          <Tab label='Overview' />
          <Tab label='Schema' />
          <Tab label='Data Profile' />
          <Tab label='AI Analysis' />
          <Tab label='PII Scan' />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {detailsTab === 0 && (
            <Box>
              <Grid container spacing={2}>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <Typography variant='subtitle2' color='text.secondary'>
                    Name
                  </Typography>
                  <Typography variant='body1'>{selectedAsset.name}</Typography>
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <Typography variant='subtitle2' color='text.secondary'>
                    Type
                  </Typography>
                  <Typography variant='body1'>{selectedAsset.type}</Typography>
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <Typography variant='subtitle2' color='text.secondary'>
                    Source
                  </Typography>
                  <Typography variant='body1'>
                    {selectedAsset.source}
                  </Typography>
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <Typography variant='subtitle2' color='text.secondary'>
                    Size
                  </Typography>
                  <Typography variant='body1'>
                    {formatFileSize(selectedAsset.size)}
                  </Typography>
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <Typography variant='subtitle2' color='text.secondary'>
                    Created
                  </Typography>
                  <Typography variant='body1'>
                    {formatDate(selectedAsset.created_date)}
                  </Typography>
                </Grid>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <Typography variant='subtitle2' color='text.secondary'>
                    Last Updated
                  </Typography>
                  <Typography variant='body1'>
                    {formatDate(selectedAsset.modified_date)}
                  </Typography>
                </Grid>
                <Grid item size={12}>
                  <Typography variant='subtitle2' color='text.secondary'>
                    Location
                  </Typography>
                  <Typography variant='body1' sx={{ wordBreak: 'break-all' }}>
                    {selectedAsset.location}
                  </Typography>
                </Grid>
                <Grid item size={12}>
                  <Typography variant='subtitle2' color='text.secondary'>
                    Tags
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}
                  >
                    {selectedAsset.tags?.map((tag, index) => (
                      <Chip key={index} label={tag} size='small' />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {detailsTab === 1 && (
            <Box>
              {selectedAsset.schema?.fields ? (
                <Box>
                  <Typography variant='h6' gutterBottom>
                    Schema Fields
                  </Typography>
                  <TableContainer component={Paper} variant='outlined'>
                    <Table size='small'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Field Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Mode</TableCell>
                          <TableCell>Description</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedAsset.schema.fields.map((field, index) => (
                          <TableRow key={index}>
                            <TableCell>{field.name}</TableCell>
                            <TableCell>{field.type}</TableCell>
                            <TableCell>{field.mode}</TableCell>
                            <TableCell>{field.description || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant='subtitle2' color='text.secondary'>
                      Statistics
                    </Typography>
                    <Typography variant='body2'>
                      Rows:{' '}
                      {selectedAsset.schema.num_rows?.toLocaleString() || 'N/A'}{' '}
                      | Size:{' '}
                      {formatFileSize(selectedAsset.schema.num_bytes || 0)}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography color='text.secondary'>
                  No schema information available
                </Typography>
              )}
            </Box>
          )}

          {detailsTab === 2 && (
            <Box>
              <Typography color='text.secondary'>
                Data profile analysis not available
              </Typography>
            </Box>
          )}

          {detailsTab === 3 && (
            <Box>
              <Typography color='text.secondary'>
                AI analysis not available
              </Typography>
            </Box>
          )}

          {detailsTab === 4 && (
            <Box>
              <Typography color='text.secondary'>
                PII scan results not available
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant='h6'>
          Discovered Assets ({filteredAssets.length})
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          {/* First row: Search and Refresh */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Box sx={{ position: 'relative', flex: 1, maxWidth: '600px' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  placeholder='Search assets by name, type, or source...'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => {
                    if (searchSuggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding to allow clicking on suggestions
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  size='large'
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      height: '48px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#000',
                      },
                      '&:hover fieldset': {
                        borderColor: '#000',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#000',
                      },
                    },
                  }}
                />
                <Button
                  text
                  onClick={performSearch}
                  sx={{
                    height: '48px',
                    minWidth: '48px',
                    borderRadius: '8px',
                    color: '#000',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <SearchIcon />
                </Button>
                <Button
                  text
                  onClick={clearSearch}
                  title='Clear search'
                  sx={{
                    height: '48px',
                    minWidth: '48px',
                    borderRadius: '8px',
                    color: '#000',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <Box sx={{ fontSize: '16px' }}>×</Box>
                </Button>
              </Box>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderTop: 'none',
                    borderRadius: '0 0 8px 8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    zIndex: 1050,
                    maxHeight: '300px',
                    overflowY: 'auto',
                  }}
                >
                  <Box
                    sx={{
                      padding: '8px 12px',
                      backgroundColor: '#f8f9fa',
                      borderBottom: '1px solid #e0e0e0',
                    }}
                  >
                    <Typography variant='caption' color='text.secondary'>
                      Search Suggestions
                    </Typography>
                  </Box>
                  {searchSuggestions.map((suggestion, index) => (
                    <Box
                      key={`${suggestion.type}-${index}`}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      sx={{
                        padding: '12px',
                        cursor: 'pointer',
                        backgroundColor:
                          index === selectedSuggestionIndex
                            ? '#f0f0f0'
                            : 'transparent',
                        borderBottom:
                          index < searchSuggestions.length - 1
                            ? '1px solid #f0f0f0'
                            : 'none',
                        '&:hover': {
                          backgroundColor: '#f0f0f0',
                        },
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor:
                              suggestion.type === 'asset'
                                ? '#1976d2'
                                : suggestion.type === 'type'
                                ? '#388e3c'
                                : '#ff9800',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        >
                          {suggestion.type === 'asset'
                            ? 'A'
                            : suggestion.type === 'type'
                            ? 'T'
                            : 'S'}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant='body2' sx={{ fontWeight: 500 }}>
                            {suggestion.text}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {suggestion.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <Button
              filled
              onClick={loadAssets}
              disabled={loading}
              size='small'
              sx={{ ml: 2 }}
            >
              <RefreshIcon sx={{ mr: 1 }} />
              Refresh Assets
            </Button>
          </Box>

          {/* Second row: Filters and Apply */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ minWidth: '400px' }}>
              <SelectC
                value={filters.assetType}
                onChange={value =>
                  setFilters(prev => ({ ...prev, assetType: value }))
                }
                options={[
                  { value: '', label: 'All Types' },
                  ...getUniqueAssetTypes().map(type => ({
                    value: type,
                    label: type,
                  })),
                ]}
              />
            </Box>

            <Box sx={{ minWidth: '400px' }}>
              <SelectC
                value={filters.dataSource}
                onChange={value =>
                  setFilters(prev => ({
                    ...prev,
                    dataSource: value,
                  }))
                }
                options={[
                  { value: '', label: 'All Sources' },
                  ...getUniqueDataSources().map(source => ({
                    value: source,
                    label: source,
                  })),
                ]}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Assets Display */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredAssets.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography color='text.secondary'>
              {assets.length === 0
                ? 'No assets discovered yet'
                : 'No assets found matching your criteria'}
            </Typography>
          </CardContent>
        </Card>
      ) : viewMode === 'table' ? (
        <TableContainer
          component={Paper}
          sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px', py: 2 }}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px', py: 2 }}>
                  Type
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px', py: 2 }}>
                  Source
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px', py: 2 }}>
                  Size
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px', py: 2 }}>
                  Created
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px', py: 2 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAssets.map((asset, index) => (
                <TableRow
                  key={asset.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa',
                    '&:hover': { backgroundColor: '#f0f0f0' },
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                    >
                      {getAssetIcon(asset.type)}
                      <Box>
                        <Typography
                          variant='body1'
                          sx={{
                            wordBreak: 'break-all',
                            fontSize: '15px',
                            fontWeight: 500,
                            lineHeight: 1.4,
                          }}
                        >
                          {asset.name}
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{
                            color: 'text.secondary',
                            fontSize: '13px',
                            mt: 0.5,
                          }}
                        >
                          {asset.location || ''}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={asset.type}
                      size='small'
                      sx={{
                        backgroundColor: '#6c757d',
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '13px',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={asset.source}
                      size='small'
                      sx={{
                        backgroundColor: '#0dcaf0',
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '13px',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2, fontSize: '15px' }}>
                    {formatFileSize(asset.size)}
                  </TableCell>
                  <TableCell sx={{ py: 2, fontSize: '15px' }}>
                    {formatDate(asset.created_date)}
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Tooltip title='View Details'>
                      <IconButton
                        size='small'
                        onClick={() => handleViewDetails(asset)}
                        sx={{
                          backgroundColor: '#f5f5f5',
                          '&:hover': {
                            backgroundColor: '#e0e0e0',
                          },
                        }}
                      >
                        <ViewIcon sx={{ fontSize: '18px' }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={2}>
          {filteredAssets.map(asset => (
            <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={asset.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    {getAssetIcon(asset.type)}
                    <Typography variant='h6' noWrap>
                      {asset.name.split('.').pop()}
                    </Typography>
                  </Box>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mb: 1 }}
                  >
                    {asset.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip label={asset.type} size='small' />
                    <Chip
                      label={asset.source}
                      size='small'
                      variant='outlined'
                    />
                  </Box>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mb: 2 }}
                  >
                    Size: {formatFileSize(asset.size)} | Created:{' '}
                    {formatDate(asset.created_date)}
                  </Typography>
                  <Button
                    variant='outlined'
                    size='small'
                    startIcon={<ViewIcon />}
                    onClick={() => handleViewDetails(asset)}
                    fullWidth
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Asset Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {selectedAsset && getAssetIcon(selectedAsset.type)}
            <Typography variant='h6'>{selectedAsset?.name}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>{renderAssetDetails()}</DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssetsTab;
