// ** React Imports
import { Fragment, useState } from 'react'

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
import { addOtherDomainForCustomer } from 'src/@db-api/relink/relinkApi'
import Icon from 'src/@core/components/icon'

type dialogProps = {
  maxWidth: Breakpoint,
  handleClose: () => void,
  open: boolean,
  customerId: string
}

const defaultValues = {
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
  redirectUrl: yup.string().url('Please enter a valid URL').required('Redirect URL is required'),
  thirdLvlDomain: yup.string().min(3, obj => showErrors('Third level Domain', obj.value.length, obj.min))
    .required(),
  productName: yup.string(),
  businessUrlType: yup.string(),
  surfaceType: yup.string(),
  productSku: yup.string()
})

const AddCustomerDomainDialog = ({ maxWidth, open, handleClose, customerId }: dialogProps) => {
  const [loading, setLoading] = useState(false);

  // ** Hook
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });


  const onSubmit = () => {
    setLoading(true);
    const formData = getValues();
    if(customerId) addOtherDomainForCustomer({...formData, id: customerId, customerId}).then((resp) => {
      if (resp === 'ok') {
        setLoading(false);
        reset(defaultValues);
        handleClose();
      }
      setLoading(false);
    });
  }

  return (
    <Fragment>
      <Dialog
        open={open}
        maxWidth={maxWidth}
        fullWidth={true}
        onClose={handleClose}
        aria-labelledby='max-width-dialog-title'
      >
        <DialogTitle sx={{ padding: '0.75rem', backgroundColor: 'secondary' }}>{`Create another domain for customer`}</DialogTitle>
        <DialogContent sx={{ paddingTop: '10px !important' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
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

              <Grid item xs={12}>
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
                        label='Url Type'
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

export default AddCustomerDomainDialog
