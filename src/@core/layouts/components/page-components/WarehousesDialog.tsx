// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { Breakpoint } from '@mui/material/styles'
import { Checkbox, DialogTitle, FormControlLabel, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'

// ** MUI Imports
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { addWarehouse, updateWarehouse } from 'src/@db-api/parsingSettings/warehouses'

type dialogProps = {
  maxWidth: Breakpoint,
  handleClose: () => void,
  open: boolean,
  onReload: () => void,
  mode: "Edit" | "Add",
  data: any | null
}

const defaultValues = {
  name: '',
  parsingName: '',
  phone: '',
  email: '',
  useLandingFlow: false,
  isDefault: false,
  channelType: "shopify"
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
  name: yup.string().min(3, obj => showErrors('Name', obj.value.length, obj.min))
    .required(),
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  phone: yup.number().min(7, obj => showErrors('Phone', obj.value.length, obj.min)).required('Phone is required'),
  parsingName: yup.string(),
  useLandingFlow: yup.boolean(),
  isDefault: yup.boolean(),
  channelType: yup.string().required()
})

const WarehousesDialog = ({ maxWidth, open, handleClose, onReload, mode, data }: dialogProps) => {
  const [loading, setLoading] = useState(false);
  const [showRelinkFields, setShowRelinkFields] = useState(false)

  // ** Hook
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    defaultValues: data || defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (open) reset(data || defaultValues);
  }, [data, open, reset]);

  const handleChannelTypeChange = (e: SelectChangeEvent<any>) => {
    if (e.target.value === "relink") setShowRelinkFields(true)
    else setShowRelinkFields(false)
  };

  const onSubmit = () => {
    setLoading(true);
    const formData = getValues();
    if (mode === 'Add') {
      addWarehouse(formData).then((resp) => {
        if (resp === 'ok') {
          setLoading(false);
          reset(defaultValues);
          onReload();
          handleClose();
        }
        setLoading(false);
      });
    } else if (mode === 'Edit' && data) {
      updateWarehouse(data.id, formData).then((resp) => {
        if (resp === 'ok') {
          setLoading(false);
          onReload();
          handleClose();
        }
        setLoading(false);
      });
    }
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        maxWidth={maxWidth}
        fullWidth={true}
        onClose={handleClose}
        aria-labelledby='max-width-dialog-title'
      >
        <DialogTitle sx={{ padding: '0.75rem', backgroundColor: 'secondary' }}>{`${mode} Channel`}</DialogTitle>
        <DialogContent sx={{ paddingTop: '10px !important' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='name'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Name'
                        onChange={onChange}
                        placeholder='Enter channel name'
                        error={Boolean(errors.name)}
                        aria-describedby='validation-schema-name'
                      />
                    )}
                  />
                  {errors.name && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-name'>
                      {errors.name.message as string}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='email'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Shop/Warehouse Email'
                        onChange={onChange}
                        placeholder='Enter shop/warehouse email address'
                        error={Boolean(errors.email)}
                        aria-describedby='validation-schema-email'
                      />
                    )}
                  />
                  {errors.email && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-email'>
                      {errors.email.message as string}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='phone'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Shop/Warehouse Phone'
                        type='number'
                        onChange={onChange}
                        placeholder='Enter shop/warehouse phone number'
                        error={Boolean(errors.phone)}
                        aria-describedby='validation-schema-phone'
                      />
                    )}
                  />
                  {errors.phone && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-phone'>
                      {errors.phone.message as string}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='parsingName'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Parsing Name'
                        onChange={onChange}
                        placeholder='Enter a name for parsing'
                        aria-describedby='validation-schema-parsingName'
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='select-helper-label'>Channel Type</InputLabel>
                  <Controller
                    name='channelType'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label='Channel Type'
                        labelId='select-helper-label'
                        value={value}
                        onChange={(e) => {
                          onChange(e);
                          handleChannelTypeChange(e)
                        }}
                        error={Boolean(errors.condType)}
                        aria-describedby='validation-schema-cond-type'
                      >
                        <MenuItem value={"relink"}>Relink</MenuItem>
                        <MenuItem value={"shopify"}>Shopify</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.channelType && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-cond-type'>
                      {errors.channelType.message as string}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {(showRelinkFields || data?.channelType === "relink") && (
                <>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Controller
                        name='useLandingFlow'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <FormControlLabel
                            control={<Checkbox checked={value} value={value} onChange={onChange} />}
                            sx={{ mb: 4, mt: 1.5, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                            label="Use Landing Flow"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Controller
                        name='isDefault'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <FormControlLabel
                            control={<Checkbox checked={value} value={value} onChange={onChange} />}
                            sx={{ mb: 4, mt: 1.5, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                            label="Make Default"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}

              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <Button sx={{ marginRight: '15px' }} size='large' type='submit' variant='contained' disabled={loading}>
                  Submit
                </Button>
                <Button size='large' onClick={() => { handleClose(); reset(defaultValues) }} variant='contained' disabled={loading}>
                  Close
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default WarehousesDialog
