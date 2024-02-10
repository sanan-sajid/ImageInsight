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
} from "@chakra-ui/react";

const KeywordsModal = ({
  keywords,
  loading,
  isOpen,
  closeModal,
  imageData,
}) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent maxW="800px">
          <ModalHeader>Keywords</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" alignItems="center">
            {loading ? (
              <CircularProgress isIndeterminate color="blue.300" />
            ) : (
              <Flex>
                {imageData && (
                  <Image src={imageData} alt="Uploaded" maxH="300px" mr={4} />
                )}
                <Text>{keywords}</Text>
              </Flex>
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
