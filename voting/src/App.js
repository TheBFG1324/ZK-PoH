import {
  ChakraProvider,
  extendTheme,
  Box,
  VStack,
  Text,
  Button,
  Spinner,
  Container,
  Progress,
  Code,
} from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './style.css'; // Include custom neuron background CSS
import 'particles.js';
// Import the fetchProofs function from its module.
import fetchProofs from './api/API'; // Adjust the path as needed

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'white',
        color: '#1a202c',
        fontFamily: 'Inter, sans-serif',
        margin: 0,
        padding: 0,
      },
    },
  },
});

const MotionText = motion(Text);

const Card = ({ children }) => (
  <Box
    bg="white"
    borderRadius="2xl"
    boxShadow="2xl"
    p={10}
    maxW="lg"
    w="full"
    textAlign="center"
    zIndex={1}
  >
    {children}
  </Box>
);

function Background() {
  useEffect(() => {
    window.particlesJS.load('particles-js', '/particles.json', function () {
      console.log('particles.js config loaded');
    });
  }, []);

  return (
    <div
      id="particles-js"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
}

function PageWrapper({ children }) {
  return (
    <Container
      centerContent
      h="100vh"
      display="flex"
      justifyContent="center"
      position="relative"
      zIndex={1}
    >
      <Background />
      {children}
    </Container>
  );
}

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [retryAuth, setRetryAuth] = useState(false);

  useEffect(() => {
    if (location.state?.retry) setRetryAuth(true);
  }, [location]);

  return (
    <PageWrapper>
      <Card>
        <VStack spacing={6}>
          <Text fontSize="2xl" fontWeight="semibold">
            Should AI systems be granted voting rights?
          </Text>
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => navigate('/loading', { state: { retry: retryAuth } })}
          >
            Vote Now
          </Button>
        </VStack>
      </Card>
    </PageWrapper>
  );
}

function LoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('loading');
  const [userAddress, setUserAddress] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setUserAddress(accounts[0]);
          const hasPoH = location.state?.retry ? true : false;
          setStatus(hasPoH ? 'canVote' : 'notHuman');
        } catch {
          setStatus('failed');
        }
      } else {
        setStatus('failed');
      }
    };

    setTimeout(connectWallet, 1500);
  }, [location]);

  return (
    <PageWrapper>
      <Card>
        {status === 'loading' && (
          <VStack spacing={4}>
            <Spinner size="xl" thickness="4px" speed="0.65s" />
            <Text fontSize="lg">Connecting to MetaMask...</Text>
          </VStack>
        )}

        {status === 'notHuman' && (
          <VStack spacing={4}>
            <Text fontSize="lg" fontWeight="bold">
              You must be a verifiable human to vote.
            </Text>
            <Text fontSize="sm" color="gray.500">
              Address: {userAddress}
            </Text>
            <Button colorScheme="blue" onClick={() => navigate('/verifying', { state: { address: userAddress } })}>
              Try Again
            </Button>
          </VStack>
        )}

        {status === 'canVote' && (
          <VStack spacing={6}>
            <Text fontSize="lg" fontWeight="bold">
              You are verified. Please vote below.
            </Text>
            <Text fontSize="2xl" fontWeight="semibold">
            Should AI systems be granted voting rights?
            </Text>
            <VoteButtons />
          </VStack>
        )}

        {status === 'failed' && (
          <VStack spacing={4}>
            <Text fontSize="lg" color="red.500">
              Waiting for MetaMask Connection...
            </Text>
            <Button onClick={() => navigate('/')}>Return Home</Button>
          </VStack>
        )}
      </Card>
    </PageWrapper>
  );
}

function VerifyingPage() {
  const navigate = useNavigate();
  // State to hold the fetched proofs.
  const [proofs, setProofs] = useState([]);
  // State to track the current index being shown.
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch proofs from the external function when the component mounts.
  useEffect(() => {
    fetchProofs().then((fetchedProofs) => {
      console.log("HERE")
      console.log(fetchProofs)
      setProofs(fetchedProofs);
    });
  }, []);

  // Use an interval to iterate through the proofs.
  useEffect(() => {
    if (proofs.length === 0) return; // Wait until proofs are fetched.
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= proofs.length - 1) {
          clearInterval(interval);
          setTimeout(() => navigate('/loading', { state: { retry: true } }), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [proofs, navigate]);

  const currentProof = proofs[currentIndex];

  return (
    <PageWrapper>
      <Card>
        <VStack spacing={4} w="full" alignItems="flex-start">
          <Text fontSize="xl" fontWeight="bold" alignSelf="center">
            Verifying Proof...
          </Text>
          <Text fontSize="sm" color="gray.500">
            Verifying {proofs.length ? currentIndex + 1 : 0} of {proofs.length} Proofs
          </Text>
          <Progress
            value={proofs.length ? ((currentIndex + 1) / proofs.length) * 100 : 0}
            size="sm"
            colorScheme="blue"
            w="full"
            borderRadius="md"
          />
          <Box
            bg="gray.100"
            p={4}
            borderRadius="md"
            w="full"
            overflowY="auto"
            maxH="300px"
            border="1px solid #CBD5E0"
            textAlign="left"
          >
            <Code fontSize="xs" whiteSpace="pre-wrap" wordBreak="break-word">
              {currentProof ? JSON.stringify(currentProof, null, 2) : 'Loading...'}
            </Code>
          </Box>
        </VStack>
      </Card>
    </PageWrapper>
  );
}

function VoteButtons() {
  const navigate = useNavigate();
  const handleVote = (vote) => navigate('/thank-you', { state: { vote } });

  return (
    <VStack spacing={4} w="full">
      <Button colorScheme="green" size="lg" w="full" onClick={() => handleVote('Yes')}>
        Yes
      </Button>
      <Button colorScheme="red" size="lg" w="full" onClick={() => handleVote('No')}>
        No
      </Button>
    </VStack>
  );
}

function ThankYouPage() {
  const location = useLocation();
  const vote = location.state?.vote;

  return (
    <PageWrapper>
      <Card>
        <VStack spacing={6}>
          <Text fontSize="3xl" fontWeight="bold">
            Thank You
          </Text>
          {vote && (
            <MotionText
              fontSize="xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              You voted: <strong>{vote}</strong>
            </MotionText>
          )}
        </VStack>
      </Card>
    </PageWrapper>
  );
}

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/verifying" element={<VerifyingPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}
