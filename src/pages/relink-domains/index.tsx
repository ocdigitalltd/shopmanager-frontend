// ** React Imports
import { useEffect, useState, useCallback } from 'react'

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
import { RelinkDomainsRowType } from 'src/@db-api/types'

// ** Utils Import
import baseUrl from 'src/configs/bkUrl'
import AddDomainsDialog from 'src/@core/layouts/components/page-components/AddBulkDomainsDialog'
import { utDownloadExcelFile } from 'src/@core/utils/excel'
import { IconButton } from '@mui/material'
import { Box } from '@mui/system'
import { changeLandingType, deleteDomainById } from 'src/@db-api/relink/relinkApi'
import Icon from 'src/@core/components/icon'
import WriteDomainsToSheetDialog from 'src/@core/layouts/components/page-components/WriteDomainsToSheetDialog'

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


const columns = (onReload: () => void): GridColDef[] => ([
  {
    field: 'sku',
    minWidth: 150,
    headerName: 'SKU',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.sku}
      </Typography>
    )
  },
  {
    field: 'domain',
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
    field: 'redirectType',
    minWidth: 100,
    headerName: 'Landing Type',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.redirectType}
      </Typography>
    )
  },
  {
    field: 'isActive',
    minWidth: 80,
    headerName: 'Is Used',
    type: 'boolean'
  },
  {
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton disabled={params.row.isActive} title="Delete" color='error' onClick={() => deleteDomainById(params.row.id, onReload)}>
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

const RelinkDomains = () => {
  // ** States
  const [total, setTotal] = useState<number>(0)
  const [sort, setSort] = useState<SortType>('desc')
  const [rows, setRows] = useState<RelinkDomainsRowType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [sortColumn, setSortColumn] = useState<string>('created_at')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [open, setOpen] = useState(false);
  const [openWriteDomains, setOpenWriteDomains] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [redirectType, setRedirectType] = useState<string>('');

  const handleClearSelection = () => setSelectedRows([])
  const handleRowSelectionChange = (rowSelectionModel: GridRowSelectionModel) => {
    const selectedRowIds = rowSelectionModel as string[];
    setSelectedRows(selectedRowIds);
  };

  const fetchTableData = useCallback(
    async (sort: SortType, q: string, paginationModel: { page: number, pageSize: number }, column: string) => {
      setLoading(true)
      await axios
        .get(`${baseUrl}/relink-email/getrandomdomains`, {
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
          setRows(res.data?.list as unknown as RelinkDomainsRowType[])
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
        .get(`${baseUrl}/relink-email/getrandomdomains`, {
          params: {
            q: q,
            ...paginationModel,
            sort,
            column
          },
        })
        .then(async res => {
          const data = res.data?.list as unknown as RelinkDomainsRowType[];
          const dataWithUpdatedColumnsName = data.map(item => {
            return {
              ID: item.incrementalId,
              SKU: item.sku,
              Domain: `${item.thirdLvlDomain}.ocdbiz.cloud`,
              'Redirect Url': item.redirectUrl,
              'Is Used': item.isActive,
              'Landing Type': item.redirectType,
              'Created At': formatDateTime(item.created_at!)
            }
          })
          const fieldsToRemove = ['id', 'skuId', 'createdBy'];
          await utDownloadExcelFile(dataWithUpdatedColumnsName, 'relink-domains', fieldsToRemove)
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
      setSortColumn('created_at')
    }
  }

  const handleDomainsUpdate = (landingType: string) => {
    setLoading(true);
    setRedirectType(landingType);
    changeLandingType(landingType, selectedRows, () => fetchTableData(sort, '', paginationModel, sortColumn)).then(() => {
      setLoading(false);
      setSelectedRows([]);
      setRedirectType('')
    })
  }

  return (
    <>
      <Card>
        <CardHeader title='Random Domains' />
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
          isRowSelectable={(params) => !params.row.isActive}
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
              searchPlaceholder: 'Search by sku or domain',
              exportAll: () => exportAllToExcel(sort, '', { page: 0, pageSize: total }, sortColumn),
              showAllRecords: () => fetchTableData(sort, '', { page: 0, pageSize: total }, sortColumn),
              refreshData: () => fetchTableData(sort, '', paginationModel, sortColumn),
              onClearSelection: handleClearSelection,
              isSelectionEmpty: selectedRows.length === 0,
              addButton: "Add more",
              onClickAdd: () => setOpen(true),
              domainType: redirectType,
              onUpdateDomainType: (landingType: string) => handleDomainsUpdate(landingType),
              writeToGSheetsBtn: "Write to Google sheets",
              onClickWriteToGSheets: () => setOpenWriteDomains(true)
            }
          }}
        />
      </Card>
      <AddDomainsDialog
        open={open}
        handleClose={() => setOpen(false)}
        maxWidth="sm"
        onReload={() => fetchTableData(sort, '', paginationModel, sortColumn)}
      />
      <WriteDomainsToSheetDialog
        open={openWriteDomains}
        handleClose={() => setOpenWriteDomains(false)}
        maxWidth="md"
      />
    </>
  )
}

export default RelinkDomains;

RelinkDomains.acl = {
  action: 'read',
  subject: 'admin-page'
}