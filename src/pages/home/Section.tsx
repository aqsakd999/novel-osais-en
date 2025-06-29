import React, { useEffect, useState } from 'react'
import {
  Grid,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  styled,
  Pagination,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  Button,
} from '@mui/material'
import {
  DATA_SOURCE,
  Footer,
  FooterContainer,
  generateDate,
  Header,
  LanguageConfigItem,
  Story,
  TAGS,
} from './HomePage'
import { useMediaQuery } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@app/config/supabaseClient'
import { useLocation } from 'react-router-dom'
import { ClearIcon } from '@mui/x-date-pickers/icons'
import { Search } from '@mui/icons-material'
import RealAdsterraPage from './Banner'

const GridStyled = styled(Grid)`
  padding: 60px;

  @media (max-width: 767px) {
    padding: 20px;
  }
`

export const setImageUrl = (value: string, sub_type: string) => {
  const imgList = [
    {
      url: 'Jvx9B',
      title: 'abadoned_elevator',
      type: 'reddit',
    },
    {
      url: 'JvuAy',
      title: 'abadoned_school',
      type: 'reddit',
      file: 'jpg',
    },
    {
      url: 'Jv6a2',
      title: 'alien_in_a_space_suit',
      type: 'reddit',
    },
    {
      url: 'Jvyku',
      title: 'burying_deep_ground',
      type: 'reddit',
    },
    {
      url: 'Jvszp',
      title: 'cabin_in_middle_of_no_where',
      type: 'reddit',
      file: 'jpg',
    },
    {
      url: 'JvkpE',
      title: 'camera_room_black_white',
      type: 'reddit',
      file: 'jpg',
    },
    {
      url: 'JvWAM',
      title: 'city_tsunami_flooded',
      type: 'reddit',
    },
    {
      url: 'J318l',
      title: 'computer_01',
      type: 'tech',
    },
    {
      url: 'J3pWr',
      title: 'computer_02',
      type: 'tech',
    },
    {
      url: 'J30bc',
      title: 'computer_03',
      type: 'tech',
    },
    {
      url: 'J3LNX',
      title: 'computer_04',
      type: 'tech',
    },
    {
      url: 'J3ZCM',
      title: 'computer_05',
      type: 'tech',
    },
    {
      url: 'J3mBU',
      title: 'computer_06',
      type: 'tech',
    },
    {
      url: 'J3q7h',
      title: 'computer_07',
      type: 'tech',
    },
    {
      url: 'JvX9U',
      title: 'creepy_clown',
      type: 'reddit',
      file: 'jpg',
    },
    {
      url: 'Jvwkh',
      title: 'dark_street_lonely_man_standing',
      type: 'reddit',
      file: 'jpg',
    },
    {
      url: 'JvdtN',
      title: 'dead_space_suite_in_space',
      type: 'reddit',
      file: 'jpg',
    },
    {
      url: 'Jv55H',
      title: 'dear_like_monster_in_the_forest',
      type: 'reddit',
    },
    {
      url: 'JvVm9',
      title: 'DNA',
      type: 'reddit',
    },
    {
      url: 'J3nxN',
      title: 'docker_1',
      type: 'tech',
    },
    {
      url: 'J3rDH',
      title: 'docker_2',
      type: 'tech',
    },
    {
      url: 'Jv7oT',
      title: 'evel_woman_creepy_behind_the_wall',
      type: 'reddit',
      file: 'jpg',
    },
    {
      url: 'Jv4za',
      title: 'festival_colorful',
      type: 'reddit',
    },
    {
      url: 'Jv2Q6',
      title: 'frozen_city',
      type: 'reddit',
    },
    {
      url: 'JvC1P',
      title: 'future_technology_advance_glass',
      type: 'reddit',
    },
    {
      url: 'JvEHK',
      title: 'ghost_ship',
      type: 'reddit',
    },
    {
      url: 'JvI9D',
      title: 'giant_humanoid_figure_in_the_forest',
      type: 'reddit',
    },
    {
      url: 'Jv85R',
      title: 'island_beach_shore_colorful',
      type: 'reddit',
    },
    {
      url: 'J3KqT',
      title: 'java',
      type: 'tech',
    },
    {
      url: 'J3kW9',
      title: 'java_2',
      type: 'tech',
    },
    {
      url: 'Jvhte',
      title: 'mysterious_advance_door_in_middle_of_nowhere',
      type: 'reddit',
    },
    {
      url: 'Jvzun',
      title: 'nosleep_text',
      type: 'reddit',
    },
    {
      url: 'JvMoQ',
      title: 'outa_world_magic_city',
      type: 'reddit',
    },
    {
      url: 'J3uM6',
      title: 'postgres_1',
      type: 'tech',
    },
    {
      url: 'J36Na',
      title: 'postgres_2',
      type: 'tech',
    },
    {
      url: 'J3FbP',
      title: 'react_1',
      type: 'tech',
    },
    {
      url: 'J3yEK',
      title: 'react_2',
      type: 'tech',
    },
    {
      url: 'JvSQz',
      title: 'red_glitch_computer',
      type: 'tech',
    },
    {
      url: 'JvRn0',
      title: 'scientist_holding_weird_liquid',
      type: 'reddit',
    },
    {
      url: 'JvDNp',
      title: 'scp_logo_02',
      type: 'reddit',
    },
    {
      url: 'JvjHE',
      title: 'scp_logo_03',
      type: 'reddit',
    },
    {
      url: 'Jvl8g',
      title: 'scp_logo_1',
      type: 'reddit',
    },
    {
      url: 'JvvCy',
      title: 'solo_man_walking_on_battle_field',
      type: 'reddit',
      file: 'jpg',
    },
    {
      url: 'JvaBB',
      title: 'space_landscape',
      type: 'reddit',
    },
    {
      url: 'Jvtu2',
      title: 'space_ship_1',
      type: 'reddit',
    },
    {
      url: 'J3B7u',
      title: 'space_ship_above_the_ocean_dark',
      type: 'reddit',
    },
    {
      url: 'J3bxe',
      title: 'spring_boot_1',
      type: 'tech',
    },
    {
      url: 'J3HBD',
      title: 'spring_boot_2',
      type: 'tech',
    },
    {
      url: 'J3Jov',
      title: 'stair_case_by_the_shore_in_the_myst',
      type: 'reddit',
    },
    {
      url: 'J3Yn5',
      title: 'stone_circle_in_the_forest',
      type: 'reddit',
    },
    {
      url: 'JvAwv',
      title: 'super_advanced_city',
      type: 'reddit',
    },
    {
      url: 'JvHl5',
      title: 'white_figure_woman_in_the_forest',
      type: 'reddit',
    },
    {
      url: 'JvGOl',
      title: 'winged_super_hero_flying',
      type: 'reddit',
    },
    {
      url: 'Jvgmr',
      title: 'witch_in_the_cave_misty',
      type: 'reddit',
    },
    {
      url: 'JvUzX',
      title: 'writing_prompt',
      type: 'reddit',
      file: 'jpg',
    },
    {
      url: 'JvQ1c',
      title: 'zombie_apocalypse',
      type: 'reddit',
    },
  ]
  let returnVal = imgList.find((it) => it.title === value)?.url

  if (!returnVal && DATA_SOURCE === 'tech') {
    returnVal = imgList.find((it) => it.title === 'computer_07')?.url
  }
  if (!returnVal && sub_type === 'nosleep') {
    returnVal = imgList.find((it) => it.title === 'nosleep_text')?.url
  }
  if (!returnVal && sub_type === 'writing_prompt') {
    returnVal = imgList.find((it) => it.title === 'writing_prompt')?.url
  }
  if (!returnVal && sub_type === 'scp') {
    returnVal = imgList.find((it) => it.title === 'scp_logo_1')?.url
  }
  if (!returnVal && sub_type === 'scifi') {
    returnVal = imgList.find((it) => it.title === 'space_landscape')?.url
  }
  const fileType = imgList.find((it) => it.url === returnVal)?.file
  if (fileType) {
    return `https://imgbrr.co/images/${returnVal}.${fileType}`
  }
  return `https://imgbrr.co/images/${returnVal}.png`
}

