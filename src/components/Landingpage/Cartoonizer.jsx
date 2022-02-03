import React, { useEffect, useState } from "react";
import {
  CartoonWorkerManager,
  generateCartoonDefaultConfig,
  generateDefaultCartoonParams,
} from "@dannadori/white-box-cartoonization-worker-js";
import { Spinner } from "react-bootstrap";

const Cartoonizer = (props) => {
  const { setActiveTab , createImageData} = props;

  const [cartoonImage, setCartoonImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    const manager = new CartoonWorkerManager();
    const config = generateCartoonDefaultConfig();
    const params = generateDefaultCartoonParams();

    if (props.image) {
      const srcCanvas = document.getElementById("image-canvas");
      const fullresolution = document.getElementById(
        "image-canvas-fullresolution"
      );
      const srcImage = document.createElement("img");
      srcImage.onload = () => {
        manager
          .init(config)
          .then(() => {
            console.log(srcImage.width, srcImage.height);
            var wrh = srcImage.width / srcImage.height;

            var newWidth = srcCanvas.width;
            var newHeight = newWidth / wrh;
            if (newHeight > srcCanvas.height) {
              newHeight = srcCanvas.height;
              newWidth = newHeight * wrh;
            }
            // srcCanvas
            //   .getContext("2d")
            //   .drawImage(srcImage, 0, 0, newWidth, newHeight);
            return manager.predict(srcImage, params);
          })
          .then((res) => {
            // var wrh = res.width / res.height;
            // var newWidth = srcCanvas.width;
            // var newHeight = newWidth / wrh;
            // if (newHeight > srcCanvas.height) {
            //   newHeight = srcCanvas.height;
            //   newWidth = newHeight * wrh;
            // }

            var hRatio = srcCanvas.width / res.width;
            var vRatio = srcCanvas.height / res.height;
            var ratio = Math.min(hRatio, vRatio);
            var centerShift_x = (srcCanvas.width - res.width * ratio) / 2;
            var centerShift_y = (srcCanvas.height - res.height * ratio) / 2;

            srcCanvas
              .getContext("2d")
              .drawImage(
                res,
                0,
                0,
                res.width,
                res.height,
                centerShift_x,
                centerShift_y,
                res.width * ratio,
                res.height * ratio
              );

            fullresolution.width = res.width;
            fullresolution.height = res.height;
            fullresolution
              .getContext("2d")
              .drawImage(res, 0, 0, res.width, res.height);

            fullresolution.toBlob(function (blob) {
              let url = URL.createObjectURL(blob);
              console.log(url);
              setCartoonImage(url);
            });
            props.setCartoonImageBase64(fullresolution.toDataURL());// cartoon image base 64. 
          });
      };
      srcImage.src = props.image;
    }

    return () => {
      CartoonWorkerManager();
      generateCartoonDefaultConfig();
      generateDefaultCartoonParams();
    };
  }, [props.image]);


  const redoHandler = () => {
    setActiveTab(0);
  };

  return (
    <>
      <div className="text-center cartoonizer-wrapper">
        <div className="redo-wrapper" onClick={() => redoHandler()}>
          <i className="fas fa-redo"></i>
        </div>
        <div className="canvas-wrapper">
          <canvas id="image-canvas" width="300" height="300"></canvas>
          {cartoonImage == null && (
            <div className="canvas-loader">
              <Spinner animation="grow" />
            </div>
          )}
        </div>

        <canvas id="image-canvas-fullresolution"></canvas>

        <div className="preview-tab-details">
          <div className="text-center">
            <h6>Name : {createImageData.name}</h6>
            <h6>D.O.B : {createImageData.formattedDob}</h6>
            <h6>Gender : {createImageData.gender}</h6>
          </div>
        </div>

        <div className="download-wrapper">
          <button className="btn-service sub-btn my-3 d-block" onClick={props.mintYourNFT} disabled={cartoonImage != null && props.mintButtonContent == "" ? false : true}>
            {cartoonImage != null && props.mintButtonContent == "" ? "Mint Your NFT" : props.mintButtonContent == "" ? "Loading..." : props.mintButtonContent}

          </button>
          {/* <a
              href={cartoonImage}
              download={cartoonImage}
              className="btn-service sub-btn my-3 d-block"
            >
               {cartoonImage != null ? "Download" : "Loading..." }
            </a> */}
        </div>
      </div>
    </>
  );
};

export default Cartoonizer;
