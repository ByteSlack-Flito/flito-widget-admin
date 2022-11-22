import { Box, HStack, VStack, Text, Button, Link } from '@chakra-ui/react'
import React from 'react'
import { BiCheckCircle, BiXCircle } from 'react-icons/bi'
import { IoColorPaletteOutline } from 'react-icons/io5'
import { DiReact } from 'react-icons/di'
import { Link as ReactRouterLink } from 'react-router-dom'
import { BsCode, BsCodeSlash } from 'react-icons/bs'
import { TbTestPipeOff } from 'react-icons/tb'
import { FaAws } from 'react-icons/fa'
import { MdDevices, MdOutlineManageAccounts } from 'react-icons/md'
import '../index.css'

/**
 *
 * @param {object} props The component props
 * @param {'success' | 'error'} props.type The type of info to show.
 * @param {''} props.title The title.
 * @param {Object} props.description The description.
 */
export const InfoBox = ({ type, title, description }) => {
  return type === 'success' ? (
    <HStack
      bg='#f1e8fc'
      color='#5d06c7'
      pl='2'
      pr='4'
      pt='2'
      pb='2'
      borderLeftWidth='medium'
      borderLeftColor='#5d06c7'
      borderRadius='sm'
      align='flex-start'
      borderRightRadius='md'
    >
      <BiCheckCircle size='16' style={{ marginTop: '1px' }} />
      <VStack fontSize='xs' fontWeight='medium'>
        <Text className='infobox_title'>
          {title}
          <br style={{ lineHeight: '10px' }} />
          <span className='infobox_desc' style={{ fontWeight: 'normal' }}>
            {description}
          </span>
        </Text>
      </VStack>
    </HStack>
  ) : (
    <HStack
      bg='#fce8e8'
      color='red.700'
      pl='2'
      pr='4'
      pt='2'
      pb='2'
      borderLeftWidth='medium'
      borderLeftColor='red.600'
      borderRadius='sm'
      align='flex-start'
      borderRightRadius='md'
    >
      <BiXCircle size='16' style={{ marginTop: '1px' }} />
      <VStack fontSize='xs' fontWeight='medium'>
        <Text className='infobox_title'>
          {title}
          <br style={{ lineHeight: '10px' }} />
          <span className='infobox_desc' style={{ fontWeight: 'normal' }}>
            {description}
          </span>
        </Text>
      </VStack>
    </HStack>
  )
}

const Role_Icons = ({ size = '20', color = '#000' }) => ({
  'Front-End Developer': <DiReact size={size} color={color} />,
  'Back-End Developer': <BsCode size={size} color={color} />,
  'QA Tester': <TbTestPipeOff size={size} color={color} />,
  'DevOps Engineer': <FaAws size={size} color={color} />,
  'Project Manager': <MdOutlineManageAccounts size={size} color={color} />,
  'UI-Designer': <IoColorPaletteOutline size={size} color={color} />,
  'UX-Designer': <MdDevices size={size} color={color} />
})

const shadowColor = index => {
  const colors = ['83,140,255', '253,83,255', '255,147,83']
  return colors[index] || colors[0]
}

export const RoleBox = ({ index, role, rate, currency, roleCount}) => {
  return (
    <VStack
      h='max-content'
      w='full'
      boxShadow={`-2px 13px 23px -5px rgba(${shadowColor(index)},0.19)`}
      borderRadius='md'
      borderWidth='thin'
      borderColor='gray.100'
      pl='4'
      pr='4'
      pt='2'
      pb='2'
      minW='200px'
      maxW='250px'
      align='flex-start'
    >
      <HStack align='flex-start'>
        <Box p='1' borderRadius='full' bg='gray.100' color={shadowColor(index)}>
          {
            Role_Icons({
              color: `rgb(${shadowColor(index)})`
            })[role]
          }
        </Box>
        <VStack spacing='0' align='flex-start'>
          <Text fontSize='sm' fontWeight='normal'>
            {role}
          </Text>
          <Text fontSize='xx-small' fontWeight='bold'>
            {roleCount} People
          </Text>
          <Text fontSize='sm' fontWeight='thin' pt='2'>
            {rate} {currency}
          </Text>
        </VStack>
      </HStack>
    </VStack>
  )
}
