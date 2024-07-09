// ** React Imports
import { useEffect, useState, useCallback, Dispatch, SetStateAction } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid'

// ** ThirdParty Components
import axios from 'axios'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { RelinkOrderRowType, RelinkProductType } from 'src/@db-api/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import baseUrl from 'src/configs/bkUrl'
import { Button } from '@mui/material'
import ProductsDialog from 'src/@core/layouts/components/page-components/ProductsDialog'
import { utDownloadExcelFile } from 'src/@core/utils/excel'

interface StatusObj {
  title: string
  color: ThemeColor
}

type SortType = 'asc' | 'desc' | undefined | null

const formatDateTime = (dateTimeStr: string) => {
  const dateTime = new Date(dateTimeStr);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Use 24-hour format
  };

  return dateTime.toLocaleString(undefined, options);
}

// ** renders client column
export const renderClient = (params: GridRenderCellParams) => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  return (
    <CustomAvatar
      skin='light'
      color={color as ThemeColor}
      sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
    >
      {getInitials(row.name ? row.name : 'John Doe')}
    </CustomAvatar>
  )
}

const statusObj: StatusObj[] = [
  { title: 'new', color: 'primary' },
  { title: 'sent-for-shipping', color: 'success' },
  { title: 'domain-created', color: 'warning' },
]

const columns = (
  setProducts: Dispatch<SetStateAction<RelinkProductType[]>>,
  setOpen: Dispatch<SetStateAction<boolean>>
): GridColDef[] => ([
  {
    minWidth: 160,
    field: 'customerName',
    headerName: 'Customer Name',
    renderCell: (params: GridRenderCellParams) => {
      const { row } = params

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(params)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
              {row.customerName}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    field: 'orderNum',
    minWidth: 100,
    headerName: 'Order #',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.orderNum}
      </Typography>
    )
  },
  {
    minWidth: 250,
    field: 'orderStatus',
    headerName: 'Status',
    renderCell: (params: GridRenderCellParams) => {
      const status = statusObj.filter(obj => obj.title === params.row.orderStatus)[0]

      return (
        <CustomChip
          size='small'
          skin='light'
          color={status?.color ?? "warning"}
          label={status?.title ?? params.row.orderStatus}
          sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
        />
      )
    }
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
    field: 'email',
    minWidth: 180,
    headerName: 'Email',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.email}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 140,
    field: 'id',
    headerName: 'Actions',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => {

      return (
        <Button
          size='small'
          color='info'
          variant='outlined'
          onClick={() => { setProducts(params.row.products); setOpen(true) }}
        >Products</Button>
      )
    }
  },
  {
    field: 'isItalian',
    minWidth: 140,
    headerName: 'Uses Landing Flow',
    type: 'boolean'
  },
  {
    field: 'billingAddress',
    minWidth: 250,
    headerName: 'Billing Address',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary', maxWidth: "130px",textOverflow: "ellipsis" }}>
        {params.row.billingAddress}
      </Typography>
    )
  },
  {
    field: 'shippingAddress',
    minWidth: 250,
    headerName: 'Shipping Address',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.shippingAddress}
      </Typography>
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

const RelinkShop = () => {

  // ** States
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('desc')
  const [rows, setRows] = useState<RelinkOrderRowType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [sortColumn, setSortColumn] = useState<string>('created_at')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<RelinkProductType[]>([])
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const handleClearSelection = () => setSelectedRows([])
  const handleRowSelectionChange = (rowSelectionModel: GridRowSelectionModel) => {
    const selectedRowIds = rowSelectionModel as string[];
    setSelectedRows(selectedRowIds);
  };
  const [searchText, setSearchText] = useState<string>('');
  
  const fetchTableData = useCallback(
    async (
      sort: SortType,
      q: string,
      paginationModel: { page: number; pageSize: number },
      column: string,
    ) => {
      setLoading(true)
      await axios
        .get(`${baseUrl}/relink-email/getAllOrders`, {
          params: {
            q,
            ...paginationModel,
            sort,
            column,
            searchText
          }
        })
        .then(res => {
          setTotal(res.data?.total ?? 10)
          setRows(res.data?.list as unknown as RelinkOrderRowType[])
          setLoading(false)
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paginationModel,searchText]
  )

  const exportAllToExcel = useCallback(
    async (sort: SortType, q: string, paginationModel: { page: number, pageSize: number }, column: string) => {
      setLoading(true)
      await axios
      .get(`${baseUrl}/relink-email/getAllOrders`, {
        params: {
          q,
          ...paginationModel,
          sort,
          column
          },
        })
        .then(async res => {
          const data = res.data?.list as unknown as RelinkOrderRowType[];
          const dataWithUpdatedColumnsName = data.map(item => {
            return {
              'Customer Name': item.customerName,
              'Order #': item.orderNum,
              Status: item.orderStatus,
              Phone: item.phone,
              Email: item.email,
              'Uses Landing Flow': item.isItalian,
              'Billing Address': item.billingAddress,
              'Shipping Address': item.shippingAddress,
              'Created At': formatDateTime(item.created_at!)
            }
          });
          await utDownloadExcelFile(dataWithUpdatedColumnsName, 'relink-shop')
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
        <CardHeader title='Parsed Orders' />
        <DataGrid
          autoHeight
          pagination
          keepNonExistentRowsSelected
          rows={rows}
          rowCount={total}
          getRowId={(row) => (row.id)}
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={handleRowSelectionChange}
          columns={columns(setProducts, setOpen)}
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
              searchPlaceholder: 'Search by customer name or order number',
              exportAll: () => exportAllToExcel(sort, '', { page: 0, pageSize: total }, sortColumn),
              showAllRecords: () => fetchTableData(sort, '', { page: 0, pageSize: total }, sortColumn),
              refreshData: () => fetchTableData(sort, '', paginationModel, sortColumn),
              onClearSelection: handleClearSelection,
              isSelectionEmpty: selectedRows.length === 0
            }
          }}
        />

      </Card>
      <ProductsDialog
        open={open}
        handleClose={() => setOpen(false)}
        maxWidth="md"
        data={products}
      />
    </>
  )
}

export default RelinkShop

RelinkShop.acl = {
  action: 'read',
  subject: 'admin-page'
}