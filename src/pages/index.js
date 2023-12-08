// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

const Home = () => {
  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    // Redirect user to Home URL
    router.replace('/dashboards/crm')
  }, [router])

  return <Spinner />
}

export default Home
