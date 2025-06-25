import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { areSameAddress } from '../../services'

export const useAddressBookStore = create(
  persist(
    set => ({
      addressBook: [],
      add: newAddressData => {
        set(state => {
          const alreadyExists = state.addressBook.some(savedAddress => {
            return (
              savedAddress.chainType === newAddressData.chainType &&
              areSameAddress(savedAddress.address, newAddressData.address)
            )
          })

          if (alreadyExists) return state

          return {
            addressBook: [...state.addressBook, newAddressData]
          }
        })
      },
      remove: addressToRemove => {
        set(state => {
          return {
            addressBook: state.addressBook.filter(
              savedAddress =>
                savedAddress.chainType !== addressToRemove.chainType ||
                !areSameAddress(savedAddress.address, addressToRemove.address)
            )
          }
        })
      }
    }),
    {
      name: 'squid.addressbook.store'
    }
  )
)
