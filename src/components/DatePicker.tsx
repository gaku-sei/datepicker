'use strict';

import * as React from 'react';
import * as moment from 'moment';

import { capitalize, partition, repeat } from '../services/util';

moment.locale('fr');

const { Component, PropTypes } = React;

const weekdays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
const boundings = {
  width: '270px',
};

type MomentAction = 'add' | 'subtract';

interface Props {
  defaultValue?: Date;
  fixHeight?: boolean;
  format?: string;
  headless?: boolean;
  onCancel?: Function;
  onHide?: Function;
  onSelect?: Function;
  onSubmit?: Function;
  show?: boolean;
  style?: Object;
}

interface State {
  ranges?: Array<Array<moment.Moment>>,
  relative?: moment.Moment,
  selected?: moment.Moment,
}

export default class DatePicker extends Component<Props, State> {
  static defaultProps = {
    defaultValue: new Date(),
    fixHeight: false,
    format: 'DD/MM/YYYY HH:mm',
    headless: false,
  };

  state = {
    ranges: this.getRanges(moment(this.props.defaultValue)),
    relative: moment(this.props.defaultValue),
    selected: moment(this.props.defaultValue),
  };

  changeYear(action: MomentAction) {
    const relative: moment.Moment = this.state.relative.clone()[action](1, 'year');
    this.setState({ ranges: this.getRanges(relative), relative });
  }

  changeMonth(action: MomentAction) {
    const relative: moment.Moment = this.state.relative.clone()[action](1, 'month');
    this.setState({ ranges: this.getRanges(relative), relative });
  }

  getRanges(date: moment.Moment = moment()): Array<Array<moment.Moment>> {
    const dates: Array<moment.Moment> = [];
    const ret = repeat(null, moment(date).startOf('month').weekday());
    const lastDay = moment(date).endOf('month').date();

    for (let i = 1; i <= lastDay; i++) {
      dates.push(date.clone().date(i).startOf('day'));
    }

    return partition(ret.concat(dates), 7);
  }

  formatSelected() {
    const { selected } = this.state;
    const date = selected.toDate();
    return {
      formatted: selected.format(this.props.format),
      iso: date.toJSON(),
      js: date,
      moment: selected,
    };
  }

  reset(date = moment()) {
    this.setState({ ranges: this.getRanges(date), relative: date, selected: date });
  }

  select(day: moment.Moment) {
    const { selected } = this.state;
    const { onSelect } = this.props;
    day.hours(selected.hours()).minutes(selected.minutes());
    this.setState({ selected: day });
    if (onSelect) {
      onSelect(this.formatSelected());
    }
  }

  cancel() {
    const { onCancel, onHide } = this.props;
    if (onCancel) {
      onCancel(this.formatSelected());
    }
    if (onHide) {
      onHide();
    }
  }

  submit() {
    const { onSubmit, onHide } = this.props;
    if (onSubmit) {
      onSubmit(this.formatSelected());
    }
    if (onHide) {
      onHide();
    }
  }

  sameDay(date1: moment.Moment, date2: moment.Moment) {
    return !date1.clone().startOf('day').diff(date2.clone().startOf('day'));
  }

  setHours({ target: { value } }) {
    this.state.selected.hours(+value);
  }

  setMinutes({ target: { value } }) {
    this.state.selected.minutes(+value);
  }

  renderCell(day: moment.Moment, key: string | number) {
    const active = this.sameDay(day, this.state.selected) ? ' active' : '';
    const size = `calc((${boundings.width} - 9px) / 7)`;
    return (
      <td
        className={`day${active}`}
        key={key}
        onClick={this.select.bind(this, day)}
        style={{
          cursor: 'pointer',
          transition: 'all .5s',
        }}
      >
        <div style={{ height: size, lineHeight: size, width: size }}>
          <button
            style={{
              backgroundColor: 'transparent',
              border: 0,
              outline: 0,
            }}
            type="button"
          >
            {day.date()}
          </button>
        </div>
      </td>
    );
  }

  renderEmptyCell(key: string | number) {
    return (
      <td key={key} style={{ padding: '1px' }}></td>
   );
  }

