
// ** MUI Imports
import Box from '@mui/material/Box'
import { Button } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react';

interface Props {
  selectedStatus: string
  dropdownValues: string[]
  refreshData: () => void
  onStatusChange: (status: string) => void
  onClearSelection: () => void
  isSelectionEmpty: boolean
  filter: string
  onFilterStatus: (status: string) => void
  addButton?: string
  onClickAdd: () => void
  exportAll?: () => void
  showAllRecords?: () => void
  setSearchText: (text: string) => void | undefined
  searchPlaceholder?: string,
  domainType?: string,
  onUpdateDomainType?: (type: string) => void,
  writeToGSheetsBtn?: string,
  onClickWriteToGSheets?: () => void
}

const ServerSideToolbar = (props: Props) => {
  const {
    isSelectionEmpty,
    dropdownValues,
    onFilterStatus,
    domainType,
    onUpdateDomainType,
    filter,
    onClickAdd,
    addButton,
    onClearSelection,
    setSearchText,
    searchPlaceholder = 'Search',
    onClickWriteToGSheets,
    writeToGSheetsBtn
  } = props

  const [searchInputDebounce, setSearchInputDebounce] = useState<string>('')

  // ** Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (setSearchText) setSearchText(searchInputDebounce)
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchInputDebounce, setSearchText])

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputDebounce(e.target.value)
  }

  const showOrHidePagination = (isShown: boolean) => {
    const pagination = document.getElementsByClassName('MuiTablePagination-root')
    if (pagination.length > 0) {
      pagination[0].setAttribute('style', `display: ${isShown ? 'block' : 'none'}`)
    }
  }

  return (
    <>
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'flex-end',
          p: theme => theme.spacing(2, 5, 4, 5)
        }}
      >
        {setSearchText !== undefined && (
          <TextField
            size='small'
            onChange={handleSearchInputChange}
            placeholder={searchPlaceholder}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 2, display: 'flex' }}>
                  <Icon icon='mdi:magnify' fontSize={20} />
                </Box>
              ),
            }}
            title={searchPlaceholder}
            sx={{
              flexGrow: 1,
              maxWidth: '230px',
              '.MuiInputBase-input.MuiOutlinedInput-input': {
                padding: '6px 4px',
                maxWidth: '100%',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
            }}
          />
        )}
        <Button
          size='small'
          variant='outlined'
          color='primary'
          title='Export'
          aria-label='Export'
          onClick={props.exportAll}
        >
          <Icon icon='mdi:download' style={{ marginRight: '5px' }} fontSize={20} />
          Export All
        </Button>
        {props.showAllRecords && <Button
          size='small'
          variant='outlined'
          color='primary'
          title='showAllRecords'
          aria-label='showAllRecords'
          onClick={() => {
            showOrHidePagination(false)
            props.showAllRecords && props.showAllRecords()
          }}
        >
          <Icon icon='mdi:eye' style={{ marginRight: '5px' }} fontSize={20} />
          Show All Records
        </Button>}
        <Button
          size='small'
          variant='outlined'
          color='success'
          title='Refresh'
          aria-label='Refresh'
          onClick={() => {
            showOrHidePagination(true)
            props.refreshData()
          }}
        >
          <Icon icon='mdi:refresh' style={{ marginRight: '5px' }} fontSize={20} />
          Refresh
        </Button>
        {dropdownValues && (
          <>
            <Select
              size='small'
              color='primary'
              value={filter}
              onChange={e => onFilterStatus(e.target.value as string)}
              displayEmpty
              placeholder='Filter Status'
              sx={{
                padding: '0.1075rem 0.8125rem !important;',
                width: {
                  xs: 1,
                  sm: 'auto'
                },
                '.MuiSelect-select': {
                  padding: '0.1875rem 0.8125rem !important;'
                },
                '& .MuiSelect-root': {
                  ml: 2
                }
              }}
            >
              <MenuItem value=''>Filter Status</MenuItem>
              {props.dropdownValues.map(status => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
            <Select
              size='small'
              color='primary'
              value={props.selectedStatus}
              onChange={e => props.onStatusChange(e.target.value as string)}
              displayEmpty
              disabled={isSelectionEmpty}
              placeholder='Update Status'
              sx={{
                padding: '0.1075rem 0.8125rem !important;',
                width: {
                  xs: 1,
                  sm: 'auto'
                },
                '.MuiSelect-select': {
                  padding: '0.1875rem 0.8125rem !important;'
                },
                '& .MuiSelect-root': {
                  ml: 2
                }
              }}
            >
              <MenuItem value=''>Update Status</MenuItem>
              {props.dropdownValues.map(status => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
        {onClearSelection && (
          <Button
            size='small'
            variant='outlined'
            disabled={isSelectionEmpty}
            color='warning'
            title='Clear Selection'
            aria-label='Clear Selection'
            onClick={() => {
              showOrHidePagination(true)
              onClearSelection()
            }}
          >
            <Icon icon='mdi:eraser' style={{ marginRight: '5px' }} fontSize={20} />
            Clear selection
          </Button>
        )}
        {(domainType || domainType === '') && onUpdateDomainType &&
          (
            <Select
              size='small'
              color='primary'
              disabled={isSelectionEmpty}
              value={domainType}
              onChange={e => onUpdateDomainType(e.target.value as string)}
              displayEmpty
              placeholder='Change Redirect Type'
              sx={{
                padding: '0.1075rem 0.8125rem !important;',
                width: {
                  xs: 1,
                  sm: 'auto'
                },
                '.MuiSelect-select': {
                  padding: '0.1875rem 0.8125rem !important;'
                },
                '& .MuiSelect-root': {
                  ml: 2
                }
              }}
            >
              <MenuItem value=''>Change Landing Type</MenuItem>
              <MenuItem key="landing1" value="landing1">
                Landing 1
              </MenuItem>
              <MenuItem key="landing2" value="landing2">
                Landing 2
              </MenuItem>
            </Select>
          )
        }
        {addButton && (
          <Button
            size='small'
            variant='outlined'
            color='primary'
            title={addButton ?? 'Add new'}
            aria-label='Add new'
            onClick={onClickAdd}
          >
            <Icon icon='mdi:plus' style={{ marginRight: '5px' }} fontSize={20} />
            {addButton ?? 'Add new'}
          </Button>
        )}
        {writeToGSheetsBtn && onClickWriteToGSheets && (
          <Button
            size='small'
            variant='outlined'
            color='warning'
            title={writeToGSheetsBtn}
            aria-label='Write to sheets'
            onClick={onClickWriteToGSheets}
          >
            <Icon icon='mdi:settings' style={{ marginRight: '5px' }} fontSize={20} />
            {writeToGSheetsBtn}
          </Button>
        )}
      </Box>
    </>
  )
};

export default ServerSideToolbar;
