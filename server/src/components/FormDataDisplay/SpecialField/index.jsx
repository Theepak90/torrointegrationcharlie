/* third lib*/
import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';

/* material-ui */
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';

/* local components & methods */
import FormItem from '@comp/FormItem';
import PolicyTags from '@comp/PolicyTags';
import TableTagDisplay from '@comp/TableTag';
import OnboardDataDisplay from '@comp/OnboardDataDisplay';
import Model from '@basics/Modal';
import UsecaseInfo from '@comp/UsecaseInfo';
import { getUseCaseList, getTableSchema } from '@lib/api';
import { sendNotify } from 'src/utils/systerm-error';
import Loading from '@assets/icons/Loading';
import { COLORS, SPACING } from '@comp/theme';

const Form = ({ formId, data }) => {
  const { control, register } = useForm(); // initialise the hook
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
          fullWidth={![101, 102, 103].includes(formId)}
        />
      );
    });
  };
  return (
    <>
      <div
        style={{
          zIndex: 998,
          backgroundColor: 'transparent',
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      ></div>
      <form
        id={`currentForm${formId}`}
        style={{ position: 'relative', width: '90rem' }}
      >
        <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
          {renderFormItem(data)}
        </div>
      </form>
    </>
  );
};

const TableTagsAutoGen = ({ data, specialProp }) => {
  const [tableTag, setTableTag] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getTableSchema({
      projectId: specialProp.project_id,
      datasetName: specialProp.dataset_id,
      tableName: specialProp.table_id,
    })
      .then(res => {
        if (res.data) {
          setTableTag(res.data.tags);
          setLoading(false);
        }
      })
      .catch(e => {
        sendNotify({ msg: e.message, status: 3, show: true });
      });
  }, [specialProp]);

  if (!tableTag || loading) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          top: 0,
          right: 0,
          position: 'absolute',
        }}
      >
        <Loading />
      </div>
    );
  }
  return (
    <div>
      {tableTag.map((tag, index) => {
        return <TableTagDisplay key={index} tagData={tag} />;
      })}
    </div>
  );
};

const PolicyTree = ({ formId, data }) => {
  return <PolicyTags value={data} onChange={data => {}} displayView />;
};

const TableTags = ({ data }) => {
  return (
    <div>
      {data.map((tag, index) => {
        return <TableTagDisplay key={index} tagData={tag} />;
      })}
    </div>
  );
};

const TableDisplay = ({ data }) => {
  return <OnboardDataDisplay tableList={data} />;
};

const UseCase = ({ data }) => {
  const [useCaseId, setUsecaseId] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getUseCaseList()
      .then(res => {
        if (res.data) {
          res.data.forEach(item => {
            if (item.usecase_name === data) {
              setUsecaseId(item.id);
            }
          });
          setLoading(false);
        }
      })
      .catch(e => {
        sendNotify({ msg: e.message, status: 3, show: true });
        setLoading(false);
      });
  }, [data]);

  if (!useCaseId && !loading) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Intl id='ucNotFound' />
      </div>
    );
  }
  return (
    <>
      {loading && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            top: 0,
            right: 0,
            position: 'absolute',
          }}
        >
          <Loading />
        </div>
      )}
      {!loading && (
        <UsecaseInfo
          tableList={data}
          usecaseId={useCaseId}
          detailDisplay={true}
        />
      )}
    </>
  );
};

const ViewIcon = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    svg {
      color: ${COLORS.mainPurple};
    }
  }
`;

const SpecialField = ({ formId, data, special, specialProp }) => {
  const [open, setOpen] = useState(false);

  const FieldDisplay = useMemo(() => {
    switch (special?.comp) {
      case 'UseCase':
        return UseCase;
      case 'Form':
        return Form;
      case 'PolicyTree':
        return PolicyTree;
      case 'TableTags':
        return TableTags;
      case 'TableTagsAutoGen':
        return TableTagsAutoGen;
      case 'TableDisplay':
        return TableDisplay;

      default:
        break;
    }
  }, [special]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {special.showValue && (
        <div
          style={{
            marginRight: SPACING.space8,
            color: COLORS.mainPurple,
            textDecoration: 'underline',
          }}
        >
          {data}
        </div>
      )}
      <ViewIcon>
        <RemoveRedEye
          onClick={() => {
            setOpen(true);
          }}
        />
      </ViewIcon>

      <Model
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
      >
        <div style={{ marginTop: SPACING.space20 }}>
          <FieldDisplay formId={formId} data={data} specialProp={specialProp} />
        </div>
      </Model>
    </div>
  );
};

export default SpecialField;
