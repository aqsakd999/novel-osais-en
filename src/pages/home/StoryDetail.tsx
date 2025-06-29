import React, { useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
} from '@mui/material'
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Footer,
  FooterContainer,
  generateDate,
  Header,
  LanguageConfigItem,
  Story,
  useSpeechSynthesis,
} from './HomePage'
import { supabase } from '@app/config/supabaseClient'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { InfoOutlined } from '@mui/icons-material'
import CryptoJS from 'crypto-js'
import AdsterraDemo from './Banner'

const Wrapper = styled(Box)`
  max-width: 800px;
  margin: 0 auto;
  color: black;
`

const Title = styled('h1')`
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0 0 12px;
`

const Meta = styled('div')`
  font-size: 0.95rem;
  color: black;
  margin-bottom: 32px;
`

const Description = styled('p')`
  font-size: 1.2rem;
  line-height: 1.8;
  white-space: pre-line;
`

const CenteredBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
`

const StyledCardContent = styled.div`
  padding: 1rem;

  blockquote {
    border-left: 4px solid #555;
    padding-left: 1rem;
    color: #f9fafb;
    font-style: italic;
    background-color: #1f2937;
    margin: 0.5rem 0;
  }

  pre {
    background-color: #374151;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
  }

  code {
    font-family: 'Fira Code', monospace;
    font-size: 0.9rem;
    color: #f9fafb;
  }
