/* third lib*/
import React, { useState, useMemo, useRef } from 'react';
import styled from '@emotion/styled';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import { Tooltip } from '@mui/material';
import UploadIcon from '@assets/icons/moduleIcon/UploadIcon';
import { FormattedMessage as Intl } from 'react-intl';
import { useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import ExcelFile from 'src/assets/icons/ExcelFile';

// 从theme.js中导入全局变量
import { COLORS, SPACING } from '../../theme';

// 使用@emotion/styled创建样式组件
const FileUploadWraper = styled.div`
  cursor: pointer;
  width: 100%;
  border: 0;
  margin: 0;
  display: inline-flex;
  padding: 0;
  position: relative;
  min-width: 0;
  flex-direction: column;
  vertical-align: top;
  border: 1px dashed ${COLORS.textGrey};
  box-sizing: border-box;
  border-radius: ${SPACING.space4};
  height: 40px;

  input {
    opacity: 0;
    cursor: pointer;
    width: 100%;
    display: none;
    height: 100%;
    position: absolute;
  }
`;

const PlaceHolder = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .fileName {
    margin-left: ${SPACING.space20};
  }

  .icon {
    position: relative;
    margin-right: ${SPACING.space20};
    svg {
      width: 2rem;
      height: 2rem;
    }
  }
`;

const MenuItemStyled = styled(MenuItem)`
  display: flex;
  justify-content: space-between;
  width: 100%;

  svg {
    color: ${COLORS.textGrey};
  }
`;

const Poppup = styled.div`
  // 可以根据需要添加样�?
`;

const ListPaper = styled(Paper)`
  // 可以根据需要添加样�?
`;

const FileUpload = React.forwardRef(
  ({ id, name, multiple, onChange, placeholder, fileTemplate }, ref) => {
    const anchorRef = useRef(null);
    const inputRef = useRef(null);
    const [refWidth, setRefWidth] = useState(0);
    const [open, setOpen] = useState(false);
    const [fileList, setFileList] = useState([]);

    const handleClose = () => {
      setOpen(false);
    };
    const handleOpen = () => {
      if (fileList.length > 0) {
        setOpen(true);
      } else {
        inputRef.current.click();
      }
    };

    const handleDownload = (fileUrl, fileName) => {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const handleChange = list => {
      setFileList(list);
      onChange(
        list.map(item => {
          return item.file;
        })
      );
    };

    const popupOpen = useMemo(() => {
      return fileList.length > 0 ? open : false;
    }, [fileList, open]);

    useEffect(() => {
      if (open) {
        setRefWidth(anchorRef.current.offsetWidth);
      }
    }, [open]);

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <FileUploadWraper ref={anchorRef}>
          <PlaceHolder onClick={handleOpen}>
            <div className='fileName'>
              {fileList.length > 0 ? (
                `${fileList.length} files added`
              ) : placeholder ? (
                placeholder
              ) : (
                <Intl id='attachFile' />
              )}
            </div>
            <div className='icon'>
              <input
                ref={inputRef}
                multiple={multiple}
                id={id}
                name={name}
                type='file'
                onChange={e => {
                  let tmpFile = [
                    ...fileList,
                    {
                      label: e.target.files[0].name,
                      value: e.target.files[0].name,
                      file: e.target.files[0],
                    },
                  ];
                  handleChange(tmpFile);
                }}
                style={{ display: 'none' }}
                onClick={event => {
                  event.stopPropagation();
                }}
              />
              <UploadIcon
                onClick={event => {
                  event.stopPropagation();
                  event.preventDefault();
                  inputRef.current.click();
                }}
              />
            </div>
          </PlaceHolder>

          <Popper
            placement='bottom'
            id='simple-menu'
            anchorEl={anchorRef.current}
            open={popupOpen}
          >
            <Poppup style={{ width: refWidth + 'px' }}>
              <ListPaper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList value=''>
                    {fileList.map((option, index) => (
                      <MenuItemStyled key={index} value={option.value}>
                        {option.label}
                        <DeleteIcon
                          onClick={() => {
                            let tmpFile = [...fileList];
                            tmpFile.splice(index);
                            handleChange(tmpFile);
                          }}
                        />
                      </MenuItemStyled>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </ListPaper>
            </Poppup>
          </Popper>
        </FileUploadWraper>
        {fileTemplate && (
          <Tooltip
            title={<span style={{ fontSize: '12px' }}>Download Template </span>}
            arrow
          >
            <div
              onClick={() => {
                handleDownload(fileTemplate.fileUrl, fileTemplate.fileName);
              }}
            >
              <ExcelFile style={{ fontSize: '32px' }} />
            </div>
          </Tooltip>
        )}
      </div>
    );
  }
);

export default FileUpload;
