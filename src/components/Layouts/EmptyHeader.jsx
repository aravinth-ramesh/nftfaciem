import React, { useState } from "react";
import { Container, Nav, Navbar} from "react-bootstrap";
import AccountBalanceWalletOutlinedIcon from "@material-ui/icons/AccountBalanceWallet";
import Sidebar from "./Sidebar";

const EmptyHeader = () => {

  const [mobileMenu, setMobileMobileMenu] = useState(false);

  const [sidebarState, setSidebarState] = useState(false);

  const toggleDrawer = (status) => {
    setSidebarState(status);
    setMobileMobileMenu(false);
  };

  return (
    <>
      <div className="header">
        <Container>
          <Navbar expand="lg">
            <Navbar.Brand href="#home" className="text-white">
              <img src={window.location.origin + "/assets/images/logo.png"} alt="" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav">
              <img
                src={window.location.origin + "/assets/images/menu-toogle.svg"}
                alt=""
              />
            </Navbar.Toggle>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                {/* <Nav.Link href="#home" className="nav-style">
                  Features
                </Nav.Link>
                <Nav.Link href="#link" className="nav-style">
                  Pricing
                </Nav.Link> */}
                <Nav.Link href="#howitworks" className="nav-btn">
                  Watch how it works
                </Nav.Link>
                <a
                  onClick={() => toggleDrawer(!sidebarState)}
                  className="nav-style wallet-icon"
                >
                  <AccountBalanceWalletOutlinedIcon />
                </a>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Container>
      </div>
      <Sidebar toggleDrawer={toggleDrawer} sidebarState={sidebarState} />
    </>
  );
};

export default EmptyHeader;
