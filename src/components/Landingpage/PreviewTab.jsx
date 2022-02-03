import React from "react";

const PreviewTab = (props) => {
  const { createImageData, image , setActiveTab } = props;

  const handleGenerate = () => {
    setActiveTab(2)
  }

  return (
    <>
      <div className="preview-tab">
        <div className="image-wrapper">
          <img src={image.preview_image} alt="" />
        </div>
        <div className="preview-tab-details">
          <div className="text-center">
            <h6>Name : {createImageData.name}</h6>
            <h6>D.O.B : {createImageData.formattedDob}</h6>
            <h6>Gender : {createImageData.gender}</h6>
            <button
              variant="primary"
              className="btn-service sub-btn"
              type="button"
              onClick={() => handleGenerate()}
            >
              GENERATE
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewTab;
