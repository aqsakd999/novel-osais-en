import React, { useEffect, useRef, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { Carousel as AntdCarousel } from 'antd'
import 'antd/dist/reset.css'
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Toolbar,
  IconButton,
  Menu,
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  useMediaQuery,
} from '@mui/material'
import { RootState } from '@app/store/store'
import { useSelector } from 'react-redux'
import { ColorTokens, Loading as LoadingState } from '@app/store/commonStore/CommonStore'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '@app/config/supabaseClient'
import { setImageUrl } from './Section'
import { LabelAndValue } from '@app/common/type'
import SearchIcon from '@mui/icons-material/Search'
import Loading from '@app/components/common/Loading/Loading'
import YouTubeIcon from '@mui/icons-material/YouTube'

export type Chapter = {
  id: string
  slug: string
  chapterIndex: number
  paragraph: string
}

export type Story = {
  id: string
  uploaded_youtube_url: string
  image: string
  title: string
  sub_type: string
  description: string
  author: string
  category: string[]
  updatedAt: number
  actualdisplaytime: Date
  views: number
  upvotes: number

  slug: string
  chapters: Chapter[]
}

const GlobalStyle = createGlobalStyle`
  body {
    scrollbar-color: rgba(100, 95, 95, 0.8) transparent;
    scrollbar-width: thin;
  }
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgba(206, 187, 187, 0.74);
    border-radius: 4px;
  }
`

const LANGUAGE_CONFIGS = {
  reddit: {
    menu: [
      { name: 'Home' },
      { name: 'Just Updated', tooltip: 'Stories just been updated', value: 'new' },
      { name: 'Youtube', tooltip: 'Stories with youtube audio', value: 'youtube' },
      { name: '🏷️ Tags', value: 'tags' },
    ],
    tags: [
      { label: 'tag1', value: 'tag1' },
      { label: 'tag2', value: 'tag2' },
      { label: 'tag3', value: 'tag3' },
      { label: 'tag4', value: 'tag4' },
      { label: 'tag5', value: 'tag5' },
      { label: 'tag6', value: 'tag6' },
      { label: 'tag7', value: 'tag7' },
      { label: 'tag8', value: 'tag8' },
      { label: 'tag9', value: 'tag9' },
      { label: 'tag10', value: 'tag10' },
      { label: 'tag11', value: 'tag11' },
      { label: 'tag12', value: 'tag12' },
      { label: 'tag13', value: 'tag13' },
      { label: 'tag14', value: 'tag14' },
      { label: 'tag15', value: 'tag15' },
    ],
    footer: '© 2025 HorrorVerse. All rights reserved.',
    expandTagSearch: '🔽 Expand tags search',
    closeTagSearch: '🔼 Close tags search',
    viewMore: 'View More',
    viewYoutube: 'View Youtube',
    viewMost: 'Most Viewed',
    timeRange: 'Time Range',
    allTime: 'All time',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    searchPostLabel: 'Search posts by name',
    noResult: 'No result found',
    startReading: 'Start Reading',
    readingPrevious: 'Read from Previous',
    chapterList: 'Chapters',
    chapter: 'Chapter',
    listened: 'You listened for',
    clickContinue: 'Click ▶️ to continue',
  },
}
export const DATA_SOURCE = process.env.REACT_APP_DATA_SOURCE || 'reddit'

// @ts-ignore
export const LanguageConfigItem: any = LANGUAGE_CONFIGS[DATA_SOURCE]

export const Footer = () => <div>{LanguageConfigItem.footer}</div>

export const MENU_ITEMS: any[] = LanguageConfigItem.menu

export const TAGS: LabelAndValue[] = LanguageConfigItem.tags
export const VIEW_MORE: string = LanguageConfigItem.viewMore
export const VIEW_YOUTUBE: string = LanguageConfigItem.viewYoutube
export const VIEW_MOST: string = LanguageConfigItem.viewMost
export const TIME_RANGE: string = LanguageConfigItem.timeRange
export const ALL_TIME: string = LanguageConfigItem.allTime
export const THIS_WEEK: string = LanguageConfigItem.thisWeek
export const THIS_MONTH: string = LanguageConfigItem.thisMonth
export const TODAY: string = LanguageConfigItem.today

