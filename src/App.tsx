import React, { useState } from 'react';
import GcsTab from './GcsTab';
import BigQueryTab from './BigQueryTab';

type ServiceTab = 'gcs' | 'bigquery';

const App = () => {
  const [activeService, setActiveService] = useState<ServiceTab>('gcs');

  return (
    <div className="app-root">
      <div className="service-tabs">
        <button
          className={`service-tab ${activeService === 'gcs' ? 'active' : ''}`}
          onClick={() => setActiveService('gcs')}
        >
          Cloud Storage
        </button>
        <button
          className={`service-tab ${activeService === 'bigquery' ? 'active' : ''}`}
          onClick={() => setActiveService('bigquery')}
        >
          BigQuery
        </button>
      </div>
      <div className="service-content">
        {activeService === 'gcs' && <GcsTab />}
        {activeService === 'bigquery' && <BigQueryTab />}
      </div>
    </div>
  );
};

export default App;
