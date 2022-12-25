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
  PopoverBody
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { SiteStyles } from '../../components/global'
import { HexColorPicker } from 'react-colorful'

const ColorPicker = ({ label, value, onColorChange = () => {} }) => {
  const [isColorOpen, setIsColorOpen] = useState(false)
  const [color, setColor] = useState()

  useEffect(() => {
    setColor(value)
  }, [value])

  useEffect(() => {
    if (color && String(color).length >= 3 && color !== value)
      validateHex(color) && onColorChange(color)
  }, [color])

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
                  bg={color}
                  borderRadius='md'
                  borderWidth='thin'
                  borderColor='#543d63'
                />
              </PopoverTrigger>
              <PopoverContent maxW='max-content' bg='#0f283d' border='none'>
                <PopoverArrow bg='#0f283d' />
                <PopoverBody cursor='default' maxW='max-content'>
                  <HexColorPicker onChange={val => setColor(val)} />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          }
        />
        <Input
          placeholder='#ffffff'
          {...SiteStyles.InputStyles}
          maxW='200px'
          value={color}
          onChange={e => setColor(e.target.value)}
        />
      </InputGroup>
    </VStack>
  )
}

export const ThemeComponents = {
  ColorPicker
}
