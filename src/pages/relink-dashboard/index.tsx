// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import RelinkDomains from '../relink-domains'
import Customers from '../customers'

const RelinkDashboard = () => {
  // ** State
  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <TabList onChange={handleChange} aria-label='icon tabs example'>
        <Tab value='1' label='Bulk Domains' icon={<Icon icon='uil:create-dashboard' />} />
        <Tab value='2' label='Customers' icon={<Icon icon='mdi:accounts-group-outline' />} />
      </TabList>
      <TabPanel value='1'>
        <RelinkDomains />
      </TabPanel>
      <TabPanel value='2'>
        <Customers />
      </TabPanel>
    </TabContext>
  )
}

export default RelinkDashboard;

RelinkDashboard.acl = {
  action: 'read',
  subject: 'admin-page'
}