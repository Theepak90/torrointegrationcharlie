/* third lib*/
import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';

/* material-ui */
import InsertBtn from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';

/* local components & methods */
import Button from '@basics/Button';
import Model from '@basics/Modal';
import Loading from '@assets/icons/Loading';
import { THEME } from '../../../../../theme';

// Styled components
const ValueBox = styled.div`
  display: flex;
  align-items: center;

  svg {
    color: ${THEME.colors.mainPurple};
  }
`;

const EditBtn = styled.div`
  cursor: pointer;
`;

const ModelOperation = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: ${THEME.spacing.space20};

  svg {
    width: 2rem;
    height: 2rem;
  }

  .clear {
    margin-right: ${THEME.spacing.space8};
  }
  .finish {
    color: ${THEME.colors.mainPurple};
  }
  .buttonContent {
    display: flex;
    align-items: center;
  }
`;

const UeditorContainer = styled.div`
  width: 30rem;
  border: 1px solid #d4d4d4;
  box-sizing: border-box;
  margin-top: ${THEME.spacing.space16};

  div[class*='edui-editor-toolbarbox edui-default'] {
    display: none;
  }
  div[id*='edui1'] {
    border: none;
    border-radius: 0;
  }
`;

const Operation = styled.div`
  width: 100%;
  border-bottom: 1px solid #d4d4d4;
`;

const DisplayBox = styled.div`
  display: flex;
`;

const DisplayValue = styled.div`
  border-bottom: 1px solid ${THEME.colors.textGrey};
  min-width: 4rem;
`;

const LoadingContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1099;
  background-color: ${THEME.colors.white};
`;

