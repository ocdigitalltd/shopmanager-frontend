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
import { redirectMisprintedDomainToBusinessUrl } from 'src/@db-api/relink/landing'
import { Card, MenuItem, Select } from '@mui/material'
import PlacesSearchField from 'src/@core/components/form-fields/places-search-field'
import Icon from 'src/@core/components/icon'

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const initialForm = {
  email: '',
  businessUrl: '',
  name: '',
  phone: '',
  businessUrlType: "Google"
}

const Home = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('d');
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialForm)
  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (search && search !== "" && formValues.businessUrl && formValues.email && formValues.name) {
      setLoading(true);
      redirectMisprintedDomainToBusinessUrl(formValues, search).then((resp) => {
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
              Please submit your details here
            </Typography>)}
          </Box>
          <form onSubmit={onSubmit} style={{ minWidth: '40vw', background: '' }}>
            <Card sx={{ padding: '2rem' }}>
              <Box sx={{ display: 'flex', width: '100%', gap: '20px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Select
                  sx={{ width: '100%' }}
                  size='small'
                  required
                  value={formValues.businessUrlType}
                  onChange={(e) => setFormValues({ ...formValues, businessUrlType: e.target.value })}
                  aria-describedby='validation-schema-businessUrlType'
                >
                  <MenuItem sx={{ whiteSpace: "pre" }} value={"Google"}><Icon icon='mdi:google' fontSize={20} />{`  Google`}</MenuItem>
                  <MenuItem sx={{ whiteSpace: "pre" }} value={"Instagram"}><Icon icon='mdi:instagram' fontSize={20} />{"  Instagram"}</MenuItem>
                  <MenuItem sx={{ whiteSpace: "pre" }} value={"Trip-Advisor"}><Icon icon='bxl:trip-advisor' fontSize={20} />{"  Trip Advisor"}</MenuItem>
                  <MenuItem sx={{ whiteSpace: "pre" }} value={"Whatsapp"}><Icon icon='mdi:whatsapp' fontSize={20} />{"  Whatsapp"}</MenuItem>
                  <MenuItem sx={{ whiteSpace: "pre" }} value={"Facebook"}><Icon icon='mdi:facebook' fontSize={20} />{"  Facebook"}</MenuItem>
                </Select>
                {formValues.businessUrlType === "Google" ?
                  <PlacesSearchField onChange={(val) => setFormValues({ 
                    ...formValues, name: val.placeName, businessUrl: `https://search.google.com/local/writereview?placeid=${val.placeId}` 
                  })} />
                  :
                  <>
                    <TextField
                      sx={{ width: '100%' }}
                      focused
                      size='small'
                      required
                      placeholder='Enter your business name'
                      value={formValues.name}
                      onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                    />
                    <TextField
                      sx={{ width: '100%' }}
                      focused
                      size='small'
                      required
                      placeholder='Enter your business url'
                      value={formValues.businessUrl}
                      onChange={(e) => setFormValues({ ...formValues, businessUrl: e.target.value })}
                    />
                  </>
                }
                <TextField
                  sx={{ width: '100%' }}
                  focused
                  size='small'
                  type='email'
                  required
                  placeholder='Enter your email'
                  value={formValues.email}
                  onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                />
                <TextField
                  sx={{ width: '100%' }}
                  focused
                  size='small'
                  type='number'
                  required
                  placeholder='Enter your phone'
                  value={formValues.phone}
                  onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
                />
                <Button type='submit' disabled={loading} variant='contained' sx={{ ml: 'auto', pl: 10, pr: 10 }}>
                  Submit
                </Button>
              </Box>
            </Card>
          </form>
        </BoxWrapper>
      </Box>
      <FooterIllustrations />
    </Box>
  )
}

Home.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Home
