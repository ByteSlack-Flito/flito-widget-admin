import { TabProps } from '../Theme'
import { CustomTabs } from '../Theme/components'
import { FeatureList } from './FeatureList'
import { BundleList } from './Bundles'

export const ServiceBuilderScreen = () => {
  return (
    <CustomTabs
      tabs={['Bundles', 'Feature List']}
      tabProps={TabProps}
      tabContainerProps={{
        borderBottomColor: '#d885ff30'
      }}
    >
      <ServiceBuilderScreens.BundleList />
      <ServiceBuilderScreens.FeatureList />
    </CustomTabs>
  )
}

const ServiceBuilderScreens = {
  FeatureList,
  BundleList
}
