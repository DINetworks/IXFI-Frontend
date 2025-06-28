import React from 'react'
import { Box } from '@mui/material'
import PropTypes from 'prop-types'

const EarnPageLayout = ({
  children,
  maxWidth = 'container-large',
  spacing = 8,
  padding = 4,
  className = 'section_header-text-image'
}) => {
  return (
    <section className={className}>
      <Box
        className={maxWidth}
        sx={{
          mt: spacing,
          px: padding,
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        {children}
      </Box>
    </section>
  )
}

EarnPageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.string,
  spacing: PropTypes.number,
  padding: PropTypes.number,
  className: PropTypes.string
}

export default EarnPageLayout
