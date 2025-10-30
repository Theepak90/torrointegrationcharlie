import React, { useState, useCallback, useMemo } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import cn from 'classnames';
import styled from '@emotion/styled';

/* MUI */
import Input from '@mui/material/Input';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

/* local component */
import { THEME } from '../theme';

// Styled components
const PolicyTagGroup = styled.div`
  div[class*='MuiBox-root'] {
    margin: 0;
  }
  border-left: 1px solid ${THEME.colors.mainPurple};
`;

const TagItemContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 0;
`;

const EditInput = styled(Input)`
  input {
    border: 1px solid ${THEME.colors.textGrey};
    padding: 0.5rem 1rem;
    height: 1.5rem;
    border-radius: 4px;

    &:focus,
    &:active {
      border-color: ${THEME.colors.mainPurple};
    }
  }
  margin-right: ${THEME.spacing.space24};
`;

const AddTagButton = styled.div`
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
  margin-right: ${THEME.spacing.space20};
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${THEME.colors.mainPurple};
    opacity: 0.8;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SubTag = styled.div`
  margin-left: ${THEME.spacing.space32};
  border-left: 1px solid ${THEME.colors.mainPurple};
`;

const TagBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${THEME.spacing.space24};
`;

const TagItemBox = styled.div`
  /* 对应 PolicyTagsBeforeUpgrade 中的 tagItemBox 类，无特殊样式 */
`;

const HorizontalSep = styled.div`
  width: 1.25rem;
  height: 1px;
  background-color: ${THEME.colors.mainPurple};

  &.lastLevel {
    width: 3rem;
  }
`;

const AddTagSep = styled.div`
  width: 3rem;
  height: 1px;
  background-color: ${THEME.colors.mainPurple};
`;

const SubTagList = ({ subTagList, level, onChange, displayView }) => {
  const handleChange = useCallback(
    (data, seq) => {
      let tmpList = JSON.parse(JSON.stringify(subTagList));
      tmpList[seq] = data;
      onChange(tmpList);
    },
    [subTagList, onChange]
  );

  const handleAddTag = useCallback(() => {
    let tmpList = JSON.parse(JSON.stringify(subTagList));
    tmpList.push({ display_name: '', description: '', ad_group: '' });
    onChange(tmpList);
  }, [subTagList, onChange]);

  const handleDelete = useCallback(
    seq => {
      let tmpList = JSON.parse(JSON.stringify(subTagList));
      tmpList.splice(seq, 1);
      onChange(tmpList);
    },
    [subTagList, onChange]
  );

  return (
    <SubTag>
      {subTagList.map((item, seq) => {
        return (
          <TagItem
            key={`level${level}-${seq}`}
            data={item}
            level={level + 1}
            onChange={data => {
              handleChange(data, seq);
            }}
            onDelete={() => {
              handleDelete(seq);
            }}
            displayView={displayView}
          />
        );
      })}
      {!displayView && (
        <TagBox>
          <AddTagSep></AddTagSep>
          <AddTagButton onClick={handleAddTag}>
            <Intl id='addPolicyTag' />
          </AddTagButton>
        </TagBox>
      )}
    </SubTag>
  );
};

const TagItem = ({
  data,
  level,
  onChange,
  onDelete,
  disbaleDelete = false,
  displayView,
}) => {
  const [open, setOpen] = useState(displayView || false);

  const handleSubChange = useCallback(
    list => {
      let levelData = JSON.parse(JSON.stringify(data));
      levelData.sub_tags = list;
      onChange && onChange(levelData);
    },
    [data, onChange]
  );

  const handleSubAdd = () => {
    let levelData = JSON.parse(JSON.stringify(data));
    if (levelData.sub_tags) {
      levelData.sub_tags.push({
        display_name: '',
        description: '',
        ad_group: '',
      });
    } else {
      levelData.sub_tags = [
        { display_name: '', description: '', ad_group: '' },
      ];
    }
    onChange(levelData);
    setOpen(true);
  };

  return (
    <TagItemBox>
      <TagBox>
        <HorizontalSep
          className={cn({
            lastLevel: level === 5,
          })}
        ></HorizontalSep>
        {level < 5 && (
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        )}
        <TagItemContainer>
          <EditInput
            value={data.display_name}
            disableUnderline
            variant='outlined'
            placeholder='Tag name'
            onChange={e => {
              onChange({
                ...data,
                display_name: e.target.value,
              });
            }}
            readOnly={displayView}
          />
          <EditInput
            value={data.description}
            disableUnderline
            variant='outlined'
            placeholder='Description'
            onChange={e => {
              onChange({
                ...data,
                description: e.target.value,
              });
            }}
            readOnly={displayView}
          />
          <EditInput
            value={data.ad_group}
            disableUnderline
            variant='outlined'
            placeholder='Policy group'
            onChange={e => {
              onChange({
                ...data,
                ad_group: e.target.value,
              });
            }}
            readOnly={displayView}
          />

          {!displayView && (
            <>
              {level < 5 && (
                <AddTagButton
                  onClick={e => {
                    handleSubAdd();
                  }}
                >
                  <Intl id='addSubTag' />
                </AddTagButton>
              )}
              {!disbaleDelete && (
                <AddTagButton onClick={onDelete}>
                  <Intl id='deleteTag' />
                </AddTagButton>
              )}
            </>
          )}
        </TagItemContainer>
      </TagBox>
      {data.sub_tags && level < 5 && (
        <Collapse in={open} timeout='auto' unmountOnExit>
          <Box margin={1}>
            <SubTagList
              subTagList={data.sub_tags}
              level={level}
              onChange={list => {
                handleSubChange(list);
              }}
              displayView={displayView}
            />
          </Box>
        </Collapse>
      )}
    </TagItemBox>
  );
};
const PolicyTags = ({ value, onChange, displayView }) => {
  const policTags = useMemo(() => {
    return value
      ? value
      : [
          {
            display_name: '',
            description: '',
            ad_group: '',
          },
        ];
  }, [value]);

  const handleChange = useCallback(
    (data, index) => {
      let tmp = JSON.parse(JSON.stringify(policTags));
      tmp[index] = data;
      onChange(tmp);
    },
    [policTags, onChange]
  );

  const handleDelete = useCallback(
    seq => {
      let tmp = JSON.parse(JSON.stringify(policTags));
      tmp.splice(seq, 1);
      onChange(tmp);
    },
    [policTags, onChange]
  );
  return (
    <PolicyTagGroup>
      {policTags &&
        policTags.map((tag, seq) => {
          return (
            <TagItem
              key={`level1-${seq}`}
              index={seq}
              data={tag}
              level={1}
              onChange={data => {
                handleChange(data, seq);
              }}
              disbaleDelete={policTags.length === 1}
              onDelete={() => {
                handleDelete(seq);
              }}
              displayView={displayView}
            />
          );
        })}
    </PolicyTagGroup>
  );
};

export default PolicyTags;
