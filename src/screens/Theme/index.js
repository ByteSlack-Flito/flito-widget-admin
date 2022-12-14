import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ScreenContainer } from '../../components/global'
import { CustomTabs } from './components'
import { ThemeScreens } from './themeScreens'

export const TabProps = {
  _selected: {
    color: 'white',
    bg: '#d885ff30',
    borderBottomColor: 'transparent'
  },
  _active: {
    bg: '#d885ff30'
  },
  _hover: {
    bg: '#3181FF20'
  },
  bg: 'transparent',
  fontWeight: 'medium',
  fontSize: 'sm',
  color: 'whiteAlpha.700',
  size: 'sm',
  //   borderRadius: '5px',
  p: '1.5',
  pl: '4',
  pr: '4'
}

export const ThemeScreen = () => {
  const [currentTab, setCurrentTab] = useState(0)
  return (
    <ScreenContainer description="Manage your Widget's color and content">
      {/* <Tabs variant='enclosed' onChange={index => setCurrentTab(index)}>
        <TabList borderBottomColor='#d885ff30'>
          <Tab {...TabProps}>Steps Screen</Tab>
          <Tab {...TabProps}>Estimate Screen</Tab>
        </TabList>
        <TabPanels>
          <TabPanel pl='0'>
            <ThemeScreens.Steps />
          </TabPanel>
          <TabPanel pl='0'>
            <ThemeScreens.Estimate />
          </TabPanel>
        </TabPanels>
      </Tabs> */}

      <CustomTabs tabs={['Steps Screen']} tabProps={TabProps} tabContainerProps={{
        borderBottomColor: '#d885ff30'
      }}>
        <ThemeScreens.Steps />
        {/* <ThemeScreens.Estimate /> */}
      </CustomTabs>
    </ScreenContainer>
  )
}
