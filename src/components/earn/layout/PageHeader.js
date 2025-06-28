import React from 'react'
import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const PageHeader = ({
  title,
  subtitle,
  titleClassName = 'heading-style-h3 text-gradient-cyan-lilac font-bold text-center',
  subtitleProps = {},
  centerContent = true,
  children
}) => {
  const defaultSubtitleProps = {
    variant: 'h4',
    textAlign: centerContent ? 'center' : 'left',
    width: centerContent ? '80%' : 'auto',
    margin: centerContent ? 'auto' : 0,
    mt: 4,
    ...subtitleProps
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box className={titleClassName}>{title}</Box>

      {subtitle && <Typography {...defaultSubtitleProps}>{subtitle}</Typography>}

      {children && <Box sx={{ mt: 3 }}>{children}</Box>}
    </Box>
  )
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  titleClassName: PropTypes.string,
  titleVariant: PropTypes.string,
  subtitleProps: PropTypes.object,
  centerContent: PropTypes.bool,
  children: PropTypes.node
}

export default PageHeader
