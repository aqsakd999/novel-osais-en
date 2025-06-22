import { CircularProgress } from '@mui/material'
import { styled } from 'styled-components'

const FullHeightGrid = styled.div`
  min-height: 98vh;
  max-height: 98vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  background: #a35b5b47;
  height: 100%;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
`
const LoadingText = styled.h2`
  font-family: Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.43;
  letter-spacing: 0.01071em;
  font-weight: bold;
  color: black;
`

const Progress = styled(CircularProgress)`
  &.MuiCircularProgress-colorPrimary {
    color: #e40060;
  }
`

export default function Loading() {
  return (
    <FullHeightGrid>
      <Progress size={60} />
      {/* <LoadingText>Now Loading...</LoadingText> */}
    </FullHeightGrid>
  )
}
