import OnboardingScreen from '../screens/Onboarding'
import { Navigate } from 'react-router-dom'
import {
  MdOutlineWidgets,
  MdOutlineAttachMoney,
  MdDashboardCustomize
} from 'react-icons/md'
import { GiTeamIdea } from 'react-icons/gi'
import TeamScreen from '../screens/Team'
import PricingStrategyScreen from '../screens/PricingStrategy'
import WidgetScreen from '../screens/Widget'
import { TechStackScreen } from '../screens/TechStacks'
import { BiCodeAlt } from 'react-icons/bi'
import { AiOutlineAppstoreAdd } from 'react-icons/ai'
import ProjectRequestScreen from '../screens/ProjectRequests'
import { BsCalendarDate, BsTools } from 'react-icons/bs'
import { IntegrationsScreen } from '../screens/Integrations'
import { IoColorPaletteOutline } from 'react-icons/io5'
import { ThemeScreen } from '../screens/Theme'
import { IoIosApps } from 'react-icons/io'
import { ServiceBuilderScreen } from '../screens/ServiceBuilder'
import { FiBox } from 'react-icons/fi'
import CreateFeature from '../screens/ServiceBuilder/FeatureList/createFeature'
import CreateBundle from '../screens/ServiceBuilder/Bundles/createBundle'

const ENGINE_ROUTE = '/engine'
const PROJECT_ROUTE = `${ENGINE_ROUTE}/project/:projectId`

export const SiteRoutes = {
  Onboarding: {
    NotFound: {
      id: 100,
      label: '404',
      path: '*',
      element: <Navigate to={'/'} />
    },
    Init: {
      id: 101,
      label: 'Onboarding',
      path: '/',
      element: <OnboardingScreen />
    },
    InitWithParams: {
      id: 102,
      label: 'Onboarding',
      path: '/welcomeProject/:projectId',
      element: <OnboardingScreen />
    }
  },

  Engine: {
    Setup: {
      id: 2,
      label: 'Quick Setup',
      Screens: () => {
        return {
          Init: {
            path: '/',
            ignoreRendering: true,
            element: <Navigate to={`${ENGINE_ROUTE}/my-tech-stack`} />
          },
          MyServices: {
            id: 201,
            icon: <AiOutlineAppstoreAdd />,
            label: 'My Services',
            path: `${ENGINE_ROUTE}/my-services`,
            element: <TechStackScreen />
          },
          ServiceBuilder: {
            id: 202,
            label: 'Service Bundles',
            icon: <FiBox />,
            path: `${ENGINE_ROUTE}/service-bundles`,
            element: <ServiceBuilderScreen />
          },
          CreateBundle: {
            id: 202,
            label: 'Create Bundles',
            path: `${ENGINE_ROUTE}/service-bundles/create-bundle`,
            ignoreRendering: true,
            element: <CreateBundle />
          },
          CreateService: {
            id: 20201,
            label: 'Create Feature',
            icon: <FiBox />,
            path: `${ENGINE_ROUTE}/service-bundles/create-feature`,
            ignoreRendering: true,
            element: <CreateFeature />
          },
          MyTeam: {
            id: 203,
            icon: <GiTeamIdea />,
            label: 'My Team',
            path: `${ENGINE_ROUTE}/my-team`,
            ignoreRendering: true,
            element: <TeamScreen />
          }
          // PricingStrategy: {
          //   id: 204,
          //   label: 'Pricing Strategy',
          //   icon: <MdOutlineAttachMoney />,
          //   path: `${ENGINE_ROUTE}/pricing-strategy`,
          //   element: <PricingStrategyScreen />
          // }
        }
      }
    },

    Widget: {
      id: 4,
      label: 'The Widget',
      Screens: () => {
        return {
          Widget: {
            id: 401,
            label: 'Get Code',
            icon: <BiCodeAlt />,
            path: `${ENGINE_ROUTE}/widget-code`,
            element: <WidgetScreen />
          },
          Requests: {
            id: 402,
            label: 'Requests',
            icon: <MdDashboardCustomize />,
            path: `${ENGINE_ROUTE}/widget-requests`,
            element: <ProjectRequestScreen />
          },
          Theme: {
            id: 403,
            label: 'Color & Content',
            icon: <IoColorPaletteOutline />,
            path: `${ENGINE_ROUTE}/theme-setup`,
            ignoreRendering: true,
            element: <ThemeScreen />
          }
        }
      }
    }
  }
}

/**
 *
 * @returns All the routes of the site
 */
export function getRoutes () {
  const onboardingRoutes = Object.keys(SiteRoutes.Onboarding).map(prop => {
    const initRoute = SiteRoutes.Onboarding[prop]
    if (initRoute.Screens) {
      initRoute.screens = Object.keys(initRoute.Screens()).map(screenProp => {
        return initRoute.Screens()[screenProp]
      })
    }
    return initRoute
  })

  const engineRoutes = Object.keys(SiteRoutes.Engine).map(prop => {
    const initRoute = SiteRoutes.Engine[prop]
    if (initRoute.Screens) {
      initRoute.screens = Object.keys(initRoute.Screens()).map(screenProp => {
        return initRoute.Screens()[screenProp]
      })
    }
    return initRoute
  })
  return {
    Onboarding: onboardingRoutes,
    Engine: engineRoutes
  }
}

/**
 * Returns the route with added parameters.
 *
 * @param {string} route The exact route of the screen.
 * @param {string} param Any value as string to be added at the end of the route or URL.
 */
export function constructRoute (path, param) {
  const noParamRoute = String(path).split(':')[0]
  return noParamRoute.at(-1) === '/'
    ? `${noParamRoute}${param}`
    : `${noParamRoute}/${param}`
}
