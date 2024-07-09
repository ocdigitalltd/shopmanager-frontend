// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { Breakpoint } from '@mui/material/styles'
import { DialogTitle, Grid } from '@mui/material'

// ** MUI Imports
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import bkUrl from 'src/configs/bkUrl'
import toast from 'react-hot-toast'

export const createNewSku = async (sku: string) => {
  try {
    const response = await fetch(`${bkUrl}/relink-email/sku`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "jwt=your_jwt_token_here",
      },
      body: JSON.stringify({
        sku
      }),
    });

    if (response.ok) {
      const result = await response.json();
      toast.success((result as any)?.message ?? "SKU created successfully");

      return "ok"
    } else {
      toast.error('Could not create sku', {
        duration: 3000
      });
    }
  } catch (error) {
    console.error("Error in createNewSku:", error);
  }
}

type dialogProps = {
  maxWidth: Breakpoint,
  handleClose: () => void,
  open: boolean,
  onReload: () => void
}

const defaultValues = {
  sku: '',
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
  sku: yup
    .string()
    .min(3, obj => showErrors('sku', obj.value.length, obj.min))
    .required(),
})

const AddSkuDialog = ({ maxWidth, open, handleClose, onReload }: dialogProps) => {
  const [loading, setLoading] = useState(false);

  // ** Hook
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })


  const onSubmit = () => {
    setLoading(true);
    createNewSku(getValues().sku).then((resp) => {
      if (resp === "ok") {
        setLoading(false);
        reset(defaultValues);
        onReload(); handleClose();
      }
      setLoading(false);
    })
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
        <DialogTitle sx={{ padding: '0.75rem', backgroundColor: 'secondary' }}>{`Add new SKU`}</DialogTitle>
        <DialogContent sx={{ paddingTop: '10px !important' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='sku'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='SKU'
                        onChange={onChange}
                        placeholder='Enter Sku'
                        error={Boolean(errors.sku)}
                        aria-describedby='validation-schema-sku'
                      />
                    )}
                  />
                  {errors.sku && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-sku'>
                      {errors.sku.message}
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

export default AddSkuDialog
