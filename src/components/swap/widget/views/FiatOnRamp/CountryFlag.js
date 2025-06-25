import { useCountryDetails } from 'src/components/swap/widget/react-hooks'
import { cn } from '@0xsquid/ui'

export const CountryFlag = ({ countryCode, size = 'md', rounded = true }) => {
  const countryDetails = useCountryDetails(countryCode)
  const flag = countryDetails?.flagUrl

  const sizeClasses = {
    sm: rounded ? 'tw-h-4 tw-w-4' : 'tw-h-3 tw-w-4',
    md: rounded ? 'tw-h-6 tw-w-6' : 'tw-h-4.5 tw-w-6',
    lg: rounded ? 'tw-h-8 tw-w-8' : 'tw-h-6 tw-w-8',
    xl: rounded ? 'tw-h-12 tw-w-12' : 'tw-h-8 tw-w-12'
  }

  return (
    <div className='tw-flex tw-items-center tw-justify-center'>
      <img
        src={flag}
        alt={`${countryCode} flag`}
        className={cn(sizeClasses[size], rounded && 'tw-rounded-full', 'tw-object-cover')}
      />
    </div>
  )
}
