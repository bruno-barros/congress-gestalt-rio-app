import React, {useContext, useEffect, useState} from "react";
import Card from "react-bootstrap/cjs/Card";
import Button from "react-bootstrap/cjs/Button";
import {motion, useMotionValue, useTransform, useViewportScroll} from "framer-motion"
import CardColumns from "react-bootstrap/cjs/CardColumns";
const isBrowser = () => typeof window !== "undefined"
const CardsContext = React.createContext({
  selected: 0,
  setSelected: (i: number) => {
  }
})

export default function Motion() {

  const ctx = useContext(CardsContext)
  // const [x, setX] = useState(0)
  const [selected, setSelected] = useState(0)
  const [open, setOpen] = useState(false)
  const x = useMotionValue(0)
  const {scrollYProgress, scrollY} = useViewportScroll()
  const variants = {
    open: {opacity: 1, x: 0},
    closed: {opacity: 0, x: "-100%"},
  }

  useEffect(() => {

    // scrollY.onChange(v => console.log(v))
  }, [selected])

  function handleClick(i) {
    if (selected === i) {
      setSelected(0)
    } else {
      setSelected(i)
    }

  }

  return (
    <CardsContext.Provider value={{selected, setSelected}}>
      <div className="m-3">
        <CardColumns>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card2 key={i} i={i} isSelected={selected === i}/>
          ))}
        </CardColumns>
      </div>
    </CardsContext.Provider>
  )
}

const Card2 = (props) => {

  const {i, isSelected} = props
  const w = isBrowser() && document.querySelector(`#card-${i}`).clientWidth;
  const h = isBrowser() && document.querySelector(`#card-${i}`).clientHeight - 10

  const container = {
    normal: {
      x: '0%', y: 0,
      width: w, height: h
    },
    selected: {
      x: '50%', y: 20,
      width: isBrowser() && window.innerWidth/2, height: isBrowser() && window.innerHeight/2
    }
  }

  const ctx = useContext(CardsContext);


  function containerStyle() {
    console.log(i, isSelected);
    if (isSelected) return {
      zIndex: 9,
      boxShadow: '0 0 30px rgba(0,0,0,.3)',
       position: 'fixed'
    }
    return {
      zIndex: 1, boxShadow: 'none',
      position: 'relative'
    }
  }

  return (<div id={`card-${i}`} className="-position-relative" style={{height: 150}}>
    <motion.div

    className={`card`}
    variants={container}
    animate={`${isSelected ? 'selected' : 'normal'}`}
    style={containerStyle()}
      onClick={() => {
        ctx.selected === i ? ctx.setSelected(0) : ctx.setSelected(i)
      }}
    >

      <Card.Header>#{i} Dolore error possimus tenetur</Card.Header>
      <Card.Body>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      </Card.Body>

  </motion.div>
</div>)
}
