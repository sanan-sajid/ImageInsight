import { Heading, Image, Text } from "@chakra-ui/react";

const Header = () => {
  return (
    <>
      {/* <Image src={logo} alt="logo" width={100} marginBottom="1rem" /> */}
      <Heading color="white" marginBottom="3rem" size="3xl">
        Image To Text Converter
      </Heading>
      <Text fontSize={25} textAlign="center" marginBottom="2rem">
        Insert your image Below and we'll extract the text for you.
      </Text>
    </>
  );
};

export default Header;