`

function decryptAES(encryptedBase64: string) {
  const key = process.env.REACT_APP_DECRYPTED_SECRET_KEY
  const raw = CryptoJS.enc.Base64.parse(encryptedBase64)

  const iv = CryptoJS.lib.WordArray.create(raw.words.slice(0, 4), 16) // 16 bytes = 128 bits
  const ciphertext = CryptoJS.lib.WordArray.create(raw.words.slice(4))

  // @ts-ignore
  const decrypted = CryptoJS.AES.decrypt({ ciphertext }, CryptoJS.SHA256(key), {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })

  return CryptoJS.enc.Utf8.stringify(decrypted)
}

const StoryDetail: React.FC = () => {
  const { selectedVoiceURI, setSelectedVoiceURI, speak, pause } = useSpeechSynthesis()

  const { slug, chapter } = useParams<{ slug: string; chapter: string }>()
  const chapterIndex = Number(chapter)
  const navigate = useNavigate()

  const [totalChapter, setTotalChapter] = useState(0)
  const [id, setId] = useState('')
  const [novelId, setNovelId] = useState('')

  const [allChapterIndexes, setAllChapterIndexes] = useState<number[]>([])

  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [spokenSeconds, setSpokenSeconds] = useState(0)
  const [hasUpvoted, setHasUpvoted] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMobile = useMediaQuery('(max-width: 720px)')

  const fullText = story
    ? `Story ${story.title} begin:\n${story.description}`.replaceAll('.', '. ')
    : ''

  const hasRun = useRef(false)

  // Tăng view trong bảng stories & story_views
  useEffect(() => {
    if (!story) return

    const timer = setTimeout(async () => {
      if (hasRun.current) return
      await supabase.rpc('increment_column', {
        table_name: 'stories',
        id_col: 'id',
        target_id: novelId,
        col_name: 'views',
      })

      // Thêm record vào story_views
      await supabase.rpc('create_story_view', { story_id: novelId })

      // Cập nhật state tại local
      setStory((prev) => (prev ? { ...prev, views: prev.views + 1 } : prev))
      hasRun.current = true
    }, 6000)

    return () => clearTimeout(timer)
  }, [story])

  // Tăng upvote trong bảng stories & story_upvotes

  useEffect(() => {
    if (!slug || !chapterIndex) return

    const fetchChapter = async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('novel_slug', slug)
        .eq('chapter_number', chapterIndex)
        .order('chapter_number', { ascending: true })

      const { data: dataStory, error: errorStory } = await supabase
        .from('stories')
        .select('views, chapter_count')
        .eq('slug', slug)
        .single() // đảm bảo chỉ lấy 1 record, trả về object thay vì array

      if (error || !data?.length || errorStory || !dataStory) {
        console.error('Failed to fetch chapter:', error)
        setLoading(false)

        return
      }

      const chapterData = data[0]
      if (!chapterData) {
        setLoading(false)
        return
      }

      // @ts-ignore
      setStory({
        id: chapterData.id,
        title: `${LanguageConfigItem.chapter} ${chapterData.chapter_number}`,
        description: chapterData.paragraph,
        image: '', // Không cần ảnh
        views: dataStory?.views || 0,
        upvotes: chapterData.upvotes || 0,
        updatedAt: chapterData.updated_at || '',
        actualdisplaytime: chapterData.updated_at || '',
        category: chapterData.category ?? [],
        sub_type: '',
      })
      setId(chapterData.id)
      setNovelId(chapterData.novel_id)
      setTotalChapter(dataStory?.chapter_count)
      const chapterArray = Array.from({ length: dataStory?.chapter_count }, (_, i) => i + 1)

      setAllChapterIndexes(chapterArray)
      setHasUpvoted(localStorage.getItem(`upvoted_${chapterData.id}`) === 'true')
      setLoading(false)
    }

    fetchChapter()
  }, [slug, chapterIndex])

  useEffect(() => {
    const savedVoice = localStorage.getItem('voiceURI')
    const savedProgress = localStorage.getItem(`story-progress-${id}`)

    if (savedVoice) setSelectedVoiceURI(savedVoice)
    if (savedProgress) setSpokenSeconds(parseInt(savedProgress))
  }, [id])

  useEffect(() => {
    if (selectedVoiceURI) {
      localStorage.setItem('voiceURI', selectedVoiceURI)
    }
  }, [selectedVoiceURI])

  useEffect(() => {
    const handleBeforeUnload = () => {
      speechSynthesis.pause()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  useEffect(() => {
    // This triggers on route changes
    return () => {
      speechSynthesis.pause()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [location.pathname])

  useEffect(() => {
    if (spokenSeconds > 0) {
      localStorage.setItem(`story-progress-${id}`, spokenSeconds.toString())
    }
  }, [spokenSeconds])

  if (loading) {
    return (
      <CenteredBox>
        <CircularProgress />
      </CenteredBox>
    )
  }

  if (!story) {
    return (
      <CenteredBox>
        <h2>{LanguageConfigItem.noResult}</h2>
      </CenteredBox>
    )
  }
  const decryptedParagraphText = decryptAES(story.description)

  const navigation = (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        sx={{ width: 'auto' }}
        gap={1}
        mt={2}
        mb={2}
      >
        <Button
          variant='contained'
          onClick={() => {
            navigate(`/novel/${slug}/${chapterIndex - 1}`)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          disabled={chapterIndex <= 1}
        >
          ← Prev
        </Button>
        <Button
          variant='contained'
          onClick={() => navigate(`/novel/${slug}`)}
          style={{ width: '32px !important', minWidth: '32px' }}
        >
          <InfoOutlined />
        </Button>

        <FormControl size='small'>
          <InputLabel size='small'>Chapter</InputLabel>
          <Select
            size='small'
            value={chapterIndex}
            onChange={(e) => {
              navigate(`/novel/${slug}/${e.target.value}`)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            {allChapterIndexes.map((index) => (
              <MenuItem key={index} value={index}>
                {LanguageConfigItem.chapter} {index}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant='contained'
          onClick={() => {
            navigate(`/novel/${slug}/${chapterIndex + 1}`)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          disabled={chapterIndex >= totalChapter}
        >
          Next →
        </Button>
      </Box>
    </div>
  )

  return (
    <>
      <Header />

      <Wrapper>
        <div style={{ padding: '100px 20px 20px 20px', paddingTop: '80px' }}>
          <Box marginTop='24px'>{navigation}</Box>
          <AdsterraDemo showTop={isMobile} />

          <br />
          <Title>{story.title}</Title>
          <Meta>
            • <span>{generateDate(story.actualdisplaytime)}</span>
          </Meta>
          <br />
          {story && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* <FaEye size={20} />
                <span>{story.views}</span> */}

                {/* <button
                  onClick={handleUpvote}
                  style={{
                    backgroundColor: hasUpvoted ? 'gold' : 'transparent',
                    color: 'black',
                    border: '1px solid gray',
                    padding: '4px 8px',
                    borderRadius: 4,
                  }}
                >
                  <FaThumbsUp size={20} />
                  <span style={{ marginLeft: 4 }}>{story.upvotes}</span>
                </button> */}

                {/* <Tooltip title='Download as Text' arrow>
                  <IconButton onClick={() => downloadText(story)}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip> */}
                {/* <div
                  style={{
                    display: 'flex',
                    border: '1px solid gray',
                    borderRadius: '20px',
                    paddingLeft: '8px',
                    paddingRight: '8px',
                  }}
                >
                  <Box>
                    {!isSpeaking ? (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div>
                          <Tooltip title={spokenSeconds == 0 ? 'Start' : 'Resume Speaking'}>
                            <IconButton
                              onClick={() => {
                                spokenSeconds > 0 ? handleResume() : handleSpeak()
                              }}
                              color='primary'
                            >
                              <PlayArrowIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                        {spokenSeconds > 0 && (
                          <Tooltip title={'Start Again'}>
                            <IconButton
                              onClick={() => {
                                spokenSeconds == 0 ? handleResume() : handleSpeak()
                              }}
                              color='primary'
                            >
                              <ReplayIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title='Pause Speaking'>
                          <IconButton onClick={handlePause} color='secondary'>
                            <PauseIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                    )}
                  </Box>
                  {spokenSeconds > 0 && !isSpeaking && (
                    <Box
                      fontSize='0.9rem'
                      color='#aaa'
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      {LanguageConfigItem.listened} {spokenSeconds}s .{' '}
                      {LanguageConfigItem.clickContinue}.
                    </Box>
                  )}
                </div> */}
                {/* <FormControl>
                  <InputLabel id='voice-select-label' size='small'>
                    Voice
                  </InputLabel>
                  <Select
                    labelId='voice-select-label'
                    value={selectedVoiceURI || ''}
                    size='small'
                    onChange={handleVoiceChange}
                    disabled={isSpeaking} // Disable when speaking
                  >
                    {voices.map((voice) => (
                      <MenuItem key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
              </div>
            </div>
          )}

          <br />
          <Description>
            {/* {story.description} */}
            <StyledCardContent>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{decryptedParagraphText}</ReactMarkdown>
            </StyledCardContent>
          </Description>
          {navigation}
        </div>
      </Wrapper>
      <FooterContainer>
        <Footer />
      </FooterContainer>
    </>
  )
}

export default StoryDetail
