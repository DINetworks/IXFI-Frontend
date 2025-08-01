const Loader = ({ size = '1.2rem', stroke, strokeWidth, ...rest }) => {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http=//www.w3.org/2000/svg'
      width={size}
      height={size}
      stroke
      {...rest}
    >
      <path
        stroke={stroke ?? '#00cef9'}
        d='M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80375 19.1414 5'
        strokeWidth={strokeWidth ?? '2.5'}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default Loader
