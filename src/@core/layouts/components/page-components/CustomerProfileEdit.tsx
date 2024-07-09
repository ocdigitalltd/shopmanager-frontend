// ** React Imports
import { useState, useEffect, useCallback } from 'react'

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
import { updateCustomer } from 'src/@db-api/relink/relinkApi'
import { CardHeader, IconButton, InputAdornment, OutlinedInput } from '@mui/material'
import axios from 'axios'
import baseUrl from 'src/configs/bkUrl'
import { CustomerRowType } from 'src/@db-api/types'
import Icon from 'src/@core/components/icon'
import { UserDataType } from 'src/context/types'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'

const defaultValues = {
  id: '',
  name: '',
  phone: '',
  email: '',
  aemail: '',
  password: '',
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
  password: yup.string().min(7, obj => showErrors('Password', obj.value.length, obj.min))
    .required(),
  aemail: yup.string().nullable(),
  billingAddress: yup.string().nullable(),
  shippingAddress: yup.string().min(7, obj => showErrors('Address', obj.value.length, obj.min))
    .required(),
  redirectUrl: yup.string().url('Please enter a valid URL').required('Redirect URL is required'),
  thirdLvlDomain: yup.string().min(3, obj => showErrors('Third level Domain', obj.value.length, obj.min))
    .required(),
  productName: yup.string().nullable(),
  businessUrlType: yup.string().nullable(),
  surfaceType: yup.string().nullable(),
  productSku: yup.string()
})

const CustomerProfileEdit = ({ user }: { user: UserDataType }) => {
  // ** State
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [data, setData] = useState<CustomerRowType>(defaultValues)
  const { setUser } = useAuth()

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

  const fetchUserData = useCallback(
    async (id: string) => {
      setLoading(true)
      await axios
        .get(`${baseUrl}/user/${id}`)
        .then((res: any) => {
          setData(res.data as unknown as CustomerRowType);
          reset(res.data);
          setLoading(false)
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    if (user && user?.id) fetchUserData(user?.id)
  }, [fetchUserData, user])

  const onSubmit = () => {
    setLoading(true);
    const formData = getValues();
    if (data.customerId) {
      updateCustomer(data.customerId, formData).then((resp) => {
        if (resp === 'ok') {
          const updatedData = { ...user, email: formData.email, username: formData.name, password: formData.password as string }
          sessionStorage.setItem('user', JSON.stringify({ ...updatedData }));
          setUser(updatedData)
          setLoading(false);
        }
        setLoading(false);
      })
    }
    else {
      toast.error('Something went wrong, Try refreshing the page', {
        duration: 3000
      });
      setLoading(false);
    }
  }

  return (
    <Grid container spacing={6}>
      {/* Account Details Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Customer Data' />
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Controller
                      name='name'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value ?? ""}
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
                          value={value ?? ""}
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
                      name='password'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <OutlinedInput
                          value={value ?? ""}
                          onBlur={onBlur}
                          label='Password'
                          onChange={onChange}
                          id='customer-password'
                          error={Boolean(errors.password)}
                          type={showPassword ? 'text' : 'password'}
                          placeholder='Enter password'
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      )}
                    />
                    {errors.password && (
                      <FormHelperText sx={{ color: 'error.main' }} id=''>
                        {errors.password.message}
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
                          value={value ?? ""}
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
                          value={value ?? ""}
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
                          value={value ?? ""}
                          label='Third Level Domain'
                          onChange={onChange}
                          placeholder='Enter third level domain'
                          disabled={data?.source ? data?.source==='landing' : false}
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
                          value={value ?? ""}
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
                          value={value ?? ""}
                          label='Product Name'
                          disabled
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
                          value={value ?? ""}
                          label='Product Sku'
                          disabled
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
                    <Controller
                      name='businessUrlType'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value ?? ""}
                          label='Business Url Type'
                          disabled
                          onChange={onChange}
                          placeholder='Enter redirect url type'
                          aria-describedby='validation-schema-businessUrlType'
                        />
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
                          value={value ?? ""}
                          label='Product Surface Type'
                          disabled
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
                          value={value ?? ""}
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
                          value={value ?? ""}
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
                    Save Changes
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

export default CustomerProfileEdit;
