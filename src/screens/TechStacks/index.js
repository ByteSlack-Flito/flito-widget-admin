import {
  Button,
  HStack,
  SimpleGrid,
  Spinner,
  Text,
  useToast,
  VStack
} from '@chakra-ui/react'
import { useCallback, useEffect, useId, useState } from 'react'
import { AiOutlineDesktop } from 'react-icons/ai'
import { HiOutlineCursorClick } from 'react-icons/hi'
import { ImMobile } from 'react-icons/im'
import { useSelector } from 'react-redux'
import { ScreenContainer, useToastGenerator } from '../../components/global'
import { useFirebaseInstance } from '../../data/database/users/auth'
import { updateProfile, useWidget } from '../../data/database/users/profile'
import { AppTypeSingle } from './components'

const AppTypes = [
  {
    icon: <ImMobile size={14} />,
    value: 'mobile-app',
    title: 'Mobile Apps',
    description: 'Native & Hybrid Apps For Cross-Platform Devices',
    platforms: ['Android', 'iOS', 'AndroidTV', 'tvOS', 'watchOS', 'wearOS']
  },
  {
    icon: <HiOutlineCursorClick size={14} />,
    value: 'web-app',
    title: 'Websites & Web Apps',
    description: 'Responsive Website and Web Apps for modern browsers.',
    platforms: ['Static Websites', 'SPA', 'PWA']
  },
  {
    icon: <AiOutlineDesktop size={14} />,
    value: 'desktop-app',
    title: 'Desktop Apps',
    description: 'Classic Desktop Applications that run locally.',
    platforms: ['Windows', 'Linux', 'macOS']
  }
]

export const TechStackScreen = () => {
  const instance = useFirebaseInstance()
  const [selectedAppTypes, setSelectedAppTypes] = useState([])
  const { userId } = useSelector(state => state.user)
  const { isFetching, isUpdating, data, update } = useWidget()
  const toast = useToastGenerator()

  const updateSelectedAppTypes = (appType, platform) => {
    setSelectedAppTypes(prev => {
      let items = [...prev]

      const existing = items.find(x => x.appType === appType)
      if (existing) {
        const existingIdx = items.findIndex(x => x.appType === existing.appType)
        if (platform) {
          const exsPlatform = existing.platforms
          const updatedPlatforms = () => {
            if (exsPlatform) {
              if (exsPlatform?.some(x => x === platform)) {
                return exsPlatform?.filter(x => x !== platform)
              } else {
                return [...exsPlatform, platform]
              }
            } else {
              return [platform]
            }
          }
          let updated = {
            ...existing,
            platforms: updatedPlatforms()
          }
          items[existingIdx] = updated
        } else {
          items.splice(existingIdx, 1)
        }
      } else {
        items = [
          ...items,
          {
            appType
          }
        ]
      }

      return items
    })
  }

  function isFormValid () {
    return (
      selectedAppTypes.length > 0 &&
      selectedAppTypes.every(x => x.platforms?.length > 0)
    )
  }

  useEffect(() => data && setSelectedAppTypes(data.appTypes), [data])

  async function performUpdate () {
    const result = await update({
      appTypes: selectedAppTypes
    })
    toast.show(result)
  }
  return (
    <ScreenContainer
      title='Tech Stacks'
      description='Manage what applications you offer to develop for your clients.'
    >
      <SimpleGrid spacing='40px' columns={5}>
        <VStack
          align='flex-start'
          gridColumnStart={1}
          gridColumnEnd={5}
          spacing='2'
        >
          {isFetching && <Spinner size='md' color='blue.400' />}
          {!isFetching && (
            <>
              <HStack align='flex-start' justify='space-between' w='full'>
                {AppTypes.map(type => {
                  const existing = selectedAppTypes.find(
                    x => x.appType === type.value
                  )
                  return (
                    <AppTypeSingle
                      isSelected={existing}
                      selectedPlatforms={existing?.selectedPlatforms}
                      key={type.value}
                      {...type}
                      onSelectChange={updateSelectedAppTypes}
                    />
                  )
                })}
              </HStack>

              {selectedAppTypes?.map(({ appType }) => {
                const { platforms } = AppTypes.find(x => x.value === appType)

                return (
                  <VStack align='flex-start' key={appType}>
                    <Text fontWeight='medium' fontSize='sm'>
                      Select platforms for{' '}
                      <b>{AppTypes.find(x => x.value === appType).title}</b>
                    </Text>

                    <HStack align='flex-start' w='full'>
                      {platforms.map(platform => {
                        const isSelected = selectedAppTypes
                          .find(x => x.appType === appType)
                          ?.platforms?.some(x => x === platform)
                        return (
                          <Button
                            key={platform}
                            size='xs'
                            colorScheme={!isSelected ? 'gray' : 'blue'}
                            borderWidth='thin'
                            borderColor={!isSelected ? 'gray.300' : 'blue.400'}
                            onClick={() =>
                              updateSelectedAppTypes(appType, platform)
                            }
                          >
                            {platform}
                          </Button>
                        )
                      })}
                    </HStack>
                  </VStack>
                )
              })}
            </>
          )}
        </VStack>
      </SimpleGrid>
      <Button
        disabled={!isFormValid()}
        size='sm'
        colorScheme='teal'
        variant='solid'
        fontWeight='semibold'
        mt='7'
        isLoading={isUpdating}
        onClick={performUpdate}
      >
        Update Preferences
      </Button>
    </ScreenContainer>
  )
}
