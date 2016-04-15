'use strict';

import * as React from 'react';
import { findDOMNode } from 'react-dom';
import * as moment from 'moment';

import DatePicker from './DatePicker';

const { Component, PropTypes } = React;

interface ComplexDate {
  formatted?: string;
  iso?: string;
}

interface Props {
  autoclose?: boolean;
  canNullify?: boolean;
  defaultValue?: Date;
  format?: string;
  headless?: boolean;
  maxDate?: Date;
  minDate?: Date;
  onNullify?: Function;
  onSelect?(date: ComplexDate): void;
  top?: boolean;
  value?: string;
}

interface State {
  show?: boolean;
  formatted?: string;
}

export default class DatePickerInput extends Component<Props & React.HTMLProps<DatePickerInput>, State> {
  static defaultProps = {
    autoclose: true,
    canNullify: true,
    top: false,
  };

  state = {
    formatted: this.props.defaultValue ? moment(this.props.defaultValue)
      .format(this.props.format || DatePicker.defaultProps.format) : null,
    show: false,
  };

  componentDidMount() {
    if (this.props.autoclose) {
      window.addEventListener('mousedown', this.onWindowMousedown);
    }
  }

  componentWillReceiveProps(props: Props) {
    if (props.hasOwnProperty('value')) {
      const { value: formatted } = props;
      this.setState({ formatted });
    }
  }

  componentWillUnmount() {
    if (this.props.autoclose) {
      window.removeEventListener('mousedown', this.onWindowMousedown);
    }
  }

  onWindowMousedown = ({ target }: { target: EventTarget }) => {
    this.setState({ show: findDOMNode(this.refs['input']).contains(target as Node) });
  };

  submit(date: ComplexDate) {
    const { iso, formatted }: { iso?: string, formatted?: string } = date;
    this.setState({ formatted, value: iso } as State);
    this.setDisplay(false);
    if (this.props.onSelect) {
      this.props.onSelect(date);
    }
  }

  nullify() {
    const nullDate: State = { formatted: null };
    (this.refs['datepicker'] as DatePicker).reset();
    this.setState(nullDate);
    if (this.props.onNullify) {
      this.props.onNullify();
    }
  }

  setDisplay(show: boolean) {
    this.setState({ show });
  }

  render() {
    const classNames = ['date-picker-input'];

    if (this.props.canNullify) {
      classNames.push('input-group');
    }

    const props: { defaultValue?: Date } = {};

    if (this.props.defaultValue) {
      props.defaultValue = this.props.defaultValue;
    }

    const nullifyButton = !this.props.canNullify ? null : (
      <span className="input-group-btn" ref="nullify">
        <button
          className="btn btn-danger"
          onClick={this.nullify.bind(this)}
          style={{
            borderRadius: 0,
            fontSize: '23px',
            fontWeight: 'bold',
            padding: '0 10px',
          }}
          type="button"
        >
          <span>&times;</span>
        </button>
      </span>
    );

    return (
      <div className={classNames.join(' ')} style={{ position: 'relative' }}>
        <div ref="input">
          <div style={{ position: 'relative' }}>
            <i
              style={{
                position: 'absolute',
                right: 0,
                padding: '10px 25px',
                pointerEvents: 'none',
                zIndex: 100
              }}
            >{/* Icon placeholder */}</i>
            <input
              className="form-control"
              onFocus={this.setDisplay.bind(this, true)}
              placeholder={this.props.placeholder}
              readOnly
              style={{ borderRadius: 0, marginBottom: 0, paddingRight: '30px' }}
              type="text"
              value={this.state.formatted}
            />
          </div>
          <DatePicker
            fixHeight
            format={this.props.format}
            headless={this.props.headless}
            onHide={this.setDisplay.bind(this, false)}
            onSubmit={this.submit.bind(this)}
            ref="datepicker"
            show={this.state.show}
            style={Object.assign({
              position: 'absolute',
              top: this.props.top ? `-${this.props.headless ? 422 : 522}px` : '33px',
            }, this.props.style)}
            {...props}
          />
        </div>
        {nullifyButton}
      </div>
    );
  }
}
