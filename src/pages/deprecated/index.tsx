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
import { ShopifyGoldenRowType, ShopifyOrderStatusList } from 'src/@db-api/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import baseUrl from 'src/configs/bkUrl'
import { Button } from '@mui/material'
import { deleteOrder, updateOrderStatus } from 'src/@db-api/shopify/shopifyGoldenApi'
import MessagesDialog from 'src/@core/layouts/components/page-components/MessagesDialog'
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
const renderClient = (params: GridRenderCellParams) => {
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
  { title: 'sent', color: 'success' },
  { title: 'pending', color: 'warning' },
  { title: 'whatsapp-check-fail', color: 'error' },
  { title: 'sms-check-fail', color: 'error' },
  { title: 'failed', color: 'error' },
]

const columns = (
  onReload: () => void,
  setDialogData: Dispatch<SetStateAction<ShopifyGoldenRowType | undefined>>,
  setOpen: Dispatch<SetStateAction<boolean>>
): GridColDef[] => ([
  {
    minWidth: 170,
    field: 'name',
    headerName: 'Customer Name',
    renderCell: (params: GridRenderCellParams) => {
      const { row } = params

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(params)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
              {row.name}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    field: 'orderNumber',
    minWidth: 130,
    headerName: 'Order #',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.orderNumber}
      </Typography>
    )
  },
  {
    field: 'shopName',
    minWidth: 150,
    headerName: 'Shop Name',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.shopName}
      </Typography>
    )
  },
  {
    minWidth: 100,
    field: 'orderStatus',
    headerName: 'Status',
    renderCell: (params: GridRenderCellParams) => {
      const status = statusObj.filter(obj => obj.title === params.row.orderStatus)[0]

      return (
        <CustomChip
          size='small'
          skin='light'
          color={status.color}
          label={status.title}
          sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
        />
      )
    }
  },
  {
    field: 'phone',
    minWidth: 130,
    headerName: 'Phone',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.phone}
      </Typography>
    )
  },
  {
    field: 'address',
    minWidth: 150,
    headerName: 'Address',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.address}
      </Typography>
    )
  },
  {
    field: 'isValidAddress',
    minWidth: 80,
    headerName: 'Is Valid Address',
    type: 'boolean'
  },
  {
    minWidth: 240,
    field: 'id',
    headerName: 'Actions',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => {

      return (
        <>
          <Button
            size='small'
            color='info'
            variant='outlined'
            sx={{ marginRight: "8px" }}
            onClick={() => { setDialogData(params.row); setOpen(true) }}
          >Messages</Button>
          <Button
            size='small'
            color='error'
            variant='outlined'
            onClick={() => deleteOrder(params.row.id, onReload)}
          >Delete Order</Button>
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

const ShopifyGolden = () => {
  // ** States
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('desc')
  const [rows, setRows] = useState<ShopifyGoldenRowType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [sortColumn, setSortColumn] = useState<string>('created_at')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState<ShopifyGoldenRowType | undefined>(undefined)
  const [selectedStatus, setSelectedStatus] = useState<string>(''); // State for the selected status
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [query, setQuery] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');

  const handleClearSelection = () => setSelectedRows([])
  const handleRowSelectionChange = (rowSelectionModel: GridRowSelectionModel) => {
    const selectedRowIds = rowSelectionModel as string[];
    setSelectedRows(selectedRowIds);
  };
  const handleQueryChange = (status: string) => setQuery(status)
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    if (status && status !== "" && selectedRows.length > 0) {
      setLoading(true);
      updateOrderStatus(status, selectedRows).then(() => {
        setLoading(false);
        setSelectedStatus("");
        fetchTableData(sort, query, paginationModel, sortColumn);
      })
    };
  }

  const fetchTableData = useCallback(
    async (
      sort: SortType,
      q: string,
      paginationModel: { page: number; pageSize: number },
      column: string,
    ) => {
      setLoading(true)
      await axios
        .get(`${baseUrl}/shopify-email/getAllOrders`, {
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
          setRows(res.data?.list as unknown as ShopifyGoldenRowType[])
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
        .get(`${baseUrl}/shopify-email/getAllOrders`, {
          params: {
            q,
            ...paginationModel,
            sort,
            column
          },
        })
        .then(async res => {
          const data = res.data?.list as unknown as ShopifyGoldenRowType[];
          const dataWithUpdatedColumnsName = data.map((item) => {
            return {
              'Customer Name': item.name,
              'Order #': item.orderNumber,
              Status: item.orderStatus,
              Phone: item.phone,
              Address: item.address,
              'Is Valid Address': item.isValidAddress,
              'Created At': formatDateTime(item.created_at)
            }
          }
          )
          await utDownloadExcelFile(dataWithUpdatedColumnsName, 'Shopify-Orders')
          setLoading(false);
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paginationModel]
  )

  useEffect(() => {
    fetchTableData(sort, query, paginationModel, sortColumn)
  }, [fetchTableData, query, paginationModel, sort, sortColumn, searchText])
  

  const handleSortModel = (newModel: GridSortModel) => {
    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)
      fetchTableData(newModel[0].sort, query, paginationModel, newModel[0].field)
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
          getRowId={row => row.id}
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={handleRowSelectionChange}
          columns={columns(() => fetchTableData(sort, query, paginationModel, sortColumn), setDialogData, setOpen)}
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
              selectedStatus: selectedStatus, // Pass the selectedStatus to the toolbar
              searchPlaceholder: 'Search by customer name or order number',
              setSearchText:(text: string) => setSearchText(text),
              dropdownValues: ShopifyOrderStatusList,
              refreshData: () => fetchTableData(sort, query, paginationModel, sortColumn),
              onStatusChange: handleStatusChange,
              onClearSelection: handleClearSelection,
              isSelectionEmpty: selectedRows.length === 0,
              onFilterStatus: handleQueryChange,
              filter: query,
              exportAll: () => exportAllToExcel(sort, query, { page: 0, pageSize: total }, sortColumn),
              showAllRecords: () => fetchTableData(sort, query, { page: 0, pageSize: total }, sortColumn)
            }
          }}
        />
      </Card>
      <MessagesDialog open={open} handleClose={() => setOpen(false)} maxWidth='md' data={dialogData} />
    </>
  )
}

export default ShopifyGolden;

// ShopifyGolden.acl = {
//   action: 'read',
//   subject: 'admin-page'
// }

