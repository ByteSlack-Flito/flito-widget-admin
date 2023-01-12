import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  SimpleGrid,
  Text,
  VStack
} from '@chakra-ui/react'
import { BsArrowRightShort } from 'react-icons/bs'
import { SiteStyles } from '../../components/global'
import { generateArray } from '../../misc/logics'
import TinyColor from 'tinycolor2'

const Steps = ({
  welcomeTitle,
  welcomeSubtitle,
  background,
  textColor,
  optionColor,
  optionTextColor,
  optionHoverColor,
  optionHoverTextColor,
  nextButtonColor,
  nextButtonTextColor,
  nextButtonHoverColor,
  nextButtonHoverTextColor,

  skipButtonColor,
  skipButtonTextColor,
  skipButtonHoverColor,
  skipButtonHoverTextColor
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
    spacing='0.5'
  >
    <Text fontSize='xl' fontWeight='normal' color={textColor}>
      {welcomeTitle}
    </Text>
    <Text fontSize='sm' fontWeight='thin' color={textColor}>
      {welcomeSubtitle}
    </Text>
    <Flex gap='3' w='full' justify='center' pt='3'>
      {generateArray(2).map((x, index) => (
        <VStack
          align='flex-start'
          justify='flex-start'
          textAlign='left'
          transition='all 200ms'
          key={index}
          color={optionTextColor}
          borderWidth='thin'
          borderColor={TinyColor(optionColor).darken(10).toString()}
          size='sm'
          borderRadius='5px'
          bg={optionColor}
          _active={{
            bg: optionHoverColor
          }}
          _hover={{
            borderColor: optionHoverColor,
            bg: optionHoverColor,
            color: optionHoverTextColor
          }}
          maxW='150px'
          p='2'
          pl='3'
          pr='3'
          userSelect='none'
          cursor='pointer'
        >
          <Text fontSize='0.80rem'>Option</Text>
          <Text fontSize='0.70rem' fontWeight='normal'>
            Quick overview of the service/feature
          </Text>
        </VStack>
      ))}
    </Flex>
    <Box height='10px' />
    <Flex gap='3'>
      <Button
        transition='all 200ms'
        size='xs'
        variant='solid'
        bg={nextButtonColor}
        color={nextButtonTextColor}
        _active={{
          bg: nextButtonHoverColor
        }}
        _hover={{
          bg: nextButtonHoverColor,
          color: nextButtonHoverTextColor
        }}
        // p='0 !important'
        borderRadius='5px'
        rightIcon={<BsArrowRightShort />}
      >
        Next Button
      </Button>

      <Button
        transition='all 200ms'
        size='xs'
        variant='solid'
        bg={skipButtonColor}
        color={skipButtonTextColor}
        _active={{
          bg: skipButtonHoverColor
        }}
        _hover={{
          bg: skipButtonHoverColor,
          color: skipButtonHoverTextColor
        }}
        // p='0 !important'
        borderRadius='5px'
      >
        Skip Button
      </Button>
    </Flex>
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
