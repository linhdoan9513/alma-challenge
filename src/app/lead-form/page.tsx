'use client'

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import LeadForm from '@/components/LeadForm';

const LeadFormPage: React.FC = () => {
  return (
    <Provider store={store}>
      <LeadForm />
    </Provider>
  );
};

export default LeadFormPage; 