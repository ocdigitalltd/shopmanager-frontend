// ** React Imports
import { Fragment } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { Breakpoint } from '@mui/material/styles'
import { RelinkProductType } from 'src/@db-api/types'
import { Card, CardContent, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'

type dialogProps = {
  maxWidth: Breakpoint,
  handleClose: () => void,
  open: boolean,
  data: RelinkProductType[]
}

const ProductsDialog = ({ maxWidth, open, handleClose, data }: dialogProps) => {
  // ** States

  return (
    <Fragment>
      <Dialog
        open={open}
        maxWidth={maxWidth}
        fullWidth={true}
        onClose={handleClose}
        aria-labelledby='max-width-dialog-title'
      >
        <DialogContent>
          <Box>
            <Grid container spacing={6}>
              {
                data.map((prod) => (
                  <Grid
                    item
                    xs={12}
                    md={12}
                    lg={6}
                    key={prod.productId}
                    sx={{ maxHeight: "400px" }}
                  >
                    <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CardContent>
                        <Typography variant='h6' sx={{ mb: 2 }}>
                          {prod.productName} - {prod.sku}
                        </Typography>
                        <Typography variant='body2' sx={{ mb: 3.5 }}>
                          Third level domain {': '} {prod.thirdLvlDomain}
                        </Typography>
                        <Typography variant='body2' sx={{ mb: 3.5 }}>
                          {prod.redirectUrlType} {' '} {prod.redirectUrl}
                        </Typography>
                        <Typography variant='body2' sx={{ mb: 3.5 }}>
                          Size:{' '}   {prod.productSize}
                        </Typography>
                        <Typography variant='body2' sx={{ mb: 3.5 }}>
                          Surface:{' '}{prod.surfaceType}
                        </Typography>
                        <Typography variant='body2' sx={{ mb: 3.5 }}>
                          Quantity:{' '}{prod.productQuantity}
                        </Typography>
                        <Typography sx={{ fontWeight: 500, mb: 3 }}>
                          Price:{' '}
                          <Box component='span' sx={{ fontWeight: 'bold' }}>
                            {prod.productPrice}
                          </Box>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              }
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default ProductsDialog
