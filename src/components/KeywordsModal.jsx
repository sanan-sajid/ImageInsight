import {
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  CircularProgress,
  Image,
  Flex,
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
        <ModalContent maxW="800px">
          <ModalHeader>Keywords</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            alignItems="center"
            flexDirection={isLargerThan768 ? "row" : "column"}
          >
            {loading ? (
              <CircularProgress isIndeterminate color="blue.300" />
            ) : (
              <Box>
                {imageData && (
                  <Image
                    src={imageData}
                    alt="Uploaded"
                    maxH={isLargerThan768 ? "300px" : "auto"}
                    mb={isLargerThan768 ? 0 : 4}
                  />
                )}
                <Text>{keywords}</Text>
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
