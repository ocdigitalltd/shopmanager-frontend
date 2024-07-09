// ** React Imports
import { ReactNode, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

// ** MUI Components
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'
import { getMisprintedCardInfo } from 'src/@db-api/relink/landing'
import { useRouter } from 'next/router'

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Home = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('d');
  const router = useRouter();

  useEffect(() => {

    // if(search && redirectionCache[search]){
    //   window.location.assign(redirectionCache[search])
    // }
    // else 
    if(search) getMisprintedCardInfo(search).then((resp) => {
       if (resp && resp !== "" && resp.startsWith("http")) {
        console.log('page', resp)
         window.location.assign(resp)
       } 
       else router.push(`/home/?d=${search}`);
     })

     // eslint-disable-next-line
   }, [search]);
   
  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <BoxWrapper>
          <Box sx={{ mb: 5.75, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
              {search ? "Processing your request..." : "Welcome to Shop Manager App"}
            </Typography>
          </Box>
        </BoxWrapper>
      </Box>
      <FooterIllustrations />
    </Box>
  )
}

Home.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Home
