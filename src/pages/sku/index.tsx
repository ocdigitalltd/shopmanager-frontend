// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid'
import { Box, IconButton } from '@mui/material'

// ** ThirdParty Components
import axios from 'axios'

// ** Custom Components
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'

// ** Types Imports
import { SortType } from 'src/@db-api/types'

// ** Utils Import
import baseUrl from 'src/configs/bkUrl'
import { formatDateTime } from '../customers'
import Icon from 'src/@core/components/icon'
import { utDownloadExcelFile } from 'src/@core/utils/excel'
import AddSkuDialog from 'src/@core/layouts/components/page-components/AddSkuDialog'
import { deleteSku } from 'src/@db-api/relink/relinkApi'

export interface SkuRowType{
  id: string,
  sku: string,
  created_at: string
}

const columns = (
  onReload: () => void,
): GridColDef[] => ([
  {
    field: 'sku',
    flex: 0.35,
    headerName: 'SKU',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.sku}
      </Typography>
    )
  },
  {
    type: 'date',
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
    flex: 0.30,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton title="Delete" color='error' onClick={() => deleteSku(params.row.id, onReload)}>
          <Icon icon='mdi:delete-outline' fontSize={25} />
        </IconButton>
      </Box>
    )
  },
])

const Sku = () => {
  // ** States
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('desc')
  const [rows, setRows] = useState<SkuRowType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [sortColumn, setSortColumn] = useState<string>('created_at')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [open, setOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('')

  const handleClearSelection = () => setSelectedRows([])
  const handleRowSelectionChange = (rowSelectionModel: GridRowSelectionModel) => {
    const selectedRowIds = rowSelectionModel as string[];
    setSelectedRows(selectedRowIds);
  };

  const fetchTableData = useCallback(
    async (sort: SortType, q: string, paginationModel: { page: number; pageSize: number }, column: string) => {
      setLoading(true)
      await axios
        .get(`${baseUrl}/relink-email/sku`, {
          params: {
            q,
            ...paginationModel,
            sort,
            column,
            searchText
          }
        })
        .then(res => {
          setTotal((res.data?.total as number) ?? 10)
          setRows(res.data?.list as unknown as SkuRowType[])
          setLoading(false)
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paginationModel, searchText]
  )

  const exportAllToExcel = useCallback(
    async (sort: SortType, q: string, paginationModel: { page: number, pageSize: number }, column: string) => {
      setLoading(true)
      await axios
        .get(`${baseUrl}/relink-email/sku`, {
          params: {
            q: '',
            ...{ paginationModel },
            sort,
            column
          },
        })
        .then(async res => {
          const data = res.data?.list as unknown as SkuRowType[];
          const dataWithUpdatedColumnsName = data.map(item => {
            return {
              SKU: item.sku,
              'Created At': formatDateTime(item.created_at!)
            }
          })
          await utDownloadExcelFile(dataWithUpdatedColumnsName, 'SKU')
          setLoading(false);
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
        <CardHeader title='Sku' />
        <DataGrid
          autoHeight
          pagination
          keepNonExistentRowsSelected
          rows={rows}
          rowCount={total}
          getRowId={(row) => (row.id)}
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={handleRowSelectionChange}
          columns={columns(
            () => fetchTableData(sort, '', paginationModel, sortColumn),
          )}
          loading={loading}
          checkboxSelection
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
              setSearchText: (text: string) => setSearchText(text),
              searchPlaceholder: 'Search by sku',
              exportAll: () => exportAllToExcel(sort, '', { page: 0, pageSize: total }, sortColumn),
              showAllRecords: () => fetchTableData(sort, '', { page: 0, pageSize: total }, sortColumn),
              refreshData: () => fetchTableData(sort, '', paginationModel, sortColumn),
              onClearSelection: handleClearSelection,
              isSelectionEmpty: selectedRows.length === 0,
              addButton: "Add new",
              onClickAdd: () => { setOpen(true) }
            }
          }}
        />
      </Card>
      <AddSkuDialog
        open={open}
        handleClose={() => setOpen(false)}
        maxWidth="sm"
        onReload={() => fetchTableData(sort, '', paginationModel, sortColumn)}
      />
    </>
  )
}

export default Sku;

Sku.acl = {
  action: 'read',
  subject: 'admin-page'
}