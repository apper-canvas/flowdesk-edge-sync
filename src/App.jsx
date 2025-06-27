import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import CustomDashboard from '@/components/pages/CustomDashboard'
import Contacts from '@/components/pages/Contacts'
import Companies from '@/components/pages/Companies'
import Deals from '@/components/pages/Deals'
import Activities from '@/components/pages/Activities'
function App() {
  return (
    <>
<Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard/builder" element={<CustomDashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/activities" element={<Activities />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="text-sm"
        bodyClassName="text-sm"
        style={{ zIndex: 9999 }}
      />
    </>
  )
}

export default App