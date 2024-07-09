// ** React Imports
import { useEffect, useState, useCallback, SetStateAction, Dispatch } from 'react'

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
import { SortType, WarehousesRowType } from 'src/@db-api/types'

// ** Utils Import
import baseUrl from 'src/configs/bkUrl'
import { formatDateTime } from '../customers'
import Icon from 'src/@core/components/icon'
import WarehousesDialog from 'src/@core/layouts/components/page-components/WarehousesDialog'
import { deleteWarehouse } from 'src/@db-api/parsingSettings/warehouses'
import { utDownloadExcelFile } from 'src/@core/utils/excel'

const columns = (
  setOpen: Dispatch<SetStateAction<boolean>>,
  setMode: Dispatch<SetStateAction<"Add" | "Edit">>,
  setEditRowData: Dispatch<SetStateAction<WarehousesRowType | null>>,
  onReload: () => void,
): GridColDef[] => ([
  {
    field: 'name',
    minWidth: 150,
    headerName: 'Name',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.name}
      </Typography>
    )
  },
  {
    field: 'parsingName',
    minWidth: 190,
    headerName: 'Parsing Name',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.parsingName}
      </Typography>
    )
  },
  {
    field: 'email',
    minWidth: 250,
    headerName: 'Email',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.email}
      </Typography>
    )
  },
  {
    field: 'phone',
    minWidth: 150,
    headerName: 'Phone',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.phone}
      </Typography>
    )
  },
  {
    field: 'channelType',
    minWidth: 100,
    headerName: 'Channel Type',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.channelType}
      </Typography>
    )
  },
  {
    field: 'useLandingFlow',
    minWidth: 120,
    headerName: 'Use Landing Flow',
    type: 'boolean'
  },
  {
    field: 'isDefault',
    minWidth: 100,
    headerName: 'Is Default',
    type: 'boolean'
  },
  {
    minWidth: 115,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton disabled={params.row.email === "NA"} title="Edit" color='primary' onClick={() => { setEditRowData(params.row); setMode("Edit"); setOpen(true) }}>
          <Icon icon='mdi:pencil-outline' fontSize={25} />
        </IconButton>
        <IconButton disabled={params.row.email === "NA"} title="Delete" color='error' onClick={() => deleteWarehouse(params.row.id, onReload)}>
          <Icon icon='mdi:delete-outline' fontSize={25} />
        </IconButton>
      </Box>
    )
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

const Channels = () => {
  // ** States
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('desc')
  const [rows, setRows] = useState<WarehousesRowType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [sortColumn, setSortColumn] = useState<string>('created_at')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [open, setOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [mode, setMode] = useState<"Add" | "Edit">("Add");
  const [editRowData, setEditRowData] = useState<WarehousesRowType | null>(null)
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
        .get(`${baseUrl}/parsingSettings/warehouses`, {
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
          setRows(res.data?.list as unknown as WarehousesRowType[])
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
      .get(`${baseUrl}/parsingSettings/warehouses`, {
        params: {
            q: '',
            ...{paginationModel},
            sort,
            column
          },
        })
        .then(async res => {
          const data = res.data?.list as unknown as WarehousesRowType[];
           const dataWithUpdatedColumnsName = data.map(item => {
             return {
               Name: item.name,
               'Parsing Name': item.parsingName,
               Email: item.email,
               'Use Landing Flow': item.useLandingFlow,
               'Is Default': item.isDefault,
               'Created At': formatDateTime(item.created_at!)
             }
           })
          await utDownloadExcelFile(dataWithUpdatedColumnsName, 'warehouses')
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
        <CardHeader title='Channels/Parsing Setup' />
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
            setOpen, setMode, setEditRowData,
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
              setSearchText:(text: string) => setSearchText(text),
              searchPlaceholder: 'Search by warehouse name',
              exportAll: () => exportAllToExcel(sort, '', { page: 0, pageSize: total }, sortColumn),
              showAllRecords: () => fetchTableData(sort, '', { page: 0, pageSize: total }, sortColumn),
              refreshData: () => fetchTableData(sort, '', paginationModel, sortColumn),
              onClearSelection: handleClearSelection,
              isSelectionEmpty: selectedRows.length === 0,
              addButton: "Add new",
              onClickAdd: () => { setOpen(true); setMode("Add"); setEditRowData(null) }
            }
          }}
        />
      </Card>
      <WarehousesDialog
        open={open}
        handleClose={() => setOpen(false)}
        maxWidth="sm"
        onReload={() => fetchTableData(sort, '', paginationModel, sortColumn)}
        mode={mode}
        data={editRowData}
      />
    </>
  )
}

export default Channels;

Channels.acl = {
  action: 'read',
  subject: 'admin-page'
}