import { Badge, Box, HStack, Text, VStack } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { BsCheck2, BsCheckAll, BsFillCheckCircleFill } from 'react-icons/bs'
import { SiteStyles } from '../../../components/global'
import './components.css'

function getSelectedStyle (selected) {
  if (selected)
    return {
      // bgGradient: 'linear(to-tr, #7928CA, #FF0080)',
      // borderWidth: 'medium',
      bg: '#0f283d',
      borderWidth: 'thin',
      borderColor: 'transparent',
      color: 'white',
      _hover: {
        color: 'white'
        // borderColor: 'blue.300'
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
      {...SiteStyles.ClickableContainer}
      onClick={() => onSelectChange(value)}
      justifyContent='space-between'
      {...getSelectedStyle(isSelected)}
    >
      <VStack textAlign='left' align='flex-start'>
        <HStack>
          <AnimatePresence mode='wait'>
            <motion.div
              key={isSelected}
              initial={{ x: 10, opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              style={{
                width: '20px'
              }}
            >
              {isSelected ? <BsFillCheckCircleFill color='white' /> : icon}
            </motion.div>
          </AnimatePresence>
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
