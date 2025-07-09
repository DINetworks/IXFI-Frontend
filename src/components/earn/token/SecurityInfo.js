import React, { useMemo } from 'react'
import { NATIVE_EVM_TOKEN_ADDRESS } from 'src/components/utils/uniswap'
import { NETWORK_INFO } from 'src/configs/protocol'
import useSecurityTokenInfo from 'src/hooks/useSecurityInfo'
import { BetweenBox, CenterBox } from 'src/components/base/grid'
import { Box, Tooltip } from '@mui/material'
import { Icon } from '@iconify/react'
import CollapseInfoItem from './CollapseInfoItem'

const SecurityInfo = ({ chainId, token }) => {
  const tokenAddress = useMemo(() => {
    if (!token?.address) return ''
    const isNative = token.address.toLowerCase() === NATIVE_EVM_TOKEN_ADDRESS.toLowerCase()

    const address = isNative ? NETWORK_INFO[chainId].wrappedToken.address : token.address
    return address.toLowerCase()
  }, [token, chainId])

  const { securityInfo = {}, loading } = useSecurityTokenInfo(chainId, tokenAddress)

  console.log(securityInfo.tradingData, securityInfo.contractData)

  return (
    <>
      <BetweenBox px={4} py={2} className='text-text' style={{ background: `#a9a9a933` }}>
        <CenterBox gap={2}>
          <Icon icon='ant-design:security-scan-filled' fontSize='1.5rem' />
          <Tooltip
            title='Token security info provided by Goplus. Please conduct your own research before trading'
            placement='top'
          >
            <span className='border-b border-dashed border-text'>Security Info</span>
          </Tooltip>
        </CenterBox>

        <CenterBox gap={2}>
          <span className='text-subText text-xs'>Powered by </span>
          <img src='/images/icons/goplus.svg' alt='goplus' style={{ width: 'auto', height: '1rem' }} />
        </CenterBox>
      </BetweenBox>

      {/* Collapse Panels */}
      <Box display='flex' flexDirection='column'>
        <CollapseInfoItem
          icon={<Icon icon='hugeicons:money-security' fontSize='1.5rem' />}
          title='Trading Security'
          warning={securityInfo.totalWarningTrading}
          danger={securityInfo.totalRiskTrading}
          loading={loading}
          data={securityInfo.tradingData}
          totalRisk={securityInfo.totalRiskTrading}
          totalWarning={securityInfo.totalWarningTrading}
        />

        <CollapseInfoItem
          icon={<Icon icon='mingcute:file-security-fill' fontSize='1.5rem' />}
          title='Contract Security'
          warning={securityInfo.totalWarningContract}
          danger={securityInfo.totalRiskContract}
          loading={loading}
          data={securityInfo.contractData}
          totalRisk={securityInfo.totalRiskContract}
          totalWarning={securityInfo.totalWarningContract}
        />
      </Box>
    </>
  )
}

export default SecurityInfo
