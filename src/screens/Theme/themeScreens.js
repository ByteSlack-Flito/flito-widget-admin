import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { SiteStyles, useToastGenerator } from '../../components/global'
import { useWidget } from '../../data/database/users/profile'
import { ThemeComponents } from './components'
import { Previewer, PreviewerScreen } from './previewer'

const Steps = () => {
  const { data, isFetching, isUpdating, update } = useWidget()
  const toast = useToastGenerator()
  const [dataSetFromAPI, setDataSetFromAPI] = useState(false)
  const [globalStyles, setGlobalStyles] = useState({
    welcomeText: 'Estimate your app in seconds',
    backgroundColor: '#ffffff',
    textColor: '#000000'
  })
  const [buttonStyles, setButtonStyles] = useState({
    backgroundColor: '#ffffff',
    textColor: '#000000',
    hoverBackgroundColor: '#ffffff',
    hoverTextColor: '#ffffff'
  })

  function updateGlobal (key, val) {
    setGlobalStyles(prev => ({
      ...prev,
      [key]: val
    }))
  }
  function updateButton (key, val) {
    setButtonStyles(prev => ({
      ...prev,
      [key]: val
    }))
  }

  async function performUpdate () {
    const data = {
      steps: {
        global: globalStyles,
        button: buttonStyles
      }
    }

    const result = await update({
      styles: data
    })

    if (result.success) {
      toast.show(result)
    }
  }

  useEffect(() => {
    if (data?.styles?.steps) {
      if (!dataSetFromAPI) {
        setGlobalStyles(data.styles.steps.global)
        setButtonStyles(data.styles.steps.button)
        // setDataSetFromAPI(true)
        console.log('called...')
      }
    }
  }, [data])

  return (
    <VStack w='full' spacing='3' align='flex-start'>
      {isFetching && <Spinner size='lg' color='blue.400' />}
      {!isFetching && data && (
        <SimpleGrid columns={2} gap='5' w='full'>
          <VStack
            fontSize='sm'
            fontWeight='medium'
            align='flex-start'
            spacing='5'
          >
            <VStack
              spacing='3'
              // bg='#14344f'
              borderWidth='thin'
              borderColor='teal'
              borderStyle='dashed'
              p='3'
              pl='3'
              pr='3'
              borderRadius='md'
              w='full'
              align='flex-start'
            >
              <Text fontSize='md' fontWeight='light'>
                Global Style
              </Text>
              <Input
                w='full'
                {...SiteStyles.InputStyles}
                placeholder='Welcome Message'
                onChange={e => updateGlobal('welcomeText', e.target.value)}
                value={globalStyles.welcomeText}
              />
              <HStack w='full' spacing='5'>
                <ThemeComponents.ColorPicker
                  label='Background Color'
                  value={globalStyles.backgroundColor}
                  onColorChange={val => updateGlobal('backgroundColor', val)}
                />
                <ThemeComponents.ColorPicker
                  label='Text Color'
                  value={globalStyles.textColor}
                  onColorChange={val => updateGlobal('textColor', val)}
                />
              </HStack>
            </VStack>
            <VStack
              spacing='3'
              // bg='#14344f'
              borderWidth='thin'
              borderColor='teal'
              borderStyle='dashed'
              p='3'
              pl='3'
              pr='3'
              borderRadius='md'
              w='full'
              align='flex-start'
            >
              <Text fontSize='md' fontWeight='light'>
                Button Style
              </Text>
              <HStack w='full' spacing='5'>
                <ThemeComponents.ColorPicker
                  label='Background'
                  value={buttonStyles.backgroundColor}
                  onColorChange={val => updateButton('backgroundColor', val)}
                />
                <ThemeComponents.ColorPicker
                  label='Text Color'
                  value={buttonStyles.textColor}
                  onColorChange={val => updateButton('textColor', val)}
                />
              </HStack>
              <HStack w='full' spacing='5'>
                <ThemeComponents.ColorPicker
                  label='Hover Background'
                  value={buttonStyles.hoverBackgroundColor}
                  onColorChange={val =>
                    updateButton('hoverBackgroundColor', val)
                  }
                />
                <ThemeComponents.ColorPicker
                  label='Hover Text Color'
                  value={buttonStyles.hoverTextColor}
                  onColorChange={val => updateButton('hoverTextColor', val)}
                />
              </HStack>
            </VStack>
          </VStack>
          <Previewer>
            <PreviewerScreen.Steps
              background={globalStyles.backgroundColor}
              welcomeText={globalStyles.welcomeText}
              textColor={globalStyles.textColor}
              buttonColor={buttonStyles.backgroundColor}
              buttonTextColor={buttonStyles.textColor}
              buttonHoverColor={buttonStyles.hoverBackgroundColor}
              buttonHoverTextColor={buttonStyles.hoverTextColor}
            />
          </Previewer>
        </SimpleGrid>
      )}
      {!isFetching && data && (
        <Button
          {...SiteStyles.ButtonStyles}
          onClick={performUpdate}
          isLoading={isUpdating}
        >
          Update Style
        </Button>
      )}
    </VStack>
  )
}

const Estimate = () => {
  return <></>
}

export const ThemeScreens = {
  Steps,
  Estimate
}
