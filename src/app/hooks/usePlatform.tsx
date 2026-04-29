import { useEffect, useState } from "react";

export const usePlatform = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isWeb, setIsWeb] = useState(true);

  useEffect(() => {
    const checkPlatform = () => {
      const userAgent = window.navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      
      setIsMobile(isMobileDevice || isSmallScreen);
      setIsWeb(!isMobileDevice || window.innerWidth >= 768);
    };

    checkPlatform();
    window.addEventListener("resize", checkPlatform);
    return () => window.removeEventListener("resize", checkPlatform);
  }, []);

  return { isMobile, isWeb };
};

export const isWebPlatform = () => {
  const userAgent = window.navigator.userAgent;
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  return !isMobileDevice;
};
