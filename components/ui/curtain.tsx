import {motion} from "framer-motion";
import React from "react";

// type CurtainProps & React.FC {
//   isOpened: boolean
// }

export default function Curtain(props) {

  const {isOpened, children} = props
  const motionVars = {
    closed: {opacity: 0, height: 0},
    opened: {opacity: 1, height: 'auto'}
  }

  return (<motion.div
    style={{overflow: 'hidden'}}
    variants={motionVars}
    initial="closed"
    animate={isOpened ? 'opened' : 'closed'}
    transition={{duration: 1}}
  >
    {children}
  </motion.div>)
}
