import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Container, Box } from "@chakra-ui/react";
import Header from "./components/Header";
import { Button, Input } from "@chakra-ui/react";
import KeywordsModal from "./components/KeywordsModal";
import imageCompression from "browser-image-compression";
import Footer from "./components/Footer";

function App() {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const [data, setData] = useState(undefined);
  const [photoURL, setPhotoURL] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  async function fetchDataFromGeminiProVisionAPI(compressedFile) {
    try {
      if (!inputText) {
        setInputText("Explain this image in around 50 words");
      }

      setLoading(true);
      setIsOpen(true);
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const imageParts = await Promise.all([
        fileToGenerativePart(compressedFile),
      ]);
      const nonImageFiles = imageParts.filter(
        (part) => !part.inlineData.mimeType.startsWith("image/")
      );
      if (nonImageFiles.length > 0) {
        toast.error("Please upload only image files!");
        setLoading(false);
        return;
      }

      const imageDataURLs = imageParts.map((part) => part.inlineData.data);
      setImageData(imageDataURLs);
      const photoDataURL = URL.createObjectURL(compressedFile);
      setPhotoURL(photoDataURL);

      const result = await model.generateContent([inputText, ...imageParts]);
      const text = result.response.text();

      setLoading(false);
      setData(text);
      setInputText("");
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      console.error("fetchDataFromGeminiAPI error: ", error);
    }
  }

  async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  const closeModal = () => {
    setIsOpen(false);
  };

  async function handleImageUpload(event) {
    try {
      setImageFile(event.target.files[0]);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleButtonClick() {
    try {
      if (!imageFile) {
        toast.error("Please select an image!");
        return;
      }

      if (!inputText) {
        toast.info("Generating text about the picture in 50 words...");
        setInputText("Explain this image in around 50 words");
      }

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(imageFile, options);
      fetchDataFromGeminiProVisionAPI(compressedFile);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Box bg="gray.800" color="white" height="100vh" paddingTop={130}>
        <Container maxW="3xl" centerContent>
          <Header></Header>
          <div className="card">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e)}
            ></input>
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Explain this image in around 50 words"
              variant="filled"
              marginBottom={4}
              color="black"
              bg="blue.700"
              focusBackgroundColor="blue.700"
              style={{ color: "white" }}
            />
            <Button
              bg="blue.500"
              color="black"
              marginTop={4}
              width="100%"
              _hover={{ bg: "blue.700" }}
              disabled={loading}
              onClick={handleButtonClick}
            >
              {loading ? "Loading..." : "Extract Text"}
            </Button>
            <hr />
          </div>
          <KeywordsModal
            keywords={data}
            loading={loading}
            isOpen={isOpen}
            closeModal={closeModal}
            imageData={photoURL}
          />
          <Footer />
          <ToastContainer />
        </Container>
      </Box>
    </>
  );
}

export default App;
