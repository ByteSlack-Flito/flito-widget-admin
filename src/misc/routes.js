import OnboardingScreen from '../screens/Onboarding'
import { Navigate } from 'react-router-dom'
import { MdOutlineWidgets, MdOutlineAttachMoney } from 'react-icons/md'
import { GiTeamIdea } from 'react-icons/gi'
import TeamScreen from '../screens/Team'
import PricingStrategyScreen from '../screens/PricingStrategy'
import WidgetScreen from '../screens/Widget'
import { TechStackScreen } from '../screens/TechStacks'

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
    Widget: {
      id: 1,
      label: 'Widget',
      Screens: () => {
        return {
          PricingStrategy: {
            id: 111,
            label: 'Pricing Strategy',
            icon: <MdOutlineAttachMoney />,
            path: `${ENGINE_ROUTE}/pricing-strategy`,
            element: <PricingStrategyScreen />
          },
          Widget: {
            id: 112,
            label: 'Get Code',
            icon: <MdOutlineWidgets />,
            path: `${ENGINE_ROUTE}/widget-code`,
            element: <WidgetScreen />
          }
        }
      }
    },
    TeamAndTech : {
      id: 2,
      label: 'Team & Tech',
      Screens: () => {
        return {
          MyTeam: {
            id: 221,
            icon: <GiTeamIdea />,
            label: 'My Team',
            path: `${ENGINE_ROUTE}/my-team`,
            element: <TeamScreen />
          },
          TechStacks: {
            id: 222,
            icon: <GiTeamIdea />,
            label: 'Tech Stacks',
            path: `${ENGINE_ROUTE}/my-tech-stack`,
            element: <TechStackScreen />
          },

        }
      }
    }
  }
}

/**
 *
 * @returns All the routes of the site
 */
export function getRoutes (location) {
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
