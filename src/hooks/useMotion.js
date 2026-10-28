import { useContext } from "react";
import { MotionContext } from "../context/MotionContext";

export function useMotion() {
  const context = useContext(MotionContext);

  //Magthrow ng error if ung context is outside ng 'MotionContext'
  if (!context) {
    throw new Error("useMotion must be used within MotionProvider");
  }

  return context;
}
