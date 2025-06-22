import TextInput from '@app/components/common/TextInputField/TextInput'
import TextInputPassword from '@app/components/common/TextInputField/TextInputPassword'
import { AppContext } from '@app/config/context'
import { Button } from '@mui/material'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import * as yup from 'yup'
import css from './Login.module.scss'
import { loginByUsernameAndPassword } from '@app/api/login/login-api'
import { setJwtToken, setRefreshToken } from '@app/helpers/TokenStoreUtils'
import { useDispatch, useSelector } from 'react-redux'
import commonStore from '@app/store/commonStore/CommonStore'
import { E00001 } from '@app/common/Messages'
import { yupResolver } from '@hookform/resolvers/yup'
import useSnackbar from '@app/config/useSnackbar'
import { RootState } from '@app/store/store'

export const yupSchema = yup.object({
  username: yup.string().required(E00001(`Username/ UserID`)),
  password: yup.string().required(E00001(`Password`)),
})

type LoginFormProp = {
  username: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()
  const darkMode = useSelector((state: RootState) => state.commonStore.darkMode)

  const [failed, setFailed] = useState<string | null>(null)
  const { saveUser } = useContext(AppContext)
  const dispatch = useDispatch()

  const formMethods = useForm<LoginFormProp>({
    mode: 'onChange',
    defaultValues: { username: '', password: '' },
    resolver: yupResolver(yupSchema),
  })
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = formMethods
  const { snackbarError } = useSnackbar()

  const fetchData = async (username: string, password: string) => {
    dispatch(commonStore.actions.setLoading(true))
    setFailed(null)
    if (username && password) {
      await loginByUsernameAndPassword(username, password)
        .then(({ data }) => {
          const { token, refreshToken, username, id, roles } = data
          saveUser({
            username,
            id,
            roles,
          })
          dispatch(
            commonStore.actions.setUserInfo({
              username,
              id,
              roles,
            }),
          )
          setJwtToken(token)
          setRefreshToken(refreshToken)
          navigate('/')
        })
        .catch((err: any) => {
          const error = err?.response?.data?.message
          if (error) {
            snackbarError(error)
          }
        })
        .finally(() => dispatch(commonStore.actions.setLoading(false)))
    }
    // else {
    //   saveUser({
    //     role: 'admin',
    //   })
    //   setJwtToken('abcabc')
    //   setRefreshToken('abcabc')
    //   navigate('/')
    //   dispatch(commonStore.actions.setLoading(false))
    // }
  }

  const onSubmit = handleSubmit((data: any) => {
    const { username, password }: { username: string; password: string } = data
    if (username && password) {
      fetchData(username, password)
    }
  })

  return (
    <div
      className={css.loginForm}
      style={{
        border: darkMode ? '3px solid white' : '3px solid black',
        borderRadius: '8px',
      }}
    >
      <div className={css.loginTitle}>Login</div>

      <TextInput
        id='username'
        type='text'
        name='username'
        label='Username/ UserID'
        control={control}
        fullWidth
        required
        error={!!errors.username?.message}
        errorMessage={errors.username?.message as string}
      />
      <TextInputPassword
        id='password'
        name='password'
        label='Password'
        control={control}
        fullWidth
        required
        error={!!errors.password?.message}
        errorMessage={errors.password?.message as string}
        style={{ marginTop: '40px' }}
        onEnter={() => onSubmit()}
      />
      <Button
        data-testid='loginButton'
        variant='contained'
        type='submit'
        className={css.submit}
        onClick={onSubmit}
      >
        Login
      </Button>

      <div className={css.center}>
        {failed != null && <span className={css.error}>{failed}</span>}
      </div>
    </div>
  )
}

export default Login