const PageContainer = styled.div`
  min-height: 100vh;
`

const MainContent = styled.main`
  flex-direction: row;
  padding: 2rem 1rem;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    padding-left: 0px;
    padding-right: 0px;
  }
`

const SectionContainer = styled.section`
  width: 96%;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    flex: 0 0 100%;
    margin-bottom: 1rem;
    width: 100%;
  }
`

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #f39c12, #f1c40f, #f39c12);
  background-size: 200% auto;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  animation: shine 3s linear infinite;

  @keyframes shine {
    0% {
      background-position: 200% center;
    }
    100% {
      background-position: -200% center;
    }
  }
`

const SectionList = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  color: black;
  scrollbar-height: auto;
  scrollbar-width: thin;
  height: 500px;
  padding: 25px;
  /* Force scrollbar to show on WebKit browsers */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgb(124, 111, 111);
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(0, 0, 0);
    border-radius: 4px;
  }
`

const StoryCard = styled(Box)`
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem;
  font-size: 16px;
  border-radius: 0.75rem;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.34);
  height: 400px;
  min-width: 300px;
  overflow-x: auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    cursor: pointer;
    background-color: rgb(206, 203, 203); /* lighter on hover */
    transform: scale(1.1) rotateZ(1deg);
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.6);
    animation: wobble 0.6s ease-in-out;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    height: 300px;
    min-width: 200px;
  }

  @keyframes wobble {
    0%,
    100% {
      transform: scale(1.1) rotateZ(0deg);
    }
    25% {
      transform: scale(1.12) rotateZ(1deg);
    }
    75% {
      transform: scale(1.08) rotateZ(-1deg);
    }
  }

  @media (max-width: 768px) {
    /* Chống phóng quá lớn trên mobile */
    &:hover {
      transform: scale(1.1) rotateZ(0.5deg);
      animation: wobble-mobile 0.6s ease-in-out;
    }
  }
  @keyframes wobble-mobile {
    0%,
    100% {
      transform: scale(1.1) rotateZ(0deg);
    }
    25% {
      transform: scale(1.12) rotateZ(0.5deg);
    }
    75% {
      transform: scale(1.08) rotateZ(-0.5deg);
    }
  }
`

const StoryImage = styled.img`
  border-radius: 0.5rem;
  width: 100%;
  max-height: 200px;
  height: 80%;
  object-fit: cover;
  margin-bottom: 0.5rem;
  object-position: top;
  @media (max-width: 768px) {
    height: 50%;
  }
`

const SidebarContainer = styled.aside`
  flex: 0 0 25%;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.58);
  overflow-y: auto;
  backdrop-filter: blur(4px);
  border-radius: 10px;
  font-size: 16px;

  @media (max-width: 768px) {
    flex: 0 0 95%;
    margin-top: 2rem;
    font-size: 12px;
  }
`

export const FooterContainer = styled.footer`
  padding: 1rem;
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #ccc;
  background-color: rgba(0, 0, 0, 0.7);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  bottom: 0;
  width: 100vw;
`

const Background = styled.div<{ darkMode?: boolean; colorTokens: ColorTokens }>`
  min-height: 100vh;
  color: ${(props) => props.colorTokens?.grey[100]};

  .main-item {
    display: flex;

    @media (max-width: 768px) {
      display: block;
    }

    .left-item {
      width: 75%;
      padding-left: 8px;
      padding-right: 8px;
      @media (max-width: 768px) {
        width: 100%;
      }
    }
  }
`

const ViewMoreButton = styled(Button)`
  display: none;

  @media (min-width: 768px) {
    color: white;
    transition: 0.3s;

    &:hover {
      background-color: yellow;
      color: black;
    }
  }
`

const MobileViewMoreText = styled(Button)`
  display: none;

  @media (max-width: 767px) {
    display: block;
    font-weight: bold;
    text-decoration: underline;
    color: white;
  }
`

