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
                  <HexColorPicker onChange={val => updateColor(val)} />
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
