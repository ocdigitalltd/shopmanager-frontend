// ** React Imports
import { Fragment, useCallback, useEffect } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { Breakpoint } from '@mui/material/styles'
import { CustomerDomainsType, SortType } from 'src/@db-api/types'
import { Card, CardHeader, Typography } from '@mui/material'

// ** React Imports
import { useState } from 'react'
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid'
import axios from 'axios'
import baseUrl from 'src/configs/bkUrl'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'
import { formatDateTime } from 'src/pages/customers'
import { deleteCustomerDomain } from 'src/@db-api/relink/relinkApi'
import Icon from 'src/@core/components/icon'

type dialogProps = {
  maxWidth: Breakpoint,
  handleClose: () => void,
  open: boolean,
  customerId: string | null
}

const getIconFromUrlType = (type: string) => {
  let urlIcon = <></>
  switch (type) {
    case "Google": {
      urlIcon = <Icon icon='mdi:google' fontSize={20} />
      break;
    }
    case "Instagram": {
      urlIcon = <Icon icon='mdi:instagram' fontSize={20} />
      break;
    }
    case "Facebook": {
      urlIcon = <Icon icon='mdi:facebook' fontSize={20} />
      break;
    }
    case "Whatsapp": {
      urlIcon = <Icon icon='mdi:whatsapp' fontSize={20} />
      break;
    }
    case "Trip-Advisor": {
      urlIcon = <Icon icon='bxl:trip-advisor' fontSize={20} />
      break;
    }
    default: {
      urlIcon = <></>
      break;
    }
  }

  return urlIcon
}

const columns = (onReloadData: () => void): GridColDef[] => ([
  {
    field: 'businessUrlType',
    minWidth: 50,
    headerName: 'Type',
    renderCell: (params: GridRenderCellParams) => (
      getIconFromUrlType(params.row.businessUrlType)
    )
  },
  {
    field: 'thirdLvlDomain',
    minWidth: 150,
    headerName: 'Domain',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.thirdLvlDomain}
      </Typography>
    )
  },
  {
    field: 'redirectUrl',
    minWidth: 450,
    headerName: 'Redirect Url',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.redirectUrl}
      </Typography>
    )
  },
  {
    minWidth: 170,
    field: 'id',
    headerName: 'Actions',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => {

      return (
        <>
          <Button
            size='small'
            color='error'
            variant='outlined'
            onClick={() => deleteCustomerDomain(params.row.id, onReloadData)}
            disabled={params.row.source === 'parsing'}
          >Delete</Button>
        </>
      )
    }
  },
  {
    type: 'date',
    minWidth: 200,
    headerName: 'Created At',
    field: 'created_at',
    valueGetter: params => new Date(params.value),
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {formatDateTime(params.row.created_at)}
      </Typography>
    )
  }
])

const CustomerDomainsDialog = ({ maxWidth, open, handleClose, customerId }: dialogProps) => {
  // ** States
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('desc')
  const [rows, setRows] = useState<CustomerDomainsType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [sortColumn, setSortColumn] = useState<string>('created_at')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleRowSelectionChange = (rowSelectionModel: GridRowSelectionModel) => {
    const selectedRowIds = rowSelectionModel as string[];
    setSelectedRows(selectedRowIds);
  };

  const fetchTableData = useCallback(
    async (
      sort: SortType, q: string,
      paginationModel: { page: number, pageSize: number },
      column: string, id: string | null
    ) => {
      setLoading(true)
      await axios
        .get(`${baseUrl}/customer/products/${id}`, {
          params: {
            q,
            ...paginationModel,
            sort,
            column
          }
        })
        .then(res => {
          setTotal(res.data?.total as number ?? 10)
          setRows(res.data?.list as unknown as CustomerDomainsType[])
          setLoading(false)
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paginationModel]
  )

  useEffect(() => {
    if (open && customerId) fetchTableData(sort, '', paginationModel, sortColumn, customerId)
  }, [fetchTableData, paginationModel, sort, sortColumn, open, customerId])

  const handleSortModel = (newModel: GridSortModel) => {
    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)
      fetchTableData(newModel[0].sort, '', paginationModel, newModel[0].field, customerId)
    } else {
      setSort('asc')
      setSortColumn('name')
    }
  }

  return (
    <Fragment>
      <Dialog
        open={open}
        maxWidth={maxWidth}
        fullWidth={true}
        onClose={handleClose}
        aria-labelledby='max-width-dialog-title'
        sx={{minHeight: "30vh"}}
      >
        <DialogContent>
          <Card>
            <CardHeader title='Other Domains' />
            <DataGrid
              autoHeight
              pagination
              keepNonExistentRowsSelected
              rows={rows}
              rowCount={total}
              getRowId={row => row.id}
              rowSelectionModel={selectedRows}
              onRowSelectionModelChange={handleRowSelectionChange}
              columns={columns(() => fetchTableData(sort, '', paginationModel, sortColumn, customerId))}
              loading={loading}
              sortingMode='server'
              paginationMode='server'
              pageSizeOptions={[5, 10, 25, 50]}
              paginationModel={paginationModel}
              onSortModelChange={handleSortModel}
              slots={{ toolbar: ServerSideToolbar }}
              onPaginationModelChange={setPaginationModel}
              disableColumnFilter
              disableRowSelectionOnClick
              slotProps={{
                baseButton: {
                  variant: 'outlined'
                },
                toolbar: {
                  // showAllRecords: () => fetchTableData(sort, '', { page: 0, pageSize: total }, sortColumn, customerId),
                  refreshData: () => fetchTableData(sort, '', paginationModel, sortColumn, customerId)
                }
              }}
            />
          </Card>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default CustomerDomainsDialog
