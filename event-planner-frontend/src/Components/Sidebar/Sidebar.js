import React, { useState } from "react";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import HomeIcon from "@material-ui/icons/Home";
import LinkIcon from "@material-ui/icons/Link";
import LockIcon from "@material-ui/icons/Lock";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import "./Sidebar.css";
import BrandName from "../BrandName/BrandName";
import { NavLink, useHistory } from "react-router-dom";
import Privacy from "../Privacy/Privacy";
import axios from "axios";

function Sidebar({ toggleSidebar, setToggleSidebar }) {
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const history = useHistory();
  const handleOpen = () => {
    setOpenPrivacy(true);
  };

  const handleClose = () => {
    setOpenPrivacy(false);
  };

  const handleActive = (e) => {
    // let clickedElem = e.target;
    // console.log(clickedElem);
    // // e.target.className.add('active');
    setToggleSidebar(false);
  }




  return (
    <div
      className={toggleSidebar ? "sidebarContainer show" : "sidebarContainer"}
    >
      <div className="topSidebar">
        <BrandName />
      </div>
      <div className="sidebarSections">
        <div className="pageLinkSection">
          <p className="sectionHeading">MAIN</p>
          <div className="sectionLinks">

              <NavLink exact to="/" style={{ textDecoration: "none" }} onClick={handleActive} className="pageLink" activeClassName="active">
                <HomeIcon />
                <p>Home</p>
              </NavLink>
              <NavLink exact to="/profile" onClick={handleActive} style={{ textDecoration: "none" }} className="pageLink" activeClassName="active">
                <AccountBoxIcon />

                <p>Profile</p>
              </NavLink>
          </div>
        </div>
        <div className="pageLinkSection">
          <p className="sectionHeading">CONFIGURATION</p>
          <div className="sectionLinks">
            <a href="#" className="pageLink">
              <LockIcon />
              <p onClick={handleOpen}>Privacy</p>
              {openPrivacy && (
                <Privacy open={openPrivacy} handleClose={handleClose} />
              )}
            </a>
              <NavLink exact to="/accounts" onClick={handleActive} style={{ textDecoration: "none" }} className="pageLink" activeClassName="active">
                <SupervisorAccountIcon />

                <p>Accounts</p>
            </NavLink>
              <NavLink exact to="/logout" onClick={async () => {
                await axios.get("/accounts/logout");
                localStorage.clear();
              }} style={{ textDecoration: "none" }} className="pageLink" activeClassName="active">
                <ExitToAppIcon />
                <p>Log Out</p>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;