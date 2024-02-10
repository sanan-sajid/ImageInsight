import { Heading, Text } from "@chakra-ui/react";

const Header = () => {
  return (
    <>
      <Heading color="white" marginBottom="3rem" size="3xl">
        ImageInsight
      </Heading>
      <Text fontSize={25} textAlign="center" marginBottom="2rem">
        Convert your images into clear and concise descriptions instantly.
      </Text>
    </>
  );
};

export default Header;
