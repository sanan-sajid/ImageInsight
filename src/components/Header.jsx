import { Heading, Image, Text } from "@chakra-ui/react";
// import logo from "../assets/light-bulb.svg";

const Header = () => {
  return (
    <>
      {/* <Image src={logo} alt="logo" width={100} marginBottom="1rem" /> */}
      <Heading color="white" marginBottom="1rem">
        Image To Text Converter
      </Heading>
      <Text fontSize={25} textAlign="center">
        Insert your image Below and we'll extract the text for you.
      </Text>
    </>
  );
};

export default Header;
