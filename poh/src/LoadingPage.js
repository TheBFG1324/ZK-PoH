import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, VStack, Text, Spinner } from "@chakra-ui/react";

function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const isConnected = window.confirm("Do you want to connect to MetaMask?");
      if (isConnected) {
        navigate("/done");
      } else {
        const generateCredential = window.confirm("Do you want to generate a credential?");
        if (generateCredential) {
          navigate("/credential");
        } else {
          navigate("/");
        }
      }
    }, 3000);
  }, [navigate]);

  return (
    <Container centerContent height="100vh" display="flex" justifyContent="center">
      <VStack spacing={6} p={8} bg="gray.800" color="white" borderRadius="lg" boxShadow="lg">
        <Spinner size="xl" />
        <Text fontSize="lg">Loading...</Text>
      </VStack>
    </Container>
  );
}

export default LoadingPage;
