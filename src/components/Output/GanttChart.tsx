import { useLayoutEffect, useRef, useState } from 'react';
import { ganttChartInfoType } from './Processes';
import styled from 'styled-components';

import { media } from '../GlobalStyle.css';

const Container = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
`;

const JobContainer = styled.div`
  display: flex;
`;

const Job = styled.div`
  width: 100px;
  height: 35px;
  border: 0.5px solid #145A32;
  background-color: #D5F5E3;
  color: #34495E;
  ${media['600']`
    width: 32px;
    height: 27px;
    font-size: 14px;
  `}

  &:not(:last-child) {
    margin-right: -1px;
  }
`;

const TimeContainer = styled.div`
  display: flex;
`;

const Time = styled.div`
  width: 100px;
  height: 20px;
  ${media['600']`
    width: 32px;
    height: 21px;
    font-size: 14px;
  `}
  border: 1px solid #fff;
  color: #34495E;

  &:not(:last-child) {
    margin-right: -1px;
  }
`;

const MultilineContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

type GanttChartProps = {
  ganttChartInfo: ganttChartInfoType;
};

const GanttChart = ({ ganttChartInfo }: GanttChartProps) => {
  const containerEl = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(null);
  const [containerWidth, setContainerWidth] = useState(null);

  const job: string[] = [];
  const time: number[] = [];
  ganttChartInfo.forEach((item, index) => {
    if (index === 0) {
      job.push(item.job);
      time.push(item.start, item.stop);
    } else if (time.slice(-1)[0] === item.start) {
      job.push(item.job);
      time.push(item.stop);
    } else if (time.slice(-1)[0] !== item.start) {
      job.push('_', item.job);
      time.push(item.start, item.stop);
    }
  });

  useLayoutEffect(() => {
    function updateSize() {
      setWindowWidth(window.innerWidth);
      setContainerWidth(containerEl.current.offsetWidth);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  let itemWidth = 0;
  if (windowWidth <= 600) {
    itemWidth = 32;
  } else {
    itemWidth = 40;
  }

  const timeContainerWidth = time.length * itemWidth - (time.length - 1);

  let maxTimeItemCount = ~~(containerWidth / itemWidth);

  let numberOfLines = 0;
  let acc = 0;
  while (true) {
    if (containerWidth === null) {
      break;
    }
    acc += maxTimeItemCount - 1;
    numberOfLines++;
    if (acc >= time.length) {
      acc -= maxTimeItemCount - 1;
      break;
    }
  }
  
  // If index of last time item equal to acc
  let lastLineItemCount: number;
  if (time.length - 1 === acc) {
    lastLineItemCount = 0;
    numberOfLines--;
  } else {
    lastLineItemCount = time.length - acc;
  }

  let timeCounter = 0;
  let jobCounter = 0;

  return (
    <Container ref={containerEl}>
      {containerWidth !== null && containerWidth <= timeContainerWidth && (
        <>
          {Array.from({ length: numberOfLines }).map((_, ind) => {
            if (ind === numberOfLines - 1 && lastLineItemCount !== 0) {
              return (
                <MultilineContainer key={`multiline-container-${ind}`}>
                  <JobContainer>
                    {Array.from({
                      length: lastLineItemCount - 1,
                    }).map((_, i) => (
                      <Job key={`gc-job-lastline${i}`} className="flex-center">
                        {job[jobCounter + 1 + i]}
                      </Job>
                    ))}
                  </JobContainer>
                  <TimeContainer>
                    {Array.from({
                      length: lastLineItemCount,
                    }).map((_, i) => (
                      <Time
                        key={`gc-time-lastline${i}`}
                        className="flex-center"
                      >
                        {time[timeCounter + i]}
                      </Time>
                    ))}
                  </TimeContainer>
                </MultilineContainer>
              );
            } else if (ind == 0) {
              timeCounter += maxTimeItemCount - 1;
              jobCounter += timeCounter - 1;
              return (
                <MultilineContainer key={`multiline-container-${ind}`}>
                  <JobContainer>
                    {Array.from({ length: jobCounter + 1 }).map((_, i) => (
                      <Job key={`gc-job-firstline${i}`} className="flex-center">
                        {job[i]}
                      </Job>
                    ))}
                  </JobContainer>
                  <TimeContainer>
                    {Array.from({ length: timeCounter + ind + 1 }).map(
                      (_, i) => (
                        <Time
                          key={`gc-time-firstline${i}`}
                          className="flex-center"
                        >
                          {time[i]}
                        </Time>
                      )
                    )}
                  </TimeContainer>
                </MultilineContainer>
              );
            } else {
              let prevCounter = timeCounter;
              timeCounter += maxTimeItemCount - 1;
              let prevJobCounter = jobCounter;
              jobCounter += maxTimeItemCount - 1;
              return (
                <MultilineContainer key={`multiline-container-${ind}`}>
                  <JobContainer>
                    {Array.from({ length: maxTimeItemCount - 1 }).map(
                      (_, i) => (
                        <Job key={`gc-job-${i}-${ind}`} className="flex-center">
                          {job[prevJobCounter + i + 1]}
                        </Job>
                      )
                    )}
                  </JobContainer>
                  <TimeContainer>
                    {Array.from({ length: maxTimeItemCount }).map((_, i) => (
                      <Time key={`gc-time-${i}-${ind}`} className="flex-center">
                        {time[prevCounter + i]}
                      </Time>
                    ))}
                  </TimeContainer>
                </MultilineContainer>
              );
            }
          })}
        </>
      )}
      {containerWidth !== null && containerWidth > timeContainerWidth && (
        <>
          <JobContainer>
            {job.map((job, index) => (
              <Job key={`gc-job-${index}`} className="flex-center">
                {job}
              </Job>
            ))}
          </JobContainer>
          <TimeContainer>
            {time.map((time, index) => (
              <Time key={`gc-time-${index}`} className="flex-center">
                {time}
              </Time>
            ))}
          </TimeContainer>
        </>
      )}
    </Container>
  );
};

export default GanttChart;
