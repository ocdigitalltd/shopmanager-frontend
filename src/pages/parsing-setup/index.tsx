// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports

// ** ThirdParty Components
import axios from 'axios'

// ** Custom Components

// ** Types Imports
import { WarehousesRowType } from 'src/@db-api/types'

// ** Utils Import
import baseUrl from 'src/configs/bkUrl'
import ParsingConditions from 'src/@core/layouts/components/page-components/ParsingConditionsTable'
import FallbackSpinner from 'src/@core/components/spinner'
import { Divider } from '@mui/material'


const ParsingSetup = () => {
  // ** States

  const [rows, setRows] = useState<WarehousesRowType[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchTablesData = useCallback(
    async () => {
      setLoading(true)
      await axios
        .get(`${baseUrl}/parsingSettings/warehouses`)
        .then(res => {
          setRows(res.data?.list as unknown as WarehousesRowType[])
          setLoading(false)
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    fetchTablesData()
  }, [fetchTablesData])

  return (
    <>
      {loading && <FallbackSpinner />}
      {rows.map((row) => (
        <div key={row.id}>
          <ParsingConditions warehouse={row} />
          <Divider sx={{ my: 5, p: 4 }} orientation='horizontal' />
        </div>
      ))}
    </>
  )
}

export default ParsingSetup;

ParsingSetup.acl = {
  action: 'read',
  subject: 'admin-page'
}