const AntdCarouselStyled = styled(AntdCarousel)`
  border-radius: 0px;
  .slick-slide img {
    height: 60vh;
    object-fit: cover;
    width: 100%;
  }
  .slick-dots li button {
    background-color: white;
  }

  .carousle-item {
    width: 500px;
    color: white;

    font-size: 16px;
    .car-item-title {
      font-size: 1.2rem;
      font-weight: bold;
      color: white;
    }

    @media (max-width: 768px) {
      width: calc(80vw - 20px);
      max-width: calc(80vw - 20px);
      .car-item-desc {
        display: none;
        color: white;
      }
      .car-item-title {
        color: white;
        font-size: 16px;
      }
      font-size: 14px;
    }
  }
`

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = speechSynthesis.getVoices()
      const enVoices = allVoices.filter((v) => v.lang.startsWith('en') && v.localService)
      setVoices(enVoices)
      if (!selectedVoiceURI && enVoices.length > 0) {
        setSelectedVoiceURI(enVoices[0].voiceURI)
      }
    }

    speechSynthesis.onvoiceschanged = loadVoices
    loadVoices()
  }, [])

  const speak = (text: string, key?: string) => {
    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    const voice = voices.find((v) => v.voiceURI === selectedVoiceURI)
    if (voice) utterance.voice = voice
    if (key) {
      const oldVal = Number(localStorage.getItem(key))

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const charIndex = event.charIndex
          const spokenSubstring = text.substring(0, charIndex)
          const wordIndex = spokenSubstring.trim().split(/\s+/).length

          localStorage.setItem(key, (oldVal + wordIndex).toString())
        }
      }
    }

    utteranceRef.current = utterance
    speechSynthesis.speak(utterance)
  }

  const pause = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause()
    }
  }

  const resume = () => {
    if (speechSynthesis.paused) {
      // Change voice before resuming
      const current = utteranceRef.current
      const newVoice = voices.find((v) => v.voiceURI === selectedVoiceURI)
      if (current && newVoice) {
        current.voice = newVoice
      }
      speechSynthesis.resume()
    }
  }

  return {
    voices,
    selectedVoiceURI,
    setSelectedVoiceURI,
    speak,
    pause,
    resume,
  }
}

export const generateDate = (date: Date) => {
  if (date) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })

    return formattedDate
  }
  return ''
}

