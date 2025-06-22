import './Header.scss'
import { AppContext } from '@app/config/context'
import { useContext, useEffect } from 'react'
import React from 'react'
import styled from '@emotion/styled'
import { MenuItem, IconButton, Menu } from '@mui/material'
import { Person } from '@mui/icons-material'
import { loggingOut } from '@app/api/axios'
import { fetchUserProfile, postLogout } from '@app/api/login/login-api'
import { useSelector } from 'react-redux'
import { RootState } from '@app/store/store'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { useDispatch } from 'react-redux'
import commonStore from '@app/store/commonStore/CommonStore'
import { getAsString } from '@app/helpers/LocalStorageUtils'
import { TOKEN_KEY } from '@app/config/constants'

const StyledMenu = styled(MenuItem)`
  width: 220px;
`

const Header = () => {
  const dispatch = useDispatch()

  const { extensionSidebar, darkMode, loadingStatusInit } = useSelector(
    (state: RootState) => state.commonStore,
  )

  const { removeUser } = useContext(AppContext)

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const displayMenu = Boolean(anchorEl)

  useEffect(() => {
    const handleLoadProfile = async () => {
      const profileData = await fetchUserProfile()
      dispatch(commonStore.actions.setProfile(profileData))
    }
    if (getAsString(TOKEN_KEY)) {
      handleLoadProfile()
    }
  }, [])

  useEffect(() => {
    if (loadingStatusInit !== 'NotLoad') {
      dispatch(commonStore.actions.setLoadingStatusInit('NotLoad'))
    }
  }, [])

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLogout = () => {
    try {
      postLogout()
      removeUser()
      loggingOut()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div
      className='header'
      style={{
        height: '0px',
        transition: 'all 0.2s ease',
        backgroundColor: 'transparent',
      }}
    >
      <div
        className={`${darkMode ? 'dark-mode' : 'light-mode'} header-right ${
          extensionSidebar ? 'header-right-expanded' : 'header-right-collapsed'
        }`}
        style={{ position: 'absolute', right: '0px' }}
      >
        <IconButton onClick={() => dispatch(commonStore.actions.setDarkmode(!darkMode))}>
          {darkMode ? (
            <DarkModeOutlinedIcon className='icon' />
          ) : (
            <LightModeOutlinedIcon className='icon' />
          )}
        </IconButton>
        <IconButton onClick={handleClick}>
          <Person className='icon' />
        </IconButton>
        <Menu
          id='basic-menu'
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={displayMenu}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <StyledMenu onClick={handleLogout}>Logout</StyledMenu>
        </Menu>
      </div>
    </div>
  )
}

export default Header
