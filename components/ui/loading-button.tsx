interface LoadingButtonProps{
  loading: boolean;
  children?: any;
  // bootstrap
  variant?: string;
  disable?: boolean | undefined;
  size?: 'sm'|'lg';
  block?: boolean;
  type?: 'submit'|'button'|'reset'|undefined;
  className?: string;
  onClick?: () => void;
}

export default function LoadingButton ( props: LoadingButtonProps){
  const {loading, size, block, children, variant, disable, type, className, ...props2} = props;
  let tp = typeof type === 'undefined' ? 'submit' : type

  function LoadingStyle(){
    let style = variant && variant.substring(0, 7) === 'outline' ? '' : 'text-light'
    return (<div className={`spinner-border  spinner-border-sm ml-2 ${style}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>)
  }

  function classes(){
    let c = []
    if(variant){
      c.push(`btn-${variant}`)
    } else {
      c.push(`btn-primary`)
    }
    if(size){
      c.push(`btn-${size}`)
    }
    if(block){
      c.push(`btn-block`)
    }
    return c.join(' ') + ' '+className
  }

  function customProps(){

  }

  return (
    <button disabled={!!(loading || disable)} className={`d-flex align-items-center justify-content-center btn ${classes()}`} type={tp} {...props2}>
      {children}
      {loading ? (<LoadingStyle/>) : ''}
    </button>
  )
}
