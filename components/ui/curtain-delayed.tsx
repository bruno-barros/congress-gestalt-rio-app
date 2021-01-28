import React from "react";
import {motion} from "framer-motion";

interface CurtainDelayedProps {
  children: any
  delay?: number
}
export default function CurtainDelayed({delay, children}: CurtainDelayedProps) {

  const dly:number = delay || 1.5

  return (<motion.div
    initial={{opacity: 0, height: 0}}
    animate={{opacity: 1, height: 'auto'}}
    transition={{opacity: {delay: dly + .5, duration: 1}, height: {delay: dly, duration: 1}}}
  >
    {children}
  </motion.div>)
}
