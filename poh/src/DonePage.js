import { Container, VStack, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function DonePage() {
  const navigate = useNavigate();

  return (
    <Container centerContent height="100vh" display="flex" justifyContent="center">
      <VStack spacing={6} p={8} bg="gray.800" color="white" borderRadius="lg" boxShadow="lg">
        <Text fontSize="2xl">✅ Done!</Text>
        <Text fontSize="lg">Your credentials have been successfully generated.</Text>
        <Button colorScheme="blue" onClick={() => navigate("/")}>Go Home</Button>
      </VStack>
    </Container>
  );
}

export default DonePage;
