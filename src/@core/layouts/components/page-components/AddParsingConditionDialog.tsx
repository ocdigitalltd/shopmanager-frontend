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
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { addParseCondition } from 'src/@db-api/parsingSettings/warehouses'
import { ParsingConditionRowType, WarehousesRowType } from 'src/@db-api/types'
import toast from 'react-hot-toast'

type dialogProps = {
  maxWidth: Breakpoint,
  handleClose: () => void,
  open: boolean,
  onReload: () => void,
  warehouse: WarehousesRowType
}

const defaultValues: ParsingConditionRowType = {
  condType: 'address',
  condValue: '',
}

const schema = yup.object().shape({
  condValue: yup.mixed()
    .required(),
  condType: yup
    .string()
    .required(),
})

const AddParsingConditionDialog = ({ maxWidth, open, handleClose, onReload, warehouse }: dialogProps) => {
  const [loading, setLoading] = useState(false);

  // ** Hook
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })


  const onSubmit = () => {
    if (["domainsAutoCreationThreshold", "numOfDomainsToAutoCreate"].includes(
      getValues().condType ?? "") && !Number(getValues().condValue)) {
      toast.error("Value must be a valid number");
      
      return
    }
    setLoading(true);
    addParseCondition({
      condType: getValues().condType, condValue: getValues().condValue, warehouseId: warehouse.id
    }).then((resp) => {
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
        <DialogTitle sx={{ padding: '0.75rem', backgroundColor: 'secondary' }}>{`Add Condition For ${warehouse.name}`}</DialogTitle>
        <DialogContent sx={{ paddingTop: '10px !important' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='select-helper-label'>Type</InputLabel>
                  <Controller
                    name='condType'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label='Type'
                        labelId='select-helper-label'
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.condType)}
                        aria-describedby='validation-schema-cond-type'
                      >
                        <MenuItem value={"address"}>Address</MenuItem>
                        <MenuItem value={"mail-subject"}>Mail Subject</MenuItem>
                        <MenuItem value={"domainsAutoCreationThreshold"}>Domains Auto Creation Threshold</MenuItem>
                        <MenuItem value={"numOfDomainsToAutoCreate"}>Number of Domains to auto-create</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.condType && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-cond-type'>
                      {errors.condType.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='condValue'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Value'
                        onChange={onChange}
                        placeholder='Enter value for condition'
                        error={Boolean(errors.condValue)}
                        aria-describedby='validation-schema-cond-value'
                      />
                    )}
                  />
                  {errors.condValue && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-cond-value'>
                      {errors.condValue.message}
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

export default AddParsingConditionDialog
