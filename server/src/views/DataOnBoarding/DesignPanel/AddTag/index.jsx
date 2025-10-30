/* third lib*/
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import cn from 'classnames';
import { useForm } from 'react-hook-form';
import { FormattedMessage as Intl } from 'react-intl';

/* material-ui */
import Delete from '@mui/icons-material/Close';

/* local components & methods */
import Select from '@basics/Select';
import { getFormItem } from '@lib/api';
import { sendNotify } from 'src/utils/systerm-error';
import Text from '@basics/Text';
import Button from '@basics/Button';
import FormItem from '@comp/FormItem';
import styled from '@emotion/styled';
import { SPACING, COLORS } from '@comp/theme';

const DesignerTitle = styled.div({
  marginTop: '1.125rem',
  marginBottom: SPACING.space20,
  color: COLORS.textGrey,
});

const ButtonWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
});

const SelectTagTemplate = styled.div({
  marginBottom: SPACING.space40,
});

const TagList = styled.div({
  marginBottom: SPACING.space20,
});

const TagDisplay = styled.div({
  padding: SPACING.space8,
  background: 'gainsboro',
  borderRadius: SPACING.space8,
  display: 'inline-block',
  margin: SPACING.space4,
  minWidth: SPACING.space16,
  minHeight: SPACING.space12,
  position: 'relative',
  cursor: 'pointer',
  '&.alert': {
    backgroundColor: COLORS.mainRed,
    color: COLORS.white,
  },
  '& .delete': {
    position: 'absolute',
    top: `-${SPACING.space12}`,
    right: `-${SPACING.space12}`,
    cursor: 'pointer',
    display: 'none',
    '& svg': {
      width: SPACING.space20,
      height: SPACING.space20,
    },
  },
  '&:hover .delete': {
    display: 'block',
  },
});

const PolicyName = styled.span({
  display: 'inline-block',
  fontWeight: 'bold',
  color: 'black',
  marginRight: SPACING.space8,
});

