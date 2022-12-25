import { Button, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { SiteStyles } from '../../components/global'
import { generateArray } from '../../misc/logics'

const Steps = ({
  welcomeText,
  background,
  textColor,
  buttonColor,
  buttonTextColor,
  buttonHoverColor,
  buttonHoverTextColor
}) => (
  <VStack
    w='full'
    h='300px'
    bg={background}
    justify='center'
    align='center'
    borderRadius='md'
    pl='4'
    pr='4'
    textAlign='center'
  >
    <Text fontSize='xl' fontWeight='medium' color={textColor}>
      {welcomeText}
    </Text>
    <HStack>
      {generateArray(2).map((x, index) => (
        <Button
          transition='all 0ms'
          key={index}
          color={buttonTextColor}
          bg={buttonColor}
          size='sm'
          borderRadius='md'
          _active={{
            bg: buttonHoverColor
          }}
          _hover={{
            bg: buttonHoverColor,
            color: buttonHoverTextColor
          }}
        >
          Option {index + 1}
        </Button>
      ))}
    </HStack>
  </VStack>
)

export const Previewer = ({ children }) => (
  <VStack spacing='5' align='flex-start'>
    <Text fontSize='xl' fontWeight='normal' color='white'>
      Live Preview
    </Text>
    {children}
  </VStack>
)

export const PreviewerScreen = {
  Steps
}
