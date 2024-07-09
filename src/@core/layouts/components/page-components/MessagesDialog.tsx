// ** React Imports
import { Fragment } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { Breakpoint } from '@mui/material/styles'
import { ShopifyGoldenRowType } from 'src/@db-api/types'
import { Card, CardContent, Typography } from '@mui/material'

// ** React Imports
import { SyntheticEvent, useState } from 'react'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { sendTestMessage } from 'src/@db-api/shopify/shopifyGoldenApi'

type dialogProps = {
  maxWidth: Breakpoint,
  handleClose: () => void,
  open: boolean,
  data?: ShopifyGoldenRowType
}

const MessagesDialog = ({ maxWidth, open, handleClose, data }: dialogProps) => {
  // ** States
  const [value, setValue] = useState<string>('0')
  const [loading, setLoading] = useState(false)
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const srSendMessageForTest = async (msgId: string) => {
    if (data && data.gmailMsgId && msgId) {
      setLoading(true)
      sendTestMessage(data.gmailMsgId, msgId).then(() => {
        setLoading(false)
      })
    }
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
        <DialogContent>
          <Card>
            <TabContext value={value}>
              <TabList onChange={handleChange} aria-label='card navigation example'>
                {data && data?.messages && data.messages.map((item, idx) => (
                  <Tab key={item.messageId} value={`${idx}`} label={`Message ${idx + 1}`} />
                ))}
              </TabList>
              <CardContent sx={{ textAlign: 'left' }}>
                {data && data?.messages && data.messages.map((item, idx) => (
                  <TabPanel key={item.messageTitle} value={`${idx}`} sx={{ p: 0 }}>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                      {item.messageTitle}
                    </Typography>
                    <Typography variant='body2' sx={{ mb: 4, whiteSpace: 'pre-line' }}>
                      {item.messageBody}
                    </Typography>
                    <Button variant='contained' disabled={loading} onClick={() => srSendMessageForTest(item.messageId)}>Send to Test</Button>
                  </TabPanel>
                ))}
              </CardContent>
            </TabContext>
          </Card>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default MessagesDialog
