// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid'
import { Box, IconButton } from '@mui/material'

// ** ThirdParty Components
import axios from 'axios'

// ** Custom Components
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'

// ** Types Imports
import { SortType, ParsingConditionRowType, WarehousesRowType } from 'src/@db-api/types'

// ** Utils Import
import baseUrl from 'src/configs/bkUrl'
import Icon from 'src/@core/components/icon'
import { formatDateTime } from 'src/pages/customers'
import { deleteCondition } from 'src/@db-api/parsingSettings/warehouses'
import AddParsingConditionDialog from './AddParsingConditionDialog'
import { utDownloadExcelFile } from 'src/@core/utils/excel'

const columns = (
  onReload: () => void,
): GridColDef[] => ([
  {
    field: 'condType',
    flex: 0.25,
    minWidth: 150,
    headerName: 'Type',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.condType}
      </Typography>
    )
  },
  {
    field: 'condValue',
    minWidth: 190,
    flex: 0.25,
    headerName: 'Value',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.condValue}
      </Typography>
    )
  },
  {
    type: 'date',
    minWidth: 200,
    flex: 0.35,
    headerName: 'Created At',
    field: 'created_at',
    valueGetter: params => new Date(params.value),
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {formatDateTime(params.row.created_at)}
      </Typography>
    )
  },
  {
    minWidth: 115,
    flex: 0.15,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton disabled={params.row.email === "NA"} title="Delete" color='error' onClick={() => deleteCondition(params.row.id, onReload)}>
          <Icon icon='mdi:delete-outline' fontSize={25} />
        </IconButton>
      </Box>
    )
  }
])

const ParsingConditions = ({warehouse}:{warehouse: WarehousesRowType}) => {
  // ** States
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('desc')
  const [rows, setRows] = useState<ParsingConditionRowType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [sortColumn, setSortColumn] = useState<string>('created_at')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [open, setOpen] = useState(false);

  const fetchTableData = useCallback(
    async (sort: SortType, q: string, paginationModel: { page: number, pageSize: number }, column: string) => {
      setLoading(true)
      await axios
        .get(`${baseUrl}/parsingSettings/conditions/${warehouse.id}`, {
          params: {
            q,
            ...paginationModel,
            sort,
            column
          }
        })
        .then(res => {
          setTotal(res.data?.total as number ?? 10)
          setRows(res.data?.list as unknown as ParsingConditionRowType[])
          setLoading(false)
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paginationModel]
  )

  const exportAllToExcel = useCallback(
    async (sort: SortType, q: string, paginationModel: { page: number, pageSize: number }, column: string) => {
      setLoading(true)
      await axios
        .get(`${baseUrl}/parsingSettings/conditions/${warehouse.id}`, {
          params: {
            q: q,
            ...paginationModel,
            sort,
            column
          }
        })
        .then(async res => {
          const data = res.data?.list as unknown as ParsingConditionRowType[]
          const dataWithUpdatedColumnsName = data.map(item => {
            return {
              Type: item.condType,
              Value: item.condValue,
              'Created At': formatDateTime(item.created_at!)
            }
          })
          await utDownloadExcelFile(dataWithUpdatedColumnsName, 'parsing-setup')
          setLoading(false)
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paginationModel]
  )

  useEffect(() => {
    fetchTableData(sort, '', paginationModel, sortColumn)
  }, [fetchTableData, paginationModel, sort, sortColumn])

  const handleSortModel = (newModel: GridSortModel) => {
    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)
      fetchTableData(newModel[0].sort, '', paginationModel, newModel[0].field)
    } else {
      setSort('asc')
      setSortColumn('name')
    }
  }

  return (
    <>
      <Card>
        <CardHeader title={`${warehouse.name}`} />
        <DataGrid
          autoHeight
          pagination
          rows={rows}
          rowCount={total}
          getRowId={(row) => (row.id)}
          columns={columns(
            () => fetchTableData(sort, '', paginationModel, sortColumn),
          )}
          loading={loading}
          checkboxSelection={false}
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
              exportAll: () => exportAllToExcel(sort, '', { page: 0, pageSize: total }, sortColumn),
              refreshData: () => fetchTableData(sort, '', paginationModel, sortColumn),
              showAllRecords: () => fetchTableData(sort, '', { page: 0, pageSize: total }, sortColumn),
              addButton: "Add new",
              onClickAdd: () => { setOpen(true);}
            }
          }}
        />
      </Card>
      <AddParsingConditionDialog
        open={open}
        handleClose={() => setOpen(false)}
        maxWidth="sm"
        onReload={() => fetchTableData(sort, '', paginationModel, sortColumn)}
        warehouse={warehouse}
      />
    </>
  )
}

export default ParsingConditions;

ParsingConditions.acl = {
  action: 'read',
  subject: 'admin-page'
}