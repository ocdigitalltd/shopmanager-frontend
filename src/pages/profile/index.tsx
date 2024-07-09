// ** React Imports

// ** MUI Imports

// ** Third Party Imports
import { useAuth } from 'src/hooks/useAuth'
import ProfileBasicInfoEdit from 'src/@core/layouts/components/page-components/ProfileBasicInfoEdit'
import CustomerProfileEdit from 'src/@core/layouts/components/page-components/CustomerProfileEdit'


const ProfilePage = () => {
  // ** State
  const { user } = useAuth()
  const isUserOrAdmin = (user?.role === 'admin' || user?.source === 'parsing')
  
  return (
    isUserOrAdmin ?
      <ProfileBasicInfoEdit user={user} /> :
      (user ?
        <CustomerProfileEdit user={user} />
        : <div>No data found</div>)

  )
}

export default ProfilePage;

ProfilePage.acl = {
  action: 'read',
  subject: 'user-page'
}