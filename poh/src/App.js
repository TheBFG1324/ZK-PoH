import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { ChakraProvider, Container , VStack, Text, Button, Code, Spinner, Image, Progress, Box,useColorModeValue,Icon   } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaFingerprint } from "react-icons/fa";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

function Home() {
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(false);

  const cardBg = useColorModeValue("rgba(255, 255, 255, 0.06)", "rgba(255, 255, 255, 0.04)");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const handleGenerateNew = async () => {
    setConnecting(true);
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        navigate("/credential"); // Proceed after connection
      } else {
        alert("MetaMask is not installed.");
      }
    } catch (error) {
      console.error("MetaMask connection failed:", error);
      alert("Connection to MetaMask failed.");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <Box
      height="100vh"
      bgGradient="linear(to-br, #101010, #1c1c1c)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      position="relative"
      zIndex={1}
    >
      <MotionVStack
        spacing={6}
        p={10}
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="xl"
        boxShadow="0 8px 30px rgba(0, 0, 0, 0.4)"
        color="white"
        backdropFilter="blur(18px)"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        _hover={{
          boxShadow: "0 12px 40px rgba(0, 255, 160, 0.1)",
          transform: "scale(1.01)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Box
          bg="linear-gradient(to bottom right, #00ffcc, #0099ff)"
          borderRadius="full"
          boxSize="80px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 0 40px rgba(0, 255, 200, 0.3)"
        >
          <Icon as={FaFingerprint} w={8} h={8} color="blackAlpha.900" />
        </Box>

        <Text fontSize="2xl" fontWeight="semibold" textAlign="center" color="gray.100">
          Biometric Credential Verification
        </Text>

        <Text fontSize="sm" color="gray.400" textAlign="center" maxW="sm">
          Secure access using your biometric signature, protected with SHA-256 and ZK-SNARK proofs.
        </Text>

        <VStack spacing={3} width="100%" pt={2}>
          <Button
            width="100%"
            bgGradient="linear(to-r, teal.400, blue.500)"
            _hover={{
              bgGradient: "linear(to-r, teal.500, blue.600)",
              boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)",
              transform: "scale(1.02)",
            }}
            size="lg"
            onClick={() => navigate("/loading")}
            transition="all 0.2s"
          >
            I Have Credentials
          </Button>

          <Button
            width="100%"
            bg="gray.600"
            _hover={{
              bg: "gray.500",
              transform: "scale(1.02)",
              boxShadow: "0 0 12px rgba(255, 255, 255, 0.1)",
            }}
            size="lg"
            // onClick={handleGenerateNew}
            isLoading={connecting}
            // loadingText="Connecting..."
            onClick={() => navigate("/loading")}

            transition="all 0.2s"
          >
            No, Generate New
          </Button>
        </VStack>
      </MotionVStack>
    </Box>
  );
}



function LoadingPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  const cardBg = useColorModeValue("rgba(255, 255, 255, 0.06)", "rgba(255, 255, 255, 0.04)");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          setStatus("connected");
        } catch (error) {
          setStatus("failed");
        }
      } else {
        setStatus("failed");
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <MotionVStack
      spacing={6}
      p={10}
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow="0 8px 30px rgba(0, 0, 0, 0.4)"
      color="white"
      backdropFilter="blur(18px)"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      _hover={{
        boxShadow: "0 12px 40px rgba(0, 255, 160, 0.1)",
        transform: "scale(1.01)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {status === "loading" && (
        <>
          <Spinner size="xl" />
          <Text fontSize="lg">Loading...</Text>
        </>
      )}
      {status === "failed" && (
        <>
          <Text fontSize="lg">Connection Failed!</Text>
          {/* <Code p={2} borderRadius="md" bg="white.700">✅ MetaMask Not Connected</Code> */}
          <Button
            bg="green.500"
            color="white"
            _hover={{ bg: "green.400" }}
            onClick={() => navigate("/")}
          >
            Go Home
          </Button>
        </>
      )}
      {status === "connected" && (
        <>
          {/* <Text fontSize="lg">MetaMask Connection Failed</Text> */}
          <Text fontSize="lg">Do you want to generate a credential?</Text>
          <Button
            width="100%"
            bgGradient="linear(to-r, teal.400, blue.500)"
            _hover={{
              bgGradient: "linear(to-r, teal.500, blue.600)",
              boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)",
              transform: "scale(1.02)",
            }}
            onClick={() => navigate("/credential")}
          >
            Yes
          </Button>
          <Button
            width="100%"
            bg="gray.600"
            _hover={{
              bg: "gray.500",
              transform: "scale(1.02)",
              boxShadow: "0 0 12px rgba(255, 255, 255, 0.1)",
            }}
            onClick={() => navigate("/")}
          >
            No
          </Button>
        </>
      )}
    </MotionVStack>
  );
}


