import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import Bestseller from '../components/Bestseller'
import OurPolicy from '../components/Ourpolicy'
import NewsletterBox from '../components/Newsletterbox'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <Bestseller />
      <OurPolicy />
      <NewsletterBox />
      
    </div>
  )
}

export default Home