import { Badge, Box, HStack, Text, VStack } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { BsCheck2 } from 'react-icons/bs'

function getSelectedStyle (selected) {
  if (selected)
    return {
      // bgGradient: 'linear(to-tr, #7928CA, #FF0080)',
      // borderWidth: 'medium',
      bg: 'blue.500',
      borderColor: 'blue.300',
      color: 'white',
      _hover: {
        color: 'white',
        borderColor: 'blue.300'
      }
    }
}

export const AppTypeSingle = ({
  isSelected,
  icon,
  value,
  platforms,
  selectedPlatforms,
  title,
  description,
  onSelectChange
}) => {
  return (
    <Box
      transition='all 200ms'
      w='100%'
      h='100%'
      p='5'
      borderWidth='thin'
      borderColor='gray.300'
      borderRadius='md'
      color='gray.600'
      cursor={'pointer'}
      _hover={{
        borderColor: 'blue.300',
        color: 'blue.500',
        shadow: 'md'
      }}
      onClick={() => onSelectChange(value)}
      userSelect='none'
      justifyContent='space-between'
      {...getSelectedStyle(isSelected)}
    >
      <VStack textAlign='left' align='flex-start'>
        <HStack>
          {icon}
          <Text fontSize='md' fontWeight='normal' display='flex'>
            {title}
          </Text>
        </HStack>
        <Text fontWeight='thin' fontSize='sm'>
          {description}
        </Text>
      </VStack>
    </Box>
  )
}
