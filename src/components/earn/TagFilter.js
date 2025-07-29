import { Icon } from '@iconify/react'
import { BetweenBox, CenterBox } from 'src/components/base/grid'
import { EARN_TAGS } from 'src/configs/constant'
import { Button } from '@mui/material'
import { useEarnPools } from 'src/hooks/useEarnPools'

const TagFilter = () => {
  const { tag, setSearchParam } = useEarnPools()

  const TagButton = props => {
    return (
      <Button
        variant={props.tag == tag ? 'outlined' : 'contained'}
        color={props.tag == tag ? 'success' : 'secondary'}
        onClick={() =>
          setSearchParam({
            tag: props.tag,
            sortBy: !props.tag ? 'tvl' : props.tag == 'low_volatility' ? 'apr' : '',
            orderBy: !props.tag || props.tag == 'low_volatility' ? 'desc' : '',
            query: '',
            page: 1
          })
        }
        {...props}
      >
        {props.children}
      </Button>
    )
  }

  return (
    <BetweenBox mt={4}>
      <CenterBox
        gap={4}
        sx={{ overflowX: 'auto', flexWrap: 'nowrap', whiteSpace: 'nowrap', minWidth: '120px' }}
      >
        {EARN_TAGS.map((tagItem, index) => (
          <TagButton
            key={index}
            tag={tagItem.tag}
            startIcon={
              tagItem.icon && (
                <Icon
                  icon={tagItem.icon.name}
                  color={tagItem.icon.color}
                />
              )
            }
          >
            {tagItem.title}
          </TagButton>
        ))}
      </CenterBox>
      <Button
        variant='outlined'
        color='success'
        href='/ecosystem/earn/positions'
        startIcon={
          <Icon
            icon='fluent:data-pie-20-filled'
            color='#00ff90'
          />
        }
      >
        My Positions
      </Button>
    </BetweenBox>
  )
}

export default TagFilter
