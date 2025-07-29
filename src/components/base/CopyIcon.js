import { Icon } from '@iconify/react'
import { useClipboard } from 'src/hooks/useClipboard'

const CopyIcon = ({ text }) => {
  const { isCopied, copyToClipboard } = useClipboard()

  const copyIcon = !isCopied ? 'tabler:copy' : 'tabler:circle-check-filled'

  return (
    <Icon
      icon={copyIcon}
      fontSize='1.5rem'
      className='cursor-pointer'
      color={'#00ff66'}
      onClick={() => copyToClipboard(text)}
    />
  )
}

export default CopyIcon
