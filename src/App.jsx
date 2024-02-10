import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Container, Box } from "@chakra-ui/react";
import Header from "./components/Header";
import { Button } from "@chakra-ui/react";
import KeywordsModal from "./components/KeywordsModal";
import Footer from "./components/Footer";
const options = {
  apiKey: "free", // Get API keys from: www.bytescale.com
  maxFileCount: 1,
};
function App() {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const [data, setData] = useState(undefined);
  const [photoURL, setPhotoURL] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [inputText, setInputText] = useState(
    "Explain this image in around 50 words"
  );
  const [loading, setLoading] = useState(false);

  async function fetchDataFromGeminiProAPI() {
    try {
      // ONLY TEXT
      if (!inputText) {
        toast.error("Please enter text!");
        return;
      }
      setLoading(true);
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(inputText);
      const text = result.response.text();
      setLoading(false);
      setData(text);
    } catch (error) {
      setLoading(false);
      console.error("fetchDataFromGeminiAPI error: ", error);
    }
  }

  async function fetchDataFromGeminiProVisionAPI() {
    try {
      if (!inputText) {
        toast.error("Please enter text!");
        return;
      }

      const fileInputEl = document.querySelector("input[type=file]");
      if (
        !fileInputEl ||
        !fileInputEl.files ||
        fileInputEl.files.length === 0
      ) {
        throw new Error("No file uploaded!"); // Throw an error if no file is uploaded
      }

      setLoading(true);
      setIsOpen(true);
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

      const imageParts = await Promise.all(
        [...fileInputEl.files].map(fileToGenerativePart)
      );
      const nonImageFiles = imageParts.filter(
        (part) => !part.inlineData.mimeType.startsWith("image/")
      );
      if (nonImageFiles.length > 0) {
        toast.error("Please upload only image files!");
        setLoading(false);
        return;
      }

      // Set imageData to the uploaded image
      const imageDataURLs = imageParts.map((part) => part.inlineData.data);
      setImageData(imageDataURLs);
      const photoDataURL = URL.createObjectURL(fileInputEl.files[0]);
      setPhotoURL(photoDataURL);
      const result = await model.generateContent([inputText, ...imageParts]);
      const text = result.response.text();

      setLoading(false);
      setData(text);
    } catch (error) {
      toast.error(error.message); // Display the error message using toast
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

  return (
    <>
      <Box bg="gray.800" color="white" height="100vh" paddingTop={130}>
        <Container maxW="3xl" centerContent>
          <Header></Header>
          <div className="card">
            <input type="file" onChange={(e) => setImageData(e.target.files)} />

            <Button
              bg="blue.500"
              color="white"
              marginTop={4}
              width="100%"
              _hover={{ bg: "blue.700" }}
              disabled={loading}
              onClick={() => fetchDataFromGeminiProVisionAPI()}
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
