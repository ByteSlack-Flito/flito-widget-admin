import './App.css'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Logo from './logo-trans.png'
import CompanyLogo from './comapny_thumb.png'
import {
  Footer,
  Header,
  PopupAlert,
  Slider,
  SubTitle,
  Title
} from './components/global'
import { getRoutes, SiteRoutes } from './misc/routes'
import { Menu, ProfileMenu } from './components/menu'
import { Provider, useDispatch } from 'react-redux'
import store from './data/reducers'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Constants } from './data/constants'
import { FirebaseActions } from './data/actions'
import { AuthActions, ProfileActions } from './data/actions/userActions'
import { DropDown, ExtendedButton, Input, Button } from './components/form'
import { Formik } from 'formik'
import { StringHelper } from './data/extensions/stringHelper'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FcVip } from 'react-icons/fc'
import { getProfileInitials } from './misc/logics'
import { FaCentercode } from 'react-icons/fa'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { HiChevronDown } from 'react-icons/hi'
import { IoExitOutline, IoHelpOutline } from 'react-icons/io5'
import {
  ChakraProvider,
  Grid,
  GridItem,
  Spinner,
  Spacer,
  Image,
  Menu as ChakraMenu,
  MenuItem,
  MenuList,
  MenuButton,
  Button as ChakraButton,
  Avatar,
  Text,
  HStack
} from '@chakra-ui/react'
import { FiUser } from 'react-icons/fi'

function App () {
  //#region Setting site metadata
  useEffect(() => {
    document.title = Constants.Site.title
  }, [])
  useEffect(() => {
    ChartJS.register(ArcElement, Tooltip, Legend)
  }, [])
  //#endregion

  return (
    <ChakraProvider>
      <Provider store={store}>
        <div className='App'>
          <ScreenRenderer />
        </div>
      </Provider>
    </ChakraProvider>
  )
}

export default App

function ScreenRenderer () {
  const userState = useSelector(state => state.user)
  const firebaseApp = useSelector(state => state.firebaseApp)
  const location = useLocation()
  const navigate = useNavigate()
  const routes = getRoutes()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({
      type: FirebaseActions.INIT,
      data: {}
    })
    if (userState.profile?.userId) {
      navigate(
        location.pathname === '/'
          ? SiteRoutes.Engine.Dashboard.path
          : location.pathname,
        true
      )
    }
  }, [userState.profile?.userId])

  useEffect(() => {
    dispatch({
      type: AuthActions.PERFORM_SIGNIN_LOCAL,
      data: {}
    })
  }, [firebaseApp.instance])

  function getMenuItems () {
    return location.pathname.includes('/project/')
      ? routes.Project
      : routes.Engine
  }

  const { SUCCESS, ERROR, LOADING } = Constants.LoadingState

  if (firebaseApp.instance) {
    if (userState.loadingState == LOADING) {
      return (
        <>
          <div className='main spinner-fullScreen'>
            <Spinner size='xl' color='blue.400' />
          </div>
        </>
      )
    } else if (userState.loadingState == SUCCESS && userState.profile?.userId) {
      return (
        <Grid
          templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
          gridTemplateRows={'50px 1fr 30px'}
          gridTemplateColumns={'240px 1fr'}
          h='100%'
          color='blackAlpha.700'
          fontWeight='bold'
        >
          <GridItem pl='2' pr='2' bg='white' shadow='sm' area={'header'}>
            <Header/>
          </GridItem>
          <GridItem
            area={'nav'}
            shadow='7px 0px 15px 0px rgba(69,149,255,0.12)'
            pl='1'
            pr='2'
            zIndex='3'
          >
            <Spacer h='2' />
            <Menu data={getMenuItems()} />
          </GridItem>
          <GridItem pl='4' area={'main'} overflow='scroll'>
            <Routes>
              {routes.Engine.map((route, index) => {
                return !route.screens ? (
                  <Route index={index == 0} {...route} key={route.id} />
                ) : (
                  route.screens.map(subRoute => {
                    return <Route {...subRoute} key={subRoute.id} />
                  })
                )
              })}
            </Routes>
          </GridItem>
          <GridItem pl='2' area={'footer'} bg='#f5f0ff'>
            <Footer />
          </GridItem>
        </Grid>
      )
    } else {
      return (
        <Routes>
          {routes.Onboarding.map(route => {
            return !route.screens ? (
              <Route {...route} key={route.id} />
            ) : (
              route.screens.map(subRoute => {
                return <Route {...subRoute} key={subRoute.id} />
              })
            )
          })}
        </Routes>
      )
    }
  }
}
