import React from 'react';
import Keyboard from '../components/Keyboard';
import './DemoPage.css';

const DemoPage: React.FC = () => {
  return (
    <div className="demo-page">
      <div className="demo-content">
        <h1>Oneboard Demo</h1>
        <p>Experience our universal keyboard layout</p>
        <Keyboard />
      </div>
    </div>
  );
};

export default DemoPage;
