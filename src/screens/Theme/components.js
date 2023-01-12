import {
  Box,
  VStack,
  Text,
  InputGroup,
  Input,
  InputLeftElement,
  InputRightElement,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  HStack
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { SiteStyles } from '../../components/global'
import { HexColorPicker } from 'react-colorful'
import { motion, AnimatePresence } from 'framer-motion'

const ColorPicker = ({ label, value, onColorChange = () => {} }) => {
  const [isColorOpen, setIsColorOpen] = useState(false)

  function updateColor (color) {
    if (validateHex(color)) {
      onColorChange(color)
    }
  }

  /**
   * Validates if given value is a valid 3-digit or 6-digit hex-color code
   * @param {*} hexCode
   */
  function validateHex (hexCode) {
    const hexRegex = /^#([0-9a-f]{3}){1,2}$/i
    return hexRegex.test(hexCode)
  }
  return (
    <VStack justify='flex-start' align='flex-start'>
      <Text>{label}</Text>
      <InputGroup>
        <InputRightElement
          cursor='pointer'
          border='none'
          p='1'
          zIndex={isColorOpen ? '99' : '1'}
          children={
            <Popover
              placement='right'
              onOpen={() => setIsColorOpen(true)}
              onClose={() => setIsColorOpen(false)}
            >
              <PopoverTrigger>
                <Box
                  w='full'
                  h='full'
                  bg={value}
                  borderRadius='md'
                  borderWidth='thin'
                  borderColor='#543d63'
                />
              </PopoverTrigger>
              <PopoverContent maxW='max-content' bg='#0f283d' border='none'>
                <PopoverArrow bg='#0f283d' />
                <PopoverBody cursor='default' maxW='max-content'>
                  <HexColorPicker
                    color={value}
                    onChange={val => updateColor(val)}
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          }
        />
        <Input
          placeholder='#ffffff'
          {...SiteStyles.InputStyles}
          maxW='200px'
          value={value}
          onChange={e => updateColor(e.target.value)}
        />
      </InputGroup>
    </VStack>
  )
}

export const ThemeComponents = {
  ColorPicker
}

export const CustomTabs = ({
  containerProps,
  tabProps,
  tabContainerProps,
  tabs,
  children
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  function renderTab () {
    if (children)
      return (
        <motion.div
          key={`${tabs[currentIndex]}${currentIndex}`}
          style={{ width: '100%', height: '100%', overflowY: 'scroll' }}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
        >
          {Array.isArray(children) ? children[currentIndex] : children}
        </motion.div>
      )
  }

  const getTabProps = index =>
    index == currentIndex
      ? {
          ...tabProps,
          ...tabProps._selected
        }
      : {
          ...tabProps
        }
  return (
    <VStack
      w='full'
      h='full'
      justify='flex-start'
      align='flex-start'
      {...containerProps}
    >
      <HStack
        w='full'
        h='max-content'
        borderBottomWidth='thin'
        {...tabContainerProps}
      >
        {tabs.map((label, index) => (
          <Button
            key={`${label}${index}`}
            {...getTabProps(index)}
            borderBottomRadius='none'
            onClick={() => setCurrentIndex(index)}
          >
            {label}
          </Button>
        ))}
      </HStack>
      <AnimatePresence mode='wait'>{renderTab()}</AnimatePresence>
    </VStack>
  )
}