function CredentialPage() {
  const navigate = useNavigate();
  const [cameraOn, setCameraOn] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const cardBg = useColorModeValue("rgba(255, 255, 255, 0.06)", "rgba(255, 255, 255, 0.04)");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const handleSubmit = () => {
    navigate("/picture-taken");
  };

  useEffect(() => {
    if (cameraOn) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => console.error("Error accessing camera:", error));
    }
  }, [cameraOn]);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setImageSrc(canvas.toDataURL("image/png"));
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
      setCameraOn(false);
    }
  };

  return (
    <MotionVStack
      spacing={6}
      p={10}
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow="0 8px 30px rgba(0, 0, 0, 0.4)"
      color="white"
      backdropFilter="blur(18px)"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      _hover={{
        boxShadow: "0 12px 40px rgba(0, 255, 160, 0.1)",
        transform: "scale(1.01)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Text fontSize="2xl" fontWeight="semibold" textAlign="center" color="gray.100">
        Capture Your Picture for Credential
      </Text>

      {!cameraOn && !imageSrc && (
        <Button
          width="100%"
          bgGradient="linear(to-r, teal.400, blue.500)"
          _hover={{
            bgGradient: "linear(to-r, teal.500, blue.600)",
            boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)",
            transform: "scale(1.02)",
          }}
          size="lg"
          onClick={() => setCameraOn(true)}
          transition="all 0.2s"
        >
          Open Camera
        </Button>
      )}

      {cameraOn && (
        <>
          <video ref={videoRef} autoPlay width="300" height="200" />
          <canvas ref={canvasRef} width="300" height="200" style={{ display: "none" }} />
          <Button
            width="100%"
            colorScheme="blue"
            size="lg"
            onClick={capturePhoto}
          >
            Take Picture
          </Button>
        </>
      )}

      {imageSrc && !loading && (
        <>
          <Image src={imageSrc} alt="Captured" borderRadius="md" />
          <Button
            width="100%"
            bg="blue.600"
            _hover={{
              bg: "blue.500",
              transform: "scale(1.02)",
              boxShadow: "0 0 12px rgba(7, 72, 112, 0.91)",
            }}
            size="lg"
            onClick={handleSubmit}
            transition="all 0.2s"
          >
            Submit
          </Button>
        </>
      )}

      {loading && <Spinner size="xl" />}
      {message && <Text fontSize="lg">{message}</Text>}
    </MotionVStack>
  );
}

function PictureTakenPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking");
  const [progress, setProgress] = useState(0);
  const [verificationStep, setVerificationStep] = useState(0);

  const cardBg = useColorModeValue("rgba(255, 255, 255, 0.06)", "rgba(255, 255, 255, 0.04)");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const popAnimation = `
    @keyframes pop {
      0% { transform: scale(0.5); opacity: 0; }
      70% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(1); }
    }
  `;

  useEffect(() => {
    let timeout;
    let interval;

    if (status === "checking") {
      timeout = setTimeout(() => setStatus("not_in_hbf"), 2000);
    } else if (status === "not_in_hbf") {
      timeout = setTimeout(() => setStatus("loading"), 2000);
    } else if (status === "loading") {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 165) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setStatus("verifying");
            return prev;
          }
        });
      }, 50);
    } else if (status === "verifying") {
      let step = 1;
      interval = setInterval(() => {
        if (step <= 165) {
          setVerificationStep(step);
          step++;
        } else {
          clearInterval(interval);
          setStatus("completed");
        }
      }, 30);
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [status]);

  return (
    <>
      <style>{popAnimation}</style>
      <MotionVStack
        spacing={6}
        p={10}
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="xl"
        boxShadow="0 8px 30px rgba(0, 0, 0, 0.4)"
        color="white"
        backdropFilter="blur(18px)"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        _hover={{
          boxShadow: "0 12px 40px rgba(0, 255, 160, 0.1)",
          transform: "scale(1.01)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Text fontSize="lg">Picture Taken</Text>

        {status === "checking" && (
          <>
            <Spinner size="xl" />
            <Text fontSize="lg">Checking if the user is in HBF...</Text>
          </>
        )}

        {status === "not_in_hbf" && (
          <>
            <Spinner size="xl" color="yellow.400" />
            <Text fontSize="lg" color="red.400">User is not in HBF</Text>
            <Text fontSize="md" color="yellow.300">Proceeding with Enrollment...</Text>
          </>
        )}

        {status === "loading" && (
          <>
            <Spinner size="xl" color="yellow.400" />
            <Text fontSize="lg" color="yellow.300">Enrolling in HBF System...</Text>
            <Progress value={progress} max={165} size="lg" colorScheme="green" width="100%" />
            <Text>{progress} / 165</Text>
          </>
        )}

        {status === "verifying" && (
          <>
            <Spinner size="xl" color="green.500" />
            <Text fontSize="lg" color="green.300">Generating Proofs...</Text>
            <Text fontSize="md">Step {verificationStep} / 165</Text>
          </>
        )}

        {status === "completed" && (
          <VStack spacing={4} align="center">
            <Text fontSize="4xl" fontWeight="bold" color="green.300">
              🎉 Yay!
            </Text>
            <Text fontSize="2xl" fontWeight="semibold" color="teal.200">
              Credentials Generated Successfully
            </Text>
            <Text fontSize="md" color="gray.300" textAlign="center">
              You’ve been successfully verified and enrolled into the system.
            </Text>
            <Box
              bg="green.500"
              borderRadius="full"
              boxSize="80px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="xl"
              animation="pop 0.6s ease-out"
            >
              <Text fontSize="3xl" color="white">✅</Text>
            </Box>
            <Text fontSize="sm" color="green.200" mt={4} textAlign="center">
              Your Biometric data privacy is preserved through <b>SHA-256 Hash</b> + <b>Zk-SNARK Proofs</b>.
            </Text>
          </VStack>
        )}
      </MotionVStack>
    </>
  );
}

function App() {
  return (
    <ChakraProvider>
      <Box
        position="relative"
        height="100vh"
        overflow="hidden"
        _before={{
          content: `""`,
          position: "absolute",
          top: 0,
          left: 0,
          width: "200%",
          height: "200%",
          background:
            "radial-gradient(circle at 30% 30%, rgba(0,255,255,0.08) 0%, rgba(0, 0, 0, 0.01) 100%)",
          animation: "animatedGlow 40s ease-in-out infinite",
          transformOrigin: "center",
          zIndex: 0,
        }}
        bgGradient="linear(to-tr, rgb(25, 54, 66), rgb(1, 4, 5), rgb(17, 86, 123))"
        display="flex"
        flexDirection="column"
      >
        {/* Inject enhanced keyframes */}
        <style>
          {`
            @keyframes animatedGlow {
              0% {
                transform: scale(1) rotate(0deg);
                opacity: 0.5;
              }
              25% {
                transform: scale(1.03) rotate(90deg);
                opacity: 0.6;
              }
              50% {
                transform: scale(1.06) rotate(180deg);
                opacity: 0.7;
              }
              75% {
                transform: scale(1.03) rotate(270deg);
                opacity: 0.6;
              }
              100% {
                transform: scale(1) rotate(360deg);
                opacity: 0.5;
              }
            }
          `}
        </style>

        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/loading"
              element={
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  minH="100vh"
                  px={4}
                  zIndex={1}
                >
                  <LoadingPage />
                </Box>
              }
            />
            <Route
              path="/credential"
              element={
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  minH="100vh"
                  px={4}
                  zIndex={1}
                >
                  <CredentialPage />
                </Box>
              }
            />
            <Route
              path="/picture-taken"
              element={
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  minH="100vh"
                  px={4}
                  zIndex={1}
                >
                  <PictureTakenPage />
                </Box>
              }
            />
          </Routes>
        </Router>
      </Box>
    </ChakraProvider>
  );
}



export default App;
