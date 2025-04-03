import { toast } from 'react-hot-toast'

export const showToast = (type, msg) => {
  if (type == 'success') {
    toast.success(msg)
  } else if (type == 'error') {
    toast.error(msg)
  }
}
