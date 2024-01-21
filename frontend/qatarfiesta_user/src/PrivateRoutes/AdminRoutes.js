import React from 'react'

function AdminRoutes() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='dashboard/' element={<Dashboard />} />
        <Route path='user/' element={<UserManage />} />
        <Route path='organizer/' element={<OrganizerManage />} />
        <Route path='category/' element={<CategoryManage />} />
      </Routes>
      
      </div>
        </Router>
  )
}

export default AdminRoutes
