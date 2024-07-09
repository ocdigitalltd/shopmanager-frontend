// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  // {
  //   action: 'read',
  //   subject: 'user-page',
  //   path: '/profile',
  //   title: 'My Profile',
  //   icon: 'gg:profile',
  // },
  {
    action: 'read',
    subject: 'user-page',
    path: '/products',
    title: 'My Products',
    icon: 'gg:list',
  },
  
  // {
  //   title: 'Shopify GOLDEN',
  //   path: '/shopify-golden',
  //   icon: 'mdi:shopify',
  // },
  {
    title: 'Message Templates',
    path: '/message-templates',
    icon: 'mdi:chat-bubble',
  },
  {
    title: 'Relink Dashboard',
    icon: 'mdi:shield-outline',
    children: [
      {
        title: 'Parsed NFC Orders',
        path: '/relink-shop',
        icon: 'mdi:qrcode-scan',
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
]

export default navigation
