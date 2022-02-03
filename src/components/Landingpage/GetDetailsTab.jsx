import React, { useEffect, useState , useContext } from "react";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@mui/styles";
import DateFnsUtils from "@date-io/date-fns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { Container, Row, Col, Button } from "react-bootstrap";
import { authContext } from "../authprovider/AuthProvider";

const inputStyles = makeStyles({
  inputOutlined: {
    "& .MuiOutlinedInput-input": {
      // height : "30px"
    },

    "& .MuiInputLabel-root": {
      padding: "0 0.5rem",
      background: "#fff",
      fontFamily: "Special Elite cursive",
    },

    "& .MuiOutlinedInput-notchedOutline": {
      top: "0",
      border: "2px solid black",
      borderRadius: "5px",
    },
  },
  selectOutlined: {
    marginTop: "1rem !important",

    "& .MuiOutlinedInput-notchedOutline": {
      top: "0",
      border: "2px solid black",
      borderRadius: "5px",
    },

    "& .MuiInputLabel-root": {
      padding: "0 0.5rem",
      background: "#fff",
      fontFamily: "Special Elite cursive",
    },
  },
});

const GetDetailsTab = (props) => {
  const classes = inputStyles();

  const { auth , handleConnector , loginConnectors } = useContext(authContext);

  const { createImageData, image, setActiveTab, setCreateImageData, setImage } =
    props;

  const createNftImageschema = Yup.object().shape({
    picture: Yup.mixed().required("Image is required"),
    name: Yup.string().required("Name is required"),
    dob: Yup.date().required("Required").nullable(),
    gender: Yup.string().required("Required"),
  });

  const handleChange = (newValue) => {
    const formattedDate = formatDate(newValue);
    setCreateImageData({
      ...createImageData,
      dob: newValue,
      formattedDob: formattedDate,
    });
  };

  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };

  const handleImageChange = (event) => {
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      setImage({
        ...image,
        file: file,
        preview_image: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleGenderChange = (value) => {
    setCreateImageData({
      ...createImageData,
      gender: value,
    });
  };

  const handleInputChange = (event) => {
    setCreateImageData({
      ...createImageData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (values) => {
    if(auth.authStatus){
      setActiveTab(1);
    }else{
      handleConnector(loginConnectors.find(connector => connector.name === "MetaMask").connectorFunction)
    }
  };

  const deleteImage = () => {
    setImage({
      ...image,
      file: "",
      preview_image: "",
    });
  };

  useEffect(() => {
    setCreateImageData({
      ...createImageData,
      name: "",
      dob: "",
      gender: "",
      formattedDob: null,
    });
    setImage({
      file: "",
      preview_image: "",
    });
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          picture: image.file,
          name: createImageData.name,
          gender: createImageData.gender,
          dob: createImageData.dob,
        }}
        className="w-100"
        validationSchema={createNftImageschema}
        onSubmit={(values) => handleSubmit(values)}
        enableReinitialize
      >
        {({ errors, touched, setFieldValue, values, formikBag }) => (
          <Form
            noValidate
            autoComplete="off"
            sx={{ width: "80%", margin: "auto" }}
          >
            <div className="custom-file-btn-wrapper text-center">
              <input
                id="fileSelect"
                type="file"
                name="picture"
                accept="images/*"
                onChange={(event) => handleImageChange(event)}
              />
              <button className="btn btn-primary upload-btn" type="button">
                {image.file == "" ? (
                  <>
                    {" "}
                    <i className="fa-solid fa-arrow-up-from-bracket pe-3"></i>
                    Upload images
                  </>
                ) : (
                  <div className="image-selected-wrapper">
                    <span>{image.file.name} | </span>
                    <span onClick={() => deleteImage()}>
                      <i className="far fa-trash-alt"></i> Delete
                    </span>
                  </div>
                )}
              </button>
            </div>
            <ErrorMessage
              name="picture"
              component="div"
              className="invalid-message"
            />
            <Field name="name">
              {({ field }) => (
                <div>
                  <TextField
                    id="name"
                    label="Name"
                    fullWidth
                    name="name"
                    margin="normal"
                    variant="standard"
                    className={classes.inputOutlined}
                    error={touched.name && errors.name && Boolean(errors.name)}
                    {...field}
                    onChange={(event) => handleInputChange(event)}
                  />
                </div>
              )}
            </Field>
            <ErrorMessage
              name="name"
              component="div"
              className="invalid-message"
            />
            <Field name="dob">
              {({ field }) => (
                <LocalizationProvider dateAdapter={DateFnsUtils}>
                  <MobileDatePicker
                    type="date"
                    label="DOB"
                    inputFormat="dd/MM/yyyy"
                    value={createImageData.dob}
                    onChange={handleChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        variant="standard"
                        className={classes.inputOutlined}
                        error={touched.dob && errors.dob && Boolean(errors.dob)}
                        {...field}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            </Field>
            <ErrorMessage
              name="dob"
              component="div"
              className="invalid-message"
            />
            <Field name="gender">
              {({ field }) => (
                <FormControl fullWidth className={classes.selectOutlined}>
                  <InputLabel
                    id="demo-simple-select-label"
                    error={
                      touched.gender && errors.gender && Boolean(errors.gender)
                    }
                  >
                    Gender
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Gender"
                    error={
                      touched.gender && errors.gender && Boolean(errors.gender)
                    }
                    {...field}
                    onChange={(event) => handleGenderChange(event.target.value)}
                  >
                    <MenuItem value={"male"}>Male</MenuItem>
                    <MenuItem value={"female"}>Female</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Field>
            <ErrorMessage
              name="gender"
              component="div"
              className="mt-2 invalid-message"
            />
            <div className="submit-form">
              <Button
                variant="primary"
                className="btn-service sub-btn"
                type="submit"
              >
                {auth.authStatus ? "Submit" : auth.loading ? "Connecting.." : "Connect wallet"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default GetDetailsTab;
