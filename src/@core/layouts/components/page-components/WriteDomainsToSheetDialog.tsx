
// ** React Imports
import { useState, useCallback, useEffect, Fragment } from 'react'
import { Breakpoint } from '@mui/material/styles'

// ** MUI Imports
import { tpMiscSettings } from 'src/@db-api/types'
import baseUrl from 'src/configs/bkUrl'

// ** ThirdParty Components
import axios from 'axios'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel } from '@mui/material'
import { updateCronSettings } from 'src/@db-api/parsingSettings/warehouses'


const defaultValues = {
  startCron: true,
  scheduleIntervalInMins: 0,
  delayAfterMessageFetchInMins: 0,
  isRunning: true,
  useGoogleSheets: true,
  sheetsUrl: '',
  sheetName: ''
}

const WriteDomainsSettingsEdit = ({ data, onClose }: { data: tpMiscSettings, onClose: () => void }) => {
  // ** State
  const [loading, setLoading] = useState(false);

  // ** Hook
  const {
    control,
    handleSubmit,
    reset,
    getValues,
  } = useForm({
    defaultValues: data,
    mode: 'onChange',
  });

  useEffect(() => {
    if (data && data?.id) reset(data)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const onSubmit = () => {
    setLoading(true);
    const formData = { ...defaultValues, ...getValues() };
    updateCronSettings(data?.id as string, formData).then((resp) => {
      if (resp === 'ok') {
        setLoading(false);
        onClose();
      }
      setLoading(false);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={5}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <Controller
              name='startCron'
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={<Checkbox checked={value} value={value} onChange={onChange} />}
                  sx={{ my: 0, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                  label={getValues().startCron === true ? "Disable" : "Enable"}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Controller
              name='sheetsUrl'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Google sheets url'
                  onChange={onChange}
                  placeholder='Enter sheets url'
                  aria-describedby='validation-schema-sheets-url'
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Controller
              name='sheetName'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Sheet Name'
                  onChange={onChange}
                  placeholder='Enter sheet name'
                  aria-describedby='validation-schema-sheets-name'
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: 'right' }}>
          <Button sx={{ marginRight: '15px' }} size='large' type='submit' variant='contained' disabled={loading}>
            Save Changes
          </Button>
          <Button size='large' type='reset' variant='outlined' color='secondary' onClick={onClose}>
            Close
          </Button>
        </Grid>
      </Grid>
    </form>

  )
}

type dialogProps = {
  maxWidth: Breakpoint,
  handleClose: () => void,
  open: boolean
}

const WriteDomainsToSheetDialog = ({ maxWidth, open, handleClose }: dialogProps) => {
  // ** State
  const [cronSettings, setCronSettings] = useState<tpMiscSettings[]>([])

  const fetchData = useCallback(
    async () => {
      await axios
        .get(`${baseUrl}/parsingSettings/cron`)
        .then(res => {
          setCronSettings(res.data.data as unknown as tpMiscSettings[])
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    if (open) fetchData()
  }, [open, fetchData])

  return (
    <Fragment>
      <Dialog
        open={open}
        maxWidth={maxWidth}
        fullWidth={true}
        onClose={handleClose}
        aria-labelledby='max-width-dialog-title'
      >
        <DialogTitle sx={{ padding: '0.75rem', backgroundColor: 'secondary' }}>{`Write domains to google sheets`}</DialogTitle>
        <DialogContent sx={{ paddingTop: '10px !important', minHeight: '25vh' }}>
          {cronSettings && cronSettings?.filter(set => set.processType === "domain-creation")?.map((setting) => (
            <>
              <WriteDomainsSettingsEdit data={setting} onClose={handleClose} />
            </>
          ))}
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default WriteDomainsToSheetDialog