const SimpleMenu = ({ options, insert }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <InsertBtn
        aria-controls='simple-menu'
        aria-haspopup='true'
        onClick={handleClick}
      >
        <span style={{ color: THEME.colors.mainPurple }}> Insert option</span>
      </InsertBtn>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((item, index) => {
          return (
            <MenuItem
              key={index}
              onClick={() => {
                insert(index, item);
                handleClose();
              }}
            >
              {item.label}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

const Ueditor = ({ value, options, onChange, handleClose }) => {
  const [content, setContent] = useState('');
  const [ue, setUe] = useState(null);
  const [initicialValue, setIniticialValue] = useState('');
  const [loading, setLoading] = useState(true);
  /* eslint-disable */
  const [id, setId] = useState('container' + Math.floor(Math.random() * 10000));
   

  const deCodeValue = () => {
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    if (!tempDiv.childNodes.length) {
      return '';
    }
    let tmp = '';
    tempDiv.childNodes.forEach(elem => {
      for (let i = 0; i < elem.childNodes.length; i++) {
        let value = elem.childNodes[i];
        if (
          (value.id && value.id.indexOf('s') !== -1) ||
          (value.id && value.id.indexOf('u') !== -1) ||
          (value.id && value.id.indexOf('d') !== -1)
        ) {
          tmp += `$\{${value.id}}`;
        } else {
          tmp +=
            value instanceof HTMLElement
              ? value.innerText
              : value.textContent || value;
        }
      }
      if (tempDiv.childNodes.length > 1) tmp += '\n';
    });
    return tmp;
  };
  useEffect(() => {
    let UE = window.UE;

    if (!UE) {
      let script = document.createElement('script');
      script.setAttribute('src', '/ueditor/ueditor.config.js');
      document.getElementsByTagName('head')[0].appendChild(script);
      script = document.createElement('script');
      script.setAttribute('src', '/ueditor/ueditor.all.min.js');
      document.getElementsByTagName('head')[0].appendChild(script);

      script.onload = () => {
        UE = window.UE;

        var ue = UE.getEditor(id, {
          UEDITOR_HOME_URL: '/ueditor/',
          serverUrl: '/ueditor',
          initialFrameHeight: 150,
          toolbars: [[]],
          lang: 'en',
          maximumWords: 100,
          elementPathEnabled: false,
        });

        ue.addListener('contentChange', () => {
          setContent(ue.getContent());
          window.a = ue.getContent();
        });

        ue.ready(function() {
          setLoading(false);
        });

        setUe(ue);
      };
    } else {
      UE = window.UE;

      setTimeout(() => {
        var ue = UE.getEditor(id, {
          UEDITOR_HOME_URL: '/ueditor/',
          serverUrl: '/ueditor',
          initialFrameHeight: 150,
          toolbars: [[]],
          lang: 'en',
          maximumWords: 100,
          elementPathEnabled: false,
        });

        ue.addListener('contentChange', () => {
          setContent(ue.getContent());
          window.a = ue.getContent();
        });

        ue.ready(function() {
          setLoading(false);
        });

        setUe(ue);
      }, 0);
    }
  }, [id]);

  useEffect(() => {
    var initialContent = value.replace(/\$\{u(\d+)\}/g, (...args) => {
      for (var i = 0; i < options.length; i++) {
        var tmpVariable = options[i];
        var tmpProp = tmpVariable.value;
        if (`$\{${tmpProp}}` === args[0]) {
          return `<span id='${tmpVariable.value}' style='color: #fff;background: #8fa0f5;border-radius: 4px;padding: 2px;-webkit-user-modify:read-only;-moz-user-modify:read-only;user-modify:read-only;'>${tmpVariable.label}</span>`;
        }
      }
    });
    initialContent = initialContent.replace(/\$\{s(\d+)\}/g, (...args) => {
      for (var i = 0; i < options.length; i++) {
        var tmpVariable = options[i];
        var tmpProp = tmpVariable.value;
        if (`$\{${tmpProp}}` === args[0]) {
          return `<span id='${tmpVariable.value}' style='color: #fff;background: #8fa0f5;border-radius: 4px;padding: 2px;-webkit-user-modify:read-only;-moz-user-modify:read-only;user-modify:read-only;'>${tmpVariable.label}</span>`;
        }
      }
    });

    initialContent = initialContent.replace(/\$\{d(\d+)\}/g, (...args) => {
      for (var i = 0; i < options.length; i++) {
        var tmpVariable = options[i];
        var tmpProp = tmpVariable.value;
        if (`$\{${tmpProp}}` === args[0]) {
          return `<span id='${tmpVariable.value}' style='color: #fff;background: #8fa0f5;border-radius: 4px;padding: 2px;-webkit-user-modify:read-only;-moz-user-modify:read-only;user-modify:read-only;'>${tmpVariable.label}</span>`;
        }
      }
    });

    initialContent = initialContent.replaceAll('\n', '<br />');

    setIniticialValue(initialContent);
  }, [value, options]);

  return (
    <Model open={true}>
      {loading && (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      )}

      <UeditorContainer>
        <Operation>
          <SimpleMenu
            options={options}
            insert={(index, data) => {
              ue.execCommand(
                'inserthtml',
                `<span id='${data.value}' style='color: #fff;background: #8fa0f5;border-radius: 4px;padding: 2px;-webkit-user-modify:read-only;-moz-user-modify:read-only;user-modify:read-only;'>${data.label}</span>`
              );
            }}
          />
        </Operation>
        <textarea
          id={id}
          name='blog'
          type='text/plain'
          onChange={() => {}}
          value={initicialValue}
        ></textarea>
      </UeditorContainer>
      <ModelOperation>
        <div className='clear'>
          <Button
            onClick={() => {
              handleClose && handleClose();
            }}
            size='small'
          >
            <Intl id='cancel' />
          </Button>
        </div>
        <div className='finish'>
          <Button
            onClick={() => {
              onChange(deCodeValue());
              handleClose();
            }}
            size='small'
            filled
          >
            <Intl id='done' />
          </Button>
        </div>
      </ModelOperation>
    </Model>
  );
};
const Default = ({ value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const displayValue = useMemo(() => {
    var initialContent = value.replace(/\${u(\d+)}/g, (...args) => {
      for (var i = 0; i < options.length; i++) {
        var tmpVariable = options[i];
        var tmpProp = tmpVariable.value;
        if (`$\{${tmpProp}}` === args[0]) {
          return `<span id='${tmpVariable.value}' style='color: #fff;background: #8fa0f5;border-radius: 4px;padding: 2px;-webkit-user-modify:read-only;-moz-user-modify:read-only;user-modify:read-only;'>${tmpVariable.label}</span>`;
        }
      }
    });
    initialContent = initialContent.replace(/\${s(\d+)}/g, (...args) => {
      for (var i = 0; i < options.length; i++) {
        var tmpVariable = options[i];
        var tmpProp = tmpVariable.value;
        if (`$\{${tmpProp}}` === args[0]) {
          return `<span id='${tmpVariable.value}' style='color: #fff;background: #8fa0f5;border-radius: 4px;padding: 2px;-webkit-user-modify:read-only;-moz-user-modify:read-only;user-modify:read-only;'>${tmpVariable.label}</span>`;
        }
      }
    });
    initialContent = initialContent.replace(/\${d(\d+)}/g, (...args) => {
      for (var i = 0; i < options.length; i++) {
        var tmpVariable = options[i];
        var tmpProp = tmpVariable.value;
        if (`$\{${tmpProp}}` === args[0]) {
          return `<span id='${tmpVariable.value}' style='color: #fff;background: #8fa0f5;border-radius: 4px;padding: 2px;-webkit-user-modify:read-only;-moz-user-modify:read-only;user-modify:read-only;'>${tmpVariable.label}</span>`;
        }
      }
    });
    return initialContent;
  }, [value, options]);

  return (
    <>
      <ValueBox>
        <DisplayBox>
          <DisplayValue>
            <div dangerouslySetInnerHTML={{ __html: displayValue }}></div>
          </DisplayValue>

          <EditBtn>
            <EditIcon
              onClick={() => {
                setOpen(true);
              }}
            />
          </EditBtn>
        </DisplayBox>
      </ValueBox>
      {open && (
        <Ueditor
          value={value}
          options={options}
          onChange={onChange}
          handleClose={() => {
            setOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Default;
