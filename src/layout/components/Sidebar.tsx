import { Link, useNavigate } from 'react-router-dom'
import './Header.scss'

import styled from '@emotion/styled'
import {
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  MenuItem,
  Badge,
  IconButton,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '@app/store/store'
import React, { useState } from 'react'
import { replaceRouteParam } from '@app/config/routes'
import { PlusOneSharp } from '@mui/icons-material'
import EditIcon from '@mui/icons-material/Edit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

export const drawerWidth = 240
export const drawerWidthRight = 360

type SidebarProps = {
  open: boolean
  setTitle: (str: string) => void
}

type LinkItemsType = {
  id: string
  text: string
  icon?: string
  link?: string
  disabled?: boolean
  onClickAdd?: () => void
  onClickEdit?: (id: string) => void
}

export const StyledDrawer = styled(Drawer)<{
  $type?: 'left' | 'right'
  $darkMode: boolean
}>`
  ${({ $type }) => `width: ${$type === 'left' ? drawerWidth : drawerWidthRight}px;`}
  flex-shrink: 0;

  & .MuiDrawer-paper {
    ${({ $type }) => `width: ${$type === 'left' ? drawerWidth : drawerWidthRight}px;`}
    height: fit-content;
    ${({ $type }) => `${$type === 'left' ? 'height: 100%;' : 'max-height: 100%;'}`}
    overflow: auto;
    background: rgba(221, 206, 206, 0.25);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 0px 0px 10px 0px;
    border: 1px solid rgba(255, 255, 255, 0.4);

    .Mui-selected {
      border-radius: 10px;
      ${({ $darkMode }) => `background: ${$darkMode ? '#bcc2d266' : ' rgba(20, 27, 45, 0.4)'};`}

      &:hover {
        border-radius: 10px;
      }
    }

    .MuiListItemButton-root {
      border-radius: 10px;
    }

    box-sizing: border-box;
  }

  .css-azpq5 {
    padding: 0px;
  }
`

const StyledLink = styled(Link)`
  width: 100%;
  padding: 0px;
`

const Sidebar = (props: SidebarProps) => {
  const { open, setTitle } = props
  const navigate = useNavigate()

  const { darkMode } = useSelector((state: RootState) => state.commonStore)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openPopover, setOpenPopover] = useState(false)

  const linkItems: LinkItemsType[] = [
    {
      id: 'setting',
      text: 'Setting',
      icon: 'fa-solid fa-gears',
    },
    {
      id: 'dashboard',
      text: 'Dashboard',
      icon: 'fa-solid fa-bars-progress',
      link: '/',
    },
    // {
    //   id: 'tag',
    //   text: 'Tag',
    //   icon: 'fa-solid fa-tags',
    //   onClickAdd: () => {
    //     setDialogTagStatus('add')
    //   },
    //   onClickEdit: (id: string) => {
    //     setDialogTagStatus('edit')
    //     const editItem = tagList.find((it) => it.id === id)
    //     dispatch(tagStore.actions.setEditItem(editItem))
    //   },
    // },
    // {
    //   id: 'project',
    //   text: 'Project',
    //   icon: 'fa-solid fa-diagram-project',
    //   onClickAdd: () => {
    //     setDialogProjectStatus('add')
    //   },
    //   onClickEdit: (id: string) => {
    //     setDialogProjectStatus('edit')
    //     const editItem = projectList.find((it) => it.id === id)
    //     dispatch(projectStore.actions.setEditItem(editItem))
    //   },
    // },
  ]

  function handleChooseLink(item: LinkItemsType): void {
    setTitle(item.text)
  }

  const handleSettingClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpenPopover(true)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
    setOpenPopover(false)
  }

  return (
    <StyledDrawer variant='persistent' anchor='left' open={open} $type='left' $darkMode={darkMode}>
      {/* {settingDialogStatus === 'setting' && (
        <MSettingFormContainer onReturn={() => setSettingDialogStatus(undefined)} mode='edit' />
      )}
      {dialogProjectStatus && (
        <ProjectFormContainer
          mode={dialogProjectStatus}
          onReturn={() => {
            setDialogProjectStatus(undefined)
            dispatch(tagStore.actions.setEditItem(undefined))
          }}
        />
      )}
      {dialogTagStatus && (
        <TagFormContainer
          mode={dialogTagStatus}
          onReturn={() => {
            dispatch(tagStore.actions.setEditItem(undefined))
            setDialogTagStatus(undefined)
          }}
        />
      )} */}

      {/* {settingDialogStatus === 'checkpoint' && (
        <Dialog
          open
          title='All Checkpoints'
          data-testid='checkpoint-list'
          onClickReturn={() => setSettingDialogStatus(undefined)}
          fullWidth
          selfContentAndActions
        >
          <CheckPointList />
        </Dialog>
      )} */}

      <List>
        {linkItems.map((item) => {
          const [openCollapse, setOpenCollapse] = useState(false)
          const [hover, setHover] = useState(false)

          const childrenDataList: any[] = []
          const path = ''

          // switch (item.id) {
          //   case 'tag':
          //     childrenDataList = [...tagList].sort(
          //       (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          //     )
          //     path = paths.tagEditPath
          //     break
          //   case 'project':
          //     childrenDataList = [...projectList].sort(
          //       (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          //     )
          //     path = paths.projectEditPath
          //     break
          // }

          return (
            <div
              key={item.id}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              {item.id === 'setting' ? (
                <>
                  <ListItem
                    style={{
                      paddingTop: '0px',
                      paddingBottom: '0px',
                      color: darkMode ? 'white' : 'black',
                    }}
                  >
                    <ListItemButton
                      onClick={(event) => {
                        handleSettingClick(event)
                        setHover(false)
                      }}
                    >
                      <FontAwesomeIcon icon={item.icon as IconProp} shake={hover} />
                      &nbsp;&nbsp;{item.text}
                    </ListItemButton>
                  </ListItem>

                  <Popover
                    open={openPopover}
                    anchorEl={anchorEl}
                    onClose={() => {
                      handleClosePopover()
                      setHover(false)
                    }}
                    sx={{
                      '& .MuiPaper-root': {
                        borderRadius: '15px',
                        padding: '10px',
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleClosePopover()
                      }}
                      style={{ padding: '8px', width: '250px', borderRadius: '10px' }}
                    >
                      Setting
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClosePopover()
                      }}
                      style={{ padding: '8px', width: '250px', borderRadius: '10px' }}
                    >
                      Checkpoint Setting
                    </MenuItem>
                  </Popover>
                </>
              ) : !item.link ? (
                <>
                  <ListItem
                    style={{
                      paddingTop: '0px',
                      paddingBottom: '0px',
                      color: darkMode ? 'white' : 'black',
                    }}
                  >
                    <ListItemButton onClick={() => setOpenCollapse(!openCollapse)}>
                      <ListItemText
                        primary={
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>
                              <FontAwesomeIcon icon={item.icon as IconProp} shake={hover} />
                              &nbsp;&nbsp; {item.text}
                            </span>
                            <Badge
                              badgeContent={
                                childrenDataList.length ? childrenDataList.length : undefined
                              }
                              color='primary'
                            >
                              <IconButton
                                size='small'
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  item?.onClickAdd ? item?.onClickAdd() : undefined
                                }}
                              >
                                <PlusOneSharp fontSize='small' />
                              </IconButton>
                            </Badge>
                          </div>
                        }
                      />
                    </ListItemButton>
                  </ListItem>

                  <Collapse in={openCollapse} timeout='auto' unmountOnExit>
                    <List component='div' disablePadding>
                      {childrenDataList.map((childItem) => {
                        const handleClickPath = () => {
                          if (!path) return
                          navigate(replaceRouteParam(path, { id: childItem.id }))
                        }

                        return (
                          <ListItem key={childItem.id} style={{ paddingLeft: '30px' }}>
                            <ListItemButton onClick={handleClickPath}>
                              <ListItemText primary={childItem.name} />
                              <IconButton
                                size='small'
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  item?.onClickEdit ? item?.onClickEdit(childItem?.id) : undefined
                                }}
                              >
                                <EditIcon fontSize='small' />
                              </IconButton>
                            </ListItemButton>
                          </ListItem>
                        )
                      })}
                    </List>
                  </Collapse>
                </>
              ) : (
                <StyledLink
                  to={item.link}
                  style={{
                    pointerEvents: item.disabled ? 'none' : undefined,
                  }}
                >
                  <ListItem
                    onClick={() => handleChooseLink(item)}
                    style={{
                      paddingTop: '0px',
                      paddingBottom: '0px',
                      color: darkMode ? 'white' : 'black',
                    }}
                  >
                    <ListItemButton
                      selected={location.pathname.split('/')[1] === item?.link.replace('/', '')}
                      disabled={item.disabled}
                    >
                      <ListItemText
                        primary={
                          <>
                            <FontAwesomeIcon icon={item.icon as IconProp} shake={hover} />
                            &nbsp;&nbsp;{item.text}
                          </>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </StyledLink>
              )}
            </div>
          )
        })}
      </List>
    </StyledDrawer>
  )
}

export default Sidebar
