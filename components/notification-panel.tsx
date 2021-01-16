import {Icon} from "@brunobarros/react-components";
import {useCallback, useEffect, useMemo, useState} from "react";
import Curtain from "./ui/curtain";
import dynamic from 'next/dynamic'
import {useQuery, useQueryClient} from "react-query";
import useCurrentUser from "./hooks/useCurrentUser";
import WpNotification from "../src/http/wp-notification";
import {Notification} from "../src/resources/notification";
import moment from "moment";
import debounce from 'lodash/debounce'
import useTrans from "./hooks/useTrans";

const ScrollArea = dynamic(
  () => import('react-scrollbar'),
  {ssr: false}
)


export default function NotificationPanel() {

  const t = useTrans()
  const [isOpen, setIsOpen] = useState(false)
  const {user} = useCurrentUser()
  const queryClient = useQueryClient()
  const [change, setChange] = useState(0)
  const {data, isLoading, isFetching} = useQuery<Notification[]|null>(['notifications', user.getId()], queryNotifications, {
    enabled: !!user.getId() && user.getId() > 0,
    staleTime: 1000 * 60 * 5
  })
  const count = useMemo(()=>{
    return data ? data.filter(d => !d.read_at).length : 0
  }, [data, change])

  const updateNotifications = useCallback(debounce(()=>{
    WpNotification.setAsRead(data)
  }, 5000), [data])

  function queryNotifications(): Promise<Notification[]|null> {
    return new Promise((resolve, reject) => {
      WpNotification.get({
        context: user.canManageAbstracts() ? 'admin' : (user.canEvaluateAbstracts() ? 'evaluator' : 'author'),
        recipient_id: user.getId()
      })
        .then(resp => {
          if (resp.data.data?.evNotifications?.nodes) {
            resolve(resp.data.data.evNotifications.nodes)
          }
        }, err => {
          resolve(null)
        })
    })
  }

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


  function handleScroll() {

  }
  function handleStatus(note?: Notification) {
    const notes: Notification[] = queryClient.getQueryData(['notifications', user.getId()])
    const newNotes = notes.map(n => {
      if(n.id === note?.id || !note){
        n.read_at = moment().format('YYYY-MM-DD HH:mm:ss')
      }
      return n
    })
    queryClient.setQueryData(['notifications', user.getId()], newNotes)
    setChange(change + 1)
    updateNotifications()
  }

  // @ts-ignore
  return (<div id="notificationPanel" className={`notification-panel ${isOpen ? 'is-open' : ''}`}>
    <div className="np-button" role="button" onClick={handleButton}>
      {count > 0 && <div className="badge badge-warning">{count}</div>}
      <Icon name={`notifications-outline`}/>
    </div>
    <div className="np-panel">
      <Curtain isOpened={isOpen} duration={.5}>
        <div className="np-header">
          <div>{count} {t('mensagens-nao-lidas')}</div>
          {count > 0 && <a href="#" onClick={(e)=>{
            e.stopPropagation()
            handleStatus()
          }}>{t('ocultar-tudo')}</a>}

        </div>
        <ScrollArea
          contentClassName="content"
          horizontal={false}
          vertical={true}
          smoothScrolling={true}
          stopScrollPropagation={true}
        >
          {(data && data.length > 0 && count > 0)
            ? data.map((note: Notification) => (
              <div key={note.id} className={`np-item border-bottom d-flex ${note.read_at ? 'read' : ''}`}>
                <div className="np-status" onClick={()=>handleStatus(note)}>
                  <Icon name={`eye-outline`}/>
                </div>
                <div className="np-content flex-grow-1">
                  <div className="dt">{moment(note.created_at).format('DD/MM/YYYY HH:mm')}</div>
                  {note.note}
                </div>
              </div>
            ))
            : (<div className="ml-2 np-content">{t('nao-ha-novas-mensagens')}.</div>)}

        </ScrollArea>

      </Curtain>

    </div>
  </div>)
}
