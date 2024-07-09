// ** React Imports
import { Fragment, useCallback, useEffect, useState } from 'react'

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
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createBulkDomains } from 'src/@db-api/relink/relinkApi'
import axios from 'axios'
import baseUrl from 'src/configs/bkUrl'
import { SkuRowType } from 'src/pages/sku'
import { SortType } from 'src/@db-api/types'

type dialogProps = {
  maxWidth: Breakpoint,
  handleClose: () => void,
  open: boolean,
  onReload: () => void
}

const defaultValues = {
  numOfDomains: 0,
  sku: '',
  redirectType: 'landing1'
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
  numOfDomains: yup
    .number()
    .min(1, obj => showErrors('numOfDomains', obj.value.length, obj.min))
    .required(),
  sku: yup
    .string()
    .min(3, obj => showErrors('sku', obj.value.length, obj.min))
    .required(),
  redirectType: yup
    .string()
    .required(),
})

const AddDomainsDialog = ({ maxWidth, open, handleClose, onReload }: dialogProps) => {
  const [loading, setLoading] = useState(false);
  const [skuOptions, setSkuOptions] = useState<SkuRowType[]>([]);

  const fetchSkus = useCallback(
    async (sort: SortType, q: string, paginationModel: { page: number, pageSize: number }, column: string) => {
      setLoading(true)
      await axios
        .get(`${baseUrl}/relink-email/sku`, {
          params: {
            q: '',
            ...{ paginationModel },
            sort,
            column
          },
        })
        .then(res => {
          setSkuOptions(res.data?.list as unknown as SkuRowType[])
          setLoading(false)
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

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
    createBulkDomains(getValues().sku, getValues().numOfDomains, getValues().redirectType).then((resp) => {
      if (resp === "ok") {
        setLoading(false);
        reset(defaultValues);
        onReload(); handleClose();
      }
      setLoading(false);
    })
  }

  useEffect(() => {
    fetchSkus("asc", '', { page: 0, pageSize: 100 }, "")
  }, [fetchSkus])

  return (
    <Fragment>
      <Dialog
        open={open}
        maxWidth={maxWidth}
        fullWidth={true}
        onClose={handleClose}
        aria-labelledby='max-width-dialog-title'
      >
        <DialogTitle sx={{ padding: '0.75rem', backgroundColor: 'secondary' }}>{`Create Bulk Domains`}</DialogTitle>
        <DialogContent sx={{ paddingTop: '10px !important' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='select-helper-label'>SKU</InputLabel>
                  <Controller
                    name='sku'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        labelId='select-helper-sku'
                        value={value}
                        label='SKU'
                        onChange={onChange}
                        placeholder='Enter product Sku'
                        error={Boolean(errors.sku)}
                        aria-describedby='validation-schema-sku'
                      >
                        {skuOptions.map((opt) => (
                          <MenuItem key={opt.id} value={opt.sku}>{opt.sku}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.sku && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-sku'>
                      {errors.sku.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='numOfDomains'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        type="number"
                        label='Num of Domains'
                        onChange={onChange}
                        placeholder='Enter num of domains to create'
                        error={Boolean(errors.numOfDomains)}
                        aria-describedby='validation-schema-num-of-domains'
                      />
                    )}
                  />
                  {errors.numOfDomains && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-num-of-domains'>
                      {errors.numOfDomains.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='select-helper-label'>Landing Page</InputLabel>
                  <Controller
                    name='redirectType'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label='Landing Page'
                        labelId='select-helper-label'
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.redirectType)}
                        aria-describedby='validation-schema-landing-type'
                      >
                        <MenuItem value={"landing1"}>Landing 1</MenuItem>
                        <MenuItem value={"landing2"}>Landing 2</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.redirectType && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-landing-type'>
                      {errors.redirectType.message}
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

export default AddDomainsDialog
