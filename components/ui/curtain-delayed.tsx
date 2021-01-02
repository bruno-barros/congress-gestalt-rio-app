import React from "react";
import {motion} from "framer-motion";

export default function CurtainDelayed({delay, children}) {

  return (<motion.div
    initial={{opacity: 0, height: 0}}
    animate={{opacity: 1, height: 'auto'}}
    transition={{opacity: {delay: 2, duration: 1}, height: {delay: 1, duration: 1}}}
  >
    {children}
  </motion.div>)
}
