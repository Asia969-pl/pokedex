import { createContext, useState, useEffect } from 'react'


export const LoginContext = createContext(null)

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState(null)



  useEffect(() => {
    const loggedIn = localStorage.getItem('userIsLoggedIn') === 'true'
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser); 
      setUser(parsedUser)
    }
    setLoggedIn(loggedIn)
  }, [])

  const login = (userData) => {
    setUser(userData)
    setLoggedIn(true)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('userIsLoggedIn', 'true')
  }


  const logout = () => {
    setUser(null)
    setLoggedIn(false)
    localStorage.removeItem('user')
    localStorage.setItem('userIsLoggedIn', 'false')
  }

  return (
    <LoginContext.Provider value={{ isLoggedIn, user, login, logout, setUser }}>
      {children}
    </LoginContext.Provider>
  )
}
