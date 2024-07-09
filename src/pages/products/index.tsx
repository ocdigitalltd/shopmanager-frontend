// ** React Imports
import { Fragment, useCallback, useEffect } from 'react'

// ** MUI Imports
import { RelinkProductType } from 'src/@db-api/types'
import { Box, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'

// ** React Imports
import { useState } from 'react'
import axios from 'axios'
import baseUrl from 'src/configs/bkUrl'
import { useAuth } from 'src/hooks/useAuth'
import FallbackSpinner from 'src/@core/components/spinner'

const ProductsPage = () => {
  // ** States
  const [data, setData] = useState<RelinkProductType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { user } = useAuth()

  const fetchUserData = useCallback(
    async (id: string) => {
      setLoading(true)
      await axios
        .get(`${baseUrl}/user/products/${id}`)
        .then((res) => {
          setData(res.data.list as unknown as RelinkProductType[]);
          setLoading(false)
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    if (user && user?.id) fetchUserData(user?.id)
  }, [fetchUserData, user])

  return (
    <Fragment>
      <CardHeader sx={{ textAlign: "center" }} title='My Products' />
      {loading && <FallbackSpinner />}
      <Box sx={{ minHeight: "70vh" }}>
        {data?.length === 0 && (
          <div style={{ display: "flex", height: "68vh", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ textAlign: "center" }}>No data found</Typography>
          </div>
        )}
        <Grid container spacing={6}>
          {
            data.map((prod) => (
              <Grid
                item
                xs={12}
                md={6}
                lg={4}
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
                    <Typography sx={{ fontWeight: 500, mb: 3 }}>
                      Active:{'  '}
                      <Box component='span' sx={{ fontWeight: 'bold' }}>
                        {prod?.isActive ? "yes" : "no"}
                      </Box>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          }
        </Grid>
      </Box>
    </Fragment>
  )
}

export default ProductsPage

ProductsPage.acl = {
  action: 'read',
  subject: 'user-page'
}