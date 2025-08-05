"use client";

import { store } from "@/store/store";
import dynamic from "next/dynamic";
import React from "react";
import { Provider } from "react-redux";

const LeadForm = dynamic(() => import("../../components/forms/LeadForm"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "400px" }} />,
});

const LeadFormPage: React.FC = () => {
  return (
    <div suppressHydrationWarning>
      <Provider store={store}>
        <LeadForm />
      </Provider>
    </div>
  );
};

export default LeadFormPage;
