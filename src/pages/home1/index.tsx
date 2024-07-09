// ** React Imports
import { ReactNode, useState } from 'react'
import { useSearchParams } from 'next/navigation'

// ** MUI Components
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'
import { redirectDomainToBusiness } from 'src/@db-api/relink/landing'

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Home = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('d');
  const [loading, setLoading] = useState(false);
  const [orderNum, setOrderNum] = useState<number>()
  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (search && search !== "" && orderNum) {
      setLoading(true);
      redirectDomainToBusiness(search, orderNum).then((resp) => {
        if (resp && resp !== "" && resp.startsWith("http")) {
          setLoading(false);
          window.location.assign(resp)
        }
        setLoading(false);
      })
    } else return
  }
     
  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <BoxWrapper>
          <Box sx={{ mb: 5.75, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
              Thank you for your purchase 🎉
            </Typography>
            {loading ? (<Typography variant='body2'>
              Please wait for a while. You are being redirected to your business url.
              <br />This is for the first time only
            </Typography>) : (<Typography variant='body2'>
              Please submit your order number here
            </Typography>)}
          </Box>
          <form onSubmit={onSubmit}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TextField
                focused
                size='small'
                type='number'
                required
                placeholder='Enter your order number'
                value={orderNum}
                onChange={(e) => setOrderNum(e.target.value as unknown as number)}
              />
              <Button type='submit' disabled={loading} variant='contained' sx={{ ml: 2.5, pl: 5.5, pr: 5.5 }}>
                Submit
              </Button>
            </Box>
          </form>
        </BoxWrapper>
      </Box>
      <FooterIllustrations />
    </Box>
  )
}

Home.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Home
