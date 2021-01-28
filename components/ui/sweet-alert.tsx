import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

/**
 * @link https://sweetalert2.github.io/#configuration
 */
const Sweet = Swal.mixin({
  buttonsStyling: false
})
export default withReactContent(Sweet)

const success = Swal.mixin({
  toast: true,
  icon: 'success',
  position: 'top',
  showConfirmButton: false,
  showCloseButton: true,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

const error = Swal.mixin({
  toast: true,
  icon: 'error',
  position: 'top',
  showConfirmButton: false,
  showCloseButton: true,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

export const Toast = {
  success: withReactContent(success),
  error: withReactContent(error)
}




