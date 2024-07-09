// ** React Imports
import { useEffect, useState, useCallback, Dispatch, SetStateAction } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid'

// ** ThirdParty Components
import axios from 'axios'

// ** Custom Components
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'

// ** Types Imports
import { CustomerRowType } from 'src/@db-api/types'

// ** Utils Import
import baseUrl from 'src/configs/bkUrl'
import CustomersDialog from 'src/@core/layouts/components/page-components/CustomersDialog'
import { Box, IconButton } from '@mui/material'
import { renderClient } from '../relink-shop'
import CustomerDomainsDialog from 'src/@core/layouts/components/page-components/CustomerDomainsListDialog'
import AddCustomerDomainDialog from 'src/@core/layouts/components/page-components/AddCustomerDomainDialog'
import { deleteCustomer } from 'src/@db-api/relink/relinkApi'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { utDownloadExcelFile } from 'src/@core/utils/excel'

type SortType = 'asc' | 'desc' | undefined | null

export const formatDateTime = (dateTimeStr: string) => {
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


const columns = (
  setOpen: Dispatch<SetStateAction<boolean>>,
  setMode: Dispatch<SetStateAction<"Add" | "Edit">>,
  setEditRowData: Dispatch<SetStateAction<CustomerRowType | null>>,
  onReload: () => void,
  setOpenProducts: Dispatch<SetStateAction<string | null>>,
  setAddProducts: Dispatch<SetStateAction<string | null>>
): GridColDef[] => ([
  {
    field: 'incrementalId',
    minWidth: 30,
    headerName: 'ID',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.incrementalId}
      </Typography>
    )
  },
  {
    minWidth: 160,
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
    minWidth: 350,
    headerName: 'Redirect Url',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.redirectUrl}
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
    field: 'aemail',
    minWidth: 180,
    headerName: 'Alternate Email',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.aemail}
      </Typography>
    )
  },
  {
    minWidth: 115,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton title="Edit" color='primary' disabled={params.row.addedBy==="parsing"} onClick={() => { setEditRowData(params.row); setMode("Edit"); setOpen(true) }}>
          <Icon icon='mdi:pencil-outline' fontSize={25} />
        </IconButton>
        <IconButton title="Delete" color='error' disabled={params.row.addedBy==="parsing"} onClick={() => deleteCustomer(params.row.id, onReload)}>
          <Icon icon='mdi:delete-outline' fontSize={25} />
        </IconButton>
      </Box>
    )
  },
  {
    minWidth: 135,
    field: 'customerId',
    headerName: 'More Domains',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton title="Add Domain" color='success' onClick={() => { setAddProducts(params.row.id) }}>
          <Icon icon="gala:add" fontSize={25} />
        </IconButton>
        <IconButton title="List Domains" color='warning' onClick={() => setOpenProducts(params.row.id)}>
          <Icon icon='gg:list' fontSize={25} />
        </IconButton>
      </Box>
    )
  },
  {
    field: 'addedBy',
    minWidth: 100,
    headerName: 'Created By',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.addedBy === "user" ? "admin-panel" : params.row.addedBy}
      </Typography>
    )
  },
  {
    field: 'billingAddress',
    minWidth: 250,
    headerName: 'Billing Address',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary', maxWidth: "130px", textOverflow: "ellipsis" }}>
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

const Customers = () => {
  // ** States
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('desc')
  const [rows, setRows] = useState<CustomerRowType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [sortColumn, setSortColumn] = useState<string>('created_at')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [open, setOpen] = useState(false);
  const [openProducts, setOpenProducts] = useState<string | null>(null);
  const [addProducts, setAddProducts] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [mode, setMode] = useState<"Add" | "Edit">("Add");
  const [editRowData, setEditRowData] = useState<CustomerRowType | null>(null)
  const [searchText, setSearchText] = useState<string>('')

  const handleClearSelection = () => setSelectedRows([])
  const handleRowSelectionChange = (rowSelectionModel: GridRowSelectionModel) => {
    const selectedRowIds = rowSelectionModel as string[];
    setSelectedRows(selectedRowIds);
  };

  const fetchTableData = useCallback(
    async (sort: SortType, q: string, paginationModel: { page: number, pageSize: number }, column: string) => {
      setLoading(true)
      await axios
        .get(`${baseUrl}/customer/all`, {
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
          setRows(res.data?.list as unknown as CustomerRowType[])
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
        .get(`${baseUrl}/customer/all`, {
          params: {
            q: q,
            ...paginationModel,
            sort,
            column
          }
        })
        .then(async res => {
          const data = res.data?.list as unknown as CustomerRowType[]
          const dataWithUpdatedColumnsName = data.map(item => {
            return {
              'ID': item.incrementalId,
              'Customer Name': item.name,
              Domain: item.thirdLvlDomain,
              'Redirect Url': item.redirectUrl,
              Phone: item.phone,
              Email: item.email,
              'Alternate Email': item.aemail,
              'Created By': item.addedBy === 'user' ? 'admin-panel' : item.addedBy,
              'Billing Address': item.billingAddress,
              'Shipping Address': item.shippingAddress,
              'Created At': formatDateTime(item.created_at!)
            }
          })
          await utDownloadExcelFile(dataWithUpdatedColumnsName, 'customers')
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
        <CardHeader title='Customers' />
        <DataGrid
          autoHeight
          pagination
          keepNonExistentRowsSelected
          rows={rows}
          rowCount={total}
          getRowId={row => row.id}
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={handleRowSelectionChange}
          columns={columns(
            setOpen,
            setMode,
            setEditRowData,
            () => fetchTableData(sort, '', paginationModel, sortColumn),
            setOpenProducts,
            setAddProducts
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
              exportAll: () => exportAllToExcel(sort, '', { page: 0, pageSize: total }, sortColumn),
              setSearchText: (text: string) => setSearchText(text),
              searchPlaceholder: 'Search by customer name',
              showAllRecords: () => fetchTableData(sort, '', { page: 0, pageSize: total }, sortColumn),
              refreshData: () => fetchTableData(sort, '', paginationModel, sortColumn),
              onClearSelection: handleClearSelection,
              isSelectionEmpty: selectedRows.length === 0,
              addButton: 'Add New Customer',
              onClickAdd: () => {
                setOpen(true)
                setMode('Add')
                setEditRowData(null)
              }
            }
          }}
        />
      </Card>
      <CustomersDialog
        open={open}
        handleClose={() => setOpen(false)}
        maxWidth='lg'
        onReload={() => fetchTableData(sort, '', paginationModel, sortColumn)}
        mode={mode}
        data={editRowData}
      />
      <CustomerDomainsDialog
        open={openProducts ? true : false}
        handleClose={() => setOpenProducts(null)}
        customerId={openProducts}
        maxWidth='lg'
      />
      <AddCustomerDomainDialog
        open={addProducts ? true : false}
        handleClose={() => setAddProducts(null)}
        customerId={addProducts as string}
        maxWidth='md'
      />
    </>
  )
}

export default Customers;

Customers.acl = {
  action: 'read',
  subject: 'admin-page'
}