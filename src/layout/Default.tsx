import { Outlet } from 'react-router-dom'
// import React from 'react'
// import Header from '@app/layout/components/Header'
// import commonStore from '@app/store/commonStore/CommonStore'
// import { useDispatch } from 'react-redux'

const Default = () => {
  // const [displaySidebar, setDisplaySidebar] = React.useState<boolean>(false)
  // const dispatch = useDispatch()

  // const handleChangeSideStatus = () => {
  //   setDisplaySidebar(!displaySidebar)
  //   dispatch(commonStore.actions.setSidebar(!displaySidebar))
  // }

  return (
    <div>
      {/* <Header displaySidebar={displaySidebar} handleChangeSideStatus={handleChangeSideStatus} /> */}
      <div
        style={{
          transition: 'all 0.2s ease',
        }}
      >
        <Outlet />
      </div>
    </div>
  )
}

export default Default