const MUI_Carousel = ({ dataList }: { dataList: Story[] }) => {
  const navigate = useNavigate()
  const { darkMode } = useSelector((state: RootState) => state.commonStore)
  const isMobile = useMediaQuery('(max-width: 720px)')

  return (
    <AntdCarouselStyled autoplay pauseOnDotsHover dotPosition='bottom' pauseOnFocus pauseOnHover>
      {dataList.map((item) => (
        <div key={item.id} style={{ position: 'relative', height: '600px', width: '100%' }}>
          <img
            src={
              item.uploaded_youtube_url
                ? `https://img.youtube.com/vi/${item.uploaded_youtube_url}/maxresdefault.jpg`
                : item.image
            }
            alt={item.title.substring(0, 10) + '...'}
            style={{
              objectFit: 'cover',
            }}
            onError={(e) => {
              // @ts-ignore
              e.target.onerror = null // tránh lặp vô hạn nếu fallback cũng lỗi
              // @ts-ignore
              e.target.src = item.image
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              className='carousle-item'
              style={{
                color: darkMode ? 'white' : 'black',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: '20px',
                marginBottom: '20px',
                marginLeft: '20px',
                borderRadius: '8px',
                maxWidth: '80%',
              }}
            >
              <h2 className='car-item-title' style={{ marginBottom: '0.5rem' }}>
                {item.title.length > 30 ? item.title.substring(0, 30) + '...' : item.title}
              </h2>
              <p className='car-item-desc' style={{ marginBottom: '0.5rem', color: 'white' }}>
                {item.description.length > 200
                  ? item.description.substring(0, 200) + '...'
                  : item.description}
              </p>
              <p style={{ color: 'white' }}> • {generateDate(item.actualdisplaytime)}</p>
              {!isMobile ? (
                <ViewMoreButton variant='contained' onClick={() => navigate(`/novel/${item.slug}`)}>
                  {VIEW_MORE}
                </ViewMoreButton>
              ) : (
                <MobileViewMoreText
                  variant='contained'
                  onClick={() => navigate(`/novel/${item.slug}`)}
                >
                  {VIEW_MORE}
                </MobileViewMoreText>
              )}
              {!isMobile && <> &nbsp;</>}
              {!!item.uploaded_youtube_url && (
                <>
                  {!isMobile ? (
                    <>
                      <ViewMoreButton
                        variant='contained'
                        onClick={() =>
                          window.open(
                            `https://www.youtube.com/watch?v=${item.uploaded_youtube_url}`,
                            '_blank',
                          )
                        }
                        style={{ paddingTop: '6px' }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <YouTubeIcon /> &nbsp; {VIEW_YOUTUBE}
                        </div>
                      </ViewMoreButton>
                    </>
                  ) : (
                    <MobileViewMoreText
                      variant='contained'
                      onClick={() => console.log('go to youtube')}
                    >
                      <div
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <YouTubeIcon /> &nbsp; {VIEW_YOUTUBE}
                      </div>
                    </MobileViewMoreText>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </AntdCarouselStyled>
  )
}

const Section = ({ title, dataList }: { title: string; dataList: Story[] }) => {
  const items = dataList
  const navigate = useNavigate()
  const { darkMode } = useSelector((state: RootState) => state.commonStore)

  return (
    <SectionContainer>
      <SectionTitle
        style={{
          color: darkMode ? 'cornsilk' : 'black',
        }}
      >
        {title}
      </SectionTitle>
      <SectionList>
        {items.map((item) => (
          <StoryCard
            onClick={() => navigate(`/novel/${item.slug}`)}
            key={item.id}
            sx={{
              '&:hover': {
                background: ' rgba(143, 189, 224, 0.3)',
                h4: {
                  textDecoration: 'underline',
                },
              },
            }}
          >
            <StoryImage
              src={`${item.image}`}
              alt={item.title.substring(0, 10) + '...'}
              loading='lazy'
            />
            <h4 style={{ fontWeight: 'bold' }}>{item.title}</h4>
            <p style={{ color: 'black' }}>
              {item.description.length > 100
                ? item.description.substring(0, 80) + '...'
                : item.description}
            </p>
          </StoryCard>
        ))}
      </SectionList>
    </SectionContainer>
  )
}

const Sidebar = () => {
  const [timeRange, setTimeRange] = useState<'all' | 'day' | 'week' | 'month'>('day')
  const navigate = useNavigate()
  const [mostViewedData, setMostViewedData] = useState<Story[]>([])
  const { darkMode } = useSelector((state: RootState) => state.commonStore)

  const fetchMostViewed = async (range: 'day' | 'week' | 'month' | 'all') => {
    const fromDate = getViewedTimeRange(range) || new Date(0).toISOString()

    const { data, error } = await supabase.rpc('get_most_viewed_stories', {
      from_date: fromDate,
      limit_count: 5,
      type: null,
    })

    if (error) console.error('Error fetchMostViewed:', error)
    else setMostViewedData(data || [])
  }

  useEffect(() => {
    fetchMostViewed(timeRange)
  }, [])

  return (
    <SidebarContainer>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{VIEW_MOST}</h3>

      <FormControl
        fullWidth
        sx={{
          marginBottom: '0.5rem',
          '& .MuiInputBase-root': {
            border: darkMode ? '1px solid white' : '1px solid black',
          },
        }}
      >
        <InputLabel size='small'>{TIME_RANGE}</InputLabel>
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as 'day' | 'week' | 'month')}
          label={TIME_RANGE}
          size='small'
        >
          <MenuItem value='all'>{ALL_TIME}</MenuItem>
          <MenuItem value='day'>{TODAY}</MenuItem>
          <MenuItem value='week'>{THIS_WEEK}</MenuItem>
          <MenuItem value='month'>{THIS_MONTH}</MenuItem>
        </Select>
      </FormControl>

      <div>
        {mostViewedData.map((post) => (
          <div key={post.id} style={{ marginBottom: '0.5rem' }}>
            <div
              onClick={() => navigate(`/novel/${post.slug}`)}
              style={{
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'text-decoration 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              - {post.title}
            </div>
            <p style={{ color: '#999' }}>{post.description.substring(0, 100) + '...'}</p>
            <span style={{ color: '#999' }}>by {post.author}</span>
          </div>
        ))}
      </div>
    </SidebarContainer>
  )
}

const getViewedTimeRange = (range: 'day' | 'week' | 'month' | 'all') => {
  const now = Date.now()
  switch (range) {
    case 'day':
      return new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString()
    case 'week':
      return new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString()
    case 'month':
      return new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString()
    case 'all':
    default:
      return null
  }
}

export const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null) // State for the menu anchor
  const navigate = useNavigate() // Hook to navigate to different routes

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget) // Set the anchor element for the menu
  }

  const handleMenuClose = () => {
    setAnchorEl(null) // Close the menu
  }

  const handleMenuItemClick = (url: string) => {
    navigate(url) // Navigate to the selected URL
    handleMenuClose() // Close the menu after navigating
  }

  const [anchorTagEl, setAnchorTagEl] = useState(null)

  const handleMenuTagItemClick = (item: any, event: any) => {
    if (!item.value) {
      navigate('/')
    } else if (item.value === 'tags') {
      setAnchorTagEl(event.currentTarget)
    } else {
      navigate(`/search?type=${item.value}`)
    }
  }

  const handleTagClick = (tag: LabelAndValue) => {
    navigate(`/search?category=${tag.value}`)
    setAnchorTagEl(null)
  }

  const handleClose = () => {
    setAnchorTagEl(null)
  }

  const location = useLocation()
  const [searchText, setSearchText] = useState('')

  // Xử lý submit tìm kiếm
  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      navigate(`/search?category=tag8&name=${encodeURIComponent(searchText.trim())}`)
    }
  }

  return (
    <Box
      position='sticky'
      sx={{
        backgroundColor: '#ffffff66',
        backgroundImage: 'none',
        zIndex: 9999,
        position: 'absolute',
        width: '100%',
        height: '50px',
        borderBottom: '1px solid gray',
        display: 'flex',
        alignContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignContent: 'center',
          flexDirection: 'row',
          width: '100%',
          height: '100%',
        }}
      >
        <IconButton
          size='large'
          edge='end'
          color='inherit'
          aria-label='menu'
          onClick={handleMenuOpen}
          sx={{ display: { xs: 'block', md: 'none' } }} // Show the menu button on mobile
        >
          ☰{' '}
        </IconButton>
        {/* Menu items for desktop view */}

        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexGrow: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignContent: 'center',
            }}
          >
            {MENU_ITEMS.map((item, index) => (
              <Button
                key={index}
                onClick={(ev) => handleMenuTagItemClick(item, ev)}
                variant='text'
                sx={{ marginLeft: 2 }}
                title={item.tooltip}
              >
                {item.name}
              </Button>
            ))}
          </div>
          {location.pathname === '/' && (
            <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2, width: 300 }}>
              <TextField
                label={LanguageConfigItem.searchPostLabel}
                variant='outlined'
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchSubmit()
                }}
                size='small'
                fullWidth
              />
              <IconButton color='primary' onClick={handleSearchSubmit} sx={{ ml: 1 }}>
                <SearchIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Tag Menu (Grid) */}
        <Menu
          anchorEl={anchorTagEl}
          open={Boolean(anchorTagEl)}
          onClose={handleClose}
          sx={{ mt: 1 }}
        >
          <Box sx={{ px: 2, py: 1, width: '600px' }}>
            <Grid container spacing={1} sx={{ width: '100%' }}>
              {TAGS.map((tag, index) => (
                <Grid item xs={2} key={index}>
                  <Typography
                    onClick={() => handleTagClick(tag)}
                    onMouseOver={(e) => {
                      // @ts-ignore
                      e.target.style.fontWeight = 'bold'
                      // @ts-ignore
                      e.target.style.textDecoration = 'underline'
                    }}
                    onMouseOut={(e) => {
                      // @ts-ignore
                      e.target.style.fontWeight = 'normal'
                      // @ts-ignore
                      e.target.style.textDecoration = 'none'
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    {tag.label}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Menu>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          {MENU_ITEMS.map((item, index) => (
            <MenuItem
              key={index}
              onClick={(ev) => {
                if (item.value) handleMenuTagItemClick(item, ev)
                else navigate('/')
              }}
            >
              {item.name}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </Box>
  )
}

export default function Home() {
  const { darkMode, colorTokens } = useSelector((state: RootState) => state.commonStore)

  const [carouselData, setCarouselData] = useState<Story[]>([])
  const [randomPostData, setRandomPostData] = useState<Story[]>([])
  const [sectionMenuData, setSectionMenuData] = useState<Story[]>([])

  const [loading, setLoading] = useState<LoadingState>('NotLoad')

  const fetchSectionMenu = async () => {
    let all: Story[] = []

    for (const item of MENU_ITEMS) {
      if (item.value !== 'new' && item.value !== 'youtube') continue

      let query = supabase
        .from('stories')
        .select('*')
        .order('last_post_youtube_full', { ascending: false })
        .limit(8)

      if (item.value === 'youtube') {
        query = query.not('last_post_youtube_full', 'is', null)
      }

      const { data, error } = await query

      if (error) {
        console.error(`Error fetching category ${item.value}:`, error)
      } else if (data) {
        // Gán sub_type cho mỗi item
        const taggedData = data.map((story) => ({
          ...story,
          sub_type: item.value,
        }))

        all = [...all, ...taggedData]
      }
    }

    setSectionMenuData(all)
  }

  useEffect(() => {
    const fetchCarousel = async () => {
      const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

      const { data, error } = await supabase.rpc('get_top_upvoted_stories', {
        from_date: fromDate,
        limit_count: 5,
        type: null,
      })

      let finalData = data || []

      if (data.length < 10 && !error) {
        let query = supabase.from('stories').select('*')

        // Only add the .not('id', 'in', ...) clause if data is not empty
        if (data.length > 0) {
          const idList = data.map((s: any) => s.id).join(',') // <-- convert to comma-separated string
          query = query.not('id', 'in', `(${idList})`)
        }

        const { data: fallbackData, error: fallbackError } = await query
          .order('upvotes', { ascending: false })
          .order('updated_at', { ascending: false })
          .limit(10 - data.length)
        if (fallbackError) {
          console.error('Error fetchCarousel (fallback):', fallbackError)
        } else {
          finalData = [...finalData, ...(fallbackData || [])]
        }
      }

      if (error) console.error('Error fetchCarousel:', error)
      else setCarouselData(finalData || [])
    }

    const fetchNewPosts = async () => {
      const itemsPerPage = 8
      const startPage = 1
      const endPage = 20
      const randomPage = Math.floor(Math.random() * (endPage - startPage + 1)) + startPage
      const from = (randomPage - 1) * itemsPerPage
      const to = from + itemsPerPage - 1

      const { data: newPosts, error } = await supabase
        .from('stories')
        .select('*')
        .order('views', { ascending: false })
        .range(from, to)

      if (error) console.error(`Error fetching fetchNewPosts`, error)
      setRandomPostData(newPosts || [])
    }

    fetchCarousel()
    fetchNewPosts()
    fetchSectionMenu()
    setLoading('Loaded')
  }, [])

  if (loading !== 'Loaded')
    return (
      <div>
        <Loading />
      </div>
    )

  return (
    <Background darkMode={darkMode} colorTokens={colorTokens} style={{}}>
      <GlobalStyle />
      <PageContainer
        style={{
          background: darkMode
            ? `linear-gradient(to bottom, #0e1113, ${colorTokens?.grey[900]})`
            : `linear-gradient(to bottom, white, ${colorTokens?.grey[800]})`,
          color: darkMode ? 'white' : 'black',
        }}
      >
        <Header />

        <MUI_Carousel dataList={carouselData} />

        <MainContent>
          <div className='main-item'>
            <div className='left-item'>
              {[
                ...MENU_ITEMS.filter((i) => i.name !== 'Home' && i.value !== 'tags'),
                { name: 'Random' },
              ].map((section) => (
                <Section
                  key={section.name}
                  title={section.name}
                  dataList={
                    section.name === 'Random'
                      ? randomPostData
                      : sectionMenuData.filter((it) => it.sub_type === section.value)
                  }
                />
              ))}
            </div>
            <Sidebar />
          </div>
        </MainContent>

        <FooterContainer>
          <Footer />
        </FooterContainer>
      </PageContainer>
    </Background>
  )
}
