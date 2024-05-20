import {useMemo} from 'react'
import {useParams, useSearchParams, useLocation, useNavigate, useMatch} from 'react-router-dom'
import queryString from 'query-string'

const useRouter = () => {
	const [searchParam, setSearchParams] = useSearchParams()
	const params = useParams()
	const location = useLocation()
	const navigate = useNavigate()
	const match = useMatch('')

	return useMemo(() => {
		return {
			navigate: navigate,
			replace: navigate,
			pathname: location.pathname,
			// Merge params and parsed query string into single "query" object
			// so that they can be used interchangeably.
			// Example: /:topic?sort=popular -> { topic: "react", sort: "popular" }
			query: {
				...queryString.parse(location.search), // Convert string to object
				...params
			},
			match,
			location,
			setParams: setSearchParams
		}
	}, [params, match, location, navigate, setSearchParams])
}

export default useRouter
