import {motion} from "framer-motion";
import React from "react";

export default function Curtain(props) {

  const {isOpened, duration, children} = props
  const motionVars = {
    closed: {opacity: 0, height: 0},
    opened: {opacity: 1, height: 'auto'}
  }

  return (<motion.div
    style={{overflow: 'hidden'}}
    variants={motionVars}
    initial="closed"
    animate={isOpened ? 'opened' : 'closed'}
    transition={{duration: duration || .7}}
  >
    {children}
  </motion.div>)
}
