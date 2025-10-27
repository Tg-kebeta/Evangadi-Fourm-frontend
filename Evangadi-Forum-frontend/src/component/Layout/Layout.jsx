import React from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'

function Layout({children}) {
  return (
    <div>
        <Header/>
        <main style={{ minHeight: '60vh', padding: '0 0' }}>
          {children}
        </main>
        <Footer/>
    </div>
  )
}

export default Layout