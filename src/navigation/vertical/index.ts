// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (isAdmin: boolean): VerticalNavItemsType => {
  const routes = [
    {
      action: 'read',
      subject: 'user-page',
      path: '/products',
      title: 'My Products',
      icon: 'gg:list',
    },
    
    // {
    //   subject: 'admin-page',
    //   title: 'Shopify Orders',
    //   path: '/shopify-golden',
    //   icon: 'mdi:shopify',
    // },
    {
      title: 'Relink Dashboard',
      icon: 'mdi:shield-outline',
      children: [
        {
          title: 'Parsed NFC Orders',
          path: '/relink-shop',
          icon: 'mdi:qrcode-scan',
          subject: 'admin-page',
        },
        {
          path: '/relink-domains',
          subject: 'admin-page',
          title: 'Domains Creation',
          icon: 'uil:create-dashboard',
        },
        {
          title: 'Customers',
          icon: 'mdi:accounts-group-outline',
          path: '/customers',
          subject: 'admin-page',
        },
      ]
    },
    {
      title: 'Parsing Settings',
      icon: 'mdi:settings-outline',
      children: [
        {
          subject: 'admin-page',
          title: 'Message Templates',
          path: '/message-templates',
          icon: 'mdi:chat-bubble',
        },
        {
          title: 'Channels Setup',
          path: '/channels',
          icon: 'mdi:store-settings-outline',
          subject: 'admin-page',
        },
        {
          path: '/parsing-setup',
          subject: 'admin-page',
          title: 'Conditions/Parameters',
          icon: 'uil:create-dashboard',
        },
        {
          title: 'SKU setup',
          path: '/sku',
          icon: 'uil:create-dashboard',
          subject: 'admin-page',
        },
        {
          title: 'Cron Schedule',
          icon: 'mdi:timer-outline',
          path: '/misc-settings',
          subject: 'admin-page',
        },
      ]
    },
  ]
  if(isAdmin) return routes.filter(rt => rt.path !== '/products') 
  else return routes
}

export default navigation
