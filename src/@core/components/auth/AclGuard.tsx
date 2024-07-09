// ** React Imports
import { ReactNode } from 'react'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Config Import
import { ACLObj, AppAbility, buildAbilityFor, defaultACLObj } from 'src/configs/acl'

import { useAuth } from 'src/hooks/useAuth'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import NotAuthorized from 'src/pages/401'
import { useRouter } from 'next/router'
import { AnyAbility } from '@casl/ability'

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean,
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { children, aclAbilities } = props
  const { user } = useAuth();
  const router = useRouter()

  let ability: AppAbility

  // User is logged in, build ability for the user based on his role
  if (user && !ability) {
    ability = buildAbilityFor(user.role ?? "user", aclAbilities.subject)
  }

  // Render Not Authorized component if the current user has limited access
  if ((ability && user && ability.can(aclAbilities.action, aclAbilities.subject))
    || (router.route === "/" || router.route === "/login/" || router.route === "/login" || router.route.includes("/home"))) {

    return <AbilityContext.Provider value={buildAbilityFor(user?.role ?? "user", defaultACLObj.subject) as AnyAbility}>{children}</AbilityContext.Provider>
  }

  // Render Not Authorized component if the current user has limited access
  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

export default AclGuard
