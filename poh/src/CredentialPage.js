import { useState, useEffect, useRef } from "react";
import { Container, VStack, Text, Button, Spinner, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function CredentialPage() {
  const [cameraOn, setCameraOn] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [loadingStage, setLoadingStage] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

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
      video.srcObject.getTracks().forEach(track => track.stop());
      setCameraOn(false);
    }
  };

  const startLoadingSequence = () => {
    setLoadingStage(1);
    let count = 1;
    const interval = setInterval(() => {
      count++;
      setLoadingStage(count);
      if (count > 3) {
        clearInterval(interval);
        navigate("/done");
      }
    }, 5000);
  };

  return (
    <Container centerContent height="100vh" display="flex" justifyContent="center">
      <VStack spacing={6} p={8} bg="gray.800" color="white" borderRadius="lg" boxShadow="lg">
        {loadingStage === 0 && (
          <>
            <Text fontSize="lg">Capture Your Picture for Credential</Text>
            {!cameraOn && !imageSrc && (
              <Button colorScheme="blue" onClick={() => setCameraOn(true)}>Open Camera</Button>
            )}
            {cameraOn && (
              <>
                <video ref={videoRef} autoPlay width="300" height="200" />
                <canvas ref={canvasRef} width="300" height="200" style={{ display: "none" }} />
                <Button colorScheme="green" onClick={capturePhoto}>Take Picture</Button>
              </>
            )}
            {imageSrc && (
              <>
                <Image src={imageSrc} alt="Captured" borderRadius="md" />
                <Button colorScheme="teal" onClick={startLoadingSequence}>Submit</Button>
              </>
            )}
          </>
        )}
        {loadingStage > 0 && loadingStage <= 3 && (
          <>
            <Spinner size="xl" />
            <Text fontSize="lg">Processing... Level {loadingStage}</Text>
          </>
        )}
      </VStack>
    </Container>
  );
}

export default CredentialPage;
