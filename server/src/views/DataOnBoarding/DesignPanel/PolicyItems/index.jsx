import React, { useState, useMemo } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import cn from 'classnames';

/* material-ui */
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Paper from '@mui/material/Paper';
import Text from '@basics/Text';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from '@basics/Table';

/* local component */
import styled from '@emotion/styled';
import { SPACING, COLORS, FONT_WEIGHTS } from '@comp/theme';

const PolicyTagGroup = styled.div({
  marginBottom: SPACING.space28,
  '& div[class*="MuiBox-root"]': {
    margin: 0,
  },
});

const SubTag = styled.div({
  '& .policyDetail': {
    marginLeft: '2rem',
    '&.level3': {
      marginLeft: '4rem',
    },
    '&.level4': {
      marginLeft: '6rem',
    },
    '&.level5': {
      marginLeft: '8rem',
    },
  },
});

const TagBox = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const PolicyDetail = styled.div({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
});

const ExpanderIcon = styled.div({
  width: '1.5rem',
  height: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const TagItemContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 0,
  '&.selected': {
    color: COLORS.darkPurple,
    fontWeight: FONT_WEIGHTS.bold,
  },
});

const PolicyName = styled.div({
  display: 'flex',
});

const SubTagList = ({ subTagList, onCheck, checkedList, level }) => {
  return (
    <SubTag>
      {subTagList.map((item, seq) => {
        return (
          <TagItem
            key={seq}
            data={item}
            checkedList={checkedList}
            onCheck={onCheck}
            level={level}
          />
        );
      })}
    </SubTag>
  );
};

const TagItem = ({ data, onCheck, checkedList, level }) => {
  const [open, setOpen] = useState(false);

  const isSelected = useMemo(() => {
    return checkedList.includes(data.id);
  }, [checkedList, data]);

  return (
    <div>
      <TagBox>
        <Checkbox
          color='primary'
          checked={isSelected}
          onChange={() => {
            onCheck(data.id);
          }}
        />
        <PolicyDetail className={cn('policyDetail', 'level' + level)}>
          <ExpanderIcon>
            {data.sub_tags && data.sub_tags.length > 0 && (
              <IconButton
                aria-label='expand row'
                size='small'
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </ExpanderIcon>
          <TagItemContainer className={cn({ selected: isSelected })}>
            {data.display_name}
          </TagItemContainer>
        </PolicyDetail>
      </TagBox>
      {data.sub_tags && data.sub_tags.length > 0 && (
        <Collapse in={open} timeout='auto' unmountOnExit>
          <Box margin={1}>
            <SubTagList
              subTagList={data.sub_tags}
              onCheck={onCheck}
              checkedList={checkedList}
              level={level + 1}
            />
          </Box>
        </Collapse>
      )}
    </div>
  );
};

const PolicyItems = ({ item, onCheck, checkedList }) => {
  const [open, setOpen] = useState(false);

  const lenCalc = useMemo(() => {
    let count = 0;

    const mapTags = item => {
      if (item.policy_tags_list && item.policy_tags_list.length > 0) {
        count += item.policy_tags_list.length;
        item.policy_tags_list.forEach(subTag => {
          mapTags(subTag);
        });
      } else if (item.sub_tags.length && item.sub_tags.length > 0) {
        count += item.sub_tags.length;
        item.sub_tags.forEach(subTag => {
          mapTags(subTag);
        });
      }
    };

    if (item.policy_tags_list && item.policy_tags_list.length > 0) {
      mapTags(item);
    }
    return count;
  }, [item]);

  return (
    <>
      <TableRow>
        <TableCell align='left'>
          <PolicyName>
            <ExpanderIcon>
              <IconButton
                aria-label='expand row'
                size='small'
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </ExpanderIcon>
            {item.taxonomy_display_name}
          </PolicyName>
        </TableCell>
        <TableCell align='center'>{item.description}</TableCell>
        <TableCell align='center'>
          {item.policy_tags_list ? lenCalc : 0}
        </TableCell>
        <TableCell align='center'>{item.region}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box margin={0}>
              {item.policy_tags_list &&
                item.policy_tags_list.map((tag, seq) => {
                  return (
                    <TagItem
                      key={`level1-${seq}`}
                      index={seq}
                      data={tag}
                      onCheck={onCheck}
                      checkedList={checkedList}
                      level={1}
                    />
                  );
                })}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const PolicyItemsGroup = ({ data, onCheck, checkedList }) => {
  return (
    <PolicyTagGroup>
      <TableContainer component={Paper}>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell align='left' width='35%'>
                <Text type='subTitle'>
                  <Intl id='name' />
                </Text>
              </TableCell>
              <TableCell align='center' width='25%'>
                <Text type='subTitle'>
                  <Intl id='description' />
                </Text>
              </TableCell>
              <TableCell align='center' width='20%'>
                <Text type='subTitle'>
                  <Intl id='policyTags' />
                </Text>
              </TableCell>
              <TableCell align='center' width='20%'>
                <Text type='subTitle'>
                  <Intl id='location' />
                </Text>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => {
              return (
                <PolicyItems
                  key={index}
                  item={item}
                  onCheck={onCheck}
                  checkedList={checkedList}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </PolicyTagGroup>
  );
};

export default PolicyItemsGroup;
