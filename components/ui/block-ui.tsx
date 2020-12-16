import stl from './block-ui.module.scss'

interface BlockUiProps {
  blocking: boolean,
  title?: string
}
export default function BlockUi(props: BlockUiProps){

  const {blocking, title: userTitle} = props
  let title = userTitle || 'Carregando...'

  if(!blocking){
    return  <></>;
  } else {
    return (<div className={stl.container}>
      <div className={stl.overlay} />
      <div className={stl.messageContainer}>
        <div className={stl.message}>
          <div className={stl.title}>{title}</div>
          <div className={stl.loadingIndicator}>
            <svg id={stl.indicator} viewBox="0 0 100 100">
              <circle id={stl.circle} cx="50" cy="50" r="45" />
            </svg>
          </div>
        </div>
      </div>
    </div>)
  }
}
