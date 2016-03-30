'use strict';

import '../node_modules/normalize.css/normalize.css';

import * as React from 'react';
import { render } from 'react-dom';

import Layout from './containers/Layout';

render(
  <Layout />,
  document.getElementById('root')
);
