/* third lib*/
import React, { useMemo, useState } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';
import Model from '@basics/Modal';
import Text from '@basics/Text';
import { THEME } from '../theme';

// Styled components
const ProgressBarContainer = styled.div`
  position: relative;
  width: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FlowDotList = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 99;
  flex-direction: column;
`;

const FlowItem = styled.div`
  color: ${THEME.colors.mainPurple};
  line-height: 2rem;
  font-weight: ${THEME.fontWeights.medium};
  flex: 1;
  position: relative;
  min-height: 8rem;
`;

const Dot = styled.div`
  display: flex;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: ${THEME.colors.mainPurple};
  position: absolute;
  bottom: 0;
`;

const ProgressItem = styled.div`
  position: absolute;
  left: ${THEME.spacing.space44};
  white-space: pre-wrap;
  width: 40rem;
`;

const ProgressName = styled.div`
  margin-left: ${THEME.spacing.space20};
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  font-size: ${THEME.fontSizes.fontSize3};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const SubContent = styled.div`
  color: ${THEME.colors.textGrey};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const ProgressLine = styled.div`
  width: 4px;
  height: 100%;
  position: absolute;
`;

const ProgressLineHolder = styled.div`
  width: 4px;
  overflow: hidden;
  position: relative;
  background-color: ${THEME.colors.lightGrey};
  height: 100%;
  border-radius: 2px;
`;

const Cover = styled.div`
  height: 50%;
  top: 0;
  left: 0;
  width: 100%;
  bottom: 0;
  position: absolute;
  transition: transform 0.2s linear;
  transform-origin: left;
  background-color: ${THEME.colors.mainPurple};
`;

const ViewLog = styled.span`
  display: inline-block;
  color: ${THEME.colors.textGrey};
  text-decoration: underline;
  margin-left: ${THEME.spacing.space8};
  font-size: ${THEME.fontSizes.fontSize4};
  cursor: pointer;
`;

const LogContent = styled.div`
  width: 70rem;
`;

const StageTitle = styled.div`
  margin-bottom: ${THEME.spacing.space20};
  color: ${THEME.colors.mainPurple};
`;

const StageLog = styled.div`
  color: ${THEME.colors.textGrey};
  margin-bottom: ${THEME.spacing.space20};
`;

const ProgressBar = ({ progress, stagesLog }) => {
  const [open, setOpen] = useState(false);

  const currentStepCount = useMemo(() => {
    let count = 1;
    let countIndex = 0;
    progress.forEach((item, index) => {
      if (item.time) {
        if (index === progress.length - 1) {
          countIndex = progress.length - 1;
        } else {
          if (index === progress.length - 2) {
            countIndex = index;
          } else {
            countIndex = index + 1;
          }
        }
      }
    });
    return count + countIndex;
  }, [progress]);

  const progressPercent = useMemo(() => {
    let unit = 100 / progress.length;

    return unit * currentStepCount;
  }, [progress.length, currentStepCount]);

  return (
    <ProgressBarContainer>
      <FlowDotList>
        {progress.map((item, index) => {
          return (
            <FlowItem key={index}>
              <Dot>
                <ProgressItem>
                  <ProgressName title={item.label}>
                    <MainContent>
                      {item.label}
                      {currentStepCount - 1 === index &&
                        item.label === 'Failed' && (
                          <ViewLog
                            onClick={() => {
                              setOpen(true);
                            }}
                          >
                            <Intl id='viewLog' />
                          </ViewLog>
                        )}
                    </MainContent>
                    {item.adgroup && (
                      <SubContent>
                        <Intl id='adGroup' />
                        {item.adgroup}
                      </SubContent>
                    )}
                    {item.operator && (
                      <SubContent>
                        <Intl id='approvedBy' />
                        {item.operator}
                      </SubContent>
                    )}
                  </ProgressName>
                </ProgressItem>
              </Dot>
            </FlowItem>
          );
        })}
      </FlowDotList>
      <ProgressLine>
        <ProgressLineHolder>
          <Cover style={{ height: progressPercent + '%' }}></Cover>
        </ProgressLineHolder>
      </ProgressLine>
      <Model
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
      >
        <div>
          {stagesLog && (
            <LogContent>
              {stagesLog.map((item, index) => {
                return (
                  <div key={index}>
                    <StageTitle>
                      <Text type='subTitle'>{item.apiTaskName}</Text>
                    </StageTitle>
                    {item.logs && <StageLog>{item.logs}</StageLog>}
                    {!item.logs && (
                      <StageLog>
                        <Intl id='noLogs' />
                      </StageLog>
                    )}
                  </div>
                );
              })}
            </LogContent>
          )}
        </div>
      </Model>
    </ProgressBarContainer>
  );
};

export default ProgressBar;
