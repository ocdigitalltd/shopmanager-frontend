
// ** React Imports
import { useState, useCallback, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import { tpMiscSettings } from 'src/@db-api/types'
import baseUrl from 'src/configs/bkUrl'

// ** ThirdParty Components
import axios from 'axios'
import CronSettingsEdit from 'src/@core/layouts/components/page-components/CronSettingsEditForm'

const MiscSettings = () => {
  // ** State
  const [cronSettings, setCronSettings] = useState<tpMiscSettings[]>([])

  const fetchData = useCallback(
    async () => {
      await axios
        .get(`${baseUrl}/parsingSettings/cron`)
        .then(res => {
          setCronSettings(res.data.data as unknown as tpMiscSettings[])
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      {cronSettings && cronSettings?.filter(set => set.processType !== "domain-creation")?.map((setting) => (
        <>
          <Card key={setting.id} sx={{ my: 10 }}>
            <CronSettingsEdit data={setting} />
          </Card>
        </>
      ))}
    </>
  )
}

export default MiscSettings
