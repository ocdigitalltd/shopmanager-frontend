// ** React Imports
import { SyntheticEvent, useState, useCallback, useEffect } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Button from '@mui/material/Button'
import TabContext from '@mui/lab/TabContext'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { MessageTemplate, ShopifyMessageTemplate, SortType, WarehousesRowType } from 'src/@db-api/types'
import baseUrl from 'src/configs/bkUrl'

// ** ThirdParty Components
import axios from 'axios'
import { Fade, Grid, IconButton, Paper, Popper, TextField, Typography } from '@mui/material'
import { updateMessageTemplate } from 'src/@db-api/shopify/shopifyGoldenApi'
import Icon from 'src/@core/components/icon'
import FallbackSpinner from 'src/@core/components/spinner'

const placeholdersData = [
  { type: "Warehouses", name: "$CUSTOMERNAME$", description: "Customer name" },
  { type: "Warehouses", name: "$SHIPPINGADDRESS$", description: "Shipping address of customer" },
  { type: "Warehouses", name: "$ORDERNUM$", description: "Order number" },
  { type: "Warehouses", name: "$PRODUCTLIST$", description: "List of products" },
  { type: "User Credentials", name: "$USEREMAIL$", description: "Email of the user" },
  { type: "User Credentials", name: "$USERNAME$", description: "Name of the user" },
  { type: "User Credentials", name: "$USERPASSWORD$", description: "Password of the user" },
]

const MessageEdit = ({ message, category, warehouses }: {
  message: MessageTemplate,
  category: string,
  warehouses: WarehousesRowType[]
}) => {
  const [value, setValue] = useState<string>(message.message);
  const [loading, setLoading] = useState(false);
  const fetchTemplData = useCallback(
    async () => {
      setLoading(true)
      await axios
        .get(`${baseUrl}/message/getMessageByKey/${message.title}`)
        .then((res) => {
          setValue((res.data)?.message?.value)
          setLoading(false)
        })
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    fetchTemplData()
  }, [fetchTemplData])

  const handleSubmit = async () => {
    setLoading(true)
    const resp = await updateMessageTemplate(message.title, value);
    if (resp && resp == true) fetchTemplData()
    setLoading(false)
  }

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label='Key/Title'
          placeholder='Title'
          value={category === "Warehouses" ? warehouses.filter(wh => wh.id === message.title)[0]?.name : message.title}
          disabled
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          autoFocus
          focused
          minRows={8}
          value={value}
          label='Message'
          placeholder='Template Message...'
          sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
          onChange={(e) => setValue(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Button type='button' variant='contained' size='large' disabled={loading} onClick={handleSubmit} >
          Update
        </Button>
      </Grid>
    </Grid>
  )
}

const TemplateCategory = ({ template, category, warehouses }: {
  template: MessageTemplate[],
  category: string,
  warehouses: WarehousesRowType[]
}) => {
  // ** State
  const [value, setValue] = useState<string>('0')
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <>
      <IconButton onClick={handleClick} color="info" title='placeholders' sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", margin: "-60px 10px 0px auto" }}>
        <Icon icon='mdi:info' fontSize={25} />
      </IconButton>
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label='card navigation example'>
          {template && template.map((item, idx) => (
            <Tab key={item.id} value={`${idx}`} label={`Message ${idx + 1}`} />
          ))}
        </TabList>
        <CardContent sx={{ textAlign: 'left' }}>
          {template && template.map((item, idx) => (
            <TabPanel key={item.title} value={`${idx}`} sx={{ p: 0 }}>
              <MessageEdit message={item} warehouses={warehouses} category={category} />
            </TabPanel>
          )
          )}
        </CardContent>
      </TabContext>
      <Popper
        sx={{ zIndex: 1200 }}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper sx={{ backgroundColor: "lightgrey" }}>
              <Typography sx={{ p: 4 }}>
                {placeholdersData.filter(data => data.type === category)?.map((item) => (
                  <Typography sx={{ color: "black", mb: 2 }} variant='body2' key={item.name}>
                    {item.name} - {item.description}
                  </Typography>
                ))}
              </Typography>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

const MessageTemplates = () => {
  // ** State
  const [templates, setTemplates] = useState<ShopifyMessageTemplate[]>([])
  const [value, setValue] = useState<string>("Login")
  const [warehouses, setWarehouses] = useState<WarehousesRowType[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const fetchWarehouses = useCallback(
    async (sort: SortType, q: string, paginationModel: { page: number; pageSize: number }, column: string) => {
      setLoading(true)
      await axios
        .get(`${baseUrl}/parsingSettings/warehouses`, {
          params: {
            q,
            ...paginationModel,
            sort,
            column
          }
        })
        .then(res => {
          setWarehouses(res.data?.list as unknown as WarehousesRowType[])
          setLoading(false)
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  useEffect(() => {
    fetchWarehouses('asc', '', { page: 0, pageSize: 100 }, 'name')
  }, [fetchWarehouses])

  const fetchData = useCallback(
    async () => {
      await axios
        .get(`${baseUrl}/message/templates`)
        .then(res => {
          setTemplates(res.data.data as unknown as ShopifyMessageTemplate[])
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) return <FallbackSpinner />
  else return (
    <>
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label='main tabs'>
          <Tab key="login" value={"Login"} label={`User Login`} />
          <Tab key="shopify" value={"Shopify"} label={`Shopify`} />
          <Tab key="warehouses" value={"Relink"} label={`Relink`} />
        </TabList>
        <TabPanel key={`${value}-content`} value={value} sx={{ p: 0 }}>
          {templates && templates?.filter(item => item.scope === value).map((templ) => (
            <>
              <Card key={templ.category} sx={{ my: 10 }}>
                <CardHeader title={`${templ.category} - (${templ.scope})`} />
                <TemplateCategory template={templ.messages} category={templ.category} warehouses={warehouses} />
              </Card>
            </>
          ))}
        </TabPanel>
      </TabContext>
    </>
  )
}

export default MessageTemplates
