import React, {useState} from 'react';
import 'antd/dist/antd.css';
import {DatePicker} from 'antd';

const App = () => {
  const [count, setCount] = useState(0);
  return (
    <>
      <h1>RingCentral Web Phone Demo</h1>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <DatePicker />
    </>
  );
};

export default App;
