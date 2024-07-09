// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { Breakpoint } from '@mui/material/styles'
import { DialogTitle, Grid, InputLabel, MenuItem, Select } from '@mui/material'

// ** MUI Imports
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createCustomer, updateCustomer } from 'src/@db-api/relink/relinkApi'
import Icon from 'src/@core/components/icon'

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
  phone: '',
  email: '',
  aemail: '',
  billingAddress: '',
  shippingAddress: '',
  redirectUrl: '',
  thirdLvlDomain: '',
  productName: '',
  businessUrlType: '',
  surfaceType: '',
  productSku: ''
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
  phone: yup.number().min(7, obj => showErrors('Phone', obj.value.length, obj.min))
    .required(),
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  aemail: yup.string(),
  billingAddress: yup.string(),
  shippingAddress: yup.string().min(7, obj => showErrors('Address', obj.value.length, obj.min))
    .required(),
  redirectUrl: yup.string().url('Please enter a valid URL').required('Redirect URL is required'),
  thirdLvlDomain: yup.string().min(3, obj => showErrors('Third level Domain', obj.value.length, obj.min))
    .required(),
  productName: yup.string(),
  businessUrlType: yup.string(),
  surfaceType: yup.string(),
  productSku: yup.string()
})

const CustomersDialog = ({ maxWidth, open, handleClose, onReload, mode, data }: dialogProps) => {
  const [loading, setLoading] = useState(false);

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

  const onSubmit = () => {
    setLoading(true);
    const formData = getValues();
    if (mode === 'Add') {
      createCustomer(formData).then((resp) => {
        if (resp === 'ok') {
          setLoading(false);
          reset(defaultValues);
          onReload();
          handleClose();
        }
        setLoading(false);
      });
    } else if (mode === 'Edit' && data) {
      updateCustomer(data.id, formData).then((resp) => {
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
        <DialogTitle sx={{ padding: '0.75rem', backgroundColor: 'secondary' }}>{`${mode} Customer`}</DialogTitle>
        <DialogContent sx={{ paddingTop: '10px !important' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={6}>
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
                        placeholder='Enter customer name'
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

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Controller
                    name='email'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Email'
                        onChange={onChange}
                        placeholder='Enter email address'
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

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Controller
                    name='aemail'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Alternate Email'
                        onChange={onChange}
                        placeholder='Enter an alternate email address'
                        aria-describedby='validation-schema-aemail'
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Controller
                    name='phone'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Phone'
                        onChange={onChange}
                        placeholder='Enter phone number'
                        error={Boolean(errors.phone)}
                        type="number"
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

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Controller
                    name='thirdLvlDomain'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Third Level Domain'
                        onChange={onChange}
                        placeholder='Enter third level domain'
                        error={Boolean(errors.thirdLvlDomain)}
                        aria-describedby='validation-schema-thirdLvlDomain'
                      />
                    )}
                  />
                  {errors.thirdLvlDomain && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-thirdLvlDomain'>
                      {errors.thirdLvlDomain.message as string}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Controller
                    name='redirectUrl'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Redirect Url'
                        onChange={onChange}
                        placeholder='Domain redirect to new link'
                        error={Boolean(errors.redirectUrl)}
                        aria-describedby='validation-schema-redirectUrl'
                      />
                    )}
                  />
                  {errors.redirectUrl && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-redirectUrl'>
                      {errors.redirectUrl.message as string}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Controller
                    name='productName'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Product Name'
                        onChange={onChange}
                        placeholder='Enter name for product'
                        aria-describedby='validation-schema-productName'
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Controller
                    name='productSku'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Product Sku'
                        onChange={onChange}
                        placeholder='Enter sku for product'
                        aria-describedby='validation-schema-productSku'
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id='select-helper-label'>Product Type</InputLabel>
                  <Controller
                    name='businessUrlType'
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label='Product Type'
                        labelId='select-helper-label'
                        value={value}
                        onChange={onChange}
                        aria-describedby='validation-schema-businessUrlType'
                      >
                        <MenuItem sx={{whiteSpace: "pre"}} value={"Google"}><Icon icon='mdi:google' fontSize={20} />{`  Google`}</MenuItem>
                        <MenuItem sx={{whiteSpace: "pre"}} value={"Instagram"}><Icon icon='mdi:instagram' fontSize={20} />{"  Instagram"}</MenuItem>
                        <MenuItem sx={{whiteSpace: "pre"}} value={"Trip-Advisor"}><Icon icon='bxl:trip-advisor' fontSize={20} />{"  Trip Advisor"}</MenuItem>
                        <MenuItem sx={{whiteSpace: "pre"}} value={"Whatsapp"}><Icon icon='mdi:whatsapp' fontSize={20} />{"  Whatsapp"}</MenuItem>
                        <MenuItem sx={{whiteSpace: "pre"}} value={"Facebook"}><Icon icon='mdi:facebook' fontSize={20} />{"  Facebook"}</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Controller
                    name='surfaceType'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Product Surface Type'
                        onChange={onChange}
                        placeholder='Enter surface type for product'
                        aria-describedby='validation-schema-surfaceType'
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='billingAddress'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Customer Billing Address'
                        onChange={onChange}
                        placeholder='Enter billing address'
                        aria-describedby='validation-schema-billingAddress'
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='shippingAddress'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Customer Shipping Address'
                        onChange={onChange}
                        placeholder='Enter shipping address'
                        error={Boolean(errors.shippingAddress)}
                        aria-describedby='validation-schema-shippingAddress'
                      />
                    )}
                  />
                  {errors.shippingAddress && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-shippingAddress'>
                      {errors.shippingAddress.message as string}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

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

export default CustomersDialog
