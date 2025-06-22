import E404 from '@app/pages/error/E404'
import HomePage from '@app/pages/home/HomePage'
import Default from '@app/layout/Default'
import Section from '@app/pages/home/Section'
import StoryDetail from '@app/pages/home/StoryDetail'
import StoryInformation from '@app/pages/home/StoryInformation'
import SectionContainer from '@app/pages/home/SectionContainer'

export type RouteInfo = {
  path: string
  element?: JSX.Element
  layout?: JSX.Element
  roles?: string[]
  children?: RouteInfo[]
}

/**
 * Export constant for paths
 */
export const paths = {}

export function replaceRouteParam(route: string, params: object) {
  return route.replace(/:(\w+)/g, (_, key) => {
    // @ts-ignore
    return params[key] !== undefined ? params[key] : `:${key}`
  })
}

/**
 * Define application routes
 * @returns
 */
export const useInitRoutes = (): RouteInfo[] => {
  return [
    {
      path: '/',
      layout: <Default />,
      children: [
        {
          path: '',
          element: <HomePage />,
        },
      ],
    },
    {
      path: '/search',
      layout: <Default />,
      children: [
        {
          path: '',
          element: <SectionContainer key='search' />,
        },
      ],
    },
    {
      path: '/novel/:slug',
      layout: <Default />,
      children: [
        {
          path: '',
          element: <StoryInformation />,
        },
      ],
    },
    {
      path: '/novel/:slug/:chapter',
      layout: <Default />,
      children: [
        {
          path: '',
          element: <StoryDetail />,
        },
      ],
    },
    {
      path: '*',
      element: <E404 />,
    },
  ]
}
