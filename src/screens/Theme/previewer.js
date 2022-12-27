import {
  Box,
  Button,
  HStack,
  Input,
  SimpleGrid,
  Text,
  VStack
} from '@chakra-ui/react'
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

const Estimate = ({
  title,
  goodbyeText,
  background,
  estimatorBackground,
  textColor,
  estimatorTextColor,
  expectationButton,
  ctaButton
}) => (
  <VStack
    w='full'
    h='400px'
    bg={background}
    justify='center'
    align='center'
    borderRadius='md'
    textAlign='center'
    spacing='8'
  >
    <Text fontSize='lg' fontWeight='medium' color={textColor}>
      {title}
    </Text>
    <VStack
      bg={estimatorBackground}
      color={estimatorTextColor}
      p='6'
      pb='3'
      borderRadius='md'
      spacing='5'
      w='70%'
    >
      <SimpleGrid columns={2} spacing='3' w='full'>
        {generateArray(2).map((x, index) => (
          <VStack key={index} align='flex-start' justify='flex-start'>
            <Text fontSize='xs' fontWeight='thin'>
              {index == 0 ? 'Budget in $' : 'Timeline'}
            </Text>
            <Text fontSize='2xl' fontWeight='normal'>
              {index == 0 ? '$1000' : '1 Week'}
            </Text>
            <Text fontSize='xs' fontWeight='thin'>
              Rough Estimation
            </Text>
            <Button
              transition='all 0ms'
              color={expectationButton?.textColor}
              bg={expectationButton?.backgroundColor}
              size='xs'
              borderRadius='md'
              _active={{
                bg: expectationButton?.hoverBackgroundColor
              }}
              _hover={{
                bg: expectationButton?.hoverBackgroundColor,
                color: expectationButton?.hoverTextColor
              }}
            >
              {expectationButton?.text}
            </Button>
          </VStack>
        ))}
      </SimpleGrid>
      {!ctaButton?.enabled ? (
        <Text fontSize='xs' fontWeight='medium' color={estimatorTextColor}>
          {goodbyeText}
        </Text>
      ) : (
        <SimpleGrid w='full' columns={2} gap='1' textAlign='left'>
          <Text fontSize='xs' fontWeight='medium' color={estimatorTextColor}>
            {goodbyeText}
          </Text>
          <VStack w='full' h='full' justify='center' align='flex-end'>
            <Button
              transition='all 0ms'
              color={ctaButton?.textColor}
              bg={ctaButton?.backgroundColor}
              size='xs'
            //   pl='2'
            //   pr='2'
              borderRadius='md'
              _active={{
                bg: ctaButton?.hoverBackgroundColor
              }}
              _hover={{
                bg: ctaButton?.hoverBackgroundColor,
                color: ctaButton?.hoverTextColor
              }}
            >
              {ctaButton?.text}
            </Button>
          </VStack>
        </SimpleGrid>
      )}
    </VStack>
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
  Steps,
  Estimate
}
