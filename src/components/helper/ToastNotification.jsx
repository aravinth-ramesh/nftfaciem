import React from "react";
import {
  NOTIFICATION_TYPE_SUCCESS,
  NOTIFICATION_TYPE_INFO,
  NOTIFICATION_TYPE_ERROR,
} from "react-redux-notify";

import { toast } from 'react-toastify';

export const getSuccessNotificationMessage = (message) => {
  return (
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      pauseOnHover : false
      })
  )
};

export const getErrorNotificationMessage = (message) => {
  return (
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      pauseOnHover : false,
      })
  )
};
