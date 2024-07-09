// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import FormHelperText from '@mui/material/FormHelperText'
import Button from '@mui/material/Button'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CardHeader, Checkbox, FormControlLabel } from '@mui/material'
import { tpMiscSettings } from 'src/@db-api/types'
import { updateCronSettings } from 'src/@db-api/parsingSettings/warehouses'


const defaultValues = {
  startCron: false,
  scheduleIntervalInMins: 60,
  delayAfterMessageFetchInMins: 30,
  isRunning: false,
  useGoogleSheets: false,
  sheetsUrl: '',
  sheetName: ''
}

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be greater than ${min}`
  } else {
    return ''
  }
}

const schema = yup.object().shape({
  scheduleIntervalInMins: yup.number().min(5, obj => showErrors('Schedule Time', obj.value.length, obj.min))
    .required(),
  delayAfterMessageFetchInMins: yup.number().min(0, obj => showErrors('Schedule Time', obj.value.length, obj.min))
    .required(),
  startCron: yup.boolean(),
})

const CronSettingsEdit = ({ data }: { data: tpMiscSettings }) => {
  // ** State
  const [loading, setLoading] = useState(false);
  const [showSheetsUrl, setShowSheetsUrl] = useState(false);

  // ** Hook
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    defaultValues: data,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (data && data?.id) reset(data)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const handleUseGoogleSheetsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowSheetsUrl(e.target.checked);
  };

  const onSubmit = () => {
    setLoading(true);
    const formData = getValues();
    updateCronSettings(data?.id as string, formData).then((resp) => {
      if (resp === 'ok') {
        setLoading(false);
      }
      setLoading(false);
    });
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={`Update ${data.processType?.toUpperCase()} Cron Settings`} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='scheduleIntervalInMins'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label='Schedule Time in minutes'
                          type='number'
                          onChange={onChange}
                          placeholder='Enter time in minutes'
                          error={Boolean(errors.scheduleIntervalInMins)}
                          aria-describedby='validation-schema-schedule-intervalInMins'
                        />
                      )}
                    />
                    {errors.scheduleIntervalInMins && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-schedule-intervalInMins'>
                        {errors.scheduleIntervalInMins.message as string}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='delayAfterMessageFetchInMins'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label='Delay after record creation in minutes'
                          type='number'
                          onChange={onChange}
                          placeholder='Enter time in minutes'
                          error={Boolean(errors.delayAfterMessageFetchInMins)}
                          aria-describedby='validation-schema-schedule-delay'
                        />
                      )}
                    />
                    {errors.delayAfterMessageFetchInMins && (
                      <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-schedule-delay'>
                        {errors.delayAfterMessageFetchInMins.message as string}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='startCron'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          control={<Checkbox checked={value} value={value} onChange={onChange} />}
                          sx={{ mb: 4, mt: 1.5, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                          label={getValues().startCron === true ? "Stop cron" : "Start cron"}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='useGoogleSheets'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          control={<Checkbox checked={value} value={value} onChange={(e) => {
                            onChange(e);
                            handleUseGoogleSheetsChange(e)
                          }} />}
                          sx={{ mb: 4, mt: 1.5, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                          label={"Use Google Sheets"}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                {(showSheetsUrl || data?.useGoogleSheets) && (
                  <>
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
                  </>
                )}
                <Grid item xs={12} sx={{ textAlign: 'right' }}>
                  <Button sx={{ marginRight: '15px' }} size='large' type='submit' variant='contained' disabled={loading}>
                    Save Changes
                  </Button>
                  <Button size='large' type='reset' variant='outlined' color='secondary' onClick={() => reset(defaultValues)} disabled={loading}>
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CronSettingsEdit;
