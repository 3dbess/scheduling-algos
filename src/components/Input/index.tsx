import React, {
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
} from 'react';
import styled from 'styled-components';
import AlgoSelect, { OptionType, defaultOption } from './AlgoSelect';
import { invalidInputSwal } from './swal';
import { media } from '../GlobalStyle.css';

const StyledInput = styled.div`
  padding: 5rem 2rem 5rem 2rem;
  height: 38rem;
  ${media['600']`padding: 0.5rem 1.1rem 1.5rem 1.1rem;height:100%;`}
  background: #ffffff;
  box-shadow: 0px 2px 32px rgba(15, 91, 206, 0.1);
  border-radius: 2px;
  align-self: flex-start;
  ${media['1050']`align-self: normal;max-width: 100%;width: 100%;height:100%;`}
  min-width: 230px;
  max-width: 335px;
  width: 30vw;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Form = styled.form`
  dislay: flex;
  flex-direction: column;
  align-items: flex-start;

  & > * + * {
    margin-top: 20px;
  }

  fieldset {
    padding: 0;
    margin-left: 0;
    margin-right: 0;
    border: none;
  }

  label {
    display: inline-block;
    font-size: 14px;
    padding-bottom: 5px;
  }

  input {
    width: 100%;
    border: 1px solid #c5c7d0;
    border-radius: 1px;
    padding: 11px 12px;
    font-size: 14px;

    &:hover {
      background-color: #fafafa;
      border-color: rgb(179, 179, 179);
    }

    &:focus {
      border-color: #2684ff;
      background-color: #fff;
      outline: none;
    }

    &:-webkit-autofill::first-line {
      font-family: $body-font;
      font-size: 14px;
    }
  }

  button {
    background-color: #FFFFF;
    border-radius: 5px;
    background-color: #FFFFFF;
    border: 1px solid #145A32;
    color: #145A32;
    width: 33.3%;
    height: 2rem;
    transition: background-color 0.2s ease-out;
    margin-left: auto;
    position: relative;
    overflow: hidden;

    &:hover {
      transition:0.2s ease-out;
      box-shadow: 0 5px 5px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.15)
    }
  }

  span.ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 600ms ease-out;
    background-color: rgba(255, 255, 255, 0.7);
  }

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

type InputProps = {
  selectedAlgo: OptionType;
  setSelectedAlgo: Dispatch<SetStateAction<{}>>;
  setArrivalTime: Dispatch<SetStateAction<number[]>>;
  setBurstTime: Dispatch<SetStateAction<number[]>>;
  setTimeQuantum: Dispatch<SetStateAction<number>>;
  setPriorities: Dispatch<SetStateAction<number[]>>;
};

const Input = (props: InputProps) => {
  const [selectedAlgo, setSelectedAlgo] = useState(defaultOption);
  const [arrivalTime, setArrivalTime] = useState('');
  const [burstTime, setBurstTime] = useState('');
  const [timeQuantum, setTimeQuantum] = useState('');
  const [priorities, setPriorities] = useState('');
  const arrivalTimeRef = useRef(null);
  const burstTimeRef = useRef(null);

  useEffect(() => {
    if (arrivalTimeRef.current && burstTimeRef.current) {
      arrivalTimeRef.current.value = '';
      burstTimeRef.current.value = '';
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const arrivalTimeArr = arrivalTime
      .trim()
      .split(/\s+/)
      .map((at) => parseInt(at));
    const burstTimeArr = burstTime
      .trim()
      .split(/\s+/)
      .map((bt) => parseInt(bt));
    const timeQuantumInt = parseInt(timeQuantum);
    let prioritiesArr = priorities
      .trim()
      .split(/\s+/)
      .map((priority) => parseInt(priority));

    if (burstTimeArr.includes(0)) {
      invalidInputSwal('0 burst time is invalid');
      return;
    } else if (arrivalTimeArr.length !== burstTimeArr.length) {
      invalidInputSwal(
        'Number of the arrival times and burst times do not match'
      );
      return;
    } else if (
      arrivalTimeArr.includes(NaN) ||
      burstTimeArr.includes(NaN) ||
      (selectedAlgo.value === 'RR' && isNaN(timeQuantumInt))
    ) {
      invalidInputSwal('Please enter only integers');
      return;
    } else if (
      arrivalTimeArr.some((t) => t < 0) ||
      burstTimeArr.some((t) => t < 0)
    ) {
      invalidInputSwal('Negative numbers are invalid');
      return;
    }

    if (selectedAlgo.value === 'NPP' || selectedAlgo.value === 'PP') {
      if (priorities.trim() === '') {
        prioritiesArr = arrivalTimeArr.map(() => 0);
      } else if (
        prioritiesArr.length !== arrivalTimeArr.length ||
        prioritiesArr.length !== arrivalTimeArr.length
      ) {
        invalidInputSwal(
          'Arrival times, burst times and priorities should have equal length'
        );
        return;
      }
    }

    props.setSelectedAlgo(selectedAlgo);
    props.setArrivalTime(arrivalTimeArr);
    props.setBurstTime(burstTimeArr);
    props.setTimeQuantum(timeQuantumInt);
    props.setPriorities(prioritiesArr);
  };

  const handleArrivalTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArrivalTime(e.target.value);
  };

  const handleBurstTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBurstTime(e.target.value);
  };

  const handleTimeQuantumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeQuantum(e.target.value);
  };

  const handlePrioritiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriorities(e.target.value);
  };

  return (
    <StyledInput>
      <Header>
      <h1>Input</h1>
      </Header>
      <Form onSubmit={handleSubmit}>
        <fieldset>
          <label htmlFor="react-select-algo">Select Algorithm</label>
          <AlgoSelect
            selectedAlgo={selectedAlgo}
            setSelectedAlgo={setSelectedAlgo}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="arrival-time">Input Process Arrival Times</label>
          <input
            onChange={handleArrivalTimeChange}
            type="text"
            id="arrival-time"
            placeholder="e.g. 0 2 4 6 8"
            ref={arrivalTimeRef}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="burst-time">Input Process Burst Times</label>
          <input
            onChange={handleBurstTimeChange}
            type="text"
            id="burst-time"
            placeholder="e.g. 2 4 6 8 10"
            ref={burstTimeRef}
          />
        </fieldset>
        {selectedAlgo.value === 'RR' && (
          <fieldset>
            <label htmlFor="time-quantum">Time Splice</label>
            <input
              defaultValue={timeQuantum}
              onChange={handleTimeQuantumChange}
              type="number"
              id="time-quantum"
              placeholder="e.g. 3"
              min="1"
              step="1"
            />
          </fieldset>
        )}
        {(selectedAlgo.value === 'NPP' || selectedAlgo.value === 'PP') && (
          <fieldset>
            <label htmlFor="priorities">Priorities</label>
            <input
              defaultValue={priorities}
              onChange={handlePrioritiesChange}
              type="text"
              id="priorities"
              placeholder="Lesser # = higher priority"
            />
          </fieldset>
        )}
        <button type='submit'>Solve</button>
      </Form>
    </StyledInput>
  );
};

export default Input;
