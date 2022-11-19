import { Player } from '@lottiefiles/react-lottie-player'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import LoginScreen from './screens/login'
import SignUpScreen from './screens/signUp'
import Logo from '../../logo-trans.png'
import { useSelector } from 'react-redux'
import { getDatabase, get, child, ref } from 'firebase/database'
import {
  Box,
  Grid,
  GridItem,
  Image,
  Input,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Tabs,
  Button,
  InputGroup
} from '@chakra-ui/react'

export default ({}) => {
  const firebaseApp = useSelector(state => state.firebaseApp.instance)
  const params = useParams()

  return (
    <Grid
      templateColumns='repeat(8, 1fr)'
      templateRows='repeat(4, 1fr)'
      height='100%'
      // bgGradient='linear(to-tr, #261dfd, #cd7ffc, #fcd045)'
      bg='#2f6cff14'
    >
      <GridItem
        rowStart={2}
        rowEnd={4}
        colStart={4}
        colEnd={6}
        p='0'
        minH='400'
      >
        <Box
          h='100%'
          w='100%'
          boxShadow='lg'
          borderWidth='thin'
          borderColor='gray.100'
          borderRadius='md'
          bg='white'
          p='4'
          pt='2'
          justifyContent='center'
        >
          <Grid templateColumns='repeat(3, 1fr)'>
            <GridItem colStart={2} p='0'>
              <Image
                boxSize='60px'
                objectFit='contain'
                src={Logo}
                alt='Flito Logo'
                ml='4'
              />
            </GridItem>
          </Grid>

          <Spacer height='2' />
          <Tabs isFitted>
            <TabList mb='1em'>
              <Tab
                _selected={{
                  borderColor: '#6565fe',
                  color: '#6565fe',
                  fontWeight: 'semibold'
                }}
                color='#4a65ff34'
                transition='all 300ms'
              >
                Sign In
              </Tab>
              <Tab
                _selected={{
                  borderColor: '#6565fe',
                  color: '#6565fe',
                  fontWeight: 'semibold'
                }}
                color='#4a65ff50'
                transition='all 300ms'
              >
                Create Account
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel p='0'>
                <LoginScreen />
              </TabPanel>
              <TabPanel p='0'>
                <SignUpScreen />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </GridItem>
    </Grid>
  )
}
