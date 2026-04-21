import netInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export const useNetwork = () => {
  const [isOnline, setIsOnlibene] = useState(true);
  useEffect(() => {
    const unsubcribe = netInfo.addEventListener((state) => {
      setIsOnlibene(!!state.isConnected);
    });
    return () => {
      unsubcribe();
    };
  }, []);
  return { isOnline };
};
