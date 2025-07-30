"use client";

import LeadForm from "@/app/lead-form/LeadForm";
import { store } from "@/store/store";
import React from "react";
import { Provider } from "react-redux";

const LeadFormPage: React.FC = () => {
  return (
    <Provider store={store}>
      <LeadForm />
    </Provider>
  );
};

export default LeadFormPage;