  render() {
    const { fixHeight, headless, style } = this.props;
    const { relative, selected } = this.state;
    return !this.props.show ? null : (
      <div
        className="date-picker"
        style={Object.assign({
          backgroundColor: 'white',
          border: '1px solid #ccc',
          width: boundings.width,
          zIndex: '9999'
        }, style)}
      >
        {headless ? null : (
          <div
            style={{
              backgroundColor: 'cornflowerblue',
              height: '100px',
              padding: '15px',
            }}
          >
            <div className="year" style={{ color: 'aliceblue', fontSize: '18px' }}>
              {selected.format('YYYY')}
            </div>
            <div className="day-and-month" style={{ color: 'white', fontSize: '30px' }}>
              <strong>
                {capitalize(selected.format('ddd DD MMM'))}
              </strong>
            </div>
          </div>
        )}
        <div className="body" style={{ textAlign: 'center' }}>
          <div className="row year-picker" style={{ fontSize: '18px', margin: '8px 0' }}>
            <div
              className="col-sm-2"
              onClick={this.changeYear.bind(this, 'subtract')}
              style={{ cursor: 'pointer' }}
            >
              <button
                style={{
                  backgroundColor: 'transparent',
                  border: 0,
                  height: '100%',
                  outline: 0,
                  width: '100%',
                }}
                type="button"
              >
                <i>{'<'}</i>
              </button>
            </div>
            <div className="col-sm-8">
              {capitalize(relative.format('YYYY'))}
            </div>
            <div
              className="col-sm-2"
              onClick={this.changeYear.bind(this, 'add')}
              style={{ cursor: 'pointer' }}
            >
              <button
                style={{
                  backgroundColor: 'transparent',
                  border: 0,
                  height: '100%',
                  outline: 0,
                  width: '100%',
                }}
                type="button"
              >
                <i>{'>'}</i>
              </button>
            </div>
          </div>
          <div className="month-picker row" style={{ fontSize: '18px', margin: '8px 0' }}>
            <div
              className="col-sm-2"
              onClick={this.changeMonth.bind(this, 'subtract')}
              style={{ cursor: 'pointer' }}
            >
              <button
                style={{
                  backgroundColor: 'transparent',
                  border: 0,
                  height: '100%',
                  outline: 0,
                  width: '100%',
                }}
                type="button"
              >
                <i>{'<'}</i>
              </button>
            </div>
            <div className="col-sm-8">
              {capitalize(relative.format('MMMM'))}
            </div>
            <div
              className="col-sm-2"
              onClick={this.changeMonth.bind(this, 'add')}
              style={{ cursor: 'pointer' }}
            >
              <button
                style={{
                  backgroundColor: 'transparent',
                  border: 0,
                  height: '100%',
                  outline: 0,
                  width: '100%',
                }}
                type="button"
              >
                <i>{'>'}</i>
              </button>
            </div>
          </div>
          <div className="day-picker" style={{ height: fixHeight ? '250px' : null }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr style={{ color: '#bbb' }}>
                  {weekdays.map((day) => (
                    <td key={day.toLowerCase()} width={`${100 / 7}%`}>{day}</td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {this.state.ranges.map((range, i) => (
                  <tr key={i}>
                    {range.map((day, j) => {
                      const key = `${i}-${j}`;
                      return day === null ? this.renderEmptyCell(key) : this.renderCell(day, key);
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <hr style={{ margin: '5px' }} />
          <div className="time" style={{ margin: '5px 0' }}>
            <div className="row">
              <div className="col-sm-5 col-sm-offset-1">
                <div className="input-group">
                  <input
                    className="form-control"
                    defaultValue={selected.hours()}
                    max="23"
                    min="0"
                    onChange={this.setHours.bind(this)}
                    style={{ borderRadius: 0 }}
                    type="number"
                  />
                  <span className="input-group-addon" style={{ borderRadius: 0 }}>h</span>
                </div>
              </div>
              <div className="col-sm-5">
                <div className="input-group">
                  <input
                    className="form-control"
                    defaultValue={selected.minutes()}
                    max="59"
                    min="0"
                    onChange={this.setMinutes.bind(this)}
                    style={{ borderRadius: 0 }}
                    type="number"
                  />
                  <span className="input-group-addon" style={{ borderRadius: 0 }}>m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr style={{ margin: '0 5px 5px' }} />
        <div className="footer" style={{ margin: '5px', textAlign: 'right' }}>
          <div className="btn-group" role="group">
            <button
              className="btn btn-success"
              onClick={this.submit.bind(this)}
              style={{
                border: 0,
                borderRadius: 0,
              }}
              type="button"
            >
              Choisir
            </button>
            <button
              className="btn btn-warning"
              onClick={this.cancel.bind(this)}
              style={{
                border: 0,
                borderRadius: 0,
              }}
              type="button"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }
}
