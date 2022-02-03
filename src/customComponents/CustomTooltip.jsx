import React, {useRef } from "react";
import { useTheme, makeStyles, withStyles } from "@mui/styles";
import Tooltip from "@material-ui/core/Tooltip";

const arrowGenerator = (arrowColor, shadowColor) => ({
  '&[x-placement*="bottom"] $arrow': {
    top: "-6px",
    left: "50%",
    transform :" translateX(-50%)",
    width: "16px",
    height: "8px",
    "&::before": {
      left: 0,
      right: 0,
      top: "1px",
      margin: "0 auto",
      borderWidth: "0 6px 6px 6px",
      borderColor: `transparent transparent ${arrowColor} transparent`,
    },
    "&::after": {
      left: 0,
      right: 0,
      top: 0,
      margin: "0 auto",
      borderWidth: "0 6px 6px 6px",
      borderColor: `transparent transparent ${shadowColor} transparent`,
    },
  },
  '&[x-placement*="top"] $arrow': {
    bottom: "-6px",
    left: "50%",
    transform :" translateX(-50%)",
    width: "16px",
    height: "8px",
    "&::before": {
      left: 0,
      right: 0,
      bottom: "1px",
      margin: "0 auto",
      borderWidth: "6px 6px 0 6px",
      borderColor: `${arrowColor} transparent transparent transparent`,
    },
    "&::after": {
      left: 0,
      right: 0,
      bottom: 0,
      margin: "0 auto",
      borderWidth: "6px 6px 0 6px",
      borderColor: `${shadowColor} transparent transparent transparent`,
    },
  },
  '&[x-placement*="right"] $arrow': {
    left: "-6px",
    width: "8px",
    height: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    "&::before": {
      top: 0,
      bottom: 0,
      left: "1px",
      margin: "auto 0",
      borderWidth: "6px 6px 6px 0",
      borderColor: `transparent ${arrowColor} transparent ${arrowColor}`,
    },
    "&::after": {
      top: 0,
      bottom: 0,
      left: 0,
      margin: "auto 0",
      borderWidth: "6px 6px 6px 0",
      borderColor: `transparent ${shadowColor} transparent ${shadowColor}`,
    },
  },
  '&[x-placement*="left"] $arrow': {
    right: "-6px",
    top: "50%",
    width: "8px",
    height: "16px",
    transform: "translateY(-50%)",
    "&::before": {
      top: 0,
      bottom: 0,
      right: "1px",
      margin: "auto 0",
      borderWidth: "6px 0 6px 6px",
      borderColor: `transparent ${arrowColor} transparent ${arrowColor}`,
    },
    "&::after": {
      top: 0,
      bottom: 0,
      right: 0,
      margin: "auto 0",
      borderWidth: "6px 0 6px 6px",
      borderColor: `transparent ${shadowColor} transparent ${shadowColor}`,
    },
  },
});

const styles = (theme) => ({
  arrow: {
    position: "absolute",
    fontSize: 6,
    "&::before": {
      borderStyle: "solid",
      content: '""',
      display: "block",
      width: 0,
      height: 0,
      position: "absolute",
    },
    "&::after": {
      borderStyle: "solid",
      content: '""',
      display: "block",
      width: 0,
      height: 0,
      position: "absolute",
      zIndex: -1,
    },
  },
  arrowPopper: arrowGenerator("rgba(4, 17, 29, 1)", "rgba(4, 17, 29, 1)"),
  lightTooltip: {
    backgroundColor: "#000000",
    boxShadow:"none",
    color: "#fff",
    fontSize: "1.15em",
    fontWeight:"600",
    position: "relative",
    padding: "0.5em 1em",
    borderRadius : "0.75em",
  },
});

const CustomTooltip = (props) => {
  const arrowRef = useRef(null);
  const { children, classes, title, placement } = props;

  return (
    <>
      <Tooltip
        placement={placement}
        title={
          <>
            {title}
            <span className={classes.arrow} ref={arrowRef} />
          </>
        }
        classes={{ tooltip: classes.lightTooltip, popper: classes.arrowPopper }}
        PopperProps={{
          popperOptions: {
            modifiers: {
              arrow: {
                enabled: true,
                element: arrowRef.current,
              },
            },
          },
        }}
      >
        {children}
      </Tooltip>
    </>
  );
};

export default withStyles(styles)(CustomTooltip);
