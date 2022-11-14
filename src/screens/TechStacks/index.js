import { Button, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { AiOutlineDesktop } from 'react-icons/ai'
import { HiOutlineCursorClick } from 'react-icons/hi'
import { ImMobile } from 'react-icons/im'
import { ScreenContainer } from '../../components/global'
import { AppTypeSingle } from './components'

const AppTypes = [
  {
    icon: <ImMobile size={14} />,
    value: 'mobile-app',
    title: 'Mobile App',
    description: 'Native & Hybrid Apps For Cross-Platform Devices',
    platforms: ['Android', 'iOS', 'AndroidTV', 'tvOS', 'watchOS', 'wearOS']
  },
  {
    icon: <HiOutlineCursorClick size={14} />,
    value: 'web-app',
    title: 'Web App',
    description: 'Responsive Website and Web Apps for modern browsers.',
    platforms: ['Static Websites', 'SPA', 'PWA']
  },
  {
    icon: <AiOutlineDesktop size={14} />,
    value: 'desktop-app',
    title: 'Desktop App',
    description: 'Classic Desktop Applications that run locally.',
    platforms: ['Windows', 'Linux', 'macOS']
  }
]

export const TechStackScreen = () => {
  const [selectedAppTypes, setSelectedAppTypes] = useState([])

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
          {selectedAppTypes?.length > 0 && (
            <Text fontWeight='bold' fontSize='sm'>
              Select platforms
            </Text>
          )}

          <HStack align='flex-start' w='full'>
            {selectedAppTypes?.map(({ appType }) => {
              const { platforms } = AppTypes.find(x => x.value === appType)
              return platforms.map(platform => {
                const isSelected = selectedAppTypes
                  .find(x => x.appType === appType)
                  ?.platforms?.some(x => x === platform)
                return (
                  <Button
                    size='xs'
                    colorScheme={!isSelected ? 'gray' : 'blue'}
                    borderWidth='thin'
                    borderColor={!isSelected ? 'gray.300' : 'blue.400'}
                    onClick={() => updateSelectedAppTypes(appType, platform)}
                  >
                    {platform}
                  </Button>
                )
              })
            })}
          </HStack>
        </VStack>
      </SimpleGrid>
      <Button
        size='sm'
        colorScheme='teal'
        variant='solid'
        fontWeight='semibold'
        mt='7'
        // rightIcon={<FiArrowRight />}
        // onClick={goNext}
        // disabled={!isTypeLengthValid()}
      >
        Update Preferences
      </Button>
    </ScreenContainer>
  )
}
