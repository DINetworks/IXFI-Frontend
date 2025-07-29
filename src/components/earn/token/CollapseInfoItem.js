import React, { useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material'
import { BetweenBox, CenterBox } from 'src/components/base/grid'
import Loader from 'src/components/base/Loader'
import { Icon } from '@iconify/react'
import { isItemRisky, RISKY_THRESHOLD } from 'src/components/utils/uniswap'

const itemSx = {
  flexBasis: '45%',
  gap: 0.6,
  color: ''
}
const NO_DATA = '--'

const CollapseInfoItem = ({ icon, title, warning, danger, loading, data = [], totalRisk, totalWarning }) => {
  const [expanded, setExpanded] = useState(true)
  const onExpand = () => setExpanded(prev => !prev)

  return (
    <Accordion expanded={expanded}>
      <AccordionSummary
        sx={{ background: '#111' }}
        onClick={onExpand}
      >
        <BetweenBox
          pr={3}
          width='100%'
        >
          <CenterBox
            justifyContent='start'
            gap={0.6}
          >
            {icon}
            <span>{title}</span>
          </CenterBox>

          {(warning > 0 || danger > 0) && (
            <CenterBox
              gap={1}
              className={`${warning > 0 ? 'text-warning' : 'text-error'}`}
            >
              <Icon icon='ooui:alert' />
              <span>{warning > 0 ? warning : danger}</span>
            </CenterBox>
          )}
        </BetweenBox>
      </AccordionSummary>

      <AccordionDetails>
        <Box
          display='flex'
          background='#0003'
          mt={2}
          columnGap={4}
          rowGap={2}
          flexWrap='wrap'
          borderRadius={1}
        >
          {/* Total Risk Section */}
          <BetweenBox
            sx={{ ...itemSx }}
            className='text-xs text-subText'
          >
            <CenterBox gap={0.6}>
              <Icon
                icon='ooui:alert'
                className='text-error'
              />
              <span>{totalRisk <= 1 ? 'Risky Item' : 'Risky Item(s)'}</span>
            </CenterBox>
            <span className='text-error font-medium'>{totalRisk}</span>
          </BetweenBox>

          {/* Total Warning Section */}
          <BetweenBox
            sx={{ ...itemSx }}
            className='text-xs text-subText'
          >
            <CenterBox gap={0.6}>
              <Icon
                icon='ooui:alert'
                className='text-warning'
              />
              <span>{totalWarning <= 1 ? 'Attention Item' : 'Attention Item(s)'}</span>
            </CenterBox>
            <span className='text-warning font-medium'>{totalWarning}</span>
          </BetweenBox>

          {/* List of detail items */}
          {data.map(item => {
            const { label, value, type, isNumber } = item

            const colorRiskyByType = type === 0 ? 'text-error' : 'text-warning'
            const colorRiskyByAmount = Number(value) > RISKY_THRESHOLD.RISKY ? 'text-error' : 'text-warning'

            // Display value formatting
            const displayValue = loading ? (
              <Loader className='animate-spin' />
            ) : isNumber && value ? (
              `${+value * 100}%`
            ) : value === '0' ? (
              'No'
            ) : value === '1' ? (
              'Yes'
            ) : isNumber ? (
              'Unknown'
            ) : (
              NO_DATA
            )

            return (
              <BetweenBox
                key={label}
                sx={{ ...itemSx, px: 2 }}
                className='text-xs text-subText'
              >
                <span>{label}</span>
                <span
                  className={`font-medium ${
                    isItemRisky(item)
                      ? isNumber
                        ? colorRiskyByAmount
                        : colorRiskyByType
                      : displayValue === NO_DATA
                      ? 'text-subText'
                      : 'text-accent'
                  }`}
                >
                  {displayValue}
                </span>
              </BetweenBox>
            )
          })}
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default CollapseInfoItem
