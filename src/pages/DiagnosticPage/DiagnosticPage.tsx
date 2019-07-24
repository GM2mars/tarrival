import React, { PureComponent } from 'react';

import { Dashboard } from '../../components';
import './DiagnosticPage.style.less';


export class DiagnosticPage extends PureComponent<{}> {

  render() {
    return (
      <div>
        <Dashboard/>
      </div>
    );
  }
}

