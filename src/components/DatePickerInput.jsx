'use strict';

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';

import DatePicker from './DatePicker';

export default class DatePickerInput extends Component {
  static propTypes = {
    autoclose: PropTypes.bool,
    canNullify: PropTypes.bool,
    defaultValue: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    minDate: PropTypes.instanceOf(Date),
    top: PropTypes.bool,
  };

  static defaultProps = {
    autoclose: true,
    canNullify: true,
    top: false,
  };

  state = {
    formatted: this.props.defaultValue ? moment(this.props.defaultValue)
      .format(this.props.format || DatePicker.defaultProps.format) : null,
    show: false,
    value: this.props.defaultValue ? this.props.defaultValue.toJSON() : null,
  };

  componentDidMount() {
    if (this.props.autoclose) {
      window.addEventListener('mousedown', this.onWindowMousedown);
    }
  }

  componentWillReceiveProps(props) {
    if (props.hasOwnProperty('value')) {
      const { value: formatted } = props;
      const state = { formatted };
      if (formatted) {
        state.value = moment(formatted, this.refs.datepicker.props.format);
      }
      this.setState(state);
    }
  }

  componentWillUnmount() {
    if (this.props.autoclose) {
      window.removeEventListener('mousedown', this.onWindowMousedown);
    }
  }

  onWindowMousedown = (e) => {
    this.setState({ show: findDOMNode(this.refs.input).contains(e.target) });
  };

  submit({ iso, formatted, ...args }) {
    this.setState({ formatted, value: iso });
    this.setDisplay(false);
    if (this.props.onSelect) {
      this.props.onSelect({ iso, formatted, ...args });
    }
  }

  nullify() {
    const nullDate = { formatted: null, value: null };
    this.refs.datepicker.reset();
    this.setState(nullDate);
    if (this.props.onNullify) {
      this.props.onNullify(nullDate);
    }
  }

  setDisplay(show) {
    this.setState({ show });
  }

  render() {
    const classNames = ['date-picker-input'];

    if (this.props.canNullify) {
      classNames.push('input-group');
    }

    const props = {};

    if (this.props.defaultValue) {
      props.defaultValue = this.props.defaultValue;
    }

    const nullifyButton = !this.props.canNullify ? null : (
      <span className="input-group-btn" ref="nullify">
        <button
          className="btn btn-danger"
          onClick={::this.nullify}
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
            onSubmit={::this.submit}
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
