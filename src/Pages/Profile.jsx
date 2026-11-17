import { useMemo, useState } from 'react'
import { Tabs } from 'antd'
import PageHeader from '../components/ui/PageHeader'
import Panel from '../components/ui/Panel'
import PersonalDetails from '../components/Profile/PersonalDetails'
import AccountDetails from '../components/Profile/AccountDetails'
import ManageAccounts from '../components/Profile/ManageAccounts'
import { getRole } from '../lib/auth'

export default function Profile() {
  const role = getRole()
  const [tab, setTab] = useState('personal')

  const items = useMemo(() => {
    const list = [{ key: 'personal', label: 'Personal details', children: <PersonalDetails role={role} /> }]
    // Bank details belong to admin accounts; super admins manage other admins.
    if (role === 'admin') list.push({ key: 'bank', label: 'Bank details', children: <AccountDetails /> })
    if (role === 'superAdmin') {
      list.push({ key: 'accounts', label: 'Admin accounts', children: <ManageAccounts /> })
    }
    return list
  }, [role])

  return (
    <div>
      <PageHeader title="Account settings" subtitle="Manage your profile and dashboard access." />
      <Panel bodyClassName="px-4 pb-6 sm:px-6">
        <Tabs activeKey={tab} onChange={setTab} items={items} />
      </Panel>
    </div>
  )
}
