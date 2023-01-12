import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Checkbox,
  extendTheme,
  Flex,
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
import './index.css'

const init_state = {
  global: {
    welcomeTitle: 'Estimate Our Services In Seconds',
    welcomeSubtitle: 'Choose what services you want',
    backgroundColor: '#ffffff',
    textColor: '#000000'
  },
  options: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    hoverBackgroundColor: '#3182CE',
    hoverTextColor: '#ffffff'
  },
  nextButton: {
    backgroundColor: '#319795',
    textColor: '#ffffff',
    hoverBackgroundColor: '#2C7A7B',
    hoverTextColor: '#ffffff'
  },
  skipButton: {
    backgroundColor: '#A0AEC0',
    textColor: '#ffffff',
    hoverBackgroundColor: '#718096',
    hoverTextColor: '#ffffff'
  }
}

const Steps = () => {
  const { data, isFetching, isUpdating, update } = useWidget()
  const toast = useToastGenerator()
  const [globalStyles, setGlobalStyles] = useState(init_state.global)
  const [optionStyles, setOptionStyles] = useState(init_state.options)
  const [nextButtonStyles, setNextButtonStyles] = useState(
    init_state.nextButton
  )
  const [skipButtonStyles, setSkipButtonStyles] = useState(
    init_state.skipButton
  )

  function updateGlobal (key, val) {
    setGlobalStyles(prev => ({
      ...prev,
      [key]: val
    }))
  }
  function updateOptions (key, val) {
    setOptionStyles(prev => ({
      ...prev,
      [key]: val
    }))
  }
  function updateNextButton (key, val) {
    setNextButtonStyles(prev => ({
      ...prev,
      [key]: val
    }))
  }
  function updateSkipButton (key, val) {
    setSkipButtonStyles(prev => ({
      ...prev,
      [key]: val
    }))
  }

  async function performUpdate () {
    const data = {
      steps: {
        global: globalStyles,
        options: optionStyles,
        nextButton: nextButtonStyles,
        skipButton: skipButtonStyles
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
      setGlobalStyles(data.styles.steps?.global || init_state.global)
      setOptionStyles(data.styles.steps?.options || init_state.options)
      setNextButtonStyles(data.styles.steps?.nextButton || init_state.nextButton)
      setSkipButtonStyles(data.styles.steps?.skipButton || init_state.skipButton)
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
              // spacing='5'
            >
              <Accordion
                // allowMultiple
                defaultIndex={[0]}
                w='full'
                id='styling-according'
              >
                {/* Global Styles Section */}
                <AccordionItem
                  borderWidth='thin'
                  borderColor='blue.800'
                  borderRadius='md'
                  mb='2'
                >
                  <h2>
                    <AccordionButton
                      _hover={{
                        bg: '#09192750'
                      }}
                    >
                      <Flex textAlign='left' w='full'>
                        <Text>Global Styles</Text>
                      </Flex>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <VStack spacing='2'>
                      <Input
                        w='full'
                        {...SiteStyles.InputStyles}
                        placeholder='Welcome Title'
                        onChange={e =>
                          updateGlobal('welcomeTitle', e.target.value)
                        }
                        value={globalStyles.welcomeTitle}
                      />
                      <Input
                        w='full'
                        {...SiteStyles.InputStyles}
                        placeholder='Welcome Subtitle'
                        onChange={e =>
                          updateGlobal('welcomeSubtitle', e.target.value)
                        }
                        value={globalStyles.welcomeSubtitle}
                      />
                      <HStack w='full' spacing='5'>
                        <ThemeComponents.ColorPicker
                          label='Background Color'
                          value={globalStyles.backgroundColor}
                          onColorChange={val =>
                            updateGlobal('backgroundColor', val)
                          }
                        />
                        <ThemeComponents.ColorPicker
                          label='Text Color'
                          value={globalStyles.textColor}
                          onColorChange={val => updateGlobal('textColor', val)}
                        />
                      </HStack>
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>

                {/* Option Styles Section */}
                <AccordionItem
                  borderWidth='thin'
                  borderColor='blue.800'
                  borderRadius='md'
                  mb='2'
                >
                  <h2>
                    <AccordionButton
                      _hover={{
                        bg: '#09192750'
                      }}
                    >
                      <Flex textAlign='left' w='full'>
                        <Text>Option Styles</Text>
                      </Flex>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <HStack w='full' spacing='5'>
                      <ThemeComponents.ColorPicker
                        label='Background'
                        value={optionStyles.backgroundColor}
                        onColorChange={val =>
                          updateOptions('backgroundColor', val)
                        }
                      />
                      <ThemeComponents.ColorPicker
                        label='Text Color'
                        value={optionStyles.textColor}
                        onColorChange={val => updateOptions('textColor', val)}
                      />
                    </HStack>
                    <HStack w='full' spacing='5'>
                      <ThemeComponents.ColorPicker
                        label='Hover Background'
                        value={optionStyles.hoverBackgroundColor}
                        onColorChange={val =>
                          updateOptions('hoverBackgroundColor', val)
                        }
                      />
                      <ThemeComponents.ColorPicker
                        label='Hover Text Color'
                        value={optionStyles.hoverTextColor}
                        onColorChange={val =>
                          updateOptions('hoverTextColor', val)
                        }
                      />
                    </HStack>
                  </AccordionPanel>
                </AccordionItem>

                {/* Next Button Style Section */}
                <AccordionItem
                  borderWidth='thin'
                  borderColor='blue.800'
                  borderRadius='md'
                  mb='2'
                >
                  <h2>
                    <AccordionButton
                      _hover={{
                        bg: '#09192750'
                      }}
                    >
                      <Flex textAlign='left' w='full'>
                        <Text>Next Button Styles</Text>
                      </Flex>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <HStack w='full' spacing='5'>
                      <ThemeComponents.ColorPicker
                        label='Background'
                        value={nextButtonStyles.backgroundColor}
                        onColorChange={val =>
                          updateNextButton('backgroundColor', val)
                        }
                      />
                      <ThemeComponents.ColorPicker
                        label='Text Color'
                        value={nextButtonStyles.textColor}
                        onColorChange={val =>
                          updateNextButton('textColor', val)
                        }
                      />
                    </HStack>
                    <HStack w='full' spacing='5'>
                      <ThemeComponents.ColorPicker
                        label='Hover Background'
                        value={nextButtonStyles.hoverBackgroundColor}
                        onColorChange={val =>
                          updateNextButton('hoverBackgroundColor', val)
                        }
                      />
                      <ThemeComponents.ColorPicker
                        label='Hover Text Color'
                        value={nextButtonStyles.hoverTextColor}
                        onColorChange={val =>
                          updateNextButton('hoverTextColor', val)
                        }
                      />
                    </HStack>
                  </AccordionPanel>
                </AccordionItem>

                {/* Next Button Style Section */}
                <AccordionItem
                  borderWidth='thin'
                  borderColor='blue.800'
                  borderRadius='md'
                  mb='2'
                >
                  <h2>
                    <AccordionButton
                      _hover={{
                        bg: '#09192750'
                      }}
                    >
                      <Flex textAlign='left' w='full'>
                        <Text>Skip Button Styles</Text>
                      </Flex>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <HStack w='full' spacing='5'>
                      <ThemeComponents.ColorPicker
                        label='Background'
                        value={skipButtonStyles.backgroundColor}
                        onColorChange={val =>
                          updateSkipButton('backgroundColor', val)
                        }
                      />
                      <ThemeComponents.ColorPicker
                        label='Text Color'
                        value={skipButtonStyles.textColor}
                        onColorChange={val =>
                          updateSkipButton('textColor', val)
                        }
                      />
                    </HStack>
                    <HStack w='full' spacing='5'>
                      <ThemeComponents.ColorPicker
                        label='Hover Background'
                        value={skipButtonStyles.hoverBackgroundColor}
                        onColorChange={val =>
                          updateSkipButton('hoverBackgroundColor', val)
                        }
                      />
                      <ThemeComponents.ColorPicker
                        label='Hover Text Color'
                        value={skipButtonStyles.hoverTextColor}
                        onColorChange={val =>
                          updateSkipButton('hoverTextColor', val)
                        }
                      />
                    </HStack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </VStack>
            <Previewer>
              <PreviewerScreen.Steps
                background={globalStyles.backgroundColor}
                welcomeTitle={globalStyles.welcomeTitle}
                welcomeSubtitle={globalStyles.welcomeSubtitle}
                textColor={globalStyles.textColor}
                optionColor={optionStyles.backgroundColor}
                optionTextColor={optionStyles.textColor}
                optionHoverColor={optionStyles.hoverBackgroundColor}
                optionHoverTextColor={optionStyles.hoverTextColor}
                nextButtonColor={nextButtonStyles.backgroundColor}
                nextButtonTextColor={nextButtonStyles.textColor}
                nextButtonHoverColor={nextButtonStyles.hoverBackgroundColor}
                nextButtonHoverTextColor={nextButtonStyles.hoverTextColor}
                skipButtonColor={skipButtonStyles.backgroundColor}
                skipButtonTextColor={skipButtonStyles.textColor}
                skipButtonHoverColor={skipButtonStyles.hoverBackgroundColor}
                skipButtonHoverTextColor={skipButtonStyles.hoverTextColor}
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
  const [expectationnextButtonStyles, setExpectationnextButtonStyles] =
    useState({
      text: 'Set Expectation',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      hoverBackgroundColor: '#ffffff',
      hoverTextColor: '#ffffff'
    })

  const [ctanextButtonStyles, setCTAnextButtonStyles] = useState({
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
    setExpectationnextButtonStyles(prev => ({
      ...prev,
      [key]: val
    }))
  }
  function updateCTAButton (key, val) {
    setCTAnextButtonStyles(prev => ({
      ...prev,
      [key]: val
    }))
  }

  async function performUpdate () {
    const data = {
      estimate: {
        global: globalStyles,
        expectationButton: expectationnextButtonStyles,
        ctaButton: ctanextButtonStyles
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
      setExpectationnextButtonStyles(data.styles.estimate.expectationButton)
      setCTAnextButtonStyles(data.styles.estimate.ctaButton)
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
            <VStack
              position='relative'
              w='full'
              maxW='full'
              h='full'
              overflowX='hidden'
            >
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
                    value={expectationnextButtonStyles.text}
                  />
                  <HStack w='full' spacing='5'>
                    <ThemeComponents.ColorPicker
                      label='Background'
                      value={expectationnextButtonStyles.backgroundColor}
                      onColorChange={val =>
                        updateExpectationButton('backgroundColor', val)
                      }
                    />
                    <ThemeComponents.ColorPicker
                      label='Text Color'
                      value={expectationnextButtonStyles.textColor}
                      onColorChange={val =>
                        updateExpectationButton('textColor', val)
                      }
                    />
                  </HStack>
                  <HStack w='full' spacing='5'>
                    <ThemeComponents.ColorPicker
                      label='Hover Background'
                      value={expectationnextButtonStyles.hoverBackgroundColor}
                      onColorChange={val =>
                        updateExpectationButton('hoverBackgroundColor', val)
                      }
                    />
                    <ThemeComponents.ColorPicker
                      label='Hover Text Color'
                      value={expectationnextButtonStyles.hoverTextColor}
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
                      updateCTAButton('enabled', !ctanextButtonStyles.enabled)
                    }
                  >
                    Enable Calendly CTA
                  </Checkbox>
                  {ctanextButtonStyles.enabled && (
                    <VStack w='full'>
                      <Input
                        w='full'
                        {...SiteStyles.InputStyles}
                        placeholder='Ex. https://calendly.com/your_scheduling_page'
                        onChange={e =>
                          updateCTAButton('calendlyLink', e.target.value)
                        }
                        value={ctanextButtonStyles.calendlyLink}
                      />
                      <Input
                        w='full'
                        {...SiteStyles.InputStyles}
                        placeholder='CTA Button Text'
                        onChange={e => updateCTAButton('text', e.target.value)}
                        value={ctanextButtonStyles.text}
                      />
                      <HStack w='full' spacing='5'>
                        <ThemeComponents.ColorPicker
                          label='Background'
                          value={ctanextButtonStyles.backgroundColor}
                          onColorChange={val =>
                            updateCTAButton('backgroundColor', val)
                          }
                        />
                        <ThemeComponents.ColorPicker
                          label='Text Color'
                          value={ctanextButtonStyles.textColor}
                          onColorChange={val =>
                            updateCTAButton('textColor', val)
                          }
                        />
                      </HStack>
                      <HStack w='full' spacing='5'>
                        <ThemeComponents.ColorPicker
                          label='Hover Background'
                          value={ctanextButtonStyles.hoverBackgroundColor}
                          onColorChange={val =>
                            updateCTAButton('hoverBackgroundColor', val)
                          }
                        />
                        <ThemeComponents.ColorPicker
                          label='Hover Text Color'
                          value={ctanextButtonStyles.hoverTextColor}
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
                    {...SiteStyles.nextButtonStyles}
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
                  ...expectationnextButtonStyles
                }}
                ctaButton={{
                  ...ctanextButtonStyles
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
