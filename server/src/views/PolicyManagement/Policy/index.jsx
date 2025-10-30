/* third lib*/
import React, { useEffect, useState } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import { useForm } from 'react-hook-form';
import Scrollbar from 'react-perfect-scrollbar';
import styled from '@emotion/styled';

/* material-ui */
import FormLabel from '@mui/material/FormLabel';

/* local components & methods */
import HeadLine from '@basics/HeadLine';
import FormItem from '@comp/FormItem';
import Button from '@basics/Button';
import Text from '@basics/Text';
import { SPACING, COLORS, FONT_SIZES, FONT_WEIGHTS } from '@comp/theme';
import { getPolicyForm, getPolicys } from '@lib/api';
import Loading from '@assets/icons/Loading';
import { sendNotify } from 'src/utils/systerm-error';
import PolicyTags from '@comp/PolicyTags';

// Styled components
const PolicyContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const FormView = styled.div`
  width: 100%;
  flex: 1;
`;

const FormControl = styled.div`
  background-color: ${COLORS.white};
  min-height: 100%;
  width: 100%;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  color: ${COLORS.mainPurple};

  .formTitle {
    font-weight: ${FONT_WEIGHTS.bold};
    font-size: ${FONT_SIZES.fontSize1};
    color: ${COLORS.darkPurple};
  }

  .formDes {
    color: ${COLORS.color12};
    font-size: ${FONT_SIZES.fontSize3};
  }
`;

const Form = styled.form`
  margin-top: 3rem;
  flex: 1;
  position: relative;
`;

const FormOptions = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  .formItem {
    width: 100%;
    min-width: calc(33.3% - 2rem);
    margin: ${SPACING.space16};
    flex: 1;
  }
`;

const FormItemLine = styled.div`
  margin-bottom: ${SPACING.space40};
  padding: ${SPACING.space16};
`;

const FormItemTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${SPACING.space16};
`;

const FieldTitle = styled(FormLabel)`
  display: inline-block;
  color: ${COLORS.mainPurple} !important;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;

  button:nth-child(1) {
    margin-right: ${SPACING.space20};
  }
`;

const Policy = ({ currentId, onBack }) => {
  const { control, register } = useForm(); // initialise the hook
  const [formData, setFormData] = useState(null);
  const [formLoading, setFormLoading] = useState(true);

  const [policTags, setPolicTags] = useState([]);

  const renderFormItem = (items, disabled) => {
    return items.map((item, index) => {
      return (
        <FormItem
          key={index}
          data={item}
          index={index}
          control={control}
          register={register}
          disabled={disabled}
        />
      );
    });
  };

  useEffect(() => {
    getPolicyForm()
      .then(res => {
        if (res.data) {
          let policyForm = res.data;

          getPolicys()
            .then(res => {
              let policyTagData = res.data.filter(
                item => item.id === currentId
              )[0];

              let tmp = JSON.parse(JSON.stringify(policyForm));
              let tmpFieldList = tmp.fieldList.map(item => {
                if (item.id && policyTagData[item.id]) {
                  item.default = policyTagData[item.id];
                }
                return item;
              });

              setPolicTags(policyTagData.policy_tags_list);
              setFormData({
                ...tmp,
                fieldList: tmpFieldList,
                title: 'Policy Tag',
              });
              setFormLoading(false);
            })
            .catch(e => {
              sendNotify({ msg: e.message, status: 3, show: true });
            });
        }
      })
      .catch(e => {
        sendNotify({ msg: e.message, status: 3, show: true });
      });
  }, [currentId]);

  return (
    <PolicyContainer>
      <FormView>
        <Scrollbar>
          {formLoading && <Loading />}
          {!formLoading && formData && (
            <FormControl>
              <HeadLine>{formData.title}</HeadLine>
              <Form
                id={`currentForm${formData.id}`}
                // onSubmit={handleSubmit(submitHandle)}
              >
                <FormOptions>{renderFormItem(formData.fieldList)}</FormOptions>
                <FormItemLine>
                  <FormItemTitle>
                    <FieldTitle>
                      <Text type='subTitle'>
                        <Intl id='policyTagStru' />
                      </Text>
                    </FieldTitle>
                  </FormItemTitle>
                  <PolicyTags
                    value={policTags}
                    onChange={data => {
                      setPolicTags(data);
                    }}
                    displayView={true}
                  />
                </FormItemLine>
                <ButtonWrapper>
                  <Button
                    onClick={() => {
                      onBack();
                    }}
                    variant='contained'
                  >
                    <Intl id='back' />
                  </Button>
                </ButtonWrapper>
              </Form>
            </FormControl>
          )}
        </Scrollbar>
      </FormView>
    </PolicyContainer>
  );
};

export default Policy;
