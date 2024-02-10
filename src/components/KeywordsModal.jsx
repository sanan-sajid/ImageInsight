import {
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  CircularProgress,
  Image,
  Box,
  useMediaQuery,
} from "@chakra-ui/react";

const KeywordsModal = ({
  keywords,
  loading,
  isOpen,
  closeModal,
  imageData,
}) => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent maxW="800px" backgroundColor="gray.700">
          <ModalCloseButton />
          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection={isLargerThan768 ? "row" : "column"}
          >
            {loading ? (
              <CircularProgress
                isIndeterminate
                color="blue.300"
                marginTop="5rem"
              />
            ) : (
              <Box textAlign="center">
                {imageData && (
                  <Image
                    marginTop="1rem"
                    src={imageData}
                    alt="Uploaded"
                    maxH={isLargerThan768 ? "300px" : "auto"}
                    mb={isLargerThan768 ? 0 : 4}
                    mx="auto"
                  />
                )}
                <Text marginTop="1rem" color="white" fontWeight="bold">
                  {keywords}
                </Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default KeywordsModal;
