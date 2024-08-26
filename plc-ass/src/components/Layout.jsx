import React from "react";

import { NavSidebar } from "./NavSidebar";
import BodyWrapper from "./BodyWrapper";

export const DashboardLayout = ({ children }) => {
  return (
    <BodyWrapper>
      <div className="flex h-screen bg-gray-400">
        <NavSidebar />

        <div className="flex flex-col flex-1 max-h-screen">
          <main className="content">
            <section className="lg:flex-row flex flex-col flex-1">
              <div
                className="content-box"
                style={{ flexGrow: 1, flexBasis: "0%" }}
              >
                {children}
              </div>
            </section>
          </main>
        </div>
      </div>
    </BodyWrapper>
  );
};
