/* third lib*/
import React, { useState, useCallback, useMemo } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';

/* material-ui */
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Delete from '@mui/icons-material/Delete';

/* local components & methods */
import { postComment, deleteComment } from '@lib/api';
import Text from '@basics/Text';
import TextBox from '@basics/TextBox';
import CallModal from '@basics/CallModal';
import { useGlobalContext } from 'src/context';
import Button from '@basics/Button';

// Import theme variables
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../theme';

// Create styled components - keep components with pseudo-classes or complex styles
const CommnetTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${SPACING.space12};
  color: ${COLORS.darkPurple};
  font-size: ${FONT_SIZES.fontSize3};
  font-weight: ${FONT_WEIGHTS.medium};
  position: relative;

  &:hover {
    .deleteIcon {
      display: block;
    }
  }
`;

const AccountDetail = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: ${SPACING.space40};
    height: ${SPACING.space40};
    margin-right: ${SPACING.space12};
  }
`;

const DeleteIcon = styled.div`
  display: none;
  cursor: pointer;
  margin-left: ${SPACING.space12};
  width: 16px;
  height: 16px;

  svg {
    width: 16px;
    height: 16px;
    color: ${COLORS.textGrey};
  }
`;

const Commentator = styled.div`
  display: flex;
  align-items: center;
`;

const CommentSection = ({
  recordId,
  commentList,
  statusHistory,
  handleChange,
}) => {
  const { authContext } = useGlobalContext();

  const [comment, setComment] = useState('');
  const [modalData, setModalData] = useState({
    open: false,
    status: 0,
    content: '',
  });
  const [deleteId, setDeleteId] = useState(null);

  const currentList = useMemo(() => {
    let combinList = commentList;
    combinList = combinList.sort((a, b) => {
      let aTime = new Date(a.time);
      let bTime = new Date(b.time);
      if (aTime > bTime) {
        return -1;
      }
      if (aTime < bTime) {
        return 1;
      }
      return 0;
    });
    return combinList;
  }, [commentList]);

  const submitHandle = useCallback(() => {
    setDeleteId(null);
    setModalData({
      open: true,
      status: 1,
      content: <Intl id='addNewCommentTips' />,
    });
  }, []);

  const deleteHandle = useCallback(commentId => {
    setModalData({
      open: true,
      status: 1,
      content: <Intl id='deleteCommentTips' />,
    });
    setDeleteId(commentId);
  }, []);

  const buttonClickHandle = useCallback(() => {
    let apiCall = deleteId ? deleteComment : postComment;

    let postData = deleteId
      ? {
          input_form_id: recordId,
          comment_id: deleteId,
        }
      : {
          input_form_id: recordId,
          comment: comment,
        };

    let successTips = deleteId ? (
      <Intl id='deleteSuccess' />
    ) : (
      <Intl id='addSuccess' />
    );

    switch (modalData.status) {
      case 1:
      case 3:
        setModalData({
          ...modalData,
          status: 0,
          content: <Intl id='loadNpatience' />,
        });
        apiCall(postData)
          .then(res => {
            if (res.code === 200) {
              setModalData({
                open: true,
                status: 2,
                content: successTips,
              });
              if (deleteId) {
                handleChange(
                  commentList.filter(item => item.comment_id !== deleteId)
                );
                setDeleteId(null);
              } else {
                handleChange([
                  ...commentList,
                  {
                    comment_id: res.data.commentId,
                    comment: comment,
                    time: new Date().toGMTString(),
                    accountId: authContext.accountId,
                  },
                ]);
              }
            }
          })
          .catch(() => {
            setModalData({
              ...modalData,
              status: 3,
              content: <Intl id='goesWrong' />,
            });
          });
        break;
      default:
        setModalData({ ...modalData, open: false });
        setDeleteId(null);
        break;
    }
  }, [
    deleteId,
    comment,
    modalData,
    recordId,
    commentList,
    handleChange,
    authContext.accountId,
  ]);

  const memoizedCallback = useMemo(() => {
    return {
      recordId,
      modalData,
      commentList,
      authContext,
      handleChange,
    };
  }, [recordId, modalData, commentList, authContext, handleChange]);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ width: '100%' }}>
        <Text type='title'>
          <Intl id='commnetHistory'></Intl>
        </Text>
        <div style={{ marginTop: SPACING.space40 }}>
          {currentList.map((comment, index) => {
            return (
              <div
                key={index}
                style={{ marginBottom: SPACING.space20, width: '100%' }}
              >
                <CommnetTitle>
                  <AccountDetail>
                    <AccountCircleIcon />
                    <Commentator>
                      {comment.accountId}
                      {comment.tag && (
                        <span
                          style={{
                            color: COLORS.darkRed,
                            marginLeft: SPACING.space8,
                          }}
                        >
                          ({comment.tag})
                        </span>
                      )}
                    </Commentator>
                    {!comment.tag && (
                      <DeleteIcon
                        onClick={() => {
                          deleteHandle(comment.comment_id);
                        }}
                      >
                        <Delete />
                      </DeleteIcon>
                    )}
                  </AccountDetail>
                  <div
                    style={{
                      color: COLORS.textGrey,
                      fontSize: FONT_SIZES.fontSize5,
                    }}
                  >
                    {comment.time}
                  </div>
                </CommnetTitle>
                <div
                  style={{
                    color: COLORS.color11,
                    fontSize: FONT_SIZES.fontSize4,
                  }}
                >
                  {comment.comment}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ marginBottom: SPACING.space40 }}>
        <div
          style={{ color: COLORS.mainPurple, marginBottom: SPACING.space40 }}
        >
          <Text type='title'>
            <Intl id='newComment'></Intl>
          </Text>
        </div>
        <div style={{ width: '100%' }}>
          <div style={{ width: '100%', marginBottom: SPACING.space20 }}>
            <TextBox
              value={comment}
              placeholder='Please enter your comment'
              multiline
              rows={4}
              onChange={value => {
                setComment(value);
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ marginRight: SPACING.space20 }}>
              <Button
                onClick={() => {
                  window.history.back();
                }}
                variant='contained'
                size='small'
              >
                <Intl id='back' />
              </Button>
            </div>
            <div style={{ marginRight: SPACING.space20 }}>
              <Button
                onClick={() => {
                  submitHandle();
                }}
                disabled={!comment}
                variant='contained'
                size='small'
              >
                <Intl id='comment' />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <CallModal
        open={modalData.open}
        content={modalData.content}
        status={modalData.status}
        buttonClickHandle={buttonClickHandle}
        handleClose={() => {
          setModalData({ ...modalData, open: false });
        }}
      />
    </div>
  );
};

export default CommentSection;