const AddTag = ({ handleApply, tagTemplateList, type, checkedTagList }) => {
  const [formData, setFormData] = useState();
  const { handleSubmit, control, register, reset } = useForm(); // initialise the hook
  const [tagList, setTagList] = useState(
    checkedTagList?.length > 0 ? checkedTagList : []
  );
  const [selectedTemplate, setSeletedTemplate] = useState('');
  const [currentTag, setCurrentTag] = useState({
    tag_template_form_id: '',
    data: {},
    seq: null,
  });

  const renderFormItem = (items, disabled) => {
    return items.map((item, index) => {
      return (
        <FormItem
          key={index + 'default' + item.default}
          data={item}
          index={index}
          control={control}
          register={register}
          disabled={disabled}
          fullWidth
        />
      );
    });
  };

  const templateOption = useMemo(() => {
    let exist = tagList.map(item => {
      return item.tag_template_form_id;
    });
    let tmp = tagTemplateList.map(item => {
      return {
        label: item.display_name,
        value: item.tag_template_form_id,
      };
    });

    return tmp.filter(item => {
      return !exist.includes(item.value);
    });
  }, [tagTemplateList, tagList]);

  const templateNameMap = useMemo(() => {
    let map = {};
    tagTemplateList.forEach(item => {
      map[item.tag_template_form_id] = item.display_name;
    });

    return map;
  }, [tagTemplateList]);

  const TagTitle = useMemo(() => {
    if (type === 1) {
      return checkedTagList?.length > 0 ? (
        <Intl id='modifyTableTag' />
      ) : (
        <Intl id='addTableTag' />
      );
    } else {
      return checkedTagList?.length > 0 ? (
        <Intl id='modifyColumnTag' />
      ) : (
        <Intl id='addColumnTag' />
      );
    }
  }, [type, checkedTagList]);

  const submitHandle = useCallback(
    data => {
      let tmpList = [...tagList];
      if (currentTag.seq !== null) {
        let tmpTag = tmpList[currentTag.seq];
        tmpList[currentTag.seq] = {
          ...tmpTag,
          tag_template_form_id: currentTag.tag_template_form_id,
          data: data,
        };
      } else {
        tmpList.push({
          tag_template_form_id: currentTag.tag_template_form_id,
          data: data,
        });
      }
      setCurrentTag({
        tag_template_form_id: '',
        data: {},
        seq: null,
      });
      setSeletedTemplate('');
      setTagList(tmpList);
    },
    [tagList, currentTag]
  );

  const handleDeleteTag = useCallback(
    index => {
      let tmp = [...tagList];
      tmp.splice(index, 1);
      setTagList(tmp);
    },
    [tagList]
  );

  const applyHandle = useCallback(() => {
    const applyType = type === 1 ? 'TABLETAG' : 'COLUMNTAGS';
    let avaliable = true;
    if (type === 1) {
      tagList.forEach(item => {
        if (!item.data) {
          sendNotify({
            msg: 'Please fill in the required tag',
            status: 3,
            show: true,
          });
          avaliable = false;
        }
      });
    }
    if (avaliable) {
      handleApply(tagList, applyType);
    }
  }, [tagList, handleApply, type]);

  const tagClickHandle = useCallback(tag => {
    setSeletedTemplate('');
    setCurrentTag(tag);
  }, []);

  useEffect(() => {
    if (currentTag.tag_template_form_id) {
      getFormItem({ id: currentTag.tag_template_form_id })
        .then(res => {
          if (res.data) {
            reset({});
            let tmpFieldList = res.data.fieldList;

            if (currentTag.data) {
              tmpFieldList = tmpFieldList.map(item => {
                return {
                  ...item,
                  default: currentTag.data[item.id] || item.default,
                };
              });
            }

            res.data.fieldList = tmpFieldList;
            setFormData(res.data);
          }
        })
        .catch(e => {
          sendNotify({ msg: e.message, status: 3, show: true });
        });
    } else {
      reset();
      setFormData(null);
    }
  }, [currentTag, reset]);

  return (
    <div>
      <DesignerTitle>
        <Text type='title'>{TagTitle}</Text>
      </DesignerTitle>
      <SelectTagTemplate>
        <Select
          value={selectedTemplate}
          options={templateOption}
          onChange={value => {
            setSeletedTemplate(value);
            setCurrentTag({
              tag_template_form_id: value,
              data: {},
              seq: null,
            });
          }}
        />
      </SelectTagTemplate>
      {formData && (
        <form
          id={`currentForm${formData.id}`}
          onSubmit={handleSubmit(submitHandle)}
        >
          <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
            {renderFormItem(formData.fieldList)}
          </div>

          <ButtonWrapper>
            <Button size='small' type='submit' variant='contained'>
              {currentTag.seq !== null ? (
                <Intl id='update' />
              ) : (
                <Intl id='add' />
              )}
            </Button>
          </ButtonWrapper>
        </form>
      )}

      <TagList>
        <DesignerTitle>
          <Text type='title'>Tags ({tagList.length})</Text>
        </DesignerTitle>

        {tagList.map((tag, index) => {
          return (
            <TagDisplay
              onClick={() => {
                tagClickHandle({
                  ...tag,
                  seq: index,
                });
              }}
              key={index}
              className={cn({
                alert: tag?.required && tag.data === null,
              })}
            >
              {!tag.required && (
                <span className='delete'>
                  <Delete
                    onClick={e => {
                      handleDeleteTag(index);
                      e.stopPropagation();
                    }}
                  />
                </span>
              )}
              <PolicyName>
                {templateNameMap[tag.tag_template_form_id]}
              </PolicyName>
            </TagDisplay>
          );
        })}
      </TagList>
      <ButtonWrapper>
        <Button onClick={applyHandle}>
          <Intl id='apply' />
        </Button>
      </ButtonWrapper>
    </div>
  );
};

export default AddTag;
