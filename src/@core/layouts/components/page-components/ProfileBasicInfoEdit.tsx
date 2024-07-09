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
import { CardHeader, IconButton, InputAdornment, OutlinedInput } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { UserDataType } from 'src/context/types'
import { updateUserInfo } from 'src/@db-api/auth/jwt'
import { useAuth } from 'src/hooks/useAuth'

export interface UserBasicData {
  id?: string,
  name: string,
  email: string,
  password: string,
}
const defaultValues = {
  name: '',
  email: '',
  password: '',
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
  password: yup.string().min(7, obj => showErrors('Password', obj.value.length, obj.min))
    .required(),
})

const ProfileBasicInfoEdit = ({ user }: { user: UserDataType }) => {
  // ** State
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const { setUser } = useAuth();

  // ** Hook
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    defaultValues: user ? { name: user.username, email: user.email, password: user.password } : defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user && user?.id) reset({ name: user.username, email: user.email, password: user.password })
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const onSubmit = () => {
    setLoading(true);
    const formData = getValues();
    updateUserInfo(user?.id, formData).then((resp) => {
      if (resp === 'ok') {
        const updatedData = { ...user, email: formData.email, username: formData.name, password: formData.password }
        sessionStorage.setItem('user', JSON.stringify({...updatedData}));
        setUser(updatedData)
        setLoading(false);
      }
      setLoading(false);
    });
  }

  return (
    <Grid container spacing={6}>
      {/* Account Details Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='User Data' />
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
                          value={value}
                          label='Name'
                          onChange={onChange}
                          placeholder='Enter your name'
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
                      name='password'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <OutlinedInput
                          value={value}
                          onBlur={onBlur}
                          label='Password'
                          onChange={onChange}
                          id='auth-login-v2-password'
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

export default ProfileBasicInfoEdit;
