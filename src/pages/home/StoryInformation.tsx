import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Footer, FooterContainer, Header, LanguageConfigItem, Story } from './HomePage'
import { supabase } from '@app/config/supabaseClient'
import { Button, Divider, useMediaQuery } from '@mui/material'
import Loading from '@app/components/common/Loading/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AdsterraDemo from './Banner'

const getRandomColor = () => {
  const darkColors = ['#B22222', '#8B008B', '#2E8B57', '#00008B', '#8B4513', '#9932CC']
  return darkColors[Math.floor(Math.random() * darkColors.length)]
}

export default function StoryInformation() {
  const { slug } = useParams<{ slug: string }>()
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasUpvoted, setHasUpvoted] = useState(false)
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 720px)')
  const fontSize = isMobile ? '14px' : '22px'
  useEffect(() => {
    const fetchStory = async () => {
      if (!slug) return
      const { data, error } = await supabase.from('stories').select('*').eq('slug', slug).single()

      if (error) {
        console.error('Failed to fetch story:', error)
      } else {
        const chapters = []
        for (let i = 1; i <= data.chapter_count; i++) {
          chapters.push({ id: `i${i}`, slug: `chapter-${i}`, chapterIndex: i })
        }
        setStory({
          ...data,
          description: data.description.replaceAll('TIME_SKIP', ''),
          chapters: chapters,
        })
        setHasUpvoted(localStorage.getItem(`upvoted_${data.id}`) === 'true')
      }
      setLoading(false)
    }

    fetchStory()
  }, [slug])

  const handleStartReading = () => {
    if (story?.chapters?.length) {
      const firstChapterIndex = story.chapters[0].chapterIndex
      navigate(`/novel/${story.slug}/${firstChapterIndex}`)
    }
  }
  const readingSessionRaw = localStorage.getItem('READING_SESSION')

  const isDisablePreviousReading = useMemo(() => {
    if (!readingSessionRaw || !story) return true
    const session = JSON.parse(readingSessionRaw)
    const lastChapterIndex = session[story.slug]
    return !!lastChapterIndex
  }, [])

  const handleContinueReading = () => {
    if (!readingSessionRaw || !story) return

    try {
      const session = JSON.parse(readingSessionRaw)
      const lastChapterIndex = session[story.slug]
      if (lastChapterIndex) {
        navigate(`/novel/${story.slug}/${lastChapterIndex}`)
      }
    } catch (e) {
      console.error('Invalid READING_SESSION format in localStorage')
    }
  }

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    )
  if (!story) return <div>Story not found.</div>

  return (
    <>
      <Header />

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '90%',
          zIndex: -1,
          backgroundImage: `url(${story.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom', // 👈 căn từ dưới
          filter: 'blur(2px)', // 👈 Optional: làm mờ ảnh nền
        }}
      />

      <div
        style={{
          padding: 20,
          paddingTop: '100px',
          overflow: 'auto',
          fontSize: fontSize,
          paddingLeft: isMobile ? '24px' : '20%',
          paddingRight: isMobile ? '24px' : '20%',
          background: 'rgba(255, 255, 255, 0.8)',
          height: '90vh',
        }}
      >
        <div style={{ display: !isMobile ? 'flex' : 'contents', gap: '40px' }}>
          <div style={{ width: isMobile ? '100%' : '40%' }}>
            <img
              src={`${story.image}`}
              alt={story.title}
              loading='lazy'
              style={{
                width: '100%',
                maxHeight: 400,
                objectFit: 'cover',
                borderRadius: 10,
                marginBottom: isMobile ? '20px' : '0px',
              }}
            />
          </div>
          <div style={{ width: isMobile ? '100%' : '60%' }}>
            <h1 style={{ fontWeight: 'bolder' }}>{story.title}</h1>
            <p>{story.description}</p>

            <p>
              <strong>Published:</strong> {new Date(story.actualdisplaytime).toLocaleDateString()}
            </p>
            <p>
              <strong>Views:</strong> {story.views + 40}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '10px 0' }}>
          {(story.category ?? []).map((cat, idx) => {
            const color = getRandomColor()
            return (
              <div
                key={idx}
                style={{
                  border: `2px solid ${color}`,
                  color,
                  borderRadius: '10px',
                  padding: '4px 10px',
                }}
              >
                {cat.trim()}
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Button
            variant='contained'
            onClick={handleStartReading}
            size='large'
            sx={{
              fontSize: isMobile ? '16px' : '20px',
            }}
          >
            📖 {LanguageConfigItem.startReading}
          </Button>
          &nbsp;
          <Button
            variant='contained'
            onClick={handleContinueReading}
            size='large'
            disabled={isDisablePreviousReading}
            sx={{
              fontSize: isMobile ? '16px' : '20px',
            }}
          >
            {LanguageConfigItem.readingPrevious}
          </Button>
        </div>
        {story?.uploaded_youtube_url && (
          <Button
            variant='contained'
            onClick={handleStartReading}
            size='large'
            sx={{
              fontSize: isMobile ? '16px' : '20px',
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 576 512'
              style={{
                width: '24px',
                color: 'red',
                fill: 'red',
                flexShrink: 0,
              }}
            >
              {' '}
              <path d='M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z' />
            </svg>
            &nbsp; Youtube
          </Button>
        )}
        <AdsterraDemo showTop={false} />
        <h2>{LanguageConfigItem.chapterList}</h2>
        <div
          style={{
            maxHeight: '300px',
            overflowX: 'auto',
            border: '1px solid gray',
            borderRadius: '10px',
            padding: '10px',
          }}
        >
          <div>
            {story.chapters?.map((chapter, index) => (
              <div
                key={chapter.id}
                style={{
                  cursor: 'pointer',
                  color: '#007bff',
                  fontSize: fontSize,
                  backgroundColor: index % 2 == 0 ? '#0000ff2b' : 'transparent',
                }}
                onClick={() => navigate(`/novel/${story.slug}/${chapter.chapterIndex}`)}
              >
                {LanguageConfigItem.chapter} {chapter.chapterIndex}
              </div>
            ))}
          </div>
        </div>
      </div>
      <FooterContainer>
        <Footer />
      </FooterContainer>
    </>
  )
}
