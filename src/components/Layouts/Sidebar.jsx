import React, { useContext, useState, useEffect } from "react";
import { connect } from "react-redux";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/SwipeableDrawer";
import { makeStyles, withStyles } from "@mui/styles";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { Link } from "react-router-dom";
import { authContext } from "../../components/authprovider/AuthProvider";
import { Spinner } from "react-bootstrap";
import CustomTooltip from "../../customComponents/CustomTooltip";

const sideBarStyles = makeStyles({
  root: {},
  drawer: {
    flexShrink: 0,
    zIndex: "999 !important",
  },
  drawerPaper: {
    paddingTop: (props) => (`${props.sidebarWidth < 576 ? "67px" : "87px"} !important`),
    minWidth: (props) => (`${props.sidebarWidth < 576 ? "100vw" : "400px"} !important`),
    maxWidth: (props) => (`${props.sidebarWidth < 576 ? "100vw" : "420px"} !important`),
    overflow: "visible",
    visibility: "visible !important",
    height: "100% !important",
  },
});

const walletOptions = [
  {
    name: "MetaMask",
    logo: "/assets/images/metamask-fox.svg",
    is_popular: true,
  },
  {
    name: "Wallet Connect",
    logo: "/assets/images/wallet-img/wallet-connect (1).png",
    is_popular: false,
  },
];

const Sidebar = (props) => {
  const [sideBarWidth, setSideBarWidth] = useState(window.innerWidth);

  const classes = sideBarStyles({ sidebarWidth: sideBarWidth });

  const { auth, connectWallet, hanldeLogout, supportedChains, context } = useContext(authContext);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    setSideBarWidth(window.innerWidth);
  };

  return (
    <>
      <div>
        <Box
          role="presentation"
          // onClick={props.toggleDrawer(false)}
          // onKeyDown={props.toggleDrawer(false)}
          className={classes.root}
        >
          <Drawer
            anchor={"right"}
            open={props.sidebarState}
            //onOpen={props.toggleDrawer(true)}
            className={classes.drawer}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{ onClose: () => props.toggleDrawer(false) }}
            // onClose={() => props.toggleDrawer(false)}
            disableSwipeToOpen={true}
          >
            {auth.authStatus ? (
              <DrawerAfterLogin
                auth={auth}
                hanldeLogout={hanldeLogout}
                {...props}
                supportedChains={supportedChains}
                context={context}
              />
            ) : (
              <DrawerBeforeLogin auth={auth} connectWallet={connectWallet} />
            )}
          </Drawer>
        </Box>
      </div>
    </>
  );
};

const mapStateToPros = (state) => ({
  // profile: state.users.profile,
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToPros, mapDispatchToProps)(Sidebar);

const DrawerBeforeLogin = ({ auth, connectWallet }) => {
  const { loginConnectors, handleConnector, activatingConnector, context } = useContext(authContext);

  return (
    <>
      <div className="drawer-before-login-info-wrapper">
        <div className="info">
          <AccountCircleOutlinedIcon />
          My Wallet
        </div>
      </div>
      <div className="wallet-options-wrapper">
        <h6 className="wallet-option-tooltip">
          Connect with one of our available{" "}
          <strong>
            Wallet <InfoOutlinedIcon />
            <div className="custom-tooltip">
              A crypto wallet is an application or hardware device that allows
              individuals to store and retrieve digital items.
              <Link to="/learn-more">Learn More</Link>
            </div>
          </strong>
          providers or create a new one.
        </h6>
        <div
          className={`wallet-options ${activatingConnector != undefined ? "connecting-wallet" : ""
            }`}
        >
          {loginConnectors.map((connectors, index) => (
            <div
              className="wallet"
              key={index}
              onClick={() => handleConnector(connectors.connectorFunction)}
            >
              <img src={window.location.origin + connectors.logo} alt="" />
              <h6 className="wallet-name">{connectors.name}</h6>
              <div className="wallet-info">
                {connectors.is_popular && <p>Popular</p>}
                {activatingConnector === connectors.connectorFunction && (
                  <Spinner animation="border" role="status" size="sm"></Spinner>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const DrawerAfterLogin = ({ auth, hanldeLogout, supportedChains, context }) => {
  return (
    <>
      <div className="after-login-drawer">
        <div className="info">
          <div className="user-wallet">
            {auth.authStatus ? (
              <>
                {auth.userPicture != null && (
                  <div className="account-image">
                    <img src={auth.userPicture} alt="" />
                  </div>
                )}
              </>
            ) : (
              <AccountCircleOutlinedIcon />
            )}
            My Wallet
          </div>
          <div className="wallet-address">
            {/* <CustomTooltip placeholder={"copy"} title={"0x6f73...65ba"} /> */}
            <CustomTooltip title="copy" placement="top">
              <a href="#">
                <h5 className="mb-0">
                  {auth.accounts.substr(0, 5)}...
                  {auth.accounts.substr(auth.accounts.length - 4)}
                </h5>
              </a>
            </CustomTooltip>
          </div>
        </div>
        <div className="walet-balance">
          <div className="wallet-balance-wrapper">
            <h6>Account Balance</h6>
            <p>{auth.ethBalance} {context.chainId && supportedChains.find(supportedChains => supportedChains.chainId == context.chainId).symbol}</p>
          </div>
        </div>
        <div className="text-center">
          <button
            onClick={() => hanldeLogout()}
            className="btn-service sub-btn btn btn-primary"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};
