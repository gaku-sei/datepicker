'use strict';

import * as React from 'react';

import DatePickerInput from '../components/DatePickerInput';

export default class Layout extends React.Component<void, void> {
  render() {
    return (
      <div>
        <div className="col-sm-4 col-sm-offset-4">
          <div style={{ marginTop: '50px' }}>
            <DatePickerInput />
          </div>
          <div style={{ marginTop: '50px' }}>
            <DatePickerInput headless />
          </div>
          <div style={{ marginTop: '400px' }}>
            <DatePickerInput headless top />
          </div>
          <div style={{ marginTop: '50px' }}>
            <DatePickerInput top />
          </div>
        </div>
      </div>
    );
  }
}
