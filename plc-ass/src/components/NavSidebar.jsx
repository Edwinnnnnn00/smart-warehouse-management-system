/* eslint-disable react/display-name, jsx-a11y/click-events-have-key-events */
import { Navigation } from "react-minimal-side-navigation";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "awesome-react-icons";
import React, { useState } from "react";

import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

export const NavSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <React.Fragment>
      {/* Sidebar Overlay */}
      <div
        onClick={() => {
          setIsSidebarOpen(false)
          console.log('Sidebar Overlay clicked')
          console.log(isSidebarOpen)
        }}
        className={`fixed inset-0 z-20 block transition-opacity bg-black opacity-50 ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      />
{/* 
      <div className="absolute right-0">
        <a href="https://github.com/abhijithvijayan/react-minimal-side-navigation">
          View on GitHub
        </a>
      </div> */}

      <div>
        <button
          className="btn-menu"
          onClick={() => {
            setIsSidebarOpen(true)
            console.log('Menu button clicked')
            console.log(isSidebarOpen)
          }}
          type="button"
        >
          <Icon name="burger" className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 ease-out transform translate-x-0 bg-white border-r-2 ${
          isSidebarOpen ? "ease-out translate-x-0" : "ease-in -translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center mt-10 text-center py-6">
          <span className="mx-2 text-2xl font-semibold text-black">
            Warehouse Management App
          </span>
        </div>

        {/* https://github.com/abhijithvijayan/react-minimal-side-navigation */}
        <Navigation
          activeItemId={location.pathname}
          onSelect={({ itemId }) => {
            navigate(itemId);
          }}
          items={[
            {
              title: "Home",
              itemId: "/home",
              // Optional
              elemBefore: () => <Icon name="coffee" />
            },
            {
              title: "Camera",
              itemId: "/camera",
              elemBefore: () => <Icon name="user" />
            },
            {
              title: "Records",
              itemId: "/records",
              elemBefore: () => <Icon name="activity" />
            },
            {
              title: "Temperature",
              itemId: "/temperature",
              elemBefore: () => <Icon name="activity" />
            }
          ]}
        />

        <div className="absolute bottom-0 w-full my-8">
          <Navigation
            activeItemId={location.pathname}
            items={[
              {
                title: "About",
                itemId: "/about",
                elemBefore: () => <Icon name="calendar" />
              }
            ]}
            onSelect={({ itemId }) => {
              navigate(itemId);
            }}
          />
        </div>
      </div>
    </React.Fragment>
  );
};
