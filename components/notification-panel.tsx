import {Icon} from "@brunobarros/react-components";
import {useEffect, useState} from "react";
import Curtain from "./ui/curtain";
import dynamic from 'next/dynamic'

const ScrollArea = dynamic(
  () => import('react-scrollbar'),
  {ssr: false}
)


export default function NotificationPanel() {

  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    document.body.addEventListener('click', handleOutClick)
    return () => {
      document.body.removeEventListener('click', handleOutClick)
    }
  }, [isOpen])

  function handleOutClick(e) {
    const sidebar = document.getElementById('notificationPanel')
    const inside = sidebar && document.getElementById('notificationPanel').contains(e.target)
    // console.log({inside, state});
    if (isOpen && !inside) {
      setIsOpen(false)
    }
  }

  function handleButton() {
    setIsOpen(!isOpen)
  }

  function Content() {

    return (<div className="">
      Lorem ipsum Lorem ipsum dolor sit amet, consectetur adipisicing elit. A atque commodi cumque delectus eum illum
      maiores nobis, nostrum possimus sunt. Aut cum hic libero magni quia quis suscipit tempore vitae.Lorem ipsum Lorem
      ipsum dolor sit amet, consectetur adipisicing elit. A atque commodi cumque delectus eum illum maiores nobis,
      nostrum possimus sunt. Aut cum hic libero magni quia quis suscipit tempore vitae.Lorem ipsum Lorem ipsum dolor sit
      amet, consectetur adipisicing elit. A atque commodi cumque delectus eum illum maiores nobis, nostrum possimus
      sunt. Aut cum hic libero magni quia quis suscipit tempore vitae.Lorem ipsum Lorem ipsum dolor sit amet,
      consectetur adipisicing elit. A atque commodi cumque delectus eum illum maiores nobis, nostrum possimus sunt. Aut
      cum hic libero magni quia quis suscipit tempore vitae.Lorem ipsum Lorem ipsum dolor sit amet, consectetur
      adipisicing elit. A atque commodi cumque delectus eum illum maiores nobis, nostrum possimus sunt. Aut cum hic
      libero magni quia quis suscipit tempore vitae.Lorem ipsum Lorem ipsum dolor sit amet, consectetur adipisicing
      elit. A atque commodi cumque delectus eum illum maiores nobis, nostrum possimus sunt. Aut cum hic libero magni
      quia quis suscipit tempore vitae.Lorem ipsum Lorem ipsum dolor sit amet, consectetur adipisicing elit. A atque
      commodi cumque delectus eum illum maiores nobis, nostrum possimus sunt. Aut cum hic libero magni quia quis
      suscipit tempore vitae.Lorem ipsum Lorem ipsum dolor sit amet, consectetur adipisicing elit. A atque commodi
      cumque delectus eum illum maiores nobis, nostrum possimus sunt. Aut cum hic libero magni quia quis suscipit
      tempore vitae.Lorem ipsum Lorem ipsum dolor sit amet, consectetur adipisicing elit. A atque commodi cumque
      delectus eum illum maiores nobis, nostrum possimus sunt. Aut cum hic libero magni quia quis suscipit tempore
      vitae.
    </div>)
  }

  function handleScroll() {

  }

  // @ts-ignore
  return (<div id="notificationPanel" className={`notification-panel ${isOpen ? 'is-open' : ''}`}>
    <div className="np-button" role="button" onClick={handleButton}>
      <Icon name={`notifications-outline`}/>
    </div>
    <div className="np-panel">
      <Curtain isOpened={isOpen}>
        <div className="np-header">
          <div>5 mensagens não lidas</div>
          <a href="#">marcar tudo como lido</a>
        </div>
        <ScrollArea
          contentClassName="content"
          horizontal={false}
          vertical={true}
          smoothScrolling={true}
          stopScrollPropagation={true}
        >
          <div className="np-item border-bottom d-flex">
            <div className="np-status">
              <Icon name={`eye-outline`}/>
            </div>
            <div className="np-content flex-grow-1">
              Status do trabalho 364 alterado para "synopsis_approved"
            </div>
          </div>
          <div className="np-item read border-bottom d-flex">
            <div className="np-status">
              <Icon name={`eye-off-outline`}/>
            </div>
            <div className="np-content flex-grow-1">
              Trabalho 497 enviado para avaliação
            </div>
          </div>
          <div className="np-item border-bottom d-flex">
            <div className="np-status">
              <Icon name={`eye-outline`}/>
            </div>
            <div className="np-content flex-grow-1">
              Status do trabalho 364 alterado para "synopsis_approved"
            </div>
          </div>
          <div className="np-item read border-bottom d-flex">
            <div className="np-status">
              <Icon name={`eye-off-outline`}/>
            </div>
            <div className="np-content flex-grow-1">
              Trabalho 497 enviado para avaliação
            </div>
          </div>
        </ScrollArea>

      </Curtain>

    </div>
  </div>)
}
