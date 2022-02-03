import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import EmptyFooter from "../Layouts/EmptyFooter";
import EmptyHeader from "../Layouts/EmptyHeader";
import Cartoonizer from "./Cartoonizer";
import GetDetailsTab from "./GetDetailsTab";
import PreviewTab from "./PreviewTab";
import AvatarNFT from "../../abis/AvatarNFT.json";
import { apiConstants } from "../Constant/constants";
import { authContext } from "../../components/authprovider/AuthProvider";
import Web3 from "web3";

//Declare IPFS
const authentication = 'Basic' + Buffer.from(apiConstants.ipfs_project_id + ':' + apiConstants.ipfs_project_secret).toString('base64');
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: authentication
  }
}); // leaving out the arguments will default to these values

const ipfsJson = require("nano-ipfs-store").at("https://ipfs.infura.io:5001");

const LandingPageIndex = (props) => {
  const { auth, connectWallet, hanldeLogout, supportedChains, context } = useContext(authContext);

  const [createImageData, setCreateImageData] = useState({
    name: "",
    dob: "",
    gender: "",
    formattedDob: null
  });

  const [image, setImage] = useState({
    file: "",
    preview_image: "",
  });

  const [activeTab, setActiveTab] = useState(0);

  const [avatarNFT, setAvatarNFT] = useState(null);

  const [mintButtonContent, setMintButtonContent] = useState("");

  const [cartoonImageBase64, setCartoonImageBase64] = useState("");

  useEffect(() => {
    if(auth.authStatus && !auth.loading){
      saveAvatarNFT(); 
    }
  }, [auth.loading, auth.accounts , auth.authStatus]);

  const saveAvatarNFT = async () => {
    // const web3 = window.ethereum;
    const web3 = new Web3(window.ethereum);

    try {
      // Network ID
      const networkId = await web3.eth.net.getId();
      const networkData = AvatarNFT.networks[networkId];
      if (networkData) {
        const avatarNFT = new web3.eth.Contract(AvatarNFT.abi, networkData.address);
        setAvatarNFT(avatarNFT);
      } else {
        window.alert("Contract not deployed to detected network.");
      }
    } catch (error) {
      console.log("error", error)
      window.alert("Error occuried, Refresh the page");
    }
  };

  const convertDataURIToBinaryFF = (dataURI) => {
    var BASE64_MARKER = ";base64,";
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var raw = window.atob(dataURI.substring(base64Index));
    return Uint8Array.from(
      Array.prototype.map.call(raw, function (x) {
        return x.charCodeAt(0);
      })
    );
  };

  // Generate metadata json file. 
  const generateJson = async (data) => {
    const metadata = JSON.stringify({
      description: data.description,
      external_url: "https://nftfaciem.com",
      image: "https://ipfs.infura.io/ipfs/" + data.imageHash,
      name: data.name,
      text: data.allWords,
      attributes: [
        data.name != "" ?
          {
            "trait_type": "Name",
            "value": data.name
          } : "",
        {
          "trait_type": "DOB",
          "value": data.dob
        },
        {
          "trait_type": "Gender",
          "value": data.gender
        },
      ]
    })
    console.log("Json", metadata);
    return metadata;
  }

  const mintYourNFT = async (event) => {
    event.preventDefault();

    setMintButtonContent("Initiated...");
    if (avatarNFT != null) {

      try {
        setMintButtonContent((prevState) => "Connecting to Blockchain");

        let imageData = await convertDataURIToBinaryFF(cartoonImageBase64);

        imageData = Buffer(imageData);

        let allWords = createImageData.name + " " + createImageData.gender + " " + createImageData.dob;

        //adding file to the IPFS

        ipfs.add(imageData, async (error, result) => {
          console.log("Ipfs result", result);
          if (error) {
            console.error(error);
            return;
          }

          const json = generateJson({
            name: createImageData.name, description: createImageData.description, imageHash: result[0].hash,
            name: createImageData.name, dob: createImageData.formattedDob, gender: createImageData.gender,
            allWords: allWords
          }).then(async (val) => {
            try {
              const cid = await ipfsJson.add(val);
              const tokenURIHash = await ipfsJson.cat(cid);
              console.log("cid", cid);
              console.log("minter address", auth.accounts);
              console.log("all words", allWords);
              avatarNFT.methods
                .publicMinting(auth.accounts, "https://ipfs.infura.io/ipfs/" + cid, allWords)
                .send({ from: auth.accounts, value: window.web3.utils.toWei("0.001", "Ether") })
                .on("error", (error) => {
                  let notificationMessage;
                  if (error.message == undefined) {
                    notificationMessage = (
                      "Same Wallet can't have more than 1 NFT! Use different wallet address"
                    );
                  } else {
                    notificationMessage = (
                      error.message
                    );
                  }

                  setMintButtonContent("");
                })
                .once("receipt", (receipt) => {
                  console.log("rece", receipt);

                  setMintButtonContent("");
                });
            } catch (error) {
              console.log("Error", error);
              const notificationMessage = (
                "Invalid wallet address"
              );

              setMintButtonContent("");
            }
          });
        });

      } catch (error) {
        setMintButtonContent("");
        const notificationMessage = (
          "Something went wrong. Please refresh the page and try again."
        );
      }
    } else {
      setMintButtonContent("");
      const notificationMessage = (
        "Something went wrong. Please refresh the page and try again."
      );
    }
  }



  const handleActiveTab = (value) => {
    switch (value) {
      case 0:
        return (
          <GetDetailsTab
            image={image}
            createImageData={createImageData}
            setCreateImageData={setCreateImageData}
            setImage={setImage}
            setActiveTab={setActiveTab}
          />
        );

      case 1:
        return (
          <PreviewTab
            createImageData={createImageData}
            image={image}
            setActiveTab={setActiveTab}
          />
        );

      case 2:
        return (
          <Cartoonizer createImageData={createImageData} image={image.preview_image} setActiveTab={setActiveTab} mintYourNFT={mintYourNFT} setCartoonImageBase64={setCartoonImageBase64} mintButtonContent={mintButtonContent} />
        );

      default:
        return (
          <GetDetailsTab
            image={image}
            createImageData={createImageData}
            setCreateImageData={setCreateImageData}
            setImage={setImage}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <>
      <EmptyHeader />
      <div className="banner-sec">
        <div className="img-overlay"></div>
        <img
          src={window.location.origin + "/assets/images/Banner.png"}
          alt=""
        />
        <div className="banner-content text-center">
          <h2>Web3 Login</h2>
          <p>
            An adept platform that easily and quickly converts your image into an animated Avatar. Don't worry about complex passwords anymore just use Web3 Login's Avatars and login to your social media handles and other platforms. Mint your NFT now for FREE.
          </p>
        </div>
      </div>
      <div className="service-sec">
        <Container>
          <Row className="g-0 align-items-center">
            <Col md={3} className="img-align">
              <img
                src={window.location.origin + "/assets/images/image-1.png"}
                alt=""
                className="service-img"
              />
            </Col>
            <Col md={6}>
              <div className="service-details custom-border">
                {handleActiveTab(activeTab)}
              </div>
            </Col>
            <Col md={3} className="text-end img-align">
              <img
                src={window.location.origin + "/assets/images/image-2.png"}
                alt=""
                className="service-img"
              />
            </Col>
          </Row>
        </Container>
      </div>
      <div className="generate-sec" id="howitworks">
        <Container>
          <div className="generate-heading text-center">
            <h2>
              Web3 Login provides free NFT Avatars and you can try them out. Learn how to mint your free NFT Avatar today.
            </h2>
          </div>
          <div className="generate-image">
            <h3 className="text-center">
              <i className="fa-solid fa-circle-play pe-3"></i>
              Watch how it works
            </h3>
            <img
              src={window.location.origin + "/assets/images/GIF-for-NFT.gif"}
              alt=""
            />
          </div>
        </Container>
      </div>
      <EmptyFooter />
    </>
  );
};

export default LandingPageIndex;