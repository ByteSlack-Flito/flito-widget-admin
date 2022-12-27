import {
  Button,
  Checkbox,
  extendTheme,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  SimpleGrid,
  Spinner,
  Switch,
  Text,
  VStack
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { SiteStyles, useToastGenerator } from '../../components/global'
import { useWidget } from '../../data/database/users/profile'
import { ThemeComponents } from './components'
import { Previewer, PreviewerScreen } from './previewer'
import { motion } from 'framer-motion'

const Steps = () => {
  const { data, isFetching, isUpdating, update } = useWidget()
  const toast = useToastGenerator()
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
      setGlobalStyles(data.styles.steps.global)
      setButtonStyles(data.styles.steps.button)
      // setDataSetFromAPI(true)
    }
  }, [data])

  return (
    <VStack w='full' spacing='3' align='flex-start'>
      {isFetching && <Spinner size='lg' color='blue.400' />}
      {!isFetching && data && (
        <motion.div
          style={{ width: '100%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key='steps'
        >
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
                <InputGroup>
                  <InputLeftAddon
                    children={'Welcome:'}
                    bg='#14344f'
                    border='none'
                  />
                  <Input
                    w='full'
                    {...SiteStyles.InputStyles}
                    placeholder='Type Welcome Message'
                    onChange={e => updateGlobal('welcomeText', e.target.value)}
                    value={globalStyles.welcomeText}
                  />
                </InputGroup>
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
        </motion.div>
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
  const { data, isFetching, isUpdating, update } = useWidget()
  const toast = useToastGenerator()
  const [globalStyles, setGlobalStyles] = useState({
    title: 'Estimate for {appName}',
    goodbyeText:
      'We have received your request. Someone from our team will contact you.',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    estimatorBackground: '#ffffff',
    estimatorTextColor: '#000000'
  })
  const [expectationButtonStyles, setExpectationButtonStyles] = useState({
    text: 'Set Expectation',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    hoverBackgroundColor: '#ffffff',
    hoverTextColor: '#ffffff'
  })

  const [ctaButtonStyles, setCTAButtonStyles] = useState({
    enabled: false,
    calendlyLink: '',
    text: 'Set Up Call',
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
  function updateExpectationButton (key, val) {
    setExpectationButtonStyles(prev => ({
      ...prev,
      [key]: val
    }))
  }
  function updateCTAButton (key, val) {
    setCTAButtonStyles(prev => ({
      ...prev,
      [key]: val
    }))
  }

  async function performUpdate () {
    const data = {
      estimate: {
        global: globalStyles,
        expectationButton: expectationButtonStyles,
        ctaButton: ctaButtonStyles
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
    if (data?.styles?.estimate) {
      setGlobalStyles(data.styles.estimate.global)
      setExpectationButtonStyles(data.styles.estimate.expectationButton)
      setCTAButtonStyles(data.styles.estimate.ctaButton)
    }
  }, [data])

  return (
    <VStack
      id='estimator-screen-styler'
      h='full'
      w='full'
      spacing='3'
      align='flex-start'
    >
      {isFetching && <Spinner size='lg' color='blue.400' />}
      {!isFetching && data && (
        <motion.div
          style={{ width: '100%', overflow: 'hidden', height: '100%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key='estimate'
        >
          <SimpleGrid columns={2} gap='5' w='full' h='full'>
            <VStack position='relative' w='full' maxW='full' h='full' overflowX='hidden'>
              <VStack
                fontSize='sm'
                fontWeight='medium'
                align='flex-start'
                spacing='5'
                w='full'
                overflowY='scroll'
                overflowX='hidden'
                position='absolute'
                top='0'
                bottom='0'
                left='0'
                right='0'
                maxW='100%'
                // maxH={StyleContainerMaxH}
              >
                <VStack
                  spacing='3'
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
                    Content
                  </Text>
                  <InputGroup>
                    <InputLeftAddon
                      children={'Title:'}
                      bg='#14344f'
                      border='none'
                    />
                    <Input
                      w='full'
                      {...SiteStyles.InputStyles}
                      placeholder="Type title. Include {appName} to show app's name"
                      onChange={e => updateGlobal('title', e.target.value)}
                      value={globalStyles.title}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon
                      children={'Goodbye:'}
                      bg='#14344f'
                      border='none'
                    />
                    <Input
                      w='full'
                      {...SiteStyles.InputStyles}
                      placeholder='Type Goodbye Message'
                      onChange={e =>
                        updateGlobal('goodbyeText', e.target.value)
                      }
                      value={globalStyles.goodbyeText}
                    />
                  </InputGroup>
                </VStack>
                <VStack
                  spacing='3'
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
                    Estimation Box Style
                  </Text>
                  <HStack w='full' spacing='5'>
                    <ThemeComponents.ColorPicker
                      label='Background'
                      value={globalStyles.estimatorBackground}
                      onColorChange={val =>
                        updateGlobal('estimatorBackground', val)
                      }
                    />
                    <ThemeComponents.ColorPicker
                      label='Text Color'
                      value={globalStyles.estimatorTextColor}
                      onColorChange={val =>
                        updateGlobal('estimatorTextColor', val)
                      }
                    />
                  </HStack>
                  <Text fontSize='md' fontWeight='light' pt='3'>
                    "Set Expectation" Button Style
                  </Text>
                  <Input
                    w='full'
                    {...SiteStyles.InputStyles}
                    placeholder='Expectation Button Text'
                    onChange={e =>
                      updateExpectationButton('text', e.target.value)
                    }
                    value={expectationButtonStyles.text}
                  />
                  <HStack w='full' spacing='5'>
                    <ThemeComponents.ColorPicker
                      label='Background'
                      value={expectationButtonStyles.backgroundColor}
                      onColorChange={val =>
                        updateExpectationButton('backgroundColor', val)
                      }
                    />
                    <ThemeComponents.ColorPicker
                      label='Text Color'
                      value={expectationButtonStyles.textColor}
                      onColorChange={val =>
                        updateExpectationButton('textColor', val)
                      }
                    />
                  </HStack>
                  <HStack w='full' spacing='5'>
                    <ThemeComponents.ColorPicker
                      label='Hover Background'
                      value={expectationButtonStyles.hoverBackgroundColor}
                      onColorChange={val =>
                        updateExpectationButton('hoverBackgroundColor', val)
                      }
                    />
                    <ThemeComponents.ColorPicker
                      label='Hover Text Color'
                      value={expectationButtonStyles.hoverTextColor}
                      onColorChange={val =>
                        updateExpectationButton('hoverTextColor', val)
                      }
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
                    CTA Style
                  </Text>
                  <Checkbox
                    onChange={() =>
                      updateCTAButton('enabled', !ctaButtonStyles.enabled)
                    }
                  >
                    Enable Calendly CTA
                  </Checkbox>
                  {ctaButtonStyles.enabled && (
                    <VStack w='full'>
                      <Input
                        w='full'
                        {...SiteStyles.InputStyles}
                        placeholder='Ex. https://calendly.com/your_scheduling_page'
                        onChange={e =>
                          updateCTAButton('calendlyLink', e.target.value)
                        }
                        value={ctaButtonStyles.calendlyLink}
                      />
                      <Input
                        w='full'
                        {...SiteStyles.InputStyles}
                        placeholder='CTA Button Text'
                        onChange={e => updateCTAButton('text', e.target.value)}
                        value={ctaButtonStyles.text}
                      />
                      <HStack w='full' spacing='5'>
                        <ThemeComponents.ColorPicker
                          label='Background'
                          value={ctaButtonStyles.backgroundColor}
                          onColorChange={val =>
                            updateCTAButton('backgroundColor', val)
                          }
                        />
                        <ThemeComponents.ColorPicker
                          label='Text Color'
                          value={ctaButtonStyles.textColor}
                          onColorChange={val =>
                            updateCTAButton('textColor', val)
                          }
                        />
                      </HStack>
                      <HStack w='full' spacing='5'>
                        <ThemeComponents.ColorPicker
                          label='Hover Background'
                          value={ctaButtonStyles.hoverBackgroundColor}
                          onColorChange={val =>
                            updateCTAButton('hoverBackgroundColor', val)
                          }
                        />
                        <ThemeComponents.ColorPicker
                          label='Hover Text Color'
                          value={ctaButtonStyles.hoverTextColor}
                          onColorChange={val =>
                            updateCTAButton('hoverTextColor', val)
                          }
                        />
                      </HStack>
                    </VStack>
                  )}
                </VStack>
                <VStack>
                  <Button
                    {...SiteStyles.ButtonStyles}
                    onClick={performUpdate}
                    isLoading={isUpdating}
                  >
                    Update Style
                  </Button>
                </VStack>
              </VStack>
            </VStack>
            <Previewer>
              <PreviewerScreen.Estimate
                background={data?.styles?.steps?.global?.backgroundColor}
                estimatorBackground={globalStyles.estimatorBackground}
                estimatorTextColor={globalStyles.estimatorTextColor}
                title={globalStyles.title}
                goodbyeText={globalStyles.goodbyeText}
                textColor={data?.styles?.steps?.global?.textColor}
                expectationButton={{
                  ...expectationButtonStyles
                }}
                ctaButton={{
                  ...ctaButtonStyles
                }}
              />
            </Previewer>
          </SimpleGrid>
        </motion.div>
      )}
    </VStack>
  )
}

export const ThemeScreens = {
  Steps,
  Estimate
}
