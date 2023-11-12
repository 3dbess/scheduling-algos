import React from 'react';
import styled from 'styled-components';

import { media } from '../GlobalStyle.css';

const TableWrapper = styled.div`
  overflow: auto;
  max-width: 100%;
  margin: 0px auto 20px auto;
  ${media['600']`
  margin: 0px auto 0px auto;
  `}
  background:
    linear-gradient(to right, white 30%, rgba(255,255,255,0)),
    linear-gradient(to right, rgba(255,255,255,0), white 70%) 0 100%,
    radial-gradient(farthest-side at 0% 50%, rgba(0,0,0,.2), rgba(0,0,0,0)),
    radial-gradient(farthest-side at 100% 50%, rgba(0,0,0,.2), rgba(0,0,0,0)) 0 100%;
  background-repeat: no-repeat;
  background-color: white;
  background-size: 40px 100%, 40px 100%, 14px 100%, 14px 100%;
  background-position: 0 0, 100%, 0 0, 100%;
  background-attachment: local, local, scroll, scroll;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 1px;
  box-sizing: border-box;
  ${media['1275']`font-size: 14px;`}

  tr {
    height: 40px;
    line-height: 0;
    ${media['600']`height: 35px`};
  }

  th,
  td {
    text-align: center;
    padding: 15px;
    ${media['1275']`padding: 12px`};
    ${media['600']`padding: 8px`};
    border: 1px solid #e1e1e1;
    line-height: 16px;
  }
`;

const HeaderCell = styled.th`
  font-size: 0.9rem;
  ${media['1275']`font-size: 14px;`}
  font-weight: 400;
  height: 40px;
  ${media['600']`height: 35px`};
  white-space: nowrap;
  color: #FFFFFF;
  background-color: #145A32;
`;

const precisionRound = (number: number) : string => {
  return number.toFixed(1);
};

type TableProps = {
  solvedProcessesInfo: {
    job: string;
    at: number;
    bt: number;
    ft: number;
    tat: number;
    wat: number;
  }[];
};

const Table = ({ solvedProcessesInfo }: TableProps) => {
  const total = (array: number[]) =>
    array.reduce((acc, currentValue) => acc + currentValue, 0);

  const numberOfProcesses = solvedProcessesInfo.length;
  const turnaoundTime = solvedProcessesInfo.map((process) => process.tat);
  const waitingTime = solvedProcessesInfo.map((process) => process.wat);

  const totalTAT = total(turnaoundTime);
  const averageTAT = totalTAT / numberOfProcesses;

  const totalWAT = total(waitingTime);
  const averageWAT = totalWAT / numberOfProcesses;

  return (
    <TableWrapper>    
      <StyledTable>
        <thead>
          <tr>
            <HeaderCell>Process ID</HeaderCell>
            <HeaderCell>Arrival Time</HeaderCell>
            <HeaderCell>Burst Time</HeaderCell>
            <HeaderCell>Completion Time</HeaderCell>
            <HeaderCell>Turn-around Time</HeaderCell>
            <HeaderCell>Waiting Time</HeaderCell>
          </tr>
        </thead>
        <tbody>
          {solvedProcessesInfo.map((item, index) => (
            <tr key={`process-row-${item.job}`}>
              <td>{item.job}</td>
              <td>{item.at}</td>
              <td>{item.bt}</td>
              <td>{item.ft}</td>
              <td>{item.tat}</td>
              <td>{item.wat}</td>
            </tr>
          ))}
          {
            <tr>
              <td colSpan={4} style={{ textAlign: 'right' }}>
                Average
              </td>
              <td>
                {precisionRound(averageTAT)}
              </td>
              <td>
                {precisionRound(averageWAT)}
              </td>
            </tr>
          }
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
};

export default Table;
