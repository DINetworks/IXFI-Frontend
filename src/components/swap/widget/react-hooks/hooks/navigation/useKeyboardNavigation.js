import { useCallback, useEffect } from 'react'

export const useKeyboardNavigation = props => {
  const { itemsListRef, activeListItemClassName = '', onEscape } = props ?? {}

  const onKeyDown = useCallback(
    event => {
      if (event.key === 'Escape') {
        onEscape?.()
        return
      }

      if (activeListItemClassName.trim() === '') return

      const itemsList = itemsListRef?.current
      const separatedActiveItemClassNames = activeListItemClassName.split(' ')
      const defaultActiveItem = itemsList?.querySelector(`.${separatedActiveItemClassNames.join('.')}`)

      if (event.key === 'ArrowUp') {
        if (!itemsList) return

        event.preventDefault()
        const activeItem = defaultActiveItem ?? itemsList.lastElementChild
        if (!activeItem) return

        const previousItem = activeItem.previousElementSibling

        if (previousItem) {
          activeItem.classList.remove(...separatedActiveItemClassNames)
          previousItem.classList.add(...separatedActiveItemClassNames)

          // scroll to previous item
          itemsList.scrollTo({
            top: (previousItem.offsetTop ?? 0) - itemsList.clientHeight,
            behavior: 'smooth'
          })
        }
      } else if (event.key === 'ArrowDown') {
        if (!itemsList) return

        event.preventDefault()

        const activeItem = defaultActiveItem ?? itemsList.firstElementChild
        if (!activeItem) return

        const nextItem = activeItem.nextElementSibling
        if (nextItem) {
          activeItem.classList.remove(...separatedActiveItemClassNames)
          nextItem.classList.add(...separatedActiveItemClassNames)

          // scroll to next item
          itemsList.scrollTo({
            top: (nextItem.offsetTop ?? 0) - itemsList.clientHeight,
            behavior: 'smooth'
          })
        }
      } else if (event.key === 'Enter') {
        event.preventDefault()

        if (defaultActiveItem) {
          // select active item
          defaultActiveItem.querySelector('button')?.click()
        }
      }
    },
    [itemsListRef, activeListItemClassName]
  )

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown, false)

    return () => {
      document.removeEventListener('keydown', onKeyDown, false)
    }
  }, [onKeyDown])
}