const StyledBox = styled(Box)`
  padding-top: 80px;
  padding-left: 80px;
  padding-right: 80px;

  @media (max-width: 767px) {
    padding-top: 80px;
    padding-bottom: 20px;
    padding-right: 20px;
    padding-left: 20px;
  }
`

const Section: React.FC<{ type?: string }> = (props: { type?: string }) => {
  const { type } = props
  const navigate = useNavigate()

  const { search: searchCat } = useLocation()
  const queryParams = new URLSearchParams(searchCat)
  const initialName = queryParams.get('name') || ''
  const categories = queryParams.get('category')?.split(',') || []

  const [showTags, setShowTags] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>(categories)
  const [stories, setStories] = useState<Story[]>([])

  const [inputValue, setInputValue] = useState(initialName)
  const [search, setSearch] = useState(initialName ?? '')

  const [orderBy, setOrderBy] = useState<'date' | 'hot' | 'views'>('date')
  const [displayMode, setDisplayMode] = useState<'default' | 'compact'>('default')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // useEffect(() => {
  //   if (categories.length == 0) {
  //     navigate('/')
  //   }
  // }, [categories, navigate])

  const limit = 8
  const isMobile = useMediaQuery('(max-width: 720px)')
  const compactMode = displayMode === 'compact'

  const updateURLParams = (newSearch: string, newCategories: string[]) => {
    const newParams = new URLSearchParams()

    if (newSearch) newParams.set('name', newSearch)
    if (newCategories.length > 0) newParams.set('category', newCategories.join(','))

    navigate({ search: newParams.toString() }, { replace: true })
  }

  // Force "default" if not mobile
  useEffect(() => {
    if (
      localStorage.getItem('DISPLAY_SECTION_MODE') &&
      localStorage.getItem('DISPLAY_SECTION_MODE') !== displayMode
    ) {
      setDisplayMode(
        localStorage.getItem('DISPLAY_SECTION_MODE') === 'compact' ? 'compact' : 'default',
      )
    } else if (!isMobile) {
      setDisplayMode('default')
    }
  }, [isMobile])

  const paramCat = queryParams.get('category')

  useEffect(() => {
    fetchStories()
  }, [search, orderBy, page, paramCat])

  useEffect(() => {
    localStorage.setItem('DISPLAY_SECTION_MODE', displayMode)
  }, [displayMode])

  useEffect(() => {
    const updatedTags = new URLSearchParams(searchCat).get('category')?.split(',') || []
    setSelectedTags(updatedTags)
  }, [searchCat])

  const fetchStories = async () => {
    // searchType = 'youtube' -> last_post_youtube_full = true
    const offset = (page - 1) * limit
    let query = supabase.from('stories').select('*', { count: 'exact' }) // cần count để tính total page

    // Tìm kiếm theo tiêu đề
    if (search) {
      query = query.ilike('title', `%${search}%`)
    }

    if (selectedTags.length > 0) {
      query = query.contains('category', selectedTags)
    }

    // Sắp xếp theo lựa chọn
    if (orderBy === 'date') {
      query = query.order('actualdisplaytime', { ascending: false })
    } else if (orderBy === 'hot') {
      query = query.order('upvotes', { ascending: false })
    } else if (orderBy === 'views') {
      query = query.order('views', { ascending: false })
    }

    // Phân trang
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching stories:', error)
      return
    }

    setStories(data || [])
    setTotalPages(Math.ceil((count || 0) / limit))
  }

  const handleSearchSubmit = () => {
    setSearch(inputValue)
    updateURLParams(inputValue, selectedTags)
    setPage(1)
  }

  const handleClear = () => {
    setInputValue('')
    setSearch('')
    setSelectedTags([])
    setPage(1)
    updateURLParams('', [])
  }

  return (
    <div style={{ backgroundColor: '#F2F0EB	' }}>
      <Header />
      <div style={{ minHeight: '90vh' }}>
        <StyledBox>
          <Grid container spacing={2}>
            {/* Search Field */}
            <Grid item xs={12} sm={isMobile ? 6 : 8}>
              <TextField
                label={LanguageConfigItem.searchPostLabel}
                variant='outlined'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchSubmit()
                }}
                fullWidth
                size='small'
              />
            </Grid>

            {/* Order By Select */}
            <Grid item xs={6} sm={isMobile ? 3 : 4}>
              <FormControl fullWidth variant='outlined'>
                <InputLabel>Order By</InputLabel>
                <Select
                  value={orderBy}
                  onChange={(e) => setOrderBy(e.target.value as 'date' | 'hot' | 'views')}
                  label='Order By'
                  size='small'
                >
                  <MenuItem value='date'>Date</MenuItem>
                  <MenuItem value='hot'>Hot</MenuItem>
                  <MenuItem value='views'>Views</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {isMobile && (
              <Grid item xs={6} sm={3} md={3}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel size='small'>Display Mode</InputLabel>
                  <Select
                    value={displayMode}
                    size='small'
                    onChange={(e) => setDisplayMode(e.target.value as 'default' | 'compact')}
                    label='Display Mode'
                  >
                    <MenuItem value='default'>Default</MenuItem>
                    <MenuItem value='compact'>Compact</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </StyledBox>
        <div
          style={{
            paddingTop: '0px',
            paddingRight: isMobile ? '20px' : '10%',
            paddingLeft: isMobile ? '20px' : '10%',
          }}
        >
          <div
            style={{
              marginTop: '8px',
              cursor: 'pointer',
              fontWeight: 'bolder',
            }}
            onClick={() => setShowTags(!showTags)}
          >
            {showTags ? LanguageConfigItem.expandTagSearch : LanguageConfigItem.closeTagSearch}
          </div>

          {showTags && (
            <Box>
              <FormGroup row>
                {TAGS.map((tag) => (
                  <FormControlLabel
                    key={tag.value}
                    control={
                      <Checkbox
                        checked={selectedTags.includes(tag.value)}
                        onChange={(e) => {
                          const newTags = e.target.checked
                            ? [...selectedTags, tag.value]
                            : selectedTags.filter((t) => t !== tag.value)
                          setSelectedTags(newTags)
                        }}
                      />
                    }
                    label={tag.label}
                  />
                ))}
              </FormGroup>
            </Box>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
          <Button
            variant='contained'
            color='warning'
            onClick={handleClear}
            sx={{
              backgroundColor: 'orange',
              marginRight: '20px',
            }}
          >
            <ClearIcon /> Clear Search
          </Button>
          <Button variant='contained' onClick={handleSearchSubmit}>
            <Search /> Search
          </Button>
        </div>
        <div>
          <RealAdsterraPage />
        </div>

        <div
          style={{
            paddingLeft: isMobile ? '0px' : '180px',
            paddingRight: isMobile ? '0px' : '180px',
          }}
        >
          <GridStyled
            container
            spacing={compactMode ? 0.5 : 2}
            sx={{ width: isMobile ? '100%' : 'calc(100% - 40px)' }}
          >
            {stories.map((story) => (
              <Grid item xs={6} sm={6} md={4} lg={3} key={story.id}>
                <Box
                  onClick={() => navigate(`/novel/${story.slug}`)}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: '3px 3px 5px 3px rgb(0 0 0 / 70%)',
                    height: displayMode === 'default' ? 400 : 'auto',
                    overflow: 'auto',
                    transition:
                      'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',

                    '&:hover': {
                      cursor: 'pointer',
                      backgroundColor: 'rgba(125, 163, 238, 0.2)',
                      transform: 'scale(1.1)',
                      boxShadow: '6px 6px 10px 3px rgb(0 0 0 / 80%)',
                    },
                  }}
                >
                  {displayMode === 'default' && (
                    <img
                      src={`${story.image}`}
                      alt={story.title}
                      loading='lazy'
                      style={{
                        borderRadius: '8px',
                        width: '100%',
                        maxHeight: 200,
                        objectFit: 'cover',
                        marginBottom: '0.5rem',
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      fontWeight: 600,
                      marginBottom: '8px',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {story.title}
                  </Box>
                  {story.description && (
                    <div>
                      {displayMode === 'default'
                        ? story.description.slice(0, 100) + '...'
                        : story.description.slice(0, 60) + '...'}
                    </div>
                  )}
                  <span style={{ marginTop: '4px' }}>
                    • {generateDate(story.actualdisplaytime)}
                  </span>
                </Box>
              </Grid>
            ))}
          </GridStyled>
        </div>
        {stories.length > 0 ? (
          <Box display='flex' justifyContent='center' mt={4}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color='primary'
            />
          </Box>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h1>{LanguageConfigItem.noResult}</h1>
          </div>
        )}
      </div>
      <FooterContainer>
        <Footer />
      </FooterContainer>
    </div>
  )
}

export default Section
