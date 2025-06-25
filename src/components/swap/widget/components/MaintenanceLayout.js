import { useSquid } from 'src/components/swap/widget/react-hooks'
import React from 'react'
import { Button, Toast } from '@0xsquid/ui'
import { squidSupportLink } from '../core/externalLinks'

const defaultMaintenanceMessage = 'Squid is under maintenance, please refresh this page later.'

export const MaintenanceLayout = () => {
  const { maintenanceMode } = useSquid()
  if (!maintenanceMode?.active) return null

  return (
    <span
      className='tw-z-50 tw-flex tw-flex-row tw-justify-center tw-p-4 tw-text-center'
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%'
      }}
    >
      <Toast
        description={maintenanceMode?.message ?? defaultMaintenanceMessage}
        title='Squid Offline'
        actionsContent={
          <div className='tw-self-stretch'>
            <Button label='Learn more' link={squidSupportLink} size='md' variant='tertiary' className='tw-w-full' />
          </div>
        }
      />
    </span>
  )
}
