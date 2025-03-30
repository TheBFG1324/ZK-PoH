import { useNavigate } from "react-router-dom";
import { Container, VStack, Text, Button } from "@chakra-ui/react";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleYes = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/loading");
    }, 2000);
  };

  return (
    <Container centerContent height="100vh" display="flex" justifyContent="center">
      <VStack spacing={6} p={8} bg="gray.800" color="white" borderRadius="lg" boxShadow="lg">
        <Text fontSize="xl">Do you have any credentials?</Text>
        {loading ? (
          <Text fontSize="lg">Loading...</Text>
        ) : (
          <>
            <Button colorScheme="green" onClick={handleYes}>Yes</Button>
            <Button colorScheme="red" onClick={() => navigate("/credential")}>No</Button>
          </>
        )}
      </VStack>
    </Container>
  );
}

export default Home;